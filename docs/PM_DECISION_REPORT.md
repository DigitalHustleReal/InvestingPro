# PM Decision Report — InvestingPro Strategic Analysis
Date: March 23, 2026 | Author: Claude (PM)

---

## THE VERDICT (read this, skip everything else if time is short)

**Design:** Full rebrand to Saffron/Navy/Playfair. Implement on new pages only — don't touch existing working pages yet.

**Phase 1 (next 90 days):** 4 things only. Nothing else.
1. CIBIL Simulator (first in India — 0 competition)
2. IFSC + Bank Holiday programmatic pages (500K–1M visits/month, one sprint)
3. InvestingPro Weekly newsletter (start now, grow forever)
4. 3 zero-competition CC pages: /credit-cards/ott-subscriptions, /rent-payment, /electricity-bill

**Do NOT touch:** MF, Insurance, Tax, App, B2B, YouTube — these are Year 3+ work.

---

## DESIGN DECISION — FULL REBRAND (Option A, done carefully)

### Why the current design is wrong for the 10-year vision

| Current Green Design | New Saffron/Navy Design |
|---|---|
| Looks like: Groww, Zerodha, Paytm | Looks like: FT, NerdWallet, Bankrate |
| Positions as: Fintech app | Positions as: Trusted media brand |
| Competes with: Paisabazaar | Competes with: Nobody in India |
| Trust signal: Product color | Trust signal: Editorial authority |

The 10-year goal is "NerdWallet India" — a trusted media brand, not a fintech app.
NerdWallet, Bankrate, Investopedia, MSE all use cream/white + dark institutional headers.
NOT green fintech palettes. The new design is correct for the goal.

### How to implement without breaking things

