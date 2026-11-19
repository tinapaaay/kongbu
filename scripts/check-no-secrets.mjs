// Fails if anything that looks like a secret ended up in the built site (dist/).
// Everything in dist/ is sent to every visitor's browser, so it must never contain keys.
// Run after `npm run build`.
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

const DIST = 'dist'

const patterns = [
  ['OpenAI-style key', /sk-[A-Za-z0-9_-]{20,}/],
  ['Supabase service key name', /SUPABASE_SERVICE_ROLE/i],
  ['OpenAI key name', /OPENAI_API_KEY/i],
  ['JWT-looking token', /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ['Bearer token', /Bearer\s+[A-Za-z0-9._-]{20,}/],
  ['Private key block', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['GitHub token', /gh[pousr]_[A-Za-z0-9]{30,}/],
]

async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => (entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)])),
  )
  return nested.flat()
}

let all
try {
  all = (await files(DIST)).filter((f) => /\.(js|css|html|json|map|txt)$/.test(f))
} catch {
  console.error('No dist/ folder. Run `npm run build` first.')
  process.exit(1)
}

const findings = []
for (const file of all) {
  const text = await readFile(file, 'utf8')
  for (const [label, pattern] of patterns) {
    if (pattern.test(text)) findings.push(`${file}: ${label}`)
  }
}

if (findings.length > 0) {
  console.error('Possible secrets in the built site:\n' + findings.map((f) => `  - ${f}`).join('\n'))
  process.exit(1)
}
console.log(`No secrets found in ${all.length} built files.`)
