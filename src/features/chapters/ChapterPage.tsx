import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { conceptIdsForChapter, getChapterByNumber } from '../../content'
import { useChapterContent } from '../../content/useChapterContent'
import { Notice } from '../../components/Notice'
import { NotFoundPage } from '../../components/NotFoundPage'
import { parseChapterNumber } from '../../domain/chapterNumber'
import { chapterProgress } from '../../domain/progress/chapterProgress'
import { useLearnerData } from '../../data/learnerDataContext'
import { ChapterBanner } from './ChapterBanner'
import { LessonContent } from './LessonContent'
import { PracticeExamCard } from './PracticeExamCard'
import { StartPracticeButton } from './StartPracticeButton'

export function ChapterPage() {
  const chapterNumber = parseChapterNumber(useParams().chapterNumber)
  const { data, recordChapterVisit } = useLearnerData()

  // Opening a chapter page marks it as visited.
  useEffect(() => {
    if (chapterNumber !== null) void recordChapterVisit(`ch${chapterNumber}`)
  }, [chapterNumber, recordChapterVisit])

  const chapter = chapterNumber === null ? undefined : getChapterByNumber(chapterNumber)
  // Downloads this chapter's lesson the first time; shows "Loading…" meanwhile.
  const { lesson } = useChapterContent(chapter?.id ?? '')
  if (!chapter) return <NotFoundPage />

  const progress = chapterProgress(chapter.id, data, conceptIdsForChapter(chapter.id))

  return (
    <>
      <ChapterBanner
        chapter={chapter}
        lesson={lesson}
        status={progress.status}
        action={lesson && <StartPracticeButton chapterId={chapter.id} progress={progress} variant="secondary" />}
      />
      {lesson ? (
        <>
          <LessonContent lesson={lesson} />
          <PracticeExamCard chapterId={chapter.id} progress={progress} />
        </>
      ) : (
        <Notice>
          <p>Content for this chapter is coming later. Chapter 11 is available now.</p>
          <p>
            <Link to="/learn/11">Go to Chapter 11</Link> · <Link to="/learn">All chapters</Link>
          </p>
        </Notice>
      )}
    </>
  )
}
