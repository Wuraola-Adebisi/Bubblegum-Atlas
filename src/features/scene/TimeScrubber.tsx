import { useId } from 'react'

interface TimeScrubberProps {
  value: number
  onChange: (value: number) => void
  clock: string
  sceneName: string
}

/** Native range input with a 44px target. The value text carries the time and the scene name. */
export default function TimeScrubber({ value, onChange, clock, sceneName }: TimeScrubberProps) {
  const id = useId()
  const text = `${clock}, ${sceneName.toLowerCase()}`
  return (
    <div>
      <label htmlFor={id} className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-display text-h3 font-extrabold">Time of day</span>
        <span className="font-hand text-label font-semibold tabular-nums">{text}</span>
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={text}
        className="scrubber mt-3"
      />
    </div>
  )
}
