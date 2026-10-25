import type { EventConfig } from '../../data/events/types.ts'
import { formatMinutes } from '../../lib/time.ts'
import type { TimedItem } from './dayData.ts'

interface DayTimelineProps {
  event: EventConfig
  items: TimedItem[]
  activeIds: string[]
  onJump: (item: TimedItem) => void
}

/** The whole day as a list, and the text alternative to the map. Each row moves the scrubber to that event. */
export default function DayTimeline({ event, items, activeIds, onJump }: DayTimelineProps) {
  const place = (id: string) => event.pins.find((p) => p.id === id)?.title ?? ''
  return (
    <section aria-labelledby="timeline-heading" className="rounded-panel bg-paper p-5 sm:p-6">
      <h2 id="timeline-heading" className="font-display text-h3 font-extrabold">
        The day as a list
      </h2>
      <ul className="mt-3 space-y-1">
        {items.map((i) => {
          const on = activeIds.includes(i.id)
          return (
            <li key={i.id}>
              <button
                type="button"
                aria-current={on ? 'time' : undefined}
                onClick={() => onJump(i)}
                className={`flex min-h-11 w-full cursor-pointer items-start gap-4 rounded-panel border-hair px-3 py-2 text-left transition duration-micro ease-standard ${
                  on ? 'border-accent bg-land-wash' : 'border-transparent hover:bg-land-wash'
                }`}
              >
                <span className="w-24 shrink-0 font-hand text-label font-semibold tabular-nums">{formatMinutes(i.startMin, event.locale.hour12)}</span>
                <span>
                  {i.title}
                  <span className="block text-small">{place(i.pinId)}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
