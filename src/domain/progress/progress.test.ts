import { describe, expect, it } from 'vitest'
import { emptyLearnerData, learnerDataSchema, type LearnerData } from '../learnerData'
import { makeAttempt, makeSession, minutes } from '../testFixtures'
import { localDateKey, weekActivity } from './activity'
import { chapterProgress, percent } from './chapterProgress'
import { conceptStats, listMistakes, weakConcepts } from './mistakes'

const EUL = 'grammar.eul-geyo'
const MUST = 'grammar.a-eo-ya-doeda'

describe('listMistakes', () => {
  it('lists only wrong answers, newest first', () => {
    const attempts = [
      makeAttempt({ questionId: 'ch11-q004', isCorrect: false, answeredAt: minutes(1) }),
      makeAttempt({ questionId: 'ch11-q005', isCorrect: true, answeredAt: minutes(2) }),
      makeAttempt({ questionId: 'ch11-q006', isCorrect: false, answeredAt: minutes(3) }),
    ]
    expect(listMistakes(attempts).map((m) => m.attempt.questionId)).toEqual(['ch11-q006', 'ch11-q004'])
  })

  it('marks a mistake fixed when the concept is answered correctly later', () => {
    const attempts = [
      makeAttempt({ questionId: 'ch11-q004', conceptId: EUL, isCorrect: false, answeredAt: minutes(1) }),
      makeAttempt({ questionId: 'ch11-q017', conceptId: EUL, isCorrect: true, answeredAt: minutes(9) }),
    ]
    expect(listMistakes(attempts)[0]).toMatchObject({ status: 'fixed', fixedAt: minutes(9) })
  })

  it('does not count a correct answer in the same quiz as a fix', () => {
    const attempts = [
      makeAttempt({ questionId: 'ch11-q004', conceptId: EUL, isCorrect: false, answeredAt: minutes(1) }),
      makeAttempt({ questionId: 'ch11-q017', conceptId: EUL, isCorrect: true, answeredAt: minutes(1) }),
    ]
    expect(listMistakes(attempts)[0].status).toBe('open')
  })

  it('does not let another concept fix a mistake', () => {
    const attempts = [
      makeAttempt({ questionId: 'ch11-q004', conceptId: EUL, isCorrect: false, answeredAt: minutes(1) }),
      makeAttempt({ questionId: 'ch11-q003', conceptId: MUST, isCorrect: true, answeredAt: minutes(9) }),
    ]
    expect(listMistakes(attempts)[0].status).toBe('open')
  })

  it('treats skipped questions as mistakes', () => {
    const skipped = makeAttempt({ questionId: 'ch11-q004', isCorrect: false, selectedChoiceId: null })
    expect(listMistakes([skipped])).toHaveLength(1)
  })

  it('filters by chapter, concept, and date', () => {
    const attempts = [
      makeAttempt({ questionId: 'ch11-q004', conceptId: EUL, isCorrect: false, answeredAt: minutes(1) }),
      makeAttempt({ questionId: 'ch11-q003', conceptId: MUST, isCorrect: false, answeredAt: minutes(5) }),
    ]
    expect(listMistakes(attempts, { conceptId: MUST })).toHaveLength(1)
    expect(listMistakes(attempts, { chapterId: 'ch12' })).toHaveLength(0)
    expect(listMistakes(attempts, { since: new Date(minutes(3)) }).map((m) => m.attempt.conceptId)).toEqual([MUST])
  })
})

describe('conceptStats and weakConcepts', () => {
  const attempts = [
    makeAttempt({ questionId: 'ch11-q004', conceptId: EUL, isCorrect: false, answeredAt: minutes(1) }),
    makeAttempt({ questionId: 'ch11-q005', conceptId: EUL, isCorrect: false, answeredAt: minutes(1) }),
    makeAttempt({ questionId: 'ch11-q006', conceptId: EUL, isCorrect: true, answeredAt: minutes(1) }),
    makeAttempt({ questionId: 'ch11-q003', conceptId: MUST, isCorrect: false, answeredAt: minutes(4) }),
    makeAttempt({ questionId: 'ch11-q001', conceptId: 'vocabulary.household-chores', isCorrect: true, answeredAt: minutes(4) }),
  ]

  it('counts correct answers out of total, so sample size is always visible', () => {
    expect(conceptStats(attempts).find((s) => s.conceptId === EUL)).toMatchObject({ correct: 1, total: 3, openMistakes: 2 })
  })

  it('ranks concepts with more open mistakes first, and skips concepts without any', () => {
    expect(weakConcepts(attempts).map((s) => s.conceptId)).toEqual([EUL, MUST])
  })

  it('breaks ties with the most recently missed concept', () => {
    const tie = attempts.filter((a) => a.questionId !== 'ch11-q005')
    expect(weakConcepts(tie).map((s) => s.conceptId)).toEqual([MUST, EUL])
  })

  it('returns nothing for a new learner', () => {
    expect(weakConcepts([])).toEqual([])
  })
})

