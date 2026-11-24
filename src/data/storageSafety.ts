/**
 * How safe saved progress is from the browser clearing it.
 *
 * Browsers may delete a site's saved data to free space, and Safari deletes it after about
 * 7 days without a visit. Two things protect it:
 * - "Persistent storage": the site asks, and the browser agrees not to clear its data on its own.
 * - On iPhone and iPad, a Home Screen app is exempt from Safari's 7-day rule, but a Safari tab is not.
 */

/** The parts of `navigator` this module reads. Tests pass their own. */
export interface NavigatorLike {
  userAgent: string
  maxTouchPoints?: number
  standalone?: boolean
  storage?: { persist?: () => Promise<boolean>; persisted?: () => Promise<boolean> }
}

function browserNavigator(): NavigatorLike | undefined {
  return typeof navigator === 'undefined' ? undefined : (navigator as NavigatorLike)
}

/**
 * Asks the browser to keep this site's data. Called after a quiz is saved, not on first load:
 * some browsers (Firefox) show a question, which only makes sense once there is progress to keep.
 * Returns true if the data is now protected. Never throws.
 */
export async function requestPersistentStorage(nav = browserNavigator()): Promise<boolean> {
  try {
    const storage = nav?.storage
    if (!storage?.persist) return false
    if (storage.persisted && (await storage.persisted())) return true
    return await storage.persist()
  } catch {
    return false
  }
}

/** Whether the browser has already agreed to keep this site's data. False when it can't tell. */
export async function isStoragePersisted(nav = browserNavigator()): Promise<boolean> {
  try {
    return (await nav?.storage?.persisted?.()) ?? false
  } catch {
    return false
  }
}

/**
 * True in Safari (or any browser) on iPhone or iPad when Kongbu is open in a tab rather than
 * as a Home Screen app. iPads report a Mac user agent, so touch support tells them apart.
 */
export function isAppleMobileBrowserTab(nav = browserNavigator(), standalone = isStandalone()): boolean {
  if (!nav || standalone || nav.standalone) return false
  const ua = nav.userAgent
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && (nav.maxTouchPoints ?? 0) > 1)
}

function isStandalone(): boolean {
  try {
    return typeof window !== 'undefined' && window.matchMedia?.('(display-mode: standalone)').matches === true
  } catch {
    return false
  }
}
