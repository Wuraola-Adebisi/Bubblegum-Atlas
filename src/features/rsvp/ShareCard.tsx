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

/** The share image: 1080 by 1350, the 4:5 feed size. Drawn at full size and scaled down for the preview. */
export default function ShareCard({ event, values, code, cardRef }: ShareCardProps) {
  const first = (values.name ?? '').trim().split(/\s+/)[0] || 'A guest'
  const ferry = ferryDetails(event, values.ferry)
  const party = values.party?.trim()
  const piece = (id: string, x: number, bottom: number, w: number) => (
    <div key={`${id}-${x}`} className="illo" style={art(id, x, bottom, w)} dangerouslySetInnerHTML={{ __html: illustrations[id]?.svg ?? '' }} />
  )
  const chip = (label: string, value: string) => (
    <div style={{ background: 'var(--color-paper)', borderRadius: 28, padding: '22px 30px', flex: 1 }}>
      <div className="font-hand" style={{ fontSize: 30, lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
    </div>
  )
  return (
    <div
      ref={cardRef}
      style={{ width: CARD_W, height: CARD_H, position: 'relative', overflow: 'hidden', background: 'var(--color-ground)', color: 'var(--color-ink)', fontFamily: 'var(--font-body)' }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, width: CARD_W, height: 700, background: 'var(--color-water)' }}>
        <svg width={CARD_W} height={700} viewBox={`0 0 ${CARD_W} 700`} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden="true">
          <path
            d="M110 390 C130 210 360 120 560 140 C800 160 985 230 995 400 C1005 560 820 655 560 655 C330 655 90 570 110 390 Z"
            fill="var(--color-land)"
            stroke="var(--color-accent)"
            strokeWidth={3}
          />
          <ellipse cx="560" cy="360" rx="330" ry="150" fill="var(--color-park)" stroke="var(--color-park-deep)" strokeWidth={2} />
          <path d="M360 650 C480 640 410 530 520 450" fill="none" stroke="var(--color-accent)" strokeWidth={5} strokeLinecap="round" strokeDasharray="1 16" />
        </svg>
        {piece('landmark-estate', 560, 450, 560)}
        {piece('landmark-arch', 880, 560, 200)}
        {piece('prop-tree-round', 220, 540, 100)}
        {piece('prop-tree-round', 950, 330, 86)}
        {piece('landmark-ferry', 250, 700, 340)}
        <div style={{ position: 'absolute', left: 60, top: 56, background: 'var(--color-paper)', border: '3px solid var(--color-accent)', borderRadius: 999, padding: '10px 36px', transform: 'rotate(-3deg)' }}>
          <span className="font-hand" style={{ fontSize: 48 }}>Larkmere Estate</span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 60, right: 60, top: 740 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 92, lineHeight: 1.02, letterSpacing: '-0.02em' }}>{first} is going to Larkmere</div>
        <div style={{ marginTop: 22, fontSize: 38, lineHeight: 1.35 }}>
          {event.title.replace(' at Larkmere', '')}&apos;s wedding weekend, September 10 to 12, 2027
        </div>
        <div style={{ marginTop: 40, display: 'flex', gap: 20 }}>
          {chip('Saturday ferry', ferry ? ferry.time : 'Not chosen')}
          {chip('Party', party ? `${party} ${party === '1' ? 'guest' : 'guests'}` : '1 guest')}
          {chip('Reference', code)}
        </div>
      </div>
      <div className="font-hand" style={{ position: 'absolute', left: 60, bottom: 40, fontSize: 34 }}>Harbor Quay to Larkmere Estate</div>
    </div>
  )
}
