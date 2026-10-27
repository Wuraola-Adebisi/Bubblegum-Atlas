interface PassportStampProps {
  label: string
  state: 'locked' | 'collected'
  /** Tilt in degrees, so a row of stamps does not look stamped by a machine. */
  tilt?: number
}

/** A round stamp. Locked is a dashed outline, collected is solid berry and lands with a pop. */
export default function PassportStamp({ label, state, tilt = 0 }: PassportStampProps) {
  const on = state === 'collected'
  return (
    <span
      className={`inline-grid size-28 shrink-0 place-items-center rounded-pill border-hair p-3 text-center font-hand text-small leading-tight ${
        on ? 'pin-pop border-accent bg-land-wash text-accent' : 'border-dashed border-water-deep bg-paper text-ink'
      }`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <span className={on ? 'rounded-pill border-hair border-accent px-2 py-3' : ''}>{label}</span>
    </span>
  )
}
