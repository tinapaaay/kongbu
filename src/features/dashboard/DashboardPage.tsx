import { useState } from 'react'
import { Link } from 'react-router'
import buttons from '../../components/buttons.module.css'
import { PageHeader } from '../../components/PageHeader'
import { StatusBadge } from '../../components/StatusBadge'
import { chapters, conceptIdsForChapter, getConcept } from '../../content'
import { useLearnerData } from '../../data/learnerDataContext'
import { weekActivity } from '../../domain/progress/activity'
import { chapterProgress, percent, type ChapterStatus } from '../../domain/progress/chapterProgress'
import { conceptStats, weakConcepts } from '../../domain/progress/mistakes'
import { currentChapter, nextStep, type NextStep } from '../../domain/progress/nextStep'
import { PracticeConceptButton } from '../../practice/PracticeConceptButton'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const { data } = useLearnerData()
  // Read the clock once per visit, not on every render.
  const [today] = useState(() => new Date())

  const step = nextStep(data, chapters, conceptIdsForChapter)
  const weak = weakConcepts(data.attempts).slice(0, 3)
  const chapter = currentChapter(data, chapters)
  const progress = chapterProgress(chapter.id, data, conceptIdsForChapter(chapter.id))
  const counts = statusCounts(data)
  const week = weekActivity(data.attempts, today)
  const weekTotal = week.reduce((sum, d) => sum + d.questions, 0)
  const studyDays = week.filter((d) => d.questions > 0).length
  const recent = recentlyStudied(data)
  const hasQuizzes = data.sessions.length > 0

  return (
    <>
      <PageHeader
        title="오늘의 공부"
        lang="ko"
        eyebrow={today.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
        gloss="Today's study"
      />

      <NextStepPanel step={step} />

      <div className={styles.grid}>
        <section className={styles.box} aria-labelledby="weak-heading">
          <div className={styles.boxHead}>
            <h2 id="weak-heading" className={styles.boxTitle}>
              Weak concepts
            </h2>
            {hasQuizzes && (
              <Link to="/practice/mistakes" className={styles.more}>
                See all mistakes
              </Link>
            )}
          </div>
          {weak.length > 0 ? (
            <ul className={styles.list}>
              {weak.map((stat) => {
                const concept = getConcept(stat.conceptId)
                return (
                  <li key={stat.conceptId} className={styles.listRow}>
                    <div>
                      <p className={styles.strong} lang="ko">
                        {concept?.label ?? stat.conceptId}
                      </p>
                      <p className={styles.gloss}>{concept?.labelEn}</p>
                    </div>
                    <div className={styles.right}>
                      <span className={styles.openPill}>{stat.openMistakes} open</span>
                      <p className={styles.meta}>
                        <span className={styles.num}>
                          {stat.correct}/{stat.total}
                        </span>{' '}
                        correct
                      </p>
                      <PracticeConceptButton conceptId={stat.conceptId} />
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className={styles.meta}>
              {hasQuizzes
                ? 'No open mistakes. Every concept you missed has since been answered correctly.'
                : 'Concepts you miss will appear here after your first practice exam.'}
            </p>
          )}
        </section>

        <div className={styles.column}>
          <section className={styles.box} aria-labelledby="progress-heading">
            <h2 id="progress-heading" className={styles.boxTitle}>
              Chapter progress
            </h2>
            <div className={styles.listRow}>
              <Link to={`/learn/${chapter.number}`} className={styles.chapterLink}>
                <span className={styles.num}>{chapter.number}</span> <span lang="ko">{chapter.titleKo}</span>
              </Link>
              <StatusBadge status={progress.status} />
            </div>
            {progress.latestScore && (
              <p className={styles.meta}>
                Last exam{' '}
                <span className={styles.num}>
                  {progress.latestScore.correct}/{progress.latestScore.total}
                </span>{' '}
                ({percent(progress.latestScore)}%)
              </p>
            )}
            {/* Each chapter is in exactly one group, so the four numbers add up to the total. */}
            <p className={styles.meta}>
              All <span className={styles.num}>{chapters.length}</span> chapters:{' '}
              <span className={styles.num}>{counts.mastered}</span> mastered ·{' '}
              <span className={styles.num}>{counts.practiced}</span> practiced ·{' '}
              <span className={styles.num}>{counts.visited}</span> visited ·{' '}
              <span className={styles.num}>{counts['not-started']}</span> not started
            </p>
          </section>

          <section className={styles.box} aria-labelledby="week-heading">
            <h2 id="week-heading" className={styles.boxTitle}>
              This week
            </h2>
            <ol className={styles.week}>
              {week.map((day) => (
                <li key={day.date} className={day.questions > 0 ? styles.dayActive : styles.day}>
                  <span>{day.weekday.slice(0, 1)}</span>
                  <span className={styles.num}>{day.questions > 0 ? day.questions : '–'}</span>
                  <span className={styles.visuallyHidden}>
                    {day.weekday}: {day.questions} questions
                  </span>
                </li>
              ))}
            </ol>
            <p className={styles.meta}>
              <span className={styles.num}>{weekTotal}</span> {weekTotal === 1 ? 'question' : 'questions'} answered ·{' '}
              <span className={styles.num}>{studyDays}</span> {studyDays === 1 ? 'study day' : 'study days'}
            </p>
          </section>
        </div>
      </div>

      {recent.length > 0 && (
        <section className={`${styles.box} ${styles.recent}`} aria-labelledby="recent-heading">
          <h2 id="recent-heading" className={styles.boxTitle}>
            Recently studied
          </h2>
          <ul className={styles.recentList}>
            {recent.map((r) => (
              <li key={r.conceptId}>
                <span lang="ko">{getConcept(r.conceptId)?.label ?? r.conceptId}</span>{' '}
                <span className={styles.meta}>
                  <span className={styles.num}>
                    {r.correct}/{r.total}
                  </span>{' '}
                  in your last exam
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

function NextStepPanel({ step }: { step: NextStep }) {
  const { label, title, detail, action, to } = describeStep(step)
  return (
    <section className={styles.next} aria-labelledby="next-heading">
      <div>
        <p className={styles.nextLabel}>{label}</p>
        <h2 id="next-heading" className={styles.nextTitle}>
          {title}
        </h2>
        <p className={styles.meta}>{detail}</p>
      </div>
      <Link to={to} className={buttons.primary}>
        {action}
      </Link>
    </section>
  )
}

function describeStep(step: NextStep) {
  switch (step.kind) {
    case 'resume-quiz':
      return {
        label: 'Next step',
        title: `Resume Chapter ${step.chapter.number} practice`,
        detail: `${step.answered} of ${step.total} questions answered. Your answers are saved.`,
        action: 'Resume quiz',
        to: `/quiz/${step.session.id}`,
      }
    case 'review-mistakes': {
      const concept = getConcept(step.concept.conceptId)
      return {
        label: 'Next step',
        title: `Review ${concept?.label ?? 'your mistakes'}`,
        detail: `${step.openConcepts} ${step.openConcepts === 1 ? 'concept has' : 'concepts have'} open mistakes. Reviewing them now helps them stick.`,
        action: 'Review mistakes',
        to: '/practice/mistakes',
      }
    }
    case 'start-chapter':
      return {
        label: step.progress.status === 'visited' ? 'Continue' : 'Start here',
        title: `${step.chapter.number} ${step.chapter.titleKo}`,
        detail: `${step.chapter.titleEn} · Book ${step.chapter.textbookRef.volume}, p.${step.chapter.textbookRef.page}. Read the chapter, then take a 10-question practice exam.`,
        action: `Open Chapter ${step.chapter.number}`,
        to: `/learn/${step.chapter.number}`,
      }
    case 'practice-chapter':
      return {
        label: 'Next step',
        title: `Practice Chapter ${step.chapter.number} again`,
        detail: `Last exam ${step.progress.latestScore?.correct}/${step.progress.latestScore?.total}. Mastery needs at least 80%, a right answer in every concept, and no open mistakes.`,
        action: `Open Chapter ${step.chapter.number}`,
        to: `/learn/${step.chapter.number}#practice`,
      }
    case 'chapter-mastered':
      return {
        label: 'Mastered',
        title: `Chapter ${step.chapter.number} is mastered`,
        detail: 'More chapters are added one at a time. You can keep practicing to stay sharp.',
        action: 'See all chapters',
        to: '/learn',
      }
  }
}

function statusCounts(data: Parameters<typeof chapterProgress>[1]): Record<ChapterStatus, number> {
  const counts = { 'not-started': 0, visited: 0, practiced: 0, mastered: 0 }
  for (const chapter of chapters) counts[chapterProgress(chapter.id, data, conceptIdsForChapter(chapter.id)).status]++
  return counts
}

/** Concepts from the most recent exam, with how that exam went for each. */
function recentlyStudied(data: Parameters<typeof chapterProgress>[1]) {
  const latest = [...data.sessions].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0]
  if (!latest) return []
  return conceptStats(data.attempts.filter((a) => a.sessionId === latest.id))
}
