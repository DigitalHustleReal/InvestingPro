# InvestingPro.in — Master Action Plan
## Based on Full Platform Audit: April 15, 2026

> Data sources: Supabase production DB, Vercel deployment, codebase analysis, env var audit, content inventory, route mapping

---

## PART 1: PLATFORM REALITY (What We Found)

### Assets
| Asset | Count | Quality |
|-------|-------|---------|
| Calculator pages | 58 live + 11 uncommitted | Best-in-class, strong differentiator |
| Product listings | 2,584 (81 CC, 346 MF, 61 loans, 25 FD, 24 insurance, 15 savings) | Data present, 4 images total |
| Published articles | 27 | All "best X" listicles, all Apr 7, no diversity |
| Draft articles | 21 | Sitting unpublished — wasted indexable pages |
| Glossary terms | 101 | Good foundational SEO asset |
| VS pages (DB) | 20 credit card comparisons | 0 views — likely not rendering |
| Affiliate partners | 14 active | CPA configured but 0 conversions |
| Credit card apply links | 81/81 populated | Revenue-ready IF tracked |
| Categories | 19 created | 11 have ZERO articles |
| Content queue | 139 pending | Low quality — all CC long-tail spam |
| Cron jobs | 40 configured, all routes exist | Running unsecured |
| API routes | 272 | Comprehensive |
| Admin pages | 88+ | Full CMS built |
| Page routes | 237 total | Strong coverage |

### Gaps
| Gap | Severity | Impact |
|-----|----------|--------|
| 0 educational articles | CRITICAL | No topical authority — Google won't rank commercial pages |
| 0 timely/news content | CRITICAL | No freshness signals |
| 11 empty categories | HIGH | Thin site for Google |
| CRON_SECRET missing | HIGH | 40 endpoints publicly callable = API credit burn risk |
| 4/2584 product images | HIGH | Poor UX, zero Google Image traffic |
| 0 affiliate conversions | HIGH | Revenue infrastructure exists but isn't activated |
| Content queue = CC spam | MEDIUM | Pipeline will produce thin, duplicate content |
| No Stripe keys | MEDIUM | Premium features blocked |
| No social API keys | MEDIUM | Distribution crons run but fail silently |
| No GSC OAuth keys | MEDIUM | Can't pull ranking data into platform |
| 11 VS files uncommitted | MEDIUM | Data loss risk — only on local disk |

---

## PART 2: OWNER TASKS (Shiv)

### P0 — DO TODAY (Security + Analytics) — 30 min total

| # | Task | How | Time | Why |
|---|------|-----|------|-----|
| 1 | **Add `CRON_SECRET` to Vercel** | Vercel Dashboard → Settings → Env Vars → Add `CRON_SECRET` = generate random 32-char string → Add to Production, Preview, Development | 5 min | 40 cron endpoints are PUBLIC. Anyone can trigger `/api/cron/daily-content-generation` and burn your Gemini/OpenAI credits. This is a security vulnerability. |
| 2 | **Pull env vars to local** | Run `npx vercel env pull .env.local` in terminal | 2 min | Your local is missing GA4 and PostHog keys that Vercel already has |
| 3 | **Verify GA4 is receiving data** | Go to analytics.google.com → Real-time → Open investingpro.in in another tab → Confirm you see your visit | 5 min | GA4 key was added 9 days ago — but without verifying, you don't know if it's actually tracking |
| 4 | **Set up Google Search Console** | search.google.com/search-console → Add property → investingpro.in → Verify via DNS TXT record → Submit sitemap: `https://investingpro.in/sitemap.xml` | 15 min | 162 keywords tracked in DB but ALL positions = null. GSC is the ONLY free source of real ranking data. Every day without it = lost intelligence |
| 5 | **Add `NEXT_PUBLIC_BASE_URL`** | Vercel env vars → `NEXT_PUBLIC_BASE_URL` = `https://investingpro.in` | 2 min | May affect canonical URLs, OG tags, sitemap generation |

