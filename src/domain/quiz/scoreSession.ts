import type { Question } from '../../content/schemas'
import type { ActiveSession, Attempt, CompletedSession } from '../learnerData'
import { defaultMakeId, type MakeId } from '../random'

export interface ScoredSession {
  session: CompletedSession
  attempts: Attempt[]
}

/**
 * Turns a submitted quiz into a completed session plus one attempt per question.
 * Scoring is a direct comparison with the stored answer key, the same every time.
 * Unanswered questions are recorded as incorrect with selectedChoiceId null.
 */
export function scoreSession(
  active: ActiveSession,
  questionsById: ReadonlyMap<string, Question>,
  now: Date,
  makeId: MakeId = defaultMakeId,
): ScoredSession {
  const submittedAt = now.toISOString()

  const attempts: Attempt[] = active.questionIds.map((questionId) => {
    const question = questionsById.get(questionId)
    if (!question) throw new Error(`Cannot score: question "${questionId}" no longer exists`)
    const selected = active.answers[questionId] ?? null
    const duration = active.durationsMs[questionId]
    return {
      id: makeId(),
      sessionId: active.id,
      questionId,
      selectedChoiceId: selected,
      correctChoiceId: question.correctChoiceId,
      isCorrect: selected === question.correctChoiceId,
      chapterId: question.chapterId,
      conceptId: question.conceptId,
      answeredAt: submittedAt,
      ...(duration !== undefined ? { durationMs: duration } : {}),
    }
  })

  return {
    session: {
      id: active.id,
      type: active.type,
      chapterId: active.chapterId,
      startedAt: active.startedAt,
      submittedAt,
      questionIds: [...active.questionIds],
      choiceOrder: active.choiceOrder,
      correctCount: attempts.filter((a) => a.isCorrect).length,
      totalCount: attempts.length,
    },
    attempts,
  }
}
