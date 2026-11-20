// Fails if a chapter's questions ended up in the main app file instead of their own on-demand file.
// Every chapter in the main file would make every visit download all of them (issue #3).
// Run after `npm run build`.
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const html = await readFile('dist/index.html', 'utf8')
const entry = html.match(/<script[^>]+src="\/([^"]+\.js)"/)?.[1]
if (!entry) {
  console.error('Could not find the main script in dist/index.html. Run `npm run build` first.')
  process.exit(1)
}

const chapterDirs = (await readdir('src/content', { withFileTypes: true }))
  .filter((d) => d.isDirectory() && /^chapter-\d+$/.test(d.name))
  .map((d) => d.name)

const scripts = (await readdir('dist/assets')).filter((f) => f.endsWith('.js'))
const main = await readFile(join('dist', entry), 'utf8')
const others = await Promise.all(
  scripts.filter((f) => `assets/${f}` !== entry).map(async (f) => ({ f, text: await readFile(join('dist/assets', f), 'utf8') })),
)

const problems = []
for (const dir of chapterDirs) {
  // A sentence that appears only in this chapter's questions: the first explanation.
  const source = await readFile(join('src/content', dir, 'questions.ts'), 'utf8')
  const marker = source.match(/explanation:\s*'([^']{20,60})/)?.[1]
  if (!marker) {
    problems.push(`${dir}: could not find a question explanation to look for`)
    continue
  }
  if (main.includes(marker)) problems.push(`${dir}: its questions are in the main file (${entry})`)
  const own = others.find((o) => o.text.includes(marker))
  if (!own) problems.push(`${dir}: its questions are not in any separate file`)
  else console.log(`${dir} loads on demand from assets/${own.f}`)
}

if (problems.length > 0) {
  for (const problem of problems) console.error(problem)
  process.exit(1)
}
