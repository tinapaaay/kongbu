import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './AppRoutes'

/** Renders the app at a given URL, without a real browser address bar. */
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

/** The desktop navigation (the first of the two "Main" navs). */
function desktopNav() {
  return screen.getAllByRole('navigation', { name: 'Main' })[0]
}

describe('routes', () => {
  it.each([
    ['/', '오늘의 공부'],
    ['/learn', 'Chapters'],
    ['/learn/11', 'Chapter 11'],
    ['/practice/mistakes', 'Mistakes'],
    ['/quiz/test-session/results', 'Results'],
    ['/settings', 'Settings'],
  ])('shows the right page at %s', (path, heading) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
  })

  it('sends /practice to the mistakes page', () => {
    renderAt('/practice')
    expect(screen.getByRole('heading', { level: 1, name: 'Mistakes' })).toBeInTheDocument()
  })

  it.each(['/learn/0', '/learn/61', '/learn/abc', '/learn/11.5'])('treats %s as not found', (path) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })

  it('shows a not-found page for unknown addresses', () => {
    renderAt('/does-not-exist')
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })

  it('sets the browser tab title for each page', () => {
    renderAt('/learn')
    expect(document.title).toBe('Chapters · Hangul Lab')
  })
})

describe('navigation', () => {
  it('marks only the current section as active', () => {
    renderAt('/learn/11')
    const nav = desktopNav()
    expect(within(nav).getByRole('link', { name: 'Learn' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
  })

  it('moves to a new page when a link is clicked', async () => {
    renderAt('/')
    await userEvent.click(within(desktopNav()).getByRole('link', { name: 'Settings' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument()
  })

  it('offers a skip link for keyboard users', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
  })

  it('hides main navigation during a quiz', () => {
    renderAt('/quiz/test-session')
    expect(screen.getByRole('heading', { level: 1, name: 'Practice exam' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Main' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Exit quiz/ })).toBeInTheDocument()
  })
})
