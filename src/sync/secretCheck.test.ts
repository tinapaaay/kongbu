// @vitest-environment node
/// <reference types="node" />
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, it } from 'vitest'

it('allows the public anon key but rejects service JWTs and secret keys in built files', () => {
  const root = mkdtempSync(join(tmpdir(), 'kongbu-secret-check-'))
  const script = fileURLToPath(new URL('../../scripts/check-no-secrets.mjs', import.meta.url))
  const jwt = (role: string) => [
    Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'),
    Buffer.from(JSON.stringify({ iss: 'supabase', role })).toString('base64url'),
    'synthetic_signature_for_scanner_test',
  ].join('.')
  try {
    mkdirSync(join(root, 'dist'))
    writeFileSync(join(root, 'dist', 'app.js'), jwt('anon'))
    expect(() => execFileSync(process.execPath, [script], { cwd: root, stdio: 'pipe' })).not.toThrow()
    for (const secret of [jwt('service_role'), 'sb_secret_synthetic_test_value']) {
      writeFileSync(join(root, 'dist', 'app.js'), secret)
      expect(() => execFileSync(process.execPath, [script], { cwd: root, stdio: 'pipe' })).toThrow()
    }
  } finally { rmSync(root, { recursive: true, force: true }) }
})
