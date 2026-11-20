import { Component, Suspense, type ReactNode } from 'react'
import buttons from './buttons.module.css'
import { forgetFailedChapters } from '../content'
import { Notice } from './Notice'

/**
 * Wraps a page that may need to download a chapter's content.
 * - While downloading: a short "Loading…" message (React's <Suspense>).
 * - If the download fails (often because the connection dropped): a message and a retry button
 *   (an "error boundary": a component that catches errors thrown while its children render).
 *
 * `resetKey` (the page address) clears an old error when the learner moves to another page.
 */
export function ContentBoundary({ children, resetKey }: { children: ReactNode; resetKey: string }) {
  return (
    <LoadErrorBoundary resetKey={resetKey}>
      <Suspense
        fallback={
          <p role="status" style={{ padding: 'var(--spacing-lg) 0' }}>
            Loading…
          </p>
        }
      >
        {children}
      </Suspense>
    </LoadErrorBoundary>
  )
}

interface BoundaryProps {
  children: ReactNode
  resetKey: string
}

interface BoundaryState {
  failed: boolean
  failedAt: string
}

class LoadErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false, failedAt: '' }

  static getDerivedStateFromError(): Partial<BoundaryState> {
    return { failed: true }
  }

  static getDerivedStateFromProps(props: BoundaryProps, state: BoundaryState): Partial<BoundaryState> | null {
    // Remember where the error happened; moving to another page clears it.
    if (state.failed && state.failedAt === '') return { failedAt: props.resetKey }
    if (state.failed && state.failedAt !== props.resetKey) return { failed: false, failedAt: '' }
    return null
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <Notice>
        <p role="alert">This chapter couldn't be loaded. Check your internet connection, then try again.</p>
        <p>
          <button type="button" className={buttons.secondary} onClick={() => {
              forgetFailedChapters()
              this.setState({ failed: false, failedAt: '' })
            }}>
            Try again
          </button>
        </p>
      </Notice>
    )
  }
}
