import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { PageHeader } from '../../components/PageHeader'
import { Notice } from '../../components/Notice'
import { NotFoundPage } from '../not-found/NotFoundPage'
import { parseChapterNumber } from '../../domain/chapterNumber'
import { useLearnerData } from '../../data/learnerDataContext'

export function ChapterPage() {
  const chapterNumber = parseChapterNumber(useParams().chapterNumber)
  const { recordChapterVisit } = useLearnerData()

  // Opening a chapter page marks it as visited.
  useEffect(() => {
    if (chapterNumber !== null) void recordChapterVisit(`ch${chapterNumber}`)
  }, [chapterNumber, recordChapterVisit])

  if (chapterNumber === null) return <NotFoundPage />

  return (
    <>
      <PageHeader title={`Chapter ${chapterNumber}`} eyebrow="Learn" />
      <Notice>
        <p>The lesson for this chapter appears here in Milestone 6.</p>
        <p>
          <Link to="/learn">Back to all chapters</Link>
        </p>
      </Notice>
    </>
  )
}
