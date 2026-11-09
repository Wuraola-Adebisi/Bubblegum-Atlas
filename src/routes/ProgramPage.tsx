import type { ReactNode } from 'react'
import type { EventConfig, ScheduleItem } from '../data/events/types.ts'
import Accordion from '../components/Accordion.tsx'
import LabelTag from '../components/LabelTag.tsx'
import PageBanner from '../components/PageBanner.tsx'
import { illustrations } from '../features/map/illustrations.ts'
import { couple } from '../features/walk/people.ts'
import { wedding } from '../data/events/wedding.ts'
import { dayKey, formatDay, formatMinutes, minutesOfDay } from '../lib/time.ts'

const primaryBtn =
  'inline-flex min-h-11 items-center rounded-pill border-hair border-accent bg-accent px-6 py-2 font-medium text-paper shadow-press transition duration-micro ease-standard hover:bg-ink active:translate-y-0.5 active:shadow-press-down'

type Tone = 'paper' | 'land' | 'water' | 'park' | 'deep'
const tones: Record<Tone, string> = { paper: 'bg-paper', land: 'bg-land-wash', water: 'bg-water-wash', park: 'bg-park-wash', deep: 'bg-water-deep-wash' }

function Art({ id, className }: { id: string; className: string }) {
  const art = illustrations[id]
  if (!art) return null
  return <div aria-hidden="true" className={`illo pointer-events-none absolute ${className}`} dangerouslySetInnerHTML={{ __html: art.svg }} />
}

/** A tinted panel with a heading and one illustration in the corner. */
function Panel({ title, tone, art, id, children }: { title: string; tone: Tone; art?: string; id: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className={`relative overflow-hidden rounded-panel p-5 sm:p-8 ${tones[tone]}`}>
      {art && <Art id={art} className="top-4 right-4 w-20 sm:w-28" />}
      <h2 id={id} className="max-w-[calc(100%-6rem)] font-display text-h2 font-extrabold sm:max-w-[calc(100%-8rem)]">
        {title}
      </h2>
      {children}
    </section>
  )
}

