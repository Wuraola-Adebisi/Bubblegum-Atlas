const flagClip = 'polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)'

const btn =
  'rounded-pill bg-accent px-6 py-3 font-medium text-paper shadow-press transition duration-micro ease-standard'

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
      {children}
      <span className="font-hand text-label">{label}</span>
    </div>
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
              <path d="M20 60 C10 25 55 8 90 14 C130 20 152 45 138 78 C124 106 70 104 40 92 C28 86 22 74 20 60 Z" fill="var(--color-land)" />
            </svg>
          </Cell>
          <Cell label="28px, for panels">
            <div className="h-28 w-40 rounded-panel bg-land" />
          </Cell>
          <Cell label="999px, for pills and tags">
            <div className="h-12 w-40 rounded-pill bg-land" />
          </Cell>
          <Cell label="cut ends, for banners and flags">
            <div className="h-12 w-40 bg-flag" style={{ clipPath: flagClip }} />
          </Cell>
        </div>
      </div>

      <div className="rounded-panel bg-land p-6 sm:p-10">
        <h3 className="mb-8 font-display text-h3 font-extrabold">Sticker outline</h3>
        <div className="flex flex-wrap items-end gap-12">
          <Cell label="4px white edge that follows the silhouette">
            <svg viewBox="0 0 120 120" className="sticker-edge h-32 w-32" role="img" aria-label="A small house with a sticker outline">
              <rect x={20} y={56} width={80} height={50} rx={6} fill="var(--color-water-deep)" />
              <path d="M12 58 L60 20 L108 58 Z" fill="var(--color-accent)" />
              <rect x={52} y={76} width={16} height={30} rx={3} fill="var(--color-paper)" />
            </svg>
          </Cell>
          <Cell label="no edge, for comparison">
            <svg viewBox="0 0 120 120" className="h-32 w-32" role="img" aria-label="The same house without an outline">
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
          <Cell label="default">
            <button type="button" className={`${btn} hover:-translate-y-0.5 active:translate-y-1 active:shadow-press-down`}>
              Send RSVP
            </button>
          </Cell>
          <Cell label="hover lifts 2px">
            <span className={`${btn} inline-block -translate-y-0.5`}>Send RSVP</span>
          </Cell>
          <Cell label="pressed, drops 4px">
            <span className={`${btn} inline-block translate-y-1 shadow-press-down`}>Send RSVP</span>
          </Cell>
          <Cell label="focus ring">
            <span className={`${btn} force-focus inline-block`}>Send RSVP</span>
          </Cell>
          <Cell label="disabled">
            <button type="button" disabled className="cursor-not-allowed rounded-pill bg-land px-6 py-3 font-medium text-ink">
              Send RSVP
            </button>
          </Cell>
        </div>
      </div>

      <div className="rounded-panel bg-paper p-6 sm:p-10">
        <h3 className="mb-8 font-display text-h3 font-extrabold">Labels and pins</h3>
        <div className="flex flex-wrap items-end gap-10">
          <Cell label="flag">
            <span className="inline-block bg-accent py-2 pr-8 pl-8 font-hand text-label font-semibold text-paper" style={{ clipPath: flagClip }}>
              Estate house
            </span>
          </Cell>
          <Cell label="pill with white outline">
            <span className="inline-block rounded-pill border-4 border-paper bg-accent px-5 py-1 font-hand text-label font-semibold text-paper shadow-none outline-2 outline-water">
              Boathouse
            </span>
          </Cell>
          <Cell label="handwritten, on paper">
            <span className="inline-block rounded-pill bg-ground px-5 py-1 font-hand text-label font-semibold">arrive by 12:45</span>
          </Cell>
          <Cell label="numbered pin, for sequences">
            <span className="flex h-10 w-10 items-center justify-center rounded-pill border-4 border-paper bg-accent font-medium text-paper outline-2 outline-water">
              3
            </span>
          </Cell>
          <Cell label="unnumbered pin">
            <span className="block h-6 w-6 rounded-pill border-4 border-paper bg-accent outline-2 outline-water" />
          </Cell>
          <Cell label="visited pin">
            <span className="block h-6 w-6 rounded-pill border-4 border-paper bg-park-deep outline-2 outline-water" />
          </Cell>
        </div>
      </div>
    </div>
  )
}
