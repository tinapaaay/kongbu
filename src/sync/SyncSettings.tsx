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

export function SyncSettings() {
  const cloud = useCloud()
  const id = useId()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  async function run(action: () => Promise<void>, success: string) {
    setBusy(true); setError(''); setMessage('')
    try { await action(); setMessage(success) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Please try again.') }
    finally { setBusy(false) }
  }
  function submit(event: FormEvent) {
    event.preventDefault()
    void run(() => cloud.signIn(email.trim()), 'Check your email for a sign-in link. Open it on this device.')
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
        <p className={styles.meta}>This browser keeps your progress after sign-out. Use a separate browser profile for another learner.</p>
      </> : <form onSubmit={submit} className={styles.field}>
        <p className={styles.meta}>Sign in to add this browser’s progress to your account and receive progress from your other devices. Unfinished quizzes stay on each device.</p>
        <label htmlFor={`${id}-email`} className={styles.label}>Email address</label>
        <input id={`${id}-email`} className={styles.email} type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <button type="submit" className={buttons.primary} disabled={busy}>{busy ? 'Sending…' : 'Email me a sign-in link'}</button>
      </form>}
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {message && <p role="status" className={styles.success}>{message}</p>}
  </section>
}
