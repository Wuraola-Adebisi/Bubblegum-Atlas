import { useSyncExternalStore } from 'react'
import NavPill from './components/NavPill.tsx'
import JourneyPage from './routes/JourneyPage.tsx'
import MapPage from './routes/MapPage.tsx'
import RsvpPage from './routes/RsvpPage.tsx'
import StyleTile from './StyleTile.tsx'

// Hash routing for now. React Router arrives with the page build (step 6).
// #/ is the journey, #/map the map, #/rsvp the RSVP stub, #/tile the style tile.
const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
const getHash = () => window.location.hash

export default function App() {
  const hash = useSyncExternalStore(subscribe, getHash)
  if (hash.startsWith('#/tile')) return <StyleTile />
  const current = hash.startsWith('#/map') ? '#/map' : hash.startsWith('#/rsvp') ? '#/rsvp' : '#/'
  return (
    <>
      <NavPill current={current} />
      {current === '#/map' ? <MapPage /> : current === '#/rsvp' ? <RsvpPage /> : <JourneyPage />}
    </>
  )
}
