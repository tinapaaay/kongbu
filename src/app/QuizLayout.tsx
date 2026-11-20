import { Outlet, useLocation } from 'react-router'
import { ContentBoundary } from '../components/ContentBoundary'
import styles from './QuizLayout.module.css'

/**
 * Distraction-free frame for taking a quiz: no main navigation, exam-beige page.
 * The quiz screen draws its own header with the exit button and progress.
 */
export function QuizLayout() {
  const { pathname } = useLocation()
  return (
    <div className={styles.shell}>
      <ContentBoundary resetKey={pathname}>
        <Outlet />
      </ContentBoundary>
    </div>
  )
}
