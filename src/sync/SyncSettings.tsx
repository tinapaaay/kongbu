import { useId, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useCloud } from './cloudContext'
import buttons from '../components/buttons.module.css'
import styles from '../features/settings/SettingsPage.module.css'

export function SyncIndicator() {
  const { configured, email, status } = useCloud()
  if (!configured) return null
  const label = !email ? 'Saved on this device' : status.state === 'synced' ? 'Progress synced'
    : status.state === 'syncing' ? `Syncing · ${status.pending} records waiting`
      : status.state === 'offline' ? `Offline · ${status.pending} records waiting`
        : 'Sync needs attention'
  return <p role="status" className={styles.meta}>{label}. <Link to="/settings">Sync settings</Link></p>
}

/** What is saved in this browser, so the forget step can say exactly what will be removed. */
export interface DeviceProgress {
  /** Quizzes, answers, and chapter visits saved here. */
  records: number
  /** Of those, how many no account has received yet. Forgetting loses them for good. */
  unsynced: number
}

export function SyncSettings({ progress = { records: 0, unsynced: 0 } }: { progress?: DeviceProgress }) {
  const cloud = useCloud()
  const id = useId()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  /** The address a code was sent to. Set means the form asks for the code next. */
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [confirmingForget, setConfirmingForget] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  async function run(action: () => Promise<void>, success: string) {
    setBusy(true); setError(''); setMessage('')
    try { await action(); setMessage(success) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Please try again.') }
    finally { setBusy(false) }
  }
  function sendCode(event: FormEvent) {
    event.preventDefault()
    const address = email.trim()
    void run(async () => {
      await cloud.signIn(address)
      setSentTo(address)
      setCode('')
    }, `We emailed a sign-in code to ${address}. Enter it below.`)
  }
  function verify(event: FormEvent) {
    event.preventDefault()
    if (!sentTo) return
    void run(async () => {
      await cloud.verifyCode(sentTo, code.replace(/\s/g, ''))
      setSentTo(null)
    }, 'Signed in. Syncing your progress.')
  }
  return <section className={styles.panel} aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`} className={styles.panelTitle}>Sync across devices</h2>
    {!cloud.configured ? <p className={styles.meta}>Cloud sync is not set up yet. Your progress is saved in this browser. Use a backup to move it to another device.</p>
      : cloud.email ? <>
        <p className={styles.meta}>Signed in as {cloud.email}</p>
        <p role="status" className={styles.meta}>{cloud.status.state === 'synced' ? 'All progress synced.'
          : cloud.status.message ?? `${cloud.status.pending} records waiting to sync.`}</p>
        <div className={styles.row}>
          <button className={buttons.primary} disabled={busy || cloud.status.state === 'syncing'} onClick={() => void run(cloud.sync, '')}>Sync now</button>
          <button className={buttons.secondary} disabled={busy} onClick={() => void run(cloud.signOut, 'Signed out. Progress stays on this device.')}>Sign out</button>
        </div>
        <p className={styles.meta}>This browser keeps your progress after sign-out. To clear it, sign out, then choose “Forget this device’s progress”.</p>
      </> : sentTo ? <form onSubmit={verify} className={styles.field}>
        <p className={styles.meta}>Enter the code from the email sent to {sentTo}. Type it here, in the app you want to sync.</p>
        <label htmlFor={`${id}-code`} className={styles.label}>Sign-in code</label>
        <input id={`${id}-code`} className={styles.email} type="text" inputMode="numeric" autoComplete="one-time-code"
          pattern="[0-9 ]{6,12}" required value={code} onChange={(event) => setCode(event.target.value)} />
        <div className={styles.row}>
          <button type="submit" className={buttons.primary} disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
          <button type="button" className={buttons.secondary} disabled={busy} onClick={() => { setSentTo(null); setMessage(''); setError('') }}>Use a different email</button>
        </div>
      </form> : <form onSubmit={sendCode} className={styles.field}>
        <p className={styles.meta}>Sign in to add this browser’s progress to your account and receive progress from your other devices. Unfinished quizzes stay on each device.</p>
        <label htmlFor={`${id}-email`} className={styles.label}>Email address</label>
        <input id={`${id}-email`} className={styles.email} type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <button type="submit" className={buttons.primary} disabled={busy}>{busy ? 'Sending…' : 'Email me a sign-in code'}</button>
      </form>}
    {cloud.configured && !cloud.email && progress.records > 0 && (confirmingForget ? (
      <div className={styles.confirm}>
        <p className={styles.strong}>Forget all progress on this device?</p>
        <p className={styles.meta}>
          This removes {progress.records} saved {progress.records === 1 ? 'record' : 'records'} (quizzes, answers, and chapter visits) from this browser.
          Progress already synced stays in your account and comes back when you sign in again.
        </p>
        {progress.unsynced > 0 && <p className={styles.reminder}>
          {progress.unsynced} {progress.unsynced === 1 ? 'record hasn’t' : 'records haven’t'} synced yet and will be lost.
          Sign in and sync first, or download a backup.
        </p>}
        <div className={styles.row}>
          <button type="button" className={buttons.secondary} onClick={() => setConfirmingForget(false)}>Cancel</button>
          <button type="button" className={buttons.primary} disabled={busy} onClick={() => void run(async () => {
            await cloud.forgetDevice()
            setConfirmingForget(false)
          }, 'This device’s progress was forgotten. The next learner starts fresh.')}>Forget progress</button>
        </div>
      </div>
    ) : <>
      <p className={styles.meta}>Using a shared computer? Remove this browser’s progress so the next person starts fresh.</p>
      <button type="button" className={buttons.secondary} onClick={() => { setMessage(''); setConfirmingForget(true) }}>Forget this device’s progress</button>
    </>)}
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {message && <p role="status" className={styles.success}>{message}</p>}
  </section>
}
