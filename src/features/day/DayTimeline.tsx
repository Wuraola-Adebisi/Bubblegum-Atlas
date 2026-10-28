import type { EventConfig } from '../../data/events/types.ts'
import LabelTag from '../../components/LabelTag.tsx'
import { formatMinutes } from '../../lib/time.ts'
import { illustrations } from '../map/illustrations.ts'
import { hairFor } from '../walk/useAvatar.ts'
import type { AvatarChoice } from '../walk/useAvatar.ts'
import type { TimedItem } from './dayData.ts'

interface DayTimelineProps {
  event: EventConfig
  items: TimedItem[]
  /** Events in the small hours after the day, such as the last ferry home. */
  afterMidnight: TimedItem[]
  activeIds: string[]
  /** The ferry the guest chose. */
  ferryId: string | null
  /** The event row where the guest stands right now, if any. */
  guestItemId: string | null
  avatar: AvatarChoice
  onJump: (item: TimedItem) => void
}

/** The whole day as a list along a dotted line, and the text alternative to the map. Each row moves the scrubber to that event. */
export default function DayTimeline({ event, items, afterMidnight, activeIds, ferryId, guestItemId, avatar, onJump }: DayTimelineProps) {
  const place = (id: string) => event.pins.find((p) => p.id === id)?.title ?? ''
  const art = illustrations[avatar.style === 'suit' ? 'avatar-suit' : 'avatar-dress']
  const row = (i: TimedItem, late: boolean) => {
    const on = activeIds.includes(i.id)
    const here = guestItemId === i.id
    return (
      <li key={i.id} className="relative pl-10">
        <span
          aria-hidden="true"
          className={`absolute top-4 left-3 size-3 -translate-x-1/2 rounded-pill border-hair border-accent ${on ? 'bg-accent' : 'bg-paper'}`}
        />
        {here && art && (
          <span
            aria-hidden="true"
            className="illo pin-pop absolute top-1 -left-2 w-5"
            style={{ ['--skin' as string]: avatar.skin, ['--hair' as string]: hairFor[avatar.style] }}
            dangerouslySetInnerHTML={{ __html: art.svg }}
          />
        )}
        <button
          type="button"
          aria-current={on ? 'time' : undefined}
          onClick={() => onJump(i)}
          className={`flex min-h-11 w-full cursor-pointer items-start gap-4 rounded-panel border-hair px-3 py-2 text-left transition duration-micro ease-standard ${
            on ? 'border-accent bg-land-wash' : 'border-transparent hover:bg-land-wash'
          }`}
        >
          <span className="w-24 shrink-0 font-hand text-label tabular-nums">{formatMinutes(i.startMin, event.locale.hour12)}</span>
          <span>
            {i.title}
            {i.id === ferryId && (
              <span className="ml-2 align-middle">
                <LabelTag variant="flag">Your ferry</LabelTag>
              </span>
            )}
            <span className="block text-small">
              {place(i.pinId)}
              {late && ', after midnight'}
            </span>
          </span>
        </button>
      </li>
    )
  }
  return (
    <section aria-labelledby="timeline-heading" className="rounded-panel bg-paper p-5 sm:p-6">
      <h2 id="timeline-heading" className="font-display text-h3 font-extrabold">
        The day as a list
      </h2>
      <p className="mt-1 max-w-measure text-small">Pick a row to move the map to that time.</p>
      <div className="relative mt-4">
        <span aria-hidden="true" className="absolute top-4 bottom-4 left-3 -translate-x-1/2 border-l-2 border-dashed border-water-deep" />
        <ul className="relative space-y-1">
          {items.map((i) => row(i, false))}
          {afterMidnight.map((i) => row(i, true))}
        </ul>
      </div>
    </section>
  )
}
