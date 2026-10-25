import { useId } from 'react'
import { illustrations } from '../map/illustrations.ts'
import { hairFor, skinTones } from './useAvatar.ts'
import type { AvatarChoice, AvatarStyle } from './useAvatar.ts'

interface AvatarPickerProps {
  choice: AvatarChoice
  onChange: (next: Partial<AvatarChoice>) => void
}

const options: { style: AvatarStyle; label: string; art: string }[] = [
  { style: 'suit', label: 'Suit', art: 'avatar-suit' },
  { style: 'dress', label: 'Dress', art: 'avatar-dress' },
]

const radio =
  'flex min-h-11 cursor-pointer items-center gap-3 rounded-pill border-hair border-accent bg-paper px-4 py-1 font-medium text-accent transition duration-micro ease-standard has-[:checked]:bg-accent has-[:checked]:text-paper has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink'

/** Who walks the estate: an outfit and a skin tone. Both are saved in the browser. */
export default function AvatarPicker({ choice, onChange }: AvatarPickerProps) {
  const styleName = useId()
  const toneName = useId()
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <fieldset>
        <legend className="mb-2 font-medium">Who is walking?</legend>
        <div className="flex flex-wrap gap-3">
          {options.map((o) => (
            <label key={o.style} className={radio}>
              <input type="radio" name={styleName} className="sr-only" checked={choice.style === o.style} onChange={() => onChange({ style: o.style })} />
              <span
                aria-hidden="true"
                className="illo w-6"
                style={{ ['--skin' as string]: choice.skin, ['--hair' as string]: hairFor[o.style] }}
                dangerouslySetInnerHTML={{ __html: illustrations[o.art]?.svg ?? '' }}
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 font-medium">Skin tone</legend>
        <div className="flex flex-wrap gap-2">
          {skinTones.map((t, i) => (
            <label
              key={t}
              className="grid size-11 cursor-pointer place-items-center rounded-pill has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
            >
              <input type="radio" name={toneName} className="sr-only" aria-label={`Skin tone ${i + 1} of ${skinTones.length}`} checked={choice.skin === t} onChange={() => onChange({ skin: t })} />
              <span
                aria-hidden="true"
                className={`size-8 rounded-pill border-hair ${choice.skin === t ? 'scale-110 border-ink border-2' : 'border-accent'}`}
                style={{ background: t }}
              />
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
