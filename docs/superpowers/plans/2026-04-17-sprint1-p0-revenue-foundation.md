# Sprint 1: P0 Revenue Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Apply Now CTA NerdWallet-standard with provider attribution, verify affiliate tracking works end-to-end, and add above-fold advertiser disclosure on all product pages.

**Architecture:** Modify existing `ApplyNowCTA` component to add provider subtext and NW-style button design. Add `AdvertiserDisclosure` to product page server components. Verify `affiliate-tracker.ts` logs to Supabase correctly.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Supabase, PostHog

---

### Task 1: Redesign ApplyNowCTA to NerdWallet Standard

**Files:**
- Modify: `components/products/ApplyNowCTA.tsx`

- [ ] **Step 1: Update ApplyNowCTA with provider subtext and NW-style button**

Replace the entire component with NerdWallet-pattern design:
- Uppercase "APPLY NOW" text
- External link icon
- Nearly square button (rounded-sm = 2px radius)
- "on [Provider]'s website" subtext below button
- Remove friction copy (the "Takes 3-5 min" text) — NW doesn't do this

```tsx
"use client";

import React from "react";
import TrackedAffiliateLink from "@/components/monetization/TrackedAffiliateLink";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplyNowCTAProps {
  href: string;
  productName: string;
  productSlug?: string;
  productId?: string;
  category?: string;
  providerName?: string;
  sourcePage: string;
  variant?: "default" | "compact";
  className?: string;
}

export default function ApplyNowCTA({
  href,
  productName,
  productSlug,
  productId,
  category = "credit_card",
  providerName,
  sourcePage,
  variant = "default",
  className,
}: ApplyNowCTAProps) {
  const isCompact = variant === "compact";

  return (
    <div className="flex flex-col items-center gap-1">
      <TrackedAffiliateLink
        href={href}
        productName={productName}
        productSlug={productSlug}
        productId={productId}
        category={category}
        providerName={providerName}
        sourcePage={sourcePage}
        sourceComponent="button"
        variant="button"
        showIcon={false}
        className={cn(
          "bg-green-600 hover:bg-green-700 text-white font-semibold uppercase tracking-wide transition-colors",
          isCompact
            ? "px-4 py-2 text-xs rounded-sm"
            : "px-6 py-3 text-sm rounded-sm",
          className,
        )}
      >
        APPLY NOW <ExternalLink className={cn("ml-1.5", isCompact ? "w-3 h-3" : "w-4 h-4")} />
      </TrackedAffiliateLink>
      {providerName && (
        <span className="text-[11px] text-gray-400 text-center">
          on {providerName}&apos;s website
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/products/ApplyNowCTA.tsx
git commit -m "feat: NerdWallet-style Apply Now CTA — uppercase, square, provider subtext"
```

---

### Task 2: Add Advertiser Disclosure Above Fold on Product Pages

**Files:**
- Modify: `components/common/AdvertiserDisclosure.tsx`
- Modify: `app/credit-cards/page.tsx`
- Modify: `app/loans/page.tsx` (or `app/loans/LoansClient.tsx`)
- Modify: `app/mutual-funds/page.tsx`
- Modify: `app/insurance/page.tsx`
- Modify: `app/demat-accounts/page.tsx`
- Modify: `app/fixed-deposits/page.tsx`

- [ ] **Step 1: Add expandable variant to AdvertiserDisclosure**

NerdWallet uses a small "Advertiser disclosure" button that expands on click. Add this as a variant:

```tsx
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AdvertiserDisclosureProps {
  className?: string;
  variant?: "inline" | "expandable";
}

export function AdvertiserDisclosure({
  className = "",
  variant = "inline",
}: AdvertiserDisclosureProps) {
  const [expanded, setExpanded] = useState(false);

  if (variant === "expandable") {
    return (
      <div className={className}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded px-2 py-1 transition-colors cursor-pointer"
        >
          Advertiser disclosure
          {expanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
        {expanded && (
          <p className="mt-2 text-xs text-gray-500 max-w-2xl leading-relaxed">
            Many of the products featured on this page are from our partners who
            compensate us when you click to their website or apply for a product.
            This does not influence our ratings or recommendations. Our opinions
            are our own.{" "}
            <a
              href="/how-we-make-money"
              className="text-green-600 hover:underline"
            >
              Here&apos;s how we make money
            </a>
            .
          </p>
        )}
      </div>
    );
  }

  // Original inline variant
  return (
    <div
      className={`flex items-start gap-2 p-3 bg-gray-50/50 border border-gray-100 rounded-lg text-xs text-gray-500 ${className}`}
    >
      <p>
        <span className="font-semibold text-gray-600">
          Advertiser Disclosure:
        </span>{" "}
        InvestingPro.in is an independent comparison platform. We may receive
        compensation when you click on links to products from our partners.
        However, our reviews and comparisons are never influenced by
        compensation.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Add expandable disclosure to credit-cards page (above H1)**

In `app/credit-cards/page.tsx`, add `<AdvertiserDisclosure variant="expandable" />` in the hero/header section, ABOVE the H1 title. Find the breadcrumb section and add it between breadcrumb and H1.

- [ ] **Step 3: Add to all other product pages**

Repeat for: `app/loans/page.tsx`, `app/mutual-funds/page.tsx`, `app/insurance/page.tsx`, `app/demat-accounts/page.tsx`, `app/fixed-deposits/page.tsx`.

Pattern: Add `<AdvertiserDisclosure variant="expandable" className="mb-3" />` between breadcrumb and page title.

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add components/common/AdvertiserDisclosure.tsx app/credit-cards/page.tsx app/loans/page.tsx app/mutual-funds/page.tsx app/insurance/page.tsx app/demat-accounts/page.tsx app/fixed-deposits/page.tsx
git commit -m "feat: expandable advertiser disclosure above fold on all product pages"
```

