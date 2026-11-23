import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { chapters } from '../../content'
import { renderApp } from '../../test/renderApp'

/** Renders the library and waits for saved progress to load. */
async function renderAt(path: string) {
  renderApp(path)
  await screen.findByRole('heading', { level: 1, name: 'Chapters' })
}

function rows() {
  // Skip the header row.
  return within(screen.getByRole('table')).getAllByRole('row').slice(1)
}

describe('Chapter Library', () => {
  it('lists Book 1 chapters 1–30 by default', async () => {
    await renderAt('/learn')
    expect(rows()).toHaveLength(30)
    expect(within(screen.getByRole('navigation', { name: 'Textbook' })).getByRole('link', { name: /Book 1/ })).toHaveAttribute('aria-current', 'page')
  })

  it('lists Book 2 chapters 31–60 when Book 2 is chosen', async () => {
    await renderAt('/learn?book=2')
    expect(rows()).toHaveLength(30)
    expect(screen.getByText('근로자 보험')).toBeInTheDocument()
    expect(within(screen.getByRole('table')).queryByText('집안일')).not.toBeInTheDocument()
  })

  it('links only chapters that have content', async () => {
    await renderAt('/learn')
    expect(screen.getByRole('link', { name: '집안일' })).toHaveAttribute('href', '/learn/11')
    expect(screen.getByRole('link', { name: '대중교통' })).toHaveAttribute('href', '/learn/12')
    expect(screen.queryByRole('link', { name: '주말 활동' })).not.toBeInTheDocument()
    expect(screen.getByText('주말 활동')).toBeInTheDocument()
  })

  it('lists the chapters you can study first, on both book tabs', async () => {
    for (const path of ['/learn', '/learn?book=2']) {
      await renderAt(path)
      const ready = screen.getByRole('region', { name: 'Available now' })
      expect(within(ready).getByRole('link', { name: /1 자기소개 Self Introduction · Book 1/ })).toHaveAttribute('href', '/learn/1')
      expect(within(ready).getByRole('link', { name: /11 집안일 Household Chores · Book 1/ })).toHaveAttribute('href', '/learn/11')
      expect(within(ready).getByRole('link', { name: /12 대중교통 Public Transportation · Book 1/ })).toHaveAttribute('href', '/learn/12')
      document.body.innerHTML = ''
    }
  })

  it('shows every chapter as not started for a new learner', async () => {
    await renderAt('/learn')
    const book1 = chapters.filter((c) => c.textbookRef.volume === 1)
    const ready = book1.filter((c) => c.contentStatus === 'available').length
    expect(screen.getAllByText('Not started')).toHaveLength(ready)
    expect(screen.getAllByText('Coming later')).toHaveLength(book1.length - ready)
    expect(screen.queryByText(/Practiced|Mastered|Visited/)).not.toBeInTheDocument()
  })
})
