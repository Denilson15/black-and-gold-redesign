# Accessibility review

**Standard:** WCAG 2.1 AA · **Date:** 2026-10-13 · **Scope:** all 12
pages (including the 404), at phone (390px), desktop (1366px) and
320px width (equivalent to 400% zoom).

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
| Body text | #EDEDED | #000000 | 17.9:1 | 4.5:1 | ✅ |
| Secondary text | #A6A6A6 | #000000 | 8.6:1 | 4.5:1 | ✅ |
| Secondary text on panels | #A6A6A6 | #1A1A1A | 7.1:1 | 4.5:1 | ✅ |
| Gold headings | #FFC500 | #000000 | 13.2:1 | 3:1 | ✅ |
| Button text | #000000 | #FFC500 | 13.2:1 | 4.5:1 | ✅ |
| Button borders | #6B6B6B | #000000 | 3.9:1 | 3:1 | ✅ |
| Focus ring | #FFC500 | #000000 | 13.2:1 | 3:1 | ✅ |

## Keyboard

Tab order on the home page: Skip to content → wordmark → main nav →
Book now (header) → hero Book now → Call → address phone → Get
directions → … → footer. The FAQ and the mobile menu use native
`<details>` (Enter/Space toggles). The map loads with a real `<button>`.

## Notes

- Touch targets: every button is at least 48px tall. Footer text links
  are 40px tall, which meets WCAG 2.2's 24px minimum (the 44px figure
  is the stricter AAA level).
- Barber photos, once added, get alt text with the barber's name;
  gallery photos need a description of the cut (enforced by the build
  check, which fails on any image without alt text).
- Still recommended before launch: a quick pass with VoiceOver on an
  iPhone, which automated tools can't replace.
