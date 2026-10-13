# Phase 1 — Audit & Plan

Status: **decisions made; waiting on network access to finish the
audit before building.**

## Decisions (2026-10-13)
- **Hosting:** Netlify (a preview deploy with noindex during the pitch).
- **Framework:** Astro + Tailwind.
- **Content editing:** one TypeScript content file for now. A git-based
  CMS can be added later on top of the same file.
- **Services:** three dedicated service pages, folded back into one if
  the owner can't supply enough distinct detail.
- **Audit:** finish Section 1 (live-site audit, before Lighthouse
  scores, Blismo barber IDs) before building, once the domains below
  are allowed.

---

## 0. Blockers and caveats (read first)

- **I could not reach the live site.** This build environment's network
  policy denies `www.blackandgoldeastbay.com`, `blackandgoldeastbay.com`
  and `blismo.com` (the proxy returns HTTP 403). The shared Google
  PageSpeed API key is also over its daily quota. Section 1 is therefore
  a **checklist with your reported findings**, not a completed audit. I
  have not filled it in with guesses.
- **To unblock it:** in the cloud environment's settings (the
  environment menu in the session title bar → Edit → Network access),
  add these allowed domains:
  `blackandgoldeastbay.com`, `www.blackandgoldeastbay.com`,
  `blismo.com`, `images.squarespace-cdn.com`, `static1.squarespace.com`.
  Steps: https://code.claude.com/docs/en/cloud-environments#network-access.
  Once they're allowed, I'll run Lighthouse locally (in headless
  Chromium, so no API quota) and finish Section 1, including the
  barber-to-`employeeId` mapping.
- **The repo is public**, not private as the brief assumes. Please
  switch it to private before real business details land in it.
- **The frontend-design, design-system and accessibility-review skills
  aren't installed** in this environment. Without them I'll follow the
  same standards by hand (tokens, type scale, a contrast check and a
  WCAG 2.1 AA pass), unless you can add the skills.

---

## 1. Audit of the current site

Legend: ✅ confirmed · 🟡 reported by you, not yet verified by me ·
⬜ not checked yet (blocked)

### On-page SEO
| Check | Status | Notes |
|---|---|---|
| `<title>` tag | ⬜ | Should name the service, the city and the brand |
| Meta description | 🟡 empty | Google writes its own snippet when this is missing, and it's often a poor one |
| Heading structure (one h1, logical order) | ⬜ | Squarespace templates often use styled text instead of real headings |
| Image alt text | ⬜ | |
| Open Graph image | 🟡 a screenshot | This is what shows when the link is shared in iMessage, IG or Facebook |
| Structured data (JSON-LD) | ⬜ | Squarespace adds basic `Organization`/`LocalBusiness` data only when the business info is filled in. I expect no `HairSalon` type, no hours and no booking action |
| Canonical URLs | ⬜ | |
| sitemap.xml / robots.txt | ⬜ | Squarespace generates these automatically |
| Broken or empty links | 🟡 `/cart` | A store cart on a site with no store makes it look unfinished |
| Typos | 🟡 "APPOINMENT" | Also check for others |
| Hours | 🟡 conflicting | The site shows "SUN-MON 10AM-3PM" and "TUE-SAT 10AM-3PM" (see the open questions) |

### Design, mobile, performance, accessibility
| Check | Status |
|---|---|
| Visual design and brand use | ⬜ |
| Mobile layout, tap targets, Book Now above the fold | ⬜ |
| Taps from landing to Blismo | ⬜ |
| Tap-to-call (`tel:` link) | ⬜ |
| Lighthouse mobile: Performance / A11y / Best Practices / SEO | ⬜ (this becomes the "before" baseline) |
| Core Web Vitals (LCP, CLS, INP) | ⬜ |
| Color contrast (gold on black) | ⬜ |
| Keyboard navigation and focus visibility | ⬜ |

