import { useMemo, useState } from 'react'
import type { EventConfig } from '../../data/events/types.ts'
import { clockAt, sceneAt, sceneStyle } from '../../lib/scene.ts'
import MapCanvas from '../map/MapCanvas.tsx'
import ModeSwitch from '../scene/ModeSwitch.tsx'
import TimeScrubber from '../scene/TimeScrubber.tsx'
import { happeningAt, itemsForMainDay } from './dayData.ts'
import type { TimedItem } from './dayData.ts'
import DayTimeline from './DayTimeline.tsx'
import NowPanel from './NowPanel.tsx'

interface DayExplorerProps {
  event: EventConfig
  /** The list of every event of the day. Left out where space is tight. */
  showTimeline?: boolean
}

/** The main day on one map: a scrubber drives the scene, and the panel says what is on at that moment. */
export default function DayExplorer({ event, showTimeline = true }: DayExplorerProps) {
  const span = event.clock.endMin - event.clock.startMin
  const items = useMemo(() => itemsForMainDay(event), [event])
  const toValue = (min: number) => Math.min(100, Math.max(0, Math.round(((min - event.clock.startMin) / span) * 100)))
  const [value, setValue] = useState(() => toValue(15 * 60 + 30)) // the ceremony
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const t = value / 100
  const minute = Math.round(event.clock.startMin + t * span)
  const scene = sceneAt(t, event.scene)
  const clock = clockAt(t, event.clock.startMin, event.clock.endMin)
  const { active, next } = happeningAt(items, minute)
  const activeItemIds = active.map((i) => i.id)
  const activePinIds = active.map((i) => i.pinId)

  const jump = (item: TimedItem) => {
    setValue(toValue(item.startMin))
    setSelectedId(item.pinId)
  }

  return (
    <div className="space-y-6">
      <MapCanvas
        map={event.map}
        pins={event.pins}
        route={null}
        selectedId={selectedId}
        activeIds={activePinIds}
        onSelect={setSelectedId}
        label={`${event.title}, map of the day`}
        sceneStyle={sceneStyle(scene)}
      />
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <NowPanel event={event} clock={clock} moment={scene.moment} active={active} next={next} onShow={setSelectedId} />
        </div>
        <div className="space-y-6 rounded-panel border-hair border-dashed border-water-deep bg-paper p-5 sm:p-6 lg:col-span-3">
          <TimeScrubber value={value} onChange={setValue} clock={clock} sceneName={scene.name} />
          <ModeSwitch value={value} onChange={setValue} />
          <p className="max-w-measure text-small">Only the map changes with the time. Panels and labels stay on fixed colors.</p>
        </div>
      </div>
      {showTimeline && <DayTimeline event={event} items={items} activeIds={activeItemIds} onJump={jump} />}
    </div>
  )
}
