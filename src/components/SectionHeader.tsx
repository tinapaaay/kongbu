import type { ReactNode } from 'react'
import styles from './SectionHeader.module.css'

export type SectionKind = 'grammar' | 'vocabulary' | 'conversation' | 'culture' | 'reading' | 'neutral'

interface SectionHeaderProps {
  kind: SectionKind
  /** Korean label, e.g. "문법". */
  labelKo: string
  /** English label, e.g. "GRAMMAR". */
  labelEn: string
  /** Optional large number after the label, like the book's "문법 1". */
  number?: number
  id?: string
  /** Heading level for the label. */
  as?: 'h2' | 'h3'
  icon?: ReactNode
}

/** The textbook's section header: a black icon tile and a colored tab. Colors follow DESIGN.md. */
export function SectionHeader({ kind, labelKo, labelEn, number, id, as: Heading = 'h2', icon }: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <span className={styles.tile} aria-hidden="true">
        {icon ?? <DefaultIcon />}
      </span>
      <Heading id={id} className={`${styles.tab} ${styles[kind]}`}>
        <span lang="ko">{labelKo}</span> <span className={styles.english}>{labelEn}</span>
        {number !== undefined && <span className={styles.number}>{number}</span>}
      </Heading>
      <span className={styles.rule} />
    </div>
  )
}

function DefaultIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  )
}
