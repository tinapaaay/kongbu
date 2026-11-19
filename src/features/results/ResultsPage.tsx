import { Link, useParams } from 'react-router'
import { PageHeader } from '../../components/PageHeader'
import { Notice } from '../../components/Notice'
import { getChapter } from '../../content'
import { useLearnerData } from '../../data/learnerDataContext'
import { percent } from '../../domain/progress/chapterProgress'

/** Temporary results: the score only. Milestone 8 adds explanations and the concept breakdown. */
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

  return (
    <>
      <PageHeader title="Results" eyebrow={`Chapter ${chapter?.number} · Practice exam`} />
      <Notice>
        <p>
          You scored <strong>{score.correct}/{score.total}</strong> ({percent(score)}%). Your answers and mistakes are
          saved.
        </p>
        <p>Answers and explanations for each question arrive in Milestone 8.</p>
        <p>
          <Link to={`/learn/${chapter?.number}`}>Back to the chapter</Link> · <Link to="/">Dashboard</Link>
        </p>
      </Notice>
    </>
  )
}
