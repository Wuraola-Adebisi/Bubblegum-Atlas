import type { EventConfig, ScheduleItem } from '../../data/events/types.ts'
import { dayKey, minutesOfDay } from '../../lib/time.ts'

export interface TimedItem extends ScheduleItem {
  startMin: number
  endMin: number
}

/** The schedule for the event's main day, with start and end as minutes after midnight, in order. */
export function itemsForMainDay(event: EventConfig): TimedItem[] {
  const day = event.mainDay ?? dayKey(event.dates.start, event.timezone)
  return event.schedule
    .filter((s) => dayKey(s.start, event.timezone) === day)
    .map((s) => {
      const startMin = minutesOfDay(s.start, event.timezone)
      let endMin = minutesOfDay(s.end, event.timezone)
      if (endMin <= startMin) endMin += 24 * 60
      return { ...s, startMin, endMin }
    })
    .sort((a, b) => a.startMin - b.startMin)
}

export function happeningAt(items: TimedItem[], minute: number) {
  return {
    active: items.filter((i) => i.startMin <= minute && minute < i.endMin),
    next: items.find((i) => i.startMin > minute) ?? null,
  }
}

/** Events in the small hours after the main day, such as the last ferry home. Minutes run on past midnight of the main day, so 12:15 am is 24 * 60 + 15. */
export function itemsAfterMidnight(event: EventConfig): TimedItem[] {
  const day = event.mainDay ?? dayKey(event.dates.start, event.timezone)
  const next = new Date(`${day}T12:00:00Z`)
  next.setUTCDate(next.getUTCDate() + 1)
  const nextKey = next.toISOString().slice(0, 10)
  return event.schedule
    .filter((s) => dayKey(s.start, event.timezone) === nextKey && minutesOfDay(s.start, event.timezone) < 6 * 60)
    .map((s) => ({ ...s, startMin: 24 * 60 + minutesOfDay(s.start, event.timezone), endMin: 24 * 60 + minutesOfDay(s.end, event.timezone) }))
    .sort((a, b) => a.startMin - b.startMin)
}
