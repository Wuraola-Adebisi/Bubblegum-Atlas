import { wedding } from '../data/events/wedding.ts'
import Journey from '../features/journey/Journey.tsx'

export default function JourneyPage() {
  return <main>{wedding.journey && <Journey event={wedding} journey={wedding.journey} />}</main>
}
