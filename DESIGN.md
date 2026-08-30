# DESIGN.md, Tyrrell Lab

This document records what `assets/css/site.css` does now. It does not record
aims. If the code and this document do not agree, the code is correct.

## Colour

The palette is the official brand guide of the University of Alabama at
Birmingham.

| Token | Value | Function |
|---|---|---|
| `--uab-green` | `#1a5632` | Primary (PMS 357). Links and pill text on light surfaces |
| `--uab-gold` | `#fdb913` | Primary (PMS 7549). Focus rings, section numbers, kickers |
| `--dragon` | `#033319` | Dragon's Lair Green |
| `--campus` | `#90d408` | Campus Green. Hero scene only |
| `--evergreen` | `#17b045` | Ever Loyal Evergreen. Hero scene only |
| `--sky` | `#42caf0` | Bham Sky Blue. Hero scan line only |

### Surfaces
| Token | Value | Function |
|---|---|---|
| `--ground-hi` | `oklch(.3771 .0714 159.7)` | The raised ground and the hero |
| `--ground-lift` | `oklch(.313 .0585 160)` | A panel above the page |
| `--ground` | `oklch(.2956 .0545 161.7)` | The page background |
| `--ground-sunk` | `oklch(.262 .049 160)` | The surface behind a photograph |
| `--ground-deep` | `oklch(.222 .0415 160)` | A recess |
| `--ground-pit` | `oklch(.186 .0348 160)` | The lowest surface |
| `--card` | `#f4f3ec` | Paper. Each content sheet, card and figure |
| `--rule` | `rgba(255,255,255,.055)` | Thin lines on a dark surface |

The six ground steps are one colour. The chroma follows the lightness at a
constant ratio of 0.187, thus the steps lose saturation as they become darker
and they do not become muddy. The steps are intentionally not at equal
intervals. **Select a step by the function of the surface. Do not select it by
its darkness.**

The CSS declares each step two times: a hex fallback, then the OKLCH value that
replaces it in each engine that can read `oklch()`. This project has no build
step that can add a fallback later.

### Text
| Token | Value | On | Contrast |
|---|---|---|---|
| `--ink` | `oklch(.962 .008 160)` = `#eef4f1` | ground | 12.14:1 |
| `--ink-soft` | `rgba(238,244,241,.62)` | ground | 5.58:1 |
| `--ink-faint` | `rgba(238,244,241,.58)` | ground | 5.12:1 |
| `--card-ink` | `#0b2417` | card | 14.76:1 |
| `--card-label` | `#5f6c61` | card | 4.96:1 |
| `--card-link-hover` | `#0f3b22` | card | 11.31:1 |
| `--chip-ink` | `#1d4d33` | green chip, `rgba(26,86,50,.08)` on card | 7.69:1 |
| `--note-ink` | `#6a4d02` | gold note, `rgba(253,185,19,.16)` on card | 6.54:1 |

Each text token obeys WCAG AA (4.5:1) at each size on all seven pages. The
token `--ink-faint` must obey 4.5:1 against three backgrounds, and the top of
`.swcard` is the most difficult: 4.90:1 there against 5.12:1 on the ground and
5.91:1 on the header. **If you adjust `--ink-faint` or `--card-label`, do the
check again.**

**The ink is not pure white, and this is intentional.** On a saturated dark
ground, `#fff` gives a halo effect and thin strokes become unclear. The tint
uses the hue of the ground ramp, 160, at a chroma of 0.008.

Measure these values with a canvas. Do not use a regular expression. A simple
parser reads `oklch(.962 .008 160)` as three RGB channels and reports a
contrast ratio of 1.0, which is incorrect.

### Strategy and theme
One saturated colour, UAB green, holds the surface. Gold is the only accent,
and it stays below 10% of each view. The cream `--card` gives the contrast that
makes the green look intentional.

