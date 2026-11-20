import { Link } from 'react-router'
import { useLearnerData } from '../data/learnerDataContext'
import styles from './StorageNotice.module.css'

/**
 * A warning at the top of every page when progress can't be loaded or saved normally.
 * It explains what happened and what to do, instead of failing silently.
 */
export function StorageNotice() {
  const { loadProblem, saveProblem } = useLearnerData()
  const message = describe(loadProblem?.kind ?? null, saveProblem)
  if (!message) return null

  return (
    <div role="alert" className={styles.notice}>
      <p className={styles.title}>{message.title}</p>
      <p>{message.body}</p>
      {message.showRestore && (
        <p>
          <Link to="/settings">Restore from a backup</Link>
        </p>
      )}
    </div>
  )
}

function describe(load: 'damaged' | 'newer-version' | 'unavailable' | null, save: 'full' | 'unavailable' | 'read-only' | null) {
  if (load === 'damaged') {
    return {
      title: "Your saved progress couldn't be read.",
      body: 'A copy of it was kept in this browser, so nothing was deleted. You can start fresh, or restore a backup file.',
      showRestore: true,
    }
  }
  if (load === 'newer-version' || save === 'read-only') {
    return {
      title: 'Progress was saved by a newer version of Kongbu.',
      body: "To protect it, this version won't change it. Changes you make now are not saved.",
      showRestore: false,
    }
  }
  if (load === 'unavailable' || save === 'unavailable') {
    return {
      title: 'This browser is blocking saved progress.',
      body: 'You can keep studying, but progress will be lost when you close this tab. Private browsing often causes this.',
      showRestore: false,
    }
  }
  if (save === 'full') {
    return {
      title: "Your latest progress couldn't be saved.",
      body: "The browser's storage is full. Download a backup from Settings so nothing is lost.",
      showRestore: false,
    }
  }
  return null
}
