import { useEffect, useId, useRef, type ReactNode } from 'react'
import buttons from './buttons.module.css'
import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  cancelLabel: string
  onConfirm(): void
  onCancel(): void
  /** Disables the confirm button while the action runs, so it can't be pressed twice. */
  busy?: boolean
}

/**
 * A yes/no question in the browser's built-in modal <dialog>.
 * The browser keeps keyboard focus inside it, dims the page, and closes it on Escape.
 * The safe choice (cancel) gets focus first.
 */
export function ConfirmDialog({ open, title, children, confirmLabel, cancelLabel, onConfirm, onCancel, busy }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Escape key: let React state decide, so the dialog and state never disagree.
        event.preventDefault()
        onCancel()
      }}
    >
      {open && (
        <div className={styles.body}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <div className={styles.content}>{children}</div>
          <div className={styles.actions}>
            <button type="button" className={buttons.secondary} onClick={onCancel} autoFocus>
              {cancelLabel}
            </button>
            <button type="button" className={buttons.primary} onClick={onConfirm} disabled={busy}>
              {confirmLabel}
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
