import { useId, useState } from 'react'
import type { Layer, Route } from '../../data/events/types.ts'
import { swatchFor } from './layerStyle.ts'

interface LegendCardProps {
  layers: Layer[]
  layerOn: Set<string>
  onToggleLayer: (id: string) => void
  routes: Route[]
  routeId: string | null
  onRoute: (id: string | null) => void
}

const modeLabel: Record<Route['mode'], string> = { walk: 'Walk', ferry: 'Ferry', shuttle: 'Shuttle', bike: 'Bike', courier: 'Courier' }

const choice =
  'flex min-h-11 cursor-pointer items-center gap-3 rounded-pill border-hair border-transparent px-3 py-1.5 transition duration-micro ease-standard has-[:checked]:border-accent has-[:checked]:bg-land-wash has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink'

/** The map key and the map menu in one card. Layers are checkboxes, routes are a radio group. */
export default function LegendCard({ layers, layerOn, onToggleLayer, routes, routeId, onRoute }: LegendCardProps) {
  const [open, setOpen] = useState(true)
  const panel = useId()
  const routeName = useId()
  return (
    <section aria-label="Map legend" className="rounded-panel border-hair border-dashed border-water-deep bg-paper p-4 sm:p-6">
      <h2 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panel}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 text-left font-display text-h3 font-extrabold"
        >
          Legend
          <span className="font-hand text-label font-semibold text-accent">{open ? 'Hide' : 'Show'}</span>
        </button>
      </h2>
      <div id={panel} hidden={!open} className="mt-3 space-y-6">
        <fieldset>
          <legend className="font-medium">Show on the map</legend>
          <ul className="mt-2 space-y-1">
            {layers.map((l) => (
              <li key={l.id}>
                <label className={choice}>
                  <input type="checkbox" className="sr-only" checked={layerOn.has(l.id)} onChange={() => onToggleLayer(l.id)} />
                  <span
                    aria-hidden="true"
                    className={`size-4 shrink-0 rounded-pill border-hair border-accent ${layerOn.has(l.id) ? swatchFor(l.id) : 'bg-paper'}`}
                  />
                  {l.label}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        <fieldset>
          <legend className="font-medium">Route</legend>
          <ul className="mt-2 space-y-1">
            <li>
              <label className={choice}>
                <input type="radio" name={routeName} className="sr-only" checked={routeId === null} onChange={() => onRoute(null)} />
                None
              </label>
            </li>
            {routes.map((r) => (
              <li key={r.id}>
                <label className={choice}>
                  <input type="radio" name={routeName} className="sr-only" checked={routeId === r.id} onChange={() => onRoute(r.id)} />
                  <span>
                    {r.name}
                    <span className="block text-small">
                      {modeLabel[r.mode]}, {r.durationMin} min{r.accessible ? ', step-free' : ''}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>
    </section>
  )
}
