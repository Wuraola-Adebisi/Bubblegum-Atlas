import type { CSSProperties } from 'react'
import LabelTag from '../../components/LabelTag.tsx'
import { illustrations } from '../map/illustrations.ts'
import { hairFor } from '../walk/useAvatar.ts'
import type { AvatarChoice } from '../walk/useAvatar.ts'

export type SceneState = 'draft' | 'confirmed' | 'waitlist' | 'declined'

interface RsvpSceneProps {
  state: SceneState
  avatar: AvatarChoice
}

const tags: Record<SceneState, string> = {
  draft: 'Boarding soon',
  confirmed: 'All aboard',
  waitlist: 'Waiting for a seat',
  declined: 'Next time',
}

function Illo({ id, className, style }: { id: string; className: string; style?: CSSProperties }) {
  const art = illustrations[id]
  if (!art) return null
  return <div className={`illo ${className}`} style={style} aria-hidden="true" dangerouslySetInnerHTML={{ __html: art.svg }} />
}

/**
 * A small harbor scene at the top of the RSVP page. The guest avatar waits on Calloway Jetty while the form is open,
 * steps onto the ferry when the reply is confirmed, and the ferry crosses to Willowmere. It is decoration, so it is hidden
 * from assistive tech and the status is also given in words by the page.
 */
export default function RsvpScene({ state, avatar }: RsvpSceneProps) {
  const aboard = state === 'confirmed'
  const sailed = state === 'confirmed' || state === 'declined'
  const ferryLeft = sailed ? '52%' : '22%'
  return (
    <div aria-hidden="true" className="relative mb-8 h-44 overflow-hidden rounded-panel sm:h-52" style={{ background: 'var(--color-water)' }}>
      <div className="absolute inset-y-0 right-0 w-2/5 rounded-l-full bg-land sm:w-1/3" />
      <Illo id="landmark-estate" className="absolute right-3 bottom-8 w-24 sm:right-10 sm:w-36" />
      <div className="absolute inset-x-6 bottom-6 border-t-2 border-dashed border-accent opacity-70 sm:inset-x-10" />
      <Illo id="landmark-jetty" className="absolute bottom-2 left-1 w-28 sm:left-6 sm:w-40" />
      <Illo
        id="landmark-ferry"
        className="absolute bottom-4 w-24 transition-[left] duration-1500 ease-standard motion-reduce:transition-none sm:w-36"
        style={{ left: ferryLeft }}
      />
      {avatar && (
        <Illo
          id={avatar.style === 'suit' ? 'avatar-suit' : 'avatar-dress'}
          className={`${state === 'confirmed' || state === 'waitlist' ? 'pin-pop' : ''} absolute w-8 transition-[left,bottom] duration-1500 ease-standard motion-reduce:transition-none sm:w-10`}
          style={{
            left: aboard ? `calc(${ferryLeft} + 3.25rem)` : '5.5rem',
            bottom: aboard ? '3.75rem' : '3rem',
            ['--skin' as string]: avatar.skin,
            ['--hair' as string]: hairFor[avatar.style],
          }}
        />
      )}
      <div className="absolute top-4 left-4 sm:left-6">
        <LabelTag>{tags[state]}</LabelTag>
      </div>
    </div>
  )
}
