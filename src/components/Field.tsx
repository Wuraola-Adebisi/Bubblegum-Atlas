import type { ReactNode } from 'react'

export const controlClass =
  'block min-h-11 w-full rounded-panel border-hair border-accent bg-paper px-4 py-2.5 text-body text-ink transition duration-micro ease-standard focus:border-ink aria-[invalid=true]:border-error aria-[invalid=true]:border-2'

interface FieldProps {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode
}

/** A visible label, optional hint, the control, and an error that says what went wrong and how to fix it. */
export default function Field({ id, label, hint, error, required, children }: FieldProps) {
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-medium">
        {label}
        {required ? '' : <span className="font-normal"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mb-1.5 text-small">
          {hint}
        </p>
      )}
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-small font-medium text-error">
          {error}
        </p>
      )}
    </div>
  )
}
