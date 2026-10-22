import { useState } from 'react'

const blob =
  'M30 110 C20 60 70 25 130 30 C190 35 250 22 290 62 C320 95 300 150 250 170 C200 190 120 185 70 165 C45 155 33 135 30 110 Z'
const route = 'M20 170 C70 160 90 120 140 110 S220 80 250 100 S290 130 290 100'

function Card({ title, note, action, children }: { title: string; note: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <figure className="rounded-panel bg-paper p-4">
      {children}
      <figcaption className="mt-3 px-2 pb-2">
        <p className="font-medium">{title}</p>
        <p className="text-small">{note}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </figcaption>
    </figure>
  )
}

export default function LineSystem() {
  const [run, setRun] = useState(0)
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card title="Roads" note="White, 6 to 10px at hero scale, round joins and caps.">
        <svg viewBox="0 0 320 200" role="img" aria-label="White roads crossing a pink landmass" className="h-auto w-full rounded-panel" style={{ background: 'var(--color-water)' }}>
          <clipPath id="roads-clip">
            <path d={blob} />
          </clipPath>
          <path d={blob} fill="var(--color-land)" stroke="var(--color-paper)" strokeWidth={4} />
          <g clipPath="url(#roads-clip)" fill="none" stroke="var(--color-paper)" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 100 C100 90 200 100 310 80" />
            <path d="M120 20 C130 80 120 140 140 200" />
            <path d="M220 20 C210 80 230 140 215 200" />
            <path d="M30 150 C120 140 220 150 310 135" strokeWidth={6} />
          </g>
        </svg>
      </Card>

      <Card title="Leader lines" note="1.5px ink ending in a 6px filled dot. Handwriting sits at the free end.">
        <svg viewBox="0 0 320 200" role="img" aria-label="A handwritten label tied to a place by a thin line with a dot" className="h-auto w-full rounded-panel" style={{ background: 'var(--color-land)' }}>
          <circle cx={230} cy={130} r={26} fill="var(--color-paper)" />
          <path d="M230 130 L120 70" fill="none" stroke="var(--color-ink)" strokeWidth={1.5} />
          <circle cx={230} cy={130} r={3} fill="var(--color-ink)" />
          <rect x={24} y={34} width={130} height={46} rx={23} fill="var(--color-paper)" />
          <text x={89} y={65} textAnchor="middle" fill="var(--color-ink)" style={{ font: '600 24px var(--font-hand)' }}>
            lantern jetty
          </text>
        </svg>
      </Card>

      <Card
        title="Routes"
        note="Dashed, 3 to 4px, round caps. A solid mask draws the dashes on without stretching them."
        action={
          <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="rounded-pill bg-accent px-5 py-2 text-small font-medium text-paper shadow-press transition duration-micro ease-standard hover:-translate-y-0.5 active:translate-y-1 active:shadow-press-down"
        >
          Replay the route
        </button>
        }
      >
        <svg viewBox="0 0 320 200" role="img" aria-label="A dashed route drawing across the map" className="h-auto w-full rounded-panel" style={{ background: 'var(--color-water)' }}>
          <mask id="route-demo-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="320" height="200">
            <path key={run} d={route} pathLength={1} fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round" className="route-mask" />
          </mask>
          <path d={blob} fill="var(--color-land)" stroke="var(--color-paper)" strokeWidth={4} />
          <path d={route} fill="none" stroke="var(--color-accent)" strokeWidth={4} strokeLinecap="round" strokeDasharray="1 11" mask="url(#route-demo-reveal)" />
          <circle cx={20} cy={170} r={7} fill="var(--color-paper)" />
          <circle cx={290} cy={100} r={9} fill="var(--color-accent)" stroke="var(--color-paper)" strokeWidth={3} />
        </svg>
      </Card>

      <Card title="Contour lines" note="1px, land color mixed 22 percent toward white. Texture only, never carries meaning.">
        <svg viewBox="0 0 320 200" role="img" aria-label="Faint contour rings inside a pink landmass" className="h-auto w-full rounded-panel" style={{ background: 'var(--color-water)' }}>
          <path d={blob} fill="var(--color-land)" stroke="var(--color-paper)" strokeWidth={4} />
          {[0.84, 0.68, 0.52, 0.36].map((s) => (
            <path
              key={s}
              d={blob}
              transform={`translate(${160 * (1 - s)} ${100 * (1 - s)}) scale(${s})`}
              fill="none"
              stroke="var(--color-contour)"
              strokeWidth={1.5}
            />
          ))}
        </svg>
      </Card>
    </div>
  )
}
