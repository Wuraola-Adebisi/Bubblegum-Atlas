import type { ReactNode } from 'react'
import { illustrations } from '../features/map/illustrations.ts'

export interface BannerPiece {
  id: string
  /** Centre, as a percentage of the banner's width. */
  x: number
  /** Bottom edge, as a percentage of the banner's height. */
  y: number
  /** Width, as a percentage of the banner's width. */
  w: number
}

/**
 * The header of an inner page: a small map. Water, a pink shore, a dotted route and a few of the estate's buildings, with the page title on a
 * tilted tag. It keeps every page in the same cartographic world as the walk.
 */
export default function PageBanner({ title, pieces, children }: { title: string; pieces: BannerPiece[]; children?: ReactNode }) {
  return (
    <header>
      <div className="relative h-52 overflow-hidden rounded-panel bg-water sm:h-64">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
          <path d="M0 50 L0 27 Q14 16 30 22 T62 20 T100 24 L100 50 Z" style={{ fill: 'var(--color-land)' }} stroke="var(--color-accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d="M-2 44 Q25 36 48 41 T104 38" fill="none" stroke="var(--color-paper)" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d="M-2 44 Q25 36 48 41 T104 38" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 9" vectorEffect="non-scaling-stroke" />
        </svg>
        {pieces.map((pc, i) => {
          const art = illustrations[pc.id]
          if (!art) return null
          return (
            <div
              key={`${pc.id}-${i}`}
              aria-hidden="true"
              className="illo absolute"
              style={{ left: `${pc.x}%`, bottom: `${100 - pc.y}%`, width: `${pc.w}%`, transform: 'translateX(-50%)' }}
              dangerouslySetInnerHTML={{ __html: art.svg }}
            />
          )
        })}
        <h1 className="absolute top-4 left-4 -rotate-2 rounded-panel border-hair border-accent bg-paper px-5 py-2 font-display text-h1 font-extrabold sm:top-6 sm:left-6">{title}</h1>
      </div>
      {children}
    </header>
  )
}
