import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { confetti } from '../../lib/confetti.ts'
import { illustrations } from '../map/illustrations.ts'
import { couple } from '../walk/people.ts'

const base = 'var(--color-water-deep)'
const shade = 'color-mix(in srgb, var(--color-water-deep) 84%, var(--color-ink))'
const light = 'color-mix(in srgb, var(--color-water-deep) 62%, white)'

/** One half of the curtain: ten folds, each a base band with a highlight and a shade, and a gold hem. */
function CurtainPanel() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="block size-full" aria-hidden="true">
      <rect width="100" height="100" style={{ fill: base }} />
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i}>
          <rect x={i * 10 + 1.4} width="2.2" height="100" style={{ fill: light }} />
          <rect x={i * 10 + 6.6} width="3.4" height="100" style={{ fill: shade }} />
          <line x1={i * 10} x2={i * 10} y1="0" y2="100" stroke="var(--color-accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" opacity="0.55" />
        </g>
      ))}
      <rect y="93" width="100" height="7" style={{ fill: 'var(--color-glow)' }} />
      <line x1="0" x2="100" y1="93" y2="93" stroke="var(--color-accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/** The scalloped valance across the top. */
function Valance() {
  return (
    <svg viewBox="0 0 100 14" preserveAspectRatio="none" className="block h-full w-full" aria-hidden="true">
      <path d={`M0 0 H100 V8 ${Array.from({ length: 8 }, () => 'a6.25 5 0 0 1 -12.5 0').join(' ')} Z`} style={{ fill: 'var(--color-accent)' }} stroke="var(--color-accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <path d={`M0 6 H100`} stroke="var(--color-glow)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" opacity="0.9" />
    </svg>
  )
}

/**
 * Sparklers in the couple's outer hands. A small canvas draws bright streaks, glints and a warm glow with additive blending,
 * and fades the previous frame so each spark leaves a short trail. It stops when the stage is no longer visible.
 */
