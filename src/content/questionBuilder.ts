import type { ChapterId, ChoiceId, Question } from './schemas'

/*
  Shared by every chapter's questions.ts, so all chapters build questions the same way.
  Only chapter files import this; it holds no study content itself.
*/

/** A question as a chapter writes it: four plain strings for choices, and the shared fields left out. */
export type QuestionInput = Omit<Question, 'choices' | 'source' | 'reviewStatus' | 'chapterId'> & {
  reviewStatus?: Question['reviewStatus']
  choices: [string, string, string, string]
}

const ids: ChoiceId[] = ['a', 'b', 'c', 'd']

/** Standard EPS-TOPIK instructions, written once so every chapter words them identically. */
export const PROMPTS = {
  blank: '빈칸에 들어갈 가장 알맞은 것을 고르십시오.',
  correctSentence: '다음 중 맞는 문장을 고르십시오.',
  readMatch: '다음 글을 읽고 내용과 같은 것을 고르십시오.',
} as const

/**
 * Returns a function that fills in the fields every question in one chapter shares
 * and turns four strings into choices a–d. Questions are original and start as drafts.
 */
export function questionMaker(chapterId: ChapterId): (input: QuestionInput) => Question {
  return (input) => ({
    ...input,
    chapterId,
    choices: input.choices.map((text, i) => ({ id: ids[i], text })),
    source: 'original',
    reviewStatus: input.reviewStatus ?? 'draft',
  })
}
