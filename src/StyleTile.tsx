import Contrast from './tile/Contrast.tsx'
import Hero from './tile/Hero.tsx'
import LineSystem from './tile/LineSystem.tsx'
import Palette from './tile/Palette.tsx'
import SceneStrip from './tile/SceneStrip.tsx'
import Section from './tile/Section.tsx'
import ShapesControls from './tile/ShapesControls.tsx'
import Typography from './tile/Typography.tsx'

const links = [
  { id: 'palette', label: 'Color' },
  { id: 'contrast', label: 'Contrast' },
  { id: 'type', label: 'Type' },
  { id: 'lines', label: 'Lines' },
  { id: 'shape', label: 'Shape' },
  { id: 'scene', label: 'Scene' },
]

export default function StyleTile() {
  return (
    <>
      <a
        href="#main"
        className="absolute left-4 -translate-y-20 rounded-pill bg-paper px-4 py-2 focus:translate-y-4"
      >
        Skip to content
      </a>
      <nav aria-label="Style tile sections" className="mx-auto w-fit max-w-full px-4 pt-4 sm:sticky sm:top-4 sm:z-10 sm:pt-0">
        <ul className="flex flex-wrap justify-center gap-1 rounded-panel border-2 border-water bg-paper p-2 sm:rounded-pill">
          {links.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className="block rounded-pill px-4 py-2 text-small font-medium transition duration-micro ease-standard hover:bg-land">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main id="main">
        <Hero />
        <Section id="palette" title="Color" note="Pink is the ground and the land, never a small accent. White does the structural work: roads, label cards and sticker outlines. Hex values are read live from the CSS variables.">
          <Palette />
        </Section>
        <Section id="contrast" title="Contrast" note="Every text and background pair is measured from the live token values. Text never sits directly on bright pink or on strong blue in white.">
          <Contrast />
        </Section>
        <Section id="type" title="Type" note="Three voices: a chunky display face, handwriting for labels, and a clean body face. Sentence case everywhere.">
          <Typography />
        </Section>
        <Section id="lines" title="Lines" note="Roads, leader lines, routes and contours. The route draws on once when the page loads, and the replay button runs it again.">
          <LineSystem />
        </Section>
        <Section id="shape" title="Shape, depth and controls" note="Radius is a scale, not one value. Shadows are off by default. The only shadow is a flat offset under buttons.">
          <ShapesControls />
        </Section>
        <Section id="scene" title="Scene shift" note="The signature interaction in miniature. One value drives the sky, water, land and park colors, and the lights switch on toward dusk.">
          <SceneStrip />
        </Section>
      </main>

      <footer className="mx-auto w-full max-w-7xl px-6 pt-12 pb-24 sm:px-10">
        <p className="max-w-measure text-small">
          Tokens live in src/index.css. Change a value there and the swatches and the contrast table above update on reload.
        </p>
      </footer>
    </>
  )
}
