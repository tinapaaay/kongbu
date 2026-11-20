import type { ChapterContent } from '../schemas'
import { chapter11Lesson } from './lesson'
import { chapter11Questions } from './questions'

/**
 * Chapter 11's lesson and questions. This file is loaded only when Chapter 11 is needed,
 * so it becomes its own small download instead of part of the main app file.
 * (Its concepts stay in the main file, because every screen shows concept names.)
 */
export const chapterContent: ChapterContent = { lesson: chapter11Lesson, questions: chapter11Questions }