/** One day, as a stretch of the route: a dotted line down the left with a dot at every event, a flag for when it starts and the place beneath. */
function Day({ event, label, rows, tone, art }: { event: EventConfig; label: string; rows: ScheduleItem[]; tone: Tone; art: string }) {
  const place = (id: string) => event.pins.find((p) => p.id === id)?.title ?? ''
  const t = (iso: string) => formatMinutes(minutesOfDay(iso, event.timezone), event.locale.hour12)
  return (
    <section aria-label={label} className={`relative overflow-hidden rounded-panel p-5 sm:p-7 ${tones[tone]}`}>
      <Art id={art} className="top-3 right-3 w-24 sm:w-32" />
      <h3 className="inline-block -rotate-1 bg-accent px-5 py-1.5 font-display text-h3 font-extrabold text-paper" style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 12px 50%)' }}>
        {label}
      </h3>
      <ol className="mt-7 space-y-7 border-l-[3px] border-dotted border-accent pl-6">
        {rows.map((s) => (
          <li key={s.id} className="relative">
            <span aria-hidden="true" className="absolute top-2 -left-[2.02rem] size-4 rounded-pill border-hair border-accent bg-paper" />
            <p>
              <LabelTag variant="flag">{t(s.start)}</LabelTag> <span className="ml-1 text-small">until {t(s.end)}</span>
            </p>
            <p className="mt-2 font-display text-h3 font-extrabold">{s.title}</p>
            <p className="font-hand text-label">{place(s.pinId)}</p>
            <p className="mt-1 max-w-measure text-small">{s.description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

const swatches = ['--color-land-strong', '--color-water-deep', '--color-park', '--color-glow', '--color-flag', '--color-water']

/** The whole weekend on one page: the program, what to wear, how to get there, where to stay and the questions guests ask. */
export default function ProgramPage() {
  const event = wedding
  const sorted = [...event.schedule].sort((a, b) => +new Date(a.start) - +new Date(b.start))
  const days: { key: string; label: string; rows: ScheduleItem[] }[] = []
  for (const s of sorted) {
    if (s.pinId === 'calloway-jetty' || s.pinId === 'heron-jetty') continue // Ferries are listed once, under Getting here.
    const key = dayKey(s.start, event.timezone)
    let d = days.find((x) => x.key === key)
    if (!d) days.push((d = { key, label: formatDay(s.start, event.timezone, event.locale.language), rows: [] }))
    d.rows.push(s)
  }
  const dayStyle: { tone: Tone; art: string }[] = [
    { tone: 'water', art: 'landmark-boathouse' },
    { tone: 'land', art: 'landmark-arch' },
    { tone: 'park', art: 'landmark-cafe' },
  ]
  const time = (iso: string) => formatMinutes(minutesOfDay(iso, event.timezone), event.locale.hour12)
  const sat = event.mainDay ?? ''
  const ferriesOut = sorted.filter((s) => s.pinId === 'calloway-jetty' && dayKey(s.start, event.timezone) === sat)
  const ferriesBack = sorted.filter((s) => s.pinId === 'heron-jetty')
  const hotel = event.pins.find((p) => p.id === 'alder-inn')
  const shuttle = event.routes.filter((r) => r.mode === 'shuttle' || r.mode === 'walk')

  return (
    <main id="main" className="focus:outline-hidden mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-8">
      <PageBanner
        title={event.copy.programTitle}
        pieces={[
          { id: 'landmark-boathouse', x: 13, y: 90, w: 15 },
          { id: 'prop-tree-round', x: 25, y: 88, w: 5 },
          { id: 'landmark-estate', x: 42, y: 86, w: 24 },
          { id: 'landmark-arch', x: 62, y: 90, w: 10 },
          { id: 'landmark-ferry', x: 78, y: 70, w: 15 },
          { id: 'landmark-cafe', x: 91, y: 92, w: 12 },
        ]}
      >
        <p className="mt-5 max-w-measure text-body">{event.copy.programIntro}</p>
      </PageBanner>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {days.map((d, i) => (d.key === event.mainDay ? null : <Day key={d.key} event={event} label={d.label} rows={d.rows} {...dayStyle[i % 3]} />))}
        </div>
        <div>{days.map((d, i) => (d.key === event.mainDay ? <Day key={d.key} event={event} label={d.label} rows={d.rows} {...dayStyle[i % 3]} /> : null))}</div>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        {event.dress && (
          <Panel title={`What to wear: ${event.dress.headline}`} tone="land" id="dress">
            <div aria-hidden="true" className="mt-5 flex items-end gap-3">
              {couple.map((c) => {
                const art = illustrations[c.id]
                return art ? (
                  <div key={c.id} className="illo w-14 sm:w-20" style={{ ['--skin' as string]: c.skin, ['--hair' as string]: c.hair }} dangerouslySetInnerHTML={{ __html: art.svg }} />
                ) : null
              })}
            </div>
            <dl className="mt-5 space-y-4">
              {event.dress.notes.map((n) => (
                <div key={n.label}>
                  <dt className="font-hand text-label">{n.label}</dt>
                  <dd className="max-w-measure">{n.text}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 font-hand text-label">Colors we would love to see</p>
            <ul className="mt-2 flex flex-wrap gap-2" aria-label="Pink, blue, green, yellow, orange and sky blue">
              {swatches.map((c) => (
                <li key={c} aria-hidden="true" className="size-9 rounded-pill border-hair border-accent" style={{ background: `var(${c})` }} />
              ))}
            </ul>
          </Panel>
        )}

        <Panel title="Getting here" tone="deep" art="landmark-ferry" id="getting-here">
          <p className="mt-3 max-w-measure">{event.copy.hereIntro}</p>
          <h3 className="mt-5 font-hand text-label">Saturday ferries from Port Calloway</h3>
          <ul className="mt-2 flex flex-wrap gap-3">
            {ferriesOut.map((s) => (
              <li key={s.id}>
                <LabelTag variant="flag">{time(s.start)}</LabelTag>
              </li>
            ))}
          </ul>
          <h3 className="mt-5 font-hand text-label">Return ferries from Willowmere</h3>
          <ul className="mt-2 flex flex-wrap gap-3">
            {ferriesBack.map((s) => (
              <li key={s.id}>
                <LabelTag>{time(s.start)}</LabelTag>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-measure text-small">Please arrive 15 minutes before departure. Sunday&apos;s last ferry is at 12:30 pm.</p>
          <ul className="mt-5 space-y-2">
            {shuttle.map((r) => (
              <li key={r.id} className="max-w-measure text-small">
                <span className="font-medium">{r.name}.</span> About {r.durationMin} minutes, {r.accessible ? 'step-free' : 'has steps'}. {r.note}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {hotel && (
        <div className="mt-6">
          <Panel title="Where to stay" tone="park" art="landmark-hotel" id="stay">
            <p className="mt-3 max-w-measure">
              <span className="font-medium">{hotel.title}.</span> {hotel.details}
            </p>
          </Panel>
        </div>
      )}

      <div className="mt-6">
        <Panel title="Questions" tone="water" id="questions">
          <div className="mt-5">
            <Accordion items={event.faq} />
          </div>
        </Panel>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-panel bg-land-wash p-6 sm:p-8">
        <Art id="landmark-estate" className="right-4 bottom-0 hidden w-40 sm:block" />
        <p className="max-w-measure font-display text-h2 font-extrabold">{event.copy.rsvpTitle}</p>
        <p className="mt-2 max-w-measure">{event.copy.rsvpIntro}</p>
        <p className="mt-4">
          <a href="#/rsvp" className={primaryBtn}>
            {event.copy.ctaRsvp}
          </a>
        </p>
      </div>
    </main>
  )
}
