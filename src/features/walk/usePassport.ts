import { useRef, useState } from 'react'
import type { EventConfig } from '../../data/events/types.ts'
import { readJson, removeKey, writeJson } from '../../lib/storage.ts'

export const passportKey = (event: EventConfig) => `ba:passport:${event.id}`

/** Collected stamps, saved in the browser. `collect` is safe to call many times for the same stamp. */
export function usePassport(event: EventConfig) {
  const key = passportKey(event)
  const [got, setGot] = useState<string[]>(() => (readJson<string[]>(key) ?? []).filter((id) => event.passport.stamps.some((s) => s.pinId === id)))
  const [landed, setLanded] = useState<string | null>(null)
  const gotRef = useRef(got)
  const timer = useRef<number | undefined>(undefined)

  const collect = (pinId: string) => {
    if (gotRef.current.includes(pinId) || !event.passport.stamps.some((s) => s.pinId === pinId)) return
    const next = [...gotRef.current, pinId]
    gotRef.current = next
    setGot(next)
    writeJson(key, next)
    setLanded(pinId)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setLanded(null), 4000)
  }

  const reset = () => {
    gotRef.current = []
    setGot([])
    setLanded(null)
    removeKey(key)
  }

  return { got, landed, collect, reset, total: event.passport.stamps.length }
}
