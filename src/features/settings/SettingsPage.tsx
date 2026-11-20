import { useId, useState, type ChangeEvent } from 'react'
import buttons from '../../components/buttons.module.css'
import { PageHeader } from '../../components/PageHeader'
import { daysBetween, formatDate } from '../../components/formatDate'
import { MAX_BACKUP_BYTES, parseBackup, type BackupSummary } from '../../data/backup'
import { downloadTextFile } from '../../data/download'
import { useLearnerData } from '../../data/learnerDataContext'
import type { LearnerData } from '../../domain/learnerData'
import styles from './SettingsPage.module.css'

type RestoreState =
  | { step: 'idle' }
  | { step: 'error'; message: string }
  | { step: 'confirm'; fileName: string; data: LearnerData; summary: BackupSummary }
  | { step: 'done'; summary: BackupSummary }

const BACKUP_REMINDER_DAYS = 7

interface SettingsPageProps {
  /** Replaced in tests so no real file download happens. */
  download?: (fileName: string, text: string) => void
  /** The current time. Tests pass a fixed clock so "N days ago" doesn't depend on the day they run. */
  now?: () => Date
}

const systemNow = () => new Date()

export function SettingsPage({ download = downloadTextFile, now = systemNow }: SettingsPageProps) {
  const { data, exportBackup, replaceAll } = useLearnerData()
  const [restore, setRestore] = useState<RestoreState>({ step: 'idle' })
  const [downloaded, setDownloaded] = useState(false)
  const fileInputId = useId()
  const fileHintId = useId()

  // Read the clock once when the page opens, not on every render.
  const [openedAt] = useState(now)

  const hasProgress = data.attempts.length > 0 || Object.keys(data.chapterVisits).length > 0
  const daysSinceBackup = data.lastBackupAt === null ? null : daysBetween(data.lastBackupAt, openedAt)
  // Say exactly what is true: "never" and "8 days ago" are different situations.
  const backupReminder = !hasProgress
    ? null
    : daysSinceBackup === null
      ? "You haven't downloaded a backup yet. Download one to keep your progress safe."
      : daysSinceBackup >= BACKUP_REMINDER_DAYS
        ? `Your last backup was ${daysSinceBackup} days ago. Download a new one.`
        : null

  async function handleDownload() {
    const { fileName, text } = await exportBackup()
    download(fileName, text)
    setDownloaded(true)
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const file = input.files?.[0]
    // Clear the input so choosing the same file again still triggers a change.
    input.value = ''
    if (!file) return

    if (file.size > MAX_BACKUP_BYTES) {
      setRestore({ step: 'error', message: 'This file is too large to be a Kongbu backup.' })
      return
    }
    const result = parseBackup(await file.text())
    setRestore(
      result.ok
        ? { step: 'confirm', fileName: file.name, data: result.data, summary: result.summary }
        : { step: 'error', message: `${result.message} Your current progress was not changed.` },
    )
  }

  async function confirmRestore() {
    if (restore.step !== 'confirm') return
    await replaceAll(restore.data)
    setRestore({ step: 'done', summary: restore.summary })
  }

  return (
    <>
      <PageHeader title="Settings" />

      <div className={styles.explainer}>
        <p className={styles.strong}>Your progress is saved in this browser only.</p>
        <p>
          Chrome and Safari keep separate copies, and Safari may delete a site's data after about 7 days without a
          visit. Download a backup to keep your progress safe or to move it to another browser.
        </p>
      </div>

      <div className={styles.grid}>
        <section className={styles.panel} aria-labelledby="backup-heading">
          <h2 id="backup-heading" className={styles.panelTitle}>
            Download backup
          </h2>
          <p className={styles.meta}>
            Saves every quiz, answer, and chapter visit as one file. This browser has{' '}
            <strong>{count(data.sessions.length, 'quiz', 'quizzes')}</strong> and{' '}
            <strong>{count(data.attempts.length, 'answer', 'answers')}</strong> saved.
          </p>
          <p className={styles.meta}>
            Last backup: {data.lastBackupAt ? formatDate(data.lastBackupAt) : 'never'}
          </p>
          {backupReminder && <p className={styles.reminder}>{backupReminder}</p>}
          <button type="button" className={buttons.primary} onClick={handleDownload}>
            Download backup
          </button>
          {downloaded && (
            <p role="status" className={styles.success}>
              Backup downloaded. Check your Downloads folder.
            </p>
          )}
        </section>

        <section className={styles.panel} aria-labelledby="restore-heading">
          <h2 id="restore-heading" className={styles.panelTitle}>
            Restore from backup
          </h2>
          <p className={styles.meta}>Replaces the progress in this browser. It does not merge the two.</p>

          {restore.step === 'confirm' ? (
            <div className={styles.confirm}>
              <p className={styles.strong}>Replace progress in this browser?</p>
              <p className={styles.meta}>
                {restore.fileName} was made {restore.summary.exportedAt ? formatDate(restore.summary.exportedAt) : 'on an unknown date'}{' '}
                and contains {count(restore.summary.quizzes, 'quiz', 'quizzes')},{' '}
                {count(restore.summary.answers, 'answer', 'answers')}, and{' '}
                {count(restore.summary.chaptersVisited, 'visited chapter', 'visited chapters')}.
              </p>
              <p className={styles.meta}>
                This browser's current {count(data.attempts.length, 'answer', 'answers')} will be replaced.
              </p>
              <div className={styles.row}>
                <button type="button" className={buttons.secondary} onClick={() => setRestore({ step: 'idle' })}>
                  Cancel
                </button>
                <button type="button" className={buttons.primary} onClick={confirmRestore}>
                  Replace progress
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.field}>
              <label htmlFor={fileInputId} className={styles.label}>
                Backup file
              </label>
              <input
                id={fileInputId}
                type="file"
                accept="application/json,.json"
                aria-describedby={fileHintId}
                aria-invalid={restore.step === 'error' ? true : undefined}
                onChange={handleFile}
                className={styles.file}
              />
              <p id={fileHintId} className={styles.meta}>
                The file is checked before anything changes.
              </p>
            </div>
          )}

          {restore.step === 'error' && (
            <p role="alert" className={styles.error}>
              {restore.message}
            </p>
          )}
          {restore.step === 'done' && (
            <p role="status" className={styles.success}>
              Progress restored: {count(restore.summary.quizzes, 'quiz', 'quizzes')} and{' '}
              {count(restore.summary.answers, 'answer', 'answers')}.
            </p>
          )}
        </section>
      </div>

      <section className={styles.about} aria-labelledby="about-heading">
        <h2 id="about-heading" className={styles.panelTitle}>
          About Kongbu
        </h2>
        <p className={styles.meta}>
          Kongbu (<span lang="ko">공부</span>, “study”) is an unofficial review app for the EPS-TOPIK, based on the
          Standard Korean Language Textbook. It is not made by or affiliated with HRD Korea, and its practice questions
          are original, not real exam questions.
        </p>
      </section>
    </>
  )
}

function count(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`
}
