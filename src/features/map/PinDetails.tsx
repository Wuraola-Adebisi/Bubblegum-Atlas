import type { EventConfig, Pin, Route } from '../../data/events/types.ts'
import { formatSlot } from '../../lib/time.ts'

interface PinDetailsProps {
  event: EventConfig
  pin: Pin | null
  onRoute: (id: string) => void
  onClose: () => void
}

const btn =
  'min-h-11 cursor-pointer rounded-pill border-hair border-accent bg-paper px-5 py-2 font-medium text-accent transition duration-micro ease-standard hover:bg-accent hover:text-paper'

/** Details for the selected place. A polite live region, so a screen reader hears the change. */
export default function PinDetails({ event, pin, onRoute, onClose }: PinDetailsProps) {
  const zone = pin && event.zones.find((z) => z.id === pin.zoneId)
  const slots = pin ? event.schedule.filter((s) => s.pinId === pin.id) : []
  const routes: Route[] = pin ? event.routes.filter((r) => r.stops.includes(pin.id)) : []
  return (
    <section id="pin-details" aria-live="polite" aria-label="Place details" className="rounded-panel bg-paper p-4 sm:p-6">
      {!pin ? (
        <p>Pick a place on the map or in the list to see what happens there.</p>
      ) : (
        <div className="space-y-4">
          <div>
            <h2 className="font-display text-h3 font-extrabold">{pin.title}</h2>
            <p className="font-hand text-label font-semibold">
              {pin.kind}
              {zone ? `, ${zone.name}` : ''}
            </p>
          </div>
          <p>{pin.summary}</p>
          {pin.details && <p>{pin.details}</p>}
          {slots.length > 0 && (
            <div>
              <h3 className="font-medium">Happening here</h3>
              <ul className="mt-1 space-y-1 text-small">
                {slots.map((s) => (
                  <li key={s.id}>
                    {formatSlot(s.start, event.timezone, event.locale.hour12, event.locale.language)}: {s.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {routes.map((r) => (
              <button key={r.id} type="button" className={btn} onClick={() => onRoute(r.id)}>
                Show route: {r.name}
              </button>
            ))}
            <button type="button" className={btn} onClick={onClose}>
              Close details
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
