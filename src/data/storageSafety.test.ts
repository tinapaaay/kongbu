import { describe, expect, it, vi } from 'vitest'
import { isAppleMobileBrowserTab, isStoragePersisted, requestPersistentStorage } from './storageSafety'

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15'
const ANDROID = 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/131.0 Mobile Safari/537.36'

describe('requestPersistentStorage', () => {
  it('asks the browser to keep the data', async () => {
    const persist = vi.fn().mockResolvedValue(true)
    expect(await requestPersistentStorage({ userAgent: ANDROID, storage: { persist, persisted: async () => false } })).toBe(true)
    expect(persist).toHaveBeenCalledOnce()
  })

  it('does not ask again once the data is kept', async () => {
    const persist = vi.fn()
    expect(await requestPersistentStorage({ userAgent: ANDROID, storage: { persist, persisted: async () => true } })).toBe(true)
    expect(persist).not.toHaveBeenCalled()
  })

  it('reports false, without throwing, when the browser refuses or has no such feature', async () => {
    expect(await requestPersistentStorage({ userAgent: ANDROID, storage: { persist: async () => false } })).toBe(false)
    expect(await requestPersistentStorage({ userAgent: ANDROID })).toBe(false)
    expect(await requestPersistentStorage({ userAgent: ANDROID, storage: { persist: () => Promise.reject(new Error('blocked')) } })).toBe(false)
  })
})

describe('isStoragePersisted', () => {
  it('reads the browser’s answer, and says false when it can’t tell', async () => {
    expect(await isStoragePersisted({ userAgent: ANDROID, storage: { persisted: async () => true } })).toBe(true)
    expect(await isStoragePersisted({ userAgent: ANDROID })).toBe(false)
  })
})

describe('isAppleMobileBrowserTab', () => {
  it('spots an iPhone, and an iPad that reports a Mac user agent', () => {
    expect(isAppleMobileBrowserTab({ userAgent: IPHONE }, false)).toBe(true)
    expect(isAppleMobileBrowserTab({ userAgent: MAC, maxTouchPoints: 5 }, false)).toBe(true)
  })

  it('ignores Home Screen apps, Macs, and Android', () => {
    expect(isAppleMobileBrowserTab({ userAgent: IPHONE }, true)).toBe(false)
    expect(isAppleMobileBrowserTab({ userAgent: IPHONE, standalone: true }, false)).toBe(false)
    expect(isAppleMobileBrowserTab({ userAgent: MAC, maxTouchPoints: 0 }, false)).toBe(false)
    expect(isAppleMobileBrowserTab({ userAgent: ANDROID }, false)).toBe(false)
  })
})
