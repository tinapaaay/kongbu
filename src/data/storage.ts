/**
 * The small part of the browser's Storage API we use.
 * Depending on this instead of `window.localStorage` lets tests use an in-memory copy,
 * and lets a broken or blocked storage be simulated.
 */
export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

/** Storage kept in memory only. Used in tests, and as a fallback when the browser blocks storage. */
export class MemoryStorage implements StorageLike {
  private values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }

  removeItem(key: string): void {
    this.values.delete(key)
  }

  keys(): string[] {
    return [...this.values.keys()]
  }
}

/**
 * Returns the browser's localStorage, or null if the browser blocks it
 * (for example, some private-browsing modes). Accessing it can throw, so it is wrapped.
 */
export function getBrowserStorage(): StorageLike | null {
  try {
    const storage = window.localStorage
    const probe = '__hangul_lab_probe__'
    storage.setItem(probe, '1')
    storage.removeItem(probe)
    return storage
  } catch {
    return null
  }
}
