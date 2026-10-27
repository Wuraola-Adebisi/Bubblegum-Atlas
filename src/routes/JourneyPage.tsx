import { Suspense, lazy } from 'react'
import { wedding } from '../data/events/wedding.ts'
import Journey from '../features/journey/Journey.tsx'

// Sections below the hero load after the first screen so the hero paints sooner.
const Walk = lazy(() => import('../features/walk/Walk.tsx'))
const DaySection = lazy(() => import('../features/home/DaySection.tsx'))
const RsvpBand = lazy(() => import('../features/home/RsvpBand.tsx'))

export default function JourneyPage() {
  return (
    <main id="main" className="focus:outline-hidden">
      {wedding.journey && <Journey event={wedding} journey={wedding.journey} />}
      <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
        {wedding.walk && <Walk event={wedding} walk={wedding.walk} />}
        <DaySection event={wedding} />
        <RsvpBand event={wedding} />
      </Suspense>
    </main>
  )
}
