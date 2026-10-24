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
 * The window always has the stage's aspect, so a tall phone gets a narrow slice instead of letterboxing.
 */
export function windowFor(cam: JourneyCamera, vb: ViewBox, aspect: number): Win {
  const [x, y, W, H] = vb
  const zoom = Math.max(cam.zoom, 1, (aspect * H) / W)
  const h = H / zoom
  const w = h * aspect
  const cx = Math.min(x + W - w / 2, Math.max(x + w / 2, cam.cx))
  const cy = Math.min(y + H - h / 2, Math.max(y + h / 2, cam.cy))
  return { x: cx - w / 2, y: cy - h / 2, w, h }
}

export const progressIn = (p: number, from: number, to: number) => Math.min(1, Math.max(0, (p - from) / (to - from)))
