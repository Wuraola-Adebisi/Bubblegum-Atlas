import { useMemo, useState } from 'react'
import type { EventConfig } from '../../data/events/types.ts'
import { clockAt, sceneAt, sceneStyle } from '../../lib/scene.ts'
import ModeSwitch from '../scene/ModeSwitch.tsx'
import TimeScrubber from '../scene/TimeScrubber.tsx'
import LegendCard from './LegendCard.tsx'
import MapCanvas from './MapCanvas.tsx'
import PinDetails from './PinDetails.tsx'
import PinList from './PinList.tsx'
import RouteSteps from './RouteSteps.tsx'

const toggle =
  'min-h-11 cursor-pointer rounded-pill border-hair border-accent px-5 py-2 font-medium transition duration-micro ease-standard'

export default function MapExplorer({ event }: { event: EventConfig }) {
  const [layerOn, setLayerOn] = useState<Set<string>>(() => new Set(event.layers.map((l) => l.id)))
  const [view, setView] = useState<'map' | 'list'>('map')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [routeId, setRouteId] = useState<string | null>(event.routes[0]?.id ?? null)
  const [sceneValue, setSceneValue] = useState(33)

  const visiblePins = useMemo(() => event.pins.filter((p) => p.layerIds.some((id) => layerOn.has(id))), [event.pins, layerOn])
  const selected = visiblePins.find((p) => p.id === selectedId) ?? null
  const route = event.routes.find((r) => r.id === routeId) ?? null

  const t = sceneValue / 100
  const scene = sceneAt(t, event.scene)
  const clock = clockAt(t, event.clock.startMin, event.clock.endMin)

  const toggleLayer = (id: string) =>
    setLayerOn((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Map or list">
        <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')} className={`${toggle} ${view === 'map' ? 'bg-accent text-paper' : 'bg-paper text-accent'}`}>
          Map view
        </button>
        <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')} className={`${toggle} ${view === 'list' ? 'bg-accent text-paper' : 'bg-paper text-accent'}`}>
          List view
        </button>
      </div>

      {view === 'map' ? (
        <MapCanvas
          map={event.map}
          pins={visiblePins}
          route={route}
          selectedId={selected?.id ?? null}
          onSelect={setSelectedId}
          label={`${event.title}, map of Harbor Quay and Larkmere Estate`}
          sceneStyle={sceneStyle(scene)}
        />
      ) : (
        <PinList zones={event.zones} pins={visiblePins} selectedId={selected?.id ?? null} onSelect={setSelectedId} />
      )}

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <PinDetails event={event} pin={selected} onRoute={setRouteId} onClose={() => setSelectedId(null)} />
        <LegendCard layers={event.layers} layerOn={layerOn} onToggleLayer={toggleLayer} routes={event.routes} routeId={routeId} onRoute={setRouteId} />
      </div>

      <div className="rounded-panel border-hair border-dashed border-water-deep bg-paper p-4 sm:p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <ModeSwitch value={sceneValue} onChange={setSceneValue} />
          <TimeScrubber value={sceneValue} onChange={setSceneValue} clock={clock} sceneName={scene.name} />
        </div>
        <p className="mt-3 max-w-measure text-small" aria-live="polite">
          {scene.moment}. Only the map changes with the time. Panels and labels stay on fixed colors.
        </p>
      </div>

      <RouteSteps routes={event.routes} pins={event.pins} routeId={routeId} />
    </div>
  )
}
