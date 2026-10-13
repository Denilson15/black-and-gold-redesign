# Accessibility review

**Standard:** WCAG 2.1 AA · **Date:** 2026-10-13, re-run after the
visual redesign · **Scope:** all 12 pages (including the 404), at
phone (390px), desktop (1366px) and 320px width (equivalent to 400%
zoom).

## Summary

| | Result |
|---|---|
| axe-core 4 (WCAG 2.0/2.1 A + AA + best practice) | **0 violations** on every page at every width |
| Lighthouse accessibility | **100** (mobile and desktop) |
| Reflow at 320px | No horizontal scrolling on any page |
| Keyboard | All controls reachable in a logical order; visible 3px gold focus ring |

## Issues found during the review and fixed

| # | Issue | WCAG | Fix |
|---|---|---|---|
| 1 | Instagram button's accessible name ("Message Mel on Instagram") didn't contain its visible text | 2.5.3 Label in Name | Name now built from the visible text plus a screen-reader-only name |
| 2 | Concept banner and sticky booking bar sat outside any landmark | 1.3.1 (best practice) | Banner is an `aside`, booking bar a `nav` |
| 3 | Barber cards and a long button overflowed at 320px | 1.4.10 Reflow | Grid column can shrink; buttons can wrap |

## Color contrast

| Element | Foreground | Background | Ratio | Needed | Pass |
|---|---|---|---|---|---|
| Body text on black | #F2F2F2 | #000000 | 18.8:1 | 4.5:1 | ✅ |
| Secondary text on black | #B3B3B3 | #000000 | 10.0:1 | 4.5:1 | ✅ |
| Text on white | #0A0A0A | #FFFFFF | 19.8:1 | 4.5:1 | ✅ |
| Secondary text on white | #575757 | #FFFFFF | 7.2:1 | 4.5:1 | ✅ |
| Text on gold (buttons, footer) | #0A0A0A | #FCB125 | 10.8:1 | 4.5:1 | ✅ |
| Gold links on black | #FCB125 | #000000 | 11.5:1 | 4.5:1 | ✅ |
| Button borders on black | #737373 | #000000 | 4.4:1 | 3:1 | ✅ |
| Focus ring (black sections) | #FCB125 | #000000 | 11.5:1 | 3:1 | ✅ |
| Focus ring (white/gold sections) | #0A0A0A | #FFFFFF / #FCB125 | ≥10.8:1 | 3:1 | ✅ |
| Hero text over photo | #F2F2F2 | photo under a 70–100% black overlay | ≥7.8:1 (worst case: a pure white pixel under 70% black) | 4.5:1 | ✅ |

## Keyboard

Tab order on the home page: Skip to content → logo → main nav →
Book now (header) → hero Book now → Call → address phone → Get
directions → … → footer. The FAQ and the mobile menu use native
`<details>` (Enter/Space toggles). The map loads with a real `<button>`.

## Notes

- Touch targets: every button is at least 48px tall. Footer text links
  are 40px tall, which meets WCAG 2.2's 24px minimum (the 44px figure
  is the stricter AAA level).
- Barber portraits have alt text with the barber's name; the hero
  photo describes the barber station. Logos beside the shop's name are
  marked decorative (`alt=""`). The build check fails on any image
  with no alt attribute.
- Still recommended before launch: a quick pass with VoiceOver on an
  iPhone, which automated tools can't replace.
