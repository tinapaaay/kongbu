import type { z } from 'zod'
import {
  chapterSchema,
  conceptSchema,
  lessonSchema,
  questionSchema,
  type Chapter,
  type Concept,
  type Lesson,
  type Question,
} from './schemas'

export interface ContentBundle {
  chapters: Chapter[]
  concepts: Concept[]
  questions: Question[]
  lessons: Lesson[]
}

/** Every available chapter needs at least this many questions to build a 10-question quiz. */
export const MIN_QUESTIONS_PER_AVAILABLE_CHAPTER = 10

const CIRCLED_NUMBERS = /[①②③④]/

/**
 * Checks all content together. Returns a list of readable problems; an empty list means valid.
 * Schemas check each item's shape. This function also checks how items relate:
 * references point to real things, ids are unique, and answer keys make sense.
 */
export function validateContent({ chapters, concepts, questions, lessons }: ContentBundle): string[] {
  const errors: string[] = []

  // 1. Shape of each item.
  checkShapes(errors, 'chapter', chapters, chapterSchema, (c) => c.id)
  checkShapes(errors, 'concept', concepts, conceptSchema, (c) => c.id)
  checkShapes(errors, 'question', questions, questionSchema, (q) => q.id)
  checkShapes(errors, 'lesson', lessons, lessonSchema, (l) => l.chapterId)

  // 2. Chapters: exactly 1–60 in order, ids match numbers, books match numbers.
  chapters.forEach((chapter, index) => {
    const expected = index + 1
    if (chapter.number !== expected) errors.push(`chapter at position ${expected} has number ${chapter.number}`)
    if (chapter.id !== `ch${chapter.number}`) errors.push(`chapter ${chapter.number} has id "${chapter.id}"`)
    const volume = chapter.number <= 30 ? 1 : 2
    if (chapter.textbookRef.volume !== volume) errors.push(`chapter ${chapter.number} should be in book ${volume}`)
  })
  if (chapters.length !== 60) errors.push(`expected 60 chapters, found ${chapters.length}`)

  const chapterById = new Map(chapters.map((c) => [c.id, c]))
  const conceptById = new Map(concepts.map((c) => [c.id, c]))

  // 3. Concepts.
  findDuplicates(concepts.map((c) => c.id)).forEach((id) => errors.push(`duplicate concept id "${id}"`))
  for (const concept of concepts) {
    if (!chapterById.has(concept.chapterId)) errors.push(`concept "${concept.id}" uses unknown chapter "${concept.chapterId}"`)
    if (!concept.id.startsWith(`${concept.kind}.`)) errors.push(`concept "${concept.id}" id does not match kind "${concept.kind}"`)
    for (const prerequisite of concept.prerequisiteIds) {
      if (!conceptById.has(prerequisite)) errors.push(`concept "${concept.id}" has unknown prerequisite "${prerequisite}"`)
    }
  }

  // 4. Questions.
  findDuplicates(questions.map((q) => q.id)).forEach((id) => errors.push(`duplicate question id "${id}"`))
  for (const question of questions) {
    const where = `question "${question.id}"`
    const chapter = chapterById.get(question.chapterId)
    if (!chapter) errors.push(`${where} uses unknown chapter "${question.chapterId}"`)
    else if (chapter.contentStatus !== 'available') errors.push(`${where} belongs to chapter ${chapter.number}, which is not available`)
    if (!question.id.startsWith(`${question.chapterId}-`)) errors.push(`${where} id does not start with "${question.chapterId}-"`)

    const concept = conceptById.get(question.conceptId)
    if (!concept) errors.push(`${where} uses unknown concept "${question.conceptId}"`)
    else if (concept.chapterId !== question.chapterId) errors.push(`${where} uses concept "${concept.id}" from another chapter`)

    const choiceIds = question.choices.map((c) => c.id).sort().join('')
    if (choiceIds !== 'abcd') errors.push(`${where} must use choice ids a, b, c, d once each`)
    const texts = question.choices.map((c) => c.text.trim())
    if (new Set(texts).size !== texts.length) errors.push(`${where} has two identical choices`)
    if (texts.some((t) => t === '')) errors.push(`${where} has an empty choice`)
    if (!question.choices.some((c) => c.id === question.correctChoiceId)) {
      errors.push(`${where} answer "${question.correctChoiceId}" is not one of its choices`)
    }
    if (CIRCLED_NUMBERS.test(question.explanation)) {
      errors.push(`${where} explanation mentions ①–④, which breaks when choices are shuffled`)
    }
  }

  // 5. Lessons.
  const lessonChapters = new Set(lessons.map((l) => l.chapterId))
  for (const lesson of lessons) {
    const where = `lesson for "${lesson.chapterId}"`
    if (!chapterById.has(lesson.chapterId)) errors.push(`${where} uses an unknown chapter`)
    const conceptIds = [
      ...lesson.vocabulary.map((v) => v.conceptId),
      ...lesson.grammar.map((g) => g.conceptId),
      lesson.culture.conceptId,
    ]
    for (const id of conceptIds) {
      if (!conceptById.has(id)) errors.push(`${where} uses unknown concept "${id}"`)
    }
    for (const point of lesson.grammar) {
      for (const example of point.examples) {
        if (example.highlight && !example.ko.includes(example.highlight)) {
          errors.push(`${where}: highlight "${example.highlight}" is not in "${example.ko}"`)
        }
      }
    }
  }

  // 6. Available chapters must be complete; planned chapters must be empty.
  for (const chapter of chapters) {
    const count = questions.filter((q) => q.chapterId === chapter.id).length
    if (chapter.contentStatus === 'available') {
      if (!lessonChapters.has(chapter.id)) errors.push(`chapter ${chapter.number} is available but has no lesson`)
      if (count < MIN_QUESTIONS_PER_AVAILABLE_CHAPTER) {
        errors.push(`chapter ${chapter.number} is available but has only ${count} questions`)
      }
    }
  }

  return errors
}

function checkShapes<T>(
  errors: string[],
  label: string,
  items: T[],
  schema: z.ZodType,
  idOf: (item: T) => string,
) {
  for (const item of items) {
    const result = schema.safeParse(item)
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`${label} "${idOf(item)}" ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      }
    }
  }
}

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value)
    seen.add(value)
  }
  return [...duplicates]
}
