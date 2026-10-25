import { useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import type { EventConfig } from '../../data/events/types.ts'
import { sceneAt, sceneStyle } from '../../lib/scene.ts'
import { illustrations } from '../map/illustrations.ts'
import { measurePath } from '../journey/pathMeasure.ts'
import { nearestByY } from './walkGeometry.ts'
import type { Sample } from './walkGeometry.ts'
import { hairFor } from './useAvatar.ts'
import type { AvatarChoice } from './useAvatar.ts'

export interface Geo {
  w: number
  h: number
  desktop: boolean
  d: string
  samples: Sample[]
  /** Path fraction at which each station's stamps are collected. */
  thresholds: number[]
  leaders: { x1: number; y1: number; x2: number; y2: number }[]
}

interface WalkTrailProps {
  geo: Geo
  event: EventConfig
  containerRef: RefObject<HTMLElement | null>
  avatar: AvatarChoice
  stampsByStation: string[][]
  onCollect: (pinId: string) => void
  onFocusInside: (inside: boolean) => void
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * Everything that moves with scrolling: the avatar, the dotted trail behind it, the time of day and the stamps.
 * It is the only part of the walk that re-renders on scroll.
 */
export default function WalkTrail({ geo, event, containerRef, avatar, stampsByStation, onCollect, onFocusInside }: WalkTrailProps) {
  const [pos, setPos] = useState<Sample>(geo.samples[0])
  const [walking, setWalking] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const inside = useRef(false)
  const { scrollY } = useScroll()
  const m = measurePath(geo.d)

  const update = () => {
    const c = containerRef.current
    if (!c) return
    const top = c.getBoundingClientRect().top
    const focus = window.innerHeight * 0.55 - top
    const s = nearestByY(geo.samples, clamp(focus, 0, geo.h))
    setPos(s)
    const sc = sceneAt(0.3 + clamp(focus / geo.h, 0, 1) * 0.7, event.scene)
    for (const [k, v] of Object.entries(sceneStyle(sc))) c.style.setProperty(k, String(v))
    geo.thresholds.forEach((thr, i) => {
      if (s.f >= thr - 0.003) stampsByStation[i]?.forEach(onCollect)
    })
    const now = focus > 0 && focus < geo.h
    if (now !== inside.current) {
      inside.current = now
      onFocusInside(now)
    }
  }

  useMotionValueEvent(scrollY, 'change', () => {
    update()
    setWalking(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setWalking(false), 160)
  })
  useLayoutEffect(() => {
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo])

  const landW = geo.desktop ? Math.min(geo.w * 0.4, 520) : geo.w * 0.72
  const art = illustrations[avatar.style === 'suit' ? 'avatar-suit' : 'avatar-dress']
  const waves: [number, number][] = []
  if (geo.desktop) for (let y = 160; y < geo.h; y += 300) waves.push([geo.w * 0.04, y], [geo.w * 0.86, y + 150])

  return (
    <>
      <svg className="pointer-events-none absolute inset-0 z-0" width={geo.w} height={geo.h} aria-hidden="true">
        <g fill="none" stroke="var(--color-water-deep)" strokeWidth={1.5} strokeLinecap="round">
          {waves.map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y} q24 -14 48 0 t48 0 t48 0`} />
          ))}
        </g>
        <path d={geo.d} fill="none" stroke="var(--color-accent)" strokeWidth={landW + 3} strokeLinecap="round" strokeLinejoin="round" />
        <path d={geo.d} fill="none" stroke="var(--scene-land)" strokeWidth={landW} strokeLinecap="round" strokeLinejoin="round" />
        <path d={geo.d} fill="none" stroke="var(--color-paper)" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
        <path d={geo.d} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1 9" opacity={0.3} />
        <mask id="walk-reveal" maskUnits="userSpaceOnUse" x={0} y={0} width={geo.w} height={geo.h}>
          <path d={geo.d} fill="none" stroke="#fff" strokeWidth={16} strokeLinecap="round" strokeDasharray={m.length} strokeDashoffset={m.length * (1 - pos.f)} />
        </mask>
        <path d={geo.d} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1 9" mask="url(#walk-reveal)" />
      </svg>

      <svg className="pointer-events-none absolute inset-0 z-[15]" width={geo.w} height={geo.h} aria-hidden="true">
        {geo.leaders.map((l, i) => (
          <g key={i}>
            <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--color-ink)" strokeWidth={1.5} strokeLinecap="round" />
            <circle cx={l.x2} cy={l.y2} r={3} fill="var(--color-ink)" />
          </g>
        ))}
      </svg>

      {art && (
        <div
          aria-hidden="true"
          className={`illo avatar-walk pointer-events-none absolute z-[18] w-12 lg:w-16 ${walking ? 'walking' : ''}`}
          style={{
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -92%)',
            ['--skin' as string]: avatar.skin,
            ['--hair' as string]: hairFor[avatar.style],
          }}
          dangerouslySetInnerHTML={{ __html: art.svg }}
        />
      )}
    </>
  )
}
