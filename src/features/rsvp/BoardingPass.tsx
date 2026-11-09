import type { EventConfig } from '../../data/events/types.ts'
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

function Field({ label, value, muted = false, wide = false }: { label: string; value: string; muted?: boolean; wide?: boolean }) {
  return (
    <div className={`border-t-2 border-dashed border-water-deep-wash pt-3 ${wide ? 'col-span-full' : ''}`}>
      <dt className="font-hand text-label">{label}</dt>
      <dd className={`font-display text-h3 font-extrabold ${muted ? 'italic text-accent' : ''}`}>{value}</dd>
    </div>
  )
}

function Art({ id, className }: { id: string; className: string }) {
  const art = illustrations[id]
  if (!art) return null
  return <div className={`illo ${className}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: art.svg }} />
}

/**
 * A ferry boarding pass for the crossing to Willowmere, laid out like a real ticket: a colored band, a route with codes and the ferry on it,
 * the details, and a stub with a reference and barcode. As a draft it fills in while the form is typed into. It prints on its own.
 */
export default function BoardingPass({ event, values, state, code }: BoardingPassProps) {
  const ferry = ferryDetails(event, values.ferry)
  const name = values.name?.trim()
  const party = values.party?.trim()
  const couple = event.title.replace(' at Willowmere', '')
  return (
    <article id="boarding-pass" aria-label={`Boarding pass, ${stateText[state].toLowerCase()}`} className="@container relative overflow-hidden rounded-panel border-hair border-accent bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-accent px-6 py-3 text-paper sm:px-8">
        <p className="font-display text-h3 font-extrabold">Ferry boarding pass</p>
        <span
          key={state}
          className={`inline-block rounded-pill border-hair px-4 py-1 text-small font-medium ${
            state === 'confirmed' ? 'pin-pop border-paper bg-paper text-accent' : state === 'waitlist' ? 'pin-pop border-ink bg-glow text-ink' : 'border-dashed border-paper text-paper'
          }`}
        >
          {stateText[state]}
        </span>
      </div>

      <div className="grid @2xl:grid-cols-[1fr_15rem]">
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-[auto_1fr_auto] items-end gap-3 sm:gap-5">
            <div>
              <p className="font-hand text-label">From</p>
              <p className="font-display text-h1 font-extrabold leading-none tracking-wide">CAL</p>
              <p className="mt-1 text-small">Port Calloway</p>
            </div>
            <div className="relative h-28 min-w-0" aria-hidden="true">
              <div className="absolute inset-x-0 bottom-5 border-t-[3px] border-dotted border-accent" />
              <Art id="landmark-ferry" className="absolute bottom-4 left-1/2 w-24 -translate-x-1/2 sm:w-32" />
              <Art id="landmark-jetty" className="absolute bottom-3 left-0 hidden w-16 sm:block" />
            </div>
            <div className="text-right">
              <p className="font-hand text-label">To</p>
              <p className="font-display text-h1 font-extrabold leading-none tracking-wide">WLM</p>
              <p className="mt-1 text-small">Willowmere</p>
            </div>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
            <Field wide label="Passenger" value={name || 'Your name'} muted={!name} />
            <Field label="Date" value={ferry ? ferry.day : 'Not chosen yet'} muted={!ferry} />
            <Field label="Ferry" value={ferry ? ferry.time : 'Not chosen yet'} muted={!ferry} />
            <Field label="Gate" value="Calloway Jetty" />
            <Field label="Party" value={party ? `${party} ${party === '1' ? 'guest' : 'guests'}` : 'Not entered yet'} muted={!party} />
            <Field label="Dinner" value={values.meal || 'Not chosen yet'} muted={!values.meal} />
            {values.dietary?.trim() && <Field label="Dietary" value={values.dietary.trim()} />}
            {values.song?.trim() && <Field label="Song request" value={values.song.trim()} />}
          </dl>

          {ferry && <p className="mt-6 text-small">Please be at Calloway Jetty by {ferry.arriveBy}. The crossing takes about 12 minutes.</p>}
          {state === 'waitlist' && <p className="mt-3 text-small font-medium">Your party is on the waitlist. We will write to {values.email || 'you'} if places open up.</p>}
        </div>

        <div className="relative flex flex-col gap-4 border-t-2 border-dashed border-water-deep p-6 sm:p-8 @2xl:border-t-0 @2xl:border-l-2">
          <Art id="landmark-arch" className="mx-auto w-24 @2xl:w-28" />
          <div>
            <p className="font-hand text-label">Reference</p>
            <p className="font-display text-h3 font-extrabold tabular-nums">{code ?? 'WLM-····'}</p>
          </div>
          <div
            aria-hidden="true"
            className="h-16 w-full"
            style={{ background: 'repeating-linear-gradient(90deg, var(--color-ink) 0 3px, transparent 3px 6px, var(--color-ink) 6px 8px, transparent 8px 14px)' }}
          />
          <p className="text-small break-words">
            {couple}, {event.tagline.replace(/^Three days on Lake Wren, /, '')}
          </p>
          <span aria-hidden="true" className="absolute -top-3 -left-3 size-6 rounded-pill bg-ground" />
          <span aria-hidden="true" className="absolute -top-3 -right-3 size-6 rounded-pill bg-ground @2xl:top-auto @2xl:right-auto @2xl:-bottom-3 @2xl:-left-3" />
        </div>
      </div>
    </article>
  )
}
