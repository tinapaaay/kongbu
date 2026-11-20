import { Link } from 'react-router'
import { SectionHeader } from '../../components/SectionHeader'
import { getChapter } from '../../content'
import { percent, type ChapterProgress } from '../../domain/progress/chapterProgress'
import { QUIZ_SIZE } from '../../domain/quiz/buildSession'
import { useStartPractice } from '../../practice/useStartPractice'
import { StartPracticeButton } from './StartPracticeButton'
import styles from './PracticeExamCard.module.css'

/** The end of the chapter: start, resume, or retake the practice exam. */
export function PracticeExamCard({ chapterId, progress }: { chapterId: string; progress: ChapterProgress }) {
  const { problem, questionCount, otherActive } = useStartPractice(chapterId)
  const otherChapter = otherActive ? getChapter(otherActive.chapterId) : undefined

  return (
    <section className={styles.card} aria-labelledby="practice">
      <SectionHeader kind="reading" labelKo="연습 시험" labelEn="Practice exam" id="practice" />

      <p>
        {QUIZ_SIZE} original EPS-TOPIK-style questions, chosen from {questionCount} for this chapter. Answers and
        explanations appear after you submit.
      </p>
      <p className={styles.meta}>
        These are practice questions written for Kongbu, not real exam questions. Questions you missed before
        come back first.
      </p>

      {progress.latestScore && (
        <p className={styles.meta}>
          Last score: <strong>{progress.latestScore.correct}/{progress.latestScore.total}</strong> (
          {percent(progress.latestScore)}%) · {progress.sessionsCompleted}{' '}
          {progress.sessionsCompleted === 1 ? 'exam' : 'exams'} taken
        </p>
      )}

      {otherActive ? (
        <p className={styles.notice}>
          You have an unfinished quiz in Chapter {otherChapter?.number}.{' '}
          <Link to={`/quiz/${otherActive.id}`}>Resume it</Link> before starting a new one.
        </p>
      ) : (
        <div>
          <StartPracticeButton chapterId={chapterId} progress={progress} />
        </div>
      )}

      {problem && (
        <p role="alert" className={styles.notice}>
          {problem}
        </p>
      )}
    </section>
  )
}
