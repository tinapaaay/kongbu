// Fails if a stylesheet uses a font size that isn't a typography level in DESIGN.md.
// This stops "design drift": sizes typed by hand slowly moving away from the design system.
// To use a new size, add it to DESIGN.md first (with a reason), then use it.
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const design = await readFile('DESIGN.md', 'utf8')
const frontMatter = design.split(/^---$/m)[1] ?? ''
const typography = frontMatter.split(/^typography:$/m)[1]?.split(/^\S/m)[0] ?? ''
const allowed = new Set([...typography.matchAll(/fontSize:\s*(\d+)px/g)].map((m) => Number(m[1])))

if (allowed.size === 0) {
  console.error('Could not read any typography sizes from DESIGN.md.')
  process.exit(1)
}

async function cssFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const found = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) found.push(...(await cssFiles(path)))
    else if (entry.name.endsWith('.css') && entry.name !== 'tokens.css') found.push(path)
  }
  return found
}

const problems = []
for (const file of await cssFiles('src')) {
  const lines = (await readFile(file, 'utf8')).split('\n')
  lines.forEach((line, i) => {
    // `font-size: 14px` and the shorthand `font: 700 14px/1.2 ...`
    const match = line.match(/font-size:\s*(\d+)px/) ?? line.match(/\bfont:\s*(?:\d+\s+)?(\d+)px/)
    if (match && !allowed.has(Number(match[1]))) problems.push(`${file}:${i + 1}  ${match[1]}px`)
  })
}

if (problems.length > 0) {
  console.error(`Font sizes not in DESIGN.md (allowed: ${[...allowed].sort((a, b) => a - b).join(', ')}px):`)
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}
console.log(`Every font size matches DESIGN.md (${allowed.size} levels).`)
