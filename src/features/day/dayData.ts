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
