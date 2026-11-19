// Adds DOM matchers such as toBeInTheDocument() to Vitest's expect.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Remove rendered components between tests so each test starts fresh.
afterEach(() => {
  cleanup()
})

// jsdom doesn't implement scrolling; the app calls it after navigation.
window.scrollTo = () => {}

// jsdom doesn't implement modal dialogs yet. Real browsers do; this minimal stand-in
// opens and closes them so dialog behavior can be tested.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.open = false
  }
}
