const links = [
  { href: '#/', label: 'Journey' },
  { href: '#/day', label: 'The day' },
  { href: '#/map', label: 'Map' },
  { href: '#/story', label: 'Story' },
  { href: '#/rsvp', label: 'RSVP' },
]

/** Floating site navigation. `current` is the hash of the page being shown. */
export default function NavPill({ current }: { current: string }) {
  return (
    <nav aria-label="Main" className="pointer-events-none fixed inset-x-0 top-3 z-40 flex justify-center px-4">
      <ul className="pointer-events-auto flex gap-1 rounded-pill border-hair border-accent bg-paper p-1">
        {links.map((l) => {
          const on = l.href === current
          return (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={on ? 'page' : undefined}
                className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-pill px-2.5 text-small font-medium sm:px-5 sm:text-body transition duration-micro ease-standard ${
                  on ? 'bg-accent text-paper' : 'text-accent hover:bg-land-wash'
                }`}
              >
                {l.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
