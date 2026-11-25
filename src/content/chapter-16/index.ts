import type { ChapterContent } from '../schemas'
import { chapter16Lesson } from './lesson'
import { chapter16Questions } from './questions'

/**
 * Chapter 16's lesson and questions. This file is loaded only when Chapter 16 is needed,
 * so it becomes its own small download instead of part of the main app file.
 * (Its concepts stay in the main file, because every screen shows concept names.)
 */
export const chapterContent: ChapterContent = { lesson: chapter16Lesson, questions: chapter16Questions }
