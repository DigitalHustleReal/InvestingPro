# Autonomous Task Executor — Instructions for Claude Code

> **Usage:** Run this in terminal, walk away:
> ```bash
> claude --dangerously-skip-permissions -p "Read docs/AUTONOMOUS_EXECUTOR.md and follow the instructions exactly."
> ```

## Your Job

1. Read `docs/MASTER_TASK_LIST.md` to find the current state
2. Find the FIRST task marked `TODO` in the current target phase
3. Execute it properly (read existing patterns before building)
4. Mark the task as `DONE` in the file
5. Commit with a clear message
6. Move to the next TODO task
7. Repeat until quota exhausts or phase completes

## Current Target Phase: 10B (New Calculators)

## Rules

### Calculator Building Pattern
- Page file: `app/calculators/[name]/page.tsx` — Server component with Metadata, schema, breadcrumbs
- Component: `components/calculators/[Name]Calculator.tsx` — Client component with `"use client"`
- Math: `lib/calculators/math.ts` — FROZEN, do NOT modify. Add new functions if needed in a new file.
- Copy the pattern from `app/calculators/sip/page.tsx` + `components/calculators/SIPCalculatorWithInflation.tsx`

### Every Calculator MUST Have
- `export const metadata: Metadata` with title, description, keywords, OpenGraph, Twitter card
- `AutoBreadcrumbs` component
- JSON-LD schema (`SoftwareApplication` + `FAQPage`)
- Mobile-responsive layout (sliders, not just input fields)
- Recharts chart (AreaChart or PieChart)
- Indian ₹ formatting with lakh/crore
- `"use client"` on the calculator component
- shadcn/ui components (Card, Slider, Input, Badge)
- Lucide icons only
- Green primary color (`text-green-600`, `bg-green-50`)
- Commit after EACH calculator (not batch)

### Design System (LOCKED)
- Colors: green-* primary, amber-* accent. NO cyan, teal, sky.
- Fonts: Inter body, Outfit display
- UI: shadcn/ui + Tailwind CSS 4 + Lucide icons
- ₹ formatting: `toLocaleString('en-IN')` for numbers
- Large numbers: show as "₹12.5L" or "₹1.2Cr"

### What NOT To Do
- Don't modify existing calculators (only build new ones)
- Don't modify `lib/calculators/math.ts` 
- Don't change tailwind.config.ts
- Don't add new dependencies without checking package.json first
- Don't create admin pages for calculators (only public pages)

## Task Completion Format

After completing each task, edit `docs/MASTER_TASK_LIST.md`:
- Change `| TODO |` to `| DONE |` for that task row
- Add a comment line below: `<!-- Completed [date] by autonomous executor -->`

## If You Encounter an Error
1. Log the error in a comment in MASTER_TASK_LIST.md under the task
2. Skip to the next task
3. Don't get stuck retrying the same thing

## Phase Execution Order
1. Phase 10B (32 new calculators) — P0 items first, then P1, then P2
2. Phase 10C (17 VS comparison pages)
3. Phase 10D (19 Govt calculators)
4. Phase 10E (10 Multi-way comparisons)
5. Phase 10F (12 Life planning)
6. Phase 10G (15 Additional VS)
7. Phase 10A (Upgrade existing 23)
8. Phase 4 (Content generation — 50 articles)
9. Phase 5 (SEO optimization)
10. Phase 11 (Multi-language)
