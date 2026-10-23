export type ViewBox = [number, number, number, number]

/** The visible part of the map: a zoom level and the centre of the window in viewBox units. */
export interface View {
  zoom: number
  cx: number
  cy: number
}

export const MIN_ZOOM = 1
export const MAX_ZOOM = 3

export function resetView(vb: ViewBox): View {
  return { zoom: 1, cx: vb[0] + vb[2] / 2, cy: vb[1] + vb[3] / 2 }
}

export function clampView(v: View, vb: ViewBox): View {
  const [x, y, w, h] = vb
  const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom))
  const hw = w / (2 * zoom)
  const hh = h / (2 * zoom)
  return {
    zoom,
    cx: Math.min(x + w - hw, Math.max(x + hw, v.cx)),
    cy: Math.min(y + h - hh, Math.max(y + hh, v.cy)),
  }
}

export interface Win {
  x: number
  y: number
  w: number
  h: number
}

export function windowOf(v: View, vb: ViewBox): Win {
  const w = vb[2] / v.zoom
  const h = vb[3] / v.zoom
  return { x: v.cx - w / 2, y: v.cy - h / 2, w, h }
}

/** Map point to percent of the visible window. */
export function project(px: number, py: number, win: Win) {
  return { left: ((px - win.x) / win.w) * 100, top: ((py - win.y) / win.h) * 100 }
}
