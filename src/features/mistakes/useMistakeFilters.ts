import { useSearchParams } from 'react-router'

export type DateRange = 'all' | '7' | '30'

export interface MistakeFilters {
  chapterId: string
  conceptId: string
  range: DateRange
}

const RANGES: DateRange[] = ['all', '7', '30']

/**
 * Filters live in the page address (?chapter=ch11&concept=...&range=7),
 * so a filtered view survives refresh, can be bookmarked, and can be linked to.
 * Empty values mean "all" and are left out of the address.
 */
export function useMistakeFilters() {
  const [params, setParams] = useSearchParams()

  const range = params.get('range') as DateRange | null
  const filters: MistakeFilters = {
    chapterId: params.get('chapter') ?? '',
    conceptId: params.get('concept') ?? '',
    range: range && RANGES.includes(range) ? range : 'all',
  }

  function update(changes: Partial<MistakeFilters>) {
    const next = { ...filters, ...changes }
    // Changing the chapter clears the concept, which may belong to another chapter.
    if (changes.chapterId !== undefined && changes.chapterId !== filters.chapterId) next.conceptId = ''
    const search = new URLSearchParams()
    if (next.chapterId) search.set('chapter', next.chapterId)
    if (next.conceptId) search.set('concept', next.conceptId)
    if (next.range !== 'all') search.set('range', next.range)
    setParams(search, { replace: true })
  }

  const isFiltered = Boolean(filters.chapterId || filters.conceptId || filters.range !== 'all')

  return { filters, update, clear: () => setParams(new URLSearchParams(), { replace: true }), isFiltered }
}

/** The earliest moment included by a date range, or undefined for all time. */
export function rangeStart(range: DateRange, now: Date): Date | undefined {
  if (range === 'all') return undefined
  return new Date(now.getTime() - Number(range) * 86_400_000)
}
