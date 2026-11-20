import type { Chapter } from '../../content/schemas'
import type { ActiveSession, LearnerData } from '../learnerData'
import { chapterProgress, type ChapterProgress } from './chapterProgress'
import { weakConcepts, type ConceptStats } from './mistakes'

/** The PRD's starting point. Used until the learner has studied something else. */
export const BASELINE_CHAPTER_NUMBER = 11

export type NextStep =
  | { kind: 'resume-quiz'; session: ActiveSession; chapter: Chapter; answered: number; total: number }
  | { kind: 'review-mistakes'; concept: ConceptStats; openConcepts: number }
  | { kind: 'start-chapter'; chapter: Chapter; progress: ChapterProgress }
  | { kind: 'practice-chapter'; chapter: Chapter; progress: ChapterProgress }
  | { kind: 'chapter-mastered'; chapter: Chapter; progress: ChapterProgress }

/**
 * The current chapter: the most recently visited or quizzed chapter that has content,
 * or the baseline chapter for a new learner.
 */
export function currentChapter(data: LearnerData, chapters: Chapter[]): Chapter {
  const available = chapters.filter((c) => c.contentStatus === 'available')
  const lastActivity = (c: Chapter) => {
    const visit = data.chapterVisits[c.id]?.lastAt ?? ''
    const quiz = data.sessions.filter((s) => s.chapterId === c.id).map((s) => s.submittedAt).sort().at(-1) ?? ''
    return visit > quiz ? visit : quiz
  }
  const recent = [...available].sort((a, b) => lastActivity(b).localeCompare(lastActivity(a)))[0]
  if (recent && lastActivity(recent)) return recent
  return available.find((c) => c.number === BASELINE_CHAPTER_NUMBER) ?? available[0] ?? chapters[0]
}

/**
 * One recommended next action, in priority order:
 *   1. Finish an unfinished quiz.
 *   2. Review open mistakes.
 *   3. Work on the current chapter: open it, practice it, or move on once mastered.
 */
export function nextStep(
  data: LearnerData,
  chapters: Chapter[],
  conceptIdsFor: (chapterId: string) => string[],
): NextStep {
  const active = data.activeSession
  if (active) {
    const chapter = chapters.find((c) => c.id === active.chapterId)
    if (chapter) {
      return {
        kind: 'resume-quiz',
        session: active,
        chapter,
        answered: Object.keys(active.answers).length,
        total: active.questionIds.length,
      }
    }
  }

  const weak = weakConcepts(data.attempts)
  if (weak.length > 0) return { kind: 'review-mistakes', concept: weak[0], openConcepts: weak.length }

  const chapter = currentChapter(data, chapters)
  const progress = chapterProgress(chapter.id, data, conceptIdsFor(chapter.id))
  if (progress.status === 'mastered') return { kind: 'chapter-mastered', chapter, progress }
  if (progress.status === 'practiced') return { kind: 'practice-chapter', chapter, progress }
  return { kind: 'start-chapter', chapter, progress }
}
