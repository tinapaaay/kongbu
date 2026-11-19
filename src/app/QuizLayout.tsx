import { Link, Outlet } from 'react-router'
import styles from './QuizLayout.module.css'

/**
 * Distraction-free frame for taking a quiz: no main navigation, exam-beige page.
 * Milestone 7 adds the quiz title, progress, and an exit confirmation.
 */
export function QuizLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.bar}>
        <Link to="/" className={styles.exit}>
          <span aria-hidden="true">✕</span> Exit quiz
        </Link>
      </header>
      <main id="main" className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
