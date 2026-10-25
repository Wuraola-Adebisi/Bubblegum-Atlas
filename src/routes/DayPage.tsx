import { wedding } from '../data/events/wedding.ts'
import DayExplorer from '../features/day/DayExplorer.tsx'

export default function DayPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-8">
      <header className="mb-8 max-w-measure">
        <h1 className="font-display text-h1 font-extrabold">{wedding.copy.dayTitle}</h1>
        <p className="mt-3 text-body">{wedding.copy.dayIntro}</p>
      </header>
      <DayExplorer event={wedding} />
    </main>
  )
}
