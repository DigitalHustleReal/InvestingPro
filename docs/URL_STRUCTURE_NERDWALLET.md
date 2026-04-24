# URL Structure Migration — NerdWallet-Aligned

> **Decision:** InvestingPro adopts NerdWallet's category-nested URL model.
> **Scope of this doc:** the full route map. Implementation is phased (see §4).

---

## 1. NerdWallet's actual patterns (verified 2026-04-24)

| Pattern | Example |
|---|---|
| Category listing | `/credit-cards` |
| Product detail | `/credit-cards/reviews/chase-sapphire-preferred` |
| Best-of roundup | `/credit-cards/best/travel` |
| Calculators | `/banking/calculators/savings-calculator` |
| Articles / guides / glossary | `/taxes/learn/capital-gains-tax-rates` |
| Topic hub | `/credit-cards/hubs/credit-card-basics` |

Everything nests under a top-level category segment. Glossary and articles are both under `/[category]/learn/`.

---

## 2. Target structure for InvestingPro

### Top-level categories (7)

- `/credit-cards/`
- `/banking/` — savings, FD, RD, schemes
- `/loans/` — personal, home, car, education, gold, business
- `/investing/` — MF, demat, stocks, IPO, NPS
- `/insurance/` — term, health, car, home
- `/taxes/` — regimes, calculators, deductions
- `/learn/` — cross-category hub + brand content

### Per-category sub-routes

| Sub-route | Purpose | Example |
|---|---|---|
| `/[cat]/` | Listing page | `/credit-cards/` |
| `/[cat]/reviews/[slug]` | Product detail | `/credit-cards/reviews/hdfc-regalia` |
| `/[cat]/best/[type]` | Best-of roundup | `/credit-cards/best/travel` |
| `/[cat]/compare` | Compare tool | `/credit-cards/compare` |
| `/[cat]/calculators/[slug]` | Category calcs | `/investing/calculators/sip` |
| `/[cat]/learn/[slug]` | Articles + glossary | `/taxes/learn/ltcg` |
| `/[cat]/hubs/[topic]` | Topic hub | `/credit-cards/hubs/new-card-user` |

---

## 3. Route-by-route migration map

| Current | Proposed | Redirect? |
|---|---|---|
| `/` | `/` | — |
| `/credit-cards/` | `/credit-cards/` | — |
| `/credit-cards/[slug]` | `/credit-cards/reviews/[slug]` | 301 |
| `/credit-cards/compare/[slug]` | `/credit-cards/compare?ids=` | 301 |
| `/credit-cards/smart-compare` | `/credit-cards/compare` | 301 |
| `/credit-cards/best/[type]` (already ok) | `/credit-cards/best/[type]` | — |
| `/loans/` | `/loans/` | — |
| `/loans/[slug]` | `/loans/reviews/[slug]` | 301 |
| `/loans/eligibility-checker` | `/loans/tools/eligibility` | 301 |
| `/mutual-funds/` | `/investing/mutual-funds/` | 301 |
| `/mutual-funds/[slug]` | `/investing/mutual-funds/reviews/[slug]` | 301 |
| `/mutual-funds/goal-planner` | `/investing/tools/goal-planner` | 301 |
| `/mutual-funds/compare` | `/investing/mutual-funds/compare` | 301 |
| `/demat-accounts/` | `/investing/demat-accounts/` | 301 |
| `/demat-accounts/[slug]` | `/investing/demat-accounts/reviews/[slug]` | 301 |
| `/stocks/[slug]` | `/investing/stocks/reviews/[slug]` | 301 |
| `/ipo/` | `/investing/ipo/` | 301 |
| `/fixed-deposits/` | `/banking/fixed-deposits/` | 301 |
| `/fixed-deposits/[slug]` | `/banking/fixed-deposits/reviews/[slug]` | 301 |
| `/banking/` | `/banking/` | — |
| `/insurance/` | `/insurance/` | — |
| `/insurance/[slug]` | `/insurance/reviews/[slug]` | 301 |
| `/taxes` | `/taxes/` | — |
| `/calculators/` | `/learn/calculators/` (index) | 301 |
| `/calculators/sip` | `/investing/calculators/sip` | 301 |
| `/calculators/fd` | `/banking/calculators/fd` | 301 |
| `/calculators/emi` | `/loans/calculators/emi` | 301 |
| `/calculators/old-vs-new-tax` | `/taxes/calculators/old-vs-new` | 301 |
| (67 other calcs) | `/[nearest-cat]/calculators/[slug]` | 301 |
| `/articles/` | `/learn/` | 301 |
| `/articles/[slug]` | `/[cat]/learn/[slug]` (by `articles.category`) | 301 |
| `/article/[slug]` | **DELETE** — legacy duplicate | 410 or 301 to new |
| `/glossary/` | `/learn/glossary/` | 301 |
| `/glossary/[slug]` | `/[cat]/learn/[slug]` (by `glossary_terms.category`) | 301 |
| `/category/[slug]` | `/learn/[slug]` | 301 |
| `/compare/investingpro-vs-*` | `/learn/vs/[competitor]` | 301 |
| `/small-business` | `/loans/business/` | 301 |
| `/investing` (hub) | `/investing/` | — |

