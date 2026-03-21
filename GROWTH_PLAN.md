# InvestingPro — $1000 MRR in 6 Months
## The AI-First Operator's Playbook (10 hrs/week)

> Built for: 1 founder, 1 full-time job, 1 kid, 1 hour/day + 3-4 hrs on weekends.
> Platform state: ~85% of monetization infrastructure already coded. You're not building — you're activating.

---

## The Core Mental Model

**You are the CEO, not the employee.** The platform does the work. You make decisions.

The AI content pipeline generates 5 articles/day automatically. Cron jobs sync data, ping sitemaps, process email sequences, and report revenue — all without you. Your 1 hour/day is for steering, not rowing.

```
AI generates → Auto-publishes (score ≥80) → Affiliate links auto-inserted →
Email sequence fires → User clicks → Revenue attributed → Report sent to you
```

---

## Revenue Architecture (3 Streams)

### Stream 1: Affiliate CPA — Month 1 revenue target
**How it works:** User clicks a "Apply Now" button → gets cookied with your affiliate tag → completes an application → you earn ₹300–₹2500 per conversion.

**Best bets for quick revenue:**
| Product | Partner | CPA | Est. conversion rate |
|---------|---------|-----|---------------------|
| Personal Loans | Bajaj Finserv | ₹2,500 | 2-4% |
| Credit Cards | HDFC, ICICI | ₹900-1,200 | 1-3% |
| Demat Accounts | Zerodha | ₹300 | 5-8% |
| Insurance | PolicyBazaar | 15% revenue share | 3-5% |

**First 100 daily visitors → ₹2,000–₹8,000/month is realistic at 2% conversion.**

### Stream 2: Pro Subscription — Month 3 onwards
**₹199/month** (already coded in `lib/payments/stripe-service.ts`).
- Unlimited comparisons (vs 3 free/day)
- Advanced filters & portfolio tracker
- Priority email alerts for rate changes

**Target: 50 subscribers by Month 6 = ₹9,950 MRR from subscriptions alone.**

### Stream 3: Display Ads — Month 4-5
- Ezoic: 10,000 sessions/month threshold (achievable by Month 4)
- Est. RPM: ₹80-150 for Indian finance traffic
- 50K sessions → ₹4,000-7,500/month additional

---

## The 6-Month Sprint

### Month 1 — ACTIVATION (Weeks 1-4)
**Goal:** Turn on everything that's already built.

**Weekend 1 (4 hrs):** Configure all services
```bash
# Add to Vercel environment variables:
CRON_SECRET=<generate random 32-char string>
RESEND_API_KEY=<from resend.com — free tier = 3000 emails/month>
OPENAI_API_KEY=<already set? verify>
STRIPE_SECRET_KEY=<from dashboard.stripe.com>
STRIPE_PRO_MONTHLY_PRICE_ID=<create ₹199/month product in Stripe>
STRIPE_WEBHOOK_SECRET=<from Stripe webhook dashboard>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<from Stripe>
```

**Weekend 2 (3 hrs):** Seed affiliate partners
```bash
# Run in Supabase SQL editor:
# Copy paste: supabase/seeds/affiliate-partners.sql
# Then manually add your actual affiliate tracking links
# for your top 3 partners (Bajaj, HDFC, Zerodha)
```

**Daily (30 min):** Review 1 auto-generated article before it publishes. Approve or reject.

**Deliverables:**
- [x] 26 cron jobs activated (done — vercel.json updated)
- [ ] Email sequences firing (needs RESEND_API_KEY)
- [ ] Affiliate tracking live (needs partners in DB)
- [ ] Stripe subscription page live
- [ ] 5 articles/day auto-publishing

---

### Month 2 — CONTENT FLOOD (Weeks 5-8)
**Goal:** 150+ indexed pages, target long-tail keywords.

**The AI content machine runs itself.** Your only job:
- Mon 20 min: Check `daily-content-generation` logs for failures
- Sat 2 hrs: Write 1 "pillar" article yourself (2,000+ words) on a high-volume topic
  - "Best Credit Cards in India 2025" (50K monthly searches)
  - "How to Start SIP in 2025" (30K monthly searches)
  - "Personal Loan vs Credit Card" (20K monthly searches)

**Why your 1 pillar article matters:** AI content ranks for long-tail (1,000 monthly searches). Pillar articles rank for head terms (30-50K searches). You need both.

**Deliverables:**
- 100+ auto-published articles indexed
- 3 pillar articles published
- Google Search Console verified + GSC API key configured
- First organic visitors from long-tail keywords

---

