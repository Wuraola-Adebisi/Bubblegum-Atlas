// Sound for the whole site. Everything is synthesized with the Web Audio API, so there are no audio files to load.
// Sound is on by default, but browsers only let audio start after a tap, click or key press, so the music begins on the first one.
// One score plays: a soft pad, then a music box, a bass line, bells and strings join as the guest scrolls toward the arch.
import { useSyncExternalStore } from 'react'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let on = true
try {
  on = localStorage.getItem('ba:sound') !== 'off'
} catch {
  /* private mode: stay on */
}
let unlocked = false
const subs = new Set<() => void>()
const emit = () => subs.forEach((f) => f())

export const isSoundOn = () => on
export function getContext(): { ctx: AudioContext; out: AudioNode } | null {
  return ctx && master && unlocked && on ? { ctx, out: master } : null
}

// ---- the score ----
const BEAT = 60 / 68
const BAR = BEAT * 4
const pads = [[60, 64, 67], [59, 62, 67], [57, 60, 64], [57, 60, 65]]
const roots = [36, 43, 45, 41]
const hz = (m: number) => 440 * 2 ** ((m - 69) / 12)

interface Layers {
  pad: GainNode
  arp: GainNode
  bass: GainNode
  bell: GainNode
  str: GainNode
}
let layers: Layers | null = null
let timer = 0
let nextBar = 0
let barIndex = 0
let level = 0.05
let boost = 0
let boostTimer = 0

