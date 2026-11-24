import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { UpdateNotice } from './UpdateNotice'

const show = (props: Partial<Parameters<typeof UpdateNotice>[0]> = {}) => {
  const handlers = { onReload: vi.fn(), onDismiss: vi.fn() }
  render(<UpdateNotice needRefresh={false} offlineReady={false} {...handlers} {...props} />)
  return handlers
}

it('shows nothing until there is something to say', () => {
  show()
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})

it('lets the learner choose when to load a new version', async () => {
  const { onReload, onDismiss } = show({ needRefresh: true })
  expect(screen.getByRole('status')).toHaveTextContent('A new version of Kongbu is ready. Your progress is saved.')
  await userEvent.click(screen.getByRole('button', { name: 'Later' }))
  expect(onDismiss).toHaveBeenCalledOnce()
  expect(onReload).not.toHaveBeenCalled()
  await userEvent.click(screen.getByRole('button', { name: 'Reload' }))
  expect(onReload).toHaveBeenCalledOnce()
})

it('says once when the app works offline, with no reload button', async () => {
  const { onDismiss } = show({ offlineReady: true })
  expect(screen.getByRole('status')).toHaveTextContent('Kongbu now works offline on this device.')
  expect(screen.queryByRole('button', { name: 'Reload' })).not.toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'OK' }))
  expect(onDismiss).toHaveBeenCalledOnce()
})
