import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { EventConfig, WalkConfig } from '../../data/events/types.ts'
import { sceneAt, sceneGlowVars } from '../../lib/scene.ts'
import AvatarPicker from './AvatarPicker.tsx'
import Station from './Station.tsx'
import { smoothPath, sampleCurve } from './walkGeometry.ts'
import type { Pt } from './walkGeometry.ts'
import { usePassport } from './usePassport.ts'
import { useAvatar } from './useAvatar.ts'
import WalkTrail from './WalkTrail.tsx'
import type { Geo } from './WalkTrail.tsx'

interface WalkProps {
  event: EventConfig
  walk: WalkConfig
}

/**
 * The home page below the journey, as an unwinding map. Each station is a place on the estate with its own text.
 * A dotted path links the stations and a guest walks it as you scroll, collecting story stamps on the way.
 */
export default function Walk({ event, walk }: WalkProps) {
  const containerRef = useRef<HTMLElement>(null)
  const arts = useRef<(HTMLDivElement | null)[]>([])
  const cards = useRef<(HTMLDivElement | null)[]>([])
  const intro = useRef<HTMLDivElement>(null)
  const [geo, setGeo] = useState<Geo | null>(null)
  const [avatar, setAvatar] = useAvatar()
  const passport = usePassport(event)
  const [inside, setInside] = useState(false)

  const stampsByStation = useMemo(
    () => walk.stations.map((s) => s.pinIds.filter((id) => event.passport.stamps.some((st) => st.pinId === id))),
    [walk, event.passport.stamps],
  )

  useLayoutEffect(() => {
    const c = containerRef.current
    if (!c) return
    const measure = () => {
      const cr = c.getBoundingClientRect()
      const rel = (el: HTMLElement) => {
        const r = el.getBoundingClientRect()
        return { left: r.left - cr.left, top: r.top - cr.top, width: r.width, height: r.height }
      }
      const desktop = window.matchMedia('(min-width: 64rem)').matches
      const w = cr.width
      const h = cr.height
      const anchors: Pt[] = []
      const route: Pt[] = []
      const leaders: Geo['leaders'] = []
      const lawns: Geo['lawns'] = []
      walk.stations.forEach((st, i) => {
        const a = arts.current[i]
        const k = cards.current[i]
        if (!a || !k) return
        const ar = rel(a)
        const kr = rel(k)
        const x = desktop ? ar.left + ar.width / 2 : w / 2 + (i % 2 ? 1 : -1) * 0.14 * w
        anchors.push({ x, y: ar.top + ar.height * 0.94 })
        // Hug the art column for the whole station, so the walk only crosses the page in the gaps between stations.
        route.push({ x, y: ar.top + ar.height * 0.3 }, { x, y: ar.top + ar.height * 0.94 })
        if (st.lawn) lawns.push({ cx: ar.left + ar.width / 2, cy: ar.top + ar.height * 0.66, rx: ar.width * 0.46, ry: ar.height * 0.34 })
        const main = st.art[0]
        const tx = ar.left + (ar.width * main.x) / 100
        const ty = ar.top + (ar.height * (main.y - 18)) / 100
        if (desktop) {
          const cardLeft = kr.left < ar.left
          leaders.push({ x1: cardLeft ? kr.left + kr.width : kr.left, y1: kr.top + kr.height / 2, x2: tx, y2: ty })
        } else {
          leaders.push({ x1: kr.left + kr.width / 2, y1: kr.top, x2: tx, y2: ty })
        }
      })
      if (anchors.length !== walk.stations.length) return
      // On narrow screens the intro panel spans the page, so the walk starts below it. On desktop the panel sits on the far side from the path.
      const startY = !desktop && intro.current ? rel(intro.current).top + intro.current.offsetHeight + 16 : 24
      const pts: Pt[] = [{ x: anchors[0].x, y: startY }, ...route, { x: anchors[anchors.length - 1].x, y: h - 24 }]
      const d = smoothPath(pts)
      const samples = sampleCurve(d)
      const thresholds = anchors.map((a) => {
        let best = samples[0]
        for (const s of samples) if (Math.abs(s.y - a.y) < Math.abs(best.y - a.y)) best = s
        return best.f
      })
      setGeo({ w, h, desktop, d, samples, thresholds, leaders, lawns })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(c)
    void document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [walk])

  const first = sceneGlowVars(sceneAt(0.3, event.scene))

  return (
    <section
      ref={containerRef}
      aria-labelledby="walk-heading"
      className="relative isolate overflow-hidden"
      style={first}
    >
      {geo && (
        <WalkTrail
          geo={geo}
          event={event}
          containerRef={containerRef}
          avatar={avatar}
          stampsByStation={stampsByStation}
          onCollect={passport.collect}
          onFocusInside={setInside}
        />
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="pt-16 sm:pt-24">
          <div ref={intro} className="relative z-20 max-w-3xl rounded-panel bg-paper p-5 sm:p-8 lg:ml-auto lg:max-w-xl">
            <h2 id="walk-heading" className="font-display text-h1 font-extrabold">
              {walk.intro.title}
            </h2>
            <p className="mt-3 max-w-measure text-body">{walk.intro.body}</p>
            <div className="mt-6">
              <AvatarPicker choice={avatar} onChange={setAvatar} />
            </div>
          </div>
        </div>
        {walk.stations.map((st, i) => (
          <Station
            key={st.id}
            event={event}
            station={st}
            artRight={i % 2 === 1}
            artRef={(el) => {
              arts.current[i] = el
            }}
            cardRef={(el) => {
              cards.current[i] = el
            }}
          />
        ))}
        <div className="h-16 sm:h-24" />
      </div>

      <div aria-live="polite" className="pointer-events-none fixed bottom-20 left-4 z-40 sm:bottom-4 print:hidden">
        {passport.landed && inside && (
          <p className="rounded-pill border-hair border-accent bg-paper px-5 py-2 font-medium text-accent">
            Stamp collected: {event.passport.stamps.find((s) => s.pinId === passport.landed)?.label}
          </p>
        )}
      </div>
      {inside && (
        <a
          href="#/story"
          className="fixed right-4 bottom-4 z-40 inline-flex min-h-11 items-center rounded-pill border-hair border-accent bg-paper px-5 py-2 font-medium text-accent transition duration-micro ease-standard hover:bg-accent hover:text-paper print:hidden"
        >
          Passport: {passport.got.length} of {passport.total} stamps
        </a>
      )}
    </section>
  )
}
