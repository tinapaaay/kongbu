import type { ChapterContent } from '../schemas'
import { chapter1Lesson } from './lesson'
import { chapter1Questions } from './questions'

/**
 * Chapter 1's lesson and questions. This file is loaded only when Chapter 1 is needed,
 * so it becomes its own small download instead of part of the main app file.
 * (Its concepts stay in the main file, because every screen shows concept names.)
 */
export const chapterContent: ChapterContent = { lesson: chapter1Lesson, questions: chapter1Questions }
