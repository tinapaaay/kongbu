import buttons from '../components/buttons.module.css'
import styles from './UpdateNotice.module.css'

interface UpdateNoticeProps {
  /** A new version was downloaded and is waiting. */
  needRefresh: boolean
  /** Everything is saved on this device for the first time: the app now opens offline. */
  offlineReady: boolean
  onReload(): void
  onDismiss(): void
}

/**
 * A quiet strip above the app. A new version never loads by itself, because reloading mid-quiz would
 * be surprising; the learner chooses when. (Unfinished quizzes are saved, so reloading loses nothing.)
 */
export function UpdateNotice({ needRefresh, offlineReady, onReload, onDismiss }: UpdateNoticeProps) {
  if (!needRefresh && !offlineReady) return null
  return (
    <div className={styles.notice} role="status">
      <p className={styles.text}>
        {needRefresh
          ? 'A new version of Kongbu is ready. Your progress is saved.'
          : 'Kongbu now works offline on this device.'}
      </p>
      <div className={styles.actions}>
        {needRefresh && (
          <button type="button" className={buttons.primary} onClick={onReload}>
            Reload
          </button>
        )}
        <button type="button" className={buttons.secondary} onClick={onDismiss}>
          {needRefresh ? 'Later' : 'OK'}
        </button>
      </div>
    </div>
  )
}
