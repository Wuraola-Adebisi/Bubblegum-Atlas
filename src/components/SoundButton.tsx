import { toggleSound, useSound } from '../lib/audio.ts'

/** The one sound control for the whole site. Sound is on by default and starts at the first tap. */
export default function SoundButton() {
  const { on, playing } = useSound()
  return (
    <div className="pointer-events-none fixed top-3 right-3 z-50 flex items-center gap-2">
      {on && !playing && (
        <span aria-hidden="true" className="intro-fade hidden rounded-pill border-hair border-accent bg-paper px-3 py-1 font-hand text-label sm:block" style={{ animationDelay: '2s' }}>
          Tap anywhere for music
        </span>
      )}
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={on}
        aria-label={on ? (playing ? 'Turn sound off' : 'Sound is on. Tap anywhere to start the music, or press to turn it off') : 'Turn sound on'}
        className="pointer-events-auto grid size-11 cursor-pointer place-items-center rounded-pill border-hair border-accent bg-paper text-accent transition duration-micro ease-standard hover:bg-accent hover:text-paper"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="currentColor" />
          {on ? <path d="M16 9 C17.5 10.5 17.5 13.5 16 15 M18.5 6.5 C21.5 9.5 21.5 14.5 18.5 17.5" /> : <path d="M17 9 L22 15 M22 9 L17 15" />}
        </svg>
      </button>
    </div>
  )
}
