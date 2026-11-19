import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('shows the Korean app title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: '한글 랩' })).toBeInTheDocument()
  })

  it('marks Korean text so browsers and screen readers handle it correctly', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveAttribute('lang', 'ko')
  })
})
