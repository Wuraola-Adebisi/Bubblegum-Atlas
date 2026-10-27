import type { ReactNode } from 'react'
import type { MapConfig, Route } from '../../data/events/types.ts'
import { placeStyle } from './geometry.ts'
import type { Win } from './geometry.ts'
import { illustrations } from './illustrations.ts'

interface MapBaseProps {
  map: MapConfig
  win: Win
  route?: Route | null
  /** Direct colours for the water, land and park. Leave out to read the scene variables. */
  fills?: { water: string; land: string; park: string }
  /** Illustration ids to leave out, for pieces a scene draws itself (the moving ferry). */
  hide?: string[]
  /** The pin whose artwork is lifted, for example under the pointer. */
  liftedPin?: string | null
  /** The pin whose artwork was just poked. `n` changes on every poke so the animation can play again. */
  pokedPin?: { id: string; n: number } | null
  /** Extra SVG drawn above the roads, in map units. */
  svgExtra?: ReactNode
  /** Extra HTML layered above the illustrations. Positions are the caller's job. */
  children?: ReactNode
}

/** The painted map: water, land, parks, roads, an optional route and the inlined illustrations. */
export default function MapBase({ map, win, route, fills, hide = [], liftedPin = null, pokedPin = null, svgExtra, children }: MapBaseProps) {
  const vb = map.viewBox
  const placements = [...map.placements].filter((p) => !hide.includes(p.illustrationId)).sort((a, b) => a.y - b.y)
  return (
    <>
      <svg viewBox={`${win.x} ${win.y} ${win.w} ${win.h}`} className="absolute inset-0 block h-full w-full" aria-hidden="true">
        <rect x={vb[0] - 3000} y={vb[1] - 3000} width={vb[2] + 6000} height={vb[3] + 6000} fill={fills?.water ?? 'var(--scene-water)'} />
        <g fill="none" stroke="var(--color-water-deep)" strokeWidth={1.5} strokeLinecap="round">
          {map.waves?.map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y} q24 -14 48 0 t48 0 t48 0`} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        <path d={map.landPath} fill={fills?.land ?? 'var(--scene-land)'} stroke="var(--color-accent)" strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {map.parkPaths.map((d) => (
          <path key={d} d={d} fill={fills?.park ?? 'var(--scene-park)'} stroke="var(--color-park-deep)" strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        ))}
        {map.waterPaths.map((d) => (
          <path key={d} d={d} fill={fills?.water ?? 'var(--scene-water)'} stroke="var(--color-water-deep)" strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        ))}
        <g fill="none" stroke="var(--color-paper)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          {map.roadPaths.map((d) => (
            <path key={d} d={d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        {route && (
          <path key={route.id} d={route.pathD} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1 9" vectorEffect="non-scaling-stroke" />
        )}
        {svgExtra}
      </svg>

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {placements.map((p, i) => {
          const art = illustrations[p.illustrationId]
          if (!art) return null
          return (
            <div
              key={`${p.illustrationId}-${i}-${p.pinId && pokedPin?.id === p.pinId ? pokedPin.n : 0}`}
              className={`illo absolute origin-bottom transition-transform duration-micro ease-standard ${p.pinId && liftedPin === p.pinId ? 'lifted' : ''} ${
                p.pinId && pokedPin?.id === p.pinId ? 'poke' : ''
              }`}
              style={placeStyle(win, p.x, p.y, art.width * p.scale, art.height * p.scale)}
              dangerouslySetInnerHTML={{ __html: art.svg }}
            />
          )
        })}
        {children}
      </div>
    </>
  )
}
