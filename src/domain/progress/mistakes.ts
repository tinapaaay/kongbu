import type { Attempt } from '../learnerData'

export interface MistakeEntry {
  attempt: Attempt
  /** "fixed" once there is enough later evidence. See FIXED_BY. */
  status: 'open' | 'fixed'
  fixedAt?: string
}

/**
 * How much later evidence fixes a mistake. Either:
 * - the same question answered correctly in a later quiz, or
 * - this many *different* questions on the same concept answered correctly in later quizzes.
 * One lucky answer on a related question is not enough.
 */
export const FIXED_BY_OTHER_QUESTIONS = 2

export interface MistakeFilter {
  chapterId?: string
  conceptId?: string
  /** Only mistakes on or after this moment. */
  since?: Date
}

/**
 * Every wrong or skipped answer, newest first, with open/fixed status.
 * Only answers from a later quiz count as evidence; a right answer in the same quiz does not.
 */
export function listMistakes(attempts: Attempt[], filter: MistakeFilter = {}): MistakeEntry[] {
  const sinceIso = filter.since?.toISOString()
  const correctByConcept = groupBy(
    attempts.filter((a) => a.isCorrect),
    (a) => a.conceptId,
  )

  return attempts
    .filter((a) => !a.isCorrect)
    .filter((a) => !filter.chapterId || a.chapterId === filter.chapterId)
    .filter((a) => !filter.conceptId || a.conceptId === filter.conceptId)
    .filter((a) => !sinceIso || a.answeredAt >= sinceIso)
    .map((attempt): MistakeEntry => {
      const fixedAt = whenFixed(attempt, correctByConcept.get(attempt.conceptId) ?? [])
      return fixedAt ? { attempt, status: 'fixed', fixedAt } : { attempt, status: 'open' }
    })
    .sort((x, y) => y.attempt.answeredAt.localeCompare(x.attempt.answeredAt))
}

/** The moment enough later evidence existed to fix this mistake, or undefined if it is still open. */
function whenFixed(mistake: Attempt, correctOnConcept: Attempt[]): string | undefined {
  const later = correctOnConcept
    .filter((c) => c.sessionId !== mistake.sessionId && c.answeredAt > mistake.answeredAt)
    .sort((x, y) => x.answeredAt.localeCompare(y.answeredAt))

  const otherQuestions = new Set<string>()
  for (const correct of later) {
    if (correct.questionId === mistake.questionId) return correct.answeredAt
    otherQuestions.add(correct.questionId)
    if (otherQuestions.size >= FIXED_BY_OTHER_QUESTIONS) return correct.answeredAt
  }
  return undefined
}

export interface ConceptStats {
  conceptId: string
  chapterId: string
  correct: number
  total: number
  /** Mistakes not yet fixed by a later correct answer. */
  openMistakes: number
  lastAnsweredAt: string
  lastMissedAt?: string
}

/** Per-concept totals. Always shown with counts, so one answer never looks like mastery. */
export function conceptStats(attempts: Attempt[]): ConceptStats[] {
  const openByConcept = new Map<string, number>()
  for (const entry of listMistakes(attempts)) {
    if (entry.status === 'open') {
      openByConcept.set(entry.attempt.conceptId, (openByConcept.get(entry.attempt.conceptId) ?? 0) + 1)
    }
  }

  return [...groupBy(attempts, (a) => a.conceptId).entries()].map(([conceptId, list]) => {
    const missed = list.filter((a) => !a.isCorrect).map((a) => a.answeredAt).sort()
    return {
      conceptId,
      chapterId: list[0].chapterId,
      correct: list.filter((a) => a.isCorrect).length,
      total: list.length,
      openMistakes: openByConcept.get(conceptId) ?? 0,
      lastAnsweredAt: list.map((a) => a.answeredAt).sort().at(-1)!,
      lastMissedAt: missed.at(-1),
    }
  })
}

/**
 * Concepts that still have open mistakes, most urgent first:
 * more open mistakes first, then the most recently missed.
 */
export function weakConcepts(attempts: Attempt[], chapterId?: string): ConceptStats[] {
  return conceptStats(attempts)
    .filter((s) => s.openMistakes > 0)
    .filter((s) => !chapterId || s.chapterId === chapterId)
    .sort(
      (x, y) =>
        y.openMistakes - x.openMistakes || (y.lastMissedAt ?? '').localeCompare(x.lastMissedAt ?? ''),
    )
}

function groupBy<T>(items: T[], keyOf: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const key = keyOf(item)
    const group = groups.get(key)
    if (group) group.push(item)
    else groups.set(key, [item])
  }
  return groups
}
