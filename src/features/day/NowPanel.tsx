import type { EventConfig } from '../../data/events/types.ts'
import { formatMinutes } from '../../lib/time.ts'
import { illustrations } from '../map/illustrations.ts'
import type { TimedItem } from './dayData.ts'

interface NowPanelProps {
  event: EventConfig
  clock: string
  moment: string
  active: TimedItem[]
  next: TimedItem | null
  onShow: (pinId: string) => void
  /** Moves the scrubber to the start of the next event. */
  onJumpNext: (item: TimedItem) => void
  /** Where the guest is, in words: "At Kestrel Cafe" or "On the way to Willowmere House". */
  guestLine: string
  /** The place whose picture sits in the corner of the panel. */
  artPinId: string | null
}

const btn =
  'min-h-11 cursor-pointer rounded-pill border-hair border-accent bg-paper px-4 py-1.5 text-small font-medium text-accent transition duration-micro ease-standard hover:bg-accent hover:text-paper'

/**
 * What is happening at the chosen time. The live region holds only the text that changes when an event starts
 * or ends, so a screen reader is not interrupted on every step of the scrubber.
 */
export default function NowPanel({ event, clock, moment, active, next, onShow, onJumpNext, guestLine, artPinId }: NowPanelProps) {
  const place = (id: string) => event.pins.find((p) => p.id === id)?.title ?? ''
  const artId = event.map.placements.find((p) => p.pinId === artPinId)?.illustrationId
  const art = artId ? illustrations[artId] : undefined
  return (
    <section aria-label="What is happening now" className="rounded-panel bg-paper p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-h2 font-extrabold tabular-nums">{clock}</p>
          <p className="font-hand text-label">{moment}</p>
        </div>
        {art && (
          <div aria-hidden="true" className="grid h-24 w-28 shrink-0 place-items-end justify-items-center rounded-panel bg-land-wash px-2 pb-2">
            <div key={artId} className="illo pin-pop w-full max-w-24" dangerouslySetInnerHTML={{ __html: art.svg }} />
          </div>
        )}
      </div>
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
          <p>Nothing is planned at {clock}.</p>
        )}
        {next && (
          <div>
            <p className="text-small">
              Next: {next.title} at {formatMinutes(next.startMin, event.locale.hour12)}, {place(next.pinId)}.
            </p>
            {active.length === 0 && (
              <button type="button" className={`${btn} mt-2`} onClick={() => onJumpNext(next)}>
                Jump to {formatMinutes(next.startMin, event.locale.hour12)}
              </button>
            )}
          </div>
        )}
        {!next && active.length === 0 && <p className="text-small">That is the end of the day. The last ferry home is in the list below.</p>}
        <p className="border-t-2 border-dashed border-water-deep pt-3 text-small">{guestLine}</p>
      </div>
    </section>
  )
}
