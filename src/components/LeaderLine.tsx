interface LeaderLineProps {
  dx: number
  dy: number
}

/** A 1.5px navy line from the origin to (dx, dy), ending in a 6px dot. Place it at the origin of its parent. */
export default function LeaderLine({ dx, dy }: LeaderLineProps) {
  return (
    <svg className="pointer-events-none absolute top-0 left-0 overflow-visible" width="1" height="1" aria-hidden="true">
      <line x1={0} y1={0} x2={dx} y2={dy} stroke="var(--color-ink)" strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={dx} cy={dy} r={3} fill="var(--color-ink)" />
    </svg>
  )
}