### P1 — DO THIS WEEK (Revenue Activation) — 2 hours total

| # | Task | How | Time | Why |
|---|------|-----|------|-----|
| 6 | **Verify credit card apply links are affiliate-tracked** | Open 5 random credit card pages → Click "Apply Now" → Check if URL has your tracking ID (like `?ref=investingpro` or UTM params). If they're just `hdfcbank.com/credit-cards` with no tracking, you earn ₹0 | 20 min | 81 cards × ₹800 CPA = ₹64,800/month IF tracked. ₹0 if not. |
| 7 | **Sign up on affiliate networks** | Register on: (a) Cuelinks.com (aggregator), (b) vCommission.com (Indian CPA), (c) Direct programs: HDFC, ICICI, SBI Card partner pages | 30 min | Your 14 affiliate_partners are just DB entries — you need actual affiliate accounts with real tracking links |
| 8 | **Publish 21 draft articles** | Admin panel → Articles → Filter "Draft" → Review each → Publish. Priority: 3 from today/yesterday (freshest), then loans, then MF | 30 min | 21 pages Google can't see. Instant +21 indexable URLs. Some were auto-generated recently — check quality first |
| 9 | **Add Pexels API key** | pexels.com → Create account → Get API key → Add to Vercel as `PEXELS_API_KEY` | 5 min | Unlocks the image generation cron that already exists |
| 10 | **Set up business email** | Google Workspace or Zoho Mail → hello@investingpro.in | 30 min | Needed for: GSC verification, affiliate signups, reader trust, DMARC |

### P2 — DO THIS MONTH (Growth Infrastructure)

| # | Task | How | Time | Why |
|---|------|-----|------|-----|
| 11 | **Add Stripe keys** | stripe.com → Get keys → Add `STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY` to Vercel | 15 min | Unlocks premium features |
| 12 | **Set up Twitter/LinkedIn API** | Developer portals → Get keys → Add to Vercel | 30 min | Unlocks social distribution crons (already built) |
| 13 | **Set up Google OAuth** | Google Cloud Console → OAuth credentials → Add `GOOGLE_CLIENT_ID` + `SECRET` | 20 min | Unlocks GSC data pull into your platform |
| 14 | **Clean content queue** | Admin → Content Queue → Delete non-Indian topics ("cashback credit cards uk", "bmo"), duplicates, thin keyword variations | 30 min | 139 items are mostly CC spam — will produce thin content |
| 15 | **Monitor GSC for 2 weeks** | Check weekly: which pages indexed, impressions, average position, CTR | Ongoing | Data-driven decisions on what content to create next |

---

## PART 3: CLAUDE TASKS (Development)

### Phase A — Immediate (Today's Session) — Commit + Security

| # | Task | Method | Files | Impact |
|---|------|--------|-------|--------|
| A1 | **Commit & push 11 VS calculator files** | git add + commit + push | 11 files (1 shared component, 9 calculator components, 1 page) | Backs up work + deploys Old vs New Tax page |
| A2 | **Verify cron routes check CRON_SECRET** | Read 2-3 cron route files → Check if they validate `Authorization: Bearer $CRON_SECRET` header | ~40 route files | If not validating, add auth check to all cron routes |
| A3 | **Build 8 page.tsx for existing VS components** | Create page routes for: sip-vs-fd, ppf-vs-elss, nps-vs-ppf, fd-vs-debt-mf, gold-vs-equity, term-vs-endowment, direct-vs-regular-mf, index-vs-active-fund | 8 new page.tsx files | +8 indexable calculator pages with JSON-LD + FAQs |
| A4 | **Commit & push Phase A** | Single commit | All new files | Gets to 67 calculator pages live |

### Phase B — VS Completion (Next Session) — Build Remaining VS Calculators

