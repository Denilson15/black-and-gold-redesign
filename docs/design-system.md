# Design system

Tokens live in [`src/styles/global.css`](../src/styles/global.css)
(`@theme` block). Tailwind turns each token into utility classes, e.g.
`--color-gold` → `bg-gold`, `text-gold`. Components use tokens only,
never raw hex values.

## Concept

**Gold-leaf window lettering.** Barbershop windows have been gilded by
sign painters for a century: gold letters with a darker drop shade on
glass. The hero headline uses that treatment (the `.gilded` class), and
it appears once per page. Everything else stays quiet: true black,
plain neutrals, one accent color.

## Color

| Token | Hex | Role | Contrast on ink |
|---|---|---|---|
| `ink` | #000000 | Page background (the shop's true black) | — |
| `gold` | #FFC500 | Brand gold, primary buttons, h1s | 13.2:1 |
| `gold-bright` | #FFD54A | Hover on gold surfaces | — |
| `gold-shade` | #7A5D00 | Drop shade on gilded type (decorative) | — |
| `surface` | #1A1A1A | Raised panels | — |
| `text` | #EDEDED | Body text | 17.9:1 |
| `muted` | #A6A6A6 | Secondary text | 8.6:1 (7.1:1 on surface) |
| `line` | #333333 | Hairline dividers (decorative) | — |
| `line-strong` | #6B6B6B | Button borders, TBD markers | 3.9:1 (3.3:1 on surface) |
| `danger` | #FF8A80 | Error text | 9.2:1 |

Black text on a gold button: 13.2:1. Every text pair passes WCAG AA
(4.5:1) and most pass AAA (7:1). UI borders pass the 3:1 non-text rule.

## Type

- **Display:** Big Shoulders Display (variable), weights 800–900. Used
  for headings. It's condensed, so long headings fit on a phone.
- **Body:** Instrument Sans (variable), weights 400–600.
- Both are self-hosted and preloaded (no layout shift).

| Token | Size | Use |
|---|---|---|
| `text-sm` | 14px | Footnotes, TBD markers |
| `text-base` | 16px | Body |
| `text-lg` | 18px | Intros, list copy |
| `text-xl` | 21px | Hero subhead, FAQ questions |
| `text-2xl` | 24px | Small headings (Hours, Location) |
| `text-3xl` | 30–36px fluid | Card and section sub-headings |
| `text-4xl` | 36–48px fluid | Page h1s, section h2s |
| `text-hero` | 56–120px fluid | Home hero and 404 only |

Body text is capped at `max-w-prose` (40rem, about 70 characters).

## Spacing and shape

- Tailwind's 4px spacing scale, plus `gutter` (20px page padding) and
  `section` (56–96px fluid gap between sections).
- Radius: `control` 4px (buttons), `panel` 8px (panels and cards).
- Layout: `max-w-page` 72rem, left-aligned content.

## Components

| Component | Variants / states | Accessibility |
|---|---|---|
| `Button` | primary (gold, booking only), secondary (outline); md, lg; hover; focus ring | Renders `<a>`; min 48px tall; external links announce "(opens in a new tab)" |
| `BarberCard` | with photo / monogram placeholder; bio or "coming soon"; DM shown only for confirmed handles | Full name in booking label ("Book with Mark DeGuzman") |
| `InstagramDM` | hidden when handle missing or unconfirmed | Screen readers hear "Message Mel on Instagram" |
| `HoursList` | confirmed (day list) / TBD state with call link | `<dl>` for day/hours pairs |
| `ServiceList` | price and time, or TBD markers | Ruled list of links to service pages |
| `MapEmbed` | idle → loading → loaded, or error with retry; works without JS | Status announced via `aria-live`; iframe has a title |
| `MobileBookingBar` | phones only | `nav` landmark "Book or call" |
| `ConceptBanner` | shown only in concept mode | `aside` landmark |
| `BookingBand`, `PageHeader`, `Address`, `Header`, `Footer`, `Wordmark` | — | Header menu is a native `<details>` (works without JS) |

## States

- **Empty:** gallery slots, reviews (links to Google), barber photo
  monograms, "Bio and specialty coming soon".
- **Placeholder / TBD:** dashed `.tbd` marker for unconfirmed hours,
  prices, times, parking and FAQ answers.
- **Loading / error:** the map (the only thing that loads on demand).
- **404:** "Wrong chair" page with Book now, Home and Call.

## Motion

Kept minimal: color transitions on hover (150ms) and the FAQ plus sign
rotating when opened. All motion is disabled under
`prefers-reduced-motion: reduce`.
