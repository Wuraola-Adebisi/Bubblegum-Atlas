import { walkedPath } from './dayPath.ts'
import type { DayPath, GuestSpot } from './dayPath.ts'

const dots = {
  fill: 'none',
  strokeWidth: 2.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeDasharray: '1 9',
  vectorEffect: 'non-scaling-stroke' as const,
}

/**
 * The guest's day as a dotted line on the map. The whole route is faint, and the part already walked is solid berry.
 * The walked part is its own short path that stops at the guest. An SVG mask did the same job but cost far more paint
 * on every scrub (measured: about 40 ms per frame at 4x CPU throttling).
 */
export default function DayRoute({ path, spot }: { path: DayPath; spot: GuestSpot }) {
  return (
    <g>
      <path d={path.d} stroke="var(--color-accent)" strokeOpacity={0.35} {...dots} />
      <path d={walkedPath(path, spot)} stroke="var(--color-accent)" {...dots} />
    </g>
  )
}