| # | Task | Method | Files | Impact |
|---|------|--------|-------|--------|
| B1 | **Build 8 remaining VS calculators + pages** | Component + page for each: RD vs SIP, EPF vs VPF, SSY vs PPF, NSC vs FD, PO FD vs Bank FD, SIP vs RD, SIP vs Lumpsum, Rent vs Buy Comparison | 16 files (8 components + 8 pages) | +8 more VS pages = 75 total calculators |
| B2 | **Verify DB versus_pages render** | Check if the 20 credit card VS pages in DB actually have working routes + are rendering content | Investigation | 20 pages may be invisible |
| B3 | **Commit & push Phase B** | Single commit | All new files | Completes Phase 10C |

### Phase C — Content Architecture (Priority: Build Topical Authority)

This is the MOST IMPORTANT phase for SEO. Without educational content, commercial pages won't rank.

#### C1: Educational Pillar Articles (5 per category, 8 categories = 40 articles)

**Credit Cards (9 published, all commercial — need 5 educational):**
| Article | Search Volume | Type |
|---------|-------------|------|
| What is CIBIL Score and How It Works | 90K/mo | Educational |
| Credit Card Billing Cycle Explained | 40K/mo | Educational |
| How Credit Card Interest is Calculated | 33K/mo | Educational |
| Credit Utilization Ratio — What It Is and Why It Matters | 22K/mo | Educational |
| What Happens If You Pay Minimum Due on Credit Card | 27K/mo | Educational |

**Mutual Funds (5 published, all commercial — need 5 educational):**
| Article | Search Volume | Type |
|---------|-------------|------|
| What is NAV in Mutual Funds | 74K/mo | Educational |
| Direct vs Regular Mutual Fund — Difference Explained | 60K/mo | Educational |
| What is Exit Load in Mutual Funds | 33K/mo | Educational |
| SEBI Mutual Fund Categories Explained | 18K/mo | Educational |
| How to Read a Mutual Fund Factsheet | 12K/mo | Educational |

**Loans (3 published — need 5 educational):**
| Article | Search Volume | Type |
|---------|-------------|------|
| MCLR vs Repo Rate — How Home Loan Interest is Decided | 40K/mo | Educational |
| Home Loan Pre-Payment — Rules, Charges, Calculator | 33K/mo | Educational |
| What is FOIR and How Banks Calculate Loan Eligibility | 22K/mo | Educational |
| Balance Transfer of Home Loan — Complete Guide | 27K/mo | Educational |
| Personal Loan vs Credit Card Loan — Which is Cheaper | 18K/mo | Educational |

**Insurance (0 articles — need 5 to establish category):**
| Article | Search Volume | Type |
|---------|-------------|------|
| Term Insurance vs Whole Life — Which Should You Buy | 60K/mo | Educational |
| Health Insurance Claim Process — Cashless vs Reimbursement | 40K/mo | Educational |
| What is Sum Assured in Life Insurance | 27K/mo | Educational |
| How to Choose Health Insurance in India — Complete Guide | 33K/mo | Educational |
| Super Top-Up Health Insurance Explained | 22K/mo | Educational |

**Tax (3 articles — need 5 educational):**
| Article | Search Volume | Type |
|---------|-------------|------|
| How to File ITR Online — Step by Step Guide 2026 | 200K/mo | Educational |
| Form 16 Explained — How to Read and Understand | 90K/mo | Educational |
| HRA Calculation with Examples — Salaried Employees | 60K/mo | Educational |
| TDS on Salary — How It's Calculated with Examples | 40K/mo | Educational |
| Tax Saving for Salaried — Beyond 80C | 33K/mo | Educational |

**Fixed Deposits (2 articles — need 5 educational):**
| Article | Search Volume | Type |
|---------|-------------|------|
| Tax on FD Interest — TDS Rules and How to Save | 40K/mo | Educational |
| FD Premature Withdrawal — Penalty and Rules | 27K/mo | Educational |
| FD vs RD — Difference, Returns, Which is Better | 33K/mo | Educational |
| Cumulative vs Non-Cumulative FD — Which to Choose | 18K/mo | Educational |
| Senior Citizen FD Rates — Extra Benefits Explained | 22K/mo | Educational |

