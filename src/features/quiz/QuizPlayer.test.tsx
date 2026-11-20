import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { questions } from '../../content/allContent'
import type { ActiveSession } from '../../domain/learnerData'
import { buildChapterSession } from '../../domain/quiz/buildSession'
import { seededRandom, sequentialIds } from '../../domain/random'
import { renderApp } from '../../test/renderApp'
import { readSaved, storageWith } from '../../test/seed'

const questionsById = new Map(questions.map((q) => [q.id, q]))

/** A fixed quiz, so every test knows which question appears where. */
function makeQuiz(): ActiveSession {
  const result = buildChapterSession({
    chapterId: 'ch11',
    questions,
    attempts: [],
    now: new Date('2026-11-20T09:00:00.000Z'),
    random: seededRandom(42),
    makeId: sequentialIds('quiz'),
  })
  if (!result.ok) throw new Error('expected a quiz')
  return result.session
}

async function openQuiz(quiz = makeQuiz(), storage = storageWith({ activeSession: quiz })) {
  const user = userEvent.setup()
  const view = renderApp(`/quiz/${quiz.id}`, { storage })
  await screen.findByRole('group', { name: /^1\./ })
  return { quiz, storage, user, view }
}

function currentQuestion() {
  return screen.getByRole('group', { name: /^\d+\./ })
}

function radioFor(choiceId: string) {
  return within(currentQuestion()).getAllByRole('radio').find((r) => (r as HTMLInputElement).value === choiceId)!
}

