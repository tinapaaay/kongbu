import type { LearnerData } from '../domain/learnerData'
import { SaveError, type LearnerRepository } from '../data/LearnerRepository'
import type { StorageLike } from '../data/storage'

export interface SyncTransport {
  /** Upload is insert-only. Duplicate IDs must keep the first payload and receipt. */
  exchange(userId: string, pending: LearnerData): Promise<LearnerData>
}
export interface SyncStatus {
  state: 'signed-out' | 'syncing' | 'synced' | 'offline' | 'error'
  pending: number
  message?: string
}
const OWNER_KEY = 'kongbu:sync-owner'
const count = (data: LearnerData) => data.attempts.length + data.sessions.length + data.visitRecords.length
function pendingData(data: LearnerData): LearnerData {
  return {
    ...data,
    activeSession: null,
    attempts: data.attempts.filter((r) => !r.serverReceivedAt),
    sessions: data.sessions.filter((r) => !r.serverReceivedAt),
    visitRecords: data.visitRecords.filter((r) => !r.serverReceivedAt),
  }
}

/** The records without server receipts ARE the durable queue. No second copy can get out of step. */
export function createSyncRepository(local: LearnerRepository, transport: SyncTransport, storage: StorageLike | null) {
  let userId: string | null = null
  let generation = 0
  let running: Promise<void> | null = null
  let requested = false
  let status: SyncStatus = { state: 'signed-out', pending: 0 }
  const statusListeners = new Set<() => void>()
  const dataListeners = new Set<(data: LearnerData) => void>()
  const emit = (next: SyncStatus) => { status = next; statusListeners.forEach((listener) => listener()) }
  const publish = (data: LearnerData) => dataListeners.forEach((listener) => listener(data))

  async function sync() {
    requested = true
    if (running) return running
    running = (async () => {
      while (requested && userId) {
        requested = false
        const owner = userId
        const turn = generation
        try {
          // Binding prevents another account receiving the previous learner's local history.
          // Storage must be durable before anything is uploaded.
          if (!storage) throw new Error('Sync needs browser storage. Your progress is available for this visit.')
          const bound = storage.getItem(OWNER_KEY)
          if (bound && bound !== owner) throw new Error('This browser belongs to another learner. Sign out and use a separate browser profile for another account.')
          const loaded = await local.load()
          if (turn !== generation || owner !== userId) return
          if (loaded.problem) throw new Error('Resolve the saved-progress warning before syncing.')
          storage.setItem(OWNER_KEY, owner)
          const pending = pendingData(loaded.data)
          if (typeof navigator !== 'undefined' && !navigator.onLine) {
            emit({ state: 'offline', pending: count(pending), message: 'Offline. Progress stays on this device and will sync when you reconnect.' })
            requested = false
            break
          }
          emit({ state: 'syncing', pending: count(pending) })
          const remote = await transport.exchange(owner, pending)
          if (turn !== generation || owner !== userId) return
          const next = await local.mergeRecords({ ...remote, activeSession: null })
          publish(next)
          const remaining = count(pendingData(next))
          emit({ state: remaining ? 'syncing' : 'synced', pending: remaining })
          const missingReceipt = (['attempts', 'sessions', 'visitRecords'] as const).some((key) => {
            const waiting = new Set(next[key].filter((record) => !record.serverReceivedAt).map((record) => record.id))
            return pending[key].some((record) => waiting.has(record.id))
          })
          if (missingReceipt) throw new Error('Some progress was not acknowledged. Try Sync now again.')
          // Includes any records created while the network request was in flight.
          if (remaining) requested = true
        } catch (error) {
          if (turn !== generation) return
          const offline = typeof navigator !== 'undefined' && !navigator.onLine
          emit({ ...status, state: offline ? 'offline' : 'error', message: offline
            ? 'Offline. Progress stays on this device and will sync when you reconnect.'
            : error instanceof Error ? error.message : 'Could not sync. Your progress is safe on this device.' })
          requested = false
        }
      }
    })().finally(() => {
      running = null
      // A new auth session may arrive while an old request is finishing.
      if (requested && userId) void sync()
    })
    return running
  }

  async function change(action: () => Promise<LearnerData>) {
    try {
      const data = await action()
      publish(data)
      if (userId) void sync()
      else emit({ state: 'signed-out', pending: count(pendingData(data)) })
      return data
    } catch (error) {
      if (error instanceof SaveError) publish(error.data)
      throw error
    }
  }

  const repository: LearnerRepository = {
    load: () => local.load(),
    watch(listener) {
      dataListeners.add(listener)
      const stop = local.watch((data) => { listener(data); if (userId) void sync() })
      return () => { dataListeners.delete(listener); stop() }
    },
    recordChapterVisit: (...args) => change(() => local.recordChapterVisit(...args)),
    saveActiveSession: (...args) => change(() => local.saveActiveSession(...args)),
    submitSession: (...args) => change(() => local.submitSession(...args)),
    markBackedUp: (...args) => change(() => local.markBackedUp(...args)),
    mergeRecords: (...args) => change(() => local.mergeRecords(...args)),
  }
  return {
    repository, sync,
    setUser(id: string | null) {
      if (id === userId) return
      userId = id
      generation++
      if (id) void sync()
      else { requested = false; emit({ state: 'signed-out', pending: status.pending }) }
    },
    getStatus: () => status,
    subscribe(listener: () => void) { statusListeners.add(listener); return () => { statusListeners.delete(listener) } },
  }
}
export type SyncController = ReturnType<typeof createSyncRepository>
