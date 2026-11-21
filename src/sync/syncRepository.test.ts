import { describe, expect, it, vi } from 'vitest'
import { emptyLearnerData, type LearnerData } from '../domain/learnerData'
import { makeAttempt, makeSession } from '../domain/testFixtures'
import { createLocalStorageRepository } from '../data/localStorageRepository'
import { MemoryStorage } from '../data/storage'
import { mergeLearnerData } from '../data/mergeLearnerData'
import { createSyncRepository, type SyncTransport } from './syncRepository'

function server() {
  const users = new Map<string, LearnerData>()
  let offline = false
  const exchange = vi.fn<SyncTransport['exchange']>(async (user, pending) => {
    if (offline) throw new Error('Network unavailable')
    const stamp = <T,>(r: T) => ({ ...r, serverReceivedAt: new Date().toISOString() })
    const remote = mergeLearnerData(users.get(user) ?? emptyLearnerData(), {
      ...pending, activeSession: null,
      attempts: pending.attempts.map(stamp), sessions: pending.sessions.map(stamp), visitRecords: pending.visitRecords.map(stamp),
    })
    users.set(user, remote)
    return remote
  })
  return { exchange, users, offline(value: boolean) { offline = value } }
}
function device(transport: SyncTransport, storage = new MemoryStorage()) {
  return { storage, ...createSyncRepository(createLocalStorageRepository(storage), transport, storage) }
}
const session = (id: string) => makeSession({ id, correctCount: 1, totalCount: 1 })
const attempt = (id: string) => makeAttempt({ id: `a-${id}`, sessionId: id, questionId: 'ch11-q001', isCorrect: true })
const active = (id: string) => ({ ...session(id), answers: {}, durationsMs: {}, currentIndex: 0 })

describe('durable sync queue', () => {
  it('combines two devices after offline quizzes, survives restart, and keeps unfinished quizzes local', async () => {
    const cloud = server()
    const laptop = device(cloud)
    const phone = device(cloud)
    laptop.setUser('learner'); phone.setUser('learner')
    await laptop.sync(); await phone.sync()
    cloud.offline(true)
    await laptop.repository.submitSession(session('laptop'), [attempt('laptop')])
    await phone.repository.submitSession(session('phone'), [attempt('phone')])
    await laptop.repository.saveActiveSession(active('unfinished-laptop'))
    await phone.repository.saveActiveSession(active('unfinished-phone'))
    await laptop.sync(); await phone.sync()
    expect(laptop.getStatus().state).toBe('error')
    cloud.offline(false)
    const restarted = device(cloud, laptop.storage)
    restarted.setUser('learner')
    await restarted.sync(); await phone.sync(); await restarted.sync()
    for (const d of [restarted, phone]) {
      const { data } = await d.repository.load()
      expect(data.sessions.map((s) => s.id).sort()).toEqual(['laptop', 'phone'])
      expect(data.attempts).toHaveLength(2)
      expect(d.getStatus()).toMatchObject({ state: 'synced', pending: 0 })
    }
    expect((await restarted.repository.load()).data.activeSession?.id).toBe('unfinished-laptop')
    expect((await phone.repository.load()).data.activeSession?.id).toBe('unfinished-phone')
    expect(cloud.users.get('learner')?.activeSession).toBeNull()
  })

  it('retries the same record safely after an upload succeeds but its response is lost', async () => {
    const cloud = server()
    let loseResponse = true
    const d = device({ async exchange(user, pending) {
      const result = await cloud.exchange(user, pending)
      if (loseResponse) { loseResponse = false; throw new Error('Response lost') }
      return result
    } })
    await d.repository.submitSession(session('one'), [attempt('one')])
    d.setUser('learner')
    await vi.waitFor(() => expect(d.getStatus().state).toBe('error'))
    await d.sync()
    expect(cloud.users.get('learner')?.attempts).toHaveLength(1)
    expect(d.getStatus().pending).toBe(0)
  })

  it('never sends one learner’s records to a different account', async () => {
    const cloud = server()
    const d = device(cloud)
    d.setUser('learner-a'); await d.sync()
    await d.repository.submitSession(session('private'), [attempt('private')]); await d.sync()
    d.setUser(null); d.setUser('learner-b'); await d.sync()
    expect(d.getStatus()).toMatchObject({ state: 'error', message: expect.stringMatching(/another learner/) })
    expect(cloud.users.has('learner-b')).toBe(false)
  })

  it('ignores a response received after sign-out', async () => {
    let release!: (data: LearnerData) => void
    const d = device({ exchange: () => new Promise((resolve) => { release = resolve }) })
    d.setUser('learner')
    await vi.waitFor(() => expect(release).toBeDefined())
    d.setUser(null)
    release({ ...emptyLearnerData(), sessions: [session('late')] })
    await d.sync()
    expect((await d.repository.load()).data.sessions).toEqual([])
    expect(d.getStatus().state).toBe('signed-out')
  })

  it('does not spin when a server fails to acknowledge an uploaded record', async () => {
    const exchange = vi.fn(async () => emptyLearnerData())
    const d = device({ exchange })
    await d.repository.submitSession(session('one'), [attempt('one')])
    d.setUser('learner'); await d.sync()
    expect(d.getStatus().state).toBe('error')
    expect(exchange).toHaveBeenCalledTimes(1)
  })

  it('keeps edits made during an exchange queued for the next pass', async () => {
    const cloud = server()
    let release!: () => void
    let hold = true
    const d = device({ async exchange(user, data) {
      if (hold) { hold = false; await new Promise<void>((resolve) => { release = resolve }) }
      return cloud.exchange(user, data)
    } })
    d.setUser('learner')
    await vi.waitFor(() => expect(release).toBeDefined())
    await d.repository.submitSession(session('new'), [attempt('new')])
    release(); await d.sync()
    expect(cloud.users.get('learner')?.sessions[0].id).toBe('new')
    expect(d.getStatus().pending).toBe(0)
  })
})
