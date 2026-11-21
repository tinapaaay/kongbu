import type { SupabaseClient } from '@supabase/supabase-js'
import { emptyLearnerData, attemptSchema, completedSessionSchema, visitRecordSchema } from '../domain/learnerData'
import type { ExchangeResult, SyncTransport } from './syncRepository'

const PAGE_SIZE = 500
export function createSupabaseTransport(client: SupabaseClient): SyncTransport {
  return {
    async exchange(userId, pending) {
      const result: ExchangeResult = { ...emptyLearnerData(), skipped: 0 }
      const groups = [
        { table: 'learner_quizzes', key: 'sessions', schema: completedSessionSchema },
        { table: 'learner_attempts', key: 'attempts', schema: attemptSchema },
        { table: 'learner_visits', key: 'visitRecords', schema: visitRecordSchema },
      ] as const
      for (const { table, key, schema } of groups) {
        const records = pending[key]
        for (let start = 0; start < records.length; start += PAGE_SIZE) {
          const rows = records.slice(start, start + PAGE_SIZE).map(({ serverReceivedAt: _receipt, ...record }) => ({
            user_id: userId, id: record.id, payload: record,
          }))
          const { error } = await client.from(table).upsert(rows, { onConflict: 'user_id,id', ignoreDuplicates: true }).abortSignal(AbortSignal.timeout(15_000))
          if (error) {
            console.error('Kongbu sync: upload failed', error)
            throw new Error(/payload_size|check constraint/i.test(error.message ?? '')
              ? 'A saved record is too large to sync. Your progress is still safe on this device.'
              : 'Could not send progress. Check your connection and try Sync now.')
          }
        }
        // Full, paginated reads avoid missed ties and late commits in timestamp cursors.
        // Stable ID ordering makes the next poll recover inserts that fall behind a page boundary.
        for (let start = 0; ; start += PAGE_SIZE) {
          const { data, error } = await client.from(table).select('id,payload,received_at').eq('user_id', userId)
            .order('id').range(start, start + PAGE_SIZE - 1).abortSignal(AbortSignal.timeout(15_000))
          if (error || !data) {
            console.error('Kongbu sync: download failed', error)
            throw new Error('Could not receive progress. Check your connection and try Sync now.')
          }
          for (const row of data) {
            const receivedAt = serverTimestamp(row.received_at)
            const parsed = schema.safeParse({ ...row.payload, serverReceivedAt: receivedAt })
            let record: { id: string; serverReceivedAt?: string } | undefined = parsed.success && parsed.data.id === row.id ? parsed.data : undefined
            if (!record) {
              // A row this app version can't read (older/newer format, or damaged). Rows are immutable,
              // so stopping here would block sync forever: skip it and say so. If it is a record this
              // device is sending right now, the local copy is the same record (same unique ID), so
              // still attach the server receipt to it.
              const mine = (pending[key] as { id: string }[]).find((r) => r.id === row.id)
              if (mine) record = { ...mine, serverReceivedAt: receivedAt }
              else {
                result.skipped = (result.skipped ?? 0) + 1
                console.warn(`Kongbu sync: skipped unreadable ${table} row ${row.id}`, parsed.success ? 'id mismatch' : parsed.error)
              }
            }
            // The groups above pair each key with its corresponding schema.
            if (record) (result[key] as { id: string }[]).push(record)
          }
          if (data.length < PAGE_SIZE) break
        }
      }
      for (const visit of result.visitRecords) {
        const previous = result.chapterVisits[visit.chapterId]
        result.chapterVisits[visit.chapterId] = {
          firstAt: previous && previous.firstAt < visit.firstAt ? previous.firstAt : visit.firstAt,
          lastAt: previous && previous.lastAt > visit.lastAt ? previous.lastAt : visit.lastAt,
        }
      }
      return result
    },
  }
}

/** PostgREST returns +00:00; preserve microseconds and use one comparable UTC representation. */
function serverTimestamp(value: string): string {
  if (!/(Z|\+00:00)$/.test(value)) throw new Error('Invalid server timestamp')
  return value.replace(/(\.\d+)?(?:Z|\+00:00)$/, (_match, fraction: string | undefined) =>
    `${(fraction ?? '.').padEnd(7, '0')}Z`)
}
