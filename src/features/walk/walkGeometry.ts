import { measurePath } from '../journey/pathMeasure.ts'

export interface Pt {
  x: number
  y: number
}

/** A smooth curve through the points (Catmull-Rom converted to cubic segments). */
export function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return ''
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

export interface Sample extends Pt {
  /** Fraction of the path length, 0 to 1. */
  f: number
}

export function sampleCurve(d: string, n = 240): Sample[] {
  const m = measurePath(d)
  const out: Sample[] = []
  for (let i = 0; i <= n; i++) {
    const f = i / n
    out.push({ ...m.at(f), f })
  }
  return out
}

/** The sample whose y is closest to the given y. The path runs down the page, so y is a good stand-in for progress. */
export function nearestByY(samples: Sample[], y: number): Sample {
  let best = samples[0]
  let bd = Infinity
  for (const s of samples) {
    const dd = Math.abs(s.y - y)
    if (dd < bd) {
      bd = dd
      best = s
    }
  }
  return best
}
