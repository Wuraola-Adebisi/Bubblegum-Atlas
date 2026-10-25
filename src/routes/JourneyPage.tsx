import { wedding } from '../data/events/wedding.ts'
import Journey from '../features/journey/Journey.tsx'
import DaySection from '../features/home/DaySection.tsx'
import RsvpBand from '../features/home/RsvpBand.tsx'
import Walk from '../features/walk/Walk.tsx'

export default function JourneyPage() {
  return (
    <main>
      {wedding.journey && <Journey event={wedding} journey={wedding.journey} />}
      {wedding.walk && <Walk event={wedding} walk={wedding.walk} />}
      <DaySection event={wedding} />
      <RsvpBand event={wedding} />
    </main>
  )
}
