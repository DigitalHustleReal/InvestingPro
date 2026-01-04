
---
description: How to use the InvestingPro Admin Console (v2026)
---

# Admin Console Workflow

## 1. Editorial Team Management
- **Route**: `/admin/authors`
- **Action**: Use "Recruit Expert" to add authors.
- **Data**: Stored in `authors` table.
- **Usage**: Selecting an author here makes them available in the Content Factory.

## 2. Product Management (Rich)
- **Route**: `/admin/products`
- **Action**: Use "Add Product" -> "Details" tab.
- **Features**: Add JSON features (e.g., `Annual Fee: ₹500`).
- **Affiliate**: Add `affiliate_link`. The system auto-routes `/go/[slug]` to this.

## 3. Automation (Content Factory)
- **Route**: `/admin/automation/batch`
- **Action**: Select Author -> Enter Topic -> Ignite.
- **Output**: Full Article with H-tags, internal links, and author bio.

## 4. Planning
- **Route**: `/admin/content-calendar`
- **View**: "Planning Sheet" tab for a table view of all content states.
- **Auto-Plan**: Enter a topic like "Tax Season" to auto-populate the calendar.

## 5. UI/UX Philosophy
- **Theme**: Emerald/Teal (Fintech Trust).
- **Style**: Dark Mode, Glassmorphism, 1px borders.
- **Goal**: "Bloomberg Terminal" density with "Apple" aesthetics.
