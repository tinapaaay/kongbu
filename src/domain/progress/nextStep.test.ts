import { describe, expect, it } from 'vitest'
import type { Chapter } from '../../content/schemas'
import { chapters } from '../../content'
import { emptyLearnerData, type ActiveSession, type LearnerData } from '../learnerData'
import { makeAttempt, makeSession, minutes } from '../testFixtures'
import { currentChapter, nextStep } from './nextStep'

function data(overrides: Partial<LearnerData>): LearnerData {
  return { ...emptyLearnerData(), ...overrides }
}

const active: ActiveSession = {
  id: 'quiz-1',
  type: 'chapter-practice',
  chapterId: 'ch11',
  startedAt: minutes(0),
  questionIds: ['ch11-q001', 'ch11-q002', 'ch11-q003'],
  choiceOrder: {},
  answers: { 'ch11-q001': 'a' },
  durationsMs: {},
  currentIndex: 1,
}

describe('nextStep', () => {
  it('sends a new learner to the baseline chapter, Chapter 11', () => {
    const step = nextStep(emptyLearnerData(), chapters)
    expect(step).toMatchObject({ kind: 'start-chapter', chapter: { number: 11 }, progress: { status: 'not-started' } })
  })

  it('puts an unfinished quiz first', () => {
    const withMistake = data({
      activeSession: active,
      attempts: [makeAttempt({ questionId: 'ch11-q004', isCorrect: false })],
    })
    expect(nextStep(withMistake, chapters)).toMatchObject({ kind: 'resume-quiz', answered: 1, total: 3 })
  })

  it('then sends the learner to open mistakes', () => {
    const step = nextStep(data({ attempts: [makeAttempt({ questionId: 'ch11-q004', isCorrect: false })] }), chapters)
    expect(step).toMatchObject({ kind: 'review-mistakes', concept: { conceptId: 'grammar.eul-geyo' }, openConcepts: 1 })
  })

  it('suggests more practice after a quiz below mastery', () => {
    const step = nextStep(data({ sessions: [makeSession({ correctCount: 6, totalCount: 10 })] }), chapters)
    expect(step.kind).toBe('practice-chapter')
  })

  it('recognizes a mastered chapter', () => {
    const step = nextStep(data({ sessions: [makeSession({ correctCount: 9, totalCount: 10 })] }), chapters)
    expect(step.kind).toBe('chapter-mastered')
  })
})

describe('currentChapter', () => {
  it('uses the most recently studied available chapter', () => {
    const twoAvailable: Chapter[] = chapters.map((c) =>
      c.number === 12 ? { ...c, contentStatus: 'available' as const } : c,
    )
    const studied = data({
      chapterVisits: {
        ch11: { firstAt: minutes(1), lastAt: minutes(1) },
        ch12: { firstAt: minutes(5), lastAt: minutes(5) },
      },
    })
    expect(currentChapter(studied, twoAvailable).number).toBe(12)
    expect(currentChapter(emptyLearnerData(), twoAvailable).number).toBe(11)
  })
})
