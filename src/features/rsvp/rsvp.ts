import type { EventConfig } from '../../data/events/types.ts'
import { formatDay, formatMinutes, minutesOfDay } from '../../lib/time.ts'

export type RsvpStatus = 'confirmed' | 'waitlist' | 'declined'

export interface RsvpReply {
  attending: boolean
  values: Record<string, string>
  status: RsvpStatus
  code: string
  savedAt: string
}

export const storageKey = (event: EventConfig) => `ba:rsvp:${event.id}`

/** A short reference code made from the name, so the same reply always gets the same code. */
export function passCode(name: string, party: string): string {
  let h = 7
  for (const ch of `${name.trim().toLowerCase()}|${party}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return `LRK-${h.toString(36).toUpperCase().padStart(4, '0').slice(0, 4)}`
}

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

/** Returns an error message per field id. An empty object means the reply is valid. */
export function validate(event: EventConfig, attending: boolean, values: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {}
  const max = event.pass.maxPartySize ?? 8
  for (const f of event.pass.fields) {
    const v = (values[f.id] ?? '').trim()
    const needed = f.required && (attending || f.id === 'name')
    if (needed && !v) {
      errors[f.id] =
        f.id === 'name'
          ? 'Enter your full name.'
          : f.type === 'email'
            ? 'Enter an email address, like name@example.com.'
            : f.id === 'party'
              ? 'Enter how many guests are in your party, including you.'
              : f.type === 'select'
                ? 'Choose one of the options.'
                : 'Fill in this field.'
      continue
    }
    if (f.type === 'email' && v && !emailOk(v)) errors[f.id] = 'That email address is missing an @ or a domain. Use the form name@example.com.'
    if (f.id === 'party' && attending && v) {
      const n = Number(v)
      if (!Number.isInteger(n) || n < 1 || n > max) errors[f.id] = `Enter a whole number from 1 to ${max}. For a larger group, please ask us first.`
    }
  }
  return errors
}

export function statusFor(event: EventConfig, attending: boolean, values: Record<string, string>): RsvpStatus {
  if (!attending) return 'declined'
  const cap = event.pass.capacity
  if (!cap) return 'confirmed'
  return Number(values.party) <= cap.guests - cap.taken ? 'confirmed' : 'waitlist'
}

/** The chosen ferry as a schedule item, so the pass can show the real day and an arrive-by time. */
export function ferryDetails(event: EventConfig, option: string | undefined) {
  if (!option) return null
  const item = event.schedule.find((s) => s.pinId === 'calloway-jetty' && formatMinutes(minutesOfDay(s.start, event.timezone), event.locale.hour12) === option)
  if (!item) return null
  const start = minutesOfDay(item.start, event.timezone)
  return {
    day: formatDay(item.start, event.timezone, event.locale.language),
    time: option,
    arriveBy: formatMinutes(start - 15, event.locale.hour12),
  }
}
