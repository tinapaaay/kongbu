import { describe, expect, it } from 'vitest'
import { emptyLearnerData, type LearnerData } from '../domain/learnerData'
import { makeAttempt, makeSession } from '../domain/testFixtures'
import { backupFileName, createBackup, parseBackup } from './backup'
import { SaveError } from './LearnerRepository'
import { createLocalStorageRepository, DAMAGED_COPY_PREFIX, STORAGE_KEY } from './localStorageRepository'
import { migrate } from './migrations'
import { MemoryStorage, type StorageLike } from './storage'

const NOW = new Date('2026-11-20T09:00:00.000Z')

function sampleData(): LearnerData {
  return {
    ...emptyLearnerData(),
    chapterVisits: { ch11: { firstAt: NOW.toISOString(), lastAt: NOW.toISOString() } },
    sessions: [makeSession({ correctCount: 7, totalCount: 10 })],
    attempts: [makeAttempt({ questionId: 'ch11-q001', isCorrect: false })],
  }
}

/** A storage that can be told to fail, to simulate a full or broken browser store. */
class FailingStorage extends MemoryStorage {
  failWrites = false
  setItem(key: string, value: string) {
    if (this.failWrites) throw new DOMException('Quota exceeded', 'QuotaExceededError')
    super.setItem(key, value)
  }
}

describe('localStorage repository: loading', () => {
  it('starts a new learner with empty data and no problem', async () => {
    const result = await createLocalStorageRepository(new MemoryStorage()).load()
    expect(result).toEqual({ data: emptyLearnerData(), problem: null })
  })

  it('reloads exactly what was saved, as after a page refresh', async () => {
    const storage = new MemoryStorage()
    const first = createLocalStorageRepository(storage)
    await first.load()
    await first.recordChapterVisit('ch11', NOW)

    const afterRefresh = await createLocalStorageRepository(storage).load()
    expect(afterRefresh.data.chapterVisits.ch11).toEqual({ firstAt: NOW.toISOString(), lastAt: NOW.toISOString() })
    expect(afterRefresh.problem).toBeNull()
  })

  it.each([
    ['not JSON', '{ this is broken'],
    ['the wrong shape', JSON.stringify({ schemaVersion: 1, attempts: 'lots' })],
    ['missing a version', JSON.stringify({ attempts: [] })],
  ])('keeps a copy of damaged data (%s) instead of deleting it', async (_label, raw) => {
    const storage = new MemoryStorage()
    storage.setItem(STORAGE_KEY, raw)
    const result = await createLocalStorageRepository(storage).load()

    expect(result.data).toEqual(emptyLearnerData())
    expect(result.problem?.kind).toBe('damaged')
    const copyKey = storage.keys().find((k) => k.startsWith(DAMAGED_COPY_PREFIX))!
    expect(storage.getItem(copyKey)).toBe(raw)
    expect(storage.getItem(STORAGE_KEY)).toBe(raw)
  })

  it('refuses to overwrite data saved by a newer version', async () => {
    const storage = new MemoryStorage()
    const newer = JSON.stringify({ schemaVersion: 2, everything: 'new' })
    storage.setItem(STORAGE_KEY, newer)
    const repository = createLocalStorageRepository(storage)

    expect((await repository.load()).problem).toEqual({ kind: 'newer-version' })
    await expect(repository.recordChapterVisit('ch11', NOW)).rejects.toMatchObject({ kind: 'read-only' })
    expect(storage.getItem(STORAGE_KEY)).toBe(newer)
  })

  it('reports blocked storage and keeps working in memory', async () => {
    const repository = createLocalStorageRepository(null)
    expect((await repository.load()).problem).toEqual({ kind: 'unavailable' })
    const error = await repository.recordChapterVisit('ch11', NOW).catch((e) => e)
    expect(error).toBeInstanceOf(SaveError)
    expect(error.data.chapterVisits.ch11).toBeDefined()
  })
})

