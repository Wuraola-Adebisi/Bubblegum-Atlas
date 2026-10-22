import { useState } from 'react'
import { clockAt, sceneAt, sceneKeyframes, sceneStyle } from '../lib/scene.ts'

const landD =
  'M70 200 C50 150 110 110 190 112 C260 114 330 100 420 130 C500 158 520 220 450 250 C380 280 260 286 170 270 C110 260 80 240 70 200 Z'

export default function SceneStrip() {
  const [value, setValue] = useState(0)
  const t = value / 100
  const s = sceneAt(t)
  const clock = clockAt(t)
  const sunX = 60 + t * 520
  const sunY = 150 - 110 * Math.sin(Math.PI * t)
  const sunOpacity = Math.max(0, 1 - Math.max(0, (t - 0.78) / 0.22))
  const bulbs = [0, 1, 2, 3, 4, 5, 6, 7]

  return (
    <div>
      <ul className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {sceneKeyframes.map((k) => (
          <li key={k.name} className="rounded-panel bg-paper p-3">
            <div className="flex h-12 overflow-hidden rounded-pill border-hair border-water-deep">
              {[k.sky, k.water, k.land, k.park].map((c, i) => (
                <span key={i} className="h-full flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
            <p className="mt-3 text-small font-medium">{k.name}</p>
            <p className="text-small">{k.moment}</p>
          </li>
        ))}
      </ul>

      <div className="overflow-hidden rounded-panel" style={sceneStyle(s)}>
        <svg viewBox="0 0 640 340" role="img" aria-label={`A small island scene at ${clock}, ${s.name.toLowerCase()}`} className="block h-auto w-full" style={{ background: 'var(--scene-sky)' }}>
          <circle cx={sunX} cy={sunY} r={30} fill="var(--color-glow)" opacity={sunOpacity} />
          <rect x={0} y={200} width={640} height={140} fill="var(--scene-water)" />
          <path d={landD} fill="var(--scene-land)" stroke="var(--color-accent)" strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path
            d="M120 215 C130 185 190 180 215 200 C235 222 190 245 150 240 C130 237 118 228 120 215 Z"
            fill="var(--scene-park)"
            stroke="var(--color-park-deep)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
          <g className="line-art">
            <path d="M300 210 L350 150 L400 210 Z" fill="var(--color-flag)" />
            <rect x={284} y={170} width={4} height={46} rx={2} fill="var(--color-ink)" />
            <rect x={412} y={170} width={4} height={46} rx={2} fill="var(--color-ink)" />
          </g>
          <g fill="var(--color-glow)" style={{ opacity: 'var(--scene-glow)' }}>
            {bulbs.map((b) => (
              <circle key={b} cx={286 + b * 18.3} cy={172 + Math.sin((b / 7) * Math.PI) * 16} r={4.5} />
            ))}
            <rect x={160} y={196} width={10} height={10} rx={2} />
          </g>
          <g fill="none" stroke="var(--color-water-deep)" strokeWidth={1.5} strokeLinecap="round" className="pointer-events-none">
            <path d="M40 270 q12 -10 24 0 t24 0" vectorEffect="non-scaling-stroke" />
            <path d="M520 300 q12 -10 24 0 t24 0" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>
      </div>

      <div className="mt-8 rounded-panel border-hair border-dashed border-water-deep bg-paper p-6 sm:p-8">
        <label htmlFor="scrubber" className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-display text-h3 font-extrabold">Time of day</span>
          <span className="font-hand text-label font-semibold tabular-nums">
            {clock}, {s.name.toLowerCase()}
          </span>
        </label>
        <input
          id="scrubber"
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-valuetext={`${clock}, ${s.name.toLowerCase()}`}
          className="scrubber mt-6"
        />
        <p className="mt-6 text-body" aria-live="polite">
          {s.moment}
        </p>
        <p className="mt-2 max-w-measure text-small">
          Only the map scene changes. Panels, labels and text stay on fixed tokens, so every contrast pair above holds at every time.
        </p>
      </div>
    </div>
  )
}