const smooth = (x: number, a: number, b: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function applyLevel() {
  if (!ctx || !layers) return
  const l = Math.max(level, boost)
  const t = ctx.currentTime
  layers.arp.gain.setTargetAtTime(smooth(l, 0.12, 0.35), t, 0.7)
  layers.bass.gain.setTargetAtTime(smooth(l, 0.32, 0.5), t, 0.7)
  layers.bell.gain.setTargetAtTime(smooth(l, 0.5, 0.68), t, 0.7)
  layers.str.gain.setTargetAtTime(smooth(l, 0.68, 0.88), t, 0.9)
}

function voice(out: AudioNode, freq: number, t0: number, dur: number, type: OscillatorType, peak: number, attack: number, cutoff = 3000, detune = 0) {
  if (!ctx) return
  const osc = ctx.createOscillator()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  osc.detune.value = detune
  filter.type = 'lowpass'
  filter.frequency.value = cutoff
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(peak, t0 + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(filter).connect(gain).connect(out)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

function scheduleBar(t: number, i: number) {
  if (!layers) return
  const c = i % 4
  const chord = pads[c]
  for (const m of chord) voice(layers.pad, hz(m), t, BAR + 1.2, 'sine', 0.05, 0.9, 1400)
  voice(layers.bass, hz(roots[c]), t, BEAT * 3.2, 'sine', 0.11, 0.04, 400)
  const pattern = [0, 2, 1, 2, 0, 2, 1, 2]
  pattern.forEach((k, n) => voice(layers!.arp, hz(chord[k] + 12), t + n * (BEAT / 2), 0.9, 'triangle', 0.07, 0.01, 2600))
  for (const n of [0, 2]) {
    const m = chord[(i + n) % 3] + 24
    voice(layers.bell, hz(m), t + n * BEAT + BEAT * 0.5, 1.8, 'sine', 0.05, 0.005, 6000)
  }
  for (const m of chord) {
    voice(layers.str, hz(m - 12), t, BAR + 1.4, 'sawtooth', 0.016, 1.3, 800, -7)
    voice(layers.str, hz(m - 12), t, BAR + 1.4, 'sawtooth', 0.016, 1.3, 800, 7)
  }
}

function tick() {
  if (!ctx || !layers) return
  while (nextBar < ctx.currentTime + 0.8) {
    scheduleBar(nextBar, barIndex++)
    nextBar += BAR
  }
}

function startMusic() {
  if (!ctx || !master || timer) return
  const c = ctx
  const mk = (g: number) => {
    const n = c.createGain()
    n.gain.value = g
    n.connect(master!)
    return n
  }
  layers = { pad: mk(1), arp: mk(0), bass: mk(0), bell: mk(0), str: mk(0) }
  master.gain.cancelScheduledValues(c.currentTime)
  master.gain.setValueAtTime(0.0001, c.currentTime)
  master.gain.linearRampToValueAtTime(0.5, c.currentTime + 2.5)
  nextBar = c.currentTime + 0.1
  barIndex = 0
  applyLevel()
  tick()
  timer = window.setInterval(tick, 150)
}

function stopMusic() {
  if (!ctx || !master) return
  const c = ctx
  master.gain.cancelScheduledValues(c.currentTime)
  master.gain.setTargetAtTime(0.0001, c.currentTime, 0.2)
  window.clearInterval(timer)
  timer = 0
  layers = null
}

/** How much of the score is playing, 0 (pad only) to 1 (everything). Called as the guest scrolls. */
export function setMusicLevel(v: number) {
  level = Math.min(1, Math.max(0, v))
  applyLevel()
}

/** A rising flourish and a held chord, for arriving at the arch. */
export function swell() {
  const g = getContext()
  if (!g || !layers) return
  const t = g.ctx.currentTime + 0.05
  ;[72, 76, 79, 84, 88, 91, 96].forEach((m, i) => voice(g.out, hz(m), t + i * 0.09, 1.6, 'triangle', 0.07, 0.01, 5000))
  for (const m of [60, 64, 67, 72, 74]) voice(g.out, hz(m), t + 0.7, 4, 'sine', 0.06, 0.05, 3000)
  boost = 1
  applyLevel()
  window.clearTimeout(boostTimer)
  boostTimer = window.setTimeout(() => {
    boost = 0
    applyLevel()
  }, 6000)
}

// ---- water ----
// Soft lapping water under the ferry crossing: looped brown noise, band-limited, with a slow swell.
let water: GainNode | null = null
let waterLevel = 0
function startWater(c: AudioContext) {
  const len = c.sampleRate * 4
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    d[i] = last * 3.5
  }
  const src = c.createBufferSource()
  src.buffer = buf
  src.loop = true
  const band = c.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 520
  band.Q.value = 0.6
  water = c.createGain()
  water.gain.value = 0
  const lfo = c.createOscillator()
  const lfoGain = c.createGain()
  lfo.frequency.value = 0.17
  lfoGain.gain.value = 0.012
  lfo.connect(lfoGain).connect(water.gain)
  src.connect(band).connect(water).connect(master!)
  src.start()
  lfo.start()
}

/** How loud the water is, 0 to 1. Called as the ferry crosses. */
export function setWaterLevel(v: number) {
  waterLevel = Math.min(1, Math.max(0, v))
  if (ctx && water) water.gain.setTargetAtTime(waterLevel * 0.05, ctx.currentTime, 0.8)
}

// ---- state ----
function unlock() {
  if (unlocked) return
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = new AC()
    const comp = ctx.createDynamicsCompressor()
    master = ctx.createGain()
    master.gain.value = 0.0001
    master.connect(comp).connect(ctx.destination)
    void ctx.resume()
    startWater(ctx)
    unlocked = true
    setWaterLevel(waterLevel)
    if (on) startMusic()
    emit()
  } catch {
    /* no audio available */
  }
}

export function toggleSound() {
  on = !on
  try {
    localStorage.setItem('ba:sound', on ? 'on' : 'off')
  } catch {
    /* ignore */
  }
  if (!unlocked) unlock()
  else if (on) {
    void ctx?.resume()
    startMusic()
  } else stopMusic()
  emit()
}

let armed = false
/** Listen for the first tap, click or key press anywhere, which is what browsers need before they allow sound. */
export function armSound() {
  if (armed || typeof window === 'undefined') return
  armed = true
  const go = () => {
    unlock()
    if (unlocked) for (const e of ['pointerdown', 'keydown', 'touchend']) window.removeEventListener(e, go)
  }
  for (const e of ['pointerdown', 'keydown', 'touchend']) window.addEventListener(e, go)
}

export function useSound() {
  const state = useSyncExternalStore(
    (cb) => {
      subs.add(cb)
      return () => subs.delete(cb)
    },
    () => (on ? (unlocked ? 2 : 1) : 0),
  )
  return { on: state > 0, playing: state === 2 }
}