describe('Quiz player: answering', () => {
  it('shows one question with four numbered choices in the saved shuffled order', async () => {
    const { quiz } = await openQuiz()
    const first = questionsById.get(quiz.questionIds[0])!
    const expectedOrder = quiz.choiceOrder[first.id].map((id) => first.choices.find((c) => c.id === id)!.text)

    const radios = within(currentQuestion()).getAllByRole('radio')
    expect(radios).toHaveLength(4)
    expect(radios.map((r) => r.closest('label')!.textContent)).toEqual(
      expectedOrder.map((text, i) => `${['①', '②', '③', '④'][i]}${text}`),
    )
    expect(screen.queryByText('Draft question · not yet reviewed')).not.toBeInTheDocument()
  })

  it('never shows the answer key or explanation before submitting', async () => {
    const { quiz } = await openQuiz()
    const first = questionsById.get(quiz.questionIds[0])!
    expect(screen.queryByText(first.explanation)).not.toBeInTheDocument()
    expect(screen.queryByText(/Correct answer|Incorrect/)).not.toBeInTheDocument()
  })

  it('saves an answer the moment it is chosen', async () => {
    const { quiz, storage, user } = await openQuiz()
    const firstId = quiz.questionIds[0]
    await user.click(radioFor('b'))

    expect(radioFor('b')).toBeChecked()
    expect(within(currentQuestion()).getByText('Selected')).toBeInTheDocument()
    expect(readSaved(storage).activeSession?.answers[firstId]).toBe('b')
    expect(screen.getByRole('button', { name: 'Question 1, answered' })).toBeInTheDocument()
    expect(screen.getByText(/of/).closest('p')).toHaveTextContent('1 of 10 answered')
  })

  it('moves between questions with Next, Previous, and the question numbers', async () => {
    const { user } = await openQuiz()
    expect(screen.getByRole('button', { name: '← Previous' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Next →' }))
    expect(currentQuestion()).toHaveAccessibleName(/^2\./)

    await user.click(screen.getByRole('button', { name: 'Question 7, not answered' }))
    expect(currentQuestion()).toHaveAccessibleName(/^7\./)

    await user.click(screen.getByRole('button', { name: '← Previous' }))
    expect(currentQuestion()).toHaveAccessibleName(/^6\./)
  })

  it('supports keyboard shortcuts: 1–4 to choose, arrows to move', async () => {
    const { quiz, storage, user } = await openQuiz()
    await user.keyboard('3')
    expect(readSaved(storage).activeSession?.answers[quiz.questionIds[0]]).toBe(quiz.choiceOrder[quiz.questionIds[0]][2])

    await user.keyboard('{ArrowRight}')
    expect(currentQuestion()).toHaveAccessibleName(/^2\./)
    await user.keyboard('{ArrowLeft}')
    expect(currentQuestion()).toHaveAccessibleName(/^1\./)
  })

  it('resumes at the same question with the same answers after a refresh', async () => {
    const { storage, user, view } = await openQuiz()
    await user.click(radioFor('c'))
    await user.click(screen.getByRole('button', { name: 'Question 3, not answered' }))
    view.unmount()

    const saved = readSaved(storage).activeSession!
    renderApp(`/quiz/${saved.id}`, { storage })
    expect(await screen.findByRole('group', { name: /^3\./ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Question 1, answered' })).toBeInTheDocument()
  })
})

describe('Quiz player: submitting', () => {
  it('warns about unanswered questions and lets the learner go back', async () => {
    const { user } = await openQuiz()
    await user.click(radioFor('a'))
    await user.click(screen.getByRole('button', { name: 'Submit quiz' }))

    const dialog = await screen.findByRole('dialog', { name: 'Submit your quiz?' })
    expect(dialog).toHaveTextContent('9 questions are unanswered: 2, 3, 4, 5, 6, 7, 8, 9, 10')
    await user.click(within(dialog).getByRole('button', { name: 'Go back' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('scores every question exactly once and opens the results', async () => {
    const { quiz, storage, user } = await openQuiz()

    // Answer the first 7 correctly and leave the rest blank.
    for (let i = 0; i < 7; i++) {
      await user.click(radioFor(questionsById.get(quiz.questionIds[i])!.correctChoiceId))
      await user.click(screen.getByRole('button', { name: 'Next →' }))
    }
    await user.click(screen.getByRole('button', { name: 'Submit quiz' }))
    const dialog = await screen.findByRole('dialog', { name: 'Submit your quiz?' })
    await user.click(within(dialog).getByRole('button', { name: 'Submit anyway' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Results' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Score' })).toHaveTextContent('7/ 1070%')

    const saved = readSaved(storage)
    expect(saved.activeSession).toBeNull()
    expect(saved.sessions).toHaveLength(1)
    expect(saved.sessions[0]).toMatchObject({ id: quiz.id, correctCount: 7, totalCount: 10 })
    expect(saved.attempts).toHaveLength(10)
    expect(saved.attempts.filter((a) => a.selectedChoiceId === null)).toHaveLength(3)
    expect(saved.attempts.every((a) => a.durationMs === undefined || a.durationMs >= 0)).toBe(true)
  })

  it('sends a submitted quiz address to its results instead of reopening it', async () => {
    const { quiz, storage, user, view } = await openQuiz()
    await user.click(screen.getByRole('button', { name: 'Submit quiz' }))
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Submit anyway' }))
    await screen.findByRole('heading', { level: 1, name: 'Results' })
    view.unmount()

    renderApp(`/quiz/${quiz.id}`, { storage })
    expect(await screen.findByRole('heading', { level: 1, name: 'Results' })).toBeInTheDocument()
  })
})

describe('Quiz player: exiting', () => {
  it('asks before leaving, then keeps the quiz to resume later', async () => {
    const { quiz, storage, user } = await openQuiz()
    await user.click(radioFor('d'))
    await user.click(screen.getByRole('button', { name: /Exit quiz/ }))

    const dialog = await screen.findByRole('dialog', { name: 'Leave this quiz?' })
    await user.click(within(dialog).getByRole('button', { name: 'Keep going' }))
    expect(currentQuestion()).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Exit quiz/ }))
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Leave quiz' }))

    expect(await screen.findByRole('link', { name: 'Resume quiz' })).toHaveAttribute('href', `/quiz/${quiz.id}`)
    expect(readSaved(storage).activeSession?.answers[quiz.questionIds[0]]).toBe('d')
  })
})
