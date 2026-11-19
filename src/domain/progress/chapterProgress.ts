import type { CompletedSession, LearnerData } from '../learnerData'
import { weakConcepts } from './mistakes'

export type ChapterStatus = 'not-started' | 'visited' | 'practiced' | 'mastered'

/** Mastery needs at least 80% on a quiz of at least 10 questions, and no open mistakes in the chapter. */
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
}

/**
 * A chapter's status, calculated from saved facts only:
 * - not started: never opened, never quizzed
 * - visited: opened, but no quiz submitted
 * - practiced: at least one quiz submitted
 * - mastered: the latest quiz meets the mastery rule
 * An unfinished quiz never counts.
 */
export function chapterProgress(chapterId: string, data: LearnerData): ChapterProgress {
  const sessions = data.sessions
    .filter((s) => s.chapterId === chapterId)
    .sort((x, y) => x.submittedAt.localeCompare(y.submittedAt))
  const openMistakes = weakConcepts(data.attempts, chapterId).reduce((sum, c) => sum + c.openMistakes, 0)

  if (sessions.length === 0) {
    return {
      status: data.chapterVisits[chapterId] ? 'visited' : 'not-started',
      sessionsCompleted: 0,
      openMistakes,
    }
  }

  const latest = sessions.at(-1)!
  const best = sessions.reduce((a, b) => (ratio(b) > ratio(a) ? b : a))
  const mastered =
    latest.totalCount >= MASTERY_MIN_QUESTIONS && ratio(latest) >= MASTERY_ACCURACY && openMistakes === 0

  return {
    status: mastered ? 'mastered' : 'practiced',
    sessionsCompleted: sessions.length,
    latestScore: toScore(latest),
    bestScore: toScore(best),
    openMistakes,
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
