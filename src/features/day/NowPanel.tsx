import type { EventConfig } from '../../data/events/types.ts'
import { formatMinutes } from '../../lib/time.ts'
import type { TimedItem } from './dayData.ts'

interface NowPanelProps {
  event: EventConfig
  clock: string
  moment: string
  active: TimedItem[]
  next: TimedItem | null
  onShow: (pinId: string) => void
}

const btn =
  'min-h-11 cursor-pointer rounded-pill border-hair border-accent bg-paper px-4 py-1.5 text-small font-medium text-accent transition duration-micro ease-standard hover:bg-accent hover:text-paper'

/**
 * What is happening at the chosen time. The live region holds only the text that changes when an event starts
 * or ends, so a screen reader is not interrupted on every step of the scrubber.
 */
export default function NowPanel({ event, clock, moment, active, next, onShow }: NowPanelProps) {
  const place = (id: string) => event.pins.find((p) => p.id === id)?.title ?? ''
  return (
    <section aria-label="What is happening now" className="rounded-panel bg-paper p-5 sm:p-6">
      <p className="font-display text-h2 font-extrabold tabular-nums">{clock}</p>
      <p className="font-hand text-label font-semibold">{moment}</p>
      <div aria-live="polite" aria-atomic="true" className="mt-4 space-y-4">
        {active.length > 0 ? (
          <ul className="space-y-4">
            {active.map((i) => (
              <li key={i.id}>
                <p className="font-medium">
                  {i.title}, {place(i.pinId)}
                </p>
                <p className="text-small">{i.description}</p>
                <button type="button" className={`${btn} mt-2`} onClick={() => onShow(i.pinId)}>
                  Show {place(i.pinId)} on the map
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nothing is scheduled right now.</p>
        )}
        {next && (
          <p className="text-small">
            Next: {next.title} at {formatMinutes(next.startMin, event.locale.hour12)}, {place(next.pinId)}.
          </p>
        )}
      </div>
    </section>
  )
}
