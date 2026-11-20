import type { ActiveSession, Attempt, CompletedSession, LearnerData } from '../domain/learnerData'

/**
 * Every way the app is allowed to read or change saved learner data.
 * Screens never touch storage directly. Phase 2 can add a Supabase version of this
 * interface without changing any screen.
 *
 * Methods are async (they return Promises) even though localStorage is instant,
 * because a database is not. Each change returns the full updated data.
 */
export interface LearnerRepository {
  load(): Promise<LoadResult>
  /**
   * Calls `onChange` with the new data whenever progress changes somewhere else,
   * such as another open tab. Returns a function that stops watching.
   */
  watch(onChange: (data: LearnerData) => void): () => void
  recordChapterVisit(chapterId: string, now: Date): Promise<LearnerData>
  /** Saves the quiz in progress, or clears it with null. */
  saveActiveSession(session: ActiveSession | null): Promise<LearnerData>
  /** Saves a submitted quiz and its attempts together. Submitting the same quiz twice changes nothing. */
  submitSession(session: CompletedSession, attempts: Attempt[]): Promise<LearnerData>
  markBackedUp(now: Date): Promise<LearnerData>
  /** Replaces all progress, e.g. from a checked backup. */
  replaceAll(data: LearnerData): Promise<LearnerData>
}

export type LoadProblem =
  /** Saved progress existed but couldn't be read. A raw copy was kept. */
  | { kind: 'damaged'; copyKey: string | null }
  /** Saved by a newer version of the app. Not overwritten. */
  | { kind: 'newer-version' }
  /** The browser blocks storage. Progress lasts only until the page closes. */
  | { kind: 'unavailable' }

export interface LoadResult {
  data: LearnerData
  problem: LoadProblem | null
}

/** Thrown when a change can't be saved. The change is still kept in memory for this visit. */
export class SaveError extends Error {
  readonly kind: 'full' | 'unavailable' | 'read-only'
  /** The data including the change, so the screen can still show it. */
  readonly data: LearnerData

  constructor(kind: SaveError['kind'], data: LearnerData) {
    super(`Progress could not be saved (${kind})`)
    this.name = 'SaveError'
    this.kind = kind
    this.data = data
  }
}
