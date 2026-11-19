/** Small builders shared by domain tests. Not used by the app itself. */
import type { ChapterId, ChoiceId } from '../content/schemas'
import type { Attempt, CompletedSession } from './learnerData'

let attemptCounter = 0

export function makeAttempt(overrides: Partial<Attempt> & Pick<Attempt, 'questionId' | 'isCorrect'>): Attempt {
  attemptCounter++
  const correctChoiceId: ChoiceId = overrides.correctChoiceId ?? 'a'
  return {
    id: `attempt-${attemptCounter}`,
    sessionId: 'session-1',
    selectedChoiceId: overrides.isCorrect ? correctChoiceId : 'b',
    correctChoiceId,
    chapterId: 'ch11',
    conceptId: 'grammar.eul-geyo',
    answeredAt: '2026-11-20T03:00:00.000Z',
    ...overrides,
  }
}

export function makeSession(
  overrides: Partial<CompletedSession> & Pick<CompletedSession, 'correctCount' | 'totalCount'>,
): CompletedSession {
  return {
    id: 'session-1',
    type: 'chapter-practice',
    chapterId: 'ch11' as ChapterId,
    startedAt: '2026-11-20T02:50:00.000Z',
    submittedAt: '2026-11-20T03:00:00.000Z',
    questionIds: ['ch11-q001'],
    choiceOrder: { 'ch11-q001': ['a', 'b', 'c', 'd'] },
    ...overrides,
  }
}

/** ISO timestamp n minutes after a fixed start, for ordering attempts in time. */
export function minutes(n: number): string {
  return new Date(Date.UTC(2026, 10, 20, 0, n)).toISOString()
}
