import type { Pin } from '../../data/events/types.ts'
import LabelTag from '../../components/LabelTag.tsx'
import LeaderLine from '../../components/LeaderLine.tsx'

const labelOffset = {
  right: { dx: 44, dy: -26, move: 'translate(0, -50%)' },
  left: { dx: -44, dy: -26, move: 'translate(-100%, -50%)' },
  below: { dx: 0, dy: 48, move: 'translate(-50%, 0)' },
  above: { dx: 0, dy: -48, move: 'translate(-50%, -100%)' },
} as const

/** A leader line and a label tag, placed at the origin of a positioned parent. Decorative: the pin button names the place. */
export default function PinLabel({ pin, flag = false, side: sideOverride }: { pin: Pin; flag?: boolean; side?: Pin['labelSide'] }) {
  const side = labelOffset[sideOverride ?? pin.labelSide ?? 'right']
  return (
    <>
      <LeaderLine dx={side.dx} dy={side.dy} />
      <div className="absolute top-0 left-0" style={{ transform: `translate(${side.dx}px, ${side.dy}px) ${side.move}` }}>
        <LabelTag variant={flag ? 'flag' : 'pill'}>{pin.title}</LabelTag>
      </div>
    </>
  )
}
