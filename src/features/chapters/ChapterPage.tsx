import { Link, useParams } from 'react-router'
import { PageHeader } from '../../components/PageHeader'
import { Notice } from '../../components/Notice'
import { NotFoundPage } from '../not-found/NotFoundPage'
import { parseChapterNumber } from '../../domain/chapterNumber'

export function ChapterPage() {
  const chapterNumber = parseChapterNumber(useParams().chapterNumber)
  if (chapterNumber === null) return <NotFoundPage />

  return (
    <>
      <PageHeader title={`Chapter ${chapterNumber}`} eyebrow="Learn" />
      <Notice>
        <p>Chapter content arrives in Milestone 3.</p>
        <p>
          <Link to="/learn">Back to all chapters</Link>
        </p>
      </Notice>
    </>
  )
}
