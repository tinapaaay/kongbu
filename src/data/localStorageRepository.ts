import { emptyLearnerData, learnerDataSchema, type LearnerData } from '../domain/learnerData'
import { SaveError, type LearnerRepository, type LoadResult } from './LearnerRepository'
import { migrate } from './migrations'
import { MemoryStorage, type StorageLike } from './storage'

export const STORAGE_KEY = 'hangul-lab:learner-data'
export const DAMAGED_COPY_PREFIX = 'hangul-lab:damaged-copy:'

/**
 * Saves all learner data as one JSON value under one key.
 * One key means every change is a single write: it either fully happens or not at all.
 *
 * Pass `null` as storage when the browser blocks storage; data then lives in memory only.
 */
export function createLocalStorageRepository(storage: StorageLike | null): LearnerRepository {
  const target = storage ?? new MemoryStorage()
  const persistent = storage !== null
  let current: LearnerData = emptyLearnerData()
  /** True when saved data is from a newer app version and must not be overwritten. */
  let readOnly = false

  function write(next: LearnerData): LearnerData {
    current = next
    if (readOnly) throw new SaveError('read-only', next)
    if (!persistent) throw new SaveError('unavailable', next)
    try {
      target.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Most often the browser's storage quota is full.
      throw new SaveError('full', next)
    }
    return next
  }

  return {
    async load(): Promise<LoadResult> {
      if (!persistent) {
        current = emptyLearnerData()
        return { data: current, problem: { kind: 'unavailable' } }
      }

      const raw = target.getItem(STORAGE_KEY)
      if (raw === null) {
        current = emptyLearnerData()
        return { data: current, problem: null }
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        return damaged(raw)
      }

      const migrated = migrate(parsed)
      if (!migrated.ok) {
        if (migrated.reason === 'newer-version') {
          readOnly = true
          current = emptyLearnerData()
          return { data: current, problem: { kind: 'newer-version' } }
        }
        return damaged(raw)
      }

      const result = learnerDataSchema.safeParse(migrated.data)
      if (!result.success) return damaged(raw)

      current = result.data
      return { data: current, problem: null }
    },

    async recordChapterVisit(chapterId, now) {
      const at = now.toISOString()
      const previous = current.chapterVisits[chapterId]
      return write({
        ...current,
        chapterVisits: { ...current.chapterVisits, [chapterId]: { firstAt: previous?.firstAt ?? at, lastAt: at } },
      })
    },

    async saveActiveSession(session) {
      return write({ ...current, activeSession: session })
    },

    async submitSession(session, attempts) {
      // Idempotent: a double click or a retry must not record the quiz twice.
      if (current.sessions.some((s) => s.id === session.id)) return current
      return write({
        ...current,
        sessions: [...current.sessions, session],
        attempts: [...current.attempts, ...attempts],
        activeSession: current.activeSession?.id === session.id ? null : current.activeSession,
      })
    },

    async markBackedUp(now) {
      return write({ ...current, lastBackupAt: now.toISOString() })
    },

    async replaceAll(data) {
      const checked = learnerDataSchema.parse(data)
      readOnly = false
      return write(checked)
    },
  }

  /** Keeps the unreadable text under a separate key, so nothing is silently lost. */
  function damaged(raw: string): LoadResult {
    current = emptyLearnerData()
    const copyKey = `${DAMAGED_COPY_PREFIX}${new Date().toISOString()}`
    try {
      target.setItem(copyKey, raw)
      return { data: current, problem: { kind: 'damaged', copyKey } }
    } catch {
      return { data: current, problem: { kind: 'damaged', copyKey: null } }
    }
  }
}
