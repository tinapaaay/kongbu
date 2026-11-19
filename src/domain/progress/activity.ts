import type { Attempt } from '../learnerData'

export interface DayActivity {
  /** Local calendar date, YYYY-MM-DD. */
  date: string
  weekday: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
  questions: number
}

const WEEKDAYS: DayActivity['weekday'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/**
 * Questions answered on each day of the current week, Monday to Sunday,
 * using the learner's local time zone.
 */
export function weekActivity(attempts: Attempt[], now: Date): DayActivity[] {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  // getDay(): Sunday is 0. Shift so Monday is the first day of the week.
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))

  const counts = new Map<string, number>()
  for (const attempt of attempts) {
    const key = localDateKey(new Date(attempt.answeredAt))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return WEEKDAYS.map((weekday, i) => {
    const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)
    const date = localDateKey(day)
    return { date, weekday, questions: counts.get(date) ?? 0 }
  })
}

export function localDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
