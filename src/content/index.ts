/**
 * The only door into study content. Screens and rules import from here,
 * never from individual chapter files, so content can move without breaking them.
 */
import { chapters } from './chapters'
import { chapter11Concepts } from './chapter-11/concepts'
import { chapter11Lesson } from './chapter-11/lesson'
import { chapter11Questions } from './chapter-11/questions'
import type { Chapter, ChapterId, Concept, Lesson, Question } from './schemas'

export * from './schemas'
export { chapters }

export const concepts: Concept[] = [...chapter11Concepts]
export const questions: Question[] = [...chapter11Questions]
export const lessons: Lesson[] = [chapter11Lesson]

export function getChapterByNumber(number: number): Chapter | undefined {
  return chapters.find((c) => c.number === number)
}

export function getChapter(id: ChapterId | string): Chapter | undefined {
  return chapters.find((c) => c.id === id)
}

export function getLesson(chapterId: string): Lesson | undefined {
  return lessons.find((l) => l.chapterId === chapterId)
}

export function getConcept(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id)
}

/** Questions for one chapter only. This is what keeps quizzes from mixing in other chapters. */
export function getQuestionsForChapter(chapterId: string): Question[] {
  return questions.filter((q) => q.chapterId === chapterId)
}
