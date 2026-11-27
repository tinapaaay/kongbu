import type { ChapterContent } from '../schemas'
import { chapter17Lesson } from './lesson'
import { chapter17Questions } from './questions'

/**
 * Chapter 17's lesson and questions. This file is loaded only when Chapter 17 is needed,
 * so it becomes its own small download instead of part of the main app file.
 * (Its concepts stay in the main file, because every screen shows concept names.)
 */
export const chapterContent: ChapterContent = { lesson: chapter17Lesson, questions: chapter17Questions }
