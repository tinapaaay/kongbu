import { Link, useParams } from 'react-router'
import buttons from '../../components/buttons.module.css'
import { formatDate } from '../../components/formatDate'
import { Notice } from '../../components/Notice'
import { PageHeader } from '../../components/PageHeader'
import { StatusBadge } from '../../components/StatusBadge'
import { getChapter, getConcept } from '../../content'
import { useLearnerData } from '../../data/learnerDataContext'
import { chapterProgress, MASTERY_ACCURACY, percent } from '../../domain/progress/chapterProgress'
import { conceptStats } from '../../domain/progress/mistakes'
import { AnswerReview } from './AnswerReview'
import styles from './ResultsPage.module.css'

export function ResultsPage() {
  const { sessionId } = useParams()
  const { data } = useLearnerData()
  const session = data.sessions.find((s) => s.id === sessionId)

  if (!session) {
    return (
      <>
        <PageHeader title="Results not found" />
        <Notice>
          <p>There are no results for this quiz in this browser.</p>
          <p>
            <Link to="/">Go to the dashboard</Link>
          </p>
        </Notice>
      </>
    )
  }

  const chapter = getChapter(session.chapterId)
  const score = { correct: session.correctCount, total: session.totalCount }
  const progress = chapterProgress(session.chapterId, data)
  // Attempts for this quiz, in the order the questions were asked.
  const attempts = session.questionIds
    .map((id) => data.attempts.find((a) => a.sessionId === session.id && a.questionId === id))
    .filter((a) => a !== undefined)
  const byConcept = conceptStats(attempts).sort((a, b) => a.correct / a.total - b.correct / b.total)
  const missed = attempts.filter((a) => !a.isCorrect).length

  return (
    <>
      <PageHeader
        title="Results"
        eyebrow={`Chapter ${chapter?.number} · Practice exam · ${formatDate(session.submittedAt)}`}
      />

      <div className={styles.top}>
        <section className={styles.score} aria-labelledby="score-heading">
          <h2 id="score-heading" className={styles.visuallyHidden}>
            Score
          </h2>
          <p className={styles.scoreLine}>
            <span className={styles.big}>{score.correct}</span>
            <span className={styles.outOf}>/ {score.total}</span>
            <span className={styles.percent}>{percent(score)}%</span>
          </p>
          <p className={styles.statusLine}>
            <span lang="ko">{chapter?.titleKo}</span> <StatusBadge status={progress.status} />
          </p>
          <p className={styles.meta}>{statusExplanation(progress.status, progress.openMistakes)}</p>
          <div className={styles.actions}>
            {missed > 0 && (
              <Link to={`/practice/mistakes?chapter=${session.chapterId}`} className={buttons.primary}>
                Review mistakes
              </Link>
            )}
            <Link to={`/learn/${chapter?.number}`} className={missed > 0 ? buttons.secondary : buttons.primary}>
              Back to chapter
            </Link>
          </div>
        </section>

        <section className={styles.concepts} aria-labelledby="concepts-heading">
          <h2 id="concepts-heading" className={styles.sectionTitle}>
            By concept
          </h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Concept</th>
                <th scope="col" className={styles.right}>
                  Correct
                </th>
              </tr>
            </thead>
            <tbody>
              {byConcept.map((stat) => {
                const concept = getConcept(stat.conceptId)
                return (
                  <tr key={stat.conceptId}>
                    <td>
                      <span lang="ko">{concept?.label ?? stat.conceptId}</span>
                      <span className={styles.gloss}>{concept?.labelEn}</span>
                    </td>
                    <td className={`${styles.right} ${styles.num}`}>
                      {stat.correct}/{stat.total}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      </div>

      <section aria-labelledby="review-heading" className={styles.review}>
        <h2 id="review-heading" className={styles.sectionTitle}>
          Answers and explanations
        </h2>
        <p className={styles.meta}>Wrong and skipped answers are open. Select any question to show or hide it.</p>
        <ol className={styles.reviewList}>
          {attempts.map((attempt, i) => (
            <li key={attempt.id}>
              <AnswerReview attempt={attempt} number={i + 1} choiceOrder={session.choiceOrder[attempt.questionId]} />
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}

function statusExplanation(status: ReturnType<typeof chapterProgress>['status'], openMistakes: number): string {
  const threshold = Math.round(MASTERY_ACCURACY * 100)
  if (status === 'mastered') return 'Chapter mastered: your latest exam met the bar and every missed concept has since been answered correctly.'
  const open =
    openMistakes > 0
      ? ` You have ${openMistakes} open ${openMistakes === 1 ? 'mistake' : 'mistakes'} in this chapter.`
      : ''
  return `Mastery needs at least ${threshold}% on a 10-question exam and no open mistakes.${open}`
}
