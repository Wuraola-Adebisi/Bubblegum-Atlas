import type { EventConfig } from '../../data/events/types.ts'
import DayExplorer from '../day/DayExplorer.tsx'

/** The scrubber on the home page. The full page adds the day as a list. */
export default function DaySection({ event }: { event: EventConfig }) {
  return (
    <section id="day" aria-labelledby="day-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24 lg:py-32">
      <div className="mb-10 max-w-measure">
        <h2 id="day-heading" className="font-display text-h1 font-extrabold">
          {event.copy.dayTitle}
        </h2>
        <p className="mt-4 text-body">{event.copy.dayIntro}</p>
      </div>
      <DayExplorer event={event} showTimeline={false} />
      <p className="mt-6">
        <a href="#/day" className="font-medium text-accent underline underline-offset-4">
          Open the full day page
        </a>
      </p>
    </section>
  )
}
