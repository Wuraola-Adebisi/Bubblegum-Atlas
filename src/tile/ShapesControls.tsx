const flagClip = 'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)'

const btn =
  'rounded-pill border-hair border-accent bg-paper px-6 py-3 font-medium text-accent shadow-press transition duration-micro ease-standard'
const btnSecondary =
  'rounded-pill border-hair border-accent px-6 py-3 font-medium text-accent transition duration-micro ease-standard'

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
      {children}
      <span className="font-hand text-label">{label}</span>
    </div>
  )
}

function House({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={`h-32 w-32 ${className}`} role="img" aria-label="A small house">
      <g className="line-art">
        <rect x={20} y={56} width={80} height={50} rx={6} fill="var(--color-water-deep)" />
        <path d="M12 58 L60 20 L108 58 Z" fill="var(--color-accent)" />
        <rect x={52} y={76} width={16} height={30} rx={3} fill="var(--color-paper)" />
      </g>
    </svg>
  )
}

export default function ShapesControls() {
  return (
    <div className="grid gap-10">
      <div className="rounded-panel bg-paper p-6 sm:p-10">
        <h3 className="mb-8 font-display text-h3 font-extrabold">Radius scale</h3>
        <div className="flex flex-wrap items-end gap-10">
          <Cell label="blob, for hero forms">
            <svg viewBox="0 0 160 110" className="h-28 w-40" role="img" aria-label="Organic blob shape">
              <path
                d="M20 60 C10 25 55 8 90 14 C130 20 152 45 138 78 C124 106 70 104 40 92 C28 86 22 74 20 60 Z"
                fill="var(--color-land)"
                stroke="var(--color-accent)"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </Cell>
          <Cell label="28px, for panels">
            <div className="h-28 w-40 rounded-panel border-hair border-accent bg-land" />
          </Cell>
          <Cell label="999px, for pills and tags">
            <div className="h-12 w-40 rounded-pill border-hair border-accent bg-land" />
          </Cell>
          <Cell label="cut ends, for banners and flags">
            <div className="h-12 w-40 bg-flag" style={{ clipPath: flagClip }} />
          </Cell>
        </div>
      </div>

      <div className="rounded-panel bg-land p-6 sm:p-10">
        <h3 className="mb-8 font-display text-h3 font-extrabold">Outline</h3>
        <div className="flex flex-wrap items-end gap-12">
          <Cell label="1.5px berry hairline, no white edge (current)">
            <House />
          </Cell>
          <Cell label="version 1, 4px white edge (retired)">
            <svg viewBox="0 0 120 120" className="sticker-edge h-32 w-32" role="img" aria-label="The same house with the old white sticker outline">
              <rect x={20} y={56} width={80} height={50} rx={6} fill="var(--color-water-deep)" />
              <path d="M12 58 L60 20 L108 58 Z" fill="var(--color-accent)" />
              <rect x={52} y={76} width={16} height={30} rx={3} fill="var(--color-paper)" />
            </svg>
          </Cell>
        </div>
      </div>

      <div className="rounded-panel bg-paper p-6 sm:p-10">
        <h3 className="mb-8 font-display text-h3 font-extrabold">Button states</h3>
        <div className="flex flex-wrap items-end gap-8">
          <Cell label="primary, default">
            <button type="button" className={`${btn} hover:-translate-y-px hover:bg-accent hover:text-paper active:translate-y-0.5 active:shadow-press-down`}>
              Send RSVP
            </button>
          </Cell>
          <Cell label="hover lifts 1px, fills berry">
            <span className={`${btn} inline-block -translate-y-px bg-accent text-paper`}>Send RSVP</span>
          </Cell>
          <Cell label="pressed, drops 2px">
            <span className={`${btn} inline-block translate-y-0.5 shadow-press-down`}>Send RSVP</span>
          </Cell>
          <Cell label="focus ring">
            <span className={`${btn} force-focus inline-block`}>Send RSVP</span>
          </Cell>
          <Cell label="disabled, dashed border">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-pill border-hair border-dashed border-water-deep bg-ground px-6 py-3 font-medium text-ink"
            >
              Send RSVP
            </button>
          </Cell>
          <Cell label="secondary">
            <button type="button" className={`${btnSecondary} hover:bg-land-wash active:translate-y-0.5`}>
              See the route
            </button>
          </Cell>
          <Cell label="ghost">
            <button type="button" className="rounded-pill px-6 py-3 font-medium text-accent underline-offset-4 transition duration-micro ease-standard hover:underline">
              Add to my plan
            </button>
          </Cell>
        </div>
      </div>

      <div className="rounded-panel bg-paper p-6 sm:p-10">
        <h3 className="mb-8 font-display text-h3 font-extrabold">Labels and pins</h3>
        <div className="flex flex-wrap items-end gap-10">
          <Cell label="flag, the solid accent label">
            <span className="inline-block bg-accent py-2 pr-8 pl-8 font-hand text-label font-semibold text-paper" style={{ clipPath: flagClip }}>
              Estate house
            </span>
          </Cell>
          <Cell label="pill with a hairline">
            <span className="inline-block rounded-pill border-hair border-accent bg-paper px-5 py-1 font-hand text-label font-semibold text-ink">
              Boathouse
            </span>
          </Cell>
          <Cell label="handwritten, on a pale pill">
            <span className="inline-block rounded-pill bg-land-wash px-5 py-1 font-hand text-label font-semibold">arrive by 12:45</span>
          </Cell>
          <Cell label="numbered pin, for sequences">
            <span className="flex h-10 w-10 items-center justify-center rounded-pill border-2 border-paper bg-accent font-medium text-paper">3</span>
          </Cell>
          <Cell label="24px pin, 44px hit area (dashed)">
            <span className="flex h-11 w-11 items-center justify-center rounded-pill border-hair border-dashed border-water-deep">
              <span className="block h-6 w-6 rounded-pill border-2 border-paper bg-accent" />
            </span>
          </Cell>
          <Cell label="visited pin">
            <span className="flex h-11 w-11 items-center justify-center rounded-pill border-hair border-dashed border-water-deep">
              <span className="block h-6 w-6 rounded-pill border-2 border-paper bg-park-deep" />
            </span>
          </Cell>
        </div>
      </div>
    </div>
  )
}
