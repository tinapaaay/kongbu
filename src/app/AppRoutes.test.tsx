import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../test/renderApp'

/** Waits for the app to load, then returns the page's main heading. */
async function heading(name: string) {
  return screen.findByRole('heading', { level: 1, name })
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
  ])('shows the right page at %s', async (path, name) => {
    renderApp(path)
    expect(await heading(name)).toBeInTheDocument()
  })

  it('sends /practice to the mistakes page', async () => {
    renderApp('/practice')
    expect(await heading('Mistakes')).toBeInTheDocument()
  })

  it.each(['/learn/0', '/learn/61', '/learn/abc', '/learn/11.5'])('treats %s as not found', async (path) => {
    renderApp(path)
    expect(await heading('Page not found')).toBeInTheDocument()
  })

  it('shows a not-found page for unknown addresses', async () => {
    renderApp('/does-not-exist')
    expect(await heading('Page not found')).toBeInTheDocument()
  })

  it('sets the browser tab title for each page', async () => {
    renderApp('/learn')
    await heading('Chapters')
    expect(document.title).toBe('Chapters · Hangul Lab')
  })
})

describe('navigation', () => {
  it('marks only the current section as active', async () => {
    renderApp('/learn/11')
    await heading('Chapter 11')
    const nav = desktopNav()
    expect(within(nav).getByRole('link', { name: 'Learn' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
  })

  it('moves to a new page when a link is clicked', async () => {
    renderApp('/')
    await heading('오늘의 공부')
    await userEvent.click(within(desktopNav()).getByRole('link', { name: 'Settings' }))
    expect(await heading('Settings')).toBeInTheDocument()
  })

  it('offers a skip link for keyboard users', async () => {
    renderApp('/')
    await heading('오늘의 공부')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
  })

  it('hides main navigation during a quiz', async () => {
    renderApp('/quiz/test-session')
    expect(await heading('Practice exam')).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Main' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Exit quiz/ })).toBeInTheDocument()
  })
})
