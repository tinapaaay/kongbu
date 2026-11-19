/**
 * Randomness and ids are passed in rather than called directly.
 * The app uses the real ones; tests pass predictable ones, so results can be checked exactly.
 * This pattern is called dependency injection.
 */

/** Returns a number from 0 (inclusive) to 1 (exclusive), like Math.random. */
export type Random = () => number

export type MakeId = () => string

export const defaultRandom: Random = Math.random
export const defaultMakeId: MakeId = () => crypto.randomUUID()

/** Returns a shuffled copy (Fisher–Yates). The original array is not changed. */
export function shuffle<T>(items: readonly T[], random: Random = defaultRandom): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** A repeatable random sequence for tests (mulberry32). Same seed, same numbers. */
export function seededRandom(seed: number): Random {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Ids like "test-1", "test-2" for tests. */
export function sequentialIds(prefix = 'id'): MakeId {
  let n = 0
  return () => `${prefix}-${++n}`
}
