import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../../app/AppRoutes'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

function rows() {
  // Skip the header row.
  return within(screen.getByRole('table')).getAllByRole('row').slice(1)
}

describe('Chapter Library', () => {
  it('lists Book 1 chapters 1–30 by default', () => {
    renderAt('/learn')
    expect(rows()).toHaveLength(30)
    expect(screen.getByRole('link', { name: /Book 1/ })).toHaveAttribute('aria-current', 'page')
  })

  it('lists Book 2 chapters 31–60 when Book 2 is chosen', () => {
    renderAt('/learn?book=2')
    expect(rows()).toHaveLength(30)
    expect(screen.getByText('근로자 보험')).toBeInTheDocument()
    expect(screen.queryByText('집안일')).not.toBeInTheDocument()
  })

  it('links only chapters that have content', () => {
    renderAt('/learn')
    expect(screen.getByRole('link', { name: '집안일' })).toHaveAttribute('href', '/learn/11')
    expect(screen.queryByRole('link', { name: '대중교통' })).not.toBeInTheDocument()
    expect(screen.getByText('대중교통')).toBeInTheDocument()
  })

  it('shows no learner progress, because none exists yet', () => {
    renderAt('/learn')
    expect(screen.queryByText(/Practiced|Mastered|Visited/)).not.toBeInTheDocument()
  })
})
