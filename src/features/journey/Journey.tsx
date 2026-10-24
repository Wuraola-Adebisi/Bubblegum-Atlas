import { useLayoutEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import type { EventConfig, JourneyConfig } from '../../data/events/types.ts'
import LabelTag from '../../components/LabelTag.tsx'
import ScaleBar from '../../components/ScaleBar.tsx'
import { clockAt, sceneAt, sceneStyle } from '../../lib/scene.ts'
import { placeStyle, project } from '../map/geometry.ts'
import { illustrations } from '../map/illustrations.ts'
import MapBase from '../map/MapBase.tsx'
import PinLabel from '../map/PinLabel.tsx'
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

interface JourneyProps {
  event: EventConfig
  journey: JourneyConfig
}

/**
 * The home journey. Native scrolling drives one progress value from 0 to 1. The camera, the ferry, the walker,
 * the dashed route and the pins all read that value. The opening is a wide view of the whole map, and the camera
 * holds still between moves so every beat can be read. With reduced motion the stage shows the finished scene.
 */
export default function Journey({ event, journey }: JourneyProps) {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [stageRef, size] = useSize<HTMLDivElement>()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const [scrolled, setScrolled] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setScrolled(Math.min(1, Math.max(0, v))))
  const p = reduced ? 1 : scrolled

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

  const svgExtra = (
    <>
      {legs.map(({ leg, m, lt }) => (
        <g key={leg.id}>
          {/* A faint preview of the whole route, so the opening shows where the trip goes. */}
          <path
            d={leg.pathD}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="1 9"
            vectorEffect="non-scaling-stroke"
            opacity={0.35}
          />
          <mask id={`reveal-${leg.id}`} maskUnits="userSpaceOnUse" x={vb[0]} y={vb[1]} width={vb[2]} height={vb[3]}>
            <path
              d={leg.pathD}
              fill="none"
              stroke="#fff"
              strokeWidth={16}
              strokeLinecap="round"
              strokeDasharray={m.length}
              strokeDashoffset={m.length * (1 - lt)}
            />
          </mask>
          <path
            d={leg.pathD}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="1 9"
            vectorEffect="non-scaling-stroke"
            mask={`url(#reveal-${leg.id})`}
          />
        </g>
      ))}
    </>
  )

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
        <div
          id="journey-end"
          tabIndex={-1}
          className="absolute left-0 h-px w-px"
          style={{ top: reduced ? '0' : 'calc(100% - 100svh + 6rem)' }}
        />

        <div
          ref={stageRef}
          className={`${reduced ? 'relative h-svh' : 'sticky top-0 h-svh'} overflow-hidden`}
          style={{ ...sceneStyle(scene), background: 'var(--scene-sky)' }}
        >
          <MapBase map={event.map} win={win} hide={journey.hide} svgExtra={svgExtra}>
            {legs.map(({ leg, pos }) => {
              const art = illustrations[leg.vehicle]
              if (!art) return null
              const w = art.width * leg.scale
              const h = art.height * leg.scale
              const isFerry = leg.vehicle === 'landmark-ferry'
              const bob = reduced || !isFerry ? 0 : Math.sin(p * 90) * 1.5
              return (
                <div
                  key={`v-${leg.id}`}
                  className="illo absolute"
                  style={{
                    ...placeStyle(win, pos.x, pos.y, w, h),
                    opacity: !isFerry && p < leg.from ? 0 : 1,
                    transform: `translateY(${bob}px)`,
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
          </MapBase>

          <div className="pointer-events-none absolute top-20 left-4 sm:top-6 sm:left-8">
            <p className="inline-block -rotate-2 rounded-panel border-hair border-accent bg-paper px-5 py-2 font-display text-h2 font-extrabold">
              {event.copy.journeyTitle}
            </p>
          </div>

          <div className="absolute inset-x-4 bottom-4 sm:inset-x-8 sm:bottom-8">
            <div className="grid gap-4 md:grid-cols-[minmax(0,28rem)_1fr] md:items-end">
              <div className="relative min-h-44">
                {journey.chapters.map((c) => {
                  const on = c === active
                  return (
                    <div
                      key={c.title}
                      inert={!on}
                      className={`absolute inset-x-0 bottom-0 rounded-panel bg-paper p-5 transition-opacity duration-standard ease-standard sm:p-6 ${
                        on ? 'opacity-100' : 'opacity-0'
                      }`}
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
              <div className="space-y-2">
                {!reduced && p < 0.05 && <LabelTag variant="flag">Scroll slowly to follow the ferry</LabelTag>}
                <p className="font-hand text-label font-semibold" aria-hidden="true">
                  <span className="rounded-pill bg-paper px-3">{clock}</span>
                </p>
                <ScaleBar progress={p} start={journey.scale.start} end={journey.scale.end} />
              </div>
            </div>
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
