/**
 * The only door into study content. Screens and rules import from here,
 * never from individual chapter files, so content can move without breaking them.
 *
 * What loads with the app (small, needed on every screen): the 60 chapter titles and every concept name.
 * What loads on demand (large): each chapter's lesson and questions, one file per chapter,
 * through loadChapterContent() or the hooks in useChapterContent.ts.
 */
import { buildChapters } from './chapters'
import type { Chapter, ChapterContent, ChapterId, Concept } from './schemas'

export * from './schemas'

/*
  Chapters are found by folder: adding src/content/chapter-NN/ (with concepts.ts and index.ts)
  is all it takes to add a chapter. Nothing else needs a list of chapters.
*/

/** The chapter number in a path like "./chapter-07/index.ts". */
function chapterNumberOf(path: string): number {
  const match = path.match(/\/chapter-(\d+)\//)
  if (!match) throw new Error(`Not a chapter folder: ${path}`)
  return Number(match[1])
}

/** Every chapter's concept names, loaded with the app (small, and every screen shows them). */
const conceptModules = import.meta.glob<Concept[]>('./chapter-*/concepts.ts', { eager: true, import: 'concepts' })

/**
 * How to fetch each chapter's lesson and questions. Not `eager`, so the build tool puts each
 * chapter in its own file, downloaded the first time it's needed.
 */
const contentModules = import.meta.glob<ChapterContent>('./chapter-*/index.ts', { import: 'chapterContent' })

const loaders: Record<string, () => Promise<ChapterContent>> = Object.fromEntries(
  Object.entries(contentModules).map(([path, load]) => [`ch${chapterNumberOf(path)}`, load]),
)

export const chapters: Chapter[] = buildChapters(new Set(Object.keys(contentModules).map(chapterNumberOf)))

export const concepts: Concept[] = Object.entries(conceptModules)
  .sort(([a], [b]) => chapterNumberOf(a) - chapterNumberOf(b))
  .flatMap(([, list]) => list)

const NO_CONTENT: ChapterContent = { questions: [] }
const loaded = new Map<string, Promise<ChapterContent>>()

export function hasContent(chapterId: string): boolean {
  return chapterId in loaders
}

/**
 * The chapter's lesson and questions. Each chapter is downloaded once and then reused.
 * A failed download is remembered (so the page can show an error instead of retrying in a loop)
 * until forgetFailedChapters() is called, for example by a "Try again" button.
 */
export function loadChapterContent(chapterId: string): Promise<ChapterContent> {
  const existing = loaded.get(chapterId)
  if (existing) return existing

  const load = loaders[chapterId]
  const promise = load ? load() : Promise.resolve(NO_CONTENT)
  // React's use() reads these fields: once a chapter has loaded, revisiting it shows the page
  // straight away instead of flashing "Loading…" again.
  const tracked = promise as Promise<ChapterContent> & Record<string, unknown>
  tracked.status = 'pending'
  promise.then(
    (value) => Object.assign(tracked, { status: 'fulfilled', value }),
    (reason) => Object.assign(tracked, { status: 'rejected', reason }),
  )
  loaded.set(chapterId, promise)
  return promise
}

/** Lets failed chapter downloads be tried again. */
export function forgetFailedChapters(): void {
  for (const [chapterId, promise] of loaded) {
    if ((promise as Promise<ChapterContent> & { status?: string }).status === 'rejected') loaded.delete(chapterId)
  }
}

export function getChapterByNumber(number: number): Chapter | undefined {
  return chapters.find((c) => c.number === number)
}

export function getChapter(id: ChapterId | string): Chapter | undefined {
  return chapters.find((c) => c.id === id)
}

export function getConcept(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id)
}

/** The id of the place in a chapter's lesson that teaches a concept, for links like /learn/11#study-grammar-eul-geyo. */
export function studyAnchorId(conceptId: string): string {
  return `study-${conceptId.replace(/[^a-z0-9]+/gi, '-')}`
}

/**
 * The concepts a chapter teaches and tests. Validation guarantees each one has at least one question,
 * so this list is exactly what mastery has to cover.
 */
export function conceptIdsForChapter(chapterId: string): string[] {
  return concepts.filter((c) => c.chapterId === chapterId).map((c) => c.id)
}
