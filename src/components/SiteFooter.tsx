import type { EventConfig } from '../data/events/types.ts'

const links = [
  { href: '#/', label: 'Journey' },
  { href: '#/day', label: 'The day' },
  { href: '#/map', label: 'Map' },
  { href: '#/story', label: 'Story' },
  { href: '#/rsvp', label: 'RSVP' },
]

export default function SiteFooter({ event }: { event: EventConfig }) {
  return (
    <footer className="mx-auto max-w-7xl px-4 pb-12 sm:px-8 print:hidden">
      <div className="flex flex-col gap-6 border-t-2 border-dashed border-water-deep pt-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-h3 font-extrabold">{event.title}</p>
          <p className="text-small">{event.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-11 items-center font-medium text-accent underline underline-offset-4">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
