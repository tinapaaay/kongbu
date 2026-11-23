import { describe, expect, it } from 'vitest'
import { getQuestionsForChapter, questions } from '../../content/allContent'
import type { Question } from '../../content/schemas'
import type { ActiveSession } from '../learnerData'
import { seededRandom, sequentialIds } from '../random'
import { makeAttempt, minutes } from '../testFixtures'
import { buildChapterSession, buildConceptReview, QUIZ_SIZE, type BuildSessionInput } from './buildSession'
import { keepBlanksTogether, toPlayableQuestion } from './playableQuestion'
import { quizReducer, unansweredQuestionIds } from './quizReducer'
import { scoreSession } from './scoreSession'

const NOW = new Date('2026-11-20T09:00:00.000Z')
const chapter11 = getQuestionsForChapter('ch11')
const questionsById = new Map(questions.map((q) => [q.id, q]))

function build(overrides: Partial<BuildSessionInput> = {}, seed = 1): ActiveSession {
  const result = buildChapterSession({
    chapterId: 'ch11',
    questions,
    attempts: [],
    now: NOW,
    random: seededRandom(seed),
    makeId: sequentialIds('session'),
    ...overrides,
  })
  if (!result.ok) throw new Error('expected a session')
  return result.session
}

/** Run with many seeds, because selection involves randomness. */
const SEEDS = Array.from({ length: 25 }, (_, i) => i + 1)

describe('buildChapterSession', () => {
  it('picks 10 different questions from the chosen chapter only', () => {
    const session = build()
    expect(session.questionIds).toHaveLength(QUIZ_SIZE)
    expect(new Set(session.questionIds).size).toBe(QUIZ_SIZE)
    for (const id of session.questionIds) expect(questionsById.get(id)?.chapterId).toBe('ch11')
  })

  it('starts fresh: no answers, first question, given time and id', () => {
    const session = build()
    expect(session).toMatchObject({
      id: 'session-1',
      chapterId: 'ch11',
      startedAt: NOW.toISOString(),
      answers: {},
      durationsMs: {},
      currentIndex: 0,
    })
  })

  it('refuses when a chapter has too few questions', () => {
    const result = buildChapterSession({ chapterId: 'ch13', questions, attempts: [], now: NOW })
    expect(result).toEqual({ ok: false, reason: 'not-enough-questions', available: 0, needed: 10 })
  })

  it('gives every question a shuffled order of all four choices', () => {
    const session = build()
    for (const id of session.questionIds) {
      expect([...session.choiceOrder[id]].sort()).toEqual(['a', 'b', 'c', 'd'])
    }
    const orders = new Set(session.questionIds.map((id) => session.choiceOrder[id].join('')))
    expect(orders.size).toBeGreaterThan(1)
  })

  it('is repeatable with the same seed and varies with different seeds', () => {
    expect(build({}, 7)).toEqual(build({}, 7))
    const orders = new Set(SEEDS.map((seed) => build({}, seed).questionIds.join()))
    expect(orders.size).toBeGreaterThan(1)
  })

  it('always brings back questions missed last time', () => {
    const missed = ['ch11-q003', 'ch11-q012', 'ch11-q020']
    const attempts = chapter11.map((q) =>
      makeAttempt({ questionId: q.id, conceptId: q.conceptId, isCorrect: !missed.includes(q.id), answeredAt: minutes(1) }),
    )
    for (const seed of SEEDS) {
      expect(build({ attempts }, seed).questionIds).toEqual(expect.arrayContaining(missed))
    }
  })

  it('brings back other questions on a concept with an open mistake', () => {
    // Everything answered correctly, then q013 (ㅅ irregular) missed later.
    const attempts = [
      ...chapter11.map((q) => makeAttempt({ questionId: q.id, conceptId: q.conceptId, isCorrect: true, answeredAt: minutes(1) })),
      makeAttempt({ questionId: 'ch11-q013', conceptId: 'grammar.s-irregular', isCorrect: false, answeredAt: minutes(5) }),
    ]
    for (const seed of SEEDS) {
      expect(build({ attempts }, seed).questionIds).toEqual(expect.arrayContaining(['ch11-q012', 'ch11-q013']))
    }
  })

  it('prefers unseen questions over ones already answered correctly', () => {
    const seen = chapter11.slice(0, 12)
    const unseen = chapter11.slice(12).map((q) => q.id)
    const attempts = seen.map((q) => makeAttempt({ questionId: q.id, conceptId: q.conceptId, isCorrect: true }))
    expect(build({ attempts }).questionIds.sort()).toEqual(unseen.sort())
  })

  it('then prefers the questions seen longest ago', () => {
    // The 10 oldest cover only 6 of the 8 concepts, so 2 newer questions are swapped in for coverage.
    const older = chapter11.slice(0, 10).map((q) => q.id)
    const attempts = chapter11.map((q, i) =>
      makeAttempt({ questionId: q.id, conceptId: q.conceptId, isCorrect: true, answeredAt: minutes(i < 10 ? 1 : 30) }),
    )
    for (const seed of SEEDS) {
      const ids = build({ attempts }, seed).questionIds
      expect(ids.filter((id) => older.includes(id))).toHaveLength(8)
    }
  })

  it('includes every concept in the chapter when there is room', () => {
    const allConcepts = new Set(chapter11.map((q) => q.conceptId))
    for (const seed of SEEDS) {
      const concepts = new Set(build({}, seed).questionIds.map((id) => questionsById.get(id)!.conceptId))
      expect(concepts).toEqual(allConcepts)
    }
  })

  it('never drops missed questions to make room for coverage', () => {
    const missed = chapter11.filter((q) => q.conceptId === 'grammar.eul-geyo' || q.conceptId === 'vocabulary.waste-disposal')
    const attempts = missed.map((q) => makeAttempt({ questionId: q.id, conceptId: q.conceptId, isCorrect: false }))
    for (const seed of SEEDS) {
      expect(build({ attempts }, seed).questionIds).toEqual(expect.arrayContaining(missed.map((q) => q.id)))
    }
  })
})

