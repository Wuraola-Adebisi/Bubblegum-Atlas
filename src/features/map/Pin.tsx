import type { Pin as PinData } from '../../data/events/types.ts'
import { swatchFor } from './layerStyle.ts'

interface PinProps {
  pin: PinData
  selected: boolean
  /** Lit: something is happening here at the chosen time. */
  active?: boolean
  onSelect: (id: string) => void
  onFocusPin: (pin: PinData) => void
  registerRef: (id: string, el: HTMLButtonElement | null) => void
}

/** A map marker. 24px visible, 44px hit area. Unnumbered, because places are not a sequence. */
export default function Pin({ pin, selected, active = false, onSelect, onFocusPin, registerRef }: PinProps) {
  return (
    <button
      type="button"
      ref={(el) => registerRef(pin.id, el)}
      data-pin-id={pin.id}
      aria-pressed={selected}
      aria-controls="pin-details"
      aria-label={`${pin.title}, ${pin.kind}`}
      onClick={() => onSelect(pin.id)}
      onFocus={() => onFocusPin(pin)}
      className="group absolute top-0 left-0 grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-pill"
    >
      <span
        className={`grid size-6 place-items-center rounded-pill border-hair border-accent transition duration-micro ease-standard group-hover:-translate-y-1 ${
          selected ? 'bg-accent' : active ? 'scale-125 bg-glow' : 'bg-paper'
        }`}
      >
        <span className={`size-2 rounded-pill ${selected ? 'bg-paper' : swatchFor(pin.layerIds[0])}`} />
      </span>
    </button>
  )
}