### Month 3 — FIRST REVENUE (Weeks 9-12)
**Goal:** ₹20,000/month affiliate revenue (≈$240 MRR).

**The math:**
- 500 daily visitors (organic + direct)
- 2% click-through to affiliate links = 10 clicks/day
- 2% conversion = 0.2 conversions/day
- Avg ₹1,000 CPA = ₹200/day = ₹6,000/month

**To get to ₹20,000:** 3x the above. Achievable with 1,500 daily visitors.

**Weekend focus (Month 3):**
- Partner outreach: email 3 fintech startups/week offering featured placement for higher CPA
- Configure Google Analytics 4 funnel tracking
- A/B test CTA buttons on product pages (green vs blue, "Apply Now" vs "Check Eligibility")

**Deliverables:**
- First affiliate payment received
- 10+ affiliate partners configured with real tracking links
- Email list at 200+ subscribers
- Stripe subscription page live (even if 0 paying users)

---

### Month 4 — SCALE (Weeks 13-16)
**Goal:** ₹40,000/month total revenue.

**Add display ads:**
- Apply to Ezoic (10K sessions threshold — you should be there by now)
- Don't touch AdSense — RPM is 5x worse for Indian traffic

**Launch the Pro subscription:**
- Send email to your list announcing Pro with 50% launch discount (₹99/month for first 3 months)
- Add a "Pro" badge to 20% of features that non-paying users see
- Target: 20 subscribers × ₹199 = ₹3,980/month

**Weekend focus:**
- Record 3 short videos (60-90 seconds) explaining a calculator tool each
- Post to YouTube → embed on the calculator pages → drives organic traffic
- No editing needed — just screen record with Loom

---

### Month 5 — MICRO-SAAS OPPORTUNITIES (Weeks 17-20)
**Goal:** New revenue streams from existing infrastructure.

**Opportunity 1: Calculator API (White-Label)**
Your 24 calculators are production-quality. Other fintech blogs need calculators.
- Price: ₹2,999/month per integration
- Market: 500+ personal finance blogs in India
- Effort: 2 weekends to wrap calculators in embeddable widget + API
- Target: 5 customers = ₹14,995/month

**Opportunity 2: Content API for Small Fintechs**
Your AI content pipeline + data sync infrastructure is unique.
- Small fintech startups need content but can't afford a CMS team
- Price: ₹9,999/month — they get 30 AI articles/month on their topics
- Target: 3 customers = ₹29,997/month
- Effort: 1 weekend to add multi-tenant support to the CMS

**Opportunity 3: "Rate Alert" SaaS**
You already sync RBI rates and card rates. Package as a B2B API.
- Target: accounting firms, NBFCs that need rate data feeds
- Price: ₹4,999/month per API key

---

### Month 6 — $1,000 MRR CHECKPOINT

**Revenue projection:**
| Stream | Monthly Revenue |
|--------|----------------|
| Affiliate CPA | ₹60,000 ($720) |
| Pro Subscriptions (50 users) | ₹9,950 ($120) |
| Display Ads (Ezoic) | ₹6,000 ($72) |
| Calculator API (3 customers) | ₹8,997 ($108) |
| **TOTAL** | **₹84,947 (~$1,020 MRR)** |

This is conservative. One viral article or one featured credit card placement can 10x a single month.

---

## The 10-Hour Week Operating Model

### Daily Routine (1 hour/day)
```
Mon-Fri, anytime:
  [15 min] Check daily-revenue-report email (cron sends it at 9 AM IST)
  [30 min] Review + approve/reject 2-3 auto-generated articles
  [15 min] Reply to 1-2 comments or user emails
```

### Weekend Sprint (3-4 hours)
```
Saturday (2-3 hrs):
  [1 hr] Write 1 pillar article OR
         Do partner outreach (3 emails) OR
         Work on micro-SaaS feature

Sunday (1 hr):
  [30 min] Review weekly metrics (SEO rankings, affiliate clicks, revenue)
  [30 min] Plan next week (queue 5 article topics for AI generation)
```

### What runs without you (the AI flywheel)
```
Every 15 min:  Auto-publish scheduled articles
Every 30 min:  Email sequences processed
Every hour:    Data freshness check
Every 2 hrs:   Content pipeline processed
Every 6 hrs:   Analytics sync
2 AM IST:      AI generates 5 new articles (queued for your review)
3 AM IST:      Content strategy identifies gaps → queues more articles
7 AM IST:      RBI rates updated
8 AM IST:      AMFI mutual fund NAV synced
9 AM IST:      Revenue report emailed to you
Daily:         Sitemap pinged to Google
Weekly:        Credit card data scraped
Weekly:        SEO rankings updated
Weekly:        Broken links checked
```

