const scale = [
  { cls: 'font-display text-display font-extrabold', name: 'display', spec: 'clamp(3.25rem, 9vw, 8rem), line height 0.92', sample: 'Where the ferry lands' },
  { cls: 'font-display text-h1 font-extrabold', name: 'h1', spec: 'clamp(2.5rem, 6vw, 4.5rem), line height 1', sample: 'Plan your weekend' },
  { cls: 'font-display text-h2 font-extrabold', name: 'h2', spec: 'clamp(1.75rem, 3.5vw, 2.75rem), line height 1.1', sample: 'Getting here by water' },
  { cls: 'font-display text-h3 font-extrabold', name: 'h3', spec: '1.5rem, line height 1.2', sample: 'The ferry timetable' },
]

export default function Typography() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-panel bg-paper p-6">
          <p className="font-display text-h1 font-extrabold">Aa</p>
          <p className="mt-2 font-medium">Display</p>
          <p className="text-small">Bricolage Grotesque, weight 800. Headlines and big numbers.</p>
        </div>
        <div className="rounded-panel bg-paper p-6">
          <p className="font-hand text-h1 font-semibold">Aa</p>
          <p className="mt-2 font-medium">Hand</p>
          <p className="text-small">Caveat, weight 600. Map labels, captions and asides. Never body text, 20px at the smallest.</p>
        </div>
        <div className="rounded-panel bg-paper p-6">
          <p className="font-body text-h1 font-medium">Aa</p>
          <p className="mt-2 font-medium">Body and interface</p>
          <p className="text-small">DM Sans, weights 400 and 500. Paragraphs, buttons, forms.</p>
        </div>
      </div>

      <div className="mt-12 divide-y-2 divide-ground rounded-panel bg-paper px-6 sm:px-10">
        {scale.map((s) => (
          <div key={s.name} className="py-8">
            <p className="font-hand text-label">
              {s.name}: {s.spec}
            </p>
            <p className={`mt-2 ${s.cls}`}>{s.sample}</p>
          </div>
        ))}
        <div className="py-8">
          <p className="font-hand text-label">body: 1.0625rem, line height 1.6, measure capped at 70 characters</p>
          <p className="mt-2 max-w-measure text-body">
            The ferry leaves Harbor Quay at 1:00 pm. Please arrive by 12:45 so there is time to find your seat. The crossing takes
            about twenty minutes, and the estate is a short walk from the jetty along the lakeside path.
          </p>
        </div>
        <div className="py-8">
          <p className="font-hand text-label">small: 0.875rem, line height 1.5</p>
          <p className="mt-2 max-w-measure text-small">
            Step-free access is available from the jetty to the house. Tell us if you need a seat on the ferry reserved.
          </p>
        </div>
        <div className="py-8">
          <p className="font-hand text-label">hand label: 1.25rem, line height 1.15, weight 600</p>
          <p className="mt-2 font-hand text-label font-semibold">first dance at dusk, around 8:30 pm</p>
        </div>
      </div>
    </>
  )
}
