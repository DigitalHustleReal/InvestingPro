# 🔐 MISSING CREDENTIALS & API ACCESS

**Date:** January 2, 2026
**Status:** Action Required

To make the platform "Complete" (Production-Grade Fintech), we need the following credentials.

---

## 1. OpenAI API (ACTION REQUIRED) 🔴
**Status:** **QUOTA EXCEEDED (429 Error)**
Our test confirmed your OpenAI key works but has **run out of credits**.

**Impact:**
- Cannot use DALL-E 3 (High-quality infographics).
- Cannot use GPT-4o ("Vikram Mehta" persona might degrade if Gemini fails).

**Action:**
- Add $5-10 credits to your OpenAI billing account.
- OR rely on **Google Gemini** (Free tier) + **Pollinations.ai** (Free images).

---

## 2. Google Search Console & Indexing API (CRITICAL)
**Why:** To instantly notify Google when we publish an article (instead of waiting weeks).

**How to get it:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a Project.
3. Enable **"Google Search Console API"** and **"Indexing API"**.
4. Create a **Service Account**.
5. Download the JSON key file.
6. Rename it to `service-account.json` and place it in the root directory.

---

## 3. Financial Data Access (AUDIT)

### ✅ Mutual Funds (AMFI) - **LIVE ACCESS**
**Status:** **WE HAVE THIS!**
- **Source:** `lib/amfi-scraper.ts` pulls official NAVs daily.
- **Action:** Can be activated to show live MF tables.

### ⚠️ IPO Data - **MISSING (User Focus Area)**
**Status:** No scraper found.
**Requirement:** Since we are focusing on IPOs (not stocks), we need an **IPO Scraper**.
- **Data needed:** IPO Dates, GMP (Grey Market Premium), Subscription Status.
- **Action:** Build `lib/ipo-scraper.ts` (Next Session?).

### ❌ Stock Market Data
**Status:** Skipped (Per User Request).

---

## ⚠️ ACTION ITEMS

1. [ ] **Fix OpenAI Billing** (or accept lower quality images).
2. [ ] **Download `service-account.json`**.
3. [ ] **Build IPO Scraper** (Next priority).
