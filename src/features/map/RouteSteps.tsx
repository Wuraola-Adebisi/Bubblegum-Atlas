import type { Pin, Route } from '../../data/events/types.ts'

interface RouteStepsProps {
  routes: Route[]
  pins: Pin[]
  routeId: string | null
}

const modeLabel: Record<Route['mode'], string> = { walk: 'Walk', ferry: 'Ferry', shuttle: 'Shuttle', bike: 'Bike', courier: 'Courier' }

/** Every route as text steps, so the drawn route is never the only way to read it. */
export default function RouteSteps({ routes, pins, routeId }: RouteStepsProps) {
  const title = (id: string) => pins.find((p) => p.id === id)?.title ?? id
  return (
    <section aria-labelledby="routes-heading" className="rounded-panel bg-paper p-4 sm:p-6">
      <h2 id="routes-heading" className="font-display text-h3 font-extrabold">
        Getting around, in words
      </h2>
      <div className="mt-4 grid gap-6 md:grid-cols-3">
        {routes.map((r) => (
          <article key={r.id} aria-current={r.id === routeId ? 'true' : undefined}>
            <h3 className="font-medium">{r.name}</h3>
            <p className="text-small">
              {modeLabel[r.mode]}, about {r.durationMin} minutes, {r.accessible ? 'step-free' : 'has steps'}
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-small">
              {r.stops.map((s) => (
                <li key={s}>{title(s)}</li>
              ))}
            </ol>
            {r.note && <p className="mt-2 text-small">{r.note}</p>}
          </article>
        ))}
      </div>
    </section>
  )
}
