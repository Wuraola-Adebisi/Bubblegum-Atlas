import { memo } from 'react'
import type { EventConfig, WalkStation } from '../../data/events/types.ts'
import { illustrations } from '../map/illustrations.ts'
import StationContent from './StationContent.tsx'

interface StationProps {
  event: EventConfig
  station: WalkStation
  /** Art on the right and text on the left, on wide screens. */
  artRight: boolean
  artRef: (el: HTMLDivElement | null) => void
  cardRef: (el: HTMLDivElement | null) => void
}

/** One place on the estate: the artwork on one side, the text on the other. */
const Station = memo(function Station({ event, station, artRight, artRef, cardRef }: StationProps) {
  return (
    <section aria-labelledby={`station-${station.id}`} className="relative grid items-center gap-8 py-14 lg:grid-cols-2 lg:gap-20 lg:py-24">
      <div ref={artRef} aria-hidden="true" className={`relative z-10 ${artRight ? 'lg:order-2' : ''}`} style={{ aspectRatio: '5 / 4' }}>
        {station.art.map((a, i) => {
          const art = illustrations[a.id]
          if (!art) return null
          return (
            <div
              key={`${a.id}-${i}`}
              className="illo absolute"
              style={{ left: `${a.x}%`, bottom: `${100 - a.y}%`, width: `${a.w}%`, transform: 'translateX(-50%)' }}
              dangerouslySetInnerHTML={{ __html: art.svg }}
            />
          )
        })}
      </div>
      <div ref={cardRef} className={`relative z-20 rounded-panel bg-paper p-5 sm:p-8 ${artRight ? 'lg:order-1' : ''}`}>
        <StationContent event={event} station={station} />
      </div>
    </section>
  )
})

export default Station
