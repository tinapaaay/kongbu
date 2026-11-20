import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { makeAttempt, makeSession } from '../../domain/testFixtures'
import { renderApp } from '../../test/renderApp'
import { storageWith } from '../../test/seed'

async function renderDashboard(storage = storageWith({})) {
  renderApp('/', { storage })
  await screen.findByRole('heading', { level: 1, name: '오늘의 공부' })
}

function section(name: string) {
  return screen.getByRole('region', { name })
}

describe('Dashboard for a new learner', () => {
  it('points to Chapter 11 without inventing any progress', async () => {
    await renderDashboard()
    const next = section('11 집안일')
    expect(within(next).getByText('Start here')).toBeInTheDocument()
    expect(within(next).getByRole('link', { name: 'Open Chapter 11' })).toHaveAttribute('href', '/learn/11')
    expect(screen.queryByText(/Resume|Continue/)).not.toBeInTheDocument()
  })

  it('shows honest empty states', async () => {
    await renderDashboard()
    expect(within(section('Weak concepts')).getByText(/appear here after your first practice exam/)).toBeInTheDocument()
    expect(within(section('Chapter progress')).getByText('Not started')).toBeInTheDocument()
    expect(section('Chapter progress')).toHaveTextContent('All 60 chapters: 0 mastered · 0 practiced · 0 visited · 60 not started')
    expect(section('This week')).toHaveTextContent('0 questions answered · 0 study days')
    expect(screen.queryByRole('region', { name: 'Recently studied' })).not.toBeInTheDocument()
  })
})

describe('Dashboard for a returning learner', () => {
  it('puts an unfinished quiz first', async () => {
    await renderDashboard(
      storageWith({
        activeSession: {
          id: 'quiz-9',
          type: 'chapter-practice',
          chapterId: 'ch11',
          startedAt: '2026-11-19T09:00:00.000Z',
          questionIds: ['ch11-q001', 'ch11-q002'],
          choiceOrder: { 'ch11-q001': ['a', 'b', 'c', 'd'], 'ch11-q002': ['a', 'b', 'c', 'd'] },
          answers: { 'ch11-q001': 'c' },
          durationsMs: {},
          currentIndex: 1,
        },
      }),
    )
    const next = section('Resume Chapter 11 practice')
    expect(within(next).getByText(/1 of 2 questions answered/)).toBeInTheDocument()
    expect(within(next).getByRole('link', { name: 'Resume quiz' })).toHaveAttribute('href', '/quiz/quiz-9')
  })

  it('shows weak concepts with their evidence and sends the learner to review', async () => {
    const attempts = [
      makeAttempt({ questionId: 'ch11-q004', conceptId: 'grammar.eul-geyo', isCorrect: false }),
      makeAttempt({ questionId: 'ch11-q005', conceptId: 'grammar.eul-geyo', isCorrect: false }),
      makeAttempt({ questionId: 'ch11-q006', conceptId: 'grammar.eul-geyo', isCorrect: true }),
    ]
    await renderDashboard(storageWith({ sessions: [makeSession({ correctCount: 6, totalCount: 10 })], attempts }))

    expect(within(section('Review -(으)ㄹ게요')).getByRole('link', { name: 'Review mistakes' })).toBeInTheDocument()
    const weak = section('Weak concepts')
    expect(within(weak).getByText('2 open')).toBeInTheDocument()
    expect(within(weak).getByText('1/3')).toBeInTheDocument()
    expect(within(section('Chapter progress')).getByText('Practiced')).toBeInTheDocument()
    expect(within(section('Recently studied')).getByText('-(으)ㄹ게요')).toBeInTheDocument()
  })
})
