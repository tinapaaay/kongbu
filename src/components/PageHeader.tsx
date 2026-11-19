import type { ReactNode } from 'react'
import { useDocumentTitle } from './useDocumentTitle'
import styles from './PageHeader.module.css'

interface PageHeaderProps {
  /** Main heading. Also used for the browser tab title. */
  title: string
  /** Set to "ko" when the title is Korean. */
  lang?: 'ko' | 'en'
  /** Small label above the title, such as "Book 1 · p.150". */
  eyebrow?: string
  /** English gloss under a Korean title. */
  gloss?: string
  children?: ReactNode
}

/** Consistent heading block at the top of each screen. */
export function PageHeader({ title, lang, eyebrow, gloss, children }: PageHeaderProps) {
  useDocumentTitle(title)
  return (
    <header className={styles.header}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h1 className={styles.title} lang={lang}>
        {title}
      </h1>
      {gloss && <p className={styles.gloss}>{gloss}</p>}
      {children}
    </header>
  )
}
