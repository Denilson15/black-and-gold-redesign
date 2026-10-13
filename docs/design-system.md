# Design system

Tokens live in [`src/styles/global.css`](../src/styles/global.css)
(`@theme` block). Tailwind turns each token into utility classes, e.g.
`--color-gold` → `bg-gold`, `text-gold`. Components use tokens only,
never raw hex values.

## Concept

**The shop's own brand, refined.** Everything comes from the BG badge
logo: its gold (#FCB125), its black, and its white lettering. Sections
alternate black, white and gold the way the current site does, but
with consistent spacing. The barbers' portraits are shot on white, so
the barbers section is white and the photos blend in edge to edge.
Headings use widely spaced uppercase lettering, echoing the badge.

## Color

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `ink` | #000000 | Black sections | — |
| `gold` | #FCB125 | Logo gold: primary buttons, accents, footer | 11.5:1 on ink |
| `gold-bright` | #FFC54D | Hover on gold | — |
| `paper` | #FFFFFF | White sections | — |
| `charcoal` | #161616 | Raised panels on black | — |
| `text` | #F2F2F2 | Text on black | 18.8:1 |
| `muted` | #B3B3B3 | Secondary text on black | 10.0:1 (8.6:1 on charcoal) |
| `text-dark` | #0A0A0A | Text on white or gold | 19.8:1 on paper, 10.8:1 on gold |
| `muted-dark` | #575757 | Secondary text on white | 7.2:1 |
| `line` | #2E2E2E | Hairlines on black (decorative) | — |
| `line-strong` | #737373 | Button borders on black | 4.4:1 |
| `line-paper` | #E3E3E3 | Hairlines on white (decorative) | — |

**Rules:** never put gold text on white (1.8:1), and use only
`text-dark` on gold (`muted-dark` drops to 3.9:1). On white and gold
sections, add the `on-light` class so the focus ring turns dark.

## Type

- **Jost** (variable), one family for everything. It's geometric, like
  the lettering in the logo. Self-hosted and preloaded.
- Headings: weight 400–500, uppercase, letter-spacing 0.14em
  (`--tracking-caps`). Small info headings (Hours, Visit) use the
  `heading-sm` utility: 14px with 0.24em spacing.
- Buttons and nav: uppercase, 0.14em spacing.

| Token | Size | Use |
|---|---|---|
| `text-sm` | 14px | Buttons, nav, small headings |
| `text-base` | 16px | Body |
| `text-lg` | 18px | Intros |
| `text-xl` | 21px | Service names (phone), FAQ |
| `text-2xl` | 24px | Service names |
| `text-3xl` | 26–32px fluid | Band headings |
| `text-4xl` | 32–44px fluid | Page h1s, section h2s |
| `text-hero` | 40–80px fluid | Home hero and 404 only |

Body text is capped at `max-w-prose` (38rem, about 70 characters).

## Spacing and shape

- Tailwind's 4px spacing scale, plus `gutter` (20px page padding) and
  `section` (56–96px fluid gap between sections).
- Radius: `control` 2px (crisp, nearly square buttons), `panel` 4px.
- Layout: `max-w-page` 74rem. Content is left-aligned; the hero is
  centered around the logo badge.

## Components

| Component | Variants / states | Accessibility |
|---|---|---|
| `Button` | primary (gold), secondary (outline on black), dark (black on white/gold), outline-dark; md, lg | Renders `<a>`; min 48px tall; external links announce "(opens in a new tab)" |
| `Logo` | badge mark + name; 2x/3x for sharp phone screens | Mark is decorative (`alt=""`); the name is the link text |
| `BarberCard` | portrait or initial placeholder; specialty and bio only when set; DM only for confirmed handles | Full name in booking label ("Book with Mark DeGuzman") |
| `InstagramDM` | dark / light tone; hidden when handle missing or unconfirmed | Screen readers hear "Message Mel on Instagram" |
| `HoursList` | confirmed (day list) / "open times on the booking calendar"; dark / light tone | `<dl>` for day/hours pairs |
| `ServiceList` | price and time shown only once confirmed | Ruled list of links to service pages |
| `MapEmbed` | idle → loading → loaded, or error with retry; works without JS | Status announced via `aria-live`; iframe has a title |
| `MobileBookingBar` | phones only | `nav` landmark "Book or call" |
| `ConceptBanner` | gold strip, concept mode only | `aside` landmark |
| `BookingBand` | white band; `flush` after another white section | — |
| `Header`, `Footer`, `PageHeader`, `Address` | footer is gold, like the current site | Header menu is a native `<details>` (works without JS) |

## States

- **Unconfirmed content:** hidden from visitors, never shown as a
  placeholder (hours fall back to "open times are on the booking
  calendar").
- **Empty pages:** Gallery, Reviews and FAQ stay out of the menu until
  the content file has enough real content (3 photos, 1 review, 3
  answers). The pages still work if visited directly.
- **Loading / error:** the map and the optional hero video (falls back
  to the photo; never plays under reduced motion).
- **404:** "Wrong chair" page with Book now, Home and Call.

## Motion

Kept minimal: color transitions on hover (150ms), the FAQ plus sign
rotating when opened, and the optional muted hero video. All motion is
disabled under `prefers-reduced-motion: reduce`.
