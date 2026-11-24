import { createContext, useContext } from 'react'
import type { SyncStatus } from './syncRepository'

export interface CloudContextValue {
  configured: boolean
  email: string | null
  status: SyncStatus
  /** Emails a one-time sign-in code. */
  signIn(email: string): Promise<void>
  /**
   * Signs in with the code from that email. A code, not a link, so sign-in happens in the app you
   * are using: on iPhone a Home Screen app and Safari keep separate storage, and a link opens Safari.
   */
  verifyCode(email: string, code: string): Promise<void>
  signOut(): Promise<void>
  sync(): Promise<void>
  /** After sign-out: deletes this device's saved progress and its link to the last account. */
  forgetDevice(): Promise<void>
}
const unavailable = async () => {}
export const CloudContext = createContext<CloudContextValue>({
  configured: false, email: null, status: { state: 'signed-out', pending: 0 },
  signIn: unavailable, verifyCode: unavailable, signOut: unavailable, sync: unavailable, forgetDevice: unavailable,
})
export const useCloud = () => useContext(CloudContext)
