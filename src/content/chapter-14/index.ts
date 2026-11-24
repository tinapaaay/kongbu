import type { ChapterContent } from '../schemas'
import { chapter14Lesson } from './lesson'
import { chapter14Questions } from './questions'

/**
 * Chapter 14's lesson and questions. This file is loaded only when Chapter 14 is needed,
 * so it becomes its own small download instead of part of the main app file.
 * (Its concepts stay in the main file, because every screen shows concept names.)
 */
export const chapterContent: ChapterContent = { lesson: chapter14Lesson, questions: chapter14Questions }
