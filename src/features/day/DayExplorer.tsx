import { useId, useMemo, useState } from 'react'
import type { EventConfig } from '../../data/events/types.ts'
import { clockAt, sceneAt, sceneStyle } from '../../lib/scene.ts'
import { readJson } from '../../lib/storage.ts'
import { formatMinutes } from '../../lib/time.ts'
import MapCanvas from '../map/MapCanvas.tsx'
import { project } from '../map/geometry.ts'
import { storageKey } from '../rsvp/rsvp.ts'
import type { RsvpReply } from '../rsvp/rsvp.ts'
import ModeSwitch from '../scene/ModeSwitch.tsx'
import TimeScrubber from '../scene/TimeScrubber.tsx'
import { useAvatar } from '../walk/useAvatar.ts'
import { happeningAt, itemsAfterMidnight, itemsForMainDay } from './dayData.ts'
import type { TimedItem } from './dayData.ts'
import { buildDayPath, defaultFerry, ferryRuns, guestAt } from './dayPath.ts'
import DayRoute from './DayRoute.tsx'
import DayTimeline from './DayTimeline.tsx'
import GuestMarker from './GuestMarker.tsx'
import NowPanel from './NowPanel.tsx'

interface DayExplorerProps {
  event: EventConfig
  /** The list of every event of the day. Left out where space is tight. */
  showTimeline?: boolean
}

/** What the saved reply says about the guest, in the couple's voice. */
function replyNote(reply: RsvpReply | null, ferryLabel: string) {
  if (!reply) return { text: 'You have not sent your reply yet.', link: 'Send your RSVP' }
  if (reply.status === 'confirmed') return { text: `Your reply says the ${ferryLabel} ferry. Pick another to see how the day looks on it.`, link: '' }
  if (reply.status === 'waitlist') return { text: `You are on the waitlist. This is the plan for the ${ferryLabel} ferry if a place opens.`, link: '' }
  return { text: 'You told us you cannot come. This is the day for everyone who can.', link: 'Change your reply' }
}