**Do NOT rewrite 200+ existing files.**
Build new pages only in the new design system:
1. New homepage — new design
2. /credit-cards/ category page — new design
3. /tools/cibil-simulator — new design (doesn't exist yet)
4. /ifsc/ programmatic pages — new design (doesn't exist yet)
5. Newsletter signup page — new design

Existing pages stay as-is until they're touched for other reasons.
This avoids 200+ file regression risk while moving the brand forward.

### New design tokens (lock these)
```
--ink:    #1B2A4A  (hero bg, nav)
--saf:    #E8871A  (CTA, accents — replaces green as primary action)
--grn:    #1A6B4A  (trust bar, positive, AMFI badge — green stays as TRUST signal)
--cream:  #F5F0E8  (page background — replaces white)
--paper:  #FFFDF8  (cards)

Font: Playfair Display Italic (display) + DM Sans (body)
```

---

## VISION ANALYSIS — WHAT'S RIGHT, WHAT NEEDS FIXING

### What the vision gets exactly right

1. **AI as leverage** — The 200-person equivalent production capacity is real. Claude Code ships in hours what took sprint cycles. This is the actual structural advantage.

2. **IFSC programmatic SEO** — BankBazaar gets 1.29M visits/month from this. RBI data is free. One sprint = permanent organic traffic. This is the single highest-ROI engineering task.

3. **CIBIL Simulator as moat** — First-in-India tool. No competitor has built this properly. Users return to see if their score improved. Drives repeat engagement. Direct upsell path.

4. **Email list as Google insurance** — Finshots (500K subs) proves Indians read finance newsletters. MSE (17M subs) proves it's a business. Zero Indian comparison platform owns this. Start immediately.

5. **Retirement = expert unlock** — The 2030 timeline where you add your name/face/credentials to a platform already at 1M+ visitors is genuinely smart. You're building the platform first, adding the face when it matters most. Martin Lewis had no platform when he started — you'll have the opposite problem.

6. **AMFI registration** — Non-negotiable for MF trail income. Get this done in Phase 1.

### What needs course correction

**Problem 1: The revenue projections are too optimistic in Years 1-2.**
- Year 1: ₹36-60L is achievable only if IFSC traffic converts AND CC CPAs are live
- Realistic Year 1: ₹5-15L (conservative) to ₹25-40L (optimistic)
- Don't build the plan on the optimistic case

**Problem 2: 8 verticals by Year 4 is too much.**
- BankBazaar spent 17 years building 200K pages
- 8 verticals in 4 years = surface-level coverage in each = nobody ranks
- Better: 2 verticals done deeply (CC + CIBIL) > 8 done thin
- Add verticals only when CC traffic is stable at 500K+/month

**Problem 3: The "solo" constraint is understated for partnerships.**
- Direct bank DSA deals require in-person visits, relationship building, credit checks
- HDFC won't sign a DSA with a website they haven't met
- Budget time (not money) for this — 1 day/week on relationship work from Month 1

**Problem 4: Content velocity expectations are unrealistic without a system.**
- "22 articles/week" requires a content factory system, not just Claude
- Need: content calendar, keyword list, template library, publish workflow
- Without the system, output drops to 3-5 articles/week
- Build the system first, then scale output

---

## ENGINEERING AS MARKETING — THE 4 BUILDS THAT DRIVE TRAFFIC

These are not features. They are traffic machines. Build them before any other feature.

### Build 1: IFSC Lookup (Sprint: 2 weeks)
- Source: RBI IFSC data (free download, 180K+ records)
- Pages: /ifsc/[bank]/[city]/[branch] — auto-generated
- Traffic potential: 500K–1.3M visits/month (BankBazaar benchmark)
- Monetization: Display ads + CIBIL check CTA on every page
- Effort: Low (database import + template page)

### Build 2: Bank Holiday Pages (Sprint: 3 days)
- Pages: /bank-holidays/[year]/[state] — 30 states × 3 years = 90 pages
- Traffic: 50K–200K seasonal (spikes in January, March, October)
- Effort: Trivially low. Just data entry + template.

### Build 3: CIBIL Simulator (Sprint: 3 weeks)
- No Indian platform has this built properly
- Inputs: Current score, planned action (pay off card / take loan / close account)
- Output: Projected new score + time to improvement + product eligibility change
- Traffic: Recurring — users come back after every financial decision
- Monetization: Direct gateway to CC/loan comparison ("At 750 you qualify for HDFC Regalia")

### Build 4: Gold Rate by City (Sprint: 1 week)
- Pages: /gold-rate/[city] — 100 cities
- Traffic: GoodReturns gets 2M+/month partly from this
- Source: MCX + jeweller association data (free/cheap)
- Effort: Low. Scraper + template page.

Total traffic potential from these 4 builds: **1.5M–2.5M visits/month**
Total engineering time: **6-8 weeks**
This is engineering AS marketing.

---

## CONTENT SYSTEM — HOW TO ACTUALLY DO 22 ARTICLES/WEEK

Not by prompting Claude randomly. By building a factory:

**The content factory pipeline:**
1. Keyword list (build once, 500 keywords prioritized P0/P1/P2)
2. Article template per type (card review, comparison, guide, glossary, news)
3. Weekly content calendar (Mon: CC review, Tue: loan guide, Wed: CIBIL tip...)
4. Claude prompt library (stored in /scripts/content-prompts/)
5. Publish checklist (meta, schema, internal links, CTA, disclosure)
6. Review → publish → index pipeline (30 min per article max)

**Realistic output with this system:** 10-15 articles/week
**Without the system:** 3-5 articles/week (burnout at week 3)

Build the system before publishing article 1.

---

## TRUST ARCHITECTURE — 6 THINGS TO IMPLEMENT WEEK 1

These cost nothing. They signal everything.

1. "How We Rank" page — published scoring criteria for each category
2. Commission disclosure — one line above every comparison list
3. "Rates verified: [date]" — on every rate table and product listing
4. AMFI ARN registration — apply this week (takes 30-60 days to process)
5. Methodology kicker — "Ranked by: Reward rate 40% · Approval ease 30%..." on category pages
6. Research team byline — "By InvestingPro Research Team, verified [date]" — not "by Admin"

Zero code required. Zero cost. Zero time beyond 1 day of writing.
These 6 signals separate InvestingPro from every Indian comparison site immediately.

---

## WHAT NOT TO BUILD IN 2026

Hard stops. These waste time on things that don't compound.

| Feature | Why Not Now |
|---|---|
| Mobile app | Need 500K+ monthly visitors first. App with no traffic = zero users. |
| Insurance comparison | Regulatory complexity. PolicyBazaar is too dominant. Year 4+ |
| YouTube channel | Time-intensive, slow to monetize. Year 5 (post-retirement expert unlock) |
| MF comparison | AMFI registration takes 60 days. Do that first. Then add MF in Month 6. |
| B2B API / white-label | Year 8 work. See CLAUDE.md §16. |
| Subscription tier | Need 100K+ visitors before conversion math works. Year 3. |
| Rewards program | Needs commercial deals. Year 4 work. |
| Hindi content | Correct idea, wrong timing. Add after English pages are ranking. Month 8+. |

---

## THE 90-DAY SPRINT PLAN

Week 1-2: Trust signals + newsletter setup + design tokens locked
Week 3-6: IFSC programmatic pages (80K pages indexed)
Week 7-8: Bank holiday + gold rate pages
Week 9-12: CIBIL Simulator v1
Week 13: InvestingPro Weekly Issue #1 sent
Parallel: 3 zero-competition CC pages (OTT, rent, electricity)
Parallel: AMFI registration application submitted

---

## THE SINGLE MOST IMPORTANT DECISION THIS WEEK

Not design. Not content. Not code.

**Apply for AMFI ARN registration.**

Everything else can wait 24 hours. AMFI cannot — it takes 60 days to process.
Without ARN:
- Cannot earn MF trail income (Year 4 passive revenue stream)
- Cannot call yourself AMFI-registered (trust signal #2)
- Cannot recommend MF products with legal cover

Apply this week. Everything else flows from this.

---

