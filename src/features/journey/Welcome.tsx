import { useEffect, useRef } from 'react'
import { illustrations } from '../map/illustrations.ts'

/** Placeholder couple. Skin and hair come from the illustration kit palette. */
const couple = [
  { id: 'avatar-dress', skin: '#94603F', hair: '#2B2118' },
  { id: 'avatar-suit', skin: '#C68A62', hair: '#2B2118' },
]

/** Where each cloud starts (percent of the screen), how big it is, and how far it travels as it parts (viewport units). */
const clouds = [
  { x: -6, y: 58, w: 62, dx: -70, dy: 6, tone: 'paper' },
  { x: 48, y: 60, w: 64, dx: 70, dy: 8, tone: 'wash' },
  { x: 14, y: 78, w: 58, dx: -40, dy: 40, tone: 'paper' },
  { x: 40, y: 80, w: 60, dx: 40, dy: 40, tone: 'paper' },
  { x: -26, y: 22, w: 46, dx: -60, dy: -22, tone: 'wash' },
  { x: 68, y: 16, w: 46, dx: 60, dy: -22, tone: 'paper' },
  { x: 26, y: -16, w: 54, dx: 0, dy: -60, tone: 'paper' },
  { x: -22, y: 40, w: 34, dx: -80, dy: 0, tone: 'sky' },
  { x: 72, y: 38, w: 34, dx: 80, dy: 0, tone: 'sky' },
]

const toneFill: Record<string, string> = { paper: 'var(--color-paper)', wash: 'var(--color-land-wash)', sky: 'var(--color-water-wash)' }

const stars = [
  [8, 14], [22, 8], [38, 18], [60, 10], [78, 16], [92, 9], [12, 40], [88, 38], [30, 52], [70, 50], [50, 6], [95, 60], [5, 62],
]

function Cloud({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 140 80" className="block w-full" aria-hidden="true">
      <path
        d="M22 74 C4 74 2 48 24 45 C24 26 48 20 58 33 C64 12 96 12 102 34 C124 28 140 48 124 62 C122 70 114 74 106 74 Z"
        fill={fill}
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Sparkler sparks. A small canvas draws short fading lines from two points. It stops when the welcome is no longer visible. */
function Sparklers({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !active) return
    const g = canvas.getContext('2d')
    if (!g) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    g.scale(dpr, dpr)
    const css = getComputedStyle(document.documentElement)
    const colors = ['--color-glow', '--color-flag', '--color-paper', '--color-land-strong'].map((n) => css.getPropertyValue(n).trim() || '#ffffff')
    // Each partner holds a sparkler in the hand on the outer side. Positions come from the figures on screen.
    const cr = canvas.getBoundingClientRect()
    const figs = Array.from(canvas.parentElement?.parentElement?.querySelectorAll('.illo') ?? []).map((f) => f.getBoundingClientRect())
    const hands = figs.length === 2
      ? [
          { x: figs[0].left - cr.left + figs[0].width * 0.1, y: figs[0].top - cr.top + figs[0].height * 0.56 },
          { x: figs[1].right - cr.left - figs[1].width * 0.1, y: figs[1].top - cr.top + figs[1].height * 0.56 },
        ]
      : [
          { x: w * 0.25, y: h * 0.66 },
          { x: w * 0.75, y: h * 0.66 },
        ]
    const emitters = hands.map((hd) => ({ x: hd.x, y: hd.y - 26, hx: hd.x, hy: hd.y }))
    const stick = css.getPropertyValue('--color-ink').trim() || '#1f2f6b'
    interface P { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string }
    const ps: P[] = []
    let last = performance.now()
    let raf = 0
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      for (const e of emitters) {
        for (let i = 0; i < 3; i++) {
          const a = Math.random() * Math.PI * 2
          const v = 40 + Math.random() * 110
          ps.push({ x: e.x, y: e.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, life: 0, max: 0.4 + Math.random() * 0.5, c: colors[(Math.random() * colors.length) | 0] })
        }
      }
      g.clearRect(0, 0, w, h)
      g.lineCap = 'round'
      g.globalAlpha = 1
      g.strokeStyle = stick
      g.lineWidth = 2
      for (const e of emitters) {
        g.beginPath()
        g.moveTo(e.hx, e.hy)
        g.lineTo(e.x, e.y)
        g.stroke()
      }
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]
        p.life += dt
        if (p.life >= p.max) {
          ps.splice(i, 1)
          continue
        }
        const px = p.x
        const py = p.y
        p.vy += 140 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        g.globalAlpha = 1 - p.life / p.max
        g.strokeStyle = p.c
        g.lineWidth = 2.4
        g.beginPath()
        g.moveTo(px, py)
        g.lineTo(p.x, p.y)
        g.stroke()
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [active])
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
}

