# 🏆 COMPETITIVE BENCHMARK AUDIT
**Vs. NerdWallet, BankBazaar, MoneyControl**

## 1. 📉 AUTHORITY GAP (E-E-A-T)
| Feature | Competitor (Gold Standard) | InvestingPro (Current) | Verdict |
| :--- | :--- | :--- | :--- |
| **Authors** | "Reviewed by John Doe, CFA" | "InvestingPro Team" | ❌ Low Trust |
| **Disclosure** | "Advertiser Disclosure" on top of every page | Hidden in Footer | ⚠️ Compliance Risk |
| **Freshness** | Rates updated Hourly/Daily | Hardcoded / Static | ❌ Credibility Killer |

## 2. 🧩 CAPABILITY GAP
- **Eligibility Check**: Competitors ask "What is your Salary?" -> Show matching cards.
    - **You**: Show ALL cards. User has to guess if they qualify.
- **Account Aggregation**: Competitors link Bank Accounts to track spending.
    - **You**: Manual Calculator only.

## 3. 🛡️ TRUST SIGNALS
- **Good**: Your Footer Disclaimer is legally strong ("Not SEBI Registered").
- **Bad**: Missing "Editorial Guidelines" page explaining *how* you rate products. Transparency builds trust.
- **Bad**: Missing "Star Rating Methodology". Why is HDFC Regalia 4.8 stars? Competitors explain the rubric.

## 4. 🛠️ ACTION PLAN
1.  **Ad Disclosure**: Add a `AdvertiserDisclosure` component to the top of every Comparison Table.
2.  **Author Profiles**: Create `authors` table. Link every article to a human with a Bio/LinkedIn.
3.  **Methodology Page**: Create `/methodology` explaining how you score cards/loans.
4.  **Daily Cron**: Automate the update of IPO Status and FD Rates.
