// @vitest-environment node
/// <reference types="node" />
import { PGlite } from '@electric-sql/pglite'
import { readFile } from 'node:fs/promises'
import { afterAll, beforeAll, expect, it } from 'vitest'

const db = new PGlite()
const alice = '00000000-0000-0000-0000-000000000001'
const bob = '00000000-0000-0000-0000-000000000002'
beforeAll(async () => {
  await db.exec(`
    create role anon; create role authenticated;
    create schema auth;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    grant usage on schema auth to authenticated;
    insert into auth.users values ('${alice}'), ('${bob}');
  `)
  await db.exec(await readFile(new URL('../../supabase/migrations/202611210001_progress.sql', import.meta.url), 'utf8'))
}, 30_000)
afterAll(async () => { await db.close() })

for (const table of ['learner_quizzes', 'learner_attempts', 'learner_visits']) {
  it(`${table}: isolates learners, rejects spoofing, and keeps duplicate records immutable`, async () => {
    await db.exec(`set role authenticated; set request.jwt.claim.sub = '${alice}';`)
    await db.query(`insert into public.${table} (user_id,id,payload) values ($1,'one','{"id":"one","answer":"first"}')`, [alice])
    await db.query(`insert into public.${table} (user_id,id,payload) values ($1,'one','{"id":"one","answer":"changed"}') on conflict (user_id,id) do nothing`, [alice])
    expect((await db.query<{ payload: { answer: string } }>(`select payload from public.${table}`)).rows[0].payload.answer).toBe('first')
    await expect(db.query(`insert into public.${table} (user_id,id,payload) values ($1,'spoof','{"id":"spoof"}')`, [bob])).rejects.toThrow(/row-level security/)
    await expect(db.query(`insert into public.${table} (user_id,id,payload,received_at) values ($1,'time','{"id":"time"}',now())`, [alice])).rejects.toThrow(/permission denied/)
    await expect(db.exec(`update public.${table} set payload = '{}'`)).rejects.toThrow(/permission denied/)
    await expect(db.exec(`delete from public.${table}`)).rejects.toThrow(/permission denied/)
    await db.exec(`set request.jwt.claim.sub = '${bob}';`)
    expect((await db.query(`select * from public.${table}`)).rows).toEqual([])
    await db.query(`insert into public.${table} (user_id,id,payload) values ($1,'one','{"id":"one"}')`, [bob])
    expect((await db.query(`select * from public.${table}`)).rows).toHaveLength(1)
    // Size limit: one account can't fill the database with huge rows.
    // Varied text (not one repeated letter) so the size can't hide behind compression.
    const filler = (n: number) => Array.from({ length: n }, (_, i) => (i * 7919).toString(36)).join('')
    await expect(db.query(`insert into public.${table} (user_id,id,payload) values ($1,'big',$2::jsonb)`,
      [bob, JSON.stringify({ id: 'big', filler: filler(6_000) })])).rejects.toThrow(/payload_size/)
    // A record about 5x a real finished quiz is still accepted.
    await db.query(`insert into public.${table} (user_id,id,payload) values ($1,'normal',$2::jsonb)`,
      [bob, JSON.stringify({ id: 'normal', filler: filler(1_500) })])
    await db.exec('set role anon;')
    await expect(db.exec(`select * from public.${table}`)).rejects.toThrow(/permission denied/)
    await db.exec('reset role;')
  })
}

it('every table has an index for "rows received since", so incremental downloads stay fast', async () => {
  const { rows } = await db.query<{ tablename: string; indexdef: string }>(
    `select tablename, indexdef from pg_indexes where schemaname = 'public' and indexdef like '%(user_id, received_at, id)%' order by tablename`)
  expect(rows.map((r) => r.tablename)).toEqual(['learner_attempts', 'learner_quizzes', 'learner_visits'])
})
