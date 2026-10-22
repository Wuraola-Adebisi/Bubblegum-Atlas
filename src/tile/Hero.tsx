const landD =
  'M120 230 C90 150 170 90 260 80 C340 70 400 40 470 80 C560 120 590 200 560 280 C540 350 560 410 480 440 C400 470 330 430 260 450 C180 470 110 420 120 350 C125 310 135 270 120 230 Z'
const labels = [
  { text: 'Lighthouse', x: 478, y: 179 },
  { text: 'Estate house', x: 226, y: 355 },
  { text: 'Marquee', x: 390, y: 453 },
]
const routeD =
  'M24 430 C80 420 100 392 150 368 S232 306 262 276 S336 246 362 206 S436 176 470 196 S522 252 500 302'
const roads = [
  'M110 262 C240 250 400 240 580 230',
  'M205 70 C235 200 255 310 240 460',
  'M385 60 C395 170 405 270 425 460',
  'M110 350 C250 338 400 346 580 332',
]

function Tree({ x, y }: { x: number; y: number }) {
  const line = { stroke: 'var(--color-park-deep)', strokeWidth: 1.5, vectorEffect: 'non-scaling-stroke' } as const
  return (
    <g strokeLinejoin="round">
      <rect x={x - 2.5} y={y + 4} width={5} height={13} rx={2.5} fill="var(--color-ink)" {...line} />
      <circle cx={x} cy={y - 2} r={13} fill="var(--color-park-deep)" {...line} />
      <circle cx={x - 4} cy={y - 6} r={4} fill="var(--color-park)" />
    </g>
  )
}

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pt-12 pb-16 sm:px-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="font-hand text-label">Style tile, version 0.2, light</p>
        <h1
          id="hero-title"
          className="mt-4 inline-block -rotate-2 rounded-panel bg-paper px-6 py-4 font-display text-h1 font-extrabold text-accent"
        >
          Bubblegum Atlas
        </h1>
        <p className="mt-8 max-w-measure text-body">
          An airy, hand-drawn cartographic style. A bubblegum-pink landmass floats on pastel blue, traced in thin white
          roads, with oversized illustrated landmarks and handwritten wayfinding labels.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3" aria-label="Style keywords">
          {['airy', 'charted', 'hand-lettered', 'candy-pastel', 'playful wayfinding'].map((k) => (
            <li key={k} className="rounded-pill border-hair border-water-deep bg-paper px-4 py-1 font-hand text-label">
              {k}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative lg:col-span-7">
        <svg
          viewBox="0 0 640 520"
          role="img"
          aria-labelledby="hero-map-title"
          className="h-auto w-full rounded-panel"
          style={{ background: 'var(--color-water)' }}
        >
          <title id="hero-map-title">
            A pink island with thin white roads, a dashed ferry route that arrives from the left, a lighthouse, an estate
            house and a marquee tent.
          </title>
          <defs>
            <clipPath id="hero-land-clip">
              <path d={landD} />
            </clipPath>
            <mask id="hero-route-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="520">
              <path d={routeD} pathLength={1} fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round" className="route-mask" />
            </mask>
          </defs>

          {/* waves */}
          <g fill="none" stroke="var(--color-water-deep)" strokeWidth={1.5} strokeLinecap="round" className="pointer-events-none">
            <path d="M40 90 q12 -10 24 0 t24 0" vectorEffect="non-scaling-stroke" />
            <path d="M520 470 q12 -10 24 0 t24 0" vectorEffect="non-scaling-stroke" />
            <path d="M60 300 q12 -10 24 0 t24 0" vectorEffect="non-scaling-stroke" />
            <path d="M560 60 q12 -10 24 0 t24 0" vectorEffect="non-scaling-stroke" />
          </g>

          {/* landmass: pale wash with a berry hairline, contour rings, hairline roads and parks */}
          <path
            d={landD}
            fill="var(--color-land)"
            stroke="var(--color-accent)"
            strokeWidth={1.5}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <g clipPath="url(#hero-land-clip)">
            {[0.84, 0.68, 0.52].map((s) => (
              <path
                key={s}
                d={landD}
                transform={`translate(${340 * (1 - s)} ${260 * (1 - s)}) scale(${s})`}
                fill="none"
                stroke="var(--color-contour)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              {roads.map((d) => (
                <path key={`w-${d}`} d={d} stroke="var(--color-paper)" strokeWidth={3} />
              ))}
            </g>
            <g fill="var(--color-park)" stroke="var(--color-park-deep)" strokeWidth={1} strokeLinejoin="round">
              <path
                d="M300 330 C300 300 350 290 380 310 C410 330 400 380 360 390 C320 400 295 370 300 330 Z"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M165 150 C185 120 235 124 245 150 C255 182 212 204 184 192 C162 182 156 166 165 150 Z"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </g>

          {/* trees */}
          <Tree x={332} y={352} />
          <Tree x={362} y={366} />
          <Tree x={200} y={165} />

          {/* dashed route, revealed by the mask */}
          <path
            d={routeD}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="1 9"
            mask="url(#hero-route-reveal)"
          />

          {/* quay */}
          <rect
            x={8}
            y={418}
            width={44}
            height={22}
            rx={6}
            fill="var(--color-paper)"
            stroke="var(--color-accent)"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />

          {/* landmarks, drawn larger than the map around them. Line art, one solid accent each. */}
          <g className="line-art">
            <path d="M452 154 L460 84 L484 84 L492 154 Z" fill="var(--color-paper)" />
            <path d="M457 112 L487 112 L489 126 L455 126 Z" fill="var(--color-accent)" />
            <rect x={458} y={66} width={28} height={20} rx={4} fill="var(--color-glow)" />
            <path d="M454 66 L472 44 L490 66 Z" fill="var(--color-accent)" />
          </g>
          <g className="line-art">
            <rect x={172} y={286} width={84} height={46} rx={6} fill="var(--color-water-deep)" />
            <path d="M164 288 L214 252 L264 288 Z" fill="var(--color-accent)" />
            <rect x={206} y={304} width={16} height={28} rx={3} fill="var(--color-paper)" />
            <rect x={184} y={298} width={14} height={14} rx={3} fill="var(--color-glow)" />
            <rect x={230} y={298} width={14} height={14} rx={3} fill="var(--color-glow)" />
          </g>
          <g className="line-art">
            <path d="M350 430 L392 380 L434 430 Z" fill="var(--color-flag)" />
            <path d="M382 430 L392 380 L402 430 Z" fill="var(--color-paper)" />
            <rect x={346} y={426} width={92} height={8} rx={4} fill="var(--color-paper)" />
          </g>

          {/* handwritten note with leader line and dot */}
          <path d="M92 360 L48 330" fill="none" stroke="var(--color-ink)" strokeWidth={1.5} />
          <circle cx={92} cy={360} r={4} fill="var(--color-ink)" />
        </svg>

        {/* Labels are HTML so they stay at 20px on every screen size */}
        {labels.map((l) => (
          <span
            key={l.text}
            className="pin-pop absolute hidden -translate-x-1/2 -translate-y-1/2 rounded-pill border-hair border-accent bg-paper px-4 py-0.5 font-hand text-label font-semibold whitespace-nowrap text-ink sm:block"
            style={{ left: `${(l.x / 640) * 100}%`, top: `${(l.y / 520) * 100}%`, animationDelay: '1800ms' }}
          >
            {l.text}
          </span>
        ))}
        <span
          className="absolute hidden -translate-y-full font-hand text-label font-semibold whitespace-nowrap sm:block"
          style={{ left: `${(16 / 640) * 100}%`, top: `${(322 / 520) * 100}%` }}
        >
          ferry lands here
        </span>
        <ul className="mt-4 flex flex-wrap gap-2 sm:hidden" aria-label="Map labels">
          {labels.map((l) => (
            <li key={l.text} className="rounded-pill border-hair border-accent bg-paper px-4 py-0.5 font-hand text-label font-semibold text-ink">
              {l.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
