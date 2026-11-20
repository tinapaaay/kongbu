import { useEffect, useReducer, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import buttons from '../../components/buttons.module.css'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { SectionHeader } from '../../components/SectionHeader'
import { useDocumentTitle } from '../../components/useDocumentTitle'
import { quizKindLabel } from './quizKindLabel'
import { getChapter, questions } from '../../content'
import { StorageNotice } from '../../app/StorageNotice'
import { useLearnerData } from '../../data/learnerDataContext'
import type { ActiveSession } from '../../domain/learnerData'
import { CHOICE_MARKERS, keepBlanksTogether, toPlayableQuestion } from '../../domain/quiz/playableQuestion'
import { quizReducer, unansweredQuestionIds, type QuizAction } from '../../domain/quiz/quizReducer'
import { scoreSession } from '../../domain/quiz/scoreSession'
import styles from './QuizPlayer.module.css'

const questionsById = new Map(questions.map((q) => [q.id, q]))

/** Time on one question is capped, so leaving the tab open doesn't inflate it. */
const MAX_VIEW_MS = 10 * 60 * 1000

export function QuizPlayer({ initial }: { initial: ActiveSession }) {
  const { saveActiveSession, submitSession } = useLearnerData()
  const navigate = useNavigate()
  const [session, dispatch] = useReducer(quizReducer, initial)
  const [dialog, setDialog] = useState<'none' | 'submit' | 'exit'>('none')
  const [submitting, setSubmitting] = useState(false)
  const questionRef = useRef<HTMLFieldSetElement>(null)
  const viewStartedAt = useRef<number | null>(null)
  const lastSaved = useRef(initial)
  const firstQuestionShown = useRef(true)

  const chapter = getChapter(session.chapterId)
  const kind = quizKindLabel(session)
  useDocumentTitle(`${kind} · ${chapter?.titleKo ?? ''}`)

  const total = session.questionIds.length
  const index = session.currentIndex
  const questionId = session.questionIds[index]
  const question = questionsById.get(questionId)
  const playable = question ? toPlayableQuestion(question, session.choiceOrder[questionId]) : null
  const selected = session.answers[questionId]
  const answeredCount = total - unansweredQuestionIds(session).length

  // Save every change immediately, so a refresh resumes exactly here.
  useEffect(() => {
    if (session === lastSaved.current) return
    lastSaved.current = session
    void saveActiveSession(session)
  }, [session, saveActiveSession])

  // When the question changes: restart its timer and move focus to it so it is read aloud.
  useEffect(() => {
    viewStartedAt.current = Date.now()
    if (firstQuestionShown.current) {
      firstQuestionShown.current = false
      return
    }
    questionRef.current?.focus()
  }, [index])

  /** Time spent on the current question since it was shown. */
  function elapsedAction(): QuizAction | null {
    if (viewStartedAt.current === null) return null
    const ms = Math.min(Date.now() - viewStartedAt.current, MAX_VIEW_MS)
    viewStartedAt.current = Date.now()
    return ms > 0 ? { type: 'addTime', questionId, ms } : null
  }

  function move(action: QuizAction) {
    const time = elapsedAction()
    if (time) dispatch(time)
    dispatch(action)
  }

  async function submit() {
    if (submitting) return
    setSubmitting(true)
    const time = elapsedAction()
    const final = time ? quizReducer(session, time) : session
    const scored = scoreSession(final, questionsById, new Date())
    // Saving the result clears the unfinished quiz; the page then shows the results.
    await submitSession(scored.session, scored.attempts)
  }

  // Keyboard shortcuts: 1–4 choose an answer; ← → change question (except inside the answer list,
  // where arrow keys already move between answers).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (dialog !== 'none' || event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target as HTMLElement | null
      const inTextField = target?.matches('input:not([type=radio]), textarea, select')
      if (inTextField || !playable) return

      const number = Number(event.key)
      if (number >= 1 && number <= 4) {
        event.preventDefault()
        dispatch({ type: 'select', questionId, choiceId: playable.choices[number - 1].id })
        return
      }
      const onRadio = target?.matches('input[type=radio]')
      if (event.key === 'ArrowRight' && !onRadio) move({ type: 'next' })
      if (event.key === 'ArrowLeft' && !onRadio) move({ type: 'previous' })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const unanswered = unansweredQuestionIds(session).map((id) => session.questionIds.indexOf(id) + 1)
  const readyToSubmit = index === total - 1 || unanswered.length === 0

  return (
    <>
      <header className={styles.bar}>
        <button type="button" className={styles.exit} onClick={() => setDialog('exit')}>
          <span aria-hidden="true">✕</span> Exit quiz
        </button>
        <p className={styles.barTitle}>
          <span className={styles.num}>{chapter?.number}</span> <span lang="ko">{chapter?.titleKo}</span>
          <span className={styles.barSub}> · {kind}</span>
        </p>
      </header>

      <main id="main" className={styles.main}>
        <StorageNotice />
        <h1 className={styles.visuallyHidden}>{kind}</h1>

        <div className={styles.progressRow}>
          <nav aria-label="Questions">
            <ol className={styles.navigator}>
              {session.questionIds.map((id, i) => {
                const answered = Boolean(session.answers[id])
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={`${styles.dot} ${answered ? styles.dotAnswered : ''}`}
                      aria-current={i === index ? 'step' : undefined}
                      aria-label={`Question ${i + 1}, ${answered ? 'answered' : 'not answered'}`}
                      onClick={() => move({ type: 'goTo', index: i })}
                    >
                      {i + 1}
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>
          <p className={styles.meta} aria-live="polite">
            <span className={styles.num}>{answeredCount}</span> of <span className={styles.num}>{total}</span> answered
          </p>
        </div>

        <SectionHeader kind="reading" labelKo="읽기" labelEn="Reading" as="h2" />

        {playable ? (
          <fieldset ref={questionRef} tabIndex={-1} className={styles.question}>
            <legend className={styles.prompt}>
              <span className={styles.num}>{index + 1}.</span> <span lang="ko">{playable.prompt}</span>
            </legend>
            {playable.isDraft && <p className={styles.draft}>Draft question · not yet reviewed</p>}

            {playable.context && (
              <div className={styles.context} lang="ko">
                {keepBlanksTogether(playable.context.text)}
              </div>
            )}

            <div className={styles.choices}>
              {playable.choices.map((choice, i) => {
                const checked = selected === choice.id
                return (
                  <label key={choice.id} className={`${styles.choice} ${checked ? styles.choiceSelected : ''}`}>
                    <input
                      type="radio"
                      name={`answer-${questionId}`}
                      value={choice.id}
                      checked={checked}
                      onChange={() => dispatch({ type: 'select', questionId, choiceId: choice.id })}
                      className={styles.radio}
                    />
                    <span className={styles.marker} aria-hidden="true">
                      {CHOICE_MARKERS[i]}
                    </span>
                    <span lang="ko" className={styles.choiceText}>
                      {choice.text}
                    </span>
                    {checked && <span className={styles.tag}>Selected</span>}
                  </label>
                )
              })}
            </div>
          </fieldset>
        ) : (
          <p role="alert" className={styles.problem}>
            This question is no longer available. You can still submit the quiz, or exit and start a new one.
          </p>
        )}

        <p className={styles.hint}>Keys: 1–4 choose an answer · ← → change question</p>

        {/* One main button at a time: Next while you work through the quiz,
            Submit once you reach the last question or have answered everything. */}
        <div className={styles.controls}>
          <button
            type="button"
            className={buttons.secondary}
            onClick={() => move({ type: 'previous' })}
            disabled={index === 0}
          >
            ← Previous
          </button>
          <button
            type="button"
            className={readyToSubmit ? buttons.secondary : buttons.primary}
            onClick={() => move({ type: 'next' })}
            disabled={index === total - 1}
          >
            Next →
          </button>
          <button
            type="button"
            className={`${readyToSubmit ? buttons.primary : buttons.secondary} ${styles.submit}`}
            onClick={() => setDialog('submit')}
          >
            Submit quiz
          </button>
        </div>
      </main>

      <ConfirmDialog
        open={dialog === 'submit'}
        title="Submit your quiz?"
        confirmLabel={unanswered.length > 0 ? 'Submit anyway' : 'Submit quiz'}
        cancelLabel="Go back"
        busy={submitting}
        onCancel={() => setDialog('none')}
        onConfirm={submit}
      >
        {unanswered.length > 0 ? (
          <p>
            <strong>{unanswered.length}</strong> {unanswered.length === 1 ? 'question is' : 'questions are'} unanswered:{' '}
            {unanswered.join(', ')}. Unanswered questions count as incorrect.
          </p>
        ) : (
          <p>All {total} questions are answered.</p>
        )}
        <p className={styles.meta}>You can't change answers after submitting.</p>
      </ConfirmDialog>

      <ConfirmDialog
        open={dialog === 'exit'}
        title="Leave this quiz?"
        confirmLabel="Leave quiz"
        cancelLabel="Keep going"
        onCancel={() => setDialog('none')}
        onConfirm={() => navigate('/')}
      >
        <p>Your answers are saved. You can resume from the dashboard or the chapter page.</p>
      </ConfirmDialog>
    </>
  )
}
