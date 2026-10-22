# Project A: Bubblegum Atlas

Design system and build brief. Read together with `studio-playbook.md` (the playbook holds the general rules, this file holds everything specific to Project A). If they disagree, this file wins.

Last updated: 2026-10-21. Stage: 6 (illustration test sheet drawn, awaiting approval). Tokens built and verified on a style tile.

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

### Proposed (awaiting confirmation)
- All hex values in section 5 (estimated from the images, to verify at the style tile stage).
- Type pairing: Bricolage Grotesque, Caveat, DM Sans.
- Flair: cartographic furniture as UI (legend as menu, scale bar as progress, compass rose as logo and back-to-top), contour-line texture on land, berry label pills with white outline.
- Stack choices in section 10 (animation library, share card library).
- Wedding setting, placeholder names and dates in section 11.
- Pop-up working brand and category in section 12.
- Case study switcher showing both builds on one engine.
- Performance and accessibility targets in section 17.

### Open
- Final couple names, venue name and dates (placeholders for now).
- Pop-up brand name and product category.
- Animation library: Framer Motion or GSAP ScrollTrigger (decide when scaffolding).
- Whether to include a passcode gate on the wedding site.
- Whether to include optional ambient sound (default: no).
- Repo names and domains.

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
4. A white sticker outline around illustrations.
5. A dashed route that links content into a path.

**The one memorable thing:** the hero map shape and its journey. Everything else stays quiet.

**Anti-patterns:** black outlines and hard black shadows, gradients and glassmorphism, neon or cold greys, stock icon sets, white text on bright pink, tiny low-contrast handwriting, centered symmetrical card grids, one radius on everything, realistic photography.

---

## 4. Inspo analysis (summary)

Twelve illustrated maps (neighborhood posters, city maps, food maps, a school anniversary piece, an album promo). Credit the board and its artists in the case study; named artists include Elly Walton, Livi Gosling, Dina Ruzha, Sandra Neuditschko and Astrid Prasetianti. We borrow principles only.

**What recurs:**
- Pink is the ground, never just an accent. It runs from blush to bubblegum to hot magenta, always as land, always against a contrasting field (white, cream, sky blue, periwinkle).
- Supporting cast: pastel blue water, mint or emerald parks, butter yellow and tangerine and coral accents, navy as the text color.
- White does the structural work: roads, label cards, sticker outlines, generous margins. This is where the airy feel comes from.
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
| blue-200 | #BFE4F0 |
| blue-500 | #6F8FDB |
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
| --color-paper | white | label cards, road lines, sticker outlines, panels |
| --color-land | pink-200 | the hero landmass and large fills |
| --color-land-strong | pink-400 | illustration pink, feature fills |
| --color-accent | pink-700 | buttons, banners, small text in the pink world |
| --color-water | blue-200 | water and secondary ground |
| --color-water-deep | blue-500 | strong blue ground, tags |
| --color-park | green-300 | parks and positive fills |
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

Rule: text never sits directly on bright pink or on strong blue. Labels sit on paper or accent pills.

### 5.2 Scene keyframes (time-of-day)

Only the map canvas shifts. UI chrome stays constant so contrast is guaranteed. Starter values:

| Keyframe | t | sky | water | land | park | glow |
|---|---|---|---|---|---|---|
| morning | 0 | #FFE9EF | #CBE8F2 | #FFC9DB | #B6E4CD | 0 |
| midday | 0.33 | #F4FBFF | #BFE4F0 | #FFC9DB | #A8DEC3 | 0 |
| golden | 0.66 | #FFE8CC | #B8C9E6 | #FFB9C9 | #A5D4B4 | 0.3 |
| dusk | 1 | #D9D3F3 | #6F8FDB | #F7A8C8 | #7FBF9F | 1 |

Glow drives lantern, window and string-light opacity.

### 5.3 Typography (Proposed)

- **Display:** Bricolage Grotesque, weight 800. Chunky, friendly, a little quirky.
- **Hand:** Caveat, weight 600, for map labels, captions and asides. Minimum 20px. Never body text.
- **Body and UI:** DM Sans 400 and 500.
- All three are on Google Fonts. Subset them and limit weights.

Scale:

| Style | Size | Line height | Notes |
|---|---|---|---|
| display | clamp(3.25rem, 9vw, 8rem) | 0.92 | tracking -0.02em |
| h1 | clamp(2.5rem, 6vw, 4.5rem) | 1 | |
| h2 | clamp(1.75rem, 3.5vw, 2.75rem) | 1.1 | |
| h3 | 1.5rem | 1.2 | |
| body | 1.0625rem | 1.6 | max 70ch |
| small | 0.875rem | 1.5 | |
| hand label | 1.25rem | 1.15 | Caveat |

