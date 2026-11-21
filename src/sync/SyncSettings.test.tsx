import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { expect, it, vi } from 'vitest'
import { CloudContext, type CloudContextValue } from './cloudContext'
import { SyncSettings } from './SyncSettings'

function show(overrides: Partial<CloudContextValue> = {}) {
  const signIn = vi.fn(async () => {})
  render(<MemoryRouter><CloudContext.Provider value={{
    configured: true, email: null, status: { state: 'signed-out', pending: 0 },
    signIn, signOut: async () => {}, sync: async () => {}, ...overrides,
  }}><SyncSettings /></CloudContext.Provider></MemoryRouter>)
  return signIn
}
it('sends a link only after an explicit email submission and shows delivery instructions', async () => {
  const signIn = show()
  expect(signIn).not.toHaveBeenCalled()
  await userEvent.type(screen.getByLabelText('Email address'), 'learner@example.test')
  await userEvent.click(screen.getByRole('button', { name: 'Email me a sign-in link' }))
  expect(signIn).toHaveBeenCalledWith('learner@example.test')
  expect(await screen.findByRole('status')).toHaveTextContent('Check your email')
})
it('shows authentication errors and permits retry', async () => {
  show({ signIn: async () => { throw new Error('Could not send a sign-in link.') } })
  await userEvent.type(screen.getByLabelText('Email address'), 'learner@example.test')
  await userEvent.click(screen.getByRole('button', { name: 'Email me a sign-in link' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not send')
  expect(screen.getByRole('button', { name: 'Email me a sign-in link' })).toBeEnabled()
})
it('explains the local fallback when cloud configuration is absent', () => {
  show({ configured: false })
  expect(screen.getByText(/Cloud sync is not set up yet/)).toBeVisible()
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})
