import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { makeAttempt, makeSession } from '../../domain/testFixtures'
import { renderApp } from '../../test/renderApp'
import { storageWith } from '../../test/seed'

const EUL = 'grammar.eul-geyo'
const WASTE = 'vocabulary.waste-disposal'
const CHORES = 'vocabulary.household-chores'

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()

/**
 * -(으)ㄹ게요: missed twice, both still open.
 * Waste words: missed once, still open.
 * Chore words: missed long ago, then fixed by a later correct answer.
 */
function learnerWithMistakes() {
  return storageWith({
    sessions: [makeSession({ id: 'old', correctCount: 5, totalCount: 10 }), makeSession({ id: 'new', correctCount: 6, totalCount: 10 })],
    attempts: [
      makeAttempt({ questionId: 'ch11-q001', conceptId: CHORES, isCorrect: false, sessionId: 'old', answeredAt: daysAgo(40), correctChoiceId: 'c', selectedChoiceId: 'a' }),
      makeAttempt({ questionId: 'ch11-q010', conceptId: CHORES, isCorrect: true, sessionId: 'new', answeredAt: daysAgo(2), correctChoiceId: 'd', selectedChoiceId: 'd' }),
      makeAttempt({ questionId: 'ch11-q004', conceptId: EUL, isCorrect: false, sessionId: 'new', answeredAt: daysAgo(2), correctChoiceId: 'b', selectedChoiceId: 'a' }),
      makeAttempt({ questionId: 'ch11-q006', conceptId: EUL, isCorrect: false, sessionId: 'new', answeredAt: daysAgo(2), correctChoiceId: 'd', selectedChoiceId: null }),
      makeAttempt({ questionId: 'ch11-q008', conceptId: WASTE, isCorrect: false, sessionId: 'new', answeredAt: daysAgo(2), correctChoiceId: 'b', selectedChoiceId: 'a' }),
    ],
  })
}

async function openMistakes(path = '/practice/mistakes', storage = learnerWithMistakes()) {
  const user = userEvent.setup()
  renderApp(path, { storage })
  await screen.findByRole('heading', { level: 1, name: 'Mistakes' })
  return { user }
}

function groupTitles() {
  return screen.queryAllByRole('heading', { level: 2 }).map((h) => h.textContent)
}

function summary() {
  return screen.getByText(/open mistakes? across/).closest('p')!
}

describe('Mistake Review: list', () => {
  it('groups mistakes by concept, most open mistakes first', async () => {
    await openMistakes()
    expect(groupTitles()).toEqual(['-(으)ㄹ게요', '쓰레기 분리배출 어휘', '집안일 어휘'])
    expect(summary()).toHaveTextContent('3 open mistakes across 3 concepts · 1 fixed')
  })

  it('shows your answer and the correct answer, including skipped questions', async () => {
    await openMistakes()
    const group = screen.getByRole('region', { name: '-(으)ㄹ게요' })
    const items = within(group).getAllByRole('article')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Your answer제가 음식을 만들을게요.Correct제가 창문을 닦을게요.')
    expect(within(group).getByText('Skipped')).toBeInTheDocument()
  })

  it('marks mistakes fixed by a later correct answer', async () => {
    await openMistakes()
    const group = screen.getByRole('region', { name: '집안일 어휘' })
    expect(within(group).getByText('All fixed')).toBeInTheDocument()
    expect(within(group).getByText('Fixed')).toBeInTheDocument()
    expect(within(group).getByText(/fixed \d+ \w+ \d{4}/)).toBeInTheDocument()
  })

  it('shows evidence for each concept and a link back to the lesson', async () => {
    await openMistakes()
    const group = screen.getByRole('region', { name: '-(으)ㄹ게요' })
    expect(group).toHaveTextContent('Missed 2 times · 0/2 correct overall')
    expect(within(group).getByRole('link', { name: 'Study in Chapter 11 (p.155)' })).toHaveAttribute('href', '/learn/11')
  })

  it('keeps explanations folded until asked for', async () => {
    const { user } = await openMistakes()
    const item = within(screen.getByRole('region', { name: '쓰레기 분리배출 어휘' })).getByRole('article')
    const details = item.querySelector('details')!
    expect(details).not.toHaveAttribute('open')
    await user.click(within(item).getByText('Explanation'))
    expect(details).toHaveAttribute('open')
  })

  it('links each mistake to the exam it came from', async () => {
    await openMistakes()
    const item = within(screen.getByRole('region', { name: '쓰레기 분리배출 어휘' })).getByRole('article')
    expect(within(item).getByRole('link', { name: 'See that exam' })).toHaveAttribute('href', '/quiz/new/results')
  })
})

describe('Mistake Review: filters', () => {
  it('filters by concept and keeps the filter in the address', async () => {
    const { user } = await openMistakes()
    await user.selectOptions(screen.getByLabelText('Concept'), '쓰레기 분리배출 어휘')
    expect(groupTitles()).toEqual(['쓰레기 분리배출 어휘'])
    expect(summary()).toHaveTextContent('1 open mistake across 1 concept · 0 fixed')
  })

  it('opens already filtered from a link, as Results does', async () => {
    await openMistakes(`/practice/mistakes?chapter=ch11&concept=${EUL}`)
    expect(screen.getByLabelText('Chapter')).toHaveValue('ch11')
    expect(groupTitles()).toEqual(['-(으)ㄹ게요'])
  })

  it('filters by date', async () => {
    const { user } = await openMistakes()
    await user.selectOptions(screen.getByLabelText('Date'), 'Last 30 days')
    expect(groupTitles()).toEqual(['-(으)ㄹ게요', '쓰레기 분리배출 어휘'])
  })

  it('says when nothing matches, and clears filters', async () => {
    const { user } = await openMistakes(`/practice/mistakes?concept=${CHORES}&range=7`)
    expect(screen.getByText('Nothing matches these filters.')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Clear filters' })[0])
    expect(groupTitles()).toHaveLength(3)
    expect(screen.getByLabelText('Date')).toHaveValue('all')
  })

  it('ignores an unknown date range in the address', async () => {
    await openMistakes('/practice/mistakes?range=forever')
    expect(screen.getByLabelText('Date')).toHaveValue('all')
    expect(groupTitles()).toHaveLength(3)
  })
})

describe('Mistake Review: empty states', () => {
  it('explains that mistakes appear after the first exam', async () => {
    await openMistakes('/practice/mistakes', storageWith({}))
    expect(screen.getByText(/No mistakes yet/)).toBeInTheDocument()
    expect(screen.queryByRole('form')).not.toBeInTheDocument()
  })

  it('celebrates nothing falsely when every answer was right', async () => {
    await openMistakes(
      '/practice/mistakes',
      storageWith({
        sessions: [makeSession({ correctCount: 1, totalCount: 1 })],
        attempts: [makeAttempt({ questionId: 'ch11-q001', isCorrect: true })],
      }),
    )
    expect(screen.getByText(/Every answer in your practice exams so far was correct/)).toBeInTheDocument()
  })
})
