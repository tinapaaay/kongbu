import type { CompletedSession, LearnerData } from '../learnerData'
import { weakConcepts } from './mistakes'

export type ChapterStatus = 'not-started' | 'visited' | 'practiced' | 'mastered'

/**
 * Mastery needs all of:
 * - at least 80% on the latest quiz, which had at least 10 questions,
 * - no open mistakes in the chapter,
 * - every concept in the chapter answered correctly at least once, so nothing was skipped.
 */
export const MASTERY_ACCURACY = 0.8
export const MASTERY_MIN_QUESTIONS = 10

export interface Score {
  correct: number
  total: number
}

export interface ChapterProgress {
  status: ChapterStatus
  sessionsCompleted: number
  latestScore?: Score
  bestScore?: Score
  openMistakes: number
  /** Concepts in the chapter answered correctly at least once, out of all its concepts that have questions. */
  conceptsShown: number
  conceptsTotal: number
}

/**
 * A chapter's status, calculated from saved facts only:
 * - not started: never opened, never quizzed
 * - visited: opened, but no quiz submitted
 * - practiced: at least one quiz submitted (a practice exam or a concept review)
 * - mastered: the mastery rule above is met
 * An unfinished quiz never counts.
 *
 * `conceptIds` is every concept the chapter tests. The caller passes it (from `conceptIdsForChapter`),
 * so this rule only works with what it is given and never reads study content itself.
 */
export function chapterProgress(chapterId: string, data: LearnerData, conceptIds: string[]): ChapterProgress {
  const allSessions = data.sessions.filter((s) => s.chapterId === chapterId)
  // Scores and mastery come from full practice exams; short concept reviews count as practice only.
  const sessions = allSessions
    .filter((s) => s.type === 'chapter-practice')
    .sort((x, y) => x.submittedAt.localeCompare(y.submittedAt))
  const openMistakes = weakConcepts(data.attempts, chapterId).reduce((sum, c) => sum + c.openMistakes, 0)
  const shown = new Set(data.attempts.filter((a) => a.isCorrect && a.chapterId === chapterId).map((a) => a.conceptId))
  const conceptsShown = conceptIds.filter((id) => shown.has(id)).length
  const coverage = { conceptsShown, conceptsTotal: conceptIds.length }

  if (sessions.length === 0) {
    return {
      status: allSessions.length > 0 ? 'practiced' : data.chapterVisits[chapterId] ? 'visited' : 'not-started',
      sessionsCompleted: allSessions.length,
      openMistakes,
      ...coverage,
    }
  }

  const latest = sessions.at(-1)!
  const best = sessions.reduce((a, b) => (ratio(b) > ratio(a) ? b : a))
  const mastered =
    latest.totalCount >= MASTERY_MIN_QUESTIONS &&
    ratio(latest) >= MASTERY_ACCURACY &&
    openMistakes === 0 &&
    conceptsShown === conceptIds.length

  return {
    status: mastered ? 'mastered' : 'practiced',
    sessionsCompleted: allSessions.length,
    latestScore: toScore(latest),
    bestScore: toScore(best),
    openMistakes,
    ...coverage,
  }
}

/** Whole-number percentage, e.g. 7 of 10 → 70. */
export function percent({ correct, total }: Score): number {
  return total === 0 ? 0 : Math.round((correct / total) * 100)
}

function ratio(session: CompletedSession): number {
  return session.totalCount === 0 ? 0 : session.correctCount / session.totalCount
}

function toScore(session: CompletedSession): Score {
  return { correct: session.correctCount, total: session.totalCount }
}

