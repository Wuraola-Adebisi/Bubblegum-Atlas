const NS = 'http://www.w3.org/2000/svg'

export interface Measured {
  length: number
  /** Point on the path at a fraction from 0 to 1. */
  at: (t: number) => { x: number; y: number }
}

const cache = new Map<string, Measured>()

/** Measures an SVG path string with a detached path element, so no rendered node is needed. */
export function measurePath(d: string): Measured {
  const hit = cache.get(d)
  if (hit) return hit
  const el = document.createElementNS(NS, 'path')
  el.setAttribute('d', d)
  const length = el.getTotalLength()
  const m: Measured = {
    length,
    at: (t) => {
      const pt = el.getPointAtLength(Math.min(1, Math.max(0, t)) * length)
      return { x: pt.x, y: pt.y }
    },
  }
  cache.set(d, m)
  return m
}
