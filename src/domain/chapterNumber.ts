/** Chapter numbers across Book 1 (1–30) and Book 2 (31–60). */
export const FIRST_CHAPTER = 1
export const LAST_CHAPTER = 60

/**
 * Turns a URL segment like "11" into a chapter number.
 * Returns null for anything that isn't a whole number from 1 to 60.
 */
export function parseChapterNumber(value: string | undefined): number | null {
  if (!value || !/^\d+$/.test(value)) return null
  const number = Number(value)
  return number >= FIRST_CHAPTER && number <= LAST_CHAPTER ? number : null
}
