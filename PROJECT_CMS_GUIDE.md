# InvestingPro CMS Guide

**Version:** 2026.1
**Access:** `/admin`
**Role:** Central Command Center for Content, Automation, and Analytics.

---

## 1. CMS Overview

The InvestingPro CMS is a custom-built, headless admin panel integrated directly into the Next.js application. It is designed to manage the "Ghost Team" (AI Automation) and human editorial workflows.

**Unique Selling Point:** Unlike standard CMSs (WordPress/Strapi), this CMS is built specifically for **high-velocity AI content generation** and **financial product comparison**.

---

## 2. Architecture & Tech Stack

*   **Location:** `app/admin` (Next.js App Router)
*   **Database:** Supabase (Direct DB access via RLS policies)
*   **UI Components:**
    *   **Sidebar:** `components/admin/AdminSidebar.tsx` (Main Navigation)
    *   **Contextual Nav:** `components/admin/ContextualSidebar.tsx` (Sub-navigation)
    *   **Editor:** `TipTap` (Rich Text) + `WritesonicAIWriter` (AI Integration)
*   **Access Control:** Role-Based Access Control (RBAC) via Supabase Auth (`is_admin`, `is_editor`).

---

## 3. Core Modules

### 3.1 📊 Analyze (Dashboard)
*   **Status:** ✅ Production Ready
*   **Path:** `/admin`
*   **Features:**
    *   **Overview:** High-level system health and content velocity stats.
    *   **Contextual Sidebar:** Replaced horizontal tabs for better scalability.
    *   **Sections:** Performance, Content Stats, Automation Status, Social Analytics.

### 3.2 🤖 AI Content Factory
*   **Status:** ⚠️ Partial Automation (UI exists, backend requires scaling)
*   **Path:** `/admin/ai-generator`
*   **Features:**
    *   **Multi-Provider Engine:** Uses OpenAI, Groq, and Mistral.
    *   **One-Click Generator:** Auto-generates articles based on keyword inputs.
    *   **Templates:** 8+ Niche Financial Templates (Credit Card Reviews, Loan Guides).
    *   **Review Queue:** Moving generated content to human moderation.

### 3.3 ✏️ Editor & Content Management
*   **Status:** ✅ Functional
*   **Features:**
    *   **Rich Text:** TipTap editor with formatting, images, and links.
    *   **SEO Inspector:** Sidebar panel for Meta tags, Slug, and Schema validation.
    *   **Media Library:** Management of uploaded assets (Contextual Sidebar: My Media, Stock Images).
    *   **Workflow:** Draft ➔ Review ➔ Published ➔ Archived.

### 3.4 🛡️ Moderation & Quality
*   **Status:** ✅ Functional
*   **Features:**
    *   **Approval Queue:** Gatekeeping for all AI-generated content.
    *   **Content Scoring:** Automated scoring for quality and monetization potential (`lib/content/content-scorer.ts`).
    *   **Affiliate Tracking:** Integration with `affiliate_clicks` for revenue attribution.

---

## 4. Workflows

### The "Ghost Team" Pipeline
1.  **Trigger:** Manual or Scheduled trigger in `/admin/ai-generator`.
2.  **Generation:** AI Agents draft content using `article-generator.ts`.
3.  **Validation:** Content passes through "Quality Gates" (Source check, Compliance check).
4.  **Review:** Draft lands in the **Moderation Queue**.
5.  **Publish:** Human Editor approves → Content goes Live.

---

## 5. Current Status (Audited Jan 2026)

| Module | Score | Status | Notes |
| :--- | :--- | :--- | :--- |
| **UI/UX** | **8.0/10** | ✅ Excellent | "Analyze" redesign and Contextual Sidebar implementation complete. |
| **Core CMS** | **7.5/10** | ✅ Good | Standard CRUD operations work well. |
| **AI Features** | **5.0/10** | ⚠️ Partial | Structure exists, but "99% Automation" vision needs backend scaling. |
| **Automation** | **3.0/10** | 🔴 Low | Scrapers and social auto-posting need integration. |

### Critical Gaps to Address
*   **Bulk Import:** No tool for bulk CSV import.
*   **Scheduling:** Content calendar UI is missing.
*   **Expert Dashboard:** No dedicated view for external "Expert" contributors.

---

## 6. Development Reference

**Key Files:**
*   `app/admin/page.tsx` - Main Dashboard Entry.
*   `app/admin/ai-generator/page.tsx` - AI Generator UI.
*   `components/admin/ContextualSidebar.tsx` - Navigation Logic.
*   `lib/automation/article-generator.ts` - Backend Logic for AI.

**Routes:**
*   `/admin` - Dashboard
*   `/admin/ai-generator` - AI Tools
*   `/admin/media` - Media Library
*   `/admin/settings` - System Config

---

**End of CMS Guide**
