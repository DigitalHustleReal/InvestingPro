# Design Inspiration 2026 — Key Decisions

Source: Claude chat research output (pasted March 23 2026)
File: docs/design-inspiration-2026.html (full HTML mockup)

## New Palette (proposed)
| Token | Value | Use |
|---|---|---|
| --ink | #1B2A4A | Hero bg, nav, dark sections |
| --saf (Saffron) | #E8871A | CTA buttons, accents, India identity |
| --grn | #1A6B4A | Trust bar, positive states, AMFI badge |
| --cream | #F5F0E8 | Page background |
| --paper | #FFFDF8 | Cards, content sections |
| --sky | #1E6FBF | Links, info |
| --red | #C0392B | Errors, rejected |
| --warn | #B45309 | Caution, amber states |

## New Fonts (proposed)
- Display: Playfair Display Italic (currently: Outfit)
- Body: DM Sans (currently: Inter)
- Mono: DM Mono (currently: JetBrains Mono)

## vs Current System (CLAUDE.md §3)
| | Current | Proposed |
|---|---|---|
| Primary CTA | Forest Green #166534 | Saffron #E8871A |
| Accent | Indian Gold #D97706 | Saffron #E8871A (same role) |
| Background | White #FFFFFF | Warm Cream #F5F0E8 |
| Dark bg | Green-tinted #0A1F14 | Ink Navy #1B2A4A |
| Display font | Outfit | Playfair Display Italic |

## Key Components in the mockup
1. Desktop nav with trust bar (green) below it
2. Hero: Ink Navy bg + SmartAdvisor widget RHS
3. Intent Rail (6 icons: Cards/Invest/Tax/Borrow/CIBIL/Tools)
4. Card rows with approval-odds ring (Credit Karma model)
5. Editorial note box (replaces named expert)
6. Article layout with sidebar TOC
7. EMI Calculator with CIBIL score input affecting rate shown
8. CIBIL Simulator (mobile screen)
9. Newsletter section (Ink Navy bg)
10. Institutional trust grid (6 signals, no face needed)
11. Mega menu description (not coded, described in text)

## Decision Required
This is a full rebrand from green-primary to saffron-primary + navy.
CLAUDE.md §3 says design system is LOCKED, tailwind.config.ts is FROZEN.

OPTIONS:
A. Implement new design system (full rebrand — big sprint, replaces §3 of CLAUDE.md)
B. Cherry-pick components only (approval ring, editorial note, intent rail) into current green system
C. Build new design as a separate branch/preview first

