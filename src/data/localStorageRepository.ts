import { emptyLearnerData, learnerDataSchema, type LearnerData } from '../domain/learnerData'
import { SaveError, type LearnerRepository, type LoadResult } from './LearnerRepository'
import { mergeLearnerData } from './mergeLearnerData'
import { migrate } from './migrations'
import { MemoryStorage, type StorageLike } from './storage'

// These keys keep the app's old name (Hangul Lab) on purpose: changing them would make
// existing saved progress look empty. Visitors never see them.
export const STORAGE_KEY = 'hangul-lab:learner-data'
export const DAMAGED_COPY_PREFIX = 'hangul-lab:damaged-copy:'

/** Calls `onChange` when another tab changes the saved value of `key`. Returns a function that stops listening. */
export type ListenForChanges = (key: string, onChange: () => void) => () => void

/** The browser fires a `storage` event in every *other* tab of this site when one tab writes. */
export const listenToOtherTabs: ListenForChanges = (key, onChange) => {
  const handle = (event: StorageEvent) => {
    if (event.key === key || event.key === null) onChange()
  }
  window.addEventListener('storage', handle)
  return () => window.removeEventListener('storage', handle)
}

const listenNowhere: ListenForChanges = () => () => {}

/**
 * Saves all learner data as one JSON value under one key.
 * One key means every change is a single write: it either fully happens or not at all.
 *
 * Several tabs can be open at once. So every change starts from the latest saved copy
 * (read, then change, then write), never from this tab's older copy in memory.
 * Otherwise a forgotten tab could erase a quiz finished in another tab (a "lost update").
 *
 * Pass `null` as storage when the browser blocks storage; data then lives in memory only.
 */
export function createLocalStorageRepository(
  storage: StorageLike | null,
  { listen = typeof window === 'undefined' ? listenNowhere : listenToOtherTabs }: { listen?: ListenForChanges } = {},
): LearnerRepository {
  const target = storage ?? new MemoryStorage()
  const persistent = storage !== null
  let current: LearnerData = emptyLearnerData()
  /** True when saved data is from a newer app version and must not be overwritten. */
  let readOnly = false

  /**
   * The newest saved copy, which another tab may have changed since this tab loaded.
   * Falls back to this tab's copy if storage is blocked or what's saved can't be read.
   */
  function latest(): LearnerData {
    if (!persistent || readOnly) return current
    const raw = target.getItem(STORAGE_KEY)
    if (raw === null) return current
    try {
      const migrated = migrate(JSON.parse(raw))
      if (!migrated.ok) {
        // A newer version of the app saved in another tab: stop writing, so its data stays safe.
        if (migrated.reason === 'newer-version') readOnly = true
        return current
      }
      const result = learnerDataSchema.safeParse(migrated.data)
      if (result.success) current = result.data
    } catch {
      // Unreadable: keep this tab's copy.
    }
    return current
  }

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

    watch(onChange) {
      if (!persistent) return () => {}
      return listen(STORAGE_KEY, () => {
        const before = current
        const next = latest()
        if (next !== before) onChange(next)
      })
    },

    async recordChapterVisit(chapterId, now) {
      const current = latest()
      const at = now.toISOString()
      const previous = current.chapterVisits[chapterId]
      return write({
        ...current,
        chapterVisits: { ...current.chapterVisits, [chapterId]: { firstAt: previous?.firstAt ?? at, lastAt: at } },
        visitRecords: [...current.visitRecords, { id: crypto.randomUUID(), chapterId, firstAt: at, lastAt: at }],
      })
    },

    async saveActiveSession(session) {
      const current = latest()
      // A late save must never bring back a quiz that was already submitted, here or in another tab.
      if (session && current.sessions.some((s) => s.id === session.id)) return current
      return write({ ...current, activeSession: session })
    },

    async submitSession(session, attempts) {
      const current = latest()
      // Idempotent: a double click, a retry, or the same quiz submitted in two tabs is recorded once.
      if (current.sessions.some((s) => s.id === session.id)) return current
      return write({
        ...current,
        sessions: [...current.sessions, session],
        attempts: [...current.attempts, ...attempts],
        activeSession: current.activeSession?.id === session.id ? null : current.activeSession,
      })
    },

    async markBackedUp(now) {
      const current = latest()
      return write({ ...current, lastBackupAt: now.toISOString() })
    },

    async mergeRecords(data) {
      const checked = learnerDataSchema.parse(data)
      const current = latest()
      const merged = mergeLearnerData(current, checked)
      // A no-op pull must not fire a storage event and cause two tabs to sync forever.
      if (JSON.stringify(merged) === JSON.stringify(current)) return current
      return write(merged)
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
