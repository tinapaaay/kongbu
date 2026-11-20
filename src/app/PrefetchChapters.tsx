import { useEffect } from 'react'
import { chapters, hasContent, loadChapterContent } from '../content'
import { useLearnerData } from '../data/learnerDataContext'
import { currentChapter } from '../domain/progress/nextStep'

/**
 * Downloads, in the background, the chapters you are most likely to open next:
 * your current chapter, the chapter of an unfinished quiz, and chapters you have answered questions in.
 * Each chapter is still its own small file, but these are ready before you tap, and they keep
 * working if the connection drops after the app has opened. Draws nothing.
 */
export function PrefetchChapters() {
  const { data } = useLearnerData()
  const current = currentChapter(data, chapters).id
  const active = data.activeSession?.chapterId
  const studied = [...new Set(data.attempts.map((a) => a.chapterId))].sort().join(',')

  useEffect(() => {
    const ids = new Set([current, ...(active ? [active] : []), ...(studied ? studied.split(',') : [])])
    for (const id of ids) {
      // A failed background download is fine: the page that needs it will try again and explain.
      if (hasContent(id)) loadChapterContent(id).catch(() => {})
    }
  }, [current, active, studied])

  return null
}
