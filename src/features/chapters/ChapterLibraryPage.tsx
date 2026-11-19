import { Link, useSearchParams } from 'react-router'
import { PageHeader } from '../../components/PageHeader'
import { chapters } from '../../content'
import styles from './ChapterLibraryPage.module.css'

const books = [
  { volume: 1, label: 'Book 1', labelKo: '일상생활', range: '1–30' },
  { volume: 2, label: 'Book 2', labelKo: '직장생활', range: '31–60' },
] as const

/** All chapters in textbook order. The book tab lives in the URL (?book=2), so refresh keeps it. */
export function ChapterLibraryPage() {
  const [searchParams] = useSearchParams()
  const volume = searchParams.get('book') === '2' ? 2 : 1
  const book = books[volume - 1]
  const list = chapters.filter((c) => c.textbookRef.volume === volume)

  return (
    <>
      <PageHeader title="Chapters" eyebrow="Learn" />

      <nav aria-label="Textbook" className={styles.bookTabs}>
        {books.map((b) => (
          <Link
            key={b.volume}
            to={b.volume === 1 ? '/learn' : '/learn?book=2'}
            aria-current={b.volume === volume ? 'page' : undefined}
            className={b.volume === volume ? `${styles.bookTab} ${styles.bookTabActive}` : styles.bookTab}
          >
            {/* One wrapper span keeps the spaces; flex layout would drop them between separate pieces. */}
            <span>
              {b.label} · <span lang="ko">{b.labelKo}</span>
            </span>
          </Link>
        ))}
      </nav>

      <p className={styles.meta}>
        {book.label} covers chapters {book.range}. Content is added one chapter at a time.
      </p>

      <table className={styles.table}>
        <caption className={styles.visuallyHidden}>
          {book.label} chapters
        </caption>
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Chapter</th>
            <th scope="col" className={styles.hideOnPhone}>
              Page
            </th>
            <th scope="col">Content</th>
          </tr>
        </thead>
        <tbody>
          {list.map((chapter) => {
            const available = chapter.contentStatus === 'available'
            return (
              <tr key={chapter.id} className={available ? styles.availableRow : styles.plannedRow}>
                <td className={styles.number}>{String(chapter.number).padStart(2, '0')}</td>
                <td>
                  {available ? (
                    <Link to={`/learn/${chapter.number}`} className={styles.titleLink} lang="ko">
                      {chapter.titleKo}
                    </Link>
                  ) : (
                    <span className={styles.title} lang="ko">
                      {chapter.titleKo}
                    </span>
                  )}
                  <span className={styles.gloss}>{chapter.titleEn}</span>
                </td>
                <td className={`${styles.number} ${styles.hideOnPhone}`}>p.{chapter.textbookRef.page}</td>
                <td>
                  <span className={available ? styles.pillAvailable : styles.pillPlanned}>
                    {available ? 'Available' : 'Coming later'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