describe('localStorage repository: saving', () => {
  async function ready(storage: StorageLike = new MemoryStorage()) {
    const repository = createLocalStorageRepository(storage)
    await repository.load()
    return repository
  }

  it('keeps the first visit time and updates the latest', async () => {
    const repository = await ready()
    await repository.recordChapterVisit('ch11', new Date('2026-11-18T00:00:00.000Z'))
    const data = await repository.recordChapterVisit('ch11', NOW)
    expect(data.chapterVisits.ch11).toEqual({ firstAt: '2026-11-18T00:00:00.000Z', lastAt: NOW.toISOString() })
  })

  it('saves a submitted quiz and clears it as the active quiz', async () => {
    const repository = await ready()
    const session = makeSession({ id: 'quiz-1', correctCount: 1, totalCount: 1 })
    await repository.saveActiveSession({
      id: 'quiz-1',
      type: 'chapter-practice',
      chapterId: 'ch11',
      startedAt: session.startedAt,
      questionIds: ['ch11-q001'],
      choiceOrder: { 'ch11-q001': ['a', 'b', 'c', 'd'] },
      answers: { 'ch11-q001': 'a' },
      durationsMs: {},
      currentIndex: 0,
    })
    const data = await repository.submitSession(session, [makeAttempt({ questionId: 'ch11-q001', isCorrect: true, sessionId: 'quiz-1' })])
    expect(data.sessions).toHaveLength(1)
    expect(data.attempts).toHaveLength(1)
    expect(data.activeSession).toBeNull()
  })

  it('records a quiz only once, even if submitted twice', async () => {
    const repository = await ready()
    const session = makeSession({ id: 'quiz-1', correctCount: 1, totalCount: 1 })
    const attempts = [makeAttempt({ questionId: 'ch11-q001', isCorrect: true })]
    await repository.submitSession(session, attempts)
    const data = await repository.submitSession(session, attempts)
    expect(data.sessions).toHaveLength(1)
    expect(data.attempts).toHaveLength(1)
  })

  it('reports a full storage and keeps the change for this visit', async () => {
    const storage = new FailingStorage()
    const repository = await ready(storage)
    storage.failWrites = true
    const error = await repository.recordChapterVisit('ch11', NOW).catch((e) => e)
    expect(error).toMatchObject({ kind: 'full' })
    expect(error.data.chapterVisits.ch11).toBeDefined()
  })

  it('replaces everything with checked data', async () => {
    const repository = await ready()
    const data = await repository.replaceAll(sampleData())
    expect(data.attempts).toHaveLength(1)
  })

  it('refuses to replace with invalid data', async () => {
    const repository = await ready()
    await expect(repository.replaceAll({ ...sampleData(), attempts: [{}] } as unknown as LearnerData)).rejects.toThrow()
  })
})

describe('backups', () => {
  it('round-trips: a downloaded backup restores to the same data', () => {
    const original = sampleData()
    const result = parseBackup(createBackup(original, NOW))
    expect(result).toEqual({
      ok: true,
      data: original,
      summary: { exportedAt: NOW.toISOString(), quizzes: 1, answers: 1, chaptersVisited: 1, hasUnfinishedQuiz: false },
    })
  })

  it('names files by local date', () => {
    expect(backupFileName(new Date(2026, 10, 20, 23, 30))).toBe('hangul-lab-backup-2026-11-20.json')
  })

  it.each([
    ['plain text', 'hello', /couldn't be read/],
    ['another JSON file', JSON.stringify({ name: 'shopping list' }), /isn't a Hangul Lab backup/],
    ['damaged data', JSON.stringify({ app: 'hangul-lab', kind: 'backup', data: { schemaVersion: 1, attempts: 5 } }), /damaged/],
    ['a newer version', JSON.stringify({ app: 'hangul-lab', kind: 'backup', data: { schemaVersion: 9 } }), /newer version/],
  ])('rejects %s with a clear message', (_label, text, message) => {
    const result = parseBackup(text)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toMatch(message)
  })
})

describe('migrations', () => {
  it('accepts the current version unchanged', () => {
    expect(migrate({ schemaVersion: 1, a: 1 })).toEqual({ ok: true, data: { schemaVersion: 1, a: 1 } })
  })

  it('rejects non-objects and unknown versions', () => {
    expect(migrate([])).toMatchObject({ ok: false, reason: 'not-an-object' })
    expect(migrate({ schemaVersion: 0 })).toMatchObject({ ok: false, reason: 'missing-version' })
    expect(migrate({ schemaVersion: 3 })).toMatchObject({ ok: false, reason: 'newer-version' })
  })
})
