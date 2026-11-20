import { Link, useParams } from 'react-router'
import buttons from '../../components/buttons.module.css'
import { formatDate } from '../../components/formatDate'
import { Notice } from '../../components/Notice'
import { PageHeader } from '../../components/PageHeader'
import { StatusBadge } from '../../components/StatusBadge'
import { conceptIdsForChapter, getChapter, getConcept } from '../../content'
import { useLearnerData } from '../../data/learnerDataContext'
import { quizKindLabel } from '../../practice/quizKindLabel'
import { chapterProgress, MASTERY_ACCURACY, MASTERY_MIN_QUESTIONS, percent } from '../../domain/progress/chapterProgress'
import { conceptStats, weakConcepts } from '../../domain/progress/mistakes'
import { PracticeConceptButton } from '../../practice/PracticeConceptButton'
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
  const progress = chapterProgress(session.chapterId, data, conceptIdsForChapter(session.chapterId))
  // Attempts for this quiz, in the order the questions were asked.
  const attempts = session.questionIds
    .map((id) => data.attempts.find((a) => a.sessionId === session.id && a.questionId === id))
    .filter((a) => a !== undefined)
  const byConcept = conceptStats(attempts).sort((a, b) => a.correct / a.total - b.correct / b.total)
  const missed = attempts.filter((a) => !a.isCorrect).length
  // The one concept to work on next: the weakest one from this quiz that still has open mistakes.
  const inThisQuiz = new Set(attempts.map((a) => a.conceptId))
  const focus = weakConcepts(data.attempts, session.chapterId).find((c) => inThisQuiz.has(c.conceptId))
  const focusConcept = focus ? getConcept(focus.conceptId) : undefined
  // A concept review can't start while another quiz is unfinished, so then Review mistakes leads instead.
  const canPractice = !!focus && !!focusConcept && !data.activeSession

  return (
    <>
      <PageHeader
        title="Results"
        eyebrow={`Chapter ${chapter?.number} · ${quizKindLabel(session)} · ${formatDate(session.submittedAt)}`}
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
          <MasteryChecklist progress={progress} />
          <div className={styles.actions}>
            {canPractice && focus && focusConcept && (
              <PracticeConceptButton
                conceptId={focus.conceptId}
                label={`Practice ${focusConcept.labelEn} (${focus.openMistakes} open)`}
                variant="primary"
              />
            )}
            {missed > 0 && (
              <Link
                to={`/practice/mistakes?chapter=${session.chapterId}`}
                className={canPractice ? buttons.secondary : buttons.primary}
              >
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

/** The three mastery conditions as a checklist, so you can see which ones are left. */
function MasteryChecklist({ progress }: { progress: ReturnType<typeof chapterProgress> }) {
  const threshold = Math.round(MASTERY_ACCURACY * 100)
  const latest = progress.latestScore
  const items = [
    {
      done: !!latest && latest.total >= MASTERY_MIN_QUESTIONS && percent(latest) >= threshold,
      text: `${threshold}% or more on your latest ${MASTERY_MIN_QUESTIONS}-question practice exam`,
    },
    {
      done: progress.conceptsShown === progress.conceptsTotal,
      text: `A right answer in every concept (${progress.conceptsShown} of ${progress.conceptsTotal})`,
    },
    {
      done: progress.openMistakes === 0,
      text:
        progress.openMistakes === 0
          ? 'No open mistakes'
          : `No open mistakes (${progress.openMistakes} still open)`,
    },
  ]
  return (
    <div>
      <p className={styles.checklistTitle}>
        {progress.status === 'mastered' ? 'Chapter mastered' : 'To master this chapter'}
      </p>
      <ul className={styles.checklist}>
        {items.map((item) => (
          <li key={item.text} className={item.done ? styles.checkDone : styles.checkTodo}>
            <span aria-hidden="true" className={styles.checkMark}>
              {item.done ? '✓' : '○'}
            </span>
            <span className={styles.visuallyHidden}>{item.done ? 'Done: ' : 'Not yet: '}</span>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
