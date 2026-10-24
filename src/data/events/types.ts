import type { SceneKeyframe } from '../../lib/scene.ts'

export type { SceneKeyframe }

export type EventKind = 'wedding' | 'popup'

/**
 * The replication point. A new event is a new file that satisfies this type.
 * Fields marked "step 3 addition" are optional extras that are not in the brief yet (Proposed).
 */
export interface EventConfig {
  id: string
  kind: EventKind
  title: string
  tagline: string
  timezone: string // IANA, used for the countdown and the scrubber
  dates: { start: string; end: string } // ISO 8601
  locale: { currency: 'USD' | 'GBP' | 'EUR'; hour12: boolean; language: 'en-US' | 'en-GB' }
  /** Step 3 addition: the visible clock range the scrubber maps t onto, in minutes after midnight. */
  clock: { startMin: number; endMin: number }
  map: MapConfig
  /** Step 4 addition: the scroll journey on the home page. */
  journey?: JourneyConfig
  scene: SceneKeyframe[]
  zones: Zone[]
  pins: Pin[]
  routes: Route[]
  layers: Layer[]
  schedule: ScheduleItem[]
  people?: Person[]
  passport: PassportConfig
  pass: PassConfig
  faq: { q: string; a: string }[]
  copy: Record<string, string>
}

export interface MapConfig {
  viewBox: [number, number, number, number]
  landPath: string
  waterPaths: string[]
  parkPaths: string[]
  roadPaths: string[]
  /** Step 3 addition: small wave marks drawn on open water, as [x, y] in viewBox units. */
  waves?: [number, number][]
  /**
   * x and y are the ground point (bottom centre) in viewBox units.
   * scale multiplies the illustration's own viewBox width, so 1 draws it at its natural size in map units.
   */
  placements: { illustrationId: string; x: number; y: number; scale: number; zoneId?: string }[]
}

export interface Zone {
  id: string
  name: string
  center: [number, number]
  blurb: string
}

export interface Pin {
  id: string
  zoneId: string
  x: number
  y: number
  title: string
  kind: string
  layerIds: string[]
  summary: string
  details?: string
  activeHours?: { start: string; end: string } // HH:mm
  /** Step 3 addition: which side of the pin its label sits on. Default 'right'. */
  labelSide?: 'left' | 'right' | 'above' | 'below'
}

export interface Route {
  id: string
  name: string
  mode: 'walk' | 'ferry' | 'shuttle' | 'bike' | 'courier'
  pathD: string
  stops: string[] // pin ids, in order
  durationMin: number
  accessible: boolean
  /** Step 3 addition: one plain sentence shown with the route steps. */
  note?: string
}

export interface Layer {
  id: string
  label: string
  pinKinds: string[]
}

export interface ScheduleItem {
  id: string
  title: string
  start: string // ISO
  end: string // ISO
  pinId: string
  type: string
  description: string
  requiresRsvp?: boolean
}

export interface Person {
  id: string
  name: string
  role: string
  front: string
  back: string
}

export interface PassportConfig {
  stamps: { pinId: string; label: string; unlock?: string }[]
  completionReward: { title: string; body: string }
}

export interface PassConfig {
  fields: { id: string; label: string; type: 'text' | 'number' | 'select' | 'textarea'; options?: string[]; required?: boolean }[]
}

export interface JourneyCamera {
  p: number // scroll progress, 0 to 1
  cx: number
  cy: number
  zoom: number
}

export interface JourneyConfig {
  /** Total scroll height of the journey, in viewport heights. */
  scrollVh: number
  /** Illustration ids drawn by the journey itself, so the static map leaves them out. */
  hide: string[]
  /** Each leg is a path with a vehicle that travels it between two scroll positions. */
  legs: { id: string; pathD: string; vehicle: string; scale: number; from: number; to: number }[]
  camera: JourneyCamera[]
  /** Pins that pop in once the journey has passed them. */
  stops: { pinId: string; at: number }[]
  chapters: { from: number; to: number; title: string; body: string; final?: boolean }[]
  /** Labels for the scale bar that doubles as scroll progress. */
  scale: { start: string; end: string }
}
