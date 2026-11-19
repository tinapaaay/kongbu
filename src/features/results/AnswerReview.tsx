import { getConcept, questions, type ChoiceId } from '../../content'
import type { Attempt } from '../../domain/learnerData'
import { CHOICE_MARKERS, keepBlanksTogether } from '../../domain/quiz/playableQuestion'
import styles from './AnswerReview.module.css'

const questionsById = new Map(questions.map((q) => [q.id, q]))

interface AnswerReviewProps {
  attempt: Attempt
  number: number
  /** The order the choices were shown in during the quiz, so the review matches what you saw. */
  choiceOrder: ChoiceId[] | undefined
}

/**
 * One question after submission. Uses the browser's <details> element:
 * wrong and skipped answers start open; any question can be opened with a click or the keyboard.
 * The correct answer comes from the attempt, which saved the answer key at submission time.
 */
export function AnswerReview({ attempt, number, choiceOrder }: AnswerReviewProps) {
  const question = questionsById.get(attempt.questionId)
  const concept = getConcept(attempt.conceptId)
  const skipped = attempt.selectedChoiceId === null
  const outcome = attempt.isCorrect ? 'correct' : skipped ? 'skipped' : 'incorrect'
  const outcomeLabel = { correct: 'Correct', incorrect: 'Incorrect', skipped: 'Skipped' }[outcome]
  const keyChanged = question !== undefined && question.correctChoiceId !== attempt.correctChoiceId

  return (
    <details className={`${styles.item} ${styles[outcome]}`} open={!attempt.isCorrect}>
      <summary className={styles.summary}>
        <span className={styles.number}>{number}.</span>
        <span className={styles.summaryText} lang="ko">
          {question?.prompt ?? 'Question no longer available'}
        </span>
        <span className={`${styles.pill} ${styles[`pill-${outcome}`]}`}>{outcomeLabel}</span>
      </summary>

      <div className={styles.body}>
        {!question ? (
          <p className={styles.meta}>
            This question was removed after your quiz. Your answer ({attempt.selectedChoiceId ?? 'none'}) and the
            answer key at the time ({attempt.correctChoiceId}) are still saved.
          </p>
        ) : (
          <>
            {question.context && (
              <div className={styles.context} lang="ko">
                {keepBlanksTogether(question.context.text)}
              </div>
            )}

            <ul className={styles.choices} aria-label="Choices">
              {(choiceOrder ?? question.choices.map((c) => c.id)).map((id, i) => {
                const choice = question.choices.find((c) => c.id === id)
                const isKey = id === attempt.correctChoiceId
                const isPicked = id === attempt.selectedChoiceId
                const tag = isKey && isPicked ? 'Your answer · Correct' : isKey ? 'Correct answer' : isPicked ? 'Your answer' : null
                const tone = isKey ? styles.choiceCorrect : isPicked ? styles.choiceWrong : ''
                return (
                  <li key={id} className={`${styles.choice} ${tone}`}>
                    <span className={styles.marker} aria-hidden="true">
                      {CHOICE_MARKERS[i]}
                    </span>
                    <span lang="ko" className={styles.choiceText}>
                      {choice?.text}
                    </span>
                    {tag && <span className={styles.tag}>{tag}</span>}
                  </li>
                )
              })}
            </ul>

            {skipped && <p className={styles.meta}>You didn't answer this question, so it counts as incorrect.</p>}

            <div className={styles.explanation}>
              <p className={styles.explanationLabel}>Explanation</p>
              <p>{question.explanation}</p>
              {keyChanged && (
                <p className={styles.meta}>
                  Note: this question was edited after your quiz. You were scored on the answer key at the time.
                </p>
              )}
              <p className={styles.meta}>
                <span lang="ko">{concept?.label}</span>
                {concept && ` · Book ${concept.textbookRef.volume}, p.${concept.textbookRef.page}`}
                {attempt.durationMs !== undefined && ` · ${Math.max(1, Math.round(attempt.durationMs / 1000))}s on this question`}
              </p>
            </div>
          </>
        )}
      </div>
    </details>
  )
}
