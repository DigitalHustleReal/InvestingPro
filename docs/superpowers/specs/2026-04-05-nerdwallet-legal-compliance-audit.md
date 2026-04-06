# InvestingPro.in — Legal/Compliance Officer Audit

> **Date:** April 5, 2026
> **Perspective:** "As Chief Legal/Compliance Officer, is this platform legally safe to operate in India? What are the regulatory, trademark, and privacy risks?"
> **Benchmark:** Indian regulatory framework (SEBI, RBI, IRDAI, DPDPA 2023, ASCI)

---

## EXECUTIVE SUMMARY

**Overall Legal/Compliance Score: 5.8/10**

InvestingPro has built surprisingly strong regulatory scaffolding — affiliate disclosures, SEBI/RBI disclaimers, Terms of Service with Indian governing law, and editorial independence claims. However, critical gaps in data privacy (DPDPA 2023), unsubstantiated marketing claims, and missing age verification create material legal risk.

**The good news:** The platform positions itself as an informational comparison tool (not a financial advisor), which significantly reduces SEBI/RBI regulatory burden.

**The bad news:** DPDPA 2023 compliance is at 4.5/10 — missing age verification, no data deletion/export endpoints, no breach notification process, and non-granular consent. This is the highest-priority legal risk.

---

## 1. SEBI/RBI/IRDAI REGULATORY COMPLIANCE (8.1/10)

### SEBI Compliance — 9/10

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Not acting as investment advisor | PASS | Positioned as comparison/informational platform |
| Mutual fund disclaimers present | PASS | "Mutual fund investments are subject to market risks" on MF pages |
| No personalized investment advice | PASS | Recommendations are rule-based, not personalized financial advice |
| Disclaimer on past performance | PASS | Present on calculator and MF pages |
| Editorial independence claims | PASS | "No paid rankings. Ever." messaging |

**Risk:** LOW — InvestingPro correctly positions as an information aggregator, not a SEBI-registered investment advisor (RIA).

### RBI Compliance — 8/10

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Not acting as lending service provider | PARTIAL | No RBI LSP registration disclosure |
| Interest rate disclaimers | PASS | Present on loan and FD pages |
| Credit card comparison (informational) | PASS | No direct card issuance |
| Digital lending guidelines compliance | GAP | `InlineEligibilityWidget` collects income/credit score without explicit consent |

**Gaps:**
- `components/loans/InlineEligibilityWidget.tsx` collects financial data (income, credit score) without clear consent disclosure about how this data is used
- No explicit statement about NOT being an RBI-registered LSP (Lending Service Provider)

### IRDAI Compliance — 8/10

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Insurance comparison (informational) | PASS | Positioned as comparison, not sales |
| Claim settlement ratio data sourced | PARTIAL | CSR page exists but data source not cited |
| Web aggregator license | UNCLEAR | May need IRDAI web aggregator license if linking to insurance purchase |

**Risk:** MEDIUM — If insurance "Apply Now" buttons lead directly to purchase flows, IRDAI web aggregator registration may be required.

### Affiliate Disclosure — 9/10

| Element | Status |
|---------|--------|
| Affiliate relationship disclosed | PASS — Footer, About, Terms |
| "We may earn commissions" language | PASS |
| No paid rankings claim | PASS — "No paid rankings. Ever." |
| Disclosure on product pages | PARTIAL — Present but could be more prominent |

---

## 2. DOMAIN NAME & TRADEMARK RISK (6/10)

### "InvestingPro" Name Conflict

| Factor | Assessment |
|--------|------------|
| **Investing.com's InvestingPro** | Investing.com offers a premium product called "InvestingPro" globally |
| **InvestingPro.in domain** | Uses the exact same name with `.in` TLD |
| **Disclaimer present?** | YES — Footer, About, Terms all disclaim connection to Investing.com |
| **Risk level** | MEDIUM — Disclaimer reduces risk but doesn't eliminate trademark claims |

**Current disclaimers found:**
- Footer: Disclaimer present
- About page: Independence statement
- Terms of Service: No affiliation clause
- `components/legal/LegalStrip.tsx`: Visible on relevant pages

**Recommendation:** The disclaimers are good but consider:
1. Adding "InvestingPro.in is not affiliated with Investing.com or its InvestingPro product" explicitly
2. Monitoring for any trademark cease-and-desist communications
3. Having a backup domain name ready (e.g., InvestingProIndia.in)

### Unsubstantiated Marketing Claims — HIGH RISK

| Claim | Location | Issue | ASCI Risk |
|-------|----------|-------|-----------|
| "2.1M+ Happy Users" | `app/about/page.tsx` line ~60 | Platform has ~0 users | CRITICAL — false advertising |
| "₹500Cr+ Investments Facilitated" | `app/about/page.tsx` line ~65 | $0 revenue, no investments | CRITICAL — false advertising |
| "4.8/5 User Rating" | `app/about/page.tsx` line ~70 | No rating system exists | CRITICAL — fabricated metric |
| "India's most advanced tax toolkit" | `app/taxes/page.tsx` line ~213 | Superlative claim without substantiation | HIGH — ASCI violation |
| "10,000+" network hospitals | Production code with `\|\|'10,000+'` fallback | Shows fake number when data missing | HIGH — misleading |
| "12,000+ investors" | Pricing page | Contradicts "2.1M+ Happy Users" | MEDIUM — inconsistency |

