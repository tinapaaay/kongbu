import styles from './App.module.css'

/**
 * Temporary home screen for Milestone 1.
 * It proves the project, design tokens, and tests work.
 * Milestone 2 replaces it with the real app shell and navigation.
 */
export default function App() {
  return (
    <main className={styles.page}>
      <header className={styles.banner}>
        <p className={styles.brand}>
          <span className={styles.brandAccent}>HANGUL</span> LAB
        </p>
        <h1 className={styles.title} lang="ko">
          한글 랩
        </h1>
        <p>EPS-TOPIK study workspace</p>
      </header>
      <section className={styles.body}>
        <p className={styles.status}>
          Project setup is complete. Study features arrive in the next milestones.
        </p>
      </section>
    </main>
  )
}