### Third-party data inconsistency (found while blocked)
A NewsBreak aggregator listing for the shop
([source](https://www.newsbreak.com/local/spot/b_vd0ml86xjuyy)) shows a
third set of hours: Mon 10–3, Tue–Fri 10–6, Sat 9–6, Sun 10–3. **I'm not
using these.** It does show that the hours aren't consistent across the
web. That hurts local ranking, and the owner may lose walk-ins who see
the wrong times. It's another reason to confirm the real hours with him.

---

## 2. Local SEO gap list

These are things strong local barbershop sites have. I'll mark each one
as confirmed missing once I can see the site.

1. **`HairSalon` JSON-LD** (a subtype of `LocalBusiness`) with the name,
   address, geo coordinates, phone, `openingHoursSpecification`,
   `priceRange`, `sameAs` (Instagram, Google), `hasMap` and a
   `potentialAction: ReserveAction` pointing at Blismo.
2. **NAP consistency.** Name, address and phone written exactly the
   same everywhere: on the site, in the Google Business Profile, on
   Yelp, Apple Maps and Instagram. Hours too.
3. **An embedded Google Map** plus a written-out address and directions
   ("Downtown Hayward, near …" and landmarks the owner confirms).
4. **Service pages.** A page each for haircuts and fades, beard
   grooming, and hot towel shaves gives Google a specific page to rank
   for "fade Hayward" or "beard trim Hayward". A single list on one
   page is much weaker.
5. **An FAQ** answering real questions (walk-ins, kids, payment,
   parking, cancellations). Note: since 2023 Google only shows FAQ rich
   results for government and health sites. The *content* still helps
   rankings and conversions, but `FAQPage` schema won't create special
   search snippets for a barbershop.
6. **Reviews.** Real reviews only, linked to the Google review page.
   That's a trust signal for visitors and supports the review count on
   the Google Business Profile, which matters more for the map pack
   than anything on the site.
7. **Copy that mentions the location** (Hayward, Downtown Hayward,
   94541, East Bay) and reads naturally, not stuffed.
8. **Unique titles and meta descriptions** for every page.
9. **Fast mobile pages.** Core Web Vitals and mobile-friendliness are
   ranking factors.
10. **Descriptive alt text** on cut photos ("Skin fade with hard part,
    Black & Gold East Bay, Hayward").
11. **A designed share image** for links.
12. **Google Business Profile hygiene** (off-site, but the biggest
    lever): correct hours, website link, booking link, categories,
    photos, and replies to reviews. This goes in the handoff checklist.

---

## 3. Tech stack options (you decide)

There are really **two separate decisions** here: (1) what the site is
built and hosted on, and (2) how content gets updated after handoff.

### An important point about "a barber editing his hours"
**Each barber's personal availability already lives in Blismo**, and
each barber can change it there. The site should never copy it. It
links to Blismo, so the site is never wrong about who's free. The only
hours the site shows are the **shop's opening hours**, and those also
have to match the Google Business Profile, which more people see than
the website. So "who updates hours?" is mostly "who updates shop hours
on the site *and* on Google, and how often does that happen?" (Rarely:
holidays and schedule changes.)

### Option A — Static site: Astro + Tailwind on Netlify / Vercel / Cloudflare Pages
- **What it is:** Astro builds plain HTML/CSS files ahead of time and
  ships almost no JavaScript. The host serves those files from a CDN.
- **Pros:** the best possible speed and Core Web Vitals. Full control
  of SEO (schema, titles, headings, image formats). Hosting is free on
  all three hosts' free tiers at this traffic level. No platform lock-in
  (the output is just files). Every change is version-controlled and
  can be rolled back. Preview URLs come for free, which suits the
  noindex pitch build.
- **Cons:** someone has to own updates. Without a CMS (see below) the
  owner can't edit anything himself. A developer is needed for layout
  changes.
- **Cost:** about $0/month for hosting, plus the domain (about $10–20 a
  year, which he likely already pays).
- **Host differences:** all three are fine. Netlify has the simplest
  form and CMS story and an MCP connector here. Cloudflare Pages has the
  most generous free bandwidth. Vercel is most tied to Next.js. For this
  site the choice matters little.
- **Tailwind vs. plain CSS:** Tailwind (utility classes) is fast to
  build with and keeps spacing and colors on the design tokens. Plain
  CSS with custom properties is easier for a non-developer to read
  later. Either works.

### Option B — Rebuild inside Squarespace
- **Pros:** the owner already has it, and he (or anyone) can edit text,
  hours and photos in a visual editor. No handoff dependency on you.
  Hosting, SSL and the domain are bundled.
- **Cons:** slower (Squarespace loads a lot of platform JavaScript, so
  scores are usually well below a static site). Limited SEO control:
  you can add custom JSON-LD through code injection, but only on higher
  plans, and you can't fully control the markup or headings. Locked to
  the platform. The design is limited to what templates allow.
  Ongoing subscription cost (check current Squarespace pricing; it's
  monthly and higher than static hosting).
- **For the pitch:** this mainly improves what he has. It's a weaker
  "this is why you should switch" story, but the easiest yes.

### Content editing after handoff (applies to Option A)
| Approach | How the owner updates | Pros | Cons |
|---|---|---|---|
| **1. A single JSON/TS content file in the repo** | He texts you, you edit one file, push, and the site rebuilds in about a minute | Free, simplest, zero vendor risk, everything in one place (the brief already asks for one config file) | He depends on you, and you become the bottleneck. Fine if changes are rare and you're offering ongoing support |
| **2. Git-based CMS (e.g. Decap or Sveltia CMS)** | He logs in to `/admin` on the site and edits a form (hours, prices, barbers). It saves to the same content file in GitHub and the site rebuilds | Free. Content stays in the repo (no lock-in). Builds on approach 1, so it can be added later without a rewrite | Needs a login set up through GitHub or an auth provider. The editor is functional, not polished |
| **3. Hosted headless CMS (e.g. Sanity, Contentful, Storyblok)** | A polished web app (and phone) editor. Saving triggers a rebuild | The best editing experience, with roles per barber | A third-party account he must own. Free tiers have limits and pricing can change. More moving parts (webhooks). Content lives on their servers |

**My read on the tradeoff:** approach 1 now, built so that approach 2
can be added later on the same file, keeps the pitch build simple
without blocking self-editing. You can sell self-editing as an upgrade.
That's an observation, not a pick. Hosting and CMS are your call.

---

## 4. Proposed sitemap and page outline

Goal: Book Now is one tap from any page, and per-barber booking is at
most two taps (Barbers → "Book with X" → Blismo).

```
/                         Home
/barbers/                 Barbers (all cards on one page)
/services/                Services overview
/services/haircuts/       Haircuts & fades
/services/beard-grooming/ Beard grooming & shaping
/services/hot-towel-shave/Hot towel shave
/gallery/                 Gallery
/reviews/                 Reviews (see note)
/location/                Visit us: map, directions, parking, hours
/faq/                     FAQ
/privacy/                 Privacy
/404                      Not found (with Book Now + Call)
```

**Global on every page:** a header (logo, nav, Book Now button), a
sticky mobile bar (Book Now + Call), a footer (NAP matching Google,
hours, shop Instagram + DM, privacy link), a removable "Concept
preview" marker, `noindex` during the pitch, and the shared
`HairSalon` JSON-LD.

| Page | h1 (draft) | Sections | Primary CTA |
|---|---|---|---|
| Home | "Precision cuts in Hayward" | Hero (value prop, Book Now, Call) · hours, address and today's status · services teaser · barbers teaser · reviews strip (real only, or hidden) · location teaser with map · Instagram link | Book Now |
| Barbers | "Meet the barbers" | One card per barber from the config file: photo, name, specialty, short bio, "Book with X", "Message X on Instagram" (hidden if no handle) | Book with X |
| Services | "Barber services in Hayward" | A card per service (description, duration, price "TBD") → links to the detail pages | Book Now |
| Service detail ×3 | e.g. "Haircuts & fades in Hayward" | What's included, duration, price TBD, who it's for, related FAQ, Book Now | Book Now |
| Gallery | "Recent cuts" | A grid of placeholder slots with an empty state; real photos only with permission | Book Now |
| Reviews | "What clients say" | Real reviews only. Until we have them, show an honest empty state ("Read our reviews on Google →") | Leave/read a Google review |
| Location | "Barbershop in Downtown Hayward" | Map embed (lazy-loaded, with a static fallback), address, directions, parking (placeholder), hours, phone, shop IG DM | Get directions / Book Now |
| FAQ | "Frequently asked questions" | Walk-ins, kids' cuts, payment, cancellation, parking (all placeholders until confirmed) | Book Now |
| Privacy | "Privacy" | Plain-language note: the site collects nothing; booking is on Blismo and DMs are on Instagram, each under its own policy | — |

**SEO note on the per-service and reviews pages:** separate service
pages only help if each has real, specific content. Three near-copies
would be "thin content". If the owner can't give enough detail, we
fold them back into one Services page. Likewise, an empty `/reviews/`
page is worse than none. Until real reviews are approved, it could be
a home-page section plus a Google link. **Per-barber pages**
(`/barbers/mel/`) could rank for name searches, but they're deferred to
a later phase.

---

## 5. Open questions for the owner

Every item below becomes a flagged placeholder in PITCH.md until it's
answered.

**Business facts**
1. **Correct shop hours** for each day. The site's "SUN-MON / TUE-SAT
   10–3" looks wrong, and a third-party listing shows different hours.
2. **Is the name, address and phone exactly as on the Google Business
   Profile?** ("Black & Gold East Bay", "846 B St", "(510) 397-6642"),
   including the "&" vs "and" spelling.
3. **Service list, prices and durations.** Are there others (kids'
   cuts, lineups, designs, enhancements)?
4. **Price range** for the schema (`$`, `$$`).

**Barbers**
5. Each barber's **Instagram handle** (all five are placeholders now).
6. Confirm the **barber roster** and the **Blismo employee IDs** (I'll
   pull these from the live site once access is allowed).
7. Each barber's **specialty and a short bio**, in their own words.
8. **Barber photos**, and each barber's permission to use them.

**Policies**
9. **Walk-ins**: accepted? When?
10. **Kids' cuts**: offered? Minimum age? Price?
11. **Payment methods** (cash, card, Apple Pay, Zelle, Venmo?) and
    tipping.
12. **Cancellation and no-show policy** (and whether Blismo enforces a
    deposit).
13. **Parking**: street, meters, a lot? Any landmarks for directions?

**Content and permissions**
14. **Real reviews** he's OK with us quoting (and from where:
    Google, Yelp?), plus his Google review link.
15. **Permission to use photos** from his Instagram or site, and which
    ones. Who took them (the photographer's rights)?
16. **The logo**: is a high-resolution or vector version available?

**Accounts and ownership**
17. **Who owns the domain** `blackandgoldeastbay.com`, and at which
    registrar? (Squarespace Domains, or elsewhere?)
18. **Who owns and manages the Google Business Profile?**
19. Who manages Blismo, and can it link back to the new site?
20. After launch, **who updates the shop hours** (on the site and on
    Google), and how often do they change?

---

## Next step
Approve or adjust this plan, choose the hosting and content-editing
approach, and (ideally) allow the domains in Section 0 so I can finish
the audit and capture the "before" Lighthouse scores. I won't start
building until you say so.
