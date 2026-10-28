import { illustrations } from '../map/illustrations.ts'
import { hairFor } from '../walk/useAvatar.ts'
import type { AvatarChoice } from '../walk/useAvatar.ts'

interface GuestMarkerProps {
  /** Position in percent of the visible map window. */
  left: number
  top: number
  avatar: AvatarChoice
  moving: boolean
}

/** The guest on the day map. Decorative: the same information is given in words by the panel beside the map. */
export default function GuestMarker({ left, top, avatar, moving }: GuestMarkerProps) {
  const art = illustrations[avatar.style === 'suit' ? 'avatar-suit' : 'avatar-dress']
  if (!art) return null
  return (
    <div className="pointer-events-none absolute z-[15]" style={{ left: `${left}%`, top: `${top}%` }} aria-hidden="true">
      <div className="-translate-x-1/2 -translate-y-full" style={{ marginTop: '-14px' }}>
        <div
          className={`illo avatar-walk w-5 sm:w-7 ${moving ? 'walking guest-bob' : ''}`}
          style={{ ['--skin' as string]: avatar.skin, ['--hair' as string]: hairFor[avatar.style] }}
          dangerouslySetInnerHTML={{ __html: art.svg }}
        />
      </div>
    </div>
  )
}