**Retirement/NPS (0 articles — need 5 to establish category):**
| Article | Search Volume | Type |
|---------|-------------|------|
| EPF Withdrawal Rules — When and How to Withdraw | 74K/mo | Educational |
| NPS vs PPF — Which is Better for Retirement | 40K/mo | Educational |
| How Much Money Do You Need to Retire in India | 33K/mo | Educational |
| EPS Pension Calculation — How Much Will You Get | 27K/mo | Educational |
| Voluntary Provident Fund (VPF) — Benefits and Rules | 18K/mo | Educational |

**Stocks/IPO (0 articles — need 5 to establish category):**
| Article | Search Volume | Type |
|---------|-------------|------|
| How to Apply for IPO in India — Complete Guide | 90K/mo | Educational |
| Demat Account Opening — Documents, Process, Charges | 60K/mo | Educational |
| Intraday vs Delivery Trading — Difference Explained | 40K/mo | Educational |
| What is Stop Loss — How to Use It | 33K/mo | Educational |
| How Stock Market Works — Beginner's Guide India | 74K/mo | Educational |

#### C2: Timely/News Content (Monthly recurring)

| Content Type | Frequency | Example |
|-------------|-----------|---------|
| Best FD Rates This Month | Monthly | "Best FD Rates April 2026 — All Banks Compared" |
| Home Loan Rate Update | Monthly | "Home Loan Interest Rates April 2026 — SBI, HDFC, ICICI" |
| RBI Policy Impact | Per event | "RBI Keeps Repo Rate at X% — What It Means for Your EMI" |
| Upcoming IPOs | Weekly | "IPOs This Week — GMP, Review, Should You Apply?" |
| Market Commentary | Weekly | "Sensex at 80K — Should You Invest or Wait?" |
| Budget Impact | Annual | "Union Budget 2026 — Impact on Your Investments" |
| Tax Deadline Reminders | Seasonal | "ITR Filing Deadline July 2026 — Complete Checklist" |

#### C3: Content Queue Cleanup