Rules: sentence case, no all-caps labels. Big titles sit in a white banner or a tilted tag so the type is part of the picture. No single-word accents in headlines.

### 5.4 Spacing, layout, shape

- 4px base. Steps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Section padding: `clamp(4rem, 10vw, 9rem)`.
- 12-column grid, 1280px max width, wide gutters. Illustrations may break the grid and overlap edges. Compositions are asymmetric with space around each piece.
- Radius scale: blob (SVG shapes) for hero forms, 28px for panels, 999px for pills and tags, small cut-angle ends for banners and flags.
- Borders: 4px white sticker outline on illustrations. 2px dashed water-blue border on legend cards.
- Shadows: none by default. One exception: a flat 6px offset in bubblegum pink (pink-400) under buttons, dropping to 2px when pressed.
- Texture: contour lines on land (Proposed), at low contrast. No SVG turbulence filters over large areas.

### 5.5 Line system

- Roads: white, 6 to 10px at hero scale, round joins and caps.
- Leader lines: 1.5px navy ending in a 6px filled dot.
- Routes: dashed 3px with round caps, dash pattern about 2 and 10, accent or deep-blue color, arrowheads at turns.
- Map outline: 3px white or darker-pink stroke.
- Contour lines (texture): 1px, land color mixed 15 percent toward white.

---

## 6. Cartographic furniture (Proposed flair)

Cartography tools become interface:
- **Legend card as menu.** The legend lists the pages and layers. Tapping an item scrolls or toggles.
- **Scale bar as progress.** A scale bar fills as the visitor scrolls or completes the passport.
- **Compass rose** as the logo mark (hand-built SVG), the loader, and the back-to-top control.
- **Berry label pills** with a white outline for map labels. These fix the white-on-pink contrast problem and become a recognizable label of our own.

---

## 7. Illustration kit spec

Illustrations are written as SVG by Claude. Flat vector, limited shading, consistent rules.

**Shape language.** Rounded corners, chunky simplified forms, slightly exaggerated proportions, no fine detail below 2 units at design scale.

**Outline.** Every illustration has a white sticker silhouette behind it: a union path in white with a 6-unit stroke and round joins. No black outlines anywhere.

**Shading.** Three tones per fill: base, shade (base mixed 14 percent with navy), highlight (base mixed 40 percent with white). Light comes from the top left, so shade sits on the right and bottom. No gradients.

**Color use.** Each piece uses 5 to 7 colors from the palette. Fills use CSS variables so the scene system can theme them.

**Glow elements.** Windows, lanterns and string lights use `--scene-glow` to fade in toward dusk.

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

**Test sheet v1 (drawn 2026-10-21).** Five pieces: `landmark-ferry`, `landmark-estate`, `prop-tree-round`, `person-guest-01`, `person-guest-02`. Files live in `src/assets/illustrations/wedding` and `shared`. Each is 0.6 to 1.4 KB gzipped, far under the 8 KB budget. View them at `/illustration-sheet.html` in the dev server, which has a time slider that lights the windows and a map-scale check.
- Generated from `tools/illustrations/gen.py`. Pieces are shape lists plus a part-to-color map, so edits are a change to the script and a re-run (`python tools/illustrations/gen.py` from the repo root).
- Every fill is a CSS variable with a hex fallback, so inlined SVGs follow the tokens and standalone files still render. Shade is the base mixed 14 percent with ink, highlight is the base mixed 40 percent with white.
- The white sticker outline is a stroked silhouette group behind the art, built automatically from the same shapes.
- Windows have a base fill plus a glow layer whose opacity is `--scene-glow`.
- People take `--skin` and `--hair` as inline CSS variables, so any tone from the palette can be set per instance.
- SVGs must be inlined (as React components or raw imports) for the CSS variables to reach them. An `<img>` tag will show the hex fallbacks.

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
| Pin | Marker for a place | numbered, unnumbered, active, visited, disabled | Numbered only when the content is a sequence |
| LabelTag | Place label | flag, pill, handwritten | Pills use ink on paper or white on accent |
| LeaderLine | Connects label and place | default | 1.5px navy, dot end |
| LegendCard | Menu and key | collapsed, expanded | Dashed water border, doubles as navigation |
| ScaleBar | Progress indicator | scroll, passport | Labelled with miles or steps in context |
| CompassRose | Logo, loader, back-to-top | static, spinning (loader) | Hand-built SVG |
| StickerCard | Illustration with outline | tilt -2 to 2 degrees, hover, focus | Content cards use this shape |
| Button | Actions | primary, secondary, ghost, disabled, loading | Pill, accent fill, flat 6px offset, drops 4px on press |
| NavPill | Site navigation | default, scrolled, mobile sheet | Floating white pill |
| TimeScrubber | Controls scene time | default, focus, playing | Native range input styled, `aria-valuetext` with time and event |
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

