import { useRegisterSW } from 'virtual:pwa-register/react'
import { UpdateNotice } from './UpdateNotice'

/**
 * Registers the service worker (production builds only) and shows its notices.
 * Kept apart from UpdateNotice because `virtual:pwa-register` exists only inside a Vite build.
 */
export function ServiceWorkerUpdates() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW()
  return (
    <UpdateNotice
      needRefresh={needRefresh}
      offlineReady={offlineReady}
      onReload={() => void updateServiceWorker(true)}
      onDismiss={() => { setNeedRefresh(false); setOfflineReady(false) }}
    />
  )
}
