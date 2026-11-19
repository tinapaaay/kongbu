import { STORAGE_KEY } from '../data/localStorageRepository'
import { MemoryStorage } from '../data/storage'
import { emptyLearnerData, type LearnerData } from '../domain/learnerData'

/** In-memory storage that already holds the given progress, like a returning learner's browser. */
export function storageWith(overrides: Partial<LearnerData>): MemoryStorage {
  const storage = new MemoryStorage()
  storage.setItem(STORAGE_KEY, JSON.stringify({ ...emptyLearnerData(), ...overrides }))
  return storage
}

export function readSaved(storage: MemoryStorage): LearnerData {
  return JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null')
}