describe('buildConceptReview', () => {
  it('uses only the chosen concept, missed questions first, at most 5', () => {
    const attempts = [makeAttempt({ questionId: 'ch11-q005', conceptId: 'grammar.eul-geyo', isCorrect: false })]
    for (const seed of SEEDS) {
      const result = buildConceptReview({
        conceptId: 'grammar.eul-geyo',
        questions,
        attempts,
        now: NOW,
        size: 2,
        random: seededRandom(seed),
        makeId: sequentialIds('review'),
      })
      if (!result.ok) throw new Error('expected a review')
      expect(result.session).toMatchObject({ type: 'concept-review', conceptId: 'grammar.eul-geyo', chapterId: 'ch11' })
      expect(result.session.questionIds).toHaveLength(2)
      expect(result.session.questionIds).toContain('ch11-q005')
      for (const id of result.session.questionIds) expect(questionsById.get(id)?.conceptId).toBe('grammar.eul-geyo')
    }
  })

  it('refuses a concept with no questions', () => {
    const result = buildConceptReview({ conceptId: 'grammar.unknown', questions, attempts: [], now: NOW })
    expect(result.ok).toBe(false)
  })
})

describe('quizReducer', () => {
  const session = build()
  const [first, second] = session.questionIds

  it('records a selected answer without changing the original state', () => {
    const next = quizReducer(session, { type: 'select', questionId: first, choiceId: 'c' })
    expect(next.answers[first]).toBe('c')
    expect(session.answers).toEqual({})
  })

  it('lets the learner change an answer', () => {
    let state = quizReducer(session, { type: 'select', questionId: first, choiceId: 'c' })
    state = quizReducer(state, { type: 'select', questionId: first, choiceId: 'a' })
    expect(state.answers[first]).toBe('a')
  })

  it('ignores answers for questions not in this quiz', () => {
    expect(quizReducer(session, { type: 'select', questionId: 'ch11-q999', choiceId: 'a' })).toBe(session)
  })

  it('moves between questions and stays inside the quiz', () => {
    expect(quizReducer(session, { type: 'previous' }).currentIndex).toBe(0)
    expect(quizReducer(session, { type: 'next' }).currentIndex).toBe(1)
    expect(quizReducer(session, { type: 'goTo', index: 99 }).currentIndex).toBe(9)
    expect(quizReducer(session, { type: 'goTo', index: -3 }).currentIndex).toBe(0)
    const atEnd = quizReducer(session, { type: 'goTo', index: 9 })
    expect(quizReducer(atEnd, { type: 'next' }).currentIndex).toBe(9)
  })

  it('adds up time spent per question and ignores invalid times', () => {
    let state = quizReducer(session, { type: 'addTime', questionId: second, ms: 1500 })
    state = quizReducer(state, { type: 'addTime', questionId: second, ms: 500 })
    state = quizReducer(state, { type: 'addTime', questionId: second, ms: -100 })
    expect(state.durationsMs[second]).toBe(2000)
  })

  it('lists unanswered questions in quiz order', () => {
    const state = quizReducer(session, { type: 'select', questionId: first, choiceId: 'a' })
    expect(unansweredQuestionIds(state)).toEqual(session.questionIds.slice(1))
  })
})

