import type { LearnerData } from '../domain/learnerData'

/** Payloads are immutable. Only a server receipt may be attached to an existing record. */
function union<T extends { id: string; serverReceivedAt?: string }>(local: T[], incoming: T[]): T[] {
  const records = new Map(local.map((record) => [record.id, record]))
  for (const record of incoming) {
    const existing = records.get(record.id)
    if (!existing) records.set(record.id, record)
    else if (!existing.serverReceivedAt && record.serverReceivedAt) {
      records.set(record.id, { ...existing, serverReceivedAt: record.serverReceivedAt })
    }
  }
  return [...records.values()]
}

export function mergeLearnerData(local: LearnerData, incoming: LearnerData): LearnerData {
  const sessions = union(local.sessions, incoming.sessions)
  const chapterVisits = { ...local.chapterVisits }
  for (const [id, visit] of Object.entries(incoming.chapterVisits)) {
    const previous = chapterVisits[id]
    chapterVisits[id] = previous ? {
      firstAt: previous.firstAt < visit.firstAt ? previous.firstAt : visit.firstAt,
      lastAt: previous.lastAt > visit.lastAt ? previous.lastAt : visit.lastAt,
    } : visit
  }
  const active = local.activeSession ?? incoming.activeSession
  return {
    ...local,
    chapterVisits,
    visitRecords: union(local.visitRecords, incoming.visitRecords),
    sessions,
    attempts: union(local.attempts, incoming.attempts),
    activeSession: active && !sessions.some((session) => session.id === active.id) ? active : null,
  }
}
