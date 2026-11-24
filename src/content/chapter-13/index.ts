import type { ChapterContent } from '../schemas'
import { chapter13Lesson } from './lesson'
import { chapter13Questions } from './questions'

/**
 * Chapter 13's lesson and questions. This file is loaded only when Chapter 13 is needed,
 * so it becomes its own small download instead of part of the main app file.
 * (Its concepts stay in the main file, because every screen shows concept names.)
 */
export const chapterContent: ChapterContent = { lesson: chapter13Lesson, questions: chapter13Questions }
