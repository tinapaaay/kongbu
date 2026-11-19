import { z } from 'zod'
import { chapterIdSchema, choiceIdSchema } from '../content/schemas'

/*
  Learner data: everything that changes as you study.
  Only facts are stored (what you answered, when). Scores, mistakes, and chapter
  status are calculated from these facts, so they can never disagree with each other.
  Milestone 5 saves this to browser storage and uses these schemas to check it on load.
*/

const isoDateTime = z.iso.datetime()

/** A quiz in progress. Saved after every answer so a refresh resumes exactly here. */
export const activeSessionSchema = z.object({
  id: z.string().min(1),
  type: z.literal('chapter-practice'),
  chapterId: chapterIdSchema,
  startedAt: isoDateTime,
  questionIds: z.array(z.string()).min(1),
  /** The shuffled display order of choices for each question, fixed for this quiz. */
  choiceOrder: z.record(z.string(), z.array(choiceIdSchema).length(4)),
  answers: z.record(z.string(), choiceIdSchema),
  durationsMs: z.record(z.string(), z.number().nonnegative()),
  currentIndex: z.number().int().nonnegative(),
})
export type ActiveSession = z.infer<typeof activeSessionSchema>

/** A submitted quiz. The score is stored as a convenience; attempts remain the source of truth. */
export const completedSessionSchema = z.object({
  id: z.string().min(1),
  type: z.literal('chapter-practice'),
  chapterId: chapterIdSchema,
  startedAt: isoDateTime,
  submittedAt: isoDateTime,
  questionIds: z.array(z.string()).min(1),
  choiceOrder: z.record(z.string(), z.array(choiceIdSchema).length(4)),
  correctCount: z.number().int().nonnegative(),
  totalCount: z.number().int().positive(),
})
export type CompletedSession = z.infer<typeof completedSessionSchema>

/** One answered (or skipped) question. Never edited after it is saved. */
export const attemptSchema = z.object({
  id: z.string().min(1),
  sessionId: z.string().min(1),
  questionId: z.string().min(1),
  /** null means the question was left unanswered. */
  selectedChoiceId: choiceIdSchema.nullable(),
  /** Copied from the answer key at submission, so later edits to a question can't rewrite history. */
  correctChoiceId: choiceIdSchema,
  isCorrect: z.boolean(),
  chapterId: chapterIdSchema,
  conceptId: z.string().min(1),
  answeredAt: isoDateTime,
  durationMs: z.number().nonnegative().optional(),
})
export type Attempt = z.infer<typeof attemptSchema>

export const chapterVisitSchema = z.object({
  firstAt: isoDateTime,
  lastAt: isoDateTime,
})
export type ChapterVisit = z.infer<typeof chapterVisitSchema>

export const learnerDataSchema = z.object({
  schemaVersion: z.literal(1),
  chapterVisits: z.record(z.string(), chapterVisitSchema),
  activeSession: activeSessionSchema.nullable(),
  sessions: z.array(completedSessionSchema),
  attempts: z.array(attemptSchema),
  /** When a backup file was last downloaded. null means never. */
  lastBackupAt: isoDateTime.nullable(),
})
export type LearnerData = z.infer<typeof learnerDataSchema>

/** A brand-new learner: no visits, no quizzes, no attempts. */
export function emptyLearnerData(): LearnerData {
  return { schemaVersion: 1, chapterVisits: {}, activeSession: null, sessions: [], attempts: [], lastBackupAt: null }
}
