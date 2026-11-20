import { useState } from 'react'
import { useNavigate } from 'react-router'
import { getQuestionsForChapter, questions } from '../content'
import { useLearnerData } from '../data/learnerDataContext'
import { buildChapterSession, buildConceptReview } from '../domain/quiz/buildSession'

/**
 * Starting a chapter practice exam. If a quiz is already unfinished, the learner
 * resumes it instead, so a half-done quiz is never thrown away by accident.
 */
export function useStartPractice(chapterId: string) {
  const { data, saveActiveSession } = useLearnerData()
  const navigate = useNavigate()
  const [starting, setStarting] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)

  const active = data.activeSession
  const questionCount = getQuestionsForChapter(chapterId).length

  async function start() {
    if (active) {
      navigate(`/quiz/${active.id}`)
      return
    }
    setStarting(true)
    const result = buildChapterSession({
      chapterId,
      questions: getQuestionsForChapter(chapterId),
      attempts: data.attempts,
      now: new Date(),
    })
    if (!result.ok) {
      setProblem(`This chapter needs ${result.needed} questions for a practice exam and has ${result.available}.`)
      setStarting(false)
      return
    }
    await saveActiveSession(result.session)
    navigate(`/quiz/${result.session.id}`)
  }

  return {
    start,
    starting,
    problem,
    questionCount,
    /** An unfinished quiz in this chapter. */
    resumable: active?.chapterId === chapterId ? active : null,
    /** An unfinished quiz in a different chapter, which must be finished first. */
    otherActive: active && active.chapterId !== chapterId ? active : null,
  }
}

/**
 * Starting a short quiz on one concept, from Mistakes. Like a practice exam,
 * an unfinished quiz is resumed instead of being replaced.
 */
export function useStartConceptReview() {
  const { data, saveActiveSession } = useLearnerData()
  const navigate = useNavigate()
  const [starting, setStarting] = useState<string | null>(null)
  const active = data.activeSession

  async function start(conceptId: string) {
    if (active) {
      navigate(`/quiz/${active.id}`)
      return
    }
    setStarting(conceptId)
    const result = buildConceptReview({ conceptId, questions, attempts: data.attempts, now: new Date() })
    if (!result.ok) {
      setStarting(null)
      return
    }
    await saveActiveSession(result.session)
    navigate(`/quiz/${result.session.id}`)
  }

  return { start, starting, hasUnfinishedQuiz: active !== null }
}
