# Strategic Brief: IPOs & The "Chittorgarh" Ambition

## ❓ The Core Question
*"Is IPO within scope? Can we target Chittorgarh?"*

## 🎯 Verdict: **YES, but with a Pivot.**

### 1. The "Traffic Magnet" Theory (Why we need it)
*   **High Frequency:** Users check IPO GMP *daily*. They check Credit Cards *yearly*.
*   **The Hook:** IPOs are the perfect "Top of Funnel" to bring users into the ecosystem.
*   **Cross-Sell:** 
    *   User comes for: *Tata Tech IPO GMP*
    *   We ask: *"Do you have the best Demat account for this? Compare Zerodha vs Groww."*
    *   **Result:** Monetization via Broker Affiliate links.

### 2. The "Chittorgarh" Trap (The Risk)
*   **Chittorgarh.com** is a content monster. They have 15 years of archives and forum moderators.
*   **Risk:** Trying to beat them on *depth* (forums, reviews, detailed DRHP analysis) will distract us from our core (Credit Cards/Personal Finance).
*   **Solution:** Beat them on **UX & Speed**.
    *   Chittorgarh looks like 2005.
    *   InvestingPro IPOs should look like **Robinhood/Cred** (Sleek, Fast, Visual).

### 3. Execution Strategy: "Better, Not Deeper"
Instead of "More Data", focus on **"Actionable Data"**:

| Feature | Chittorgarh (Competitor) | InvestingPro (Us) |
| :--- | :--- | :--- |
| **Design** | Cluttered, Text-Heavy | **Card-Based, Visual, Mobile-First** |
| **Data** | Manual Updates | **Aggregated/Automated** |
| **Action** | "Read More" | **"Apply Now" (Broker Link)** |
| **USP** | Forums | **"Approval Probability" / "GMP Trends"** |

## 🛠️ Implementation Plan (Data Integrity Phase)
To sustain this without a content team, we need **Core Data Automation**:

1.  **Database:** `ipos` table in Supabase (Single Source of Truth).
2.  **Fields:**
    *   `name`, `price_band`, `open_date`, `close_date`.
    *   `gmp_live` (Updated daily).
    *   `subscription_status` (Updated hourly via cron).
3.  **The "Killer" Feature:**
    *   A "GMP Thermometer" visual (using our new `GaugeMeter`).

## 🚀 Recommendation
**Build it.** But build it as a **Growth Engine for Brokers**, not just a news page.
