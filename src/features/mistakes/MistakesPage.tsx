import { useId, useState } from 'react'
import { Link } from 'react-router'
import buttons from '../../components/buttons.module.css'
import { formatDate } from '../../components/formatDate'
import { Notice } from '../../components/Notice'
import { PageHeader } from '../../components/PageHeader'
import { getChapter, getConcept, questions, studyAnchorId } from '../../content'
import { useLearnerData } from '../../data/learnerDataContext'
import { keepBlanksTogether } from '../../domain/quiz/playableQuestion'
import { conceptStats, listMistakes, type MistakeEntry } from '../../domain/progress/mistakes'
import { PracticeConceptButton } from '../../practice/PracticeConceptButton'
import { rangeStart, useMistakeFilters, type DateRange } from './useMistakeFilters'
import styles from './MistakesPage.module.css'

const questionsById = new Map(questions.map((q) => [q.id, q]))

export function MistakesPage() {
  const { data } = useLearnerData()
  const { filters, update, clear, isFiltered } = useMistakeFilters()
  // Read the clock once per visit, not on every render.
  const [now] = useState(() => new Date())
  const chapterSelectId = useId()
  const conceptSelectId = useId()
  const rangeSelectId = useId()

  const allMistakes = listMistakes(data.attempts)
  const mistakes = listMistakes(data.attempts, {
    chapterId: filters.chapterId || undefined,
    conceptId: filters.conceptId || undefined,
    since: rangeStart(filters.range, now),
  })

  // Filter choices come from the learner's own mistakes, so every option has results.
  const chapterOptions = [...new Set(allMistakes.map((m) => m.attempt.chapterId))]
  const conceptOptions = [
    ...new Set(
      allMistakes
        .filter((m) => !filters.chapterId || m.attempt.chapterId === filters.chapterId)
        .map((m) => m.attempt.conceptId),
    ),
  ]

  const groups = groupByConcept(mistakes)
  const statsByConcept = new Map(conceptStats(data.attempts).map((s) => [s.conceptId, s]))
  const openCount = mistakes.filter((m) => m.status === 'open').length
  const fixedCount = mistakes.length - openCount

  return (
    <>
      <PageHeader title="Mistakes" eyebrow="Review" />

      {allMistakes.length === 0 ? (
        <Notice>
          <p>
            {data.sessions.length === 0
              ? 'No mistakes yet. Wrong answers from your practice exams will appear here.'
              : 'No mistakes recorded. Every answer in your practice exams so far was correct.'}
          </p>
          <p>
            <Link to="/learn/11">Open Chapter 11</Link>
          </p>
        </Notice>
      ) : (
        <>
          <form className={styles.filters} aria-label="Filter mistakes" onSubmit={(e) => e.preventDefault()}>
            <div className={styles.field}>
              <label htmlFor={chapterSelectId}>Chapter</label>
              <select
                id={chapterSelectId}
                value={filters.chapterId}
                onChange={(e) => update({ chapterId: e.target.value })}
                className={styles.select}
              >
                <option value="">All chapters</option>
                {chapterOptions.map((id) => {
                  const chapter = getChapter(id)
                  return (
                    <option key={id} value={id}>
                      {chapter ? `${chapter.number} ${chapter.titleKo}` : id}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor={conceptSelectId}>Concept</label>
              <select
                id={conceptSelectId}
                value={filters.conceptId}
                onChange={(e) => update({ conceptId: e.target.value })}
                className={styles.select}
              >
                <option value="">All concepts</option>
                {conceptOptions.map((id) => (
                  <option key={id} value={id}>
                    {getConcept(id)?.label ?? id}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor={rangeSelectId}>Date</label>
              <select
                id={rangeSelectId}
                value={filters.range}
                onChange={(e) => update({ range: e.target.value as DateRange })}
                className={styles.select}
              >
                <option value="all">All time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
              </select>
            </div>
            {isFiltered && (
              <button type="button" className={buttons.secondary} onClick={clear}>
                Clear filters
              </button>
            )}
          </form>

          {data.activeSession && (
            <Notice>
              <p>
                You have an unfinished quiz. <Link to={`/quiz/${data.activeSession.id}`}>Finish it</Link> to practice a
                concept from here.
              </p>
            </Notice>
          )}

          <p className={styles.summary} aria-live="polite">
            <strong>{openCount}</strong> open {openCount === 1 ? 'mistake' : 'mistakes'} across{' '}
            <strong>{groups.length}</strong> {groups.length === 1 ? 'concept' : 'concepts'} · <strong>{fixedCount}</strong>{' '}
            fixed
          </p>

          {groups.length === 0 ? (
            <Notice>
              <p>Nothing matches these filters.</p>
              <p>
                <button type="button" className={styles.linkButton} onClick={clear}>
                  Clear filters
                </button>
              </p>
            </Notice>
          ) : (
            <div className={styles.groups}>
              {groups.map(({ conceptId, entries }) => {
                const concept = getConcept(conceptId)
                const stats = statsByConcept.get(conceptId)
                const chapter = getChapter(entries[0].attempt.chapterId)
                const open = entries.filter((e) => e.status === 'open').length
                return (
                  <section key={conceptId} className={styles.group} aria-labelledby={`concept-${conceptId}`}>
                    <header className={styles.groupHead}>
                      <div>
                        <h2 id={`concept-${conceptId}`} className={styles.groupTitle}>
                          <span lang="ko">{concept?.label ?? conceptId}</span>
                        </h2>
                        <p className={styles.gloss}>{concept?.labelEn}</p>
                        {stats && (
                          <p className={styles.meta}>
                            Missed <span className={styles.num}>{stats.total - stats.correct}</span>{' '}
                            {stats.total - stats.correct === 1 ? 'time' : 'times'} ·{' '}
                            <span className={styles.num}>
                              {stats.correct}/{stats.total}
                            </span>{' '}
                            correct overall
                            {stats.lastMissedAt && ` · last missed ${formatDate(stats.lastMissedAt)}`}
                          </p>
                        )}
                      </div>
                      <div className={styles.groupSide}>
                        <span className={open > 0 ? styles.pillOpen : styles.pillFixed}>
                          {open > 0 ? `${open} open` : 'All fixed'}
                        </span>
                        {open > 0 && <PracticeConceptButton conceptId={conceptId} label="Practice this concept" />}
                        {chapter && concept && (
                          <Link to={`/learn/${chapter.number}#${studyAnchorId(conceptId)}`} className={styles.studyLink}>
                            Study in Chapter {chapter.number} (p.{concept.textbookRef.page})
                          </Link>
                        )}
                      </div>
                    </header>
                    <ul className={styles.list}>
                      {entries.map((entry) => (
                        <li key={entry.attempt.id}>
                          <MistakeItem entry={entry} />
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
          )}
        </>
      )}
    </>
  )
}

function MistakeItem({ entry }: { entry: MistakeEntry }) {
  const { attempt, status } = entry
  const question = questionsById.get(attempt.questionId)
  const textOf = (id: string | null) => (id ? (question?.choices.find((c) => c.id === id)?.text ?? id) : null)
  const picked = textOf(attempt.selectedChoiceId)
  const correct = textOf(attempt.correctChoiceId)

  return (
    <article className={styles.item}>
      <div className={styles.itemHead}>
        <p className={styles.prompt} lang="ko">
          {question?.prompt ?? 'Question no longer available'}
        </p>
        <span className={status === 'open' ? styles.pillOpen : styles.pillFixed}>
          {status === 'open' ? 'Open' : 'Fixed'}
        </span>
      </div>
      {question?.context && (
        <p className={styles.context} lang="ko">
          {keepBlanksTogether(question.context.text)}
        </p>
      )}
      <dl className={styles.answers}>
        <dt>Your answer</dt>
        <dd lang="ko" className={styles.wrong}>
          {picked ?? <span lang="en">Skipped</span>}
        </dd>
        <dt>Correct</dt>
        <dd lang="ko" className={styles.right}>
          {correct}
        </dd>
      </dl>
      {question && (
        <details className={styles.explanation}>
          <summary>Explanation</summary>
          <p>{question.explanation}</p>
        </details>
      )}
      <p className={styles.meta}>
        Missed {formatDate(attempt.answeredAt)}
        {entry.fixedAt && ` · fixed ${formatDate(entry.fixedAt)}`} ·{' '}
        <Link to={`/quiz/${attempt.sessionId}/results`}>See that exam</Link>
      </p>
    </article>
  )
}

interface ConceptGroup {
  conceptId: string
  entries: MistakeEntry[]
}

/** Groups mistakes by concept: concepts with more open mistakes first, then the most recently missed. */
function groupByConcept(entries: MistakeEntry[]): ConceptGroup[] {
  const map = new Map<string, MistakeEntry[]>()
  for (const entry of entries) {
    const list = map.get(entry.attempt.conceptId) ?? []
    list.push(entry)
    map.set(entry.attempt.conceptId, list)
  }
  const open = (g: ConceptGroup) => g.entries.filter((e) => e.status === 'open').length
  const latest = (g: ConceptGroup) => g.entries[0].attempt.answeredAt
  return [...map.entries()]
    .map(([conceptId, list]) => ({ conceptId, entries: list }))
    .sort((a, b) => open(b) - open(a) || latest(b).localeCompare(latest(a)))
}
