import { createContext, useContext } from 'react'
import type { SyncStatus } from './syncRepository'

export interface CloudContextValue {
  configured: boolean
  email: string | null
  status: SyncStatus
  signIn(email: string): Promise<void>
  signOut(): Promise<void>
  sync(): Promise<void>
  /** After sign-out: deletes this device's saved progress and its link to the last account. */
  forgetDevice(): Promise<void>
}
const unavailable = async () => {}
export const CloudContext = createContext<CloudContextValue>({
  configured: false, email: null, status: { state: 'signed-out', pending: 0 },
  signIn: unavailable, signOut: unavailable, sync: unavailable, forgetDevice: unavailable,
})
export const useCloud = () => useContext(CloudContext)
