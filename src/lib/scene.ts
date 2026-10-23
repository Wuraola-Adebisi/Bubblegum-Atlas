import type { CSSProperties } from 'react'
import { mixHex } from './color.ts'

export interface SceneKeyframe {
  t: number
  name: string
  moment: string
  sky: string
  water: string
  land: string
  park: string
  glow: number
  /** 0 to 1. Soft light bloom around windows and string lights, plus stars and moon. */
  halo: number
}

/** Starter keyframes. In the real build these live in each event config. */
export const sceneKeyframes: SceneKeyframe[] = [
  { t: 0, name: 'Morning', moment: 'Getting ready', sky: '#FFE9EF', water: '#CBE8F2', land: '#FFC9DB', park: '#B6E4CD', glow: 0, halo: 0 },
  { t: 0.3, name: 'Midday', moment: 'Guests arrive by ferry', sky: '#F4FBFF', water: '#BFE4F0', land: '#FFC9DB', park: '#A8DEC3', glow: 0, halo: 0 },
  { t: 0.55, name: 'Golden hour', moment: 'Cocktail hour on the lawn', sky: '#FFE8CC', water: '#B8C9E6', land: '#FFB9C9', park: '#A5D4B4', glow: 0.3, halo: 0 },
  { t: 0.78, name: 'Dusk', moment: 'First dance, lights on', sky: '#D9D3F3', water: '#6F8FDB', land: '#F7A8C8', park: '#7FBF9F', glow: 1, halo: 0.3 },
  { t: 1, name: 'Night', moment: 'Party under the string lights', sky: '#1E2457', water: '#2B3A7E', land: '#D982AE', park: '#3F8F6E', glow: 1, halo: 1 },
]

export interface SceneState {
  sky: string
  water: string
  land: string
  park: string
  glow: number
  halo: number
  name: string
  moment: string
}

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))

/** Interpolates between the two keyframes that surround t (0 to 1). */
export function sceneAt(t: number, frames: SceneKeyframe[] = sceneKeyframes): SceneState {
  const x = clamp(t)
  let i = 0
  while (i < frames.length - 2 && x > frames[i + 1].t) i += 1
  const a = frames[i]
  const b = frames[i + 1]
  const p = clamp((x - a.t) / (b.t - a.t))
  const nearest = Math.abs(x - a.t) <= Math.abs(x - b.t) ? a : b
  return {
    sky: mixHex(a.sky, b.sky, p),
    water: mixHex(a.water, b.water, p),
    land: mixHex(a.land, b.land, p),
    park: mixHex(a.park, b.park, p),
    glow: a.glow + (b.glow - a.glow) * p,
    halo: a.halo + (b.halo - a.halo) * p,
    name: nearest.name,
    moment: nearest.moment,
  }
}

/** CSS variables for the map root. UI chrome never reads these. */
export function sceneStyle(s: SceneState): CSSProperties {
  return {
    '--scene-sky': s.sky,
    '--scene-water': s.water,
    '--scene-land': s.land,
    '--scene-park': s.park,
    '--scene-glow': String(s.glow),
    '--scene-halo': String(s.halo),
  } as CSSProperties
}

/** Maps t to a clock time. Default range is 8:00 am to 11:30 pm (the wedding day). */
export function clockAt(t: number, startMin = 8 * 60, endMin = 23 * 60 + 30): string {
  const total = Math.round(startMin + clamp(t) * (endMin - startMin))
  const h24 = Math.floor(total / 60) % 24
  const m = total % 60
  const suffix = h24 >= 12 ? 'pm' : 'am'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}
