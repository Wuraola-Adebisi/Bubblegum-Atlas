/** Token names only. Values are read live from CSS, so index.css stays the single source of truth. */
export const primitives = [
  'pink-50', 'pink-100', 'pink-200', 'pink-400', 'pink-700',
  'blue-200', 'blue-500',
  'green-300', 'green-600', 'green-800',
  'yellow-300', 'orange-400', 'orange-800', 'red-700',
  'navy-800', 'white',
] as const

export const semantic = [
  { name: 'ground', source: 'pink-50', role: 'Page background' },
  { name: 'paper', source: 'white', role: 'Label cards, roads, sticker outlines, panels' },
  { name: 'land', source: 'pink-200', role: 'The hero landmass and large fills' },
  { name: 'land-strong', source: 'pink-400', role: 'Illustration pink and feature fills' },
  { name: 'accent', source: 'pink-700', role: 'Buttons, banners, small text in the pink world' },
  { name: 'water', source: 'blue-200', role: 'Water and secondary ground' },
  { name: 'water-deep', source: 'blue-500', role: 'Strong blue ground and tags' },
  { name: 'park', source: 'green-300', role: 'Parks and positive fills' },
  { name: 'park-deep', source: 'green-600', role: 'Large display type only' },
  { name: 'glow', source: 'yellow-300', role: 'Lights and highlights' },
  { name: 'flag', source: 'orange-400', role: 'Flags and accents' },
  { name: 'ink', source: 'navy-800', role: 'All text and leader lines' },
  { name: 'success', source: 'green-800', role: 'Success text' },
  { name: 'warning', source: 'orange-800', role: 'Warning text' },
  { name: 'error', source: 'red-700', role: 'Error text' },
] as const

/** intent: text needs 4.5, large needs 3, forbidden pairs should never carry text */
export interface Pair {
  fg: string
  bg: string
  use: string
  intent: 'text' | 'large' | 'forbidden'
}

export const pairs: Pair[] = [
  { fg: 'ink', bg: 'ground', use: 'Any text on the page', intent: 'text' },
  { fg: 'ink', bg: 'paper', use: 'Any text on cards and pills', intent: 'text' },
  { fg: 'ink', bg: 'land', use: 'Text on the landmass', intent: 'text' },
  { fg: 'ink', bg: 'water', use: 'Text on water', intent: 'text' },
  { fg: 'ink', bg: 'park', use: 'Text on parks', intent: 'text' },
  { fg: 'ink', bg: 'glow', use: 'Text on yellow highlights', intent: 'text' },
  { fg: 'ink', bg: 'flag', use: 'Text on orange flags', intent: 'text' },
  { fg: 'accent', bg: 'ground', use: 'Small accent text on the page', intent: 'text' },
  { fg: 'paper', bg: 'accent', use: 'Button and pill labels', intent: 'text' },
  { fg: 'accent', bg: 'land', use: 'Accent text on the landmass', intent: 'large' },
  { fg: 'park-deep', bg: 'ground', use: 'Large display type', intent: 'large' },
  { fg: 'ink', bg: 'water-deep', use: 'Text on strong blue', intent: 'large' },
  { fg: 'success', bg: 'paper', use: 'Success messages', intent: 'text' },
  { fg: 'warning', bg: 'paper', use: 'Warning messages', intent: 'text' },
  { fg: 'error', bg: 'paper', use: 'Error messages', intent: 'text' },
  { fg: 'paper', bg: 'land-strong', use: 'White text on bright pink', intent: 'forbidden' },
  { fg: 'paper', bg: 'water-deep', use: 'White text on strong blue', intent: 'forbidden' },
]
