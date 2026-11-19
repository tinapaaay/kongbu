import { Link, Navigate, useParams } from 'react-router'
import { Notice } from '../../components/Notice'
import { useDocumentTitle } from '../../components/useDocumentTitle'
import { useLearnerData } from '../../data/learnerDataContext'
import { StorageNotice } from '../../app/StorageNotice'
import { QuizPlayer } from './QuizPlayer'
import styles from './QuizPage.module.css'

/**
 * Decides what /quiz/:sessionId shows:
 * - the unfinished quiz with this id → the player
 * - a quiz already submitted → its results
 * - anything else → a friendly "not found"
 */
export function QuizPage() {
  const { sessionId } = useParams()
  const { data } = useLearnerData()
  const active = data.activeSession

  if (active && active.id === sessionId) return <QuizPlayer key={active.id} initial={active} />
  if (data.sessions.some((s) => s.id === sessionId)) return <Navigate to={`/quiz/${sessionId}/results`} replace />
  return <QuizNotFound />
}

function QuizNotFound() {
  useDocumentTitle('Quiz not found')
  return (
    <main id="main" className={styles.missing}>
      <StorageNotice />
      <h1 className={styles.missingTitle}>Quiz not found</h1>
      <Notice>
        <p>This quiz doesn't exist in this browser. It may have been started in another browser, or the link is wrong.</p>
        <p>
          <Link to="/">Go to the dashboard</Link> · <Link to="/learn/11">Open Chapter 11</Link>
        </p>
      </Notice>
    </main>
  )
}
