import { StrictMode } from 'react'
import { createClient } from '@supabase/supabase-js'
import { CloudProvider } from './sync/CloudProvider'
import { createSyncRepository } from './sync/syncRepository'
import { createSupabaseTransport } from './sync/supabaseTransport'
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

const storage = getBrowserStorage()
const local = createLocalStorageRepository(storage)
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
const client = url && key ? createClient(url, key) : null
const controller = client ? createSyncRepository(local, createSupabaseTransport(client), storage) : null
const repository = controller?.repository ?? local
const app = (
  <LearnerDataProvider repository={repository}>
    <ServiceWorkerUpdates />
    <AppRoutes />
  </LearnerDataProvider>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/+$/, '') || '/'}>
      {client && controller ? <CloudProvider client={client} controller={controller}>{app}</CloudProvider> : app}
    </BrowserRouter>
  </StrictMode>,
)
