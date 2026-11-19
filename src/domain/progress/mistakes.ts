import type { Attempt } from '../learnerData'

export interface MistakeEntry {
  attempt: Attempt
  /** "fixed" once the same concept is answered correctly in a later quiz. */
  status: 'open' | 'fixed'
  fixedAt?: string
}

export interface MistakeFilter {
  chapterId?: string
  conceptId?: string
  /** Only mistakes on or after this moment. */
  since?: Date
}

/**
 * Every wrong or skipped answer, newest first, with open/fixed status.
 * A correct answer in the same quiz does not fix a mistake; it has to come later.
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
      const laterCorrect = (correctByConcept.get(attempt.conceptId) ?? [])
        .filter((c) => c.answeredAt > attempt.answeredAt)
        .map((c) => c.answeredAt)
        .sort()
      return laterCorrect.length > 0
        ? { attempt, status: 'fixed', fixedAt: laterCorrect[0] }
        : { attempt, status: 'open' }
    })
    .sort((x, y) => y.attempt.answeredAt.localeCompare(x.attempt.answeredAt))
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
