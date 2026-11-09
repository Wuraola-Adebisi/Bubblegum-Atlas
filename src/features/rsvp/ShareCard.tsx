import type { CSSProperties, Ref } from 'react'
import type { EventConfig } from '../../data/events/types.ts'
import { illustrations } from '../map/illustrations.ts'
import { ferryDetails } from './rsvp.ts'

export const CARD_W = 1080
export const CARD_H = 1350

interface ShareCardProps {
  event: EventConfig
  values: Record<string, string>
  code: string
  cardRef?: Ref<HTMLDivElement>
}

const art = (id: string, x: number, bottom: number, w: number): CSSProperties => ({
  position: 'absolute',
  left: x - w / 2,
  top: bottom - (illustrations[id] ? (illustrations[id].height / illustrations[id].width) * w : 0),
  width: w,
})

/**
 * The downloadable pass: 1080 by 1350, the 4:5 feed size. A map of the estate sits above a full-size ferry boarding pass with a colored band,
 * the route, the details and a stub. Drawn at full size and scaled down for the preview.
 */
export default function ShareCard({ event, values, code, cardRef }: ShareCardProps) {
  const name = (values.name ?? '').trim() || 'A guest'
  const ferry = ferryDetails(event, values.ferry)
  const party = values.party?.trim()
  const couple = event.title.replace(' at Willowmere', '')
  const piece = (id: string, x: number, bottom: number, w: number) => (
    <div key={`${id}-${x}`} className="illo" style={art(id, x, bottom, w)} dangerouslySetInnerHTML={{ __html: illustrations[id]?.svg ?? '' }} />
  )
  const field = (label: string, value: string, span = 1) => (
    <div style={{ flex: span, borderTop: '3px dashed var(--color-water-deep-wash)', paddingTop: 14, minWidth: 0 }}>
      <div className="font-hand" style={{ fontSize: 30, lineHeight: 1.2 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, lineHeight: 1.15 }}>{value}</div>
    </div>
  )
  return (
    <div
      ref={cardRef}
      style={{ width: CARD_W, height: CARD_H, position: 'relative', overflow: 'hidden', background: 'var(--color-water)', color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}
    >
      <svg width={CARD_W} height={560} viewBox={`0 0 ${CARD_W} 560`} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden="true">
        <path
          d="M90 330 C110 160 340 70 560 90 C800 110 990 190 1000 340 C1010 490 820 560 560 560 C330 560 70 500 90 330 Z"
          fill="var(--color-land)"
          stroke="var(--color-accent)"
          strokeWidth={3}
        />
        <ellipse cx="540" cy="300" rx="320" ry="130" fill="var(--color-park)" stroke="var(--color-park-deep)" strokeWidth={2} />
        <path d="M200 520 C330 520 400 440 500 380" fill="none" stroke="var(--color-accent)" strokeWidth={5} strokeLinecap="round" strokeDasharray="1 16" />
      </svg>
      {piece('landmark-estate', 540, 380, 520)}
      {piece('landmark-arch', 860, 470, 190)}
      {piece('prop-tree-round', 200, 440, 96)}
      {piece('prop-tree-round', 960, 290, 84)}
      {piece('landmark-ferry', 230, 560, 300)}

      <div
        style={{
          position: 'absolute',
          left: 56,
          right: 56,
          top: 420,
          bottom: 56,
          background: 'var(--color-paper)',
          border: '4px solid var(--color-accent)',
          borderRadius: 44,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ background: 'var(--color-accent)', color: 'var(--color-paper)', padding: '22px 44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 46 }}>Ferry boarding pass</div>
          <div style={{ background: 'var(--color-paper)', color: 'var(--color-accent)', borderRadius: 999, padding: '6px 26px', fontSize: 30, fontWeight: 600 }}>Confirmed</div>
        </div>

        <div style={{ padding: '32px 44px 0', display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'end', gap: 24 }}>
          <div>
            <div className="font-hand" style={{ fontSize: 30 }}>From</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 104, lineHeight: 0.95, letterSpacing: '0.04em' }}>CAL</div>
            <div style={{ fontSize: 30, marginTop: 6 }}>Port Calloway</div>
          </div>
          <div style={{ position: 'relative', height: 130 }} aria-hidden="true">
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 26, borderTop: '5px dotted var(--color-accent)' }} />
            <div className="illo" style={{ position: 'absolute', left: '50%', bottom: 18, width: 190, transform: 'translateX(-50%)' }} dangerouslySetInnerHTML={{ __html: illustrations['landmark-ferry']?.svg ?? '' }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="font-hand" style={{ fontSize: 30 }}>To</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 104, lineHeight: 0.95, letterSpacing: '0.04em' }}>WLM</div>
            <div style={{ fontSize: 30, marginTop: 6 }}>Willowmere</div>
          </div>
        </div>

        <div style={{ padding: '30px 44px 0', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', gap: 28 }}>{field('Passenger', name, 1)}</div>
          <div style={{ display: 'flex', gap: 28 }}>
            {field('Date', ferry ? ferry.day.replace(/^\w+, /, '') : 'Not chosen')}
            {field('Ferry', ferry ? ferry.time : 'Not chosen')}
            {field('Gate', 'Calloway Jetty')}
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            {field('Party', party ? `${party} ${party === '1' ? 'guest' : 'guests'}` : '1 guest')}
            {field('Dinner', values.meal || 'Not chosen')}
            {field('Reference', code)}
          </div>
        </div>

        <div style={{ marginTop: 'auto', borderTop: '4px dashed var(--color-water-deep)', padding: '22px 44px 26px', display: 'flex', alignItems: 'center', gap: 28 }}>
          <div
            aria-hidden="true"
            style={{ height: 70, flex: 1, background: 'repeating-linear-gradient(90deg, var(--color-ink) 0 4px, transparent 4px 8px, var(--color-ink) 8px 11px, transparent 11px 19px)' }}
          />
          <div className="font-hand" style={{ fontSize: 32, textAlign: 'right', lineHeight: 1.2 }}>
            {couple}
            <br />
            September 10 to 12, 2027
          </div>
        </div>
      </div>
    </div>
  )
}
