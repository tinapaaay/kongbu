import type { GrammarPoint, Lesson } from '../../content'
import { SectionHeader } from '../../components/SectionHeader'
import styles from './LessonContent.module.css'

/** The lesson body, in textbook order: vocabulary, grammar, and culture. */
export function LessonContent({ lesson }: { lesson: Lesson }) {
  const sections = [
    { id: 'vocabulary', label: 'Vocabulary' },
    ...lesson.grammar.map((g, i) => ({ id: `grammar-${i + 1}`, label: g.pattern })),
    { id: 'culture', label: 'Culture' },
    { id: 'practice', label: 'Practice exam' },
  ]

  return (
    <>
      <nav className={styles.jump} aria-label="Chapter sections">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={styles.jumpLink}>
            {s.label}
          </a>
        ))}
      </nav>

      <section className={styles.section} aria-labelledby="vocabulary">
        <SectionHeader kind="vocabulary" labelKo="어휘" labelEn="Vocabulary" id="vocabulary" />
        <div className={styles.vocabGrid}>
          {lesson.vocabulary.map((group) => (
            <article key={group.titleKo} className={styles.vocabCard}>
              <h3 className={styles.vocabTitle}>
                <span lang="ko">{group.titleKo}</span>
                <span className={styles.vocabTitleEn}>{group.titleEn}</span>
              </h3>
              <dl className={styles.vocabList}>
                {group.items.map((item) => (
                  <div key={item.ko} className={styles.vocabItem}>
                    <dt lang="ko">{item.ko}</dt>
                    <dd className={styles.gloss}>{item.en}</dd>
                  </div>
                ))}
              </dl>
              <p className={styles.source}>Book {group.textbookRef.volume}, p.{group.textbookRef.page}</p>
            </article>
          ))}
        </div>
      </section>

      {lesson.grammar.map((point, i) => (
        <GrammarSection key={point.conceptId} point={point} number={i + 1} />
      ))}

      <section className={styles.section} aria-labelledby="culture">
        <SectionHeader kind="culture" labelKo="문화와 정보" labelEn="Culture & Information" id="culture" />
        <h3 className={styles.cultureTitle}>
          <span lang="ko">{lesson.culture.titleKo}</span>
          <span className={styles.gloss}>{lesson.culture.titleEn}</span>
        </h3>
        <div className={styles.prose}>
          {lesson.culture.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        <p className={styles.source}>
          Summary written for Hangul Lab · Book {lesson.culture.textbookRef.volume}, p.{lesson.culture.textbookRef.page}
        </p>
      </section>
    </>
  )
}

function GrammarSection({ point, number }: { point: GrammarPoint; number: number }) {
  const id = `grammar-${number}`
  return (
    <section className={styles.section} aria-labelledby={id}>
      <SectionHeader kind="grammar" labelKo="문법" labelEn="Grammar" number={number} id={id} />
      <div className={styles.grammarGrid}>
        <div>
          <h3 className={styles.pattern} lang="ko">
            {point.pattern}
          </h3>
          <p className={styles.meaning}>{point.meaningEn}</p>
          <p className={styles.explanation}>{point.explanationEn}</p>

          <table className={styles.rules}>
            <caption className={styles.visuallyHidden}>How to form {point.pattern}</caption>
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Form</th>
                <th scope="col">Example</th>
              </tr>
            </thead>
            <tbody>
              {point.rules.map((rule) => (
                <tr key={rule.when}>
                  <td>{rule.when}</td>
                  <td className={styles.form} lang="ko">
                    {rule.form}
                  </td>
                  <td lang="ko">{rule.example}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.examples}>
            <span className={styles.exampleMark} lang="ko" aria-label="Examples">
              예
            </span>
            <ul>
              {point.examples.map((example) => (
                <li key={example.ko}>
                  <span lang="ko">
                    <Highlighted text={example.ko} highlight={example.highlight} />
                  </span>
                  <span className={styles.gloss}>{example.en}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {point.notes.length > 0 && (
          <aside className={styles.tip} aria-label="Tip">
            <span className={styles.tipBadge}>TIP</span>
            {point.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </aside>
        )}
      </div>
      <p className={styles.source}>
        Book {point.textbookRef.volume}, p.{point.textbookRef.page}
      </p>
    </section>
  )
}

/** Shows the target grammar in an example in the Example color, like the book's highlight. */
function Highlighted({ text, highlight }: { text: string; highlight?: string }) {
  const index = highlight ? text.indexOf(highlight) : -1
  if (!highlight || index < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, index)}
      <strong className={styles.highlight}>{highlight}</strong>
      {text.slice(index + highlight.length)}
    </>
  )
}