/** The main day on one map: a scrubber drives the scene, a guest follows the day's route, and the panel says what is on. */
export default function DayExplorer({ event, showTimeline = true }: DayExplorerProps) {
  const span = event.clock.endMin - event.clock.startMin
  const items = useMemo(() => itemsForMainDay(event), [event])
  const late = useMemo(() => itemsAfterMidnight(event), [event])
  const runs = useMemo(() => ferryRuns(event, items), [event, items])
  const [avatar] = useAvatar()
  const reply = useMemo(() => readJson<RsvpReply>(storageKey(event)), [event])
  const [ferryStart, setFerryStart] = useState<number | null>(() => {
    const said = reply && reply.status !== 'declined' ? reply.values.ferry : ''
    const match = runs.find((r) => formatMinutes(r.startMin, event.locale.hour12) === said)
    return (match ?? defaultFerry(runs))?.startMin ?? null
  })
  const ferryName = useId()
  // The scrubber runs in minutes, five at a time, so a jump to 1:00 pm lands on 1:00 pm.
  const STEP = 5
  const snap = (min: number) => Math.min(event.clock.endMin, Math.max(event.clock.startMin, Math.round(min / STEP) * STEP))
  const [minute, setMinute] = useState(() => snap(15 * 60 + 30)) // the ceremony
  const value = ((minute - event.clock.startMin) / span) * 100 // 0 to 100, for the quick-jump buttons
  const fromValue = (v: number) => snap(event.clock.startMin + (v / 100) * span)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const t = value / 100
  const scene = sceneAt(t, event.scene)
  const clock = clockAt(t, event.clock.startMin, event.clock.endMin)
  const { active, next } = happeningAt(items, minute)
  const activeItemIds = active.map((i) => i.id)
  const activePinIds = active.map((i) => i.pinId)

  const path = useMemo(() => buildDayPath(event, items, ferryStart), [event, items, ferryStart])
  const guest = path ? guestAt(path, minute) : null
  const place = (id: string) => event.pins.find((p) => p.id === id)?.title ?? ''
  const guestLine = guest ? (guest.moving ? `You are on the way to ${place(guest.pinId)}.` : `You are at ${place(guest.pinId)}.`) : ''
  const guestItem = guest && !guest.moving ? active.find((i) => i.pinId === guest.pinId) : undefined
  const chosenRun = runs.find((r) => r.startMin === ferryStart)
  const ferryLabel = chosenRun ? formatMinutes(chosenRun.startMin, event.locale.hour12) : ''
  const note = replyNote(reply, ferryLabel)

  const jump = (item: TimedItem) => {
    setMinute(snap(item.startMin))
    setSelectedId(item.pinId)
  }

  if (items.length === 0) {
    return (
      <div className="rounded-panel border-hair border-dashed border-water-deep bg-paper p-6 sm:p-10">
        <h2 className="font-display text-h2 font-extrabold">The day is not on the map yet</h2>
        <p className="mt-3 max-w-measure text-body">We have not added the schedule for the day. Check back soon, or tell us you are coming and we will write when it is ready.</p>
        <p className="mt-4">
          <a href="#/rsvp" className="font-medium text-accent underline underline-offset-4">
            RSVP
          </a>
        </p>
      </div>
    )
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
        svgExtra={path && guest ? <DayRoute path={path} spot={guest} /> : null}
        overlay={(win) => {
          if (!guest) return null
          const p = project(guest.x, guest.y, win)
          return <GuestMarker left={p.left} top={p.top} avatar={avatar} moving={guest.moving} />
        }}
      />
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <div className={showTimeline ? 'lg:sticky lg:top-20 lg:col-span-2 lg:col-start-4 lg:row-span-2 lg:row-start-1' : 'lg:col-span-2'}>
          <NowPanel
            event={event}
            clock={clock}
            moment={scene.moment}
            active={active}
            next={next}
            onShow={setSelectedId}
            onJumpNext={jump}
            guestLine={guestLine}
            artPinId={active[0]?.pinId ?? guest?.pinId ?? null}
          />
        </div>
        <div className={`space-y-6 rounded-panel border-hair border-dashed border-water-deep bg-paper p-5 sm:p-6 lg:col-span-3 ${showTimeline ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
          <TimeScrubber value={minute} onChange={setMinute} clock={clock} sceneName={scene.name} min={event.clock.startMin} max={event.clock.endMin} step={STEP} />
          <ModeSwitch value={value} onChange={(v) => setMinute(fromValue(v))} legend="Quick jump" />
          {runs.length > 1 && (
            <fieldset>
              <legend className="font-display text-h3 font-extrabold">Your ferry</legend>
              <p className="mt-1 max-w-measure text-small">
                {note.text}
                {note.link && (
                  <>
                    {' '}
                    <a href="#/rsvp" className="font-medium text-accent underline underline-offset-4">
                      {note.link}
                    </a>
                    .
                  </>
                )}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {runs.map((r) => (
                  <label
                    key={r.id}
                    className="min-h-11 cursor-pointer rounded-pill border-hair border-accent px-6 py-2.5 font-medium text-accent transition duration-micro ease-standard has-[:checked]:bg-accent has-[:checked]:text-paper has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
                  >
                    <input type="radio" name={ferryName} className="sr-only" checked={ferryStart === r.startMin} onChange={() => setFerryStart(r.startMin)} />
                    {formatMinutes(r.startMin, event.locale.hour12)}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>
        {showTimeline && (
          <div className="lg:col-span-3 lg:col-start-1 lg:row-start-2">
            <DayTimeline
              event={event}
              items={items}
              afterMidnight={late}
              activeIds={activeItemIds}
              ferryId={chosenRun?.id ?? null}
              guestItemId={guestItem?.id ?? null}
              avatar={avatar}
              onJump={jump}
            />
          </div>
        )}
      </div>
    </div>
  )
}
