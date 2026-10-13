# Black & Gold East Bay — website redesign

A redesigned website for **Black & Gold East Bay**, a barbershop at
846 B St, Hayward, CA. It's built to bring in more booked appointments
from people searching locally ("barber Hayward", "fade near me",
"barbershop 94541").

> **Status: concept / pitch build.** Until the owner approves it, the
> site runs in concept mode: hidden from search engines, with a small
> "Concept preview" banner. See [HANDOFF.md](HANDOFF.md) to go live.

## Who it's for

- **Visitors:** people in and around Hayward, mostly on phones and often
  arriving from Google Maps, who want to find a barber and book fast.
- **The owner:** a site that ranks locally, looks trustworthy, and gets
  people to "Book now" in one tap.

For a plain-language summary for the owner, see [PITCH.md](PITCH.md).

## What it was optimized for

- **Getting found on Google:** a unique title, description and single
  h1 on every page; `HairSalon` structured data; one page per service;
  sitemap and canonical URLs; redirects from the old Squarespace URLs.
- **Booking in as few taps as possible:** "Book now" sits in the header
  and in a sticky bottom bar on phones, so Blismo is one tap away, and
  any barber is two taps away (Barbers → "Book with …").
- **Speed:** static HTML with almost no JavaScript (78 KiB home page vs
  949 KiB before). Lighthouse 100 across the board on a
  production-equivalent build.
- **Accessibility:** WCAG 2.1 AA. Zero axe-core violations, keyboard
  navigable, visible focus, reduced motion respected.
- **Honesty:** nothing invented. Unconfirmed hours, prices, handles and
  reviews show clear "TBD" or empty states, never guesses.

Booking stays on **Blismo** and messaging stays on **Instagram**. There
is no backend and the site collects no personal data.

## Stack

| Tool | What it does | Why we chose it |
|---|---|---|
| [Astro](https://astro.build) 7 | Builds the site into static HTML files | Ships almost no JavaScript, so pages load fast on phones |
| [Tailwind CSS](https://tailwindcss.com) 4 | Utility classes generated from design tokens | Keeps spacing and color on the design system |
| TypeScript | Type-checks the content file | A barber missing a booking ID fails the build instead of shipping a broken button |
| @astrojs/sitemap | Generates `sitemap-index.xml` | Standard SEO plumbing, zero config |
| Fontsource | Self-hosted Big Shoulders Display + Instrument Sans | No third-party font requests; preloaded to avoid layout shift |
| playwright-core (dev) | Renders the share image and favicons from HTML | Images use the real brand fonts; regenerate with one command |
| [Netlify](https://netlify.com) | Hosting and CDN | Free tier, preview URLs, settings live in `netlify.toml` |

## Run it locally

Requires Node 22+.

```sh
npm install
npm run dev        # local dev server at http://localhost:4321
npm run build      # type-check, build to dist/, then run site checks
npm run preview    # serve the built site locally
npm run images     # regenerate og-image.png and favicons (needs Chromium)
```

`npm run build` also runs `scripts/check-site.mjs`, which fails the
build if any page is missing an h1, title, description, canonical link
or image alt text, has a broken internal link or invalid structured
data, or lacks a Book now link.

## Deploy (Netlify)

1. In Netlify: **Add new site → Import an existing project**, and pick
   this repo and branch.
2. Netlify reads `netlify.toml`: build command `npm run build`, publish
   directory `dist`, Node 22. No other settings needed.
3. Every push redeploys. Netlify sets the site URL automatically, so
   canonical links and the sitemap always point at the deployed address.

While `CONCEPT_MODE` is on, every page sends `noindex` (meta tag,
`robots.txt` and an `X-Robots-Tag` header).

## How the owner updates the site

**Everything is in one file: [`src/content/site.ts`](src/content/site.ts).**
Edit it, commit, and Netlify rebuilds in about a minute. Each section
has comments explaining what to fill in.

| To change… | Edit in `site.ts` |
|---|---|
| Shop hours | `hours`: set `confirmed: true` and fill in all 7 days (`opens: null` = closed) |
| Prices / durations | `services[].priceUsd` and `durationMinutes` (`null` shows "TBD") |
| Add or remove a barber | Add or delete an entry in `barbers` (name, Blismo `employeeId`, photo, bio, specialty) |
| A barber's Instagram | `barbers[].instagram`: set the handle and `confirmed: true` to show the DM button |
| Barber photo | Put the image in `public/barbers/` and set `photo: "/barbers/name.jpg"` |
| FAQ answers | `faq[].answer` (`null` shows "Answer TBD") |
| Reviews | Add real reviews to `reviews` with `approvedByOwner: true` |
| Gallery | Add photos to `public/gallery/` and list them in `gallery` |
| Address / phone | `business` (must match Google Business Profile exactly) |

**Individual barbers' availability lives in Blismo**, not on the
website. Each barber keeps editing their own schedule there; the site
only links to it, so it's never out of date.

A Blismo `employeeId` is the number at the end of a barber's booking
link (`…/appointments?employeeId=1275`).

## Project layout

```
src/content/site.ts     All business content (the file to edit)
src/pages/              One file per page; services/[slug] makes 3 pages
src/components/         Reusable pieces (Button, BarberCard, HoursList…)
src/layouts/            Page shell with SEO tags and structured data
src/lib/                Helpers: formatting, schema.org, map links
src/styles/global.css   Design tokens (colors, type scale, spacing)
scripts/                Build checks and image generation
docs/                   Audit, design system, accessibility review
```

## Docs

- [PITCH.md](PITCH.md) — one-page summary for the owner
- [HANDOFF.md](HANDOFF.md) — go-live checklist
- [docs/phase-1-audit-and-plan.md](docs/phase-1-audit-and-plan.md) —
  audit of the current site and the plan
- [docs/design-system.md](docs/design-system.md) — tokens and components
- [docs/accessibility-review.md](docs/accessibility-review.md) — WCAG
  2.1 AA review results
