import type { EventConfig } from '../../data/events/types.ts'

export default function RsvpBand({ event }: { event: EventConfig }) {
  return (
    <section aria-labelledby="rsvp-band-heading" className="mx-auto max-w-7xl px-4 pb-16 sm:px-8 sm:pb-24">
      <div className="rounded-panel border-hair border-dashed border-water-deep bg-paper p-6 sm:p-10 lg:p-14">
        <h2 id="rsvp-band-heading" className="font-display text-h1 font-extrabold">
          {event.copy.rsvpTitle}
        </h2>
        <p className="mt-4 max-w-measure text-body">{event.copy.rsvpIntro}</p>
        <p className="mt-8">
          <a
            href="#/rsvp"
            className="inline-flex min-h-11 items-center rounded-pill border-hair border-accent bg-accent px-8 py-2 font-medium text-paper shadow-press transition duration-micro ease-standard hover:bg-ink active:translate-y-0.5 active:shadow-press-down"
          >
            {event.copy.ctaRsvp}
          </a>
        </p>
      </div>
    </section>
  )
}
