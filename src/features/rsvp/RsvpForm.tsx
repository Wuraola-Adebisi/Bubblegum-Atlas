import { useId } from 'react'
import type { FormEvent } from 'react'
import type { EventConfig } from '../../data/events/types.ts'
import Field, { controlClass } from '../../components/Field.tsx'

interface RsvpFormProps {
  event: EventConfig
  attending: 'yes' | 'no' | ''
  values: Record<string, string>
  errors: Record<string, string>
  onAttending: (v: 'yes' | 'no') => void
  onChange: (id: string, value: string) => void
  onSubmit: () => void
}

const choice =
  'flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-pill border-hair border-accent px-5 py-2 text-center font-medium text-accent transition duration-micro ease-standard has-[:checked]:bg-accent has-[:checked]:text-paper has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink'

/** The RSVP form. Fields come from the event's pass config. A "no" reply only asks for a name and an email. */
export default function RsvpForm({ event, attending, values, errors, onAttending, onChange, onSubmit }: RsvpFormProps) {
  const group = useId()
  const yes = attending === 'yes'
  const fields = event.pass.fields.filter((f) => yes || f.id === 'name' || f.id === 'email')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }
  return (
    <form onSubmit={submit} noValidate className="space-y-6 rounded-panel bg-paper p-5 sm:p-8">
      <fieldset aria-describedby={errors.attending ? `${group}-error` : undefined}>
        <legend className="mb-2 font-medium">Will you be there?</legend>
        <div className="flex flex-wrap gap-3">
          <label className={choice}>
            <input type="radio" name={group} className="sr-only" checked={attending === 'yes'} onChange={() => onAttending('yes')} />
            Yes, count me in
          </label>
          <label className={choice}>
            <input type="radio" name={group} className="sr-only" checked={attending === 'no'} onChange={() => onAttending('no')} />
            No, I cannot make it
          </label>
        </div>
        {errors.attending && (
          <p id={`${group}-error`} className="mt-1.5 text-small font-medium text-error">
            {errors.attending}
          </p>
        )}
      </fieldset>

      {attending && (
        <>
          {fields.map((f) => {
            const id = `rsvp-${f.id}`
            const required = !!f.required && (yes || f.id === 'name' || f.id === 'email')
            return (
              <Field key={f.id} id={id} label={f.label} error={errors[f.id]} required={required}
                hint={f.id === 'party' ? `Up to ${event.pass.maxPartySize ?? 8} guests per reply.` : undefined}>
                {(a) =>
                  f.type === 'select' ? (
                    <select {...a} className={controlClass} value={values[f.id] ?? ''} onChange={(e) => onChange(f.id, e.target.value)}>
                      <option value="">Choose one</option>
                      {f.options?.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea {...a} rows={3} className={controlClass} value={values[f.id] ?? ''} onChange={(e) => onChange(f.id, e.target.value)} />
                  ) : (
                    <input
                      {...a}
                      type={f.type === 'number' ? 'number' : f.type === 'email' ? 'email' : 'text'}
                      inputMode={f.type === 'number' ? 'numeric' : undefined}
                      min={f.type === 'number' ? 1 : undefined}
                      max={f.type === 'number' ? event.pass.maxPartySize : undefined}
                      autoComplete={f.id === 'name' ? 'name' : f.id === 'email' ? 'email' : 'off'}
                      className={controlClass}
                      value={values[f.id] ?? ''}
                      onChange={(e) => onChange(f.id, e.target.value)}
                    />
                  )
                }
              </Field>
            )
          })}
          <button
            type="submit"
            className="inline-flex min-h-11 cursor-pointer items-center rounded-pill border-hair border-accent bg-accent px-8 py-2 font-medium text-paper shadow-press transition duration-micro ease-standard hover:bg-ink active:translate-y-0.5 active:shadow-press-down"
          >
            Send RSVP
          </button>
          <p className="text-small">This is a demo. Your reply is saved in this browser only.</p>
        </>
      )}
    </form>
  )
}
