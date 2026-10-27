// Optional sound for the welcome screen. Everything is synthesized with the Web Audio API, so there are no audio files to load.
// Browsers only allow audio after a tap or key press, so nothing plays until the guest turns sound on.

let ctx: AudioContext | null = null

function context(): AudioContext | null {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx ??= new AC()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
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
  osc.connect(filter).connect(gain).connect(c.destination)
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

/** A soft rising shimmer, played as the clouds part. */
export function playShimmer() {
  const c = context()
  if (!c) return
  ;[1046.5, 1318.5, 1568, 2093, 2637].forEach((f, i) => tone(c, f, i * 0.09, 0.7, 'sine', 0.035, 6000))
}
