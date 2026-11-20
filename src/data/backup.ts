import { learnerDataSchema, type LearnerData } from '../domain/learnerData'
import { migrate } from './migrations'

/**
 * The marker inside every backup file. The app was called Hangul Lab, then briefly Gongbu,
 * before it became Kongbu, so backups made under the old names still restore.
 */
const APP_ID = 'kongbu'
const OLD_APP_IDS = ['hangul-lab', 'gongbu']

/** Wraps learner data with a marker, so a random JSON file isn't mistaken for a backup. */
interface BackupFile {
  app: string
  kind: 'backup'
  exportedAt: string
  data: LearnerData
}

/** Backups larger than this are rejected before reading, to avoid freezing the page. */
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024

export function createBackup(data: LearnerData, now: Date): string {
  const file: BackupFile = { app: APP_ID, kind: 'backup', exportedAt: now.toISOString(), data }
  return JSON.stringify(file, null, 2)
}

export function backupFileName(now: Date): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `kongbu-backup-${y}-${m}-${d}.json`
}

export interface BackupSummary {
  exportedAt: string
  quizzes: number
  answers: number
  chaptersVisited: number
  hasUnfinishedQuiz: boolean
}

export type ParseBackupResult =
  | { ok: true; data: LearnerData; summary: BackupSummary }
  | { ok: false; message: string }

/**
 * Checks a backup file completely before anything is replaced.
 * Every failure returns a plain-language message; nothing here changes saved progress.
 */
export function parseBackup(text: string): ParseBackupResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, message: "This file isn't a Kongbu backup. It couldn't be read as a backup file." }
  }

  const file = parsed as Partial<BackupFile> | null
  const knownApp = typeof file?.app === 'string' && [APP_ID, ...OLD_APP_IDS].includes(file.app)
  if (!file || typeof file !== 'object' || !knownApp || file.kind !== 'backup') {
    return { ok: false, message: "This file isn't a Kongbu backup." }
  }

  const migrated = migrate(file.data)
  if (!migrated.ok) {
    return migrated.reason === 'newer-version'
      ? { ok: false, message: 'This backup was made by a newer version of Kongbu. Update the app, then try again.' }
      : { ok: false, message: 'This backup is damaged and cannot be restored.' }
  }

  const result = learnerDataSchema.safeParse(migrated.data)
  if (!result.success) {
    return { ok: false, message: 'This backup is damaged and cannot be restored.' }
  }

  const data = result.data
  return {
    ok: true,
    data,
    summary: {
      exportedAt: typeof file.exportedAt === 'string' ? file.exportedAt : '',
      quizzes: data.sessions.length,
      answers: data.attempts.length,
      chaptersVisited: Object.keys(data.chapterVisits).length,
      hasUnfinishedQuiz: data.activeSession !== null,
    },
  }
}
