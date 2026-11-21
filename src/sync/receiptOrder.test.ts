import { expect, it } from 'vitest'
import { makeAttempt } from '../domain/testFixtures'
import { listMistakes } from '../domain/progress/mistakes'

it('uses server receipts after sync even when the later device clock is behind', () => {
  const wrong = makeAttempt({ questionId: 'ch11-q001', isCorrect: false, sessionId: 'laptop', answeredAt: '2026-11-21T12:00:00Z', serverReceivedAt: '2026-11-21T10:00:00.000001Z' })
  const right = makeAttempt({ questionId: 'ch11-q001', isCorrect: true, sessionId: 'phone', answeredAt: '2026-11-21T09:00:00Z', serverReceivedAt: '2026-11-21T10:00:00.000002Z' })
  expect(listMistakes([wrong, right])[0].status).toBe('fixed')
})
it('does not use an earlier server receipt as later evidence despite a fast device clock', () => {
  const wrong = makeAttempt({ questionId: 'ch11-q001', isCorrect: false, sessionId: 'laptop', answeredAt: '2026-11-21T09:00:00Z', serverReceivedAt: '2026-11-21T10:00:01.000000Z' })
  const right = makeAttempt({ questionId: 'ch11-q001', isCorrect: true, sessionId: 'phone', answeredAt: '2026-11-21T12:00:00Z', serverReceivedAt: '2026-11-21T10:00:00.000000Z' })
  expect(listMistakes([wrong, right])[0].status).toBe('open')
})
