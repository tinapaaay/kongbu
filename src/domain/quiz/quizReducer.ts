import type { ChoiceId } from '../../content/schemas'
import type { ActiveSession } from '../learnerData'

/**
 * Everything a learner can do while answering. A reducer takes the current state and
 * one action and returns the next state. It never changes the old state, so every
 * step is easy to save, test, and undo.
 */
export type QuizAction =
  | { type: 'select'; questionId: string; choiceId: ChoiceId }
  | { type: 'goTo'; index: number }
  | { type: 'next' }
  | { type: 'previous' }
  | { type: 'addTime'; questionId: string; ms: number }

export function quizReducer(session: ActiveSession, action: QuizAction): ActiveSession {
  const last = session.questionIds.length - 1

  switch (action.type) {
    case 'select': {
      const order = session.choiceOrder[action.questionId]
      // Ignore anything that isn't a real choice for a question in this quiz.
      if (!order || !order.includes(action.choiceId)) return session
      if (session.answers[action.questionId] === action.choiceId) return session
      return { ...session, answers: { ...session.answers, [action.questionId]: action.choiceId } }
    }
    case 'goTo': {
      const index = clamp(Math.trunc(action.index), 0, last)
      return index === session.currentIndex ? session : { ...session, currentIndex: index }
    }
    case 'next':
      return session.currentIndex >= last ? session : { ...session, currentIndex: session.currentIndex + 1 }
    case 'previous':
      return session.currentIndex <= 0 ? session : { ...session, currentIndex: session.currentIndex - 1 }
    case 'addTime': {
      if (!session.questionIds.includes(action.questionId) || !(action.ms > 0)) return session
      const previous = session.durationsMs[action.questionId] ?? 0
      return { ...session, durationsMs: { ...session.durationsMs, [action.questionId]: previous + action.ms } }
    }
  }
}

/** Question ids with no answer yet, in quiz order. */
export function unansweredQuestionIds(session: ActiveSession): string[] {
  return session.questionIds.filter((id) => !session.answers[id])
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
