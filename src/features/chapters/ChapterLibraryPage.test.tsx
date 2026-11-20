import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
    expect(screen.queryByRole('link', { name: '대중교통' })).not.toBeInTheDocument()
    expect(screen.getByText('대중교통')).toBeInTheDocument()
  })

  it('lists the chapters you can study first, on both book tabs', async () => {
    for (const path of ['/learn', '/learn?book=2']) {
      await renderAt(path)
      const ready = screen.getByRole('region', { name: 'Available now' })
      expect(within(ready).getByRole('link', { name: /11 집안일 Household Chores · Book 1/ })).toHaveAttribute('href', '/learn/11')
      document.body.innerHTML = ''
    }
  })

  it('shows every chapter as not started for a new learner', async () => {
    await renderAt('/learn')
    expect(screen.getAllByText('Not started')).toHaveLength(1)
    expect(screen.getAllByText('Coming later')).toHaveLength(29)
    expect(screen.queryByText(/Practiced|Mastered|Visited/)).not.toBeInTheDocument()
  })
})
