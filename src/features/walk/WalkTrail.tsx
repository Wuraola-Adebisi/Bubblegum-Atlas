import { useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import type { EventConfig } from '../../data/events/types.ts'
import { sceneAt, sceneGlowVars } from '../../lib/scene.ts'
import type { SceneState } from '../../lib/scene.ts'
import { illustrations } from '../map/illustrations.ts'
import { measurePath } from '../journey/pathMeasure.ts'
import { nearestByY } from './walkGeometry.ts'
import type { Sample } from './walkGeometry.ts'
import SpeechBubble from '../../components/SpeechBubble.tsx'
import { setMusicLevel } from '../../lib/audio.ts'
import { couple } from './people.ts'

export interface Geo {
  w: number
  h: number
  desktop: boolean
  d: string
  samples: Sample[]
  leaders: { x1: number; y1: number; x2: number; y2: number }[]
  lawns: { cx: number; cy: number; rx: number; ry: number }[]
}

interface WalkTrailProps {
  geo: Geo
  event: EventConfig
  containerRef: RefObject<HTMLElement | null>
  /** Called once, when the couple reach the end of the path. */
  onArrive?: () => void
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * Everything that moves with scrolling: the avatar, the dotted trail behind it, and the time of day.
 * It is the only part of the walk that re-renders on scroll.
 */
export default function WalkTrail({ geo, event, containerRef, onArrive }: WalkTrailProps) {
  const [pos, setPos] = useState<Sample>(geo.samples[0])
  const [sc, setSc] = useState<SceneState>(() => sceneAt(0.3, event.scene))
  const lastVars = useRef('')
  const [walking, setWalking] = useState(false)
  const [waved, setWaved] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const speakTimer = useRef(0)
  const lines = event.walk?.coupleLines ?? []
  const arrived = useRef(false)
  const timer = useRef<number | undefined>(undefined)
  const { scrollY } = useScroll()
  const m = measurePath(geo.d)

  const update = () => {
    const c = containerRef.current
    if (!c) return
    const top = c.getBoundingClientRect().top
    const focus = window.innerHeight * 0.55 - top
    const s = nearestByY(geo.samples, clamp(focus, 0, geo.h))
    setPos(s)
    setMusicLevel(0.28 + 0.72 * s.f)
    if (s.f > 0.985 && !arrived.current) {
      arrived.current = true
      onArrive?.()
    } else if (s.f < 0.9) arrived.current = false
    const next = sceneAt(0.3 + clamp(focus / geo.h, 0, 1) * 0.7, event.scene)
    setSc(next)
    // The light variables restyle everything inside, so they only change when their rounded value does (steps of 0.1, so ten changes from midday to night).
    const vars = sceneGlowVars(next, 0.1) as Record<string, string>
    const key = `${vars['--scene-glow']}|${vars['--scene-halo']}`
    if (key !== lastVars.current) {
      lastVars.current = key
      for (const [k, v] of Object.entries(vars)) c.style.setProperty(k, v)
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
  const gap = geo.desktop ? 6 : 4
  const waves: [number, number][] = []
  if (geo.desktop) for (let y = 160; y < geo.h; y += 300) waves.push([geo.w * 0.04, y], [geo.w * 0.86, y + 150])

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-0" style={{ background: sc.water }} aria-hidden="true" />
      <svg className="pointer-events-none absolute inset-0 z-0" width={geo.w} height={geo.h} aria-hidden="true">
        <g fill="none" stroke="var(--color-water-deep)" strokeWidth={1.5} strokeLinecap="round">
          {waves.map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y} q24 -14 48 0 t48 0 t48 0`} />
          ))}
        </g>
        <path d={geo.d} fill="none" stroke="var(--color-accent)" strokeWidth={landW + 3} strokeLinecap="round" strokeLinejoin="round" />
        <path d={geo.d} fill="none" stroke={sc.land} strokeWidth={landW} strokeLinecap="round" strokeLinejoin="round" />
        {geo.lawns.map((l, i) => (
          <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} fill={sc.park} stroke="var(--color-park-deep)" strokeWidth={1} />
        ))}
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

      {speaking && lines.length > 0 && (
        <div className="pointer-events-none absolute z-[21] will-change-transform" style={{ left: 0, top: 0, transform: `translate(${pos.x}px, ${pos.y - (geo.desktop ? 150 : 108)}px) translate(-50%, -100%)` }}>
          <SpeechBubble who="Maya and Theo" text={lines[(waved - 1 + lines.length * 8) % lines.length]} />
        </div>
      )}

      <button
        type="button"
        aria-label="Say hello to Maya and Theo"
        className="absolute z-[19] cursor-pointer will-change-transform"
        style={{ left: 0, top: 0, width: geo.desktop ? 176 : 124, height: geo.desktop ? 136 : 96, transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -92%)` }}
        onClick={() => {
          setWaved((n) => n + 1)
          setSpeaking(true)
          window.clearTimeout(speakTimer.current)
          speakTimer.current = window.setTimeout(() => setSpeaking(false), 4200)
        }}
      >
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center" style={{ gap }}>
          {couple.map((c) => {
            const art = illustrations[c.id]
            if (!art) return null
            return (
              <span key={`${c.id}-${waved}`} className={`illo block w-16 lg:w-24 ${waved > 0 ? 'poke' : ''}`}>
                <span
                  className={`illo avatar-walk walker-${c.role} block ${walking ? 'walking' : ''}`}
                  style={{ ['--skin' as string]: c.skin, ['--hair' as string]: c.hair }}
                  dangerouslySetInnerHTML={{ __html: art.svg }}
                />
              </span>
            )
          })}
        </span>
      </button>
    </>
  )
}
