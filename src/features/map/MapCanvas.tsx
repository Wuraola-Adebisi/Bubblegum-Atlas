import { useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import type { MapConfig, Pin as PinData, Route } from '../../data/events/types.ts'
import LabelTag from '../../components/LabelTag.tsx'
import LeaderLine from '../../components/LeaderLine.tsx'
import { MAX_ZOOM, clampView, project, resetView, windowOf } from './geometry.ts'
import type { View } from './geometry.ts'
import { illustrations } from './illustrations.ts'
import Pin from './Pin.tsx'

interface MapCanvasProps {
  map: MapConfig
  pins: PinData[]
  route: Route | null
  selectedId: string | null
  onSelect: (id: string | null) => void
  label: string
  sceneStyle: CSSProperties
}

type Dir = 'left' | 'right' | 'up' | 'down'

const labelOffset = {
  right: { dx: 44, dy: -26, move: 'translate(0, -50%)' },
  left: { dx: -44, dy: -26, move: 'translate(-100%, -50%)' },
  below: { dx: 0, dy: 48, move: 'translate(-50%, 0)' },
  above: { dx: 0, dy: -48, move: 'translate(-50%, -100%)' },
} as const

const zoomStep = 1.5

const ctrl =
  'grid size-11 cursor-pointer place-items-center rounded-pill border-hair border-accent bg-paper text-accent transition duration-micro ease-standard hover:bg-accent hover:text-paper disabled:cursor-not-allowed disabled:border-dashed disabled:opacity-60 disabled:hover:bg-paper disabled:hover:text-accent'

function Chevron({ dir }: { dir: Dir }) {
  const rot = { up: 0, right: 90, down: 180, left: 270 }[dir]
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M4 11 L9 6 L14 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function MapCanvas({ map, pins, route, selectedId, onSelect, label, sceneStyle }: MapCanvasProps) {
  const vb = map.viewBox
  const [view, setView] = useState<View>(() => resetView(vb))
  const [dragging, setDragging] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const refs = useRef(new Map<string, HTMLButtonElement>())
  const drag = useRef<{ x: number; y: number; cx: number; cy: number } | null>(null)

  const win = windowOf(view, vb)
  const zoomed = view.zoom > 1

  const zoomBy = (f: number) => setView((v) => clampView({ ...v, zoom: v.zoom * f }, vb))
  const panBy = (fx: number, fy: number) =>
    setView((v) => {
      const w = windowOf(v, vb)
      return clampView({ ...v, cx: v.cx + fx * w.w, cy: v.cy + fy * w.h }, vb)
    })

  // Keep a focused pin on screen. Keyboard users should never lose the pin they are on.
  const reveal = (pin: PinData) =>
    setView((v) => {
      const p = project(pin.x, pin.y, windowOf(v, vb))
      if (p.left > 10 && p.left < 90 && p.top > 10 && p.top < 90) return v
      return clampView({ ...v, cx: pin.x, cy: pin.y }, vb)
    })

  const neighbour = (from: PinData, dir: Dir) => {
    let best: PinData | null = null
    let bestScore = Infinity
    for (const p of pins) {
      if (p.id === from.id) continue
      const dx = p.x - from.x
      const dy = p.y - from.y
      const along = dir === 'right' ? dx : dir === 'left' ? -dx : dir === 'down' ? dy : -dy
      const across = dir === 'left' || dir === 'right' ? Math.abs(dy) : Math.abs(dx)
      if (along <= 0) continue
      const score = along + 2 * across
      if (score < bestScore) {
        best = p
        bestScore = score
      }
    }
    return best
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const k = e.key
    const dirs: Record<string, Dir> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }
    if (k === 'Escape') {
      onSelect(null)
    } else if (k === '+' || k === '=') {
      zoomBy(zoomStep)
    } else if (k === '-' || k === '_') {
      zoomBy(1 / zoomStep)
    } else if (k === '0') {
      setView(resetView(vb))
    } else if (dirs[k]) {
      const dir = dirs[k]
      if (e.shiftKey) {
        panBy(dir === 'left' ? -0.2 : dir === 'right' ? 0.2 : 0, dir === 'up' ? -0.2 : dir === 'down' ? 0.2 : 0)
      } else {
        const id = (e.target as HTMLElement).closest<HTMLElement>('[data-pin-id]')?.dataset.pinId
        const from = pins.find((p) => p.id === id)
        const next = from && neighbour(from, dir)
        if (!next) return
        refs.current.get(next.id)?.focus()
      }
    } else {
      return
    }
    e.preventDefault()
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!zoomed || (e.target as HTMLElement).closest('button')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy }
    setDragging(true)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const box = boxRef.current
    if (!d || !box) return
    const r = box.getBoundingClientRect()
    const cx = d.cx - ((e.clientX - d.x) / r.width) * win.w
    const cy = d.cy - ((e.clientY - d.y) / r.height) * win.h
    setView((v) => clampView({ ...v, cx, cy }, vb))
  }
  const endDrag = () => {
    drag.current = null
    setDragging(false)
  }

  const registerRef = (id: string, el: HTMLButtonElement | null) => {
    if (el) refs.current.set(id, el)
    else refs.current.delete(id)
  }

  const placements = [...map.placements].sort((a, b) => a.y - b.y)

  return (
    <div className="@container" style={sceneStyle}>
      <div
        role="group"
        aria-roledescription="map"
        aria-label={label}
        aria-describedby="map-keys"
        onKeyDown={onKeyDown}
        className="rounded-panel p-3 sm:p-4"
        style={{ background: 'var(--scene-sky)' }}
      >
        <div
          ref={boxRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="relative overflow-hidden rounded-panel"
          style={{
            aspectRatio: `${vb[2]} / ${vb[3]}`,
            touchAction: zoomed ? 'none' : undefined,
            cursor: zoomed ? (dragging ? 'grabbing' : 'grab') : undefined,
          }}
        >
          <svg
            viewBox={`${win.x} ${win.y} ${win.w} ${win.h}`}
            className="absolute inset-0 block h-full w-full"
            aria-hidden="true"
          >
            <rect x={vb[0]} y={vb[1]} width={vb[2]} height={vb[3]} fill="var(--scene-water)" />
            <g fill="none" stroke="var(--color-water-deep)" strokeWidth={1.5} strokeLinecap="round">
              {map.waves?.map(([x, y]) => (
                <path key={`${x}-${y}`} d={`M${x} ${y} q24 -14 48 0 t48 0 t48 0`} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
            <path
              d={map.landPath}
              fill="var(--scene-land)"
              stroke="var(--color-accent)"
              strokeWidth={1.5}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            {map.parkPaths.map((d) => (
              <path key={d} d={d} fill="var(--scene-park)" stroke="var(--color-park-deep)" strokeWidth={1} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            ))}
            {map.waterPaths.map((d) => (
              <path key={d} d={d} fill="var(--scene-water)" stroke="var(--color-water-deep)" strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            ))}
            <g fill="none" stroke="var(--color-paper)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              {map.roadPaths.map((d) => (
                <path key={d} d={d} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
            {route && (
              <path
                key={route.id}
                d={route.pathD}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray="1 9"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>

          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {placements.map((p, i) => {
              const art = illustrations[p.illustrationId]
              if (!art) return null
              const w = art.width * p.scale
              const h = art.height * p.scale
              return (
                <div
                  key={`${p.illustrationId}-${i}`}
                  className="illo absolute"
                  style={{
                    left: `${((p.x - w / 2 - win.x) / win.w) * 100}%`,
                    top: `${((p.y - h - win.y) / win.h) * 100}%`,
                    width: `${(w / win.w) * 100}%`,
                  }}
                  dangerouslySetInnerHTML={{ __html: art.svg }}
                />
              )
            })}
          </div>

          <div className="pointer-events-none absolute top-4 left-4 size-9 rounded-pill bg-paper" style={{ opacity: 'var(--scene-halo)' }} aria-hidden="true" />

          <div className="absolute inset-0">
            {pins.map((pin) => {
              const pos = project(pin.x, pin.y, win)
              const selected = pin.id === selectedId
              const side = labelOffset[pin.labelSide ?? 'right']
              return (
                <div
                  key={pin.id}
                  className="absolute"
                  style={{ left: `${pos.left}%`, top: `${pos.top}%`, zIndex: selected ? 20 : 10 }}
                >
                  <div className={selected ? '' : '@max-2xl:hidden'} aria-hidden="true">
                    <LeaderLine dx={side.dx} dy={side.dy} />
                    <div className="absolute top-0 left-0" style={{ transform: `translate(${side.dx}px, ${side.dy}px) ${side.move}` }}>
                      <LabelTag variant={selected ? 'flag' : 'pill'}>{pin.title}</LabelTag>
                    </div>
                  </div>
                  <Pin pin={pin} selected={selected} onSelect={onSelect} onFocusPin={reveal} registerRef={registerRef} />
                </div>
              )
            })}
          </div>

          <div className="absolute right-3 bottom-3 flex flex-col items-end gap-2">
            {zoomed && (
              <div className="grid grid-cols-3 gap-1" role="group" aria-label="Pan the map">
                <span />
                <button type="button" className={ctrl} aria-label="Pan up" onClick={() => panBy(0, -0.2)}>
                  <Chevron dir="up" />
                </button>
                <span />
                <button type="button" className={ctrl} aria-label="Pan left" onClick={() => panBy(-0.2, 0)}>
                  <Chevron dir="left" />
                </button>
                <button type="button" className={ctrl} aria-label="Pan down" onClick={() => panBy(0, 0.2)}>
                  <Chevron dir="down" />
                </button>
                <button type="button" className={ctrl} aria-label="Pan right" onClick={() => panBy(0.2, 0)}>
                  <Chevron dir="right" />
                </button>
              </div>
            )}
            <div className="flex gap-2" role="group" aria-label="Zoom">
              <button type="button" className={ctrl} aria-label="Reset view" disabled={!zoomed} onClick={() => setView(resetView(vb))}>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M3 9 a6 6 0 1 1 2 4.5 M3 14 V9.5 H7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" className={ctrl} aria-label="Zoom out" disabled={!zoomed} onClick={() => zoomBy(1 / zoomStep)}>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M4 9 H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button type="button" className={ctrl} aria-label="Zoom in" disabled={view.zoom >= MAX_ZOOM} onClick={() => zoomBy(zoomStep)}>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M4 9 H14 M9 4 V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <p id="map-keys" className="mt-3 max-w-measure text-small">
        Keys: arrow keys move between places, Enter opens details, Shift with arrows pans, plus and minus zoom, Escape closes details.
      </p>
    </div>
  )
}
