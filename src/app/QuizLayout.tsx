import { Outlet } from 'react-router'
import styles from './QuizLayout.module.css'

/**
 * Distraction-free frame for taking a quiz: no main navigation, exam-beige page.
 * The quiz screen draws its own header with the exit button and progress.
 */
export function QuizLayout() {
  return (
    <div className={styles.shell}>
      <Outlet />
    </div>
  )
}