The dark theme is an intentional decision. The hero is a three-dimensional
scene of vasculature with light on it, and a dark ground makes it clear. The
content pages then use cream sheets, thus the reader reads long text on paper.
Do not add a light theme until you decide what the hero does in that theme.

## Typography

The site uses **Lexend** only, variable weight 100 to 900, from
`assets/vendor/lexend-latin.woff2` with `font-display:swap` and a Latin subset
`unicode-range`. The fallback is the system stack.

- The body weight is **350**. The headings are at **400 to 500**, never 700.
- A paragraph on the dark ground has **0.05 more line height** than the same
  text on a cream card, because light type on a dark surface looks thinner.

The scale has eight steps. Each step is 1.25 times the step below it, from a
16px root:

| Token | Value | px | Function |
|---|---|---|---|
| `--t-micro` | `0.64rem` | 10.24 | small uppercase labels |
| `--t-label` | `0.8rem` | 12.8 | labels, metadata, captions, chips, nav |
| `--t-body` | `1rem` | 16 | body text |
| `--t-lead` | `1.25rem` | 20 | ledes and small headings |
| `--t-title` | `clamp(1.25rem, 2.2vw, 1.5625rem)` | 20 to 25 | card and project headings |
| `--t-section` | `clamp(1.5625rem, 2.9vw, 1.9531rem)` | 25 to 31.25 | section headings |
| `--t-page` | `clamp(2.4414rem, 5.4vw, 3.8147rem)` | 39 to 61 | the h1 of a page |
| `--t-display` | `clamp(3.0518rem, 7.6vw, 4.7684rem)` | 48.8 to 76.3 | the gallery cover |

**Select a step by the function of the text. Do not select it by the size that
you want.** If a size is not in this table, almost always you must not add it.

- **Each size is in `rem`**, thus the site follows a reader who increased the
  default font size of the browser. The middle value of each clamp stays in
  `vw`, because that value must follow the viewport.
- Only the display sizes are fluid. A headline of 76px must fit a phone of
  375px. Body text does not have that problem.
- The reset gives `font:inherit` to `button`. Without it, an icon button uses
  the 13.333px of the user agent, which is on no scale.
- Small capitals use `text-transform:uppercase` with letter spacing of 1.4 to
  2.6px. This is the label voice of the site. The letter spacing is still in
  px, thus it does not increase with the reader's larger text. Convert it to
  em. That is the next task.
- Use negative letter spacing, -0.2 to -1.4px, on large headings only.

The content pages intentionally do not use the hero's `--u` unit. That unit
scales each dimension with the viewport, but text must stay readable.

## Layout

- `--shell: 1180px` is the content measure. The page padding is
  `clamp(20px, 4vw, 40px)`.
- The breakpoints are **359, 560, 640, 720, 820, 860 and 900**. The primary
  breakpoint is 720px, where almost all the grids become one column.
- The radii change with the size of the component: 6 to 9px on controls, 20 to
  28px on sheets and cards, `999px` on pills, `50%` on the round button.
- A grid track that holds text uses `minmax(0, 1fr)`. Do not use `1fr` alone. A
  simple `fr` track has a minimum of min-content, which let a long title go
  past the viewport on a narrow screen.
- The `body` element intentionally has **no** `overflow-x:hidden`. That
  property hid two true overflow defects before. A defect in the future must be
  visible.

**The gallery bands.** A band is a flex row. Each `.shot` carries its aspect
ratio as `--r` and uses `flex: var(--r) 1 0`. With `flex-basis:0` the free
space divides in proportion to `--r`, thus each width is `r*k` and each height
is `k`. The bottom edges of a row are level, and no photograph is cropped. To
change the composition, move a figure to a different band.

## Movement

Two curves, both ease-out, with no bounce:

- `--ease: cubic-bezier(.22,.61,.36,1)`, the default
- `--ease-out: cubic-bezier(.16,1,.3,1)`, longer, for entrances

