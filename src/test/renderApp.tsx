import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router'
import { AppRoutes } from '../app/AppRoutes'
import { LearnerDataProvider } from '../data/LearnerDataProvider'
import { createLocalStorageRepository } from '../data/localStorageRepository'
import { MemoryStorage } from '../data/storage'

interface RenderOptions {
  storage?: MemoryStorage | null
  now?: () => Date
  /** Render something other than the full app, still inside the router and data provider. */
  children?: ReactNode
}

/**
 * Renders the app at a URL with in-memory storage, so tests never touch real browser data.
 * Loading is asynchronous: use `await screen.findBy...` for the first check.
 */
export function renderApp(path: string, { storage = new MemoryStorage(), now, children }: RenderOptions = {}) {
  const repository = createLocalStorageRepository(storage)
  const result = render(
    <MemoryRouter initialEntries={[path]}>
      <LearnerDataProvider repository={repository} now={now}>
        {children ?? <AppRoutes />}
      </LearnerDataProvider>
    </MemoryRouter>,
  )
  return { ...result, storage, repository }
}
