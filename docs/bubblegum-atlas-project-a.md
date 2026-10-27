# Project A: Bubblegum Atlas

Design system and build brief. Read together with `studio-playbook.md` (the playbook holds the general rules, this file holds everything specific to Project A). If they disagree, this file wins.

Last updated: 2026-10-23. Stage: 8 and 9 (components and pages). Build steps 3 to 5 and most of step 6 (RSVP boarding pass, share card, story trail, home page as an unwinding map) are built and checked in headless Chromium, awaiting a real-browser check. Build step 6 (story trail, plan, party, RSVP, share card, info) is next.

---

## 1. Decision log

### Decided (the owner said it or chose it)
- Style name: **Bubblegum Atlas**. Airy, not dense.
- Cartography is central to the concept.
- Inspo is a guide and scaffold only. We add our own flair and may change contrast, lettering and other elements to fix problems.
- Project A is a website project built as an **atlas engine with two deliverables**: a **wedding weekend** site and a **brand pop-up or launch** site. Wedding first, pop-up second. The waterfront festival idea is dropped for now.
- Audience is foreign (US and UK). No Nigerian theming.
- Realistic and replicable: prospective clients should be able to picture ordering a version of it.
- Nothing static. The owner loves the ferry-crossing opening, the time-of-day scrubber, and all the proposed dynamic features.
- The owner cannot illustrate. Claude writes the illustrations as SVG from a spec.
- Work is shared on social media to win clients. A short recording of the signature interaction is a deliverable.
- The style tile and the illustration test sheet are approved (2026-10-23).
- Illustration and map look: the deep v1 palette and three-tone shading, a thin 1.5 px outline over every shape, and no thick white borders. White is a fill and never a border wider than 3 px. The pale-tint version was tried and not chosen. The owner loves the characters and the line-art shapes and wants them kept for all visuals.
- A Day, Dusk and Night mode switch, so the yellow in windows and string lights comes out bright at night.
- The owner works on Windows with VS Code, PowerShell and Node 24 in her own repo (https://github.com/Wuraola-Adebisi/Bubblegum-Atlas, public) and runs every command herself. Claude gives complete files or a zip with exact steps. `npm create` fails on her machine. No co-author credit for Claude on commits.

- Animation library: Framer Motion (`motion/react`), chosen 2026-10-23.

- The home page below the journey is an unwinding map, not plain white sections. Each section is a station: a place on the estate with its own illustrations and text, tied to it by a leader line. A guest avatar (suit or dress, with a skin tone choice) walks a dotted path down the page as you scroll (2026-10-25).
- The story trail and passport stamps are part of that walk: the guest collects a stamp at five stops, and the story page unlocks a chapter per stamp (2026-10-25).

### Proposed (awaiting confirmation)
- All hex values in section 5 (estimated from the images, contrast verified on the style tile; confirm the look with a sampler).
- Type pairing: Sora (display and body) and Pacifico (script labels). Replaced Bricolage Grotesque, Caveat and DM Sans on 2026-10-25 at the owner's request.
- Flair: cartographic furniture as UI (legend as menu, scale bar as progress, compass rose as logo and back-to-top), contour-line texture on land, label pills with a hairline berry border.
- Hairline buttons and label pills (paper fill, 1.5 px berry border). The pale wash tokens stay in the system for soft fills only.
- Night keyframe values and the night dimming amount in sections 5.2 and 7.
- Stack choices in section 10 (animation library, share card library).
- Wedding setting, placeholder names and dates in section 11.
- Pop-up working brand and category in section 12.
- Case study switcher showing both builds on one engine.
- Performance and accessibility targets in section 17.
- Step 3 additions to the `EventConfig` types (all optional except `clock`): `EventConfig.clock`, `MapConfig.waves`, `Pin.labelSide`, `Route.note`. Placement `scale` multiplies the illustration's own viewBox width. Section 10 gets updated once these are confirmed.
- Map keyboard model: arrow keys move focus to the nearest place in that direction, Enter opens details, Shift with arrows pans, plus and minus zoom, 0 resets, Escape closes details.
- Hash routing until React Router arrives with step 6: `#/` home, `#/day` the day, `#/map` map, `#/rsvp` RSVP stub, `#/tile` style tile.
- Journey (step 4, bird's-eye version): a full-screen sticky stage over 650vh of scroll, seen from above with the whole estate in view (zoom 0.7 to 1.05, water extends past the map so wide short windows are not cropped). A spring smooths the scroll. It opens on the whole map with two labelled places and a faint route preview, holds still between moves, and the camera and chapter text follow. Buildings are interactive: hover lifts them, click or Enter makes them hop, throws a star burst and opens a short note; a star trail follows a mouse. Twinkles sit on the water, the ferry leaves a wake and puffs smoke as the page scrolls, and the walker uses the avatar chosen lower down the page. Reduced motion shows the finished state with no twinkles, bursts or swing. A floating `NavPill` links the pages, `#/rsvp` is the RSVP, and a skip link jumps to the final card.

### Open
- Final couple names, venue name and dates (placeholders for now).
- Pop-up brand name and product category.
- Whether to include a passcode gate on the wedding site.
- Whether to include optional ambient sound (default: no).
- Repo names and domains.
- Whether the hairlines read well on a real phone (not yet checked in a real browser).
- Where the Day, Dusk and Night switch sits in the page layouts, and whether it replaces or sits beside the continuous scrubber on the wedding site.

---

## 2. Project summary

One design system, one data-driven map engine, two sites.

| | Build 1: Wedding weekend | Build 2: Brand pop-up |
|---|---|---|
| Client type | Individual or couple with an event | Brand launching a pop-up |
| Opening journey | Ferry crossing to a lakeside estate | A courier rides a route across a city map to the pop-up |
| Time-of-day scrubber | The wedding day, hour by hour | Best time to visit: workshops, drops, crowd levels |
| Plan | Guest weekend itinerary | Visit plan and slot booking |
| Passport | Story trail that unlocks chapters | Loyalty trail that unlocks a reward |
| Share card | RSVP card or personal itinerary | My picks card and completion badge |
| Flip cards | The wedding party | Flavors, products, collaborators |
| Countdown | Departure board to the ferry and the day | Departure board to the next drop |
| Pass | Boarding-pass RSVP | Reservation or VIP pass |

Replicability claim (keep it honest in the case study): a new event is a new data file plus a small illustration set and a palette tweak inside the system. Fully custom illustration for a real client is a separate line item.

---

## 3. Style identity

**Name:** Bubblegum Atlas

**Definition:** An airy, hand-drawn cartographic style. A bubblegum-pink landmass floats on white or pastel blue, traced in white roads, with oversized illustrated landmarks and handwritten wayfinding labels.

**Keywords (the filter for every decision):** airy, charted, hand-lettered, candy-pastel, playful wayfinding.

**Signature moves:**
1. A pink landmass as the hero shape, with white linework as its structure.
2. Landmarks and objects drawn far bigger than the map around them.
3. Handwritten labels tied to places by thin leader lines ending in dots.
4. A thin berry hairline over every illustration shape, and no thick white borders anywhere.
5. A dashed route that links content into a path.

**The one memorable thing:** the hero map shape and its journey. Everything else stays quiet.

**Anti-patterns:** black outlines and hard black shadows, white borders thicker than 3 px, white sticker outlines, solid pink masses over about a third of the viewport, gradients and glassmorphism, neon or cold greys, stock icon sets, white text on bright pink, tiny low-contrast handwriting, centered symmetrical card grids, one radius on everything, realistic photography.

---

## 4. Inspo analysis (summary)

Twelve illustrated maps (neighborhood posters, city maps, food maps, a school anniversary piece, an album promo). Credit the board and its artists in the case study; named artists include Elly Walton, Livi Gosling, Dina Ruzha, Sandra Neuditschko and Astrid Prasetianti. We borrow principles only.

**What recurs:**
- Pink is the ground, never just an accent. It runs from blush to bubblegum to hot magenta, always as land, always against a contrasting field (white, cream, sky blue, periwinkle).
- Supporting cast: pastel blue water, mint or emerald parks, butter yellow and tangerine and coral accents, navy as the text color.
- White does the structural work as a fill: roads, label cards, panels and generous margins. This is where the airy feel comes from. It is never used as a thick border.
- Big scale contrast between a heavy title and tiny handwritten annotations.
- Three label modes: colored flags or tags with white text, dark pills, plain handwriting with leader lines.
- Illustration ranges from flat vector to gouache to isometric. One palette per image, no black outlines.
- Filler motifs fill the gaps: lollipop trees, tulips, waves, tiny people.
- Dashed routes with arrows turn a map into a sequence.

**Outliers.** Dense editorial infographic panels (Caballito) are used for at most one information section. The saturated Dallas magenta is a ceiling for color intensity. The painterly London texture is out of scope as a medium.

---

## 5. Foundations

### 5.1 Color (hex values estimated from the images, contrast verified; confirm the look with a sampler)

Primitives:

| Token | Hex |
|---|---|
| pink-50 | #FFF6F8 |
| pink-100 | #FFE3EC |
| pink-200 | #FFC9DB |
| pink-400 | #FF8FB8 |
| pink-700 | #B0306B |
| blue-50 | #DFF2F8 |
| blue-100 | #D1DBF4 |
| blue-200 | #BFE4F0 |
| blue-500 | #6F8FDB |
| green-100 | #CFEDDE |
| green-300 | #A8DEC3 |
| green-600 | #17935F |
| green-800 | #0F6B45 |
| yellow-300 | #FFE08A |
| orange-400 | #FF9B54 |
| orange-800 | #9A4A00 |
| red-700 | #B3261E |
| navy-800 | #1F2F6B |
| white | #FFFFFF |

Semantic roles:

| Token | Source | Role |
|---|---|---|
| --color-ground | pink-50 | page background |
| --color-paper | white | label cards, road lines, panels (a fill, never a thick border) |
| --color-land | pink-200 | the hero landmass and large fills |
| --color-land-wash | pink-100 | soft fills, hover states, pale pills |
| --color-land-strong | pink-400 | illustration pink, feature fills |
| --color-accent | pink-700 | buttons, banners, small text in the pink world |
| --color-water | blue-200 | water and secondary ground |
| --color-water-wash | blue-50 | soft backgrounds |
| --color-water-deep | blue-500 | strong blue ground, tags, track lines, dashed borders, waves |
| --color-water-deep-wash | blue-100 | soft blue tints |
| --color-park | green-300 | parks and positive fills |
| --color-park-wash | green-100 | soft park tints |
| --color-park-deep | green-600 | large display type only |
| --color-glow | yellow-300 | lights, highlights |
| --color-flag | orange-400 | flags and accents |
| --color-ink | navy-800 | all text and leader lines |
| --color-success | green-800 | success text |
| --color-warning | orange-800 | warning text |
| --color-error | red-700 | error text |

Contrast (verified on 2026-10-21, measured from the live token values on the style tile page):

| Pair | Ratio | Use |
|---|---|---|
| ink on ground | 11.80:1 | any text |
| ink on paper | 12.52:1 | any text |
| ink on land | 8.72:1 | any text |
| ink on water | 9.28:1 | any text |
| ink on park | 8.29:1 | any text |
| ink on glow | 9.71:1 | any text |
| ink on flag | 6.00:1 | any text |
| accent on ground | 5.68:1 | small text OK |
| white on accent | 6.03:1 | buttons and pills |
| accent on land | 4.20:1 | large text only |
| park-deep on ground | 3.68:1 | large display type only |
| ink on water-deep | 3.95:1 | large text only (found during verification) |
| success on paper | 6.54:1 | status text |
| warning on paper | 6.26:1 | status text |
| error on paper | 6.54:1 | status text |
| white on land-strong | 2.13:1 | forbidden |
| white on water-deep | 3.17:1 | forbidden for small text |
| ink on land-wash | 10.40:1 | any text |
| ink on water-wash | 10.85:1 | any text |
| ink on park-wash | 10.03:1 | any text |
| ink on water-deep-wash | 9.03:1 | any text |
| accent on land-wash | 5.01:1 | small text OK |
| accent on water-wash | 5.23:1 | small text OK |
| accent on paper | 6.03:1 | button text and borders |
| water-deep on paper | 3.17:1 | UI lines only (scrubber track, dashed borders) |
| water-deep on water-wash | 2.75:1 | decoration only (waves) |

Rule: text never sits directly on bright pink or on strong blue. Labels sit on paper or accent pills.

### 5.2 Scene keyframes (time-of-day, five stops)

Only the map canvas shifts. UI chrome stays constant so contrast is guaranteed. Values are in `src/lib/scene.ts`.

| Keyframe | t | sky | water | land | park | glow | halo |
|---|---|---|---|---|---|---|---|
| morning | 0 | #FFE9EF | #CBE8F2 | #FFC9DB | #B6E4CD | 0 | 0 |
| midday | 0.30 | #F4FBFF | #BFE4F0 | #FFC9DB | #A8DEC3 | 0 | 0 |
| golden | 0.55 | #FFE8CC | #B8C9E6 | #FFB9C9 | #A5D4B4 | 0.3 | 0 |
| dusk | 0.78 | #D9D3F3 | #6F8FDB | #F7A8C8 | #7FBF9F | 1 | 0.3 |
| night | 1 | #1E2457 | #2B3A7E | #D982AE | #3F8F6E | 1 | 1 |

Glow (`--scene-glow`) drives the lit yellow of windows, lanterns and string lights. Halo (`--scene-halo`) drives the night look: every illustration fill is pulled up to 38 percent toward deep navy, lit windows get a soft yellow bloom made of a larger translucent shape (no blur filter), and stars and a moon appear on the scene. The 0.78 stop is the first dance, about 8:30 pm on the wedding clock.

### 5.3 Typography (Proposed)

- **Display:** Sora, weight 800. Clean, wide and friendly.
- **Hand:** Pacifico, one weight (never faked bolder), for map labels, captions and asides. Minimum 20px, line height 1.45. Never body text.
- **Body and UI:** Sora 400 and 500.
- All three are on Google Fonts. Subset them and limit weights.

Scale:

| Style | Size | Line height | Notes |
|---|---|---|---|
| display | clamp(2.75rem, 7vw, 6rem) | 0.92 | tracking -0.02em |
| h1 | clamp(2.125rem, 5vw, 3.75rem) | 1 | |
| h2 | clamp(1.5rem, 3vw, 2.375rem) | 1.1 | |
| h3 | 1.5rem | 1.2 | |
| body | 1.0625rem | 1.6 | max 70ch |
| small | 0.875rem | 1.5 | |
| hand label | 1.25rem | 1.45 | Pacifico |

Rules: sentence case, no all-caps labels. Big titles sit in a white banner or a tilted tag so the type is part of the picture. No single-word accents in headlines.

### 5.4 Spacing, layout, shape

- 4px base. Steps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Section padding: `clamp(4rem, 10vw, 9rem)`.
- 12-column grid, 1280px max width, wide gutters. Illustrations may break the grid and overlap edges. Compositions are asymmetric with space around each piece.
- Radius scale: blob (SVG shapes) for hero forms, 28px for panels, 999px for pills and tags, small cut-angle ends for banners and flags.
- Borders: 1.5px berry hairlines on illustrations, buttons and label pills. No white border is wider than 3px. 2px dashed water-deep border on legend cards.
- Shadows: none by default. One exception: a flat 3px offset in pink-200 under primary buttons, dropping to 1px when pressed.
- Texture: contour lines on land (Proposed), 1px at low contrast. No SVG turbulence filters over large areas.

### 5.5 Line system

- Roads: white, 3px at hero scale, round joins and caps.
- Leader lines: 1.5px navy ending in a 6px filled dot.
- Routes: dashed 2.5px with round caps, dash pattern 1 and 9, accent or deep-blue color, arrowheads at turns.
- Map outline: 1.5px berry (pink-700) hairline coastline.
- Contour lines (texture): 1px, land color mixed 15 percent toward white.
- Waves: 1.5px water-deep lines.
- Illustration outline: 1.5px hairline that stays 1.5px at every scale (`vector-effect: non-scaling-stroke`), one line color per piece. Minimum 1px on mobile.

---

## 6. Cartographic furniture (Proposed flair)

Cartography tools become interface:
- **Legend card as menu.** The legend lists the pages and layers. Tapping an item scrolls or toggles.
- **Scale bar as progress.** A scale bar fills as the visitor scrolls or completes the passport.
- **Compass rose** as the logo mark (hand-built SVG), the loader, and the back-to-top control.
- **Label pills** are paper with a 1.5px berry border and ink text, which fixes the white-on-pink contrast problem and becomes a recognizable label of our own. Solid berry flags with white text are the accent label.

---

## 7. Illustration kit spec

Illustrations are written as SVG by Claude. Flat vector, limited shading, consistent rules.

**Shape language.** Rounded corners, chunky simplified forms, slightly exaggerated proportions, no fine detail below 2 units at design scale.

**Outline.** Every shape carries a 1.5 px hairline in one line color per piece (berry by default, green for the tree). There is no white sticker silhouette and no black outline. The ferry uses berry too, so nothing disappears into night water.

**Shading.** Three tones per fill: base, shade (base mixed 14 percent with navy), highlight (base mixed 40 percent with white). Light comes from the top left, so shade sits on the right and bottom. No gradients. At night every tone is pulled toward navy by `--scene-halo` (up to 38 percent).

**Color use.** Each piece uses 5 to 7 colors from the palette. Fills use CSS variables so the scene system can theme them.

**Glow elements.** Windows, lanterns and string lights use `--scene-glow` to fade the lit yellow in toward dusk, and `--scene-halo` to add a soft bloom behind them at night.

**Scale ladder (map viewBox 1600 by 1000):**
- Hero landmarks: 140 to 260 units wide
- Medium props: 60 to 120
- People: 28 to 36 tall
- Trees: 40 to 70 tall
- Filler motifs: 12 to 30

**People.** Capsule bodies, circle heads, no faces, clothing from the palette.
- Skin tones: #F6D5BD, #E3AE8A, #C68A62, #94603F, #5E3B28
- Hair: #2B2118, #5A3A22, #C98B3B, #D9C7A3, plus playful dyed options in pink-400 and blue-500

**Accessibility and weight.** Each hero piece has a `<title>`. Decorative filler is hidden from assistive tech. Budget under 8 KB gzipped per hero piece. Shared shapes via `<symbol>`.

**Naming.** `landmark-ferry.svg`, `prop-lantern.svg`, `person-guest-01.svg`. Classes namespaced per piece (for example `.ferry-hull`).

**Process.** Draw the test sheet first (ferry, estate house, tree, two people), render to PNG, review, then continue. The owner can refine any SVG in Figma.

**Test sheet (approved 2026-10-23).** Five pieces: `landmark-ferry`, `landmark-estate`, `prop-tree-round`, `person-guest-01`, `person-guest-02`, in `src/assets/illustrations/wedding` and `shared`. Each is 0.6 to 1.6 KB gzipped, far under the 8 KB budget. View them at `/illustration-sheet.html` in the dev server (Day, Dusk and Night switch, time slider, map-scale and phone-width views, and version 1 underneath for comparison).
- Generated from `tools/illustrations/gen.py`. Pieces are shape lists plus a part-to-color map, so edits are a change to the script and a re-run (`python tools/illustrations/gen.py` from the repo root). Styles: `deep-line` (default, the current look), `deep` (no outline), `light` (pale tints, tried and not chosen), `v1` (the original, byte-identical to the first commit). `python tools/illustrations/build_sheet.py` rebuilds the sheet and `public/illustration-v1`.
- Every fill is a CSS variable with a hex fallback, so inlined SVGs follow the tokens and standalone files still render.
- Windows have a base fill, a halo shape and a glow layer, driven by `--scene-halo` and `--scene-glow`.
- People take `--skin` and `--hair` as inline CSS variables, so any tone from the palette can be set per instance.
- SVGs must be inlined (as React components or raw imports) for the CSS variables to reach them. An `<img>` tag will show the hex fallbacks, so it cannot show night.


**Asset list, Build 1 (wedding):** ferry, jetty, estate house, ceremony arch with flowers, reception marquee with string lights, boathouse, lakeside cafe, guest hotel, shuttle bus, wedding cake, plus a bridal-party group of simple figures.

**Asset list, Build 2 (pop-up):** storefront with neon sign, sample bar, flavor lab (build-your-own counter), photo wall, drop counter kiosk, DJ corner, courier bike and delivery van, queue ropes, neighboring cafe, product can or bottle set.

**Filler (both):** lollipop trees, hydrangea or flower bushes, waves, gulls, small boats, balloons, lanterns, clouds, tiny people.

---

## 8. Motion spec

**Signature moment (home):** the journey. As the visitor scrolls, a vehicle follows a dashed route across the map (ferry for the wedding, courier for the pop-up). The route draws itself, zones and pins appear as the vehicle passes them.

**Responsive motion:**
- Hovered or focused landmark lifts 4px and tilts 1.5 degrees, and its label tag slides open.
- Pins pop in sequence (pop easing).
- Stamps land with a quick scale and settle.
- Scene shift follows the scrubber directly with no easing delay.
- The Day, Dusk and Night switch moves the slider to a preset with no easing, so it works unchanged in reduced motion.

**Ambient (one only):** gently drifting water on a 12 second loop.

**Timing:** micro 160 ms, standard 280 ms, hero sequences 600 to 1600 ms.

**Easing:** standard `cubic-bezier(.2,.8,.2,1)`, pop `cubic-bezier(.34,1.56,.64,1)`.

**Reduced motion:** no draw-on, no ambient drift, no vehicle travel. The vehicle sits at the destination, the full route is visible, content shows in its final state, the scrubber still works.

**Performance:** animate transform and opacity. Pause the ambient loop offscreen.

---

## 9. Component list

Each component gets a full spec (playbook section 9 template) when built.

| Component | Purpose | Variants and states | Notes |
|---|---|---|---|
| MapCanvas | SVG map scaled by viewBox | static, interactive, zoomed | Keyboard pan and zoom, list-view toggle. Labels are HTML overlays positioned by percent, never SVG text, so they stay at 20px or larger at every width. On narrow screens secondary labels move to a list |
| Pin | Marker for a place | numbered, unnumbered, active, visited, disabled | 24px visible, 44px hit area. Numbered only when the content is a sequence |
| LabelTag | Place label | flag, pill, handwritten | Pills are paper with a 1.5px berry border and ink text. Flags are solid accent with white text |
| LeaderLine | Connects label and place | default | 1.5px navy, dot end |
| LegendCard | Menu and key | collapsed, expanded | Dashed water border, doubles as navigation |
| ScaleBar | Progress indicator | scroll, passport | Labelled with miles or steps in context |
| CompassRose | Logo, loader, back-to-top | static, spinning (loader) | Hand-built SVG |
| StickerCard | Illustration with outline | tilt -2 to 2 degrees, hover, focus | Content cards use this shape |
| Button | Actions | primary, secondary, ghost, disabled, loading | Pill, paper fill, 1.5px berry border, berry text, flat 3px pink-200 offset. Hover fills berry, press drops 2px, disabled is dashed |
| NavPill | Site navigation | default, scrolled, mobile sheet | Floating white pill |
| TimeScrubber | Controls scene time | default, focus, playing | Native range input, 44px target, 4px water-deep track, 28px paper thumb with a berry border, `aria-valuetext` with time and event |
| ModeSwitch | Jump to day, dusk or night | day, dusk, night | Radio group that moves the scrubber to a preset and follows it when dragged. Visible focus ring |
| NowPanel | Live region for what is happening | default | Announces updates politely |
| RouteBuilder | Pick stops, draw route | empty, building, saved | Shows walking or transport times |
| PassportStamp | Collectable stamp | locked, landed, collected | Pop animation |
| ShareCard | Exportable image | wedding, pop-up | 1080 by 1350 export |
| FlipCard | Person or product card | front, back, focus | Flip on click or Enter, never hover-only |
| DepartureBoard | Countdown | counting, done | Split-flap feel with reduced-motion fallback |
| BoardingPass | RSVP or reservation | draft, confirmed, waitlist | Printable layout |
| LayerToggle | Show or hide map layers | on, off | Checkbox semantics |
| BottomSheet | Mobile pin details | closed, half, full | Focus trap, escape closes |
| Accordion | FAQ | open, closed | Button-based, aria-expanded |
| Form fields | RSVP and booking | default, focus, error, disabled | Visible labels, clear errors |

---

## 10. Engine architecture (Proposed)

**Stack.** React, TypeScript (strict), Vite, Tailwind CSS v4 (CSS-first `@theme`), React Router, deployed on Vercel. Fonts are self-hosted through Fontsource packages (`@fontsource-variable/sora`, `@fontsource/pacifico`). Tested versions: Node 22 in the sandbox and Node 24 on the owner machine, Vite 8, React 19, Tailwind 4.3, TypeScript 6. Animation: Framer Motion (`motion/react`) is the leading option for scroll progress and path drawing. GSAP ScrollTrigger is the alternative. Decide when scaffolding. Share card export: `html-to-image` (verify font embedding), with the Web Share API where supported and a download fallback. Illustration tooling lives in `tools/illustrations` (`gen.py`, `build_sheet.py`).

**Folders.**
```
src/
  tokens/          tokens.css, tailwind preset
  components/      primitives from section 9
  features/
    map/           MapCanvas, Pin, layers, routes
    scene/         time-of-day system
    passport/      stamps and rewards
    plan/          itinerary and route builder
    share/         card rendering and export
  data/
    events/        wedding.ts, popup.ts (EventConfig)
  assets/
    illustrations/ wedding/, popup/, shared/
  lib/             color, time, storage, path helpers
  routes/          pages
```

**Event config (the replication point).**

```ts
export type EventKind = 'wedding' | 'popup';

export interface EventConfig {
  id: string;
  kind: EventKind;
  title: string;
  tagline: string;
  timezone: string; // IANA, used for countdown and scrubber
  dates: { start: string; end: string }; // ISO 8601
  locale: {
    currency: 'USD' | 'GBP' | 'EUR';
    hour12: boolean;
    language: 'en-US' | 'en-GB';
  };
  map: MapConfig;
  scene: SceneKeyframe[];
  zones: Zone[];
  pins: Pin[];
  routes: Route[];
  layers: Layer[];
  schedule: ScheduleItem[];
  people?: Person[];
  passport: PassportConfig;
  pass: PassConfig;
  faq: { q: string; a: string }[];
  copy: Record<string, string>;
}

export interface MapConfig {
  viewBox: [number, number, number, number];
  landPath: string;
  waterPaths: string[];
  parkPaths: string[];
  roadPaths: string[];
  placements: { illustrationId: string; x: number; y: number; scale: number; zoneId?: string }[];
}

export interface SceneKeyframe {
  t: number; // 0 to 1
  sky: string; water: string; land: string; park: string;
  glow: number; // 0 to 1, lit yellow
  halo: number; // 0 to 1, night dimming, bloom, stars
}

export interface Zone {
  id: string; name: string; center: [number, number]; blurb: string;
}

export interface Pin {
  id: string; zoneId: string; x: number; y: number;
  title: string; kind: string; layerIds: string[];
  summary: string; details?: string;
  activeHours?: { start: string; end: string }; // HH:mm
}

export interface Route {
  id: string; name: string;
  mode: 'walk' | 'ferry' | 'shuttle' | 'bike' | 'courier';
  pathD: string; stops: string[]; durationMin: number; accessible: boolean;
}

export interface Layer { id: string; label: string; pinKinds: string[] }

export interface ScheduleItem {
  id: string; title: string; start: string; end: string; // ISO
  pinId: string; type: string; description: string; requiresRsvp?: boolean;
}

export interface Person {
  id: string; name: string; role: string; front: string; back: string;
}

export interface PassportConfig {
  stamps: { pinId: string; label: string; unlock?: string }[];
  completionReward: { title: string; body: string };
}

export interface PassConfig {
  fields: { id: string; label: string; type: 'text' | 'number' | 'select' | 'textarea'; options?: string[]; required?: boolean }[];
}
```

**Time-of-day system.** One `t` value from 0 to 1 maps to the event's visible clock range (wedding: 8:00 am to 11:30 pm, pop-up: 10:00 am to 10:00 pm). A function `sceneAt(t)` finds the two surrounding keyframes (five of them, morning to night) and interpolates colors, glow and halo (a small JS lerp, set on the map root as CSS variables, throttled to animation frames). The UI chrome never reads scene variables. The scrubber is a native range input with `aria-valuetext` such as "4:30 pm, golden hour". The ModeSwitch (Day, Dusk, Night) is a radio group that sets `t` to 0.33, 0.78 or 1 and reflects the scrubber when it moves. A live region (NowPanel) announces what is happening at the chosen time.

**Route drawing.** Each visible route is a dashed path. A solid stroke mask animates `stroke-dashoffset` from 1 to 0 with `pathLength=1`, revealing the dashes without distorting them. The vehicle position comes from `getPointAtLength` mapped to scroll progress, with rotation from the tangent.

**Passport.** State is an array of collected pin ids stored under `ba:passport:{eventId}`. Wrap all storage calls in try/catch with a working empty state. A "Stamp it" action in the demo simulates the real-world scan or check-in.

**Plan.** The itinerary is a list of schedule item ids under `ba:plan:{eventId}`. The route builder draws between stops in schedule order and shows times from route durations.

**Accessibility alternatives.** Every map view has a list view. Routes appear as text steps. Pins are buttons with names. The scrubber has keyboard support and a text summary.

**Passcode gate (Open).** If included, label it clearly as a client-side demo. A real client build checks the code on a server.

---

## 11. Build 1: Wedding weekend (Proposed concept)

**Placeholders (Open).** Couple: Maya and Theo. Venue: Larkmere Estate, a lakeside estate reached by a short ferry from Harbor Quay. Dates: Friday September 10 to Sunday September 12, 2027. About 90 guests. USD and 12-hour times.

**Story.** Maya and Theo met on this ferry crossing six years ago. The ferry is the guests' transport and the origin of the story. The site tells the story by letting guests travel the route and unlock chapters along it.

**Realistic details to design for.**
- Friday: welcome drinks, 6:00 pm, the Boathouse terrace
- Saturday: ferries from Harbor Quay at 12:30, 1:00 and 1:30 pm; ceremony 3:30 pm; cocktail hour 4:30 pm; dinner 6:30 pm; first dance at dusk, about 8:30 pm; party until midnight; return ferries 11:30 pm and 12:15 am
- Sunday: farewell brunch 10:00 am; last ferry 12:30 pm
- Dress code: garden formal. Kids welcome. Rain plan: the marquee.
- Hotel block at an invented hotel near the quay, with a booking code
- Registry: a honeymoon fund and a home registry (placeholder links)
- Practical: parking, step-free route, dietary needs, plus-ones, song requests

**Sections and routes.**

| Route | Section | Key interaction |
|---|---|---|
| `/story` | Story trail | Five stamps, collected by walking the home page or with "Stamp it" here. Each unlocks a chapter, and finishing shows a closing note |
| `/` | Journey | Ferry crossing scroll ends at the estate with date and RSVP |
| `/day` | The day, hour by hour | Time scrubber and NowPanel |
| `/story` | Story trail | Passport: five pins unlock chapters (the ferry deck where they met, first date cafe, the trip that went wrong, the jetty where Theo proposed, the arch where they marry). Completion reveals a note and the registry |
| `/plan` | Plan your weekend | Pick events, route draws with transport times, saved itinerary |
| `/map` | Map and layers | Layers: stay, eat, explore, getting around. List view toggle |
| `/party` | The wedding party | Flip cards with a fun fact on the back |
| `/rsvp` | RSVP | Boarding-pass flow: name, party size, meal, dietary, song request. Confirmation pass and share card |
| `/info` | Info and FAQ | Getting here, accommodation, dress code, kids, weather, accessibility |

**Voice.** Warm, specific, lightly funny, first person plural ("we"). Short sentences. Practical details first.
- Do: "The ferry leaves Harbor Quay at 1:00 pm. Please arrive by 12:45."
- Don't: "Embark on a magical journey to our special day!"
- Buttons: "Send RSVP", "Add to my plan", "See the route".

---

## 12. Build 2: Brand pop-up (Proposed concept)

**Placeholders (Open).** Brand name and category are Open. Working assumption: a sparkling fruit-soda brand launching a five-day pop-up in a city arts district, because the palette suits drinks and the stations are easy to draw. Dates, address and prices are placeholders.

**Stations (zones).** Sample Bar, Flavor Lab (build your own), Photo Wall, Drop Counter (limited merch), Sound Corner.

**Sections and routes.**

| Route | Section | Key interaction |
|---|---|---|
| `/` | Journey | A courier rides a route across the city map to the pop-up door |
| `/today` | Best time to visit | Scrubber shows workshops, drops and crowd levels by hour, with a quiet-hours filter |
| `/stations` | Stations map | Layers: sampling, workshops, shop, photo, accessibility, queue time |
| `/plan` | Plan your visit | Pick stations and workshops, book a time slot |
| `/pass` | Passport | Collect stamps at stations to unlock a reward such as a free can or a discount code |
| `/lab` | Flavor lab | Build your own combo, share card with "my picks" |
| `/flavors` | Flavors and collabs | Flip cards with details and creator notes |
| `/reserve` | Reservation pass | Time slot or VIP pass, waitlist state |
| `/info` | FAQ and press | Hours, accessibility, queue policy, press contact |

**Voice.** Friendly and direct, playful but clear. Short sentences. Buttons say what happens.
- Do: "Next drop at 5:00 pm. 120 pieces."
- Don't: "Get ready for an epic, unforgettable flavor adventure!"

---

## 13. Case study plan

**Switcher.** A "same atlas, your event" toggle on the case study page flips one live map between the wedding and the pop-up. The `EventConfig` swaps, labels and landmarks change, the accent palette shifts within the system. The system rules never change.

**Structure.** Follow playbook section 17. Add a section titled "How it adapts" with the data model, the switcher and the scope notes (what is configuration, what is custom illustration).

**Capture list (Project A specific).**
- Inspo board and extraction notes
- Style tile and token page
- Illustration test sheet and final sets, with the v1, pale-tint and deep-line versions side by side
- Scrubber and mode switch recording across all five scene keyframes, ending on the lit night view
- Route draw-on recording
- Passport stamp landing recording
- Share card examples
- Lighthouse results and accessibility checks
- Side-by-side of wedding and pop-up on the same components

---

## 14. Voice and tone (shared)

Follow playbook section 14. Sentence case, plain verbs, specific over clever. First person plural for the wedding, brand voice for the pop-up. Real content in every state, no lorem ipsum.

---

## 15. Anti-patterns (restated)

Black outlines. Hard black shadows. White borders thicker than 3 px. White sticker outlines. Solid pink masses over about a third of the viewport. Offset shadows above 3 px. Strokes above 2 px on illustrations. Gradients. Glassmorphism. Neon or cold greys. Stock icons. White text on bright pink. Small low-contrast handwriting. Centered symmetric card grids. One radius everywhere. Realistic photography. Constant ambient motion. Fade-and-slide-up on every section.

---

## 16. Tokens (built)

The source of truth is `src/index.css` in the repo. It uses Tailwind v4's CSS-first `@theme static` block with the default color, text, radius and shadow scales reset (`--color-*: initial`), so only system values exist.

Naming in code:
- Primitives carry the color prefix so Tailwind generates utilities: `--color-pink-50`, `--color-pink-200`, `--color-navy-800`, and so on. Components do not use them.
- Semantic roles are what components use: `--color-ground`, `--color-paper`, `--color-land`, `--color-land-wash`, `--color-land-strong`, `--color-accent`, `--color-water`, `--color-water-wash`, `--color-water-deep`, `--color-water-deep-wash`, `--color-park`, `--color-park-wash`, `--color-park-deep`, `--color-glow`, `--color-flag`, `--color-ink`, `--color-success`, `--color-warning`, `--color-error`, plus `--color-contour` for texture.
- Utilities that exist: `bg-ground`, `bg-paper`, `bg-land`, `text-ink`, `text-accent`, `rounded-panel`, `rounded-pill`, `shadow-press`, `shadow-press-down`, `font-display`, `font-hand`, `font-body`, `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-small`, `text-label`, `ease-standard`, `ease-pop`, `max-w-measure`.
- Custom utilities: `duration-micro`, `duration-standard`, `border-hair` (1.5px), the `.line-art` group class (1.5px berry hairline on every shape inside), `sticker-edge` (version 1 white outline, kept only for the retired comparison on the style tile), `force-focus` (documentation only). The `.scrubber` class styles the range input.
- Scene variables live on `:root` as `--scene-sky`, `--scene-water`, `--scene-land`, `--scene-park`, `--scene-glow` and `--scene-halo`, and are set by the time-of-day system on the map root. Scene keyframes live in `src/lib/scene.ts` for now and move into each event config later.
- Focus ring is global: 3px ink outline, 2px offset, with a 2px white gap.

Changes from the earlier draft: the press shadow is a 3px pink-200 offset (it was 6px pink-200, then pink-400), and the Tailwind v3 config snippet is retired. Labels and buttons use 1.5px hairlines.

---

## 17. Build order and checkpoints

| Step | Work | Done when |
|---|---|---|
| 0 | Scaffold repo (Vite, React, TS, Tailwind), tokens, fonts | Tokens page renders and fonts load |
| 1 | Style tile page: palette, type, lines, radius, outline, contours | Built and verified in a headless browser (build, lint, console, mobile width). Owner approved the look (2026-10-23) |
| 2 | Illustration test sheet: ferry, estate house, tree, two people | Approved (2026-10-23) in the deep line style, with day, dusk and night renders |
| 3 | Map engine with mock wedding config: zones, pins, layers, routes, list view | Pins, layers and keyboard work. Built 2026-10-23, headless Chromium checks pass, real-browser check pending |
| 4 | Journey hero: ferry scroll with route draw-on | Recording is shareable, reduced-motion mode works. Built 2026-10-23, headless checks pass, recording and real-browser check pending |
| 5 | Scene system, Day, Dusk and Night switch, scrubber and NowPanel | All five keyframes look right, contrast holds, lit windows read at night |
| 6 | Remaining wedding pages: story trail, plan, party, RSVP, share card, info | Every flow works end to end |
| 7 | Polish, motion pass, responsive pass, accessibility and performance QA | Playbook section 16 checklist passes |
| 8 | Deploy to Vercel, confirm live, capture assets | Live URL confirmed, recordings exported |
| 9 | Build 2: pop-up config, illustration set, courier journey, crowd scrubber, reservation pass | Same engine, new data |
| 10 | Case study page with switcher | Switcher flips both builds cleanly |

Targets (Proposed): Lighthouse mobile performance 90 or higher, accessibility 100, LCP under 2.5 s, CLS under 0.1, INP under 200 ms, initial JavaScript kept lean with routes code-split, hero illustration inline and the rest lazy-loaded.

---

## 18. Status log

### Status: 2026-10-21
Stage: 4 to 6 (concept, content outline, illustration spec and tokens drafted)
Done this session: Inspo board analyzed (12 illustrated maps). Style name Bubblegum Atlas chosen. Direction moved from waterfront festival to wedding weekend plus brand pop-up on a shared atlas engine. Playbook and this brief written.
Decided this session: See section 1.
Proposed, awaiting confirmation: Palette hexes, type pairing, flair items, stack, wedding and pop-up placeholders, case study switcher, targets.
Open questions: Couple names and venue, pop-up brand and category, animation library, passcode gate, repo names.
Files created or changed: `studio-playbook.md`, `bubblegum-atlas-project-a.md`
Parked issues: none
Next step: Scaffold the repo and build the style tile (step 0 and 1), then the illustration test sheet (step 2).

### Status: 2026-10-21 (second block)
Stage: 7 Tokens (style tile built)
Done this session: Scaffolded the repo files for step 0 and 1: Vite, React, TypeScript, Tailwind v4, Fontsource fonts. Built the style tile (hero map with route draw-on, palette, live contrast table, type, line system, shape and controls, scene scrubber). Verified the production build, lint, console and a 390 px layout in a headless browser. Measured every contrast pair from the live tokens.
Decided this session: Owner works in her own repo and runs all commands herself. No co-author credit for Claude on commits.
Proposed, awaiting confirmation: Press shadow in pink-400. Labels as HTML overlays. Tailwind v4 token naming. Fonts via Fontsource.
Open questions: Animation library for the scroll journey. Couple names, venue, pop-up brand.
Files created or changed: `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/StyleTile.tsx`, `src/lib/color.ts`, `src/lib/scene.ts`, `src/tile/*` (Section, Hero, Palette, Contrast, Typography, LineSystem, ShapesControls, SceneStrip, tokens)
Parked issues: none. Found during verification: ink on water-deep is 3.95:1, so text on strong blue is large only; use paper pills. SVG text shrinks with the map, so labels must be HTML.
Next step: Owner reviews the style tile in a real browser and approves or changes the look. Then the illustration test sheet (ferry, estate house, tree, two people).

### Status: 2026-10-21 (third block)
Stage: 6 Illustration spec (test sheet drawn)
Done this session: Style tile pushed to the repo and running locally. Drew the five-piece test sheet from the illustration spec, rendered it in daytime and at dusk, and checked the pieces at map scale. Added a generator script so pieces can be edited and re-run.
Decided this session: None new.
Proposed, awaiting confirmation: The look of the five pieces. Generator script kept in `tools/illustrations`.
Open questions: Whether the estate house reads as a lakeside wedding venue or as a town hall (see notes). Animation library. Couple names and venue. Pop-up brand.
Files created or changed: `src/assets/illustrations/wedding/landmark-ferry.svg`, `landmark-estate.svg`, `src/assets/illustrations/shared/prop-tree-round.svg`, `person-guest-01.svg`, `person-guest-02.svg`, `public/illustration-sheet.html`, `tools/illustrations/gen.py`
Parked issues: none.
Next step: Owner reviews the test sheet and approves or redirects the shape language. Then the remaining wedding landmarks and the map engine with a mock config (step 3).

---

---

## 19. Design history (what changed and why)

Kept for the case study "early versus final" material. Earlier sections above already reflect the current decisions, so this log is only a record.

1. **Version 1 (2026-10-21).** Deep palette, three-tone shading, a white sticker outline around every illustration, a roughly 10 px white ring around the land, 6 to 10 px white roads and a 6 px offset button shadow.
2. **Feedback (2026-10-22).** The look was approved but felt thick. The owner diagnosed the heavy white border as the cause and added four storefront references (monoline cafe line art, Kismet cafe, Val Mont Lac pop-up poster, Kiss coffee shop). Principles taken: thin even lines, one line color per piece, empty space, a few solid accents. Kiss gave warmth only.
3. **Pale-tint version (not chosen).** Hairline art with pale tint fills, wash colors for land and water, lighter buttons and a lighter dusk. The owner loved the line art, the characters and the style, and wanted the deep v1 palette and shading instead. It stays available as `--style light`.
4. **Deep line (chosen).** Option B of a comparison: v1 colors and shading, a 1.5 px outline, no white sticker, no thick white border. The tile land and water went back to the deep values, with thin roads and lighter buttons and labels. The wash tokens stay for soft fills.
5. **Day, Dusk and Night (2026-10-23).** Added a fifth keyframe, a halo channel, night dimming of illustration fills, a bloom behind lit windows, stars and a moon, and a radio-group mode switch next to the scrubber.

Files to keep side by side for the case study: `public/illustration-v1/`, the git history of the first style tile commit, and the comparison renders.

---

### Status: 2026-10-23
Stage: 6 Illustration spec and 7 Tokens, deep line style and night mode built, awaiting a real-browser check
Done this session: Compared v1, a pale-tint version and the deep line version, and settled on deep line with a hairline. Rebuilt `gen.py` with `deep-line`, `deep`, `light` and `v1` styles, rebuilt the test sheet with a mode switch, and restyled the tile (hero map, line system, shapes and controls, scene strip with night). Consolidated this brief so sections 3 to 17 match the current decisions.
Decided this session: See section 1.
Proposed, awaiting confirmation: Night keyframe values and the 38 percent dimming. Hairline buttons and label pills. Wash tokens for soft fills only.
Open questions: Couple names, venue and dates. Pop-up brand and category. Animation library. Passcode gate. Ambient sound. Domains. Hairlines on a real phone. Where the mode switch sits in the site layouts.
Files created or changed: `tools/illustrations/gen.py`, `tools/illustrations/build_sheet.py`, the five SVGs in `src/assets/illustrations`, `public/illustration-sheet.html`, `public/illustration-v1/*`, `src/index.css`, `src/lib/scene.ts`, `src/StyleTile.tsx`, `src/tile/*`, `.gitignore`, this brief.
Parked issues: Not yet seen in a real browser (render checks are from a Python SVG rasterizer and a clean build). A second chat found the committed repo without the night keyframe and with the pale scene values in `scene.ts`, so the latest zip had not been applied. Check `src/lib/scene.ts` for a Night keyframe before building.
Next step: Apply and push the latest zip, then step 3: typed `EventConfig`, a mock wedding config, MapCanvas, Pin, LayerToggle and a list view with the keyboard model, with the remaining wedding landmarks drawn in the same style as the map needs them.

### Status: 2026-10-23 (build step 3)
Stage: 8 Components and 9 Pages and flows (map engine)
Done this session: Typed `EventConfig` and a mock wedding config (3 zones, 9 pins, 4 layers, 3 routes, a 12-item schedule). Map engine: `MapCanvas`, `Pin`, `LabelTag`, `LeaderLine`, `LegendCard` (layers and routes), `PinList`, `PinDetails`, `RouteSteps`, `ModeSwitch`, `TimeScrubber`, a `MapExplorer` container and a `/#/map` page. Seven landmarks added to `gen.py`: jetty, boathouse, ceremony arch, marquee, cafe, hotel, shuttle. Added `--scene-night` token. Build, lint and headless Chromium checks pass (keyboard, zoom, layers, list view, night, 390 px width, no console errors).
Decided this session: None new.
Proposed, awaiting confirmation: The type additions and keyboard model listed in section 1. Labels show only when the map is about 672 px wide or more, otherwise only the selected pin shows its label and the list view carries the rest.
Open questions: Same as before, plus whether the map should crop or zoom by default on phones.
Files created or changed: see the zip file list in the chat. New: `src/data/events/*`, `src/features/map/*`, `src/features/scene/*`, `src/components/LabelTag.tsx`, `LeaderLine.tsx`, `src/routes/MapPage.tsx`, `src/lib/time.ts`, seven SVGs. Changed: `tools/illustrations/gen.py`, `src/App.tsx`, `src/index.css`, this brief.
Parked issues: Not seen in a real browser. On a 390 px screen the map is small, pins are close together and the zoom buttons cover part of it. Not done yet: cake and bridal party illustrations (no page needs them until step 6), `build_sheet.py` still shows only the first five pieces, `BottomSheet` for mobile pin details (details sit under the map for now), `NowPanel` (step 5).
Next step: Step 4, the journey hero: ferry scroll with route draw-on, after you confirm the animation library (Framer Motion or GSAP).

### Status: 2026-10-23 (build step 4)
Stage: 10 Motion pass (journey hero, reworked)
Done this session: Journey on `#/`: one scroll progress value drives the camera, the ferry, a walking guest, the dashed route draw-on (mask reveal), pins that pop in once passed, a scale bar as progress and the time of day. Pulled `MapBase` and `PinLabel` out of `MapCanvas` so the map and the journey share the painted map. Installed `motion`. Checked in headless Chromium: five scroll positions, no console errors, no horizontal overflow at 390 px, reduced motion shows the finished scene, the skip link lands on the end card.
Decided this session: Animation library is Framer Motion.
Proposed, awaiting confirmation: Journey additions listed in section 1. Chapter copy and the "we met on this crossing" line are placeholders for the real story.
Open questions: Whether the RSVP button should stay disabled or link to a stub page for now.
Files created or changed: `package.json`, `package-lock.json`, `src/App.tsx`, `src/components/ScaleBar.tsx`, `src/data/events/types.ts`, `src/data/events/wedding.ts`, `src/features/journey/*`, `src/features/map/MapBase.tsx`, `MapCanvas.tsx`, `PinLabel.tsx`, `geometry.ts`, `src/routes/JourneyPage.tsx`, `MapPage.tsx`, this brief.
Parked issues: Not seen in a real browser or on a real phone. Not measured: Lighthouse, and scroll smoothness on a mid-range phone (the journey re-renders the map on every scroll frame and moves pieces with left and top, so this is the first thing to measure). No screen recording yet. On a phone the camera shows a narrow slice, so the jetty and island are not in the same frame during the crossing.
Next step: Record the journey on your machine for the social asset, then step 5: scene system polish, scrubber and NowPanel on the wedding day page.

### Status: 2026-10-24 (journey rework)
Stage: 10 Motion pass
Done this session: First-look feedback said the full-screen scroll hero was confusing. Replaced it with a plain hero and a scroll story beside readable text. Added `NavPill`, an RSVP stub page at `#/rsvp`, and a `side` override on `PinLabel`. Removed the skip link and the hidden duplicate text, since the story text is now normal content. Checked in headless Chromium: desktop and 390 px, no console errors, no horizontal overflow, reduced motion loads.
Decided this session: RSVP button links to a stub page.
Proposed, awaiting confirmation: The scroll story layout. A vertical (portrait) map with the ferry travelling downward is possible but needs a second map layout, so it is parked.
Open questions: Whether the hero map should stay landscape or the portrait layout is worth building later.
Files created or changed: `src/features/journey/Journey.tsx`, `JourneyHero.tsx`, `src/components/NavPill.tsx`, `src/routes/RsvpPage.tsx`, `JourneyPage.tsx`, `MapPage.tsx`, `src/App.tsx`, `src/features/map/PinLabel.tsx`, `src/data/events/types.ts`, `wedding.ts`, `src/index.css`, this brief.
Parked issues: Not seen in a real browser. On phones the nav pill floats over the previous chapter card as it scrolls under the sticky map. Scroll smoothness on a mid-range phone is still unmeasured.
Next step: Record the scroll story for the social asset, then step 5 (scene system polish, scrubber and NowPanel on the wedding day page).

### Status: 2026-10-24 (journey pacing)
Stage: 10 Motion pass
Done this session: The first full-screen journey was the preferred direction but was too fast, too close and too tight. Restored it and paced it out: 900vh of scroll (was 520vh), an opening wide view with the whole map, camera holds between moves, zoom 1.5 instead of 2.4, a faint preview of the full route, and phones zoom out instead of showing a thin slice. Removed the plain hero and split scroll story. Kept the nav pill and the RSVP stub. Checked in headless Chromium: seven scroll positions, 390 px, reduced motion, skip link, no console errors.
Decided this session: None new.
Proposed, awaiting confirmation: The pacing numbers (900vh, zoom 1.5, holds at 0.12, 0.3 and 0.7). These are easy to change in `wedding.ts`. A portrait map for a vertical ferry stays parked.
Open questions: Does 900vh feel right, or should it be slower or faster?
Files created or changed: `src/features/journey/Journey.tsx`, `camera.ts`, `src/features/map/MapBase.tsx`, `PinLabel.tsx`, `src/routes/JourneyPage.tsx`, `src/data/events/types.ts`, `wedding.ts`, `src/index.css`, this brief. Deleted: `src/features/journey/JourneyHero.tsx`.
Parked issues: Not seen in a real browser or on a real phone. Scroll smoothness unmeasured. On a phone the text card partly covers the jetty during the crossing.
Next step: You scroll it and tell me if the pace is right. Then record it and build the social assets.

### Status: 2026-10-24 (speed fix and social assets)
Stage: 13 Social assets
Done this session: Scroll length cut from 900vh to 650vh because 900vh felt slow. Tall and phone-shaped screens now zoom out further (camera floor 0.45) and the opening view sits slightly left so the quay shows. Recorded the scroll as a 1080x1920 phone-layout video and a 1920x1080 desktop video. Built an 8-slide 1080x1350 carousel: a cover in the series style, then seven slides cut from one tall page so each continues from the last (opening view, palette, type, components, keyboard keys, before and after pacing, what is built, repo link and inspiration credit).
Decided this session: None new.
Proposed, awaiting confirmation: 650vh pace. The carousel order and copy. The live link is not in the carousel yet because the site is not deployed.
Open questions: Deploy to Vercel so the live link can go in the caption.
Files created or changed: `src/data/events/wedding.ts`, `src/features/journey/camera.ts`, this brief. Social files are outside the repo.
Parked issues: Not seen in a real browser or on a real phone. Lighthouse not run. The phone video is a 720 px layout scaled up 1.5 times, so text is slightly soft.
Next step: Deploy to Vercel and confirm the live URL, then step 5 (wedding day page with the time scrubber and now panel).

### Status: 2026-10-25 (build step 5 and home sections)
Stage: 9 Pages and flows, 10 Motion pass
Done this session: Day page at `#/day`: a map with a time scrubber, the Day, Dusk and Night switch, a now panel (a polite live region that only changes when an event starts or ends, with a button to show the place on the map), lit pins for places with something on, and the day as a list that moves the scrubber. Checked all five scene keyframes (8:00 am, 12:39 pm, 4:32 pm, 8:05 pm, 11:30 pm): windows and string lights light up from dusk, lit pins show, labels and panels keep fixed colors. The home page now has sections after the journey: the weekend at a glance (from the schedule), Saturday hour by hour (the scrubber), getting to Larkmere (ferry times and routes), questions (accordion), an RSVP band and a footer. Added `Accordion`, `SiteFooter`, a nav link for the day, more Saturday schedule items and more FAQ entries.
Decided this session: Home page gets more sections below the journey.
Proposed, awaiting confirmation: `EventConfig.mainDay` (step 5 addition). Section order and copy on the home page. The scrubber opens on the ceremony time.
Open questions: Whether the home page needs a story trail teaser and a wedding party teaser before those pages exist.
Files created or changed: `src/features/day/*`, `src/features/home/*`, `src/components/Accordion.tsx`, `SiteFooter.tsx`, `NavPill.tsx`, `src/routes/DayPage.tsx`, `JourneyPage.tsx`, `src/App.tsx`, `src/lib/time.ts`, `src/data/events/types.ts`, `wedding.ts`, `src/features/map/Pin.tsx`, `MapCanvas.tsx`, this brief.
Parked issues: Not seen in a real browser or on a real phone. Lighthouse not run. Contrast of text on the scene is unaffected because text sits on fixed paper panels, but the pale label pills on the night map were checked by eye only. The home page is about 13 screens tall on a phone.
Next step: Step 6, starting with the RSVP boarding pass (replaces the stub) and the story trail with the passport stamps.

### Status: 2026-10-25 (fonts and RSVP pass)
Stage: 8 Components and 9 Pages and flows
Done this session: Swapped the type to Sora (display and body) and Pacifico (script labels), removed the three old font packages, and retuned the type scale for Sora's width and Pacifico's line height. Built the RSVP at `#/rsvp`: a form driven by `event.pass` (attending yes or no, name, email, party size, Saturday ferry, dinner, dietary needs, song) with visible labels, hints and errors that say how to fix the problem, and focus on the first error. A boarding pass fills in beside the form as a draft, then becomes Confirmed or Waitlist when sent (a party that does not fit in the remaining places is waitlisted). The reply is saved in the browser, survives a reload, and can be changed, cleared or printed on its own as a PDF. A "no" reply shows a thank-you with no pass. Added `Field`, `BoardingPass`, `RsvpForm`, `lib/storage.ts`.
Decided this session: Fonts are Pacifico plus Sora.
Proposed, awaiting confirmation: Sora for both display and body (two families in total). `PassConfig.maxPartySize` and `capacity` (mock headcount of 86 taken out of 90, so parties of 5 or more are waitlisted). Reference code format `LRK-XXXX`. The share card is not built yet.
Open questions: Real capacity and party limit. Where replies should go once there is a server.
Files created or changed: `src/features/rsvp/*`, `src/components/Field.tsx`, `src/lib/storage.ts`, `src/routes/RsvpPage.tsx`, `src/main.tsx`, `src/index.css`, `src/tile/Typography.tsx`, `src/features/day/DayExplorer.tsx`, `src/data/events/types.ts`, `wedding.ts`, `package.json`, `package-lock.json`, `tools/illustrations/build_sheet.py`, this brief.
Parked issues: Not seen in a real browser or on a real phone. Replies are stored in the browser only. The print layout was checked with print media emulation, not a real printer or PDF. The social carousel and videos from earlier use the old fonts and will need regenerating if you want them to match.
Next step: Story trail with passport stamps, then the share card for the boarding pass.

### Status: 2026-10-25 (walk, story trail, share card)
Stage: 9 Pages and flows, 10 Motion pass
Done this session: Rebuilt the home page below the journey as an unwinding map of seven stations (Harbor Quay, the boathouse, the lakeside cafe, the shuttle stop with the questions, the house, the ceremony arch, the marquee). Each station has its own artwork and text drawn from the event config, and a leader line to its place. A dotted path winds down the page, the time of day moves from midday to night as you go, and a guest avatar walks the path as you scroll. The guest is a suit or a dress with a choice of five skin tones, saved in the browser; legs and arms swing while the page moves and stop under reduced motion. The guest stamps five story stops on the way (passport saved in the browser, a toast announces each stamp, and a chip links to the story page). Built `#/story` (stamps, chapters, a closing note, "Stamp it" and "Start over"). Built the boarding pass share card: a 1080 by 1350 image made from the RSVP, saved as a PNG or sent through the phone's share sheet. New illustrations: two walking avatars and a wedding cake. Removed the plain weekend, getting here and questions sections, now inside the walk. The nav has a Story link.
Decided this session: Home page as an unwinding map with a walking avatar. Story trail inside the walk.
Proposed, awaiting confirmation: Suit and dress as the avatar labels. Story chapters (placeholders written for Maya and Theo, to be replaced with the couple's real story). Seven stations and their order. Registry links on the finished story page (not added yet).
Open questions: The real story. Registry links.
Files created or changed: `src/features/walk/*`, `src/features/rsvp/ShareCard.tsx`, `ShareCardPanel.tsx`, `src/routes/StoryPage.tsx`, `JourneyPage.tsx`, `RsvpPage.tsx`, `src/components/PassportStamp.tsx`, `NavPill.tsx`, `SiteFooter.tsx`, `src/App.tsx`, `src/index.css`, `src/data/events/types.ts`, `wedding.ts`, `tools/illustrations/gen.py`, three new SVGs, `package.json`, `package-lock.json`, this brief. Deleted: `src/features/home/WeekendSection.tsx`, `HereSection.tsx`, `FaqSection.tsx`.
Parked issues: Not seen in a real browser or on a real phone. Scroll smoothness of the walk is unmeasured (it re-renders only the trail on scroll). The share card was rendered in headless Chromium; Safari's image export and font embedding are untested. On phones the guest disappears behind the text cards while walking between stations. The day section and RSVP band after the walk are still on a plain background.
Next step: Pop-up build (step 9) or a performance and accessibility pass (step 7), your call. The wedding site has its main pages.

### Status: 2026-10-25 (bird's-eye hero and play)
Stage: 10 Motion pass
Done this session: Pulled the hero camera back so elements are small and the whole estate shows (feedback: elements were too close and imposing, and the journey felt rushed). The camera no longer forces a zoom on wide, short windows (a 1350 by 630 window was cropping the top of the map). Scroll progress now goes through a spring for a smoother journey. The chapter card moved to the top left on wider screens so it no longer covers the quay. Added play: buildings lift on hover, hop and throw sparkles on click or Enter and open a short note (also announced to screen readers), a star trail follows a mouse, twinkles on the water, a ferry wake and smoke tied to scroll, and the walker now uses the chosen avatar with its walking swing. Placements can name a pin (`pinId`).
Decided this session: Bird's-eye hero with more play.
Proposed, awaiting confirmation: Zoom values, the spring settings, the twinkle positions, "Tap a building to say hi" hint.
Open questions: None new.
Files created or changed: `src/features/journey/Journey.tsx`, `camera.ts`, `src/features/map/MapBase.tsx`, `src/data/events/types.ts`, `wedding.ts`, `src/index.css`, this brief.
Parked issues: Not seen in a real browser or on a real phone. Scroll smoothness and the cost of re-rendering on every spring tick are unmeasured. The mouse star trail is only tested by script. Several buttons now sit in the hero tab order (one per building).
Next step: Performance and accessibility pass, or the pop-up build.

### Status: 2026-10-26 (performance pass, partly done)
Stage: 11 QA
Done this session: Measured first. Lighthouse mobile on the home page: performance 83, accessibility 91, best practices 100, SEO 91 (LCP 2.3 s, CLS 0.002, TBT 520 ms). RSVP: 97, 96, 100, 91. Day: 97, 90, 100, 91. Scroll cost was measured with 4x CPU throttling in headless Chromium: the cause was style recalculation, because every scroll frame rewrote the scene colour variables on a large ancestor. Fixes in this drop: the scroll-driven scenes (hero and walk) now paint sky, water, land and park colours directly instead of through CSS variables; the light variables (glow, halo) are rounded (steps of 0.02 in the hero, 0.1 in the walk) so they restyle rarely; the walk lawns are drawn in the trail layer; the hero stops twinkles and the walker's swing while offscreen; the scroll spring value is rounded so a settled spring causes no renders. Results (throttled, headless): hero mean frame time 75 to 49 ms on desktop and 58 to 33 ms on a phone size; walk style recalculation 2579 to 1033 ms, phone mean frame 119 to 57 ms.
Decided this session: None.
Proposed, awaiting confirmation: None.
Open questions: Whether the walk reaches an acceptable frame rate on a real phone (headless has no GPU, so real devices should do better).
Files created or changed: `src/lib/scene.ts`, `src/features/map/MapBase.tsx`, `src/features/journey/Journey.tsx`, `src/features/walk/Station.tsx`, `Walk.tsx`, `WalkTrail.tsx`, this brief.
Parked issues: Accessibility fixes found by Lighthouse are NOT applied yet: invalid `aria-controls` on map pins where no details panel exists, a dense-map pin that fails the 24 px target size because neighbouring hit areas overlap, low contrast on the muted draft text in the boarding pass, no `robots.txt`, no `h1` on the home page, route changes do not reset scroll, focus or the page title. Code splitting, latin-only font imports, meta tags and favicon are not done. The walk still runs at roughly 8 to 10 fps under 4x throttling (remaining cost: the avatar's leg swing is a main-thread SVG animation, and about 3,900 DOM nodes).
Next step: Finish the accessibility and performance list above, then the copy, naming, hero intro and per-page redesign recorded in the owner's feedback.
