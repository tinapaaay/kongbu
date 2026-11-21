import { describe, expect, it } from 'vitest'
import { emptyLearnerData } from '../domain/learnerData'
import { makeAttempt, makeSession } from '../domain/testFixtures'
import { mergeLearnerData } from './mergeLearnerData'
import { migrate } from './migrations'
import { createLocalStorageRepository } from './localStorageRepository'
import { MemoryStorage } from './storage'

it('keeps local records, ignores duplicate payloads, adds missing records, and merges visit ranges', () => {
  const first = makeAttempt({ id: 'same', questionId: 'ch11-q001', isCorrect: false })
  const local = { ...emptyLearnerData(), attempts: [first], chapterVisits: { ch11: { firstAt: '2026-11-10T00:00:00Z', lastAt: '2026-11-19T00:00:00Z' } } }
  const incoming = { ...emptyLearnerData(), attempts: [{ ...first, isCorrect: true }, makeAttempt({ id: 'new', questionId: 'ch11-q002', isCorrect: true })], chapterVisits: { ch11: { firstAt: '2026-11-09T00:00:00Z', lastAt: '2026-11-15T00:00:00Z' } } }
  const result = mergeLearnerData(local, incoming)
  expect(result.attempts).toHaveLength(2)
  expect(result.attempts[0].isCorrect).toBe(false)
  expect(result.chapterVisits.ch11).toEqual({ firstAt: '2026-11-09T00:00:00Z', lastAt: '2026-11-19T00:00:00Z' })
  expect(mergeLearnerData(result, incoming)).toEqual(result)
})

it('a restore adds to work saved after the preview opened and does not reset the backup time', async () => {
  const repo = createLocalStorageRepository(new MemoryStorage())
  await repo.load()
  await repo.markBackedUp(new Date('2026-11-21T00:00:00Z'))
  await repo.submitSession(makeSession({ id: 'local', correctCount: 0, totalCount: 1 }), [])
  const result = await repo.mergeRecords({ ...emptyLearnerData(), sessions: [makeSession({ id: 'backup', correctCount: 1, totalCount: 1 })] })
  expect(result.sessions.map((s) => s.id)).toEqual(['local', 'backup'])
  expect(result.lastBackupAt).toBe('2026-11-21T00:00:00.000Z')
})

describe('v3 migration', () => {
  it('gives old visits stable IDs and preserves the unfinished quiz', () => {
    const old = { ...emptyLearnerData(), schemaVersion: 2, chapterVisits: { ch11: { firstAt: '2026-11-20T00:00:00Z', lastAt: '2026-11-21T00:00:00Z' } } }
    const result = migrate(old)
    expect(result).toMatchObject({ ok: true, data: { schemaVersion: 3, visitRecords: [{ chapterId: 'ch11' }] } })
    expect(migrate(old)).toEqual(result)
  })
  it('does not throw on a malformed old visit', () => {
    expect(() => migrate({ schemaVersion: 2, chapterVisits: { ch11: null } })).not.toThrow()
  })
})


it('an unchanged cloud pull does not write or trigger another tab to sync again', async () => {
  class CountedStorage extends MemoryStorage {
    writes = 0
    override setItem(key: string, value: string) { this.writes++; super.setItem(key, value) }
  }
  const storage = new CountedStorage()
  const repo = createLocalStorageRepository(storage)
  await repo.load()
  const data = { ...emptyLearnerData(), sessions: [makeSession({ correctCount: 1, totalCount: 1 })] }
  await repo.mergeRecords(data)
  const writes = storage.writes
  await repo.mergeRecords(data)
  expect(storage.writes).toBe(writes)
})