**ASCI Guidelines Violation:** The Advertising Standards Council of India requires all claims to be substantiated. Unverifiable statistics constitute misleading advertising under ASCI Code Chapter 1.

**Immediate action required:** Remove ALL unsubstantiated statistics from production code.

### Third-Party Brand Usage

| Brand | Usage | Risk |
|-------|-------|------|
| HDFC Bank, SBI, ICICI, Axis | Product listings, comparisons | LOW — descriptive/nominative fair use |
| CIBIL/TransUnion | Credit score references | LOW — informational use |
| Bank logos | Product cards | MEDIUM — no trademark attribution statements |

**Recommendation:** Add a general trademark attribution notice: "All brand names, logos, and trademarks are the property of their respective owners."

---

## 3. DPDPA 2023 COMPLIANCE (4.5/10) — CRITICAL

### Data Protection Assessment

| DPDPA Requirement | Status | Score | Gap |
|-------------------|--------|-------|-----|
| **Age verification** | NOT IMPLEMENTED | 1/10 | No age gate — CRITICAL violation for financial data |
| **Consent mechanism** | PARTIAL | 5/10 | Cookie consent exists but uses opt-out, not opt-in |
| **Data deletion (Right to Erasure)** | NOT IMPLEMENTED | 2/10 | No deletion endpoint or self-service UI |
| **Data portability (Right to Export)** | NOT IMPLEMENTED | 2/10 | No export endpoint |
| **Breach notification** | NOT DOCUMENTED | 2/10 | DPDPA requires 72-hour notification to DPB |
| **Consent granularity** | NON-GRANULAR | 4/10 | Single consent covers all processing purposes |
| **Privacy Policy completeness** | PARTIAL | 6/10 | Missing retention periods, automated decision-making disclosure |
| **Cross-border data transfer** | UNDISCLOSED | 3/10 | Supabase likely US-hosted, not disclosed |
| **Third-party data sharing** | PARTIAL | 5/10 | Cloudinary, OpenTelemetry, S3 not disclosed in Privacy Policy |
| **Data Processing Agreement** | NOT VERIFIED | 4/10 | No DPA with Supabase, Cloudinary, analytics providers |

### Critical DPDPA Violations

#### 1. No Age Verification (Section 9 — Children's Data)
DPDPA 2023 Section 9 requires verifiable parental consent for processing data of children (under 18 in India). InvestingPro:
- Has no age gate or verification
- Collects financial data (income, credit score) from any visitor
- Processes newsletter signups without age check
- **Risk:** Fines up to ₹200 Crore per violation

#### 2. No Data Deletion Mechanism (Section 12 — Right to Erasure)
- No API endpoint for data deletion
- No self-service "Delete My Data" UI
- No documented process for handling deletion requests
- User data in Supabase has no automated cleanup

#### 3. No Breach Notification Process (Section 8)
- DPDPA requires notification to Data Protection Board within 72 hours
- No incident response plan documented
- No breach notification template or process
- Sentry captures errors but no security incident workflow

#### 4. Cross-Border Transfer Without Disclosure
- Supabase infrastructure likely hosted in US/EU (not India)
- Cloudinary image processing — location undisclosed
- Google Analytics data sent to Google (US)
- PostHog analytics — location undisclosed
- Privacy Policy does not disclose international data transfers

### Cookie Consent Implementation

| Element | Current | Required |
|---------|---------|----------|
| Consent model | Opt-out (pre-checked) | Opt-in (DPDPA requires affirmative consent) |
| Granularity | Single "Accept All" | Per-purpose consent (analytics, marketing, functional) |
| Withdrawal | Not easy to find | Must be as easy as giving consent |
| File | `components/legal/CookieConsent.tsx` | Needs complete rebuild |

---

## 4. CONTENT & ADVERTISING COMPLIANCE (7/10)

### Editorial Disclaimers

| Disclaimer | Present? | Location |
|------------|----------|----------|
| "Not financial advice" | YES | Footer, calculator pages, article disclaimers |
| "Past performance ≠ future returns" | YES | MF pages, calculator results |
| "Subject to market risks" | YES | MF and investment pages |
| Affiliate disclosure | YES | Footer, About, product pages |
| "No paid rankings" | YES | Multiple locations |
| Editorial methodology | YES | Editorial policy page |

**Grade: A** — The disclaimer infrastructure is genuinely strong.

### ASCI Advertising Code Compliance

| Rule | Status | Issue |
|------|--------|-------|
| Claims must be substantiated | FAIL | "2.1M+ users" unverifiable |
| No misleading statistics | FAIL | Inconsistent user counts across pages |
| Superlative claims need proof | FAIL | "India's most advanced" without evidence |
| Comparative advertising rules | PASS | Product comparisons are factual |
| Financial product advertising | PASS | Proper disclaimers present |

---

## 5. DATA COLLECTION INVENTORY

