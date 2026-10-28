import { useId } from 'react'

const modes = [
  { id: 'day', label: 'Day', value: 33 },
  { id: 'dusk', label: 'Dusk', value: 78 },
  { id: 'night', label: 'Night', value: 100 },
] as const

interface ModeSwitchProps {
  /** Scrubber position, 0 to 100. */
  value: number
  onChange: (value: number) => void
  /** Group label. */
  legend?: string
}

/** Radio group that jumps the scrubber to a preset and follows it when it is dragged. */
export default function ModeSwitch({ value, onChange, legend = 'Scene mode' }: ModeSwitchProps) {
  const name = useId()
  const t = value / 100
  const current = t < 0.55 ? 'day' : t < 0.9 ? 'dusk' : 'night'
  return (
    <fieldset>
      <legend className="font-display text-h3 font-extrabold">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-3">
        {modes.map((m) => (
          <label
            key={m.id}
            className="min-h-11 cursor-pointer rounded-pill border-hair border-accent px-6 py-2.5 font-medium text-accent transition duration-micro ease-standard has-[:checked]:bg-accent has-[:checked]:text-paper has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
          >
            <input type="radio" name={name} className="sr-only" checked={current === m.id} onChange={() => onChange(m.value)} />
            {m.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
