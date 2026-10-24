import { useSyncExternalStore } from 'react'
import JourneyPage from './routes/JourneyPage.tsx'
import MapPage from './routes/MapPage.tsx'
import StyleTile from './StyleTile.tsx'

// Hash routing for now. React Router arrives with the page build (step 6).
// #/ is the journey, #/map is the map, #/tile is the style tile.
const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
const getHash = () => window.location.hash

export default function App() {
  const hash = useSyncExternalStore(subscribe, getHash)
  if (hash.startsWith('#/map')) return <MapPage />
  if (hash.startsWith('#/tile')) return <StyleTile />
  return <JourneyPage />
}
