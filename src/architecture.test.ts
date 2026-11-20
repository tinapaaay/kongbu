import { describe, expect, it } from 'vitest'

/**
 * Architecture rules, checked by reading the source files themselves.
 * They keep the layers from slowly leaking into each other (issues #1 and #2).
 */
const sources = import.meta.glob<string>(['./**/*.{ts,tsx}', '!./**/*.test.{ts,tsx}', '!./test/**'], {
  query: '?raw',
  import: 'default',
  eager: true,
})

/** Every `import ... from '...'` statement in a file, with whether it imports types only. */
function importsOf(source: string): { from: string; typeOnly: boolean }[] {
  return [...source.matchAll(/^import\s+(type\s+)?[^;]*?from\s+'([^']+)'/gm)].map((m) => ({
    from: m[2],
    typeOnly: m[1] !== undefined,
  }))
}

const files = Object.entries(sources).map(([path, source]) => ({ path: path.slice(2), imports: importsOf(source) }))

describe('architecture', () => {
  it('found the source files', () => {
    expect(files.length).toBeGreaterThan(40)
  })

  it('study rules in domain/ never load study content; they may use its types and shape rules (schemas)', () => {
    const problems = files
      .filter((f) => f.path.startsWith('domain/'))
      .flatMap((f) =>
        f.imports
          .filter((i) => i.from.includes('/content') && !i.typeOnly && !i.from.endsWith('/content/schemas'))
          .map((i) => `${f.path} → ${i.from}`),
      )
    expect(problems).toEqual([])
  })

  it('screens never import another screen’s folder; shared pieces live in practice/ or components/', () => {
    const problems = files
      .filter((f) => f.path.startsWith('features/'))
      .flatMap((f) => {
        const own = f.path.split('/')[1]
        return f.imports
          .filter((i) => /^\.\.\/[a-z-]+\//.test(i.from) && !i.from.startsWith(`../${own}/`))
          .map((i) => `${f.path} → ${i.from}`)
      })
    expect(problems).toEqual([])
  })

  it('domain/ and data/ never import screens', () => {
    const problems = files
      .filter((f) => f.path.startsWith('domain/') || f.path.startsWith('data/'))
      .flatMap((f) => f.imports.filter((i) => i.from.includes('features/') || i.from.includes('practice/')).map((i) => `${f.path} → ${i.from}`))
    expect(problems).toEqual([])
  })
})