function Sparklers({ active, figsRef }: { active: boolean; figsRef: RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !active) return
    const g = canvas.getContext('2d')
    if (!g) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let tips: { x: number; y: number; hx: number; hy: number }[] = []
    const measure = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cr = canvas.getBoundingClientRect()
      const figs = Array.from(figsRef.current?.querySelectorAll('.illo') ?? []).map((f) => f.getBoundingClientRect())
      const figH = figs[0]?.height ?? 240
      const dx = figH * 0.38
      const dy = figH * 0.32
      const hands =
        figs.length === 2
          ? [
              { x: figs[0].left - cr.left + figs[0].width * 0.1, y: figs[0].top - cr.top + figs[0].height * 0.5, d: -1 },
              { x: figs[1].right - cr.left - figs[1].width * 0.1, y: figs[1].top - cr.top + figs[1].height * 0.5, d: 1 },
            ]
          : [
              { x: w * 0.3, y: h * 0.7, d: -1 },
              { x: w * 0.7, y: h * 0.7, d: 1 },
            ]
      tips = hands.map((hd) => ({ x: Math.min(w - 26, Math.max(26, hd.x + hd.d * dx)), y: Math.max(26, hd.y - dy), hx: hd.x, hy: hd.y }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(canvas)
    const css = getComputedStyle(document.documentElement)
    const tok = (n: string, f: string) => css.getPropertyValue(n).trim() || f
    const hot = ['#FFFFFF', tok('--color-glow', '#FFE08A'), tok('--color-glow', '#FFE08A'), tok('--color-land-strong', '#FF8FB8'), tok('--color-flag', '#FF9B54')]
    const glow = tok('--color-glow', '#FFE08A')
    interface Spark { x: number; y: number; px: number; py: number; vx: number; vy: number; life: number; max: number; c: string; lw: number }
    interface Glint { x: number; y: number; life: number; max: number; s: number }
    const sparks: Spark[] = []
    const glints: Glint[] = []
    let last = performance.now()
    let raf = 0
    const star = (x: number, y: number, s: number) => {
      g.beginPath()
      g.moveTo(x, y - s)
      g.lineTo(x + s * 0.2, y - s * 0.2)
      g.lineTo(x + s, y)
      g.lineTo(x + s * 0.2, y + s * 0.2)
      g.lineTo(x, y + s)
      g.lineTo(x - s * 0.2, y + s * 0.2)
      g.lineTo(x - s, y)
      g.lineTo(x - s * 0.2, y - s * 0.2)
      g.closePath()
      g.fill()
    }
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      g.globalCompositeOperation = 'destination-out'
      g.fillStyle = 'rgba(0,0,0,0.3)'
      g.fillRect(0, 0, w, h)
      g.globalCompositeOperation = 'source-over'
      g.lineCap = 'round'
      for (const t of tips) {
        g.strokeStyle = 'rgba(31,47,107,0.85)'
        g.lineWidth = 2.5
        g.beginPath()
        g.moveTo(t.hx, t.hy)
        g.lineTo(t.x, t.y)
        g.stroke()
        if (!still) {
          for (let i = 0; i < 7 && sparks.length < 380; i++) {
            const a = Math.random() * Math.PI * 2
            const v = 60 + Math.random() * 240
            sparks.push({ x: t.x, y: t.y, px: t.x, py: t.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life: 0, max: 0.35 + Math.random() * 0.65, c: hot[(Math.random() * hot.length) | 0], lw: 1.4 + Math.random() * 2 })
          }
          if (Math.random() < 0.22 && glints.length < 24) glints.push({ x: t.x + (Math.random() - 0.5) * 70, y: t.y + (Math.random() - 0.5) * 70, life: 0, max: 0.25 + Math.random() * 0.25, s: 6 + Math.random() * 9 })
        }
      }
      g.globalCompositeOperation = 'lighter'
      for (const t of tips) {
        g.fillStyle = glow
        g.globalAlpha = 0.16
        g.beginPath()
        g.arc(t.x, t.y, 15, 0, Math.PI * 2)
        g.fill()
        g.globalAlpha = 0.9
        g.fillStyle = '#FFFFFF'
        g.beginPath()
        g.arc(t.x, t.y, 4, 0, Math.PI * 2)
        g.fill()
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.life += dt
        if (s.life >= s.max) {
          sparks.splice(i, 1)
          continue
        }
        s.px = s.x
        s.py = s.y
        s.vy += 260 * dt
        s.vx *= 1 - 0.8 * dt
        s.x += s.vx * dt
        s.y += s.vy * dt
        g.globalAlpha = 1 - s.life / s.max
        g.strokeStyle = s.c
        g.lineWidth = s.lw
        g.beginPath()
        g.moveTo(s.px, s.py)
        g.lineTo(s.x, s.y)
        g.stroke()
      }
      g.fillStyle = '#FFFFFF'
      for (let i = glints.length - 1; i >= 0; i--) {
        const s = glints[i]
        s.life += dt
        if (s.life >= s.max) {
          glints.splice(i, 1)
          continue
        }
        const k = Math.sin((s.life / s.max) * Math.PI)
        g.globalAlpha = k
        star(s.x, s.y, s.s * (0.4 + k * 0.6))
      }
      g.globalAlpha = 1
      g.globalCompositeOperation = 'source-over'
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
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [active, figsRef])
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
}

export function Couple({ className = '', fit = false, hop = 0, intro = false }: { className?: string; fit?: boolean; hop?: number; intro?: boolean }) {
  return (
    <div aria-hidden="true" className={`relative flex items-end justify-center gap-2 ${className}`}>
      {couple.map((c, i) => {
        const art = illustrations[c.id]
        if (!art) return null
        return (
          <div
            key={`${c.id}-${hop}`}
            className={`illo ${hop > 0 ? 'poke' : ''} ${intro ? 'intro-rise' : ''} ${fit ? 'couple-fig h-full' : 'w-24 sm:w-32'}`}
            style={{ ['--skin' as string]: c.skin, ['--hair' as string]: c.hair, ['--delay' as string]: `${1.3 + i * 0.4}s` }}
            dangerouslySetInnerHTML={{ __html: art.svg }}
          />
        )
      })}
    </div>
  )
}

interface WelcomeProps {
  /** 0 closed to 1 open: the curtains gather at the sides. */
  curtain: number
  /** 0 to 1: the stage floor and the couple slide down and away. */
  apron: number
  /** 0 to 1: the gathered curtains and the valance leave. */
  exit: number
  textTop: number
  kicker: string
  dateLine: string
  openLabel: string
}

/**
 * The opening, as a stage. The couple stand on the stage floor in front of closed curtains, holding sparklers. Their names drop in, a scroll
 * unfurls with the welcome and the date, and a cue says to scroll. Scrolling draws the curtains back onto the harbor, and the
 * couple and the floor slide away as the ferry sails in. Tapping the stage throws confetti.
 */
export default function Welcome({ curtain, apron, exit, textTop, kicker, dateLine, openLabel }: WelcomeProps) {
  const figs = useRef<HTMLDivElement>(null)
  const [hop, setHop] = useState(0)
  const [lit, setLit] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setLit(true), 2300)
    return () => window.clearTimeout(id)
  }, [])
  if (exit >= 1) return null
  const gather = 1 - curtain * 0.9
  const ui = Math.max(0, 1 - curtain * 4)
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" inert={exit > 0.6}>
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-[52%] origin-left will-change-transform" style={{ transform: `translateX(${-exit * 100}%) scaleX(${gather})` }}>
          <CurtainPanel />
        </div>
        <div className="absolute inset-y-0 right-0 w-[52%] origin-right will-change-transform" style={{ transform: `translateX(${exit * 100}%) scaleX(${gather})` }}>
          <CurtainPanel />
        </div>
        <div className="absolute inset-x-0 top-0 h-[min(14svh,7rem)] will-change-transform" style={{ transform: `translateY(${-exit * 110}%)` }}>
          <Valance />
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col items-center px-4" style={{ paddingTop: textTop, opacity: ui }}>
        <div className="intro-unfurl flex items-stretch overflow-hidden" style={{ width: 'min(92vw, 36rem)' }}>
          <span aria-hidden="true" className="-my-1 w-6 shrink-0 rounded-[0.8rem] border-hair border-accent bg-land" />
          <div className="flex min-w-0 flex-1 justify-center overflow-hidden border-hair border-x-0 border-accent bg-paper">
            <div className="intro-fade shrink-0 px-4 py-3 text-center" style={{ width: 'calc(min(92vw, 36rem) - 3.2rem)', animationDelay: '4.3s' }}>
              <p className="font-hand text-label">{kicker}</p>
              <p className="font-display text-h3 font-extrabold">{dateLine}</p>
            </div>
          </div>
          <span aria-hidden="true" className="-my-1 w-6 shrink-0 rounded-[0.8rem] border-hair border-accent bg-land" />
        </div>
        <div aria-hidden="true" className="intro-fade mt-7 flex flex-col items-center gap-1" style={{ animationDelay: '5.2s' }}>
          <span className="rounded-pill border-hair border-accent bg-paper px-5 py-1.5 font-hand text-label">{openLabel}</span>
          <svg className="cue-bob" width="22" height="30" viewBox="0 0 22 30" fill="none" stroke="var(--color-paper)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4 L11 11 L18 4" />
            <path d="M4 15 L11 22 L18 15" />
          </svg>
        </div>
        <p className="sr-only">Scroll down to open the curtains.</p>
      </div>

      <div
        className="pointer-events-auto absolute inset-x-0 bottom-0 h-[58svh] will-change-transform"
        style={{ transform: `translateY(${apron * 108}%)` }}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('button')) return
          confetti(e.clientX, e.clientY, { count: 40, power: 0.8 })
          setHop((n) => n + 1)
        }}
      >
        <div aria-hidden="true" className="absolute inset-x-[-14%] bottom-[-20%] h-[44%] rounded-[50%] border-hair border-accent bg-land" />
        <Sparklers active={lit && apron < 0.95} figsRef={figs} />
        <div ref={figs} className="absolute bottom-[8%] left-1/2 h-[min(30svh,21rem)] -translate-x-1/2">
          <Couple fit hop={hop} intro className="relative h-full" />
        </div>
      </div>
    </div>
  )
}
