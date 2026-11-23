import type { ChapterContent } from '../schemas'
import { chapter12Lesson } from './lesson'
import { chapter12Questions } from './questions'

/**
 * Chapter 12's lesson and questions. This file is loaded only when Chapter 12 is needed,
 * so it becomes its own small download instead of part of the main app file.
 * (Its concepts stay in the main file, because every screen shows concept names.)
 */
export const chapterContent: ChapterContent = { lesson: chapter12Lesson, questions: chapter12Questions }
