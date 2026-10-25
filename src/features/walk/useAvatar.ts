import { useState } from 'react'
import { readJson, writeJson } from '../../lib/storage.ts'

export type AvatarStyle = 'suit' | 'dress'

export interface AvatarChoice {
  style: AvatarStyle
  skin: string
}

/** Skin tones from the illustration kit. */
export const skinTones = ['#F6D5BD', '#E3AE8A', '#C68A62', '#94603F', '#5E3B28']
export const hairFor: Record<AvatarStyle, string> = { suit: '#2B2118', dress: '#5A3A22' }

const KEY = 'ba:avatar'
const fallback: AvatarChoice = { style: 'suit', skin: skinTones[2] }

export function useAvatar() {
  const [choice, setChoice] = useState<AvatarChoice>(() => {
    const saved = readJson<AvatarChoice>(KEY)
    return saved && skinTones.includes(saved.skin) && (saved.style === 'suit' || saved.style === 'dress') ? saved : fallback
  })
  const update = (next: Partial<AvatarChoice>) =>
    setChoice((prev) => {
      const merged = { ...prev, ...next }
      writeJson(KEY, merged)
      return merged
    })
  return [choice, update] as const
}
