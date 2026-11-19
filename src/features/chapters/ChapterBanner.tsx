import type { Chapter, Lesson } from '../../content'
import { StatusBadge } from '../../components/StatusBadge'
import { useDocumentTitle } from '../../components/useDocumentTitle'
import type { ChapterStatus } from '../../domain/progress/chapterProgress'
import styles from './ChapterBanner.module.css'

interface ChapterBannerProps {
  chapter: Chapter
  lesson?: Lesson
  status: ChapterStatus
}

/** The textbook-style chapter opener: blue banner, topic pills, and learning objectives. */
export function ChapterBanner({ chapter, lesson, status }: ChapterBannerProps) {
  useDocumentTitle(`${chapter.number} ${chapter.titleKo}`)
  const book = chapter.textbookRef.volume

  return (
    <header className={styles.opener}>
      <div className={styles.banner}>
        <span className={styles.number} aria-hidden="true">
          {chapter.number}
        </span>
        <div className={styles.titles}>
          <p className={styles.kicker}>
            Chapter {chapter.number} · Book {book} · p.{chapter.textbookRef.page}
          </p>
          <h1 className={styles.title} lang="ko">
            {chapter.titleKo}
          </h1>
          <p className={styles.english}>{chapter.titleEn}</p>
        </div>
        <div className={styles.status}>
          <StatusBadge status={status} />
        </div>
      </div>

      {lesson && (
        <div className={styles.body}>
          <ul className={styles.topics} aria-label="In this chapter">
            <li>
              <span className={`${styles.pill} ${styles.grammar}`}>
                <span lang="ko">문법</span>
                <small>GRAMMAR</small>
              </span>
              <span className={styles.topicList} lang="ko">
                {lesson.grammar.map((g) => g.pattern).join(' · ')}
              </span>
            </li>
            <li>
              <span className={`${styles.pill} ${styles.vocabulary}`}>
                <span lang="ko">어휘</span>
                <small>VOCABULARY</small>
              </span>
              <span className={styles.topicList} lang="ko">
                {[...new Set(lesson.vocabulary.slice(0, 4).map((v) => v.titleKo))].join(' · ')}
              </span>
            </li>
            <li>
              <span className={`${styles.pill} ${styles.culture}`}>
                <span lang="ko">문화와 정보</span>
                <small>CULTURE</small>
              </span>
              <span className={styles.topicList} lang="ko">
                {lesson.culture.titleKo}
              </span>
            </li>
          </ul>

          <div className={styles.objectives}>
            <h2 className={styles.objectivesLabel}>
              <span lang="ko">학습 목표</span>
              <small>LEARNING OBJECTIVES</small>
            </h2>
            <ul className={styles.objectivesList}>
              {lesson.objectives.map((o) => (
                <li key={o.ko}>
                  <span lang="ko">{o.ko}</span>
                  <span className={styles.gloss}>{o.en}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
