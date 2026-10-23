import type { Pin, Zone } from '../../data/events/types.ts'
import { swatchFor } from './layerStyle.ts'

interface PinListProps {
  zones: Zone[]
  pins: Pin[]
  selectedId: string | null
  onSelect: (id: string) => void
}

/** The text alternative to the map. Same places, same filters, grouped by zone. */
export default function PinList({ zones, pins, selectedId, onSelect }: PinListProps) {
  if (pins.length === 0) {
    return <p className="rounded-panel bg-paper p-6">No places match. Turn a layer back on in the legend.</p>
  }
  return (
    <div className="space-y-6">
      {zones.map((z) => {
        const inZone = pins.filter((p) => p.zoneId === z.id)
        if (inZone.length === 0) return null
        return (
          <section key={z.id} aria-labelledby={`zone-${z.id}`} className="rounded-panel bg-paper p-4 sm:p-6">
            <h2 id={`zone-${z.id}`} className="font-display text-h3 font-extrabold">
              {z.name}
            </h2>
            <p className="text-small">{z.blurb}</p>
            <ul className="mt-3 space-y-2">
              {inZone.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={p.id === selectedId}
                    aria-controls="pin-details"
                    onClick={() => onSelect(p.id)}
                    className={`flex min-h-11 w-full cursor-pointer items-start gap-3 rounded-panel border-hair px-4 py-3 text-left transition duration-micro ease-standard ${
                      p.id === selectedId ? 'border-accent bg-land-wash' : 'border-water-deep-wash hover:bg-land-wash'
                    }`}
                  >
                    <span aria-hidden="true" className={`mt-1.5 size-4 shrink-0 rounded-pill border-hair border-accent ${swatchFor(p.layerIds[0])}`} />
                    <span>
                      <span className="block font-medium">{p.title}</span>
                      <span className="block text-small">
                        {p.kind}. {p.summary}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