**Delete from queue (non-Indian, duplicates, thin):**
- "cashback credit cards uk" (not Indian)
- "cashback credit card bmo" (Canadian bank)
- "cashback credit card login" (navigational, not informational)
- "cashback credit card meaning" (glossary, not article)
- All "reddit" suffix topics (can't outrank Reddit)

**Add to queue (educational + high volume):**
- All 40 educational articles from C1 above
- All monthly recurring topics from C2
- Decision-tree articles: "Should I invest in X or Y?" format

### Phase D — Technical Fixes

| # | Task | Priority | Impact |
|---|------|----------|--------|
| D1 | Add CRON_SECRET validation to all 40 cron routes | P0 | Security — prevents unauthorized API credit burn |
| D2 | Verify sitemap includes all calculator pages | P1 | SEO — ensure all 58+ calculators are submitted |
| D3 | Add `NEXT_PUBLIC_BASE_URL` usage in metadata/OG tags | P1 | SEO — correct canonical URLs |
| D4 | Check if DB versus_pages have working frontend routes | P1 | 20 pages may be invisible |
| D5 | Add IndexNow ping on new page deployment | P2 | Faster indexing |
| D6 | Add structured data (JSON-LD) to article pages | P2 | Rich snippets in SERP |
| D7 | Merge duplicate categories (tax vs tax-planning vs taxes) | P2 | Clean taxonomy |

### Phase E — Revenue Optimization

| # | Task | Priority | Impact |
|---|------|----------|--------|
| E1 | Wire real affiliate links to credit card "Apply" buttons | P1 | Revenue activation |
| E2 | Add affiliate click tracking (DB: affiliate_clicks table exists) | P1 | Attribution |
| E3 | Add conversion postback endpoint verification | P1 | Know when you earn |
| E4 | Add CTA to calculator result pages → relevant product | P2 | Monetize calculator traffic |
| E5 | Add lead capture on calculator pages (email for PDF report) | P2 | Build email list |
| E6 | Wire Stripe for premium features | P3 | Subscription revenue |

---

## PART 4: EXECUTION TIMELINE

### Week 1 (April 15-21)
**Owner:**
- Day 1: P0 tasks (CRON_SECRET, GSC, verify GA4, pull env vars)
- Day 2-3: Publish 21 drafts, sign up on affiliate networks
- Day 4-5: Verify apply links, add Pexels key, set up business email

**Claude:**
- Session 1: Phase A (commit VS files, verify cron security, build 8 VS pages)
- Session 2: Phase B (build 8 remaining VS calcs, verify DB versus pages)
- Session 3: Phase D1 (secure all cron routes)

### Week 2 (April 22-28)
**Owner:**
- Review GSC data (first impressions/clicks should appear)
- Review GA4 data (traffic patterns, top pages)
- Complete affiliate network signups
- Review and approve educational article outlines

**Claude:**
- Session 4-6: Phase C1 — Build 20 educational articles (Credit Cards + Mutual Funds + Loans + Insurance)
- Session 7: Phase D (sitemap audit, merge duplicate categories, IndexNow)

### Week 3 (April 29 - May 5)
**Owner:**
- Analyze GSC: which calculators are getting impressions?
- Set up Google OAuth for GSC integration
- Add Stripe, Twitter, LinkedIn keys

**Claude:**
- Session 8-10: Phase C1 continued — Build 20 more educational articles (Tax + FD + Retirement + Stocks)
- Session 11: Phase C2 — Build monthly rate update templates
- Session 12: Phase E (affiliate tracking, calculator CTAs)

### Week 4 (May 6-12)
**Owner:**
- First revenue check — are affiliate clicks being tracked?
- GSC: check indexing rate (target: 80%+ of pages indexed)
- First content performance review

**Claude:**
- Phase C3: Content queue cleanup + repopulation
- Phase E: Remaining revenue wiring
- Begin calculator upgrades (Phase 10A: share, PDF, schema)

---

## PART 5: SUCCESS METRICS

### By End of April
- [ ] 75+ calculator pages live (from 58)
- [ ] 48+ published articles (from 27 — publish 21 drafts)
- [ ] GSC set up and receiving data
- [ ] GA4 verified and tracking
- [ ] CRON_SECRET securing all 40 endpoints
- [ ] At least 1 affiliate network account active

### By End of May
- [ ] 88+ published articles (27 existing + 21 drafts + 40 educational)
- [ ] All 19 categories have at least 3 articles
- [ ] First organic traffic visible in GSC (target: 100+ impressions/day)
- [ ] At least 1 calculator ranking in top 50 for target keyword
- [ ] Affiliate click tracking working
- [ ] Monthly rate update content flowing

### By End of June
- [ ] 500+ daily impressions in GSC
- [ ] First affiliate revenue (even ₹1 = proof of concept)
- [ ] 120+ articles published
- [ ] IPO section live with weekly updates
- [ ] Email list: 100+ subscribers from calculator lead captures

---

## PART 6: WHAT NOT TO DO

| Don't | Why |
|-------|-----|
| Don't build more calculators beyond VS set | 75 is more than enough. Focus on content around existing calculators |
| Don't chase long-tail CC keywords from content queue | "sbi fuel credit card indian oil" won't build authority. Write educational content instead |
| Don't invest in social posting before content exists | Social distribution crons are built — but there's nothing worth distributing yet |
| Don't touch the admin panel | 88 pages is overkill for a solo founder. Use it, don't expand it |
| Don't add new product categories | 2,584 products across 8 verticals is plenty. Fill them with content instead |
| Don't redesign anything | Design is done. Content and revenue are the gaps |
| Don't build premium features before free traffic arrives | Stripe integration can wait until you have 1000+ daily visitors |

---

*Generated from full platform audit: Supabase DB, Vercel deployment, codebase analysis, env var comparison, content inventory, and route mapping.*
*April 15, 2026 — InvestingPro.in*
