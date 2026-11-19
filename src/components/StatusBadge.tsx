import type { ChapterStatus } from '../domain/progress/chapterProgress'
import styles from './StatusBadge.module.css'

const labels: Record<ChapterStatus, string> = {
  'not-started': 'Not started',
  visited: 'Visited',
  practiced: 'Practiced',
  mastered: 'Mastered',
}

/** Chapter status as a pill. The word is always shown, so color is never the only signal. */
export function StatusBadge({ status }: { status: ChapterStatus }) {
  return <span className={`${styles.badge} ${styles[status]}`}>{labels[status]}</span>
}
