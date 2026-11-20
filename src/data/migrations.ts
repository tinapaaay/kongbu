/**
 * Saved data carries a schemaVersion. When the format changes in a later phase,
 * add a step here that upgrades version N to N + 1, so old saved progress keeps working.
 */
export const CURRENT_SCHEMA_VERSION = 2

type Migration = (data: Record<string, unknown>) => Record<string, unknown>

/**
 * Version 1 → 2: Chapter 11's "household chore words" concept was split into laundry,
 * cleaning, and cooking words, so a right answer about brooms no longer fixes a laundry mistake.
 * The question → concept list is copied here on purpose: a migration must keep working
 * the same way forever, even after the study content changes again.
 */
const SPLIT_HOUSEHOLD_CHORES: Record<string, string> = {
  'ch11-q001': 'vocabulary.cleaning',
  'ch11-q002': 'vocabulary.laundry',
  'ch11-q010': 'vocabulary.cooking',
  'ch11-q011': 'vocabulary.cleaning',
  'ch11-q015': 'vocabulary.cooking',
  'ch11-q016': 'vocabulary.cleaning',
  'ch11-q018': 'vocabulary.laundry',
}

function splitHouseholdChores(data: Record<string, unknown>): Record<string, unknown> {
  if (!Array.isArray(data.attempts)) return data
  return {
    ...data,
    attempts: data.attempts.map((attempt: unknown) => {
      if (typeof attempt !== 'object' || attempt === null) return attempt
      const a = attempt as Record<string, unknown>
      const next = typeof a.questionId === 'string' ? SPLIT_HOUSEHOLD_CHORES[a.questionId] : undefined
      return a.conceptId === 'vocabulary.household-chores' && next ? { ...a, conceptId: next } : a
    }),
  }
}

/** Upgrades keyed by the version they upgrade FROM. */
const migrations: Record<number, Migration> = {
  1: splitHouseholdChores,
}

export type MigrationResult =
  | { ok: true; data: unknown }
  | { ok: false; reason: 'not-an-object' | 'missing-version' | 'newer-version'; version?: number }

export function migrate(raw: unknown): MigrationResult {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return { ok: false, reason: 'not-an-object' }
  let data = raw as Record<string, unknown>
  let version = data.schemaVersion
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 1) {
    return { ok: false, reason: 'missing-version' }
  }
  // Data from a newer app version must not be downgraded or overwritten.
  if (version > CURRENT_SCHEMA_VERSION) return { ok: false, reason: 'newer-version', version }

  while (version < CURRENT_SCHEMA_VERSION) {
    const step = migrations[version]
    if (!step) return { ok: false, reason: 'missing-version', version }
    data = step(data)
    version += 1
    data = { ...data, schemaVersion: version }
  }
  return { ok: true, data }
}