---

## 4. Phased rollout

### Phase 1 — Foundations (this session + next)
- Delete duplicate `/article/[slug]` (dead route).
- Rebuild `/glossary/[slug]` as Server Component with v3 (at current URL; redirect added in Phase 3).
- Rebuild `/taxes/` as v3 hub with nested `/taxes/learn/` + `/taxes/calculators/` routes.
- Rebuild `/investing/` as v3 hub.

### Phase 2 — Category nesting
- Create `/investing/mutual-funds/`, `/investing/demat-accounts/`, `/investing/ipo/`, `/investing/stocks/` as thin wrappers that import existing listing logic.
- Create `/banking/fixed-deposits/` wrapper.
- Create `/[cat]/learn/[slug]` dynamic route backed by `articles.category`.
- Create `/[cat]/reviews/[slug]` wrappers for product details.
- Add `/[cat]/calculators/[slug]` route that reuses calculator components.

### Phase 3 — Redirects + canonicalization
- Add `next.config.ts` redirects for every 301 above.
- Update `ArticleRenderer` canonical to new URL.
- Update `lib/sitemap.ts` to emit new URLs only (old URLs redirect).
- Update `components/layout/Footer.tsx` column links.
- Update `components/layout/Navbar.tsx` nav links.
- Update `lib/linking/engine.ts` internal link generator.

### Phase 4 — Content migration
- Port 228 articles to `/[cat]/learn/[slug]` URL via category assignment.
- Port 101 glossary terms similarly.
- Submit updated sitemap to GSC (delayed until Phase 4 completes).

---

## 5. Open questions (answer before Phase 2)

1. **Calculator home:** NerdWallet has calcs under each category (`/banking/calculators/savings`). InvestingPro has 75 flat. Keep a `/learn/calculators/` index that lists all, OR drop the index in favor of per-category lists? → **Proposal: keep both — index at `/learn/calculators/` for SEO, per-category for discovery.**

2. **Glossary → learn merge:** NerdWallet has no separate `/glossary/`. Terms live at `/taxes/learn/taxable-income`. Should InvestingPro keep a glossary index (`/learn/glossary/`) for A–Z browse, or dissolve it entirely? → **Proposal: keep `/learn/glossary/` as an A–Z index; individual terms redirect to `/[cat]/learn/[slug]`.**

3. **Article category fallback:** If an article has no category or has one that doesn't map to the 7 top-levels, where does it live? → **Proposal: `/learn/[slug]` (cross-cutting).**

4. **Compare pages:** NerdWallet has no competitor-comparison pages. `/compare/investingpro-vs-*` is a brand SEO play. Keep under `/learn/vs/[competitor]` or delete? → **Proposal: keep, under `/learn/vs/[competitor]`.**

---

## 6. Effort estimate

- Phase 1: ~1–2 days (glossary + taxes + article dedup)
- Phase 2: ~3–4 days (category wrappers)
- Phase 3: ~1 day (redirects + canonical updates)
- Phase 4: ~2 days (content category assignment + sitemap)

**Total ~8–10 working days.** Sitemap submission happens at the end of Phase 4.
