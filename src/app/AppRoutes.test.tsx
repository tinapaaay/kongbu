import { screen, waitFor, within } from '@testing-library/react'
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
    ['/learn/11', '집안일'],
    ['/practice/mistakes', 'Mistakes'],
    ['/quiz/test-session/results', 'Results not found'],
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
    // The title is set just after the page appears, so wait for it instead of checking at once.
    // Checking immediately passed on a fast machine but could fail on a busy one (a "flaky" test).
    await waitFor(() => expect(document.title).toBe('Chapters · Gongbu'))
  })
})

describe('navigation', () => {
  it('marks only the current section as active', async () => {
    renderApp('/learn/11')
    await heading('집안일')
    const nav = desktopNav()
    expect(within(nav).getByRole('link', { name: 'Learn' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
  })

  it('names the mistakes tab for what it holds', async () => {
    renderApp('/practice/mistakes')
    await heading('Mistakes')
    expect(within(desktopNav()).getByRole('link', { name: 'Mistakes' })).toHaveAttribute('aria-current', 'page')
  })

  it('moves to a new page when a link is clicked', async () => {
    renderApp('/')
    await heading('오늘의 공부')
    await userEvent.click(within(desktopNav()).getByRole('link', { name: 'Settings' }))
    expect(await heading('Settings')).toBeInTheDocument()
  })

  it('leaves focus alone on first load, then moves it to new content after navigating', async () => {
    renderApp('/')
    await heading('오늘의 공부')
    expect(document.activeElement).not.toBe(document.getElementById('main'))

    await userEvent.click(within(desktopNav()).getByRole('link', { name: 'Learn' }))
    await heading('Chapters')
    expect(document.activeElement).toBe(document.getElementById('main'))
  })

  it('offers a skip link for keyboard users', async () => {
    renderApp('/')
    await heading('오늘의 공부')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
  })

  it('shows a quiz address without main navigation, and explains when the quiz does not exist', async () => {
    renderApp('/quiz/test-session')
    expect(await heading('Quiz not found')).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Main' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to the dashboard' })).toHaveAttribute('href', '/')
  })
})
