import { wedding } from '../data/events/wedding.ts'

/** Stub until build step 6. It says plainly what is coming and links to the pages that work. */
export default function RsvpPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-24 pb-16 sm:px-8">
      <h1 className="font-display text-h1 font-extrabold">RSVP</h1>
      <div className="mt-6 space-y-4 rounded-panel bg-paper p-6 sm:p-8">
        <p className="text-body">
          The RSVP form is not open yet. It will work like a boarding pass and ask for the details below, so you can have
          them ready.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          {wedding.pass.fields.map((f) => (
            <li key={f.id}>{f.label}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="#/map"
            className="inline-flex min-h-11 items-center rounded-pill border-hair border-accent bg-paper px-6 py-2 font-medium text-accent shadow-press transition duration-micro ease-standard hover:bg-accent hover:text-paper active:translate-y-0.5 active:shadow-press-down"
          >
            {wedding.copy.ctaMap}
          </a>
        </div>
      </div>
    </main>
  )
}
