import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

// Self-hosted fonts, so text looks right even without internet access.
// Korean uses system fonts: Apple SD Gothic Neo (Mac, iPhone), Malgun Gothic (Windows), Noto Sans CJK (Android).
import '@fontsource/titillium-web/700.css'
import '@fontsource/titillium-web/900.css'

import './styles/tokens.css'
import './styles/global.css'
import { AppRoutes } from './app/AppRoutes'
import { ServiceWorkerUpdates } from './app/ServiceWorkerUpdates'
import { LearnerDataProvider } from './data/LearnerDataProvider'
import { createLocalStorageRepository } from './data/localStorageRepository'
import { getBrowserStorage } from './data/storage'

// Created once for the whole app. Phase 2 swaps this line for a database repository.
const repository = createLocalStorageRepository(getBrowserStorage())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/+$/, '') || '/'}>
      <LearnerDataProvider repository={repository}>
        <ServiceWorkerUpdates />
        <AppRoutes />
      </LearnerDataProvider>
    </BrowserRouter>
  </StrictMode>,
)
