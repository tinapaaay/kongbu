/**
 * Every chapter's content at once, loaded the ordinary way.
 * For tests and content validation only: the app itself must use loadChapterContent(),
 * or every chapter would end up back in the main download. The architecture test enforces this.
 */
import { chapterContent as chapter1 } from './chapter-01/index'
import { chapterContent as chapter11 } from './chapter-11/index'
import { chapterContent as chapter12 } from './chapter-12/index'
import type { Lesson, Question } from './schemas'

const all = [chapter1, chapter11, chapter12]

export * from './index'
export const questions: Question[] = all.flatMap((c) => c.questions)
export const lessons: Lesson[] = all.flatMap((c) => (c.lesson ? [c.lesson] : []))

export function getLesson(chapterId: string): Lesson | undefined {
  return lessons.find((l) => l.chapterId === chapterId)
}

/** Questions for one chapter only. */
export function getQuestionsForChapter(chapterId: string): Question[] {
  return questions.filter((q) => q.chapterId === chapterId)
}
