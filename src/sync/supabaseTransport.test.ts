import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { emptyLearnerData } from '../domain/learnerData'
import { makeAttempt } from '../domain/testFixtures'
import { createSupabaseTransport } from './supabaseTransport'

/** A stand-in for the Supabase client: uploads succeed, downloads return the given rows per table. */
function fakeClient(rows: Record<string, { id: string; payload: unknown; received_at: string }[]>) {
  return {
    from(table: string) {
      const read = { eq: () => read, order: () => read, range: () => read, abortSignal: async () => ({ data: rows[table] ?? [], error: null }) }
      return {
        upsert: () => ({ abortSignal: async () => ({ error: null }) }),
        select: () => read,
      }
    },
  } as unknown as SupabaseClient
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
