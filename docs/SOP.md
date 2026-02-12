# InvestingPro.in - Standard Operating Procedure (SOP)
## One-Person Operations Framework (v2026)

### 🎯 GOAL
Achieve ₹60 Crore annual revenue by 2030 through highly automated, high-authority personal finance content and decision support.

---

### 🕒 DAILY ROUTINE (20-30 mins / day)
*Target: <8 hours/week total effort*

1.  **Pipeline Monitoring** 📊
    - Visit `/admin/automation` and `/admin/pipeline-monitor`.
    - Check Success Rate (Target: >95%).
    - Inspect "Failed Ops" - if high, investigate scrapers in `/admin/cms/scrapers`.

2.  **Editorial Approval Queue** ✍️
    - Visit `/admin/review-queue` (or `/admin/autonomy` review vector).
    - Review items with Confidence Score < 0.9.
    - Quick-scan for "AI Hallucination" or "Sensitive Content" badges.
    - Neutralize & Publish or Reject.

3.  **System Health Check** ❤️
    - Check `/admin/cms/health`. Ensure API status is `healthy`.
    - Verify "Tokens Remaining" and "Daily Budget".

---

### 📅 WEEKLY CHECKLIST (1-2 hours)

1.  **Revenue Intelligence Review** 💰
    - Review `/admin/revenue` and `/admin/revenue/intelligence`.
    - Identify top-performing articles vs. conversion drop-offs.
    - Adjust "Promoted" products if conversion rates lag.

2.  **Data Freshness Sync** 🔄
    - Verify `/api/cron/sync-amfi-data` (Mutual Funds) and `/api/cron/weekly-data-update` (Credit Cards) ran successfully.
    - Spot-check 3-5 random products against "Ground Truth" (Bank websites).

3.  **Content Refresh** 🌿
    - Use "Evergreen Sync" in the Automation Hub to trigger updates for top 10 articles based on new market data.

---

### 📈 MONTHLY STRATEGY (4 hours)

1.  **SEO & Authority Depth Audit** 🔍
    - Analyze `/admin/seo/rankings`.
    - Identify "Striking Distance" keywords (Position 4-10).
    - Trigger "Bulk Engine" runs for high-intent clusters related to trending finance topics.

2.  **Partner & Affiliate Optimization** 🤝
    - Check for new affiliate offers or API changes.
    - Update Secure Vault credentials if needed.

3.  **Automation Tuning** ⚙️
    - Adjust "Autonomy Levels" in `/admin/autonomy/settings`.
    - If accuracy is consistently >99%, increase autonomy to "Level 4".

---

### 🆘 TROUBLESHOOTING

- **503 Service Unavailable on Admin**: Usually a "Fail-Closed" budget trigger. Check database RPC functions and daily limits.
- **Scraper Failures**: Check `/admin/cms/scrapers`. If a source changed its DOM, update the selector in the specific scraper node.
- **Recharts Layout Crash**: Ensure charts are wrapped in a fixed-height container with `ResponsiveContainer`.

---
*Document Owner: CEO / System Architect*
*Last Updated: February 2026*
