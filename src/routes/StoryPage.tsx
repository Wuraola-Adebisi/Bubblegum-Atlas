import { wedding as event } from '../data/events/wedding.ts'
import PassportStamp from '../components/PassportStamp.tsx'
import { usePassport } from '../features/walk/usePassport.ts'

const btn =
  'inline-flex min-h-11 cursor-pointer items-center rounded-pill border-hair border-accent bg-paper px-6 py-2 font-medium text-accent shadow-press transition duration-micro ease-standard hover:bg-accent hover:text-paper active:translate-y-0.5 active:shadow-press-down'

const tilts = [-4, 3, -2, 4, -3]

/** The story trail. Stamps come from walking the estate on the home page, or from the "Stamp it" buttons here. */
export default function StoryPage() {
  const passport = usePassport(event)
  const stamps = event.passport.stamps
  const done = passport.got.length === passport.total
  return (
    <main id="main" className="focus:outline-hidden mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-8">
      <header className="mb-10 max-w-measure">
        <h1 className="font-display text-h1 font-extrabold">Our story, in five stops</h1>
        <p className="mt-3 text-body">
          Walk the estate on the home page and each stop stamps your passport. You can also stamp a stop here, the way a check-in at the venue would.
        </p>
        <p className="mt-4 font-hand text-h3" aria-live="polite">
          {passport.got.length} of {passport.total} stamps
        </p>
      </header>

      <ol className="space-y-6">
        {stamps.map((s, i) => {
          const have = passport.got.includes(s.pinId)
          return (
            <li key={s.pinId} className={`flex flex-col gap-5 rounded-panel bg-paper p-5 sm:flex-row sm:items-center sm:p-8 ${i % 2 ? 'lg:ml-16' : ''}`}>
              <PassportStamp label={s.label} state={have ? 'collected' : 'locked'} tilt={tilts[i % tilts.length]} />
              <div>
                <h2 className="font-display text-h3 font-extrabold">{s.label}</h2>
                {have ? (
                  <p className="mt-2 max-w-measure text-body">{s.unlock}</p>
                ) : (
                  <>
                    <p className="mt-2 max-w-measure text-body">Locked. Walk to this stop on the home page, or stamp it here.</p>
                    <button type="button" className={`${btn} mt-4`} onClick={() => passport.collect(s.pinId)}>
                      Stamp it: {s.label}
                    </button>
                  </>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      {done && (
        <section aria-labelledby="reward" className="mt-10 rounded-panel border-hair border-dashed border-water-deep bg-paper p-6 sm:p-10">
          <h2 id="reward" className="font-display text-h2 font-extrabold">
            {event.passport.completionReward.title}
          </h2>
          <p className="mt-3 max-w-measure text-body">{event.passport.completionReward.body}</p>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <a href="#/" className={btn}>
          Walk the estate
        </a>
        <button type="button" className={btn} onClick={passport.reset}>
          Start over
        </button>
      </div>
    </main>
  )
}