### What Data Is Collected

| Data Type | Collection Point | Consent? | Retention? | Deletion? |
|-----------|-----------------|----------|-----------|-----------|
| Email address | Newsletter signup, account creation | Implicit (no checkbox) | Not defined | Not available |
| Income | Eligibility widget | No explicit consent | Not defined | Not available |
| Credit score range | Eligibility widget | No explicit consent | Not defined | Not available |
| Browsing behavior | PostHog, GA4 | Cookie banner (opt-out) | Not defined | Not available |
| IP address | Server logs, analytics | No disclosure | Not defined | Not available |
| Financial preferences | Card/loan filters | No disclosure | Not defined | Not available |
| Affiliate clicks | Click tracking table | No disclosure | Not defined | Not available |

### Third-Party Data Processors (Not Disclosed in Privacy Policy)

| Processor | Data Shared | Disclosed? |
|-----------|-------------|-----------|
| Supabase | All user data, content | PARTIAL |
| Cloudinary | Image data, metadata | NO |
| Google Analytics | Browsing behavior, demographics | PARTIAL |
| PostHog | User behavior, session data | NO |
| Sentry | Error data, user context | NO |
| Stripe | Payment information | YES |
| Resend | Email addresses | YES |
| Upstash Redis | Cached session data | NO |
| Vercel | Server logs, request data | NO |

---

## LEGAL REMEDIATION PLAN

### CRITICAL (This Week — Legal Risk)

| # | Task | Type | Risk Level | Effort |
|---|------|------|-----------|--------|
| 1 | **Remove ALL unsubstantiated statistics** ("2.1M users", "₹500Cr", "4.8/5 rating") | Content | CRITICAL | 1h |
| 2 | **Add age verification gate** (date of birth or "I am 18+" checkbox) | DPDPA | CRITICAL | 2h |
| 3 | **Switch cookie consent to opt-in** model with granular purposes | DPDPA | HIGH | 3h |
| 4 | **Remove placeholder `\|\|'10,000+'` logic** — show "N/A" not fake numbers | Content | HIGH | 1h |
| 5 | **Add trademark attribution** for bank names/logos | Trademark | MEDIUM | 30min |

### HIGH PRIORITY (Next 2 Weeks)

| # | Task | Type | Risk Level | Effort |
|---|------|------|-----------|--------|
| 6 | Build data deletion API endpoint + self-service UI | DPDPA | HIGH | 4h |
| 7 | Build data export/portability endpoint | DPDPA | HIGH | 4h |
| 8 | Add explicit consent to eligibility widget (income/credit score collection) | RBI/DPDPA | HIGH | 2h |
| 9 | Update Privacy Policy with all third-party processors | DPDPA | HIGH | 2h |
| 10 | Add data retention periods to Privacy Policy | DPDPA | MEDIUM | 1h |
| 11 | Document breach notification process (72-hour SOP) | DPDPA | HIGH | 2h |
| 12 | Add "InvestingPro.in is not affiliated with Investing.com" explicit disclaimer | Trademark | MEDIUM | 30min |

### MEDIUM PRIORITY (Month 1)

| # | Task | Type | Risk Level | Effort |
|---|------|------|-----------|--------|
| 13 | Disclose cross-border data transfers in Privacy Policy | DPDPA | MEDIUM | 1h |
| 14 | Add automated decision-making disclosure | DPDPA | MEDIUM | 1h |
| 15 | Verify IRDAI web aggregator license requirements | Regulatory | MEDIUM | Human research |
| 16 | Add RBI LSP non-registration disclosure on loan pages | Regulatory | LOW | 30min |
| 17 | Implement consent withdrawal mechanism (as easy as giving consent) | DPDPA | MEDIUM | 3h |
| 18 | Create Data Processing Agreements with all third-party processors | DPDPA | MEDIUM | Human, ongoing |
| 19 | Add data source citations on all product comparison pages | Content | LOW | 2h |

---

## VERDICT

**Would a legal team clear this for launch?** Conditionally yes, with immediate fixes.

**The regulatory positioning is smart:** InvestingPro correctly avoids claiming to be a financial advisor, investment advisor, or lending service provider. The informational comparison model significantly reduces SEBI/RBI regulatory burden. The affiliate disclosures and editorial independence claims are among the best I've seen in Indian fintech.

**The DPDPA 2023 compliance is the critical gap.** India's new data protection law (effective 2024) carries fines up to ₹250 Crore. The platform collects financial data (income, credit scores) without proper consent mechanisms, has no data deletion/export capabilities, and hasn't documented a breach notification process. This is the highest legal priority.

**The trademark risk is manageable** but should be monitored. The Investing.com/InvestingPro name overlap is a known risk, mitigated by existing disclaimers but not eliminated.

**The fabricated statistics are an immediate liability.** "2.1M+ Happy Users" on a platform with ~0 users is straightforward false advertising under ASCI guidelines. Remove before any public marketing.

---

*Audit conducted using 3 specialized agents examining: SEBI/RBI/IRDAI regulatory compliance, domain/trademark risk analysis, and DPDPA 2023 data privacy compliance.*
