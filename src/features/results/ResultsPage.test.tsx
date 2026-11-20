import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { questions, type ChoiceId, type Question } from '../../content/allContent'
import type { Attempt, CompletedSession } from '../../domain/learnerData'
import { buildChapterSession } from '../../domain/quiz/buildSession'
import { scoreSession } from '../../domain/quiz/scoreSession'
import { seededRandom, sequentialIds } from '../../domain/random'
import { renderApp } from '../../test/renderApp'
import { storageWith } from '../../test/seed'

const questionsById = new Map(questions.map((q) => [q.id, q]))
const wrongChoice = (q: Question): ChoiceId => q.choices.find((c) => c.id !== q.correctChoiceId)!.id

/**
 * A submitted quiz: questions 1–6 right, 7–8 wrong, 9–10 skipped.
 * Built with the real quiz and scoring rules, so it matches what the app saves.
 */
function submittedQuiz(): { session: CompletedSession; attempts: Attempt[] } {
  const built = buildChapterSession({
    chapterId: 'ch11',
    questions,
    attempts: [],
    now: new Date('2026-11-20T09:00:00.000Z'),
    random: seededRandom(7),
    makeId: sequentialIds('quiz'),
  })
  if (!built.ok) throw new Error('expected a quiz')
  const ids = built.session.questionIds
  const answers: Record<string, ChoiceId> = {}
  ids.slice(0, 6).forEach((id) => (answers[id] = questionsById.get(id)!.correctChoiceId))
  ids.slice(6, 8).forEach((id) => (answers[id] = wrongChoice(questionsById.get(id)!)))
  return scoreSession(
    { ...built.session, answers, durationsMs: { [ids[0]]: 12_400 } },
    questionsById,
    new Date('2026-11-20T09:15:00.000Z'),
    sequentialIds('attempt'),
  )
}

async function openResults(quiz = submittedQuiz()) {
  renderApp(`/quiz/${quiz.session.id}/results`, {
    storage: storageWith({ sessions: [quiz.session], attempts: quiz.attempts }),
  })
  await screen.findByRole('heading', { level: 1, name: 'Results' })
  return quiz
}

function reviewItems() {
  return within(screen.getByRole('region', { name: 'Answers and explanations' })).getAllByRole('group')
}

describe('Results: score', () => {
  it('shows the score, percentage, and what the status means', async () => {
    await openResults()
    const score = screen.getByRole('region', { name: 'Score' })
    expect(score).toHaveTextContent('6/ 1060%')
    expect(within(score).getByText('Practiced')).toBeInTheDocument()
    const checklist = within(score).getByRole('list')
    expect(within(checklist).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      '○Not yet: 80% or more on your latest 10-question practice exam',
      expect.stringMatching(/^(✓Done|○Not yet): A right answer in every concept \(\d of 8\)$/),
      expect.stringMatching(/^○Not yet: No open mistakes \(\d+ still open\)$/),
    ])
  })

  it('offers to review mistakes and to return to the chapter', async () => {
    await openResults()
    expect(screen.getByRole('link', { name: 'Review mistakes' })).toHaveAttribute('href', '/practice/mistakes?chapter=ch11')
    expect(screen.getByRole('link', { name: 'Back to chapter' })).toHaveAttribute('href', '/learn/11')
  })

  it('breaks the score down by concept, with counts that add up to the quiz', async () => {
    const { attempts } = await openResults()
    const rows = within(screen.getByRole('region', { name: 'By concept' })).getAllByRole('row').slice(1)
    const totals = rows.map((r) => r.lastElementChild!.textContent!.split('/').map(Number))
    expect(totals.reduce((sum, [, total]) => sum + total, 0)).toBe(attempts.length)
    expect(totals.reduce((sum, [correct]) => sum + correct, 0)).toBe(6)
  })
})

describe('Results: answers and explanations', () => {
  it('lists every question in quiz order, opening only wrong and skipped ones', async () => {
    await openResults()
    const items = reviewItems()
    expect(items).toHaveLength(10)
    expect(items.map((d) => d.hasAttribute('open'))).toEqual([false, false, false, false, false, false, true, true, true, true])
    expect(items.map((d) => within(d).getByText(/^(Correct|Incorrect|Skipped)$/).textContent)).toEqual([
      ...Array(6).fill('Correct'),
      'Incorrect',
      'Incorrect',
      'Skipped',
      'Skipped',
    ])
  })

  it('shows your answer, the correct answer, and the explanation from the answer key', async () => {
    const { attempts } = await openResults()
    const wrong = attempts[6]
    const question = questionsById.get(wrong.questionId)!
    const item = reviewItems()[6]

    const correctText = question.choices.find((c) => c.id === wrong.correctChoiceId)!.text
    const pickedText = question.choices.find((c) => c.id === wrong.selectedChoiceId)!.text
    expect(within(item).getByText('Correct answer').closest('li')).toHaveTextContent(correctText)
    expect(within(item).getByText('Your answer').closest('li')).toHaveTextContent(pickedText)
    expect(within(item).getByText(question.explanation)).toBeInTheDocument()
  })

  it('shows choices in the same order as during the quiz', async () => {
    const { session, attempts } = await openResults()
    const question = questionsById.get(attempts[0].questionId)!
    const expected = session.choiceOrder[question.id].map((id) => question.choices.find((c) => c.id === id)!.text)
    const shown = within(reviewItems()[0]).getAllByRole('listitem').map((li) => li.textContent!.slice(1).replace(/Your answer · Correct$/, ''))
    expect(shown).toEqual(expected)
  })

  it('explains skipped questions', async () => {
    await openResults()
    expect(within(reviewItems()[8]).getByText(/didn't answer this question/)).toBeInTheDocument()
  })

  it('shows the concept, textbook page, and time spent', async () => {
    const { attempts } = await openResults()
    const concept = attempts[0].conceptId
    const item = reviewItems()[0]
    expect(item).toHaveTextContent('12s on this question')
    expect(item).toHaveTextContent(/Book 1, p\.15\d/)
    expect(concept).toBeTruthy()
  })

  it('opens and closes a question when its summary is clicked', async () => {
    await openResults()
    const first = reviewItems()[0]
    await userEvent.click(within(first).getByText('Correct'))
    expect(first).toHaveAttribute('open')
  })

  it('keeps the saved answer key if a question was edited later', async () => {
    const quiz = submittedQuiz()
    const changed = { ...quiz.attempts[0], correctChoiceId: wrongChoice(questionsById.get(quiz.attempts[0].questionId)!), isCorrect: false }
    await openResults({ ...quiz, attempts: [changed, ...quiz.attempts.slice(1)] })
    expect(within(reviewItems()[0]).getByText(/edited after your quiz/)).toBeInTheDocument()
  })
})

describe('Results: missing', () => {
  it('explains when there are no results for a quiz', async () => {
    renderApp('/quiz/unknown/results')
    expect(await screen.findByRole('heading', { level: 1, name: 'Results not found' })).toBeInTheDocument()
  })
})