---

## Activation Checklist (Do this in Week 1)

### Vercel Environment Variables (30 min)
Add these in the Vercel dashboard → Settings → Environment Variables:

```
CRON_SECRET                      # Random 32-char string (use: openssl rand -hex 16)
RESEND_API_KEY                   # resend.com → free → 3,000 emails/month
RESEND_FROM_EMAIL                # noreply@investingpro.in (verify domain in Resend)
OPENAI_API_KEY                   # Verify this exists — needed for content generation
STRIPE_SECRET_KEY                # stripe.com → Developers → API keys
STRIPE_PUBLISHABLE_KEY           # Same location
STRIPE_PRO_MONTHLY_PRICE_ID      # Create ₹199/month recurring product in Stripe
STRIPE_WEBHOOK_SECRET            # Add webhook endpoint: /api/webhooks/stripe
NEXT_PUBLIC_APP_URL              # https://investingpro.in
```

### Supabase Setup (1 hr)
1. Run `supabase/seeds/affiliate-partners.sql` in SQL editor
2. Then manually update the top 5 partners with your actual affiliate tracking links
   - Create accounts at: Bajaj Finserv affiliate, HDFC affiliate, Zerodha referral
   - Get your unique tracking links
   - Insert as `affiliate_links` rows referencing the partner IDs
3. Verify RLS is enabled on `affiliate_clicks`, `affiliate_links`, `affiliate_partners`

### Google Setup (45 min)
1. Verify `investingpro.in` in Google Search Console
2. Submit sitemap: `https://investingpro.in/sitemap.xml`
3. Create service account → download JSON → add as `GOOGLE_SERVICE_ACCOUNT_KEY` env var
   (This enables the `sync-rankings` and `seo-rankings-update` crons)

### Stripe Setup (30 min)
1. Go to `dashboard.stripe.com` → Products → Create product
2. Name: "InvestingPro Pro", Price: ₹199 INR/month, recurring
3. Copy Price ID → add as `STRIPE_PRO_MONTHLY_PRICE_ID`
4. Add webhook: `https://investingpro.in/api/webhooks/stripe`
5. Subscribe to: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`

---

## The $10K MRR Path (Months 7-12)

Once you hit $1K MRR, the playbook changes:

1. **Hire 1 VA (₹15,000/month)** to do partner outreach and article QA
   - You spend 0 hours on outreach. VA sends 20 partnership emails/week.
2. **White-label the platform** for 1-2 regional languages (Tamil, Telugu, Marathi)
   - Hindi + English already covered. South India is underserved by NerdWallet-style sites.
3. **Launch a paid newsletter** — "InvestingPro Weekly" for serious investors
   - 500 subscribers × ₹299/month = ₹1.5L/month (yes, this is realistic)
4. **Add a "Verified Advisor" directory** — registered investment advisors pay ₹4,999/month for a profile
   - SEBI RIA directory has 1,300+ registered advisors. 50 paying = ₹2.5L/month.

---

## The Single Most Important Thing to Do Today

**Configure RESEND_API_KEY.**

Here's why: every user who signs up right now gets no welcome email. That's a leaky funnel. The email sequences are fully coded — 6 automated emails over 14 days educating the user and driving them toward affiliate products. You're leaving conversions on the table every single day this isn't live.

The whole sequence is ready at `lib/email/sequences.ts`. It just needs the API key.

**Takes 15 minutes. Highest ROI action on the platform.**

---

## Notes on Multi-SaaS Ambition

> "Ambition to run multiple SaaS, micro-SaaS, tools platforms"

The framework that works with a full-time job + kids:

**Rule 1: Never build a new product from scratch.** Extract from what's working.
- InvestingPro has calculators → Calculator API SaaS
- InvestingPro has content pipeline → Content API SaaS
- InvestingPro has rate data → Financial Data API SaaS

**Rule 2: One new product per quarter max.** Each needs 1 dedicated weekend to launch.

**Rule 3: Automation before expansion.** Don't start SaaS #2 until SaaS #1 earns $200/month on its own.

**The portfolio by Month 18:**
- InvestingPro (media/affiliate) → $2,000 MRR
- Calculator Widget API → $500 MRR
- Financial Content API → $800 MRR
- Rate Alert API → $300 MRR
- **Total: $3,600 MRR ≈ ₹3L/month**

That's the "quit job" number. Achievable in 18 months at your current pace — but only if you protect your automation investment and don't start rebuilding things manually.
