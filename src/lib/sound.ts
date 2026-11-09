// Short sound effects for the opening, on the shared audio context from audio.ts. They stay quiet while sound is off or not yet started.

import { getContext } from './audio.ts'

function context(): AudioContext | null {
  return getContext()?.ctx ?? null
}

function tone(c: AudioContext, freq: number, start: number, dur: number, type: OscillatorType, peak: number, cutoff: number) {
  const osc = c.createOscillator()
  const filter = c.createBiquadFilter()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  filter.type = 'lowpass'
  filter.frequency.value = cutoff
  const t0 = c.currentTime + start
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(filter).connect(gain).connect(getContext()?.out ?? c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

/** A short brass-style fanfare: three quick notes, then a held chord. */
export function playFanfare() {
  const c = context()
  if (!c) return
  const quick: [number, number][] = [
    [392, 0],
    [392, 0.17],
    [392, 0.34],
  ]
  for (const [f, s] of quick) tone(c, f, s, 0.16, 'sawtooth', 0.06, 1800)
  for (const f of [523.25, 659.25]) tone(c, f, 0.52, 0.55, 'sawtooth', 0.05, 2000)
  for (const f of [523.25, 659.25, 783.99]) tone(c, f, 1.1, 1.1, 'sawtooth', 0.05, 2200)
}

/** A soft rising shimmer, played as the curtains open. */
export function playShimmer() {
  const c = context()
  if (!c) return
  ;[1046.5, 1318.5, 1568, 2093, 2637].forEach((f, i) => tone(c, f, i * 0.09, 0.7, 'sine', 0.035, 6000))
}

/** A soft rush of air, played as the curtains start to move. */
export function playSwish() {
  const c = context()
  if (!c) return
  const t0 = c.currentTime
  const len = Math.floor(c.sampleRate * 1.4)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = c.createBufferSource()
  src.buffer = buf
  const band = c.createBiquadFilter()
  band.type = 'bandpass'
  band.Q.value = 0.8
  band.frequency.setValueAtTime(500, t0)
  band.frequency.exponentialRampToValueAtTime(2400, t0 + 1.2)
  const gain = c.createGain()
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.linearRampToValueAtTime(0.1, t0 + 0.35)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.4)
  src.connect(band).connect(gain).connect(getContext()?.out ?? c.destination)
  src.start(t0)
}

/** A low ferry horn: two long notes a minor third apart. */
export function playHorn() {
  const c = context()
  if (!c) return
  const t0 = c.currentTime + 0.02
  for (const f of [98, 116.5]) {
    const osc = c.createOscillator()
    const filter = c.createBiquadFilter()
    const gain = c.createGain()
    osc.type = 'sawtooth'
    osc.frequency.value = f
    filter.type = 'lowpass'
    filter.frequency.value = 520
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.linearRampToValueAtTime(0.12, t0 + 0.12)
    gain.gain.setValueAtTime(0.12, t0 + 0.85)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.5)
    osc.connect(filter).connect(gain).connect(getContext()?.out ?? c.destination)
    osc.start(t0)
    osc.stop(t0 + 1.6)
  }
}
