import type { ChapterId, ChoiceId, Question } from '../../content/schemas'
import type { ActiveSession, Attempt } from '../learnerData'
import { defaultMakeId, defaultRandom, shuffle, type MakeId, type Random } from '../random'

export const QUIZ_SIZE = 10

const CHOICE_IDS: ChoiceId[] = ['a', 'b', 'c', 'd']

export interface BuildSessionInput {
  chapterId: ChapterId | string
  /** All questions available. Only this chapter's questions are used. */
  questions: Question[]
  /** The learner's past attempts, used to bring back missed material. */
  attempts: Attempt[]
  now: Date
  size?: number
  random?: Random
  makeId?: MakeId
}

export type BuildSessionResult =
  | { ok: true; session: ActiveSession }
  | { ok: false; reason: 'not-enough-questions'; available: number; needed: number }

/**
 * Picks questions for a chapter practice quiz, in priority order:
 *   1. Questions you got wrong the last time you saw them.
 *   2. Other questions on a concept you still have an open mistake in.
 *   3. Questions you have never seen.
 *   4. Questions you got right, oldest first.
 * Ties are broken randomly, the final order is shuffled, and each question's
 * four choices get their own shuffled order.
 */
export function buildChapterSession(input: BuildSessionInput): BuildSessionResult {
  const { chapterId, questions, attempts, now } = input
  const size = input.size ?? QUIZ_SIZE
  const random = input.random ?? defaultRandom
  const makeId = input.makeId ?? defaultMakeId

  // The chapter filter: questions from other chapters can never appear.
  const pool = questions.filter((q) => q.chapterId === chapterId)
  if (pool.length < size) {
    return { ok: false, reason: 'not-enough-questions', available: pool.length, needed: size }
  }

  const lastAttemptByQuestion = latestBy(attempts, (a) => a.questionId)
  const lastAttemptByConcept = latestBy(attempts, (a) => a.conceptId)

  function priority(question: Question): number {
    const last = lastAttemptByQuestion.get(question.id)
    if (last && !last.isCorrect) return 0
    if (lastAttemptByConcept.get(question.conceptId)?.isCorrect === false) return 1
    if (!last) return 2
    return 3
  }

  // Shuffle first so equal-priority questions come out in a random order,
  // then a stable sort keeps that randomness inside each priority group.
  const ranked = shuffle(pool, random)
    .map((question) => ({
      question,
      priority: priority(question),
      lastSeen: lastAttemptByQuestion.get(question.id)?.answeredAt ?? '',
    }))
    .sort((x, y) => x.priority - y.priority || (x.priority === 3 ? x.lastSeen.localeCompare(y.lastSeen) : 0))

  const chosen = shuffle(
    ranked.slice(0, size).map((r) => r.question),
    random,
  )

  const choiceOrder: Record<string, ChoiceId[]> = {}
  for (const question of chosen) choiceOrder[question.id] = shuffle(CHOICE_IDS, random)

  return {
    ok: true,
    session: {
      id: makeId(),
      type: 'chapter-practice',
      chapterId: chapterId as ChapterId,
      startedAt: now.toISOString(),
      questionIds: chosen.map((q) => q.id),
      choiceOrder,
      answers: {},
      durationsMs: {},
      currentIndex: 0,
    },
  }
}

/** For each key, the attempt with the latest answeredAt. */
function latestBy(attempts: Attempt[], keyOf: (a: Attempt) => string): Map<string, Attempt> {
  const latest = new Map<string, Attempt>()
  for (const attempt of attempts) {
    const key = keyOf(attempt)
    const current = latest.get(key)
    if (!current || attempt.answeredAt >= current.answeredAt) latest.set(key, attempt)
  }
  return latest
}
