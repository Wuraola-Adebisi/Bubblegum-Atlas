import type { EventConfig, Route } from '../../data/events/types.ts'
import LabelTag from '../../components/LabelTag.tsx'
import { dayKey, formatMinutes, minutesOfDay } from '../../lib/time.ts'

const modeLabel: Record<Route['mode'], string> = { walk: 'Walk', ferry: 'Ferry', shuttle: 'Shuttle', bike: 'Bike', courier: 'Courier' }

const linkBtn =
  'inline-flex min-h-11 items-center rounded-pill border-hair border-accent bg-paper px-6 py-2 font-medium text-accent shadow-press transition duration-micro ease-standard hover:bg-accent hover:text-paper active:translate-y-0.5 active:shadow-press-down'

/** Ferry times first, then the ways to get around once you land. */
export default function HereSection({ event }: { event: EventConfig }) {
  const time = (iso: string) => formatMinutes(minutesOfDay(iso, event.timezone), event.locale.hour12)
  const sat = event.mainDay ?? ''
  const out = event.schedule.filter((s) => s.pinId === 'quay-jetty' && dayKey(s.start, event.timezone) === sat)
  const back = event.schedule.filter((s) => s.pinId === 'larkmere-jetty' && s.title.toLowerCase().includes('return'))
  const hotel = event.pins.find((p) => p.id === 'quay-hotel')
  const title = (id: string) => event.pins.find((p) => p.id === id)?.title ?? id
  return (
    <section id="getting-here" aria-labelledby="here-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24 lg:py-32">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <h2 id="here-heading" className="font-display text-h1 font-extrabold">
            {event.copy.hereTitle}
          </h2>
          <p className="mt-4 max-w-measure text-body">{event.copy.hereIntro}</p>

          <h3 className="mt-8 font-medium">Saturday ferries from Harbor Quay</h3>
          <ul className="mt-3 flex flex-wrap gap-3">
            {out.map((s) => (
              <li key={s.id}>
                <LabelTag variant="flag">{time(s.start)}</LabelTag>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-medium">Return ferries from Larkmere</h3>
          <ul className="mt-3 flex flex-wrap gap-3">
            {back.map((s) => (
              <li key={s.id}>
                <LabelTag>{time(s.start)}</LabelTag>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-measure text-small">Please arrive 15 minutes before departure. Sunday&apos;s last ferry is at 12:30 pm.</p>
          {hotel && (
            <p className="mt-6 max-w-measure">
              <span className="font-medium">{hotel.title}.</span> {hotel.details}
            </p>
          )}
          <p className="mt-8">
            <a href="#/map" className={linkBtn}>
              {event.copy.ctaMap}
            </a>
          </p>
        </div>

        <div className="rounded-panel border-hair border-dashed border-water-deep bg-paper p-5 sm:p-8">
          <h3 className="font-display text-h3 font-extrabold">Once you land</h3>
          <ul className="mt-4 space-y-6">
            {event.routes
              .filter((r) => r.mode !== 'ferry')
              .map((r) => (
                <li key={r.id}>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-small">
                    {modeLabel[r.mode]}, about {r.durationMin} minutes, {r.accessible ? 'step-free' : 'has steps'}
                  </p>
                  <p className="mt-1 text-small">{r.stops.map(title).join(', then ')}.</p>
                  {r.note && <p className="mt-1 text-small">{r.note}</p>}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
