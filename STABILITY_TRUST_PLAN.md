# Plan: From Skeleton MVP to Product-Grade Comparison Engine

Following the deep-dive analysis, this plan pivots from "feature addition" to "stability, depth, and trust engineering."

## 1. Stability & Resilience (The "Zero-Crash" Foundation)
*   **Global Error Handling**: Implement `app/error.tsx` and `app/not-found.tsx` to prevent cascading failures.
*   **Graceful Degradation**: 
    *   Wrap data fetches in `try-catch` with stale-data fallbacks (using `Next.js` ISR or simple JSON fallbacks).
    *   Implement "Maintenance Mode" components for specific sections (e.g., "Market Data is temporarily updating").
*   **Logging**: Connect `lib/logger.ts` to all server-side fetches to capture the "Why" behind 500 errors in production.

## 2. High-Intent Decision Journeys (SEO + UX Goldmine)
*   **Programmatic "Best for X" Pages**:
    *   Create a dynamic route `/best-[category]-for-[intent]` (e.g., `/best-credit-cards-for-fuel`).
    *   Build a filtering engine that generates these pages from the `products` table tags/features.
*   **Taxonomy Lockdown**: Audit `lib/navigation/config.ts` to ensure sub-verticals (Travel, Rewards, Large Cap, ELSS) are first-class navigation citizens.

## 3. Comparison Intel (The Decision Environment)
*   **Side-by-Side Comparison Engine**:
    *   Create a "Compare Matrix" component that highlights *differences* in red/green (e.g., "Higher ROI here", "Lower Fee here").
    *   Implement a "Comparison Tray" (Sticky footer) that persists as users browse products.
*   **Progressive Disclosure**: Redesign product cards to show critical info (ROI, Fee) first, hiding deep specs behind a "Quick View" or toggle.

## 4. Trust & Scoring Transparency
*   **Score Breakdown Widget**: Add a detail section to `ProductDetail` pages explaining the `trust_score` (e.g., "40% Data Freshness, 30% User Reviews, 30% Market Cap").
*   **Verification Signaling**: Add "Last Updated" timestamps and "Verified by InvestingPro" badges with source citations.
*   **Editorial Transparency**: Explicitly link to `editorial-policy` and `disclosure` in the conversion path.

## 5. Smart Advisor 2.0 (Guided Journey)
*   **Guided Wizard**: Move from a "Single Widget" to a multi-step `/advisor` route.
*   **Input-Logic-Output**:
    1.  **Inputs**: Salary, Age, Risk Profile, Financial Goal (Home/Retirement/Tax-Save).
    2.  **Logic**: Transparently show weighting (e.g., "We prioritized Low Risk since your goal is <3 years away").
    3.  **Output**: Ranked list of top 3 products with a "Why this fits you" summary.

---

## Immediate Next Steps (Sprint 1)
1.  **Fix Root 500**: Audit `app/page.tsx` for unhandled async errors.
2.  **Breadcrumb & Layout Errors**: Add error boundaries to `Navbar` and `Footer`.
3.  **Comparison Flow**: Build the "Compare Tray" infrastructure.
4.  **Trust Signals**: Update detail pages with "Last Updated" and "Score Breakdown".
