import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  title: string
  note?: string
  children: ReactNode
}

export default function Section({ id, title, note, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-10">
      <header className="mb-12 max-w-measure">
        <h2 id={`${id}-title`} className="font-display text-h2 font-extrabold">
          {title}
        </h2>
        {note ? <p className="mt-4 text-body">{note}</p> : null}
      </header>
      {children}
    </section>
  )
}
