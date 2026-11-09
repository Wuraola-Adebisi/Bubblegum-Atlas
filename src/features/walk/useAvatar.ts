export type AvatarStyle = 'suit' | 'dress'

export interface AvatarChoice {
  style: AvatarStyle
  skin: string
}

/** The guest is one neutral figure, so there is nothing for a visitor to pick. Its colors come from the palette. */
export const hairFor: Record<AvatarStyle, string> = { suit: 'var(--color-ink)', dress: 'var(--color-ink)' }
const guest: AvatarChoice = { style: 'suit', skin: 'var(--color-water-deep-wash)' }

export function useAvatar() {
  return [guest] as const
}
