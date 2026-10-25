import { useSyncExternalStore } from 'react'
import NavPill from './components/NavPill.tsx'
import SiteFooter from './components/SiteFooter.tsx'
import { wedding } from './data/events/wedding.ts'
import DayPage from './routes/DayPage.tsx'
import JourneyPage from './routes/JourneyPage.tsx'
import MapPage from './routes/MapPage.tsx'
import RsvpPage from './routes/RsvpPage.tsx'
import StoryPage from './routes/StoryPage.tsx'
import StyleTile from './StyleTile.tsx'

// Hash routing for now. React Router arrives with the page build (step 6).
// #/ is the home page, #/day the day, #/map the map, #/rsvp the RSVP stub, #/tile the style tile.
const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
const getHash = () => window.location.hash

export default function App() {
  const hash = useSyncExternalStore(subscribe, getHash)
  if (hash.startsWith('#/tile')) return <StyleTile />
  const current = hash.startsWith('#/map')
    ? '#/map'
    : hash.startsWith('#/rsvp')
      ? '#/rsvp'
      : hash.startsWith('#/day')
        ? '#/day'
        : hash.startsWith('#/story')
          ? '#/story'
          : '#/'
  return (
    <>
      <NavPill current={current} />
      {current === '#/map' ? <MapPage /> : current === '#/rsvp' ? <RsvpPage /> : current === '#/day' ? <DayPage /> : current === '#/story' ? <StoryPage /> : <JourneyPage />}
      <SiteFooter event={wedding} />
    </>
  )
}
