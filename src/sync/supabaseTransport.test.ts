import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { emptyLearnerData } from '../domain/learnerData'
import { makeAttempt } from '../domain/testFixtures'
import { createSupabaseTransport } from './supabaseTransport'

type Row = { id: string; payload: unknown; received_at: string }
/**
 * A stand-in for the Supabase client: uploads succeed, downloads return the given rows per table,
 * filtered like the server would by `gte('received_at', …)` and `in('id', …)`. `calls` records each filter.
 */
function fakeClient(rows: Record<string, Row[]>) {
  const calls: string[] = []
  const client = {
    from(table: string) {
      let result = rows[table] ?? []
      const read = {
        eq: () => read, order: () => read, range: () => read,
        gte: (_column: string, value: string) => { calls.push(`${table} since ${value}`); result = result.filter((r) => Date.parse(r.received_at) >= Date.parse(value)); return read },
        in: (_column: string, ids: string[]) => { calls.push(`${table} ids ${ids.join(',')}`); result = result.filter((r) => ids.includes(r.id)); return read },
        abortSignal: async () => ({ data: result, error: null }),
      }
      return {
        upsert: () => ({ abortSignal: async () => ({ error: null }) }),
        select: () => read,
      }
    },
  } as unknown as SupabaseClient
  return Object.assign(client, { calls })
}
const at = '2026-11-21T10:00:00.123456+00:00'

describe('downloading rows this app version cannot read', () => {
  afterEach(() => { vi.restoreAllMocks() })

  it('skips them and keeps syncing everything else, instead of failing every sync', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const good = makeAttempt({ id: 'good', questionId: 'ch11-q001', isCorrect: true })
    const transport = createSupabaseTransport(fakeClient({
      learner_attempts: [
        { id: 'good', payload: good, received_at: at },
        { id: 'future', payload: { id: 'future', shape: 'from a newer app version' }, received_at: at },
      ],
    }))
    const result = await transport.exchange('learner', emptyLearnerData())
    expect(result.attempts.map((a) => a.id)).toEqual(['good'])
    expect(result.attempts[0].serverReceivedAt).toBe('2026-11-21T10:00:00.123456Z')
    expect(result.skipped).toBe(1)
  })

  it('still marks a record this device is sending as received, even if its cloud copy is unreadable', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const mine = makeAttempt({ id: 'mine', questionId: 'ch11-q001', isCorrect: false })
    const transport = createSupabaseTransport(fakeClient({
      learner_attempts: [{ id: 'mine', payload: { id: 'mine', damaged: true }, received_at: at }],
    }))
    const result = await transport.exchange('learner', { ...emptyLearnerData(), attempts: [mine] })
    expect(result.attempts).toEqual([{ ...mine, serverReceivedAt: '2026-11-21T10:00:00.123456Z' }])
    expect(result.skipped).toBe(0)
  })
})

describe('downloading only what is new', () => {
  const early = '2026-11-21T09:00:00.000000+00:00'
  const late = '2026-11-21T11:00:00.000000+00:00'

  it('asks for rows received since the cursor and leaves older ones on the server', async () => {
    const old = makeAttempt({ id: 'old', questionId: 'ch11-q001', isCorrect: true })
    const fresh = makeAttempt({ id: 'fresh', questionId: 'ch11-q002', isCorrect: true })
    const client = fakeClient({ learner_attempts: [{ id: 'old', payload: old, received_at: early }, { id: 'fresh', payload: fresh, received_at: late }] })
    const result = await createSupabaseTransport(client).exchange('learner', emptyLearnerData(), { attempts: '2026-11-21T10:00:00.000Z' })
    expect(result.attempts.map((a) => a.id)).toEqual(['fresh'])
    expect(client.calls).toEqual(['learner_attempts since 2026-11-21T10:00:00.000Z'])
  })

  it('still confirms a record sent again whose first copy reached the server before the cursor', async () => {
    const resent = makeAttempt({ id: 'resent', questionId: 'ch11-q001', isCorrect: true })
    const client = fakeClient({ learner_attempts: [{ id: 'resent', payload: resent, received_at: early }] })
    const result = await createSupabaseTransport(client)
      .exchange('learner', { ...emptyLearnerData(), attempts: [resent] }, { attempts: '2026-11-21T10:00:00.000Z' })
    expect(result.attempts).toEqual([{ ...resent, serverReceivedAt: '2026-11-21T09:00:00.000000Z' }])
    expect(client.calls).toContain('learner_attempts ids resent')
  })
})
