import { useSyncExternalStore } from 'react'
import MapPage from './routes/MapPage.tsx'
import StyleTile from './StyleTile.tsx'

// Hash routing for now. React Router arrives with the page build (step 6).
const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
const getHash = () => window.location.hash

export default function App() {
  const hash = useSyncExternalStore(subscribe, getHash)
  return hash.startsWith('#/map') ? <MapPage /> : <StyleTile />
}
