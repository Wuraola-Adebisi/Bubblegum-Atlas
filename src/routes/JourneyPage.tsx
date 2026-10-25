import { wedding } from '../data/events/wedding.ts'
import Journey from '../features/journey/Journey.tsx'
import DaySection from '../features/home/DaySection.tsx'
import FaqSection from '../features/home/FaqSection.tsx'
import HereSection from '../features/home/HereSection.tsx'
import RsvpBand from '../features/home/RsvpBand.tsx'
import WeekendSection from '../features/home/WeekendSection.tsx'

export default function JourneyPage() {
  return (
    <main>
      {wedding.journey && <Journey event={wedding} journey={wedding.journey} />}
      <WeekendSection event={wedding} />
      <DaySection event={wedding} />
      <HereSection event={wedding} />
      <FaqSection event={wedding} />
      <RsvpBand event={wedding} />
    </main>
  )
}
