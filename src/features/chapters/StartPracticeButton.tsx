import buttons from '../../components/buttons.module.css'
import type { ChapterProgress } from '../../domain/progress/chapterProgress'
import { useStartPractice } from '../quiz/useStartPractice'

interface StartPracticeButtonProps {
  chapterId: string
  progress: ChapterProgress
  /** primary on light backgrounds; secondary (white) on the blue chapter banner. */
  variant?: 'primary' | 'secondary'
}

/**
 * Starts, resumes, or retakes the chapter's practice exam. Used at the top of the chapter
 * (so the main action is visible without scrolling) and again in the card at the end.
 * Shows nothing while a quiz in another chapter is unfinished; the card at the end explains why.
 */
export function StartPracticeButton({ chapterId, progress, variant = 'primary' }: StartPracticeButtonProps) {
  const { start, starting, resumable, otherActive } = useStartPractice(chapterId)
  if (otherActive) return null

  const label = resumable
    ? `Resume practice exam (${Object.keys(resumable.answers).length}/${resumable.questionIds.length} answered)`
    : progress.sessionsCompleted > 0
      ? 'Take another practice exam'
      : 'Start practice exam'

  return (
    <button type="button" className={buttons[variant]} onClick={start} disabled={starting}>
      {label}
    </button>
  )
}