**Stack.** React, TypeScript (strict), Vite, Tailwind CSS v4 (CSS-first `@theme`), React Router, deployed on Vercel. Fonts are self-hosted through Fontsource packages (`@fontsource-variable/bricolage-grotesque`, `@fontsource-variable/dm-sans`, `@fontsource-variable/caveat`). Tested versions: Node 22, Vite 8, React 19, Tailwind 4.3, TypeScript 6. Animation: Framer Motion (`motion/react`) is the leading option for scroll progress and path drawing. GSAP ScrollTrigger is the alternative. Decide when scaffolding. Share card export: `html-to-image` (verify font embedding), with the Web Share API where supported and a download fallback.

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
  glow: number; // 0 to 1
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

**Time-of-day system.** One `t` value from 0 to 1 maps to the event's visible clock range (wedding: 8:00 am to 11:30 pm, pop-up: 10:00 am to 10:00 pm). A function `sceneAt(t)` finds the two surrounding keyframes and interpolates colors (a small JS lerp, set on the map root as CSS variables, throttled to animation frames). Glow opacity is a number variable. The UI chrome never reads scene variables. The scrubber is a native range input with `aria-valuetext` such as "4:30 pm, cocktail hour". A live region (NowPanel) announces what is happening at the chosen time.

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
- Illustration test sheet and final sets
- Scrubber recording across all four scene keyframes
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

Black outlines. Hard black shadows. Gradients. Glassmorphism. Neon or cold greys. Stock icons. White text on bright pink. Small low-contrast handwriting. Centered symmetric card grids. One radius everywhere. Realistic photography. Constant ambient motion. Fade-and-slide-up on every section.

---

## 16. Tokens (built)

The source of truth is `src/index.css` in the repo. It uses Tailwind v4's CSS-first `@theme static` block with the default color, text, radius and shadow scales reset (`--color-*: initial`), so only system values exist.

Naming in code:
- Primitives carry the color prefix so Tailwind generates utilities: `--color-pink-50`, `--color-pink-200`, `--color-navy-800`, and so on. Components do not use them.
- Semantic roles are what components use: `--color-ground`, `--color-paper`, `--color-land`, `--color-land-strong`, `--color-accent`, `--color-water`, `--color-water-deep`, `--color-park`, `--color-park-deep`, `--color-glow`, `--color-flag`, `--color-ink`, `--color-success`, `--color-warning`, `--color-error`, plus `--color-contour` for texture.
- Utilities that exist: `bg-ground`, `bg-paper`, `bg-land`, `text-ink`, `text-accent`, `rounded-panel`, `rounded-pill`, `shadow-press`, `shadow-press-down`, `font-display`, `font-hand`, `font-body`, `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-small`, `text-label`, `ease-standard`, `ease-pop`, `max-w-measure`.
- Custom utilities: `duration-micro`, `duration-standard`, `sticker-edge` (white outline that follows a silhouette), `force-focus` (documentation only).
- Scene variables live on `:root` as `--scene-sky`, `--scene-water`, `--scene-land`, `--scene-park` and `--scene-glow`, and are set by the time-of-day system on the map root. Scene keyframes live in `src/lib/scene.ts` for now and move into each event config later.
- Focus ring is global: 3px ink outline, 2px offset, with a 2px white gap.

Changes from the earlier draft: the press shadow is pink-400 instead of pink-200, and the Tailwind v3 config snippet is retired.

---

## 17. Build order and checkpoints

| Step | Work | Done when |
|---|---|---|
| 0 | Scaffold repo (Vite, React, TS, Tailwind), tokens, fonts | Tokens page renders and fonts load |
| 1 | Style tile page: palette, type, lines, radius, outline, contours | Built and verified in a headless browser (build, lint, console, mobile width). Owner approves the look in a real browser |
| 2 | Illustration test sheet: ferry, estate house, tree, two people | Drawn and rendered in daytime and dusk. Owner approves shape language and scale |
| 3 | Map engine with mock wedding config: zones, pins, layers, routes, list view | Pins, layers and keyboard work |
| 4 | Journey hero: ferry scroll with route draw-on | Recording is shareable, reduced-motion mode works |
| 5 | Scene system and scrubber with NowPanel | All four keyframes look right, contrast holds |
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
