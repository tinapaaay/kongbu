// Writes a teacher review sheet (printable HTML + CSV) for one chapter's questions, or every chapter's.
//   npm run export:review -- 11
//   npm run export:review -- --all
// Output goes to exports/, which Git ignores: the sheets are copies of src/content, never committed.
// See docs/content/teacher-review.md.
import { mkdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { runnerImport } from 'vite'

const args = process.argv.slice(2)
const all = args.includes('--all')
const numbers = args.filter((a) => /^\d+$/.test(a)).map(Number)
if (!all && numbers.length === 0) {
  console.error('Say which chapter: npm run export:review -- 11   (or --all for every chapter with questions)')
  process.exit(1)
}

// The content uses Vite features (import.meta.glob), so load it through Vite instead of plain Node.
// configFile: false skips the app's plugins (React, PWA), which loading data doesn't need.
async function load(file) {
  const { module } = await runnerImport(resolve(file), { configFile: false, logLevel: 'error' })
  return module
}
const content = await load('src/content/allContent.ts')
const sheet = await load('src/content/reviewSheet.ts')

const withQuestions = content.chapters.filter((c) => content.getQuestionsForChapter(c.id).length > 0)
const missing = numbers.filter((n) => !withQuestions.some((c) => c.number === n))
if (missing.length > 0) {
  console.error(`No questions for chapter ${missing.join(', ')}. Chapters with questions: ${withQuestions.map((c) => c.number).join(', ')}`)
  process.exit(1)
}

const targets = all ? withQuestions : withQuestions.filter((c) => numbers.includes(c.number))

const outDir = 'exports'
await mkdir(outDir, { recursive: true })
const generatedOn = new Date().toISOString().slice(0, 10)

for (const chapter of targets) {
  const input = { chapter, questions: content.getQuestionsForChapter(chapter.id), concepts: content.concepts, generatedOn }
  for (const [ext, build] of [['html', sheet.reviewSheetHtml], ['csv', sheet.reviewSheetCsv]]) {
    const path = join(outDir, sheet.reviewSheetFileName(chapter, ext))
    await writeFile(path, build(input), 'utf8')
    console.log(`Wrote ${path}`)
  }
}
