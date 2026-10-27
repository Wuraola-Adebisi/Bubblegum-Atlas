import { Suspense, lazy, useEffect, useRef, useSyncExternalStore } from 'react'
import NavPill from './components/NavPill.tsx'
import SiteFooter from './components/SiteFooter.tsx'
import SkipLink from './components/SkipLink.tsx'
import { wedding } from './data/events/wedding.ts'
import JourneyPage from './routes/JourneyPage.tsx'

const DayPage = lazy(() => import('./routes/DayPage.tsx'))
const MapPage = lazy(() => import('./routes/MapPage.tsx'))
const RsvpPage = lazy(() => import('./routes/RsvpPage.tsx'))
const StoryPage = lazy(() => import('./routes/StoryPage.tsx'))
const StyleTile = lazy(() => import('./StyleTile.tsx'))

// Hash routing for now. React Router arrives with the page build (step 6).
// #/ is the home page, #/day the day, #/map the map, #/story the story, #/rsvp the RSVP, #/tile the style tile.
const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
const getHash = () => window.location.hash

const pageTitles: Record<string, string> = {
  '#/': 'Welcome',
  '#/day': 'The day',
  '#/map': 'Map',
  '#/story': 'Our story',
  '#/rsvp': 'RSVP',
  '#/tile': 'Style tile',
}

function routeOf(hash: string) {
  if (hash.startsWith('#/tile')) return '#/tile'
  if (hash.startsWith('#/map')) return '#/map'
  if (hash.startsWith('#/rsvp')) return '#/rsvp'
  if (hash.startsWith('#/day')) return '#/day'
  if (hash.startsWith('#/story')) return '#/story'
  return '#/'
}

/** Shown while a route chunk loads. Tall enough that the footer does not jump. */
function PageLoading() {
  return (
    <main id="main" className="mx-auto grid min-h-screen max-w-7xl place-items-center px-4 pt-24 sm:px-8">
      <p className="font-hand text-label" role="status">
        Unfolding the map.
      </p>
    </main>
  )
}

export default function App() {
  const hash = useSyncExternalStore(subscribe, getHash)
  const current = routeOf(hash)
  const first = useRef(true)

  // Route changes: reset scroll, update the title, and move focus to main so keyboard and screen reader users start at the top of the new page.
  useEffect(() => {
    document.title = current === '#/' ? wedding.title : `${pageTitles[current]} | ${wedding.title}`
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo(0, 0)
    const id = window.setTimeout(() => {
      const main = document.getElementById('main')
      if (main) {
        main.setAttribute('tabindex', '-1')
        main.focus({ preventScroll: true })
      }
    }, 60)
    return () => window.clearTimeout(id)
  }, [current])

  if (current === '#/tile') {
    return (
      <Suspense fallback={<PageLoading />}>
        <StyleTile />
      </Suspense>
    )
  }
  return (
    <>
      <SkipLink />
      <NavPill current={current} />
      <Suspense fallback={<PageLoading />}>
        {current === '#/map' ? <MapPage /> : current === '#/rsvp' ? <RsvpPage /> : current === '#/day' ? <DayPage /> : current === '#/story' ? <StoryPage /> : <JourneyPage />}
      </Suspense>
      <SiteFooter event={wedding} />
    </>
  )
}
