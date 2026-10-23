/** Swatch classes per layer id. Written out in full so Tailwind can see them. */
export const layerSwatch: Record<string, string> = {
  stay: 'bg-park',
  eat: 'bg-flag',
  explore: 'bg-land-strong',
  'getting-around': 'bg-water-deep',
}

export const swatchFor = (layerId: string | undefined) => (layerId && layerSwatch[layerId]) || 'bg-accent'
