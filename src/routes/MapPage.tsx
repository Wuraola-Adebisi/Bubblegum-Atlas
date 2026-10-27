import { wedding } from '../data/events/wedding.ts'
import MapExplorer from '../features/map/MapExplorer.tsx'

export default function MapPage() {
  return (
    <main id="main" className="focus:outline-hidden mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-8">
      <header className="mb-8 max-w-measure">
        <p className="text-small">
          <a href="#/" className="text-accent underline underline-offset-4">
            Back to the journey
          </a>
        </p>
        <h1 className="mt-3 font-display text-h1 font-extrabold">{wedding.copy.mapTitle}</h1>
        <p className="mt-3 text-body">{wedding.copy.mapIntro}</p>
      </header>
      <MapExplorer event={wedding} />
    </main>
  )
}
