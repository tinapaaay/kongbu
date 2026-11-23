/**
 * Every chapter's content at once, loaded the ordinary way.
 * For tests and content validation only: the app itself must use loadChapterContent(),
 * or every chapter would end up back in the main download. The architecture test enforces this.
 */
import type { ChapterContent, Lesson, Question } from './schemas'

/** Every chapter folder's content, found the same way index.ts finds them, in chapter order. */
const modules = import.meta.glob<ChapterContent>('./chapter-*/index.ts', { eager: true, import: 'chapterContent' })
const all = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
  .map(([, content]) => content)

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
