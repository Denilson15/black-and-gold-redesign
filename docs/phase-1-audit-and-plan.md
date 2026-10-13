# Phase 1 — Audit & Plan

Status: **audit complete; plan approved in part (see Decisions).
Waiting on the go-ahead to start building.**

## Decisions (2026-10-13)
- **Hosting:** Netlify (a preview deploy with noindex during the pitch).
- **Framework:** Astro + Tailwind.
- **Content editing:** one TypeScript content file for now. A git-based
  CMS can be added later on top of the same file.
- **Services:** three dedicated service pages, folded back into one if
  the owner can't supply enough distinct detail.

---

## 0. Caveats (read first)

- **How the audit was run:** raw HTML of every page in the sitemap,
  Lighthouse 12 run locally (3 mobile runs, 1 desktop) and a
  Playwright render on an emulated iPhone 13, all on 2026-10-13.
- **Test-environment limits:** the test browser can't play the hero
  video (it lacks the H.264 video codec, which Chrome on a phone has),
  and the network proxy blocked a few third-party hosts (Blismo's API,
  an icon CDN, analytics). Lighthouse therefore measured the hero's
  "video not supported" message as the largest element. The
  **Performance and LCP numbers are indicative, not exact.** The SEO,
  accessibility and markup findings are unaffected. Please glance at
  the site on your own phone to confirm the video plays.
- **The repo is public**, not private as the brief assumes.

---

## 1. Audit of the current site

Every finding below was confirmed in the live HTML or a Lighthouse run.

### Before scores (Lighthouse 12, 2026-10-13)
| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Mobile (median of 3; range 42–67) | **65** | 98 | 96 | 92 |
| Desktop | **84** | 98 | 96 | 92 |

Mobile metrics (median run): FCP 2.8 s, LCP 8.0 s (see caveat), TBT
230 ms, CLS 0.006, page weight 949 KiB, 42 script tags.

**Why 92 SEO and 98 accessibility are misleading:** Lighthouse only
checks technical basics. It counts `alt=""` as "decorative image, fine"
even on the barbers' photos, and it doesn't check local SEO at all
(business schema, NAP, service pages). The real gaps are below.

### On-page SEO
| Check | Finding |
|---|---|
| `<title>` | Home: "BLACK & GOLD EAST BAY". No service, no city, all caps. Other pages: "CONTACT — …", "Appointments — …" |
| Meta description | **Empty on every page** (`content=""`) |
| h1 | **None on any page.** Home starts at h2 "Meet your Professionals", then jumps to h4 (Lighthouse flags the heading order) |
| Image alt text | **All 8 images have empty alt**, including the 5 barber photos and the logo |
| Open Graph / Twitter | Share image is "Screenshot 2025-09-25 at 9.17.52 PM.png", served over `http://`. Twitter card is the small `summary` type. No description |
| Structured data | Two blocks, both effectively empty: `WebSite` with `description: ""` and `LocalBusiness` with `address: ""` and `openingHours: ""`. No HairSalon type, phone, geo, hours, sameAs or booking action |
| Canonicals | Present and correct. `/home` duplicates `/` but canonicalizes to it |
| sitemap.xml | Lists `/home`, `/contact` and **`/appointments`** |
| `/appointments` page | **Still shows Squarespace's template filler text** ("It all begins with an idea. Maybe you want to launch a business…"), and it's in the sitemap, so Google can index it |
| robots.txt | Squarespace default. It also blocks ~30 AI crawlers (GPTBot, ClaudeBot, Google-Extended…), an "AI crawler blocking" toggle. This is a choice for the owner, not a bug |
| `/cart` link | A cart icon showing "0" in the header links to an empty store cart. The shop has no store |
| Typos | "BOOK AN **APPOINMENT**" (home button). The heading on `/appointments` is spelled correctly |
| Hours | "SUN - MON // 10AM - 3PM" and "TUE - SAT // 10AM - 3PM" (Monday appears in both ranges and every day shows the same hours) |
| NAP formatting | "846 B St" vs "846 B St." on the same page. Phone shown as "510.397.6642" |
| Link text | The 5 per-barber links all say "View availability", with no barber name in the link (bad for screen readers and SEO) |

