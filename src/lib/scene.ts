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
}

/** Starter keyframes. In the real build these live in each event config. */
export const sceneKeyframes: SceneKeyframe[] = [
  { t: 0, name: 'Morning', moment: 'Getting ready', sky: '#FFF1F5', water: '#DDF0F6', land: '#FFE3EC', park: '#CDEBDC', glow: 0 },
  { t: 0.33, name: 'Midday', moment: 'Guests arrive by ferry', sky: '#F8FCFF', water: '#D3ECF5', land: '#FFE3EC', park: '#BFE6D2', glow: 0 },
  { t: 0.66, name: 'Golden hour', moment: 'Cocktail hour on the lawn', sky: '#FFF0DD', water: '#CBD8EE', land: '#FFD6E1', park: '#BCDCC6', glow: 0.3 },
  { t: 1, name: 'Dusk', moment: 'First dance, lights on', sky: '#E6E0F7', water: '#C9D2F0', land: '#FBD0E1', park: '#A9D6BE', glow: 1 },
]

export interface SceneState {
  sky: string
  water: string
  land: string
  park: string
  glow: number
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
