import { memo, useRef, useState } from 'react'
import SpeechBubble from '../../components/SpeechBubble.tsx'
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
  const [poked, setPoked] = useState(0)
  const [talking, setTalking] = useState(false)
  const timer = useRef(0)
  const main = station.art[0] ? illustrations[station.art[0].id] : undefined
  const pin = event.pins.find((p) => p.id === station.pinIds[station.kind === 'wren-shore' ? 1 : 0])
  const title = pin?.title ?? 'this place'
  const hello = pin?.hello ?? pin?.summary ?? ''
  const heightPct = main && station.art[0] ? (station.art[0].w * main.height) / main.width / 0.8 : 0
  return (
    <section aria-labelledby={`station-${station.id}`} className="relative grid items-center gap-8 py-14 lg:grid-cols-2 lg:gap-20 lg:py-24">
      <div ref={artRef} className={`relative z-10 ${artRight ? 'lg:order-2' : ''}`} style={{ aspectRatio: '5 / 4' }}>
        <div aria-hidden="true" className="absolute inset-0">
          {station.art.map((a, i) => {
            const art = illustrations[a.id]
            if (!art) return null
            return (
              <div key={`${a.id}-${i}`} className="absolute" style={{ left: `${a.x}%`, bottom: `${100 - a.y}%`, width: `${a.w}%`, transform: 'translateX(-50%)' }}>
                <div key={i === 0 ? poked : 0} className={`illo ${i === 0 && poked > 0 ? 'poke' : ''}`} dangerouslySetInnerHTML={{ __html: art.svg }} />
              </div>
            )
          })}
        </div>
        {main && station.art[0] && (
          <button
            type="button"
            aria-label={`Say hi to ${title}`}
            className="absolute cursor-pointer rounded-panel"
            style={{
              left: `${station.art[0].x}%`,
              bottom: `${100 - station.art[0].y}%`,
              width: `${station.art[0].w}%`,
              height: `${((station.art[0].w * main.height) / main.width / 0.8).toFixed(1)}%`,
              minWidth: 44,
              minHeight: 44,
              transform: 'translateX(-50%)',
            }}
            onClick={() => {
              setPoked((n) => n + 1)
              setTalking(true)
              window.clearTimeout(timer.current)
              timer.current = window.setTimeout(() => setTalking(false), 4200)
            }}
          />
        )}
        {talking && station.art[0] && hello && (
          <SpeechBubble who={title} text={hello} className="absolute z-30 -translate-x-1/2" style={{ left: `${Math.min(76, Math.max(24, station.art[0].x))}%`, bottom: `calc(${100 - station.art[0].y + heightPct}% + 10px)` }} />
        )}
      </div>
      <div ref={cardRef} className={`relative z-20 rounded-panel bg-paper p-5 sm:p-8 ${artRight ? 'lg:order-1' : ''}`}>
        <StationContent event={event} station={station} />
      </div>
    </section>
  )
})

export default Station
