import type { EventConfig, ScheduleItem, WalkStation } from '../../data/events/types.ts'
import LabelTag from '../../components/LabelTag.tsx'
import { dayKey, formatMinutes, minutesOfDay } from '../../lib/time.ts'

const primaryBtn =
  'inline-flex min-h-11 items-center rounded-pill border-hair border-accent bg-accent px-6 py-2 font-medium text-paper shadow-press transition duration-micro ease-standard hover:bg-ink active:translate-y-0.5 active:shadow-press-down'
const btn =
  'inline-flex min-h-11 items-center rounded-pill border-hair border-accent bg-paper px-6 py-2 font-medium text-accent shadow-press transition duration-micro ease-standard hover:bg-accent hover:text-paper active:translate-y-0.5 active:shadow-press-down'

/** Chapters of the couple's story set at this place. */
function Story({ station }: { station: WalkStation }) {
  if (!station.story?.length) return null
  return (
    <div className="mt-6 space-y-3">
      {station.story.map((c) => (
        <aside key={c.label} className="rounded-panel bg-land-wash p-4 sm:p-5">
          <p className="font-hand text-label">{c.label}</p>
          <p className="mt-1 max-w-measure text-body">{c.text}</p>
        </aside>
      ))}
    </div>
  )
}

/** The few times that belong to this place. The whole weekend is on the program page. */
function Times({ event, items }: { event: EventConfig; items: ScheduleItem[] }) {
  const lang = event.locale.language
  const rows = [...items].sort((a, b) => +new Date(a.start) - +new Date(b.start)).slice(0, 3)
  if (!rows.length) return null
  return (
    <ul className="mt-4 space-y-1.5">
      {rows.map((s) => (
        <li key={s.id} className="flex flex-wrap items-baseline gap-x-3">
          <span className="font-hand text-label tabular-nums">
            {new Date(s.start).toLocaleDateString(lang, { weekday: 'short', timeZone: event.timezone })}{' '}
            {formatMinutes(minutesOfDay(s.start, event.timezone), event.locale.hour12)}
          </span>
          <span>{s.title}</span>
        </li>
      ))}
    </ul>
  )
}

/** The text for one station, kept short. Everything comes from the event config, so a new event fills the same stations. */
export default function StationContent({ event, station }: { event: EventConfig; station: WalkStation }) {
  const pin = (id: string) => event.pins.find((p) => p.id === id)
  const main = pin(station.pinIds[station.kind === 'wren-shore' ? 1 : 0])
  const itemsAt = (ids: string[]) => event.schedule.filter((s) => ids.includes(s.pinId))
  const time = (iso: string) => formatMinutes(minutesOfDay(iso, event.timezone), event.locale.hour12)
  const heading = (
    <h2 id={`station-${station.id}`} className="font-display text-h2 font-extrabold">
      {station.title}
    </h2>
  )

  if (station.kind === 'here') {
    const sat = event.mainDay ?? ''
    const out = event.schedule.filter((s) => s.pinId === 'calloway-jetty' && dayKey(s.start, event.timezone) === sat)
    return (
      <>
        {heading}
        <p className="mt-3 max-w-measure text-body">{event.copy.hereIntro}</p>
        <h3 className="mt-5 font-medium">Saturday ferries from Port Calloway</h3>
        <ul className="mt-3 flex flex-wrap gap-3">
          {out.map((s) => (
            <li key={s.id}>
              <LabelTag variant="flag">{time(s.start)}</LabelTag>
            </li>
          ))}
        </ul>
        <Story station={station} />
      </>
    )
  }

  if (station.kind === 'questions') {
    const shuttle = pin('shuttle')
    return (
      <>
        {heading}
        {shuttle && <p className="mt-3 max-w-measure text-body">{shuttle.summary}</p>}
        <p className="mt-3 max-w-measure text-body">Dress code, where to stay, what happens if it rains and the rest of your questions are on the program page.</p>
        <p className="mt-5">
          <a href="#/program" className={btn}>
            See the program
          </a>
        </p>
      </>
    )
  }

  const ids = station.kind === 'wren-shore' ? ['boathouse'] : station.pinIds
  return (
    <>
      {heading}
      {main && <p className="mt-3 max-w-measure text-body">{main.summary}</p>}
      <Times event={event} items={itemsAt(ids)} />
      {station.kind === 'ceremony' && <p className="mt-4 max-w-measure text-small">If it rains, the ceremony moves into the Lantern Marquee.</p>}
      <Story station={station} />
      {station.kind === 'ceremony' && (
        <div className="mt-6 space-y-3 border-t-2 border-dashed border-water-deep pt-5">
          <p className="max-w-measure font-medium">{event.copy.rsvpTitle}</p>
          <p className="max-w-measure text-small">{event.copy.rsvpIntro}</p>
          <p>
            <a href="#/rsvp" className={primaryBtn}>
              {event.copy.ctaRsvp}
            </a>
          </p>
        </div>
      )}
    </>
  )
}
