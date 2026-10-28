import type { EventConfig } from '../../data/events/types.ts'
import type { TimedItem } from './dayData.ts'

/** Minutes the guest takes to walk between two places. They leave this long before the next thing starts. */
const WALK_MIN = 8

export interface DayStop {
  pinId: string
  /** Minute the guest gets there. */
  arrive: number
  /** Minute the guest sets off for the next stop. */
  leave: number
}

export interface DayPath {
  stops: DayStop[]
  /** Map points of the stops, in order. */
  points: { x: number; y: number }[]
  /** Straight legs through the stops, as an SVG path. */
  d: string
  /** Path fraction (0 to 1) at each stop. */
  fractions: number[]
  total: number
}

/** The ferry runs of the day: the travel items that leave from the ferry's first jetty. */
export function ferryRuns(event: EventConfig, items: TimedItem[]): TimedItem[] {
  const ferry = event.routes.find((r) => r.mode === 'ferry')
  if (!ferry) return []
  return items.filter((i) => i.type === 'travel' && i.pinId === ferry.stops[0])
}

/** Which ferry the guest rides when nothing says otherwise: the middle one. */
export function defaultFerry(runs: TimedItem[]): TimedItem | undefined {
  return runs[Math.floor(runs.length / 2)]
}

/**
 * The guest's day as a line through the places they visit. Only the ferry they chose is used,
 * and the crossing adds a stop where the ferry lands.
 */
export function buildDayPath(event: EventConfig, items: TimedItem[], ferryStart: number | null): DayPath | null {
  const ferry = event.routes.find((r) => r.mode === 'ferry')
  const runs = ferryRuns(event, items)
  const chosen = runs.find((r) => r.startMin === ferryStart) ?? defaultFerry(runs)

  type Raw = { pinId: string; arrive: number; end: number; leave?: number }
  const raw: Raw[] = []
  for (const it of items) {
    if (runs.includes(it) && it !== chosen) continue
    if (ferry && it === chosen) {
      raw.push({ pinId: it.pinId, arrive: it.startMin, end: it.startMin, leave: it.startMin })
      raw.push({ pinId: ferry.stops[ferry.stops.length - 1], arrive: it.endMin, end: it.endMin })
      continue
    }
    raw.push({ pinId: it.pinId, arrive: it.startMin, end: it.endMin })
  }

  const merged: Raw[] = []
  for (const r of raw) {
    const prev = merged[merged.length - 1]
    if (prev && prev.pinId === r.pinId) {
      prev.end = Math.max(prev.end, r.end)
      if (r.leave !== undefined) prev.leave = r.leave
    } else merged.push({ ...r })
  }

  const known = merged.filter((r) => event.pins.some((p) => p.id === r.pinId))
  if (known.length < 2) return null

  const stops: DayStop[] = known.map((r, i) => {
    const next = known[i + 1]
    const leave = r.leave ?? (next ? Math.max(r.arrive, next.arrive - WALK_MIN) : Infinity)
    return { pinId: r.pinId, arrive: r.arrive, leave }
  })
  for (let i = 1; i < stops.length; i++) stops[i].arrive = Math.max(stops[i].arrive, stops[i - 1].leave)

  const points = stops.map((s) => {
    const pin = event.pins.find((p) => p.id === s.pinId)!
    return { x: pin.x, y: pin.y }
  })
  const cum = [0]
  for (let i = 1; i < points.length; i++) cum.push(cum[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y))
  const total = cum[cum.length - 1] || 1
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ')
  return { stops, points, d, fractions: cum.map((c) => c / total), total }
}

export interface GuestSpot {
  x: number
  y: number
  /** Fraction of the path walked, 0 to 1. */
  f: number
  moving: boolean
  /** The place the guest is at, or the place they are heading to while moving. */
  pinId: string
}

/** Where the guest is at a given minute. */
export function guestAt(path: DayPath, minute: number): GuestSpot {
  const { stops, points, fractions, total } = path
  const pointAt = (f: number) => {
    const dist = f * total
    let acc = 0
    for (let i = 1; i < points.length; i++) {
      const seg = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
      if (dist <= acc + seg || i === points.length - 1) {
        const t = seg ? Math.min(1, (dist - acc) / seg) : 0
        return { x: points[i - 1].x + (points[i].x - points[i - 1].x) * t, y: points[i - 1].y + (points[i].y - points[i - 1].y) * t }
      }
      acc += seg
    }
    return points[0]
  }
  let i = 0
  for (let k = 0; k < stops.length; k++) if (stops[k].arrive <= minute) i = k
  const here = stops[i]
  const next = stops[i + 1]
  if (!next || minute <= here.leave) return { ...points[i], f: fractions[i], moving: false, pinId: here.pinId }
  const t = (minute - here.leave) / Math.max(1, next.arrive - here.leave)
  const f = fractions[i] + t * (fractions[i + 1] - fractions[i])
  return { ...pointAt(f), f, moving: t < 1, pinId: t < 1 ? next.pinId : here.pinId }
}

/** The part of the route already walked, as an SVG path that ends where the guest stands. */
export function walkedPath(path: DayPath, spot: GuestSpot): string {
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i < path.points.length && path.fractions[i] <= spot.f + 1e-9; i++) pts.push(path.points[i])
  const last = pts[pts.length - 1]
  if (!last || last.x !== spot.x || last.y !== spot.y) pts.push({ x: spot.x, y: spot.y })
  return pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
}
