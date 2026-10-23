/** Formats an ISO time as a short day and time in the event's own timezone, for example "Sat, 3:30 PM". */
export function formatSlot(iso: string, timeZone: string, hour12 = true, locale = 'en-US'): string {
  return new Date(iso).toLocaleString(locale, { timeZone, weekday: 'short', hour: 'numeric', minute: '2-digit', hour12 })
}
