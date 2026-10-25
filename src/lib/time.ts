/** Formats an ISO time as a short day and time in the event's own timezone, for example "Sat, 3:30 PM". */
export function formatSlot(iso: string, timeZone: string, hour12 = true, locale = 'en-US'): string {
  return new Date(iso).toLocaleString(locale, { timeZone, weekday: 'short', hour: 'numeric', minute: '2-digit', hour12 })
}

/** Minutes after midnight in the given timezone. */
export function minutesOfDay(iso: string, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date(iso))
  const get = (t: string) => Number(parts.find((x) => x.type === t)?.value ?? 0)
  return get('hour') * 60 + get('minute')
}

/** The calendar date, as YYYY-MM-DD, in the given timezone. */
export function dayKey(iso: string, timeZone: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone })
}

/** For example "Saturday, September 11". */
export function formatDay(iso: string, timeZone: string, locale = 'en-US'): string {
  return new Date(iso).toLocaleDateString(locale, { timeZone, weekday: 'long', month: 'long', day: 'numeric' })
}

/** For example "3:30 pm". */
export function formatMinutes(total: number, hour12 = true): string {
  const h = Math.floor(total / 60) % 24
  const m = String(total % 60).padStart(2, '0')
  if (!hour12) return `${String(h).padStart(2, '0')}:${m}`
  return `${h % 12 === 0 ? 12 : h % 12}:${m} ${h < 12 ? 'am' : 'pm'}`
}
