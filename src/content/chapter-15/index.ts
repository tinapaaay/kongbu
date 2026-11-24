import type { ChapterContent } from '../schemas'
import { chapter15Lesson } from './lesson'
import { chapter15Questions } from './questions'

/**
 * Chapter 15's lesson and questions. This file is loaded only when Chapter 15 is needed,
 * so it becomes its own small download instead of part of the main app file.
 * (Its concepts stay in the main file, because every screen shows concept names.)
 */
export const chapterContent: ChapterContent = { lesson: chapter15Lesson, questions: chapter15Questions }
