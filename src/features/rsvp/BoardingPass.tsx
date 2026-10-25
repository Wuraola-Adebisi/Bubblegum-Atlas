import type { EventConfig } from '../../data/events/types.ts'
import LabelTag from '../../components/LabelTag.tsx'
import { illustrations } from '../map/illustrations.ts'
import { ferryDetails } from './rsvp.ts'

export type PassState = 'draft' | 'confirmed' | 'waitlist'

interface BoardingPassProps {
  event: EventConfig
  values: Record<string, string>
  state: PassState
  code?: string
}

const stateText: Record<PassState, string> = { draft: 'Draft', confirmed: 'Confirmed', waitlist: 'Waitlist' }

function Row({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div>
      <dt className="font-hand text-label">{label}</dt>
      <dd className={`font-medium ${muted ? 'opacity-55' : ''}`}>{value}</dd>
    </div>
  )
}

/**
 * A boarding pass for the ferry to Larkmere. As a draft it fills in while the form is typed into.
 * Confirmed and waitlist replace the draft stamp. The pass prints on its own.
 */
export default function BoardingPass({ event, values, state, code }: BoardingPassProps) {
  const ferry = ferryDetails(event, values.ferry)
  const boat = illustrations['landmark-ferry']
  const name = values.name?.trim()
  const party = values.party?.trim()
  return (
    <article id="boarding-pass" aria-label={`Boarding pass, ${stateText[state].toLowerCase()}`} className="@container relative overflow-hidden rounded-panel bg-paper">
      <div className="grid @2xl:grid-cols-[1fr_14rem]">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <LabelTag>Boarding pass</LabelTag>
            <span
              key={state}
              className={`inline-block rounded-pill border-hair px-4 py-1 text-small font-medium ${
                state === 'confirmed' ? 'pin-pop border-accent bg-accent text-paper' : state === 'waitlist' ? 'pin-pop border-ink bg-glow text-ink' : 'border-dashed border-accent text-accent'
              }`}
            >
              {stateText[state]}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <p className="font-display text-h3 font-extrabold">Harbor Quay</p>
            {boat && (
              <div className="illo w-24 shrink-0 sm:w-28" aria-hidden="true" dangerouslySetInnerHTML={{ __html: boat.svg }} />
            )}
            <p className="font-display text-h3 font-extrabold">Larkmere</p>
          </div>

          <p className="mt-6 font-hand text-label">Passenger</p>
          <p className={`font-display text-h2 font-extrabold ${name ? '' : 'opacity-40'}`}>{name || 'Your name'}</p>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            <Row label="Ferry" value={ferry ? `${ferry.time}, ${ferry.day}` : 'Not chosen yet'} muted={!ferry} />
            <Row label="Party" value={party ? `${party} ${party === '1' ? 'guest' : 'guests'}` : 'Not entered yet'} muted={!party} />
            <Row label="Dinner" value={values.meal || 'Not chosen yet'} muted={!values.meal} />
            {values.dietary?.trim() && <Row label="Dietary" value={values.dietary.trim()} />}
            {values.song?.trim() && <Row label="Song request" value={values.song.trim()} />}
          </dl>

          {ferry && <p className="mt-5 text-small">Please arrive at Harbor Quay jetty by {ferry.arriveBy}.</p>}
          {state === 'waitlist' && (
            <p className="mt-3 text-small font-medium">Your party is on the waitlist. We will write to {values.email || 'you'} if places open up.</p>
          )}
        </div>

        <div className="relative flex flex-col justify-between gap-4 border-t-2 border-dashed border-water-deep p-6 sm:p-8 @2xl:border-t-0 @2xl:border-l-2">
          <div>
            <p className="font-hand text-label">Reference</p>
            <p className="font-display text-h3 font-extrabold tabular-nums">{code ?? 'LRK-····'}</p>
          </div>
          <div
            aria-hidden="true"
            className="h-14 w-full"
            style={{ background: 'repeating-linear-gradient(90deg, var(--color-ink) 0 3px, transparent 3px 6px, var(--color-ink) 6px 8px, transparent 8px 14px)' }}
          />
          <p className="text-small break-words">{event.title}, {event.tagline.replace(/^Three days on the lake, /, '')}</p>
          <span aria-hidden="true" className="absolute -top-3 -left-3 size-6 rounded-pill bg-ground" />
          <span aria-hidden="true" className="absolute -top-3 -right-3 size-6 rounded-pill bg-ground @2xl:top-auto @2xl:right-auto @2xl:-bottom-3 @2xl:-left-3" />
        </div>
      </div>
    </article>
  )
}