No animation changes a layout property. Each transition uses `transform`,
`opacity`, `color`, `background` or `box-shadow`. Three CSS blocks and the hero
JavaScript obey `prefers-reduced-motion`.

**If you make an element show on hover again, use `@media (hover:hover)`. Do
not use a width.** A tablet in landscape orientation is sufficiently wide to
miss a mobile breakpoint, but it has no pointer. A width test made the gallery
captions permanently invisible on those devices. No element on the site now
shows on hover.

## Components

| Component | Surface | Notes |
|---|---|---|
| `.sheet` | card | The default content container, radius 28px |
| `.person` | card | A portrait and a biography. `aspect-ratio:3/4`, and `4/5` below 720px, thus the frame does not cut the face of a portrait source |
| `.proj` | card | A project card with a number, label `.pnum` |
| `.feat` | card | Featured publications, 2 columns. An odd last child fills the row |
| `.post` | card | A news post. Three levels: lead, sheet and brief |
| `.swcard` | dark gradient | Software. It is dark, thus a tool does not read as a figure |
| `.shot` | photo | A gallery figure. Its ratio is in `--r` |
| `.lbox` | `<dialog>` | The shared photo viewer |

## The accessibility contract

Keep each of these conditions true. Each one is true now.

- Each text token obeys 4.5:1 on each surface where the site uses it.
- The focus indicator is `2px solid var(--uab-gold)` with an offset of 2 to
  3px, on each `a` and each `button`, with more rules for the photo tiles and
  the lightbox buttons.
- Each page has a skip link, a `lang` attribute, a meta description, and the
  landmarks `main`, `nav`, `header` and `footer`.
- The heading levels decrease and do not miss a level, and **the `h1` is the
  first heading in the source on each page**.
- Each image has alt text. Each decorative canvas and SVG has `aria-hidden`.
- The closed mobile nav has `display:none`, thus its links leave the tab
  sequence.
- The lightbox is a native `<dialog>` with `showModal`, which gives a true
  focus trap. The cleanup is an idempotent `shut()` function, not the `close`
  event, because that event does not occur in each engine.
- Each interactive target is a minimum of 24 by 24 CSS px (WCAG 2.2 SC 2.5.8),
  measured at 375px on all seven pages. The smallest is 25px, and no two
  targets touch each other. The correction is at the bottom of `site.css`:
  vertical padding on an inline box that is not a replaced element increases
  the target area and does not change the line box. This rule controls the
  height of the `<a>` element, not of the chip or the paragraph around it. **If
  you change the style of a link, measure it again.**

## The performance contract

- Each image is a WebP file at approximately 2 times the size of its display
  box. The gallery is the reference: 1500px on the longest edge, quality 64 to
  78.
- Each element below the first screen has `loading="lazy"`. Only the cover is
  eager.
- Each image has a `width` and a `height`, or its container has an
  `aspect-ratio`, thus no element moves when the image loads.
- An `IntersectionObserver` controls the WebGL work of the hero. The three.js
  scene and the two liquid-metal shaders stop when their host goes off the
  screen.
- The CSS and JavaScript of the hero are external files (`hero.css`,
  `hero-liquid.js`, `hero-scene.js`), thus a browser can keep them in its
  cache. Inline code caused a download of 205 KB at each visit.
- **Increase the `?v=` number on `site.css` each time that you change it.**

## Design methods that this project does not use

Continue to keep away from these methods:

- No gradient text.
- No glassmorphism as decoration. There are two uses of `backdrop-filter`, and
  both are functional chrome above content that scrolls. The hero refuses a
  third use, because it would be above a canvas that paints again at each
  frame.
- No hero-metric template. No card grid with an icon above each heading.
- No bounce or elastic easing.
- No monospace type as a sign of "technical" work.
- Almost no centred text. The site has one `text-align:center` declaration.

Two gold accents stay intentionally: a `border-left` on `.pullquote`, which is
a typographic convention that is older than the web, and a `border-top` on
`.feat > article`.
