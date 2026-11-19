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
    expect(screen.getByRole('link', { name: /Book 1/ })).toHaveAttribute('aria-current', 'page')
  })

  it('lists Book 2 chapters 31–60 when Book 2 is chosen', async () => {
    await renderAt('/learn?book=2')
    expect(rows()).toHaveLength(30)
    expect(screen.getByText('근로자 보험')).toBeInTheDocument()
    expect(screen.queryByText('집안일')).not.toBeInTheDocument()
  })

  it('links only chapters that have content', async () => {
    await renderAt('/learn')
    expect(screen.getByRole('link', { name: '집안일' })).toHaveAttribute('href', '/learn/11')
    expect(screen.queryByRole('link', { name: '대중교통' })).not.toBeInTheDocument()
    expect(screen.getByText('대중교통')).toBeInTheDocument()
  })

  it('shows no learner progress, because none exists yet', async () => {
    await renderAt('/learn')
    expect(screen.queryByText(/Practiced|Mastered|Visited/)).not.toBeInTheDocument()
  })
})