---

### Task 3: Verify Affiliate Tracking Pipeline End-to-End

**Files:**
- Read: `lib/tracking/affiliate-tracker.ts` (already reviewed — has Supabase insert)
- Read: `components/monetization/TrackedAffiliateLink.tsx` (already reviewed — calls tracker)
- Verify: Supabase `affiliate_clicks` table exists

- [ ] **Step 1: Check if affiliate_clicks table exists in Supabase**

Use Supabase MCP or check migrations for `affiliate_clicks` table. The tracker inserts to this table. If it doesn't exist, we need to create it.

Search for migration files:
```bash
grep -r "affiliate_clicks" supabase/ --include="*.sql"
```

Also check if the table is referenced in any RLS policy files.

- [ ] **Step 2: If table missing, create migration**

Create `supabase/migrations/20260417_affiliate_clicks.sql`:

```sql
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Product info
  product_id TEXT,
  product_slug TEXT,
  product_name TEXT NOT NULL,
  category TEXT,
  provider_name TEXT,

  -- Source info
  source_page TEXT NOT NULL,
  source_url TEXT,
  source_component TEXT,
  article_id TEXT,

  -- Session info
  session_id TEXT,
  user_id UUID,
  user_agent TEXT,

  -- Affiliate info
  affiliate_link TEXT,
  affiliate_network TEXT DEFAULT 'direct',

  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,

  -- Conversion
  conversion_status TEXT DEFAULT 'pending'
);

-- Index for analytics queries
CREATE INDEX idx_affiliate_clicks_created_at ON affiliate_clicks(created_at);
CREATE INDEX idx_affiliate_clicks_category ON affiliate_clicks(category);
CREATE INDEX idx_affiliate_clicks_product ON affiliate_clicks(product_slug);

-- RLS: Allow anonymous inserts (tracking must work without auth)
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts"
  ON affiliate_clicks
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow service role full access"
  ON affiliate_clicks
  FOR ALL
  TO service_role
  USING (true);
```

- [ ] **Step 3: Add PostHog event tracking alongside Supabase**

In `lib/tracking/affiliate-tracker.ts`, add PostHog capture after Supabase insert so clicks are visible in PostHog dashboards:

Add at the top:
```typescript
import posthog from 'posthog-js';
```

Add after the successful Supabase insert (after `logger.debug` line):
```typescript
// Also track in PostHog for dashboards
if (typeof window !== 'undefined' && posthog) {
  posthog.capture('affiliate_click', {
    product_name: data.productName,
    product_slug: data.productSlug,
    category: data.category,
    provider: data.providerName,
    source_page: data.sourcePage,
    source_component: data.sourceComponent,
    affiliate_network: data.affiliateNetwork,
  });
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add lib/tracking/affiliate-tracker.ts supabase/migrations/20260417_affiliate_clicks.sql
git commit -m "feat: verify affiliate tracking — Supabase table + PostHog events"
```

---

### Task 4: Verify All Product Apply Now Links Have Correct Affiliate URLs

**Files:**
- Read: Product database (Supabase `credit_cards` and `products` tables)
- Read: `lib/utils/product-urls.ts`

- [ ] **Step 1: Check how affiliate URLs are resolved**

Read `lib/utils/product-urls.ts` to understand `getAffiliateUrl()`:

```bash
# Check what this function returns and where URLs come from
```

- [ ] **Step 2: Audit credit card affiliate URLs**

Query Supabase for all credit cards with their `apply_url` or `affiliate_url` field. Check that:
- URLs are not empty
- URLs point to valid bank websites
- URLs include affiliate tracking params if available

- [ ] **Step 3: Document findings and fix any broken URLs**

If any product has empty/broken affiliate URLs, update them in the database. For products without affiliate programs yet, ensure the URL at minimum points to the bank's official card page.

- [ ] **Step 4: Commit any URL fixes**

```bash
git commit -m "fix: verify and fix affiliate URLs for all products"
```

---

## Post-Sprint Verification

After all 4 tasks:

- [ ] Run full build: `npx next build`
- [ ] Start dev server and test:
  - Visit `/credit-cards` — verify expandable disclosure above H1
  - Click "Apply Now" on a product card — verify it opens in new tab
  - Check browser console for PostHog `affiliate_click` event
  - Check Supabase `affiliate_clicks` table for the new row
  - Verify "on [Provider]'s website" appears below CTA button
- [ ] Push to deploy: `git push origin master`
- [ ] Verify on production