export function Couple({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative flex items-end justify-center gap-2 ${className}`}>
      {couple.map((c) => {
        const art = illustrations[c.id]
        if (!art) return null
        return (
          <div
            key={c.id}
            className="illo w-24 sm:w-32"
            style={{ ['--skin' as string]: c.skin, ['--hair' as string]: c.hair }}
            dangerouslySetInnerHTML={{ __html: art.svg }}
          />
        )
      })}
    </div>
  )
}

interface WelcomeProps {
  /** 0 to 1, how far the text and couple have faded. */
  content: number
  /** 0 to 1, how far the clouds have parted. */
  parted: number
  /** 0 to 1, how far the sky behind has faded to reveal the map. */
  sky: number
  textTop: number
  soundOn: boolean
  onToggleSound: () => void
  onScrollOn: () => void
  dateLine: string
  line: string
  cue: string
}

const btn =
  'inline-flex min-h-11 cursor-pointer items-center rounded-pill border-hair border-accent bg-paper px-6 py-2 font-medium text-accent shadow-press transition duration-micro ease-standard hover:bg-accent hover:text-paper active:translate-y-0.5 active:shadow-press-down'

/**
 * The opening screen. A full-page sky with clouds, sparklers and the couple. It is part of the scroll: the text and couple fade first,
 * then the clouds drift apart and the sky clears to show the map and the ferry journey.
 */
export default function Welcome({ content, parted, sky, textTop, soundOn, onToggleSound, onScrollOn, dateLine, line, cue }: WelcomeProps) {
  if (parted >= 1) return null
  const cloudFade = parted > 0.6 ? 1 - (parted - 0.6) / 0.4 : 1
  return (
    <div className="absolute inset-0 z-30 overflow-hidden" inert={content > 0.95}>
      <div className="absolute inset-0" style={{ background: 'var(--color-water)', opacity: 1 - sky }} aria-hidden="true" />

      <div aria-hidden="true" className="absolute inset-0" style={{ opacity: content > 0.5 ? 1 - content : 1 }}>
        {stars.map(([x, y], i) => (
          <svg key={i} viewBox="0 0 20 20" className="twinkle absolute w-3 sm:w-4" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(i % 5) * 0.4}s` }}>
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="var(--color-paper)" stroke="var(--color-accent)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
        ))}
      </div>

      <div aria-hidden="true" className="absolute inset-0" style={{ opacity: cloudFade }}>
        {clouds.map((c, i) => (
          <div
            key={i}
            className="absolute will-change-transform"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: `${c.w}%`,
              transform: `translate(${c.dx * parted}vw, ${c.dy * parted}vh) scale(${1 + 0.25 * parted})`,
            }}
          >
            <Cloud fill={toneFill[c.tone]} />
          </div>
        ))}
      </div>

      <div className="absolute inset-0" style={{ opacity: 1 - content }}>
        <div className="absolute inset-x-0 mx-auto w-11/12 max-w-xl text-center" style={{ top: textTop }}>
          <p className="font-hand text-label">Welcome to our wedding</p>
          <p className="mt-1 font-display text-h3 font-extrabold">{dateLine}</p>
          <p className="mt-2 text-body">{line}</p>
        </div>

        <div className="absolute inset-x-0 bottom-28 flex justify-center sm:bottom-24">
          <div className="relative">
            <div className="absolute -inset-x-6 -bottom-3 h-10 rounded-pill border-hair border-accent bg-land sm:-inset-x-10" aria-hidden="true" />
            <Couple className="relative" />
            <div className="absolute -inset-x-24 -top-24 bottom-0 sm:-inset-x-32">
              <Sparklers active={parted < 0.2} />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-4 flex flex-wrap items-center justify-center gap-3 px-4">
          <button type="button" onClick={onScrollOn} className={btn}>
            {cue}
            <svg className="cue-bob ml-2" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 6 L8 11 L13 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" onClick={onToggleSound} className={btn}>
            {soundOn ? 'Turn sound off' : 'Turn sound on'}
          </button>
        </div>
      </div>
    </div>
  )
}