describe('toPlayableQuestion', () => {
  const question = questionsById.get('ch11-q001') as Question

  it('hides the answer key and explanation from the quiz screen', () => {
    const playable = toPlayableQuestion(question, ['d', 'c', 'b', 'a'])
    expect(playable).not.toHaveProperty('correctChoiceId')
    expect(playable).not.toHaveProperty('explanation')
    expect(JSON.stringify(playable)).not.toContain(question.explanation)
  })

  it('shows exactly four choices in the shuffled order', () => {
    const playable = toPlayableQuestion(question, ['d', 'c', 'b', 'a'])
    expect(playable.choices.map((c) => c.id)).toEqual(['d', 'c', 'b', 'a'])
    expect(playable.choices[0].text).toBe('밥솥')
  })

  it('keeps fill-in blanks whole so they never split across lines', () => {
    expect(keepBlanksTogether('빨래를 (   ).')).toBe('빨래를 (\u00a0\u00a0\u00a0).')
    expect(keepBlanksTogether('가: 안녕하세요.\n나: 네.')).toBe('가: 안녕하세요.\n나: 네.')
  })

  it.each(['draft', 'ai-reviewed', 'approved'] as const)('preserves the %s review status', (reviewStatus) => {
    expect(toPlayableQuestion({ ...question, reviewStatus }, ['a', 'b', 'c', 'd']).reviewStatus).toBe(reviewStatus)
  })
})

describe('scoreSession', () => {
  const base = build()
  const answerAll = (pick: (q: Question) => 'a' | 'b' | 'c' | 'd') => ({
    ...base,
    answers: Object.fromEntries(base.questionIds.map((id) => [id, pick(questionsById.get(id)!)])),
  })
  const wrongChoice = (q: Question) => q.choices.find((c) => c.id !== q.correctChoiceId)!.id
  const submitAt = new Date('2026-11-20T09:20:00.000Z')

  it('scores all correct as 10/10', () => {
    const { session } = scoreSession(answerAll((q) => q.correctChoiceId), questionsById, submitAt)
    expect([session.correctCount, session.totalCount]).toEqual([10, 10])
  })

  it('scores all wrong as 0/10', () => {
    const { session } = scoreSession(answerAll(wrongChoice), questionsById, submitAt)
    expect(session.correctCount).toBe(0)
  })

  it('scores a mix exactly', () => {
    const ids = base.questionIds
    const state = answerAll((q) => (ids.indexOf(q.id) < 7 ? q.correctChoiceId : wrongChoice(q)))
    expect(scoreSession(state, questionsById, submitAt).session.correctCount).toBe(7)
  })

  it('counts unanswered questions as incorrect and records them as skipped', () => {
    const { session, attempts } = scoreSession(base, questionsById, submitAt)
    expect(session.correctCount).toBe(0)
    expect(attempts.every((a) => a.selectedChoiceId === null && !a.isCorrect)).toBe(true)
  })

  it('records one attempt per question with the answer key, concept, and time', () => {
    const state = { ...answerAll((q) => q.correctChoiceId), durationsMs: { [base.questionIds[0]]: 4200 } }
    const { attempts } = scoreSession(state, questionsById, submitAt, sequentialIds('attempt'))
    expect(attempts.map((a) => a.questionId)).toEqual(base.questionIds)
    const first = questionsById.get(base.questionIds[0])!
    expect(attempts[0]).toEqual({
      id: 'attempt-1',
      sessionId: base.id,
      questionId: first.id,
      selectedChoiceId: first.correctChoiceId,
      correctChoiceId: first.correctChoiceId,
      isCorrect: true,
      chapterId: 'ch11',
      conceptId: first.conceptId,
      answeredAt: submitAt.toISOString(),
      durationMs: 4200,
    })
    expect(attempts[1]).not.toHaveProperty('durationMs')
  })

  it('keeps the quiz order and choice order in the completed session', () => {
    const { session } = scoreSession(base, questionsById, submitAt)
    expect(session.questionIds).toEqual(base.questionIds)
    expect(session.choiceOrder).toEqual(base.choiceOrder)
    expect(session.submittedAt).toBe(submitAt.toISOString())
  })

  it('refuses to score a question that no longer exists', () => {
    const broken = { ...base, questionIds: [...base.questionIds, 'ch11-q999'] }
    expect(() => scoreSession(broken, questionsById, submitAt)).toThrow(/ch11-q999/)
  })
})
