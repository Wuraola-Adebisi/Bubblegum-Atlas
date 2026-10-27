import type { EventConfig, ScheduleItem, WalkStation } from '../../data/events/types.ts'
import Accordion from '../../components/Accordion.tsx'
import LabelTag from '../../components/LabelTag.tsx'
import { dayKey, formatDay, formatMinutes, minutesOfDay } from '../../lib/time.ts'

const linkBtn =
  'inline-flex min-h-11 items-center rounded-pill border-hair border-accent bg-paper px-6 py-2 font-medium text-accent shadow-press transition duration-micro ease-standard hover:bg-accent hover:text-paper active:translate-y-0.5 active:shadow-press-down'

const primaryBtn =
  'inline-flex min-h-11 items-center rounded-pill border-hair border-accent bg-accent px-6 py-2 font-medium text-paper shadow-press transition duration-micro ease-standard hover:bg-ink active:translate-y-0.5 active:shadow-press-down'

const modeLabel = { walk: 'Walk', ferry: 'Ferry', shuttle: 'Shuttle', bike: 'Bike', courier: 'Courier' } as const

function Schedule({ event, items }: { event: EventConfig; items: ScheduleItem[] }) {
  const place = (id: string) => event.pins.find((p) => p.id === id)?.title ?? ''
  const sorted = [...items].sort((a, b) => +new Date(a.start) - +new Date(b.start))
  const days: { key: string; label: string; rows: ScheduleItem[] }[] = []
  for (const s of sorted) {
    const key = dayKey(s.start, event.timezone)
    let d = days.find((x) => x.key === key)
    if (!d) days.push((d = { key, label: formatDay(s.start, event.timezone, event.locale.language), rows: [] }))
    d.rows.push(s)
  }
  return (
    <div className="mt-5 space-y-4">
      {days.map((d) => (
        <div key={d.key}>
          <h3 className="font-medium">{d.label}</h3>
          <ul className="mt-2 space-y-2">
            {d.rows.map((s) => (
              <li key={s.id} className="flex gap-4">
                <span className="w-24 shrink-0 font-hand text-label tabular-nums">
                  {formatMinutes(minutesOfDay(s.start, event.timezone), event.locale.hour12)}
                </span>
                <span>
                  {s.title}
                  <span className="block text-small">{place(s.pinId)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/** The text for one station. Everything comes from the event config, so a new event fills the same stations. */
export default function StationContent({ event, station }: { event: EventConfig; station: WalkStation }) {
  const pin = (id: string) => event.pins.find((p) => p.id === id)
  const main = pin(station.pinIds[station.kind === 'wren-shore' ? 1 : 0])
  const itemsAt = (ids: string[]) => event.schedule.filter((s) => ids.includes(s.pinId))
  const time = (iso: string) => formatMinutes(minutesOfDay(iso, event.timezone), event.locale.hour12)

  const head = (
    <>
      <h2 id={`station-${station.id}`} className="font-display text-h2 font-extrabold">{station.title}</h2>
      {main && station.kind !== 'questions' && station.kind !== 'here' && <p className="mt-3 max-w-measure text-body">{main.summary}</p>}
      {main?.details && station.kind !== 'here' && station.kind !== 'questions' && <p className="mt-2 max-w-measure">{main.details}</p>}
    </>
  )

  if (station.kind === 'here') {
    const sat = event.mainDay ?? ''
    const out = event.schedule.filter((s) => s.pinId === 'calloway-jetty' && dayKey(s.start, event.timezone) === sat)
    const back = event.schedule.filter((s) => s.pinId === 'heron-jetty' && s.title.toLowerCase().includes('return'))
    const hotel = pin('alder-inn')
    return (
      <>
        <h2 id={`station-${station.id}`} className="font-display text-h2 font-extrabold">{station.title}</h2>
        <p className="mt-3 max-w-measure text-body">{event.copy.hereIntro}</p>
        <h3 className="mt-6 font-medium">Saturday ferries from Port Calloway</h3>
        <ul className="mt-3 flex flex-wrap gap-3">
          {out.map((s) => (
            <li key={s.id}>
              <LabelTag variant="flag">{time(s.start)}</LabelTag>
            </li>
          ))}
        </ul>
        <h3 className="mt-5 font-medium">Return ferries from Willowmere</h3>
        <ul className="mt-3 flex flex-wrap gap-3">
          {back.map((s) => (
            <li key={s.id}>
              <LabelTag>{time(s.start)}</LabelTag>
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-measure text-small">Please arrive 15 minutes before departure. Sunday&apos;s last ferry is at 12:30 pm.</p>
        {hotel && (
          <p className="mt-5 max-w-measure">
            <span className="font-medium">{hotel.title}.</span> {hotel.details}
          </p>
        )}
        <p className="mt-6">
          <a href="#/map" className={linkBtn}>
            {event.copy.ctaMap}
          </a>
        </p>
      </>
    )
  }

  if (station.kind === 'questions') {
    const shuttle = pin('shuttle')
    return (
      <>
        <h2 id={`station-${station.id}`} className="font-display text-h2 font-extrabold">{station.title}</h2>
        {shuttle && <p className="mt-3 max-w-measure text-body">{shuttle.summary}</p>}
        <ul className="mt-4 space-y-3">
          {event.routes
            .filter((r) => r.mode !== 'ferry')
            .map((r) => (
              <li key={r.id} className="max-w-measure text-small">
                <span className="font-medium">{r.name}.</span> {modeLabel[r.mode]}, about {r.durationMin} minutes, {r.accessible ? 'step-free' : 'has steps'}. {r.note}
              </li>
            ))}
        </ul>
        <div className="mt-6">
          <Accordion items={event.faq} />
        </div>
      </>
    )
  }

  const ids = station.kind === 'wren-shore' ? ['boathouse'] : station.pinIds
  return (
    <>
      {head}
      <Schedule event={event} items={itemsAt(ids)} />
      {station.kind === 'ceremony' && <p className="mt-5 max-w-measure text-small">If it rains, the ceremony moves into the Lantern Marquee.</p>}
      {station.kind === 'party' && (
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
