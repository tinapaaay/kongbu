import type { ReactNode } from 'react'
import styles from './Notice.module.css'

/** A beige note box, used for empty states and "not built yet" messages. */
export function Notice({ children }: { children: ReactNode }) {
  return <div className={styles.notice}>{children}</div>
}