### Content
- **Services:** 3 described (Haircuts; Beard Grooming & Shaping; Hot
  Towel Shave). **No prices, no durations**, no individual pages.
- **Barbers:** 5 cards (photo, name, "View availability"). No bio,
  specialty or Instagram.
- **Missing entirely:** map, directions, parking, FAQ, reviews,
  gallery, privacy page, any mention of "barber"/"barbershop" +
  "Hayward" in a heading.
- Good existing copy to keep: "over 3 decades of combined experience"
  (owner to confirm) and the service descriptions.

### Barber → Blismo ID mapping (from the live site's markup)
| Barber | `employeeId` | Photo file |
|---|---|---|
| Jamie Anabeza | 1275 | BARBERS-5.jpg |
| Francis G | 1276 | BARBERS-1.jpg |
| Mel | 1327 | BARBERS-2.jpg |
| Joe the Barber | 1321 | BARBERS-4.jpg |
| Mark DeGuzman | 1320 | BARBERS-3.jpg |

Paired by order in the page (photo → name → link for each card). The
names couldn't be cross-checked inside Blismo, because Blismo's API was
blocked in the test browser. One tap on each link confirms it.

### Design, mobile, performance, accessibility
| Check | Finding |
|---|---|
| Brand | Black + bright gold (≈ #FFC500) with a blurred background video hero. The colors are strong and worth keeping |
| Typography | **5 font families** load (Sometype Mono, Raleway, Bebas Neue, Space Grotesk, Clarkson). Inconsistent, and extra download |
| Above the fold (iPhone 13) | Logo text, a mostly empty video area, then Book Now. No value proposition, no city, no phone |
| Taps to Blismo | 1 (Book Now). Good, keep it |
| Tap-to-call | Only in the footer and on `/contact` (`tel:5103976642`). Not near the top |
| Performance | ~1.5 s of render-blocking CSS/JS, ~445 KiB of offscreen images loaded up front, ~260 KiB of unused CSS/JS, heavy main-thread work (2.6 s), console errors from Squarespace scripts |
| Contrast | Gold on black and black on gold both pass AA comfortably |
| Keyboard | A "Skip to Content" link exists. Focus styles come from the template defaults |

### Third-party data inconsistency
A NewsBreak aggregator listing
([source](https://www.newsbreak.com/local/spot/b_vd0ml86xjuyy)) shows a
third set of hours: Mon 10–3, Tue–Fri 10–6, Sat 9–6, Sun 10–3. **I'm not
using these.** It does show that the hours aren't consistent across the
web, which hurts local ranking and can send walk-ins at the wrong time.

---

## 2. Local SEO gap list

These are things strong local barbershop sites have. **Every item below
is missing from the current site** (confirmed in the audit), except the
Google Business Profile, which lives off-site.

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

### Option A — Static site: Astro + Tailwind on Netlify/Vercel/Cloudflare
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
6. Confirm the **barber roster** and the **Blismo employee IDs**
   (pulled from the live site; see the mapping in Section 1).
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

**Found in the audit**
21. Does the background **video hero** matter to him? (It's the
    heaviest thing on the page. The redesign would lead with a photo
    and keep the video optional.)
22. **AI crawler blocking:** Squarespace currently blocks AI assistants
    (ChatGPT, Claude, Google's AI) from reading the site. Keep blocking,
    or allow them so AI search can recommend the shop?
23. Is "**over 3 decades of combined experience**" still accurate to
    use?

---

## Next step
Approve the plan (sitemap in Section 4 and the remaining items above).
Then I'll start the build on `feature/redesign` in small commits.
