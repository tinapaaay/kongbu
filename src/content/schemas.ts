import { z } from 'zod'

/*
  Content schemas: the rules every piece of study material must follow.
  Each schema does two jobs:
  1. At test time, it checks the real content and rejects anything malformed.
  2. `z.infer` turns it into a TypeScript type, so the code and the rules can't drift apart.
*/

/** "ch11" style id. The number must match the chapter's `number`. */
export const chapterIdSchema = z.string().regex(/^ch([1-9]|[1-5]\d|60)$/, 'Chapter ids look like "ch11" (1–60)')
export type ChapterId = `ch${number}`

/** Where something came from in the textbook. Volume 1 is chapters 1–30, volume 2 is 31–60. */
export const textbookRefSchema = z.object({
  volume: z.union([z.literal(1), z.literal(2)]),
  page: z.number().int().positive(),
})
export type TextbookRef = z.infer<typeof textbookRefSchema>

export const chapterSchema = z.object({
  id: chapterIdSchema,
  number: z.number().int().min(1).max(60),
  titleKo: z.string().min(1),
  titleEn: z.string().min(1),
  /** "available" means the chapter has lesson content and questions in the app. */
  contentStatus: z.enum(['planned', 'available']),
  textbookRef: textbookRefSchema,
  /** "verified" means the titles were checked against the textbook's contents page. */
  verification: z.enum(['unverified', 'verified']),
})
export type Chapter = z.infer<typeof chapterSchema>

export const conceptSchema = z.object({
  /** Readable, stable id such as "grammar.a-eo-ya-doeda". */
  id: z.string().regex(/^(grammar|vocabulary|culture)\.[a-z0-9-]+$/),
  kind: z.enum(['grammar', 'vocabulary', 'culture']),
  label: z.string().min(1),
  labelEn: z.string().min(1),
  chapterId: chapterIdSchema,
  textbookRef: textbookRefSchema,
  prerequisiteIds: z.array(z.string()),
})
export type Concept = z.infer<typeof conceptSchema>

/** Choice ids are identities, not positions. The app may shuffle choices. */
export const choiceIdSchema = z.enum(['a', 'b', 'c', 'd'])
export type ChoiceId = z.infer<typeof choiceIdSchema>

export const choiceSchema = z.object({
  id: choiceIdSchema,
  text: z.string().min(1),
})
export type Choice = z.infer<typeof choiceSchema>

export const questionFormatSchema = z.enum([
  'vocabulary',
  'sentence-completion',
  'grammar',
  'dialogue-completion',
  'reading',
])
export type QuestionFormat = z.infer<typeof questionFormatSchema>

export const questionSchema = z.object({
  id: z.string().regex(/^ch\d+-q\d{3}$/, 'Question ids look like "ch11-q001"'),
  chapterId: chapterIdSchema,
  /** The one concept to blame when this question is missed. */
  conceptId: z.string(),
  format: questionFormatSchema,
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  /** The instruction, e.g. "빈칸에 들어갈 가장 알맞은 것을 고르십시오." */
  prompt: z.string().min(1),
  /** Optional sentence, dialogue, or passage shown in a box under the prompt. */
  context: z
    .object({
      kind: z.enum(['sentence', 'dialogue', 'passage']),
      text: z.string().min(1),
    })
    .optional(),
  choices: z.array(choiceSchema).length(4, 'Every question needs exactly four choices'),
  correctChoiceId: choiceIdSchema,
  /** Shown after submitting. Must not mention ①–④, because choices may be shuffled. */
  explanation: z.string().min(20),
  source: z.literal('original'),
  reviewStatus: z.enum(['draft', 'approved']),
})
export type Question = z.infer<typeof questionSchema>

/* ---------- Lesson content (what the chapter page shows) ---------- */

export const vocabularyItemSchema = z.object({
  ko: z.string().min(1),
  en: z.string().min(1),
})

export const vocabularyGroupSchema = z.object({
  titleKo: z.string().min(1),
  titleEn: z.string().min(1),
  conceptId: z.string(),
  textbookRef: textbookRefSchema,
  items: z.array(vocabularyItemSchema).min(1),
})

export const exampleSchema = z.object({
  ko: z.string().min(1),
  en: z.string().min(1),
  /** The part of `ko` to highlight as the target grammar. Must appear in `ko`. */
  highlight: z.string().optional(),
})

export const grammarPointSchema = z.object({
  conceptId: z.string(),
  pattern: z.string().min(1),
  meaningEn: z.string().min(1),
  explanationEn: z.string().min(1),
  /** Conjugation rules, shown as a table. */
  rules: z.array(z.object({ when: z.string(), form: z.string(), example: z.string() })).min(1),
  examples: z.array(exampleSchema).min(1),
  notes: z.array(z.string()),
  textbookRef: textbookRefSchema,
})

export const lessonSchema = z.object({
  chapterId: chapterIdSchema,
  objectives: z.array(z.object({ ko: z.string(), en: z.string() })).min(1),
  vocabulary: z.array(vocabularyGroupSchema).min(1),
  grammar: z.array(grammarPointSchema).min(1),
  culture: z.object({
    conceptId: z.string(),
    titleKo: z.string(),
    titleEn: z.string(),
    paragraphs: z.array(z.string()).min(1),
    textbookRef: textbookRefSchema,
  }),
})
export type VocabularyGroup = z.infer<typeof vocabularyGroupSchema>
export type GrammarPoint = z.infer<typeof grammarPointSchema>
export type Lesson = z.infer<typeof lessonSchema>
