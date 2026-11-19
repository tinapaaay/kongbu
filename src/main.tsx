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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>,
)
