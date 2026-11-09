import { Suspense, lazy, useEffect, useRef, useSyncExternalStore } from 'react'
import NavPill from './components/NavPill.tsx'
import SoundButton from './components/SoundButton.tsx'
import SiteFooter from './components/SiteFooter.tsx'
import SkipLink from './components/SkipLink.tsx'
import { armSound, setMusicLevel } from './lib/audio.ts'
import { wedding } from './data/events/wedding.ts'
import JourneyPage from './routes/JourneyPage.tsx'

const RsvpPage = lazy(() => import('./routes/RsvpPage.tsx'))
const ProgramPage = lazy(() => import('./routes/ProgramPage.tsx'))
const GiftsPage = lazy(() => import('./routes/GiftsPage.tsx'))
const StyleTile = lazy(() => import('./StyleTile.tsx'))

// Hash routing for now. React Router arrives with the page build (step 6).
// #/ is the home page (welcome, journey and walk), #/program the program, #/rsvp the RSVP, #/tile the style tile. Any other hash shows the home page.
const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}
const getHash = () => window.location.hash

const pageTitles: Record<string, string> = {
  '#/': 'Welcome',
  '#/program': 'Program',
  '#/gifts': 'Gifts and notes',
  '#/rsvp': 'RSVP',
  '#/tile': 'Style tile',
}

function routeOf(hash: string) {
  if (hash.startsWith('#/tile')) return '#/tile'
  if (hash.startsWith('#/rsvp')) return '#/rsvp'
  if (hash.startsWith('#/program')) return '#/program'
  if (hash.startsWith('#/gifts')) return '#/gifts'
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
  useEffect(() => armSound(), [])

  // Route changes: reset scroll, update the title, and move focus to main so keyboard and screen reader users start at the top of the new page.
  useEffect(() => {
    if (current !== '#/') setMusicLevel(0.22)
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
      <SoundButton />
      <Suspense fallback={<PageLoading />}>
        {current === '#/rsvp' ? <RsvpPage /> : current === '#/program' ? <ProgramPage /> : current === '#/gifts' ? <GiftsPage /> : <JourneyPage />}
      </Suspense>
      <SiteFooter event={wedding} />
    </>
  )
}
