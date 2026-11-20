import { use } from 'react'
import { hasContent, loadChapterContent, type ChapterContent, type Question } from './index'

const NO_CONTENT: ChapterContent = { questions: [] }

/**
 * A chapter's lesson and questions, for use inside a component.
 * While the chapter downloads, the component "suspends": the nearest <Suspense> shows its
 * loading message instead. If the download fails, the nearest error boundary shows a retry.
 * Chapters without content never download anything, so they never show "Loading…".
 */
export function useChapterContent(chapterId: string): ChapterContent {
  if (!hasContent(chapterId)) return NO_CONTENT
  return use(loadChapterContent(chapterId))
}

/**
 * Every question in the given chapters, by id. Used to show past answers from any chapter.
 * React's use() may be called in a loop (unlike other hooks), which is what allows any number of chapters.
 */
export function useQuestionsById(chapterIds: string[]): Map<string, Question> {
  const byId = new Map<string, Question>()
  for (const chapterId of [...new Set(chapterIds)].sort()) {
    if (!hasContent(chapterId)) continue
    for (const question of use(loadChapterContent(chapterId)).questions) byId.set(question.id, question)
  }
  return byId
}
