import type { EventConfig } from '../../data/events/types.ts'
import { dayKey, formatDay, formatMinutes, minutesOfDay } from '../../lib/time.ts'

const offsets = ['', 'lg:ml-16', 'lg:ml-6']

/** The whole weekend as three day panels. Content comes from the event schedule. */
export default function WeekendSection({ event }: { event: EventConfig }) {
  const place = (id: string) => event.pins.find((p) => p.id === id)?.title ?? ''
  const sorted = [...event.schedule].sort((a, b) => +new Date(a.start) - +new Date(b.start))
  const days: { key: string; label: string; items: typeof sorted }[] = []
  for (const s of sorted) {
    const key = dayKey(s.start, event.timezone)
    let d = days.find((x) => x.key === key)
    if (!d) {
      d = { key, label: formatDay(s.start, event.timezone, event.locale.language), items: [] }
      days.push(d)
    }
    d.items.push(s)
  }
  return (
    <section id="weekend" aria-labelledby="weekend-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h2 id="weekend-heading" className="font-display text-h1 font-extrabold">
            {event.copy.weekendTitle}
          </h2>
          <p className="mt-4 max-w-measure text-body">{event.copy.weekendIntro}</p>
        </div>
        <div className="space-y-6 lg:col-span-3">
          {days.map((d, i) => (
            <article key={d.key} className={`rounded-panel bg-paper p-5 sm:p-8 ${offsets[i % offsets.length]}`}>
              <h3 className="font-display text-h3 font-extrabold">{d.label}</h3>
              <ul className="mt-4 space-y-3">
                {d.items.map((s) => (
                  <li key={s.id} className="flex gap-4">
                    <span className="w-24 shrink-0 font-hand text-label font-semibold tabular-nums">
                      {formatMinutes(minutesOfDay(s.start, event.timezone), event.locale.hour12)}
                    </span>
                    <span>
                      {s.title}
                      <span className="block text-small">{place(s.pinId)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
