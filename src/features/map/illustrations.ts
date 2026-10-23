// Every SVG is imported as text so it can be inlined. Inlining lets the scene variables
// (--scene-halo, --scene-glow) reach the artwork, which an <img> tag cannot do.
const raw = import.meta.glob('../../assets/illustrations/**/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export interface Illustration {
  svg: string
  /** The illustration's own viewBox size, used to size it in map units. */
  width: number
  height: number
}

export const illustrations: Record<string, Illustration> = {}

for (const [path, svg] of Object.entries(raw)) {
  const id = path.split('/').pop()!.replace('.svg', '')
  const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg)
  illustrations[id] = { svg, width: m ? Number(m[1]) : 100, height: m ? Number(m[2]) : 100 }
}
