import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { CloudContext } from './cloudContext'
import type { SyncController } from './syncRepository'

export function CloudProvider({ client, controller, children }: {
  client: SupabaseClient; controller: SyncController; children: ReactNode
}) {
  const [email, setEmail] = useState<string | null>(null)
  const status = useSyncExternalStore(controller.subscribe, controller.getStatus)
  useEffect(() => {
    // Supabase emits INITIAL_SESSION too; no competing getSession() race.
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null)
      // Do not call Supabase methods synchronously inside its auth lock.
      queueMicrotask(() => controller.setUser(session?.user.id ?? null))
    })
    const retry = () => { void controller.sync() }
    window.addEventListener('online', retry)
    window.addEventListener('focus', retry)
    const timer = window.setInterval(retry, 30_000)
    return () => {
      data.subscription.unsubscribe()
      controller.setUser(null)
      window.removeEventListener('online', retry)
      window.removeEventListener('focus', retry)
      window.clearInterval(timer)
    }
  }, [client, controller])

  return <CloudContext.Provider value={{
    configured: true, email, status, sync: controller.sync,
    async signIn(address) {
      const { error } = await client.auth.signInWithOtp({ email: address, options: {
        emailRedirectTo: new URL(`${import.meta.env.BASE_URL}settings`, window.location.origin).href,
      } })
      if (error) throw new Error('Could not send a sign-in link. Check your email address and connection, then try again.')
    },
    async signOut() {
      controller.setUser(null)
      const { error } = await client.auth.signOut({ scope: 'local' })
      if (error) throw new Error('Could not sign out. Try again when connected.')
      setEmail(null)
    },
  }}>{children}</CloudContext.Provider>
}
