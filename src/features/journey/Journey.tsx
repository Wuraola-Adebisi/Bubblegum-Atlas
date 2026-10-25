import { useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'
import type { EventConfig, JourneyConfig } from '../../data/events/types.ts'
import LabelTag from '../../components/LabelTag.tsx'
import ScaleBar from '../../components/ScaleBar.tsx'
import { clockAt, sceneAt, sceneStyle } from '../../lib/scene.ts'
import { placeStyle, project } from '../map/geometry.ts'
import { illustrations } from '../map/illustrations.ts'
import MapBase from '../map/MapBase.tsx'
import PinLabel from '../map/PinLabel.tsx'
import { hairFor, useAvatar } from '../walk/useAvatar.ts'
import { cameraAt, progressIn, windowFor } from './camera.ts'
import { measurePath } from './pathMeasure.ts'

const ease = (t: number) => t * t * (3 - 2 * t)

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ w: 1600, h: 1000 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth || 1600, h: el.clientHeight || 1000 })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

const linkBtn =
  'inline-flex min-h-11 items-center rounded-pill border-hair border-accent bg-paper px-6 py-2 font-medium text-accent shadow-press transition duration-micro ease-standard hover:bg-accent hover:text-paper active:translate-y-0.5 active:shadow-press-down'

const sparkColors = ['var(--color-glow)', 'var(--color-paper)', 'var(--color-land-strong)', 'var(--color-flag)']

/** Twinkles on the water, as [x, y, delay, duration, size], in map units. Scroll-independent, so the lake always feels alive. */
const ambient: [number, number, number, number, number][] = [
  [300, 300, 0, 3.2, 16], [540, 390, 1.1, 2.6, 12], [470, 900, 0.6, 3.6, 14], [900, 950, 1.8, 2.9, 12],
  [1490, 870, 0.3, 3.3, 16], [250, 190, 2.2, 2.7, 12], [640, 110, 0.9, 3.9, 14], [1310, 960, 1.4, 3.1, 12],
  [130, 430, 2.6, 3.4, 14], [560, 620, 0.2, 2.8, 12], [1530, 300, 1.7, 3.7, 16], [200, 900, 0.8, 3.0, 12],
  [1550, 600, 2.0, 2.8, 12], [60, 700, 1.3, 3.5, 14],
]

function Star({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 0 L12.4 7.6 L20 10 L12.4 12.4 L10 20 L7.6 12.4 L0 10 L7.6 7.6 Z" fill={color} stroke="var(--color-accent)" strokeWidth={1.2} strokeLinejoin="round" />
    </svg>
  )
}

interface Spark {
  id: number
  x: number
  y: number
  dx: number
  dy: number
  s: number
  c: number
}

interface JourneyProps {
  event: EventConfig
  journey: JourneyConfig
}

/**
 * The home journey, seen from above. Native scrolling drives one progress value, smoothed with a spring, and
 * the camera, ferry, walker, route and pins all read it. The map is zoomed out so the whole estate stays in view.
 * Buildings can be poked: they hop, throw sparkles and say what happens there.
 * With reduced motion the stage shows the finished scene and nothing twinkles or flies.
 */
