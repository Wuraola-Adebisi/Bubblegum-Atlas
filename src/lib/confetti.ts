// Confetti on one fixed canvas that exists only while pieces are in the air. It does nothing when the guest prefers reduced motion.

interface Piece {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  w: number
  h: number
  c: string
  age: number
  max: number
  round: boolean
}

let canvas: HTMLCanvasElement | null = null
let g: CanvasRenderingContext2D | null = null
let pieces: Piece[] = []
let raf = 0
let last = 0
let colors: string[] = []

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function palette(): string[] {
  const css = getComputedStyle(document.documentElement)
  const names = ['--color-land-strong', '--color-water-deep', '--color-glow', '--color-park', '--color-flag', '--color-paper', '--color-accent']
  return names.map((n, i) => css.getPropertyValue(n).trim() || ['#FF8FB8', '#6F8FDB', '#FFE08A', '#A8DEC3', '#FF9B54', '#FFFFFF', '#B0306B'][i])
}

function ensure(): boolean {
  if (canvas && g) return true
  const el = document.createElement('canvas')
  el.setAttribute('aria-hidden', 'true')
  el.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:70'
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  el.width = window.innerWidth * dpr
  el.height = window.innerHeight * dpr
  const ctx = el.getContext('2d')
  if (!ctx) return false
  ctx.scale(dpr, dpr)
  document.body.appendChild(el)
  canvas = el
  g = ctx
  colors = palette()
  return true
}

function frame(now: number) {
  if (!canvas || !g) return
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  const w = window.innerWidth
  const h = window.innerHeight
  g.clearRect(0, 0, w, h)
  for (let i = pieces.length - 1; i >= 0; i--) {
    const p = pieces[i]
    p.age += dt
    if (p.age > p.max || p.y > h + 24) {
      pieces.splice(i, 1)
      continue
    }
    p.vx *= 1 - 1.5 * dt
    p.vy = Math.min(p.vy + 560 * dt, 230)
    p.x += p.vx * dt + Math.sin(p.age * 7 + p.rot) * 0.5
    p.y += p.vy * dt
    p.rot += p.vr * dt
    const fade = p.age > p.max - 0.6 ? Math.max(0, (p.max - p.age) / 0.6) : 1
    g.save()
    g.globalAlpha = fade
    g.translate(p.x, p.y)
    g.rotate(p.rot)
    g.scale(1, Math.abs(Math.cos(p.age * 6 + p.rot)) * 0.8 + 0.2)
    g.fillStyle = p.c
    if (p.round) {
      g.beginPath()
      g.arc(0, 0, p.w / 2, 0, Math.PI * 2)
      g.fill()
    } else g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
    g.restore()
  }
  if (pieces.length) raf = requestAnimationFrame(frame)
  else stop()
}

function stop() {
  cancelAnimationFrame(raf)
  raf = 0
  canvas?.remove()
  canvas = null
  g = null
}

interface BurstOptions {
  count?: number
  /** Direction in radians. -PI/2 is straight up. */
  angle?: number
  /** Width of the cone in radians. 2 PI is a full circle. */
  spread?: number
  power?: number
}

/** Throw confetti from a point in viewport pixels. */
export function confetti(x: number, y: number, { count = 60, angle = -Math.PI / 2, spread = Math.PI * 2, power = 1 }: BurstOptions = {}) {
  if (reduced() || !ensure()) return
  for (let i = 0; i < count; i++) {
    const a = angle + (Math.random() - 0.5) * spread
    const v = (180 + Math.random() * 520) * power
    const round = Math.random() < 0.25
    pieces.push({
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 14,
      w: round ? 6 + Math.random() * 4 : 7 + Math.random() * 7,
      h: round ? 0 : 4 + Math.random() * 5,
      c: colors[(Math.random() * colors.length) | 0],
      age: 0,
      max: 2.6 + Math.random() * 1.8,
      round,
    })
  }
  if (pieces.length > 420) pieces = pieces.slice(-420)
  if (!raf) {
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
}

/** Two cannons from the bottom corners and a burst from the top middle. */
export function confettiCannons() {
  const w = window.innerWidth
  const h = window.innerHeight
  confetti(w * 0.04, h * 0.96, { count: 70, angle: -Math.PI / 2 + 0.55, spread: 0.7, power: 1.5 })
  confetti(w * 0.96, h * 0.96, { count: 70, angle: -Math.PI / 2 - 0.55, spread: 0.7, power: 1.5 })
  confetti(w * 0.5, h * 0.18, { count: 50, angle: Math.PI / 2, spread: Math.PI * 1.4, power: 0.7 })
}
