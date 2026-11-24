import type { LearnerData } from '../domain/learnerData'
import { SaveError, type LearnerRepository } from '../data/LearnerRepository'
import type { StorageLike } from '../data/storage'

/** What the cloud returned, plus how many stored rows this app version couldn't read. */
export type ExchangeResult = LearnerData & { skipped?: number }
export type RecordKey = 'sessions' | 'attempts' | 'visitRecords'
/** Per kind of record: download only rows the server received at or after this time. Missing means everything. */
export type SyncCursor = Partial<Record<RecordKey, string>>
export interface SyncTransport {
  /**
   * Upload is insert-only. Duplicate IDs must keep the first payload and receipt.
   * Returns the rows received since `since`, plus every record in `pending` (with its receipt).
   */
  exchange(userId: string, pending: LearnerData, since?: SyncCursor): Promise<ExchangeResult>
}
export interface SyncStatus {
  state: 'signed-out' | 'syncing' | 'synced' | 'offline' | 'error'
  pending: number
  message?: string
}
export const OWNER_KEY = 'kongbu:sync-owner'
/**
 * The server stamps a row when it is inserted, but the row becomes visible a moment later, when it is saved
 * for good. Re-reading the last 10 minutes means a row stamped just before the previous download still arrives.
 * Rows already on this device are combined by ID, so reading one twice is harmless.
 */
const CURSOR_OVERLAP_MS = 10 * 60_000
const RECORD_KEYS: RecordKey[] = ['sessions', 'attempts', 'visitRecords']

/** Where to start the next download: the newest server receipt on this device, minus the overlap. */
export function syncCursor(data: LearnerData): SyncCursor {
  const cursor: SyncCursor = {}
  for (const key of RECORD_KEYS) {
    let newest = ''
    for (const record of data[key]) if (record.serverReceivedAt && record.serverReceivedAt > newest) newest = record.serverReceivedAt
    if (newest) cursor[key] = new Date(Date.parse(newest) - CURSOR_OVERLAP_MS).toISOString()
  }
  return cursor
}
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
          const { skipped = 0, ...remote } = await transport.exchange(owner, pending, syncCursor(loaded.data))
          if (turn !== generation || owner !== userId) return
          const next = await local.mergeRecords({ ...remote, activeSession: null })
          publish(next)
          const remaining = count(pendingData(next))
          // Unreadable cloud rows are skipped, never fatal: rows are immutable, so failing on them
          // would block this learner's sync for good. Everything else still syncs.
          emit({ state: remaining ? 'syncing' : 'synced', pending: remaining, ...(skipped ? {
            message: `${skipped} saved ${skipped === 1 ? 'record' : 'records'} from another app version couldn't be read and ${skipped === 1 ? 'was' : 'were'} skipped. Everything else is synced.`,
          } : {}) })
          const missingReceipt = RECORD_KEYS.some((key) => {
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
    forgetAll: () => change(() => local.forgetAll()),
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
    /**
     * Clears this device after sign-out (important on a shared computer): every saved record, and which
     * account the browser belonged to, so the next learner can sign in with their own account.
     */
    async forgetDevice() {
      if (userId) throw new Error('Sign out before forgetting this device’s progress.')
      await repository.forgetAll()
      storage?.removeItem(OWNER_KEY)
      emit({ state: 'signed-out', pending: 0 })
    },
    getStatus: () => status,
    subscribe(listener: () => void) { statusListeners.add(listener); return () => { statusListeners.delete(listener) } },
  }
}
export type SyncController = ReturnType<typeof createSyncRepository>
