import { useId, useState } from 'react'

interface AccordionProps {
  items: { q: string; a: string }[]
}

/** Button-based disclosure list. Any number of items can be open. */
export default function Accordion({ items }: AccordionProps) {
  const base = useId()
  const [open, setOpen] = useState<Set<number>>(new Set())
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  return (
    <ul className="space-y-3">
      {items.map((it, i) => {
        const on = open.has(i)
        return (
          <li key={it.q} className="rounded-panel bg-paper">
            <h3>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`${base}-${i}`}
                onClick={() => toggle(i)}
                className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 rounded-panel px-5 py-3 text-left font-medium"
              >
                {it.q}
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0 text-accent">
                  <path d="M4 10 H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  {!on && <path d="M10 4 V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
                </svg>
              </button>
            </h3>
            <div id={`${base}-${i}`} hidden={!on} className="px-5 pb-4">
              <p className="max-w-measure">{it.a}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
