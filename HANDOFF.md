# Handoff checklist

Work through this in order once the owner says yes. Don't switch the
domain until every placeholder is confirmed.

## 1. Confirm every placeholder

All of these live in [`src/content/site.ts`](src/content/site.ts). The
full list of questions is in [PITCH.md](PITCH.md#what-we-need-from-you).

- [ ] Hours: fill in all 7 days and set `hours.confirmed = true`
- [ ] Name, address, phone match the Google Business Profile exactly
- [ ] `business.geo` (lat/long from the Business Profile pin)
- [ ] `business.priceRange` and every service's `priceUsd` and
      `durationMinutes`
- [ ] `business.googleReviewUrl`
- [ ] `business.parkingNotes` and `business.directionsNotes`
- [ ] `business.experienceLine` still accurate
- [ ] Each barber: Blismo `employeeId` tested (tap each "Book with"),
      Instagram handle with `confirmed: true`, photo (with permission),
      bio, specialty
- [ ] FAQ answers (walk-ins, kids, payment, cancellation, parking)
- [ ] Reviews: real, owner-approved, `approvedByOwner: true`
- [ ] Written OK to use the logo, shop photo and barber portraits taken
      from the current site (each barber for their own portrait)
- [ ] Hero video file in `public/` and `hero.videoSrc` set (optional)
- [ ] Gallery photos (with permission and photographer credit if needed)
- [ ] Owner's decision on AI crawlers (add rules to
      `src/pages/robots.txt.ts` if they want them blocked)
- [ ] Check `site.ts` for remaining `null` values and `confirmed: false`
      (unconfirmed items are hidden from visitors, so nothing looks
      broken, but they should be filled in or deliberately left out)

## 2. Turn off concept mode

- [ ] In `src/content/site.ts`, set `CONCEPT_MODE = false`. This
      removes the banner and the `noindex` meta tag, and switches
      `robots.txt` to allow crawling and list the sitemap.
- [ ] In `netlify.toml`, delete the block marked
      **"CONCEPT MODE — REMOVE THIS BLOCK AT HANDOFF"** (the
      `X-Robots-Tag` header).
- [ ] Build, deploy and check: no banner, `/robots.txt` says
      `Allow: /`, and the page source has no `noindex`.

## 3. Domain and DNS

- [ ] Find out who controls the domain and where (Squarespace Domains
      or another registrar). Get login access, or have the owner make
      the changes.
- [ ] In Netlify: **Domain management → Add a domain**, add
      `blackandgoldeastbay.com` and `www.blackandgoldeastbay.com`.
      Make `www` the primary domain (the current site uses `www`, so
      existing Google links keep working).
- [ ] At the registrar, point DNS at Netlify as Netlify instructs
      (usually an `A`/`ALIAS` record for the apex and a `CNAME` for
      `www`), or move nameservers to Netlify DNS.
- [ ] Wait for Netlify to issue the HTTPS certificate, then test both
      addresses and the old URLs: `/home`, `/contact`, `/appointments`
      and `/cart` should redirect (set up in `netlify.toml`).
- [ ] Cancel the Squarespace website plan only after the new site is
      live. **If the domain is registered through Squarespace, keep or
      transfer the domain; don't let it lapse.**

## 4. Google Business Profile

- [ ] Hours match the website exactly, including holiday hours.
- [ ] Website link: `https://www.blackandgoldeastbay.com/`
- [ ] Booking/appointment link: the Blismo URL.
- [ ] Primary category "Barber shop". Services listed to match the site.
- [ ] Add photos (the profile matters more for the map results than
      the website does).
- [ ] Start replying to reviews.

## 5. Google Search Console

- [ ] Add the property for `blackandgoldeastbay.com` (Domain property,
      verified by a DNS TXT record).
- [ ] Submit `https://www.blackandgoldeastbay.com/sitemap-index.xml`.
- [ ] Use URL Inspection on the home page and request indexing.
- [ ] Check the Pages report after a week for errors.

## 6. Final checks on the live site

- [ ] Run [Rich Results Test](https://search.google.com/test/rich-results)
      on the home page: `HairSalon` should be detected with no errors.
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) on the live
      site and update the "after" scores in PITCH.md.
- [ ] Share the link in iMessage or Instagram and check the preview card.
- [ ] On a phone: tap Book now, each Book with button, Call, Get
      directions, and Message on Instagram.
- [ ] Update NAP on Yelp, Apple Maps and Instagram to match exactly.
