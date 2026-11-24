import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { expect, it, vi } from 'vitest'
import { CloudContext, type CloudContextValue } from './cloudContext'
import { SyncSettings, type DeviceProgress } from './SyncSettings'

function show(overrides: Partial<CloudContextValue> = {}, progress?: DeviceProgress) {
  const signIn = vi.fn(async () => {})
  render(<MemoryRouter><CloudContext.Provider value={{
    configured: true, email: null, status: { state: 'signed-out', pending: 0 },
    signIn, verifyCode: async () => {}, signOut: async () => {}, sync: async () => {}, forgetDevice: async () => {}, ...overrides,
  }}><SyncSettings progress={progress} /></CloudContext.Provider></MemoryRouter>)
  return signIn
}
it('sends a code only after an explicit email submission, then asks for the code', async () => {
  const signIn = show()
  expect(signIn).not.toHaveBeenCalled()
  await userEvent.type(screen.getByLabelText('Email address'), 'learner@example.test')
  await userEvent.click(screen.getByRole('button', { name: 'Email me a sign-in code' }))
  expect(signIn).toHaveBeenCalledWith('learner@example.test')
  expect(await screen.findByRole('status')).toHaveTextContent('We emailed a sign-in code to learner@example.test')
  expect(screen.getByLabelText('Sign-in code')).toHaveAttribute('autocomplete', 'one-time-code')
})
it('signs in with the typed code, ignoring spaces, in this app rather than through a link', async () => {
  const verifyCode = vi.fn(async () => {})
  show({ verifyCode })
  await userEvent.type(screen.getByLabelText('Email address'), 'learner@example.test')
  await userEvent.click(screen.getByRole('button', { name: 'Email me a sign-in code' }))
  await userEvent.type(await screen.findByLabelText('Sign-in code'), '123 456')
  await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))
  expect(verifyCode).toHaveBeenCalledWith('learner@example.test', '123456')
})
it('keeps the code form open with an explanation when the code is wrong', async () => {
  show({ verifyCode: async () => { throw new Error('That code didn’t work.') } })
  await userEvent.type(screen.getByLabelText('Email address'), 'learner@example.test')
  await userEvent.click(screen.getByRole('button', { name: 'Email me a sign-in code' }))
  await userEvent.type(await screen.findByLabelText('Sign-in code'), '000000')
  await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('That code didn’t work')
  expect(screen.getByLabelText('Sign-in code')).toBeEnabled()
  await userEvent.click(screen.getByRole('button', { name: 'Use a different email' }))
  expect(screen.getByLabelText('Email address')).toHaveValue('learner@example.test')
})
it('shows authentication errors and permits retry', async () => {
  show({ signIn: async () => { throw new Error('Could not send a sign-in code.') } })
  await userEvent.type(screen.getByLabelText('Email address'), 'learner@example.test')
  await userEvent.click(screen.getByRole('button', { name: 'Email me a sign-in code' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not send')
  expect(screen.getByRole('button', { name: 'Email me a sign-in code' })).toBeEnabled()
})
it('explains the local fallback when cloud configuration is absent', () => {
  show({ configured: false })
  expect(screen.getByText(/Cloud sync is not set up yet/)).toBeVisible()
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
})
it('forgets this device only after a confirm step that warns about records not synced yet', async () => {
  const forgetDevice = vi.fn(async () => {})
  show({ forgetDevice }, { records: 12, unsynced: 3 })
  await userEvent.click(screen.getByRole('button', { name: 'Forget this device’s progress' }))
  expect(forgetDevice).not.toHaveBeenCalled()
  expect(screen.getByText(/removes 12 saved records/)).toBeVisible()
  expect(screen.getByText(/3 records haven’t synced yet and will be lost/)).toBeVisible()
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(forgetDevice).not.toHaveBeenCalled()
  await userEvent.click(screen.getByRole('button', { name: 'Forget this device’s progress' }))
  await userEvent.click(screen.getByRole('button', { name: 'Forget progress' }))
  expect(forgetDevice).toHaveBeenCalledOnce()
  expect(await screen.findByText(/progress was forgotten/)).toBeVisible()
})
it('offers to forget the device only when signed out and something is saved', () => {
  show({ email: 'learner@example.test', status: { state: 'synced', pending: 0 } }, { records: 5, unsynced: 0 })
  expect(screen.queryByRole('button', { name: /Forget/ })).not.toBeInTheDocument()
})
it('does not offer to forget an empty device', () => {
  show({}, { records: 0, unsynced: 0 })
  expect(screen.queryByRole('button', { name: /Forget/ })).not.toBeInTheDocument()
})
