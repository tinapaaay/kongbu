/**
 * Saved data carries a schemaVersion. When the format changes in a later phase,
 * add a step here that upgrades version N to N + 1, so old saved progress keeps working.
 */
export const CURRENT_SCHEMA_VERSION = 1

type Migration = (data: Record<string, unknown>) => Record<string, unknown>

/** Upgrades keyed by the version they upgrade FROM. Empty until the format first changes. */
const migrations: Record<number, Migration> = {}

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