export default function Journey({ event, journey }: JourneyProps) {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [stageRef, size] = useSize<HTMLDivElement>()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.6, restDelta: 0.0004 })
  const [scrolled, setScrolled] = useState(0)
  const [walking, setWalking] = useState(false)
  const walkTimer = useRef<number | undefined>(undefined)
  useMotionValueEvent(smooth, 'change', (v) => {
    setScrolled(Math.min(1, Math.max(0, v)))
    setWalking(true)
    window.clearTimeout(walkTimer.current)
    walkTimer.current = window.setTimeout(() => setWalking(false), 160)
  })
  const p = reduced ? 1 : scrolled
  const [avatar] = useAvatar()

  const [lifted, setLifted] = useState<string | null>(null)
  const [poked, setPoked] = useState<{ id: string; n: number } | null>(null)
  const [bubble, setBubble] = useState<string | null>(null)
  const [announce, setAnnounce] = useState('')
  const [sparks, setSparks] = useState<Spark[]>([])
  const sparkId = useRef(0)
  const lastTrail = useRef(0)
  const bubbleTimer = useRef<number | undefined>(undefined)

  const vb = event.map.viewBox
  const win = windowFor(cameraAt(journey.camera, p), vb, size.w / size.h)
  const t = 0.04 + p * 0.5
  const scene = sceneAt(t, event.scene)
  const clock = clockAt(t, event.clock.startMin, event.clock.endMin)
  const pinsById = new Map(event.pins.map((pin) => [pin.id, pin]))
  const active = journey.chapters.find((c) => p >= c.from && p < c.to) ?? journey.chapters[journey.chapters.length - 1]

  const legs = journey.legs.map((leg) => {
    const m = measurePath(leg.pathD)
    const lt = ease(progressIn(p, leg.from, leg.to))
    return { leg, m, lt, pos: m.at(lt) }
  })
  const ferry = legs.find((l) => l.leg.vehicle === 'landmark-ferry')

  const spawn = (xPct: number, yPct: number, n: number, spread: number) => {
    if (reduced) return
    const made: Spark[] = Array.from({ length: n }, () => {
      const a = Math.random() * Math.PI * 2
      const r = spread * (0.5 + Math.random() * 0.5)
      return { id: ++sparkId.current, x: xPct, y: yPct, dx: Math.cos(a) * r, dy: Math.sin(a) * r - spread * 0.3, s: 12 + Math.random() * 14, c: Math.floor(Math.random() * sparkColors.length) }
    })
    setSparks((prev) => [...prev.slice(-30), ...made])
    window.setTimeout(() => setSparks((prev) => prev.filter((s) => !made.some((m) => m.id === s.id))), 900)
  }

  const trail = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== 'mouse') return
    const now = e.timeStamp
    if (now - lastTrail.current < 70) return
    lastTrail.current = now
    const r = e.currentTarget.getBoundingClientRect()
    spawn(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100, 1, 26)
  }

  const poke = (pinId: string, xPct: number, yPct: number) => {
    const pin = pinsById.get(pinId)
    setPoked((prev) => ({ id: pinId, n: (prev?.n ?? 0) + 1 }))
    spawn(xPct, yPct, 10, 70)
    if (pin) {
      setBubble(pinId)
      setAnnounce(`${pin.title}. ${pin.summary}`)
      window.clearTimeout(bubbleTimer.current)
      bubbleTimer.current = window.setTimeout(() => setBubble(null), 3800)
    }
  }

  const svgExtra = (
    <>
      {legs.map(({ leg, m, lt }) => (
        <g key={leg.id}>
          {/* A faint preview of the whole route, so the opening shows where the trip goes. */}
          <path d={leg.pathD} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1 9" vectorEffect="non-scaling-stroke" opacity={0.35} />
          <mask id={`reveal-${leg.id}`} maskUnits="userSpaceOnUse" x={vb[0]} y={vb[1]} width={vb[2]} height={vb[3]}>
            <path d={leg.pathD} fill="none" stroke="#fff" strokeWidth={16} strokeLinecap="round" strokeDasharray={m.length} strokeDashoffset={m.length * (1 - lt)} />
          </mask>
          <path d={leg.pathD} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="1 9" vectorEffect="non-scaling-stroke" mask={`url(#reveal-${leg.id})`} />
        </g>
      ))}
      {ferry && ferry.lt > 0.02 && ferry.lt < 0.995 && (
        <g fill="var(--color-paper)" stroke="var(--color-water-deep)" strokeWidth={1} vectorEffect="non-scaling-stroke">
          {[1, 2, 3, 4, 5].map((k) => {
            const pt = ferry.m.at(Math.max(0, ferry.lt - k * 0.03))
            return <circle key={k} cx={pt.x} cy={pt.y - 3} r={6.5 - k * 0.9} opacity={0.9 - k * 0.14} vectorEffect="non-scaling-stroke" />
          })}
        </g>
      )}
      {ferry && !reduced && ferry.lt > 0.01 && ferry.lt < 0.995 && (
        <g fill="var(--color-paper)" stroke="var(--color-water-deep)" strokeWidth={1}>
          {[0, 1, 2].map((i) => {
            const ph = (p * 45 + i / 3) % 1
            return <circle key={i} cx={ferry.pos.x + 18 + Math.sin(ph * 6 + i) * 4} cy={ferry.pos.y - 118 - ph * 36} r={3 + ph * 6} opacity={(1 - ph) * 0.8} vectorEffect="non-scaling-stroke" />
          })}
        </g>
      )}
    </>
  )

  const placements = event.map.placements.filter((pl) => pl.pinId)

  return (
    <>
      <section
        ref={sectionRef}
        aria-label="The journey from Harbor Quay to Larkmere Estate"
        className="relative"
        style={reduced ? undefined : { height: `${journey.scrollVh}vh` }}
      >
        <a
          href="#journey-end"
          className="fixed top-2 left-2 z-50 -translate-y-24 rounded-pill bg-paper px-5 py-2 font-medium text-accent focus:translate-y-0"
        >
          {event.copy.journeySkip}
        </a>
        <div id="journey-end" tabIndex={-1} className="absolute left-0 h-px w-px" style={{ top: reduced ? '0' : 'calc(100% - 100svh + 6rem)' }} />

        <div
          ref={stageRef}
          onPointerMove={trail}
          className={`${reduced ? 'relative h-svh' : 'sticky top-0 h-svh'} overflow-hidden`}
          style={{ ...sceneStyle(scene), background: 'var(--scene-water)' }}
        >
          <MapBase map={event.map} win={win} hide={journey.hide} liftedPin={lifted} pokedPin={poked} svgExtra={svgExtra}>
            {!reduced &&
              ambient.map(([x, y, delay, dur, s], i) => {
                const pos = project(x, y, win)
                if (pos.left < -5 || pos.left > 105 || pos.top < -5 || pos.top > 105) return null
                return (
                  <span
                    key={i}
                    className="twinkle absolute"
                    style={{ left: `${pos.left}%`, top: `${pos.top}%`, ['--delay' as string]: `${delay}s`, ['--tw' as string]: `${dur}s` }}
                  >
                    <Star size={s} color="var(--color-paper)" />
                  </span>
                )
              })}
            {legs.map(({ leg, pos }) => {
              const isPerson = leg.vehicle.startsWith('person')
              const art = illustrations[isPerson ? `avatar-${avatar.style}` : leg.vehicle]
              if (!art) return null
              const w = art.width * leg.scale
              const h = art.height * leg.scale
              const isFerry = leg.vehicle === 'landmark-ferry'
              const bob = reduced || !isFerry ? 0 : Math.sin(p * 90) * 1.5
              return (
                <div
                  key={`v-${leg.id}`}
                  className={`illo absolute ${isPerson ? `avatar-walk ${walking && !reduced ? 'walking' : ''}` : ''}`}
                  style={{
                    ...placeStyle(win, pos.x, pos.y, w, h),
                    opacity: isPerson && p < leg.from ? 0 : 1,
                    transform: `translateY(${bob}px)`,
                    ...(isPerson ? { ['--skin' as string]: avatar.skin, ['--hair' as string]: hairFor[avatar.style] } : {}),
                  }}
                  dangerouslySetInnerHTML={{ __html: art.svg }}
                />
              )
            })}
            {journey.stops.map((s) => {
              const pin = pinsById.get(s.pinId)
              if (!pin || p < s.at) return null
              const pos = project(pin.x, pin.y, win)
              return (
                <div key={s.pinId} className="absolute" style={{ left: `${pos.left}%`, top: `${pos.top}%` }}>
                  <div className="pin-pop absolute top-0 left-0 size-6 -translate-x-1/2 -translate-y-1/2 rounded-pill border-hair border-accent bg-paper" />
                  <div className="pin-pop">
                    <PinLabel pin={pin} side={s.side} />
                  </div>
                </div>
              )
            })}
            {bubble &&
              (() => {
                const pin = pinsById.get(bubble)
                const pl = placements.find((x) => x.pinId === bubble)
                const art = pl && illustrations[pl.illustrationId]
                if (!pin || !pl || !art) return null
                const top = project(pl.x, pl.y - art.height * pl.scale, win)
                // Near the top of the screen the bubble opens below the building instead of above it.
                const below = top.top < 30
                const pos = below ? project(pl.x, pl.y, win) : top
                return (
                  <div key={bubble} className={`pin-pop absolute z-10 w-56 -translate-x-1/2 ${below ? '' : '-translate-y-full'}`} style={{ left: `${pos.left}%`, top: `${pos.top}%`, marginTop: below ? 10 : -10 }}>
                    <div className="rounded-panel border-hair border-accent bg-paper px-4 py-3 text-center">
                      <p className="font-hand text-label">{pin.title}</p>
                      <p className="text-small">{pin.summary}</p>
                    </div>
                  </div>
                )
              })()}
            {sparks.map((s) => (
              <span
                key={s.id}
                className="burst absolute"
                style={{ left: `${s.x}%`, top: `${s.y}%`, ['--dx' as string]: `${s.dx}px`, ['--dy' as string]: `${s.dy}px` }}
              >
                <Star size={s.s} color={sparkColors[s.c]} />
              </span>
            ))}
          </MapBase>

          <div className="pointer-events-none absolute inset-0 z-10">
            {placements.map((pl) => {
              const art = illustrations[pl.illustrationId]
              const pin = pl.pinId ? pinsById.get(pl.pinId) : undefined
              if (!art || !pin || !pl.pinId) return null
              const w = art.width * pl.scale
              const h = art.height * pl.scale
              const pinId = pl.pinId
              const c = project(pl.x, pl.y - h / 2, win)
              return (
                <button
                  key={`hit-${pl.illustrationId}-${pinId}`}
                  type="button"
                  aria-label={`${pin.title}, ${pin.kind}. Press to say hi.`}
                  className="pointer-events-auto absolute cursor-pointer rounded-panel"
                  style={{ ...placeStyle(win, pl.x, pl.y, w, h), height: `${(h / win.h) * 100}%`, minWidth: 44, minHeight: 44 }}
                  onPointerEnter={() => setLifted(pinId)}
                  onPointerLeave={() => setLifted(null)}
                  onFocus={() => setLifted(pinId)}
                  onBlur={() => setLifted(null)}
                  onClick={() => poke(pinId, c.left, c.top)}
                />
              )
            })}
          </div>

          <p className="sr-only" aria-live="polite">
            {announce}
          </p>

          <div className="pointer-events-none absolute top-20 left-4 sm:top-6 sm:left-8">
            <p className="inline-block -rotate-2 rounded-panel border-hair border-accent bg-paper px-5 py-2 font-display text-h2 font-extrabold">
              {event.copy.journeyTitle}
            </p>
          </div>

          <div className="absolute inset-x-4 bottom-32 sm:inset-x-auto sm:top-28 sm:bottom-auto sm:left-8 sm:w-112">
            <div className="relative min-h-40">
              {journey.chapters.map((c) => {
                const on = c === active
                return (
                  <div
                    key={c.title}
                    inert={!on}
                    className={`absolute inset-x-0 bottom-0 rounded-panel bg-paper p-5 transition-opacity duration-standard ease-standard sm:top-0 sm:bottom-auto sm:p-6 ${on ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <h2 className="font-display text-h3 font-extrabold">{c.title}</h2>
                    <p className="mt-2">{c.body}</p>
                    {c.final && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <a href="#/rsvp" className={linkBtn}>
                          {event.copy.ctaRsvp}
                        </a>
                        <a href="#/map" className={linkBtn}>
                          {event.copy.ctaMap}
                        </a>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-4 bottom-4 space-y-2 sm:inset-x-8 sm:bottom-6">
            {!reduced && p < 0.08 && (
              <div className="flex flex-wrap gap-2">
                <LabelTag variant="flag">Scroll slowly to follow the ferry</LabelTag>
                <LabelTag>Tap a building to say hi</LabelTag>
              </div>
            )}
            <p className="font-hand text-label" aria-hidden="true">
              <span className="rounded-pill bg-paper px-3">{clock}</span>
            </p>
            <ScaleBar progress={p} start={journey.scale.start} end={journey.scale.end} />
          </div>
        </div>
      </section>

      {/* The whole story as plain text, in order, for screen readers and for reduced motion. */}
      <section aria-label="The journey in words" className={reduced ? 'mx-auto max-w-measure px-4 py-12' : 'sr-only'}>
        <ol className="space-y-6">
          {journey.chapters.map((c) => (
            <li key={`t-${c.title}`}>
              <h2 className="font-display text-h3 font-extrabold">{c.title}</h2>
              <p>{c.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
