const links = [
  { href: '#/', label: 'Journey' },
  { href: '#/map', label: 'Map' },
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
                className={`inline-flex min-h-11 items-center rounded-pill px-5 font-medium transition duration-micro ease-standard ${
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
