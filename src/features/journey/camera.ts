import type { JourneyCamera } from '../../data/events/types.ts'
import type { ViewBox, Win } from '../map/geometry.ts'

const smooth = (t: number) => t * t * (3 - 2 * t)

/** Interpolates the camera keyframes with a smooth step between neighbours. */
export function cameraAt(keys: JourneyCamera[], p: number): JourneyCamera {
  if (p <= keys[0].p) return keys[0]
  const last = keys[keys.length - 1]
  if (p >= last.p) return last
  const i = keys.findIndex((k) => k.p > p)
  const a = keys[i - 1]
  const b = keys[i]
  const t = smooth((p - a.p) / (b.p - a.p))
  return { p, cx: a.cx + (b.cx - a.cx) * t, cy: a.cy + (b.cy - a.cy) * t, zoom: a.zoom + (b.zoom - a.zoom) * t }
}

/**
 * The visible window for a stage of the given aspect ratio (width over height).
 * The window always has the stage's aspect. Tall phone stages zoom out so they see more than a thin slice;
 * the water behind the map extends past its edges, so a window taller than the map still looks right.
 */
export function windowFor(cam: JourneyCamera, vb: ViewBox, aspect: number): Win {
  const [x, y, W, H] = vb
  const base = vb[2] / vb[3]
  const narrow = Math.min(1, aspect / base) ** 0.5
  const floor = aspect > base ? (aspect * H) / W : 0.6
  const zoom = Math.max(cam.zoom * narrow, floor)
  const h = H / zoom
  const w = h * aspect
  // Keep the whole window over the map when it is smaller, and the whole map inside the window when it is larger.
  const clamp = (v: number, a: number, b: number) => Math.min(Math.max(a, b), Math.max(Math.min(a, b), v))
  const cx = clamp(cam.cx, x + w / 2, x + W - w / 2)
  const cy = clamp(cam.cy, y + h / 2, y + H - h / 2)
  return { x: cx - w / 2, y: cy - h / 2, w, h }
}

export const progressIn = (p: number, from: number, to: number) => Math.min(1, Math.max(0, (p - from) / (to - from)))
