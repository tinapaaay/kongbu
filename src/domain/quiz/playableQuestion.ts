import type { Choice, ChoiceId, Question } from '../../content/schemas'

/**
 * What the quiz screen is allowed to see before submission.
 * It deliberately has no correctChoiceId and no explanation, so the quiz
 * screen cannot reveal the answer even by accident. TypeScript enforces this.
 */
export interface PlayableQuestion {
  id: string
  chapterId: string
  format: Question['format']
  prompt: string
  context?: Question['context']
  /** Choices in this quiz's shuffled order. Display them as ①②③④ by position. */
  choices: Choice[]
  reviewStatus: Question['reviewStatus']
}

export const CHOICE_MARKERS = ['①', '②', '③', '④'] as const

export function toPlayableQuestion(question: Question, order: ChoiceId[]): PlayableQuestion {
  const byId = new Map(question.choices.map((c) => [c.id, c]))
  const choices = order.map((id) => {
    const choice = byId.get(id)
    if (!choice) throw new Error(`Question ${question.id} has no choice "${id}"`)
    return { id: choice.id, text: choice.text }
  })
  return {
    id: question.id,
    chapterId: question.chapterId,
    format: question.format,
    prompt: question.prompt,
    context: question.context,
    choices,
    reviewStatus: question.reviewStatus,
  }
}

/**
 * Fill-in blanks are written as "(          )". Non-breaking spaces keep the blank
 * the same width and stop it from splitting across two lines on small screens.
 */
export function keepBlanksTogether(text: string): string {
  return text.replace(/\((\s+)\)/g, (_, spaces: string) => `(${'\u00a0'.repeat(spaces.length)})`)
}