describe('chapterProgress', () => {
  function data(overrides: Partial<LearnerData>): LearnerData {
    return { ...emptyLearnerData(), ...overrides }
  }

  it('shows a new learner as not started', () => {
    expect(chapterProgress('ch11', emptyLearnerData())).toEqual({ status: 'not-started', sessionsCompleted: 0, openMistakes: 0 })
  })

  it('shows an opened chapter as visited', () => {
    const visited = data({ chapterVisits: { ch11: { firstAt: minutes(0), lastAt: minutes(0) } } })
    expect(chapterProgress('ch11', visited).status).toBe('visited')
  })

  it('does not count an unfinished quiz as practice', () => {
    const active = {
      id: 's',
      type: 'chapter-practice' as const,
      chapterId: 'ch11' as const,
      startedAt: minutes(0),
      questionIds: ['ch11-q001'],
      choiceOrder: {},
      answers: {},
      durationsMs: {},
      currentIndex: 0,
    }
    expect(chapterProgress('ch11', data({ activeSession: active })).status).toBe('not-started')
  })

  it('shows a submitted quiz below 80% as practiced', () => {
    const result = chapterProgress('ch11', data({ sessions: [makeSession({ correctCount: 7, totalCount: 10 })] }))
    expect(result).toMatchObject({ status: 'practiced', latestScore: { correct: 7, total: 10 } })
  })

  it('shows 80% or better with no open mistakes as mastered', () => {
    const attempts = [
      makeAttempt({ questionId: 'ch11-q004', conceptId: EUL, isCorrect: false, answeredAt: minutes(1) }),
      makeAttempt({ questionId: 'ch11-q017', conceptId: EUL, isCorrect: true, answeredAt: minutes(9) }),
    ]
    const result = chapterProgress('ch11', data({ sessions: [makeSession({ correctCount: 8, totalCount: 10 })], attempts }))
    expect(result.status).toBe('mastered')
  })

  it('withholds mastery while a missed concept is still open', () => {
    const attempts = [makeAttempt({ questionId: 'ch11-q004', conceptId: EUL, isCorrect: false, answeredAt: minutes(1) })]
    const result = chapterProgress('ch11', data({ sessions: [makeSession({ correctCount: 9, totalCount: 10 })], attempts }))
    expect(result).toMatchObject({ status: 'practiced', openMistakes: 1 })
  })

  it('withholds mastery for quizzes shorter than 10 questions', () => {
    const result = chapterProgress('ch11', data({ sessions: [makeSession({ correctCount: 5, totalCount: 5 })] }))
    expect(result.status).toBe('practiced')
  })

  it('uses the latest quiz for mastery and reports the best score separately', () => {
    const sessions = [
      makeSession({ id: 'a', correctCount: 9, totalCount: 10, submittedAt: minutes(1) }),
      makeSession({ id: 'b', correctCount: 6, totalCount: 10, submittedAt: minutes(9) }),
    ]
    expect(chapterProgress('ch11', data({ sessions }))).toMatchObject({
      status: 'practiced',
      sessionsCompleted: 2,
      latestScore: { correct: 6, total: 10 },
      bestScore: { correct: 9, total: 10 },
    })
  })

  it('ignores other chapters', () => {
    const sessions = [makeSession({ chapterId: 'ch12', correctCount: 10, totalCount: 10 })]
    expect(chapterProgress('ch11', data({ sessions })).status).toBe('not-started')
  })

  it('formats whole-number percentages', () => {
    expect(percent({ correct: 7, total: 10 })).toBe(70)
    expect(percent({ correct: 2, total: 3 })).toBe(67)
    expect(percent({ correct: 0, total: 0 })).toBe(0)
  })
})

describe('weekActivity', () => {
  // Local-time dates, so the test works in any time zone. 20 Nov 2026 is a Friday.
  const friday = new Date(2026, 10, 20, 15, 0)
  const at = (day: number, hour = 10) => new Date(2026, 10, day, hour).toISOString()

  it('returns Monday to Sunday of the current week', () => {
    const week = weekActivity([], friday)
    expect(week.map((d) => d.weekday)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
    expect(week[0].date).toBe('2026-11-16')
    expect(week[6].date).toBe('2026-11-22')
  })

  it('counts questions answered on each local day and ignores other weeks', () => {
    const attempts = [
      makeAttempt({ questionId: 'q1', isCorrect: true, answeredAt: at(16) }),
      makeAttempt({ questionId: 'q2', isCorrect: true, answeredAt: at(16, 23) }),
      makeAttempt({ questionId: 'q3', isCorrect: false, answeredAt: at(20) }),
      makeAttempt({ questionId: 'q4', isCorrect: true, answeredAt: at(13) }),
    ]
    expect(weekActivity(attempts, friday).map((d) => d.questions)).toEqual([2, 0, 0, 0, 1, 0, 0])
  })

  it('treats Sunday as the end of the week', () => {
    const sunday = new Date(2026, 10, 22, 21, 0)
    expect(weekActivity([], sunday)[0].date).toBe('2026-11-16')
    expect(localDateKey(sunday)).toBe('2026-11-22')
  })
})

describe('learner data', () => {
  it('starts empty for a new learner, and the empty state is valid', () => {
    const empty = emptyLearnerData()
    expect(empty).toEqual({ schemaVersion: 1, chapterVisits: {}, activeSession: null, sessions: [], attempts: [] })
    expect(learnerDataSchema.safeParse(empty).success).toBe(true)
  })

  it('rejects malformed attempts', () => {
    const bad = { ...emptyLearnerData(), attempts: [{ questionId: 'ch11-q001', isCorrect: 'yes' }] }
    expect(learnerDataSchema.safeParse(bad).success).toBe(false)
  })
})
