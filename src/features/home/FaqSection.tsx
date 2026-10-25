import type { EventConfig } from '../../data/events/types.ts'
import Accordion from '../../components/Accordion.tsx'

export default function FaqSection({ event }: { event: EventConfig }) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-5">
        <h2 id="faq-heading" className="font-display text-h1 font-extrabold lg:col-span-2">
          {event.copy.faqTitle}
        </h2>
        <div className="lg:col-span-3">
          <Accordion items={event.faq} />
        </div>
      </div>
    </section>
  )
}
