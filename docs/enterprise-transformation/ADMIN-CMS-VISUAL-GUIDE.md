# Admin & CMS Visual Guide
**Complete User Reference: How Everything Works, How to Use It, What It Means**

---

## 🎯 OVERVIEW: HOW ADMIN/CMS WORKS

```
┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN DASHBOARD                             │
│                    (/admin - Main Page)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   CONTENT   │  │  PLANNING   │  │ AUTOMATION  │            │
│  │  - Articles │  │ - Dashboard │  │ - Factory   │            │
│  │  - Pages    │  │ - Calendar  │  │ - Hub       │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │     CMS     │  │  INSIGHTS   │  │MONETIZATION │            │
│  │ - Dashboard │  │ - Analytics │  │ - Products  │            │
│  │ - Budget    │  │ - SEO       │  │ - Affiliate │            │
│  │ - Generate  │  │ - Exp.      │  │ - Ads       │            │
│  │ - Health    │  │             │  │             │            │
│  │ - Scrapers  │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CMS ORCHESTRATOR                              │
│            (AI-Powered Content Generation System)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Strategy Agent → Content Agent → Image Agent → Quality Agent    │
│       │              │              │              │             │
│       ▼              ▼              ▼              ▼             │
│  Risk Agent → Publish Agent → Tracking Agent → Feedback Agent    │
│                                                                   │
│  Budget Governor ← Economic Intelligence ← Health Monitor        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE METRICS                            │
│                                                                   │
│  Articles    Products    Costs    Economics   Risk   Diversity   │
│   (views)    (clicks)  (tokens)   (ROI)     (score)  (types)    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📍 NAVIGATION MAP

```
ADMIN SIDEBAR
│
├── CONTENT
│   ├── Articles (List/Edit/Create)
│   ├── Pillar Pages
│   ├── Authors
│   ├── Categories
│   ├── Tags
│   └── Media Library
│
├── PLANNING
│   ├── Dashboard (Main Admin Page)
│   └── Content Calendar
│
├── AUTOMATION
│   ├── Content Factory
│   ├── Automation Hub
│   └── Review Queue
│
├── CMS ⭐ NEW
│   ├── CMS Dashboard (Overview)
│   ├── Budget (Spending Limits)
│   ├── Generation (Create Content)
│   ├── Health (System Status)
│   └── Scrapers (Data Collection)
│
├── INSIGHTS
│   ├── Analytics
│   ├── SEO Health
│   └── Experiments
│
├── MONETIZATION
│   ├── Product Catalog
│   ├── Affiliates
│   └── Ads
│
└── SETTINGS
    └── Secure Vault
```

---

## 📊 MAIN ADMIN PAGE STRUCTURE

### `/admin` - Dashboard Overview

```
┌─────────────────────────────────────────────────────────────┐
│  TOP STATS CARDS                                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Articles │ │  Views   │ │ Clicks   │ │ Reviews  │      │
│  │  Total   │ │  Total   │ │Affiliate │ │ Pending  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  SYSTEM STATUS CARDS                                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │   Scraper    │ │ AI Factory   │ │  RSS Feeds   │       │
│  │   Network    │ │   Status     │ │   Status     │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  TAB NAVIGATION (Left Sidebar)                               │
├─────────────────────────────────────────────────────────────┤
│  Overview │ Performance │ Content │ Automation │ Social │ Trends│
│     │           │           │          │          │        │    │
│     ▼           ▼           ▼          ▼          ▼        ▼    │
│  [Content    [Performance] [Content] [Automation] [Social] [Trends]
│   Snapshot]   Tracking      Stats      Controls    Metrics  Data
└─────────────────────────────────────────────────────────────┘
```

### What Each Tab Shows:

#### 📊 Overview Tab
- **Content Snapshot**: Total articles, views, AI-generated count
- **System Performance**: Publication rate, success rate
- **Quick Stats**: Recent activity summary

#### 📈 Performance Tab
- **ContentPerformanceTracking Component**
  - Top performing articles (by views)
  - Revenue drivers
  - Worst performers
  - Category performance
  - Views over time chart

#### 📝 Content Tab
- **Content Statistics**: Published vs Drafts
- **Articles by Category**: Distribution
- **Recent Articles List**: Latest content

#### ⚙️ Automation Tab
- **AutomationControls Component**
  - Pipeline controls
  - Schedule management
  - Trigger settings

#### 🌐 Social Tab
- **Omnichannel Presence**: Facebook, Twitter, LinkedIn, Instagram, YouTube metrics
- **Engagement Rates**: Follower counts, engagement percentages

#### 📈 Trends Tab
- **Intelligence Vectors**: Keyword trends
- **Search Volume**: Trend data
- **Momentum Indicators**: Up/down trends

---

## 🎯 CMS SECTION WORKFLOW

### `/admin/cms` - CMS Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  CMS QUICK STATS                                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Health  │ │ Budget   │ │Generate  │ │ Scrapers │      │
│  │  Status  │ │  Status  │ │  Ready   │ │  Status  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  BUDGET OVERVIEW (BudgetGovernorPanel)                       │
│  - Daily limits (tokens, images, cost)                       │
│  - Current usage                                             │
│  - Remaining budget                                          │
│  - Pause/resume controls                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  QUICK LINKS                                                 │
├─────────────────────────────────────────────────────────────┤
│  Budget │ Generation │ Health │ Scrapers                     │
└─────────────────────────────────────────────────────────────┘
```

### `/admin/cms/budget` - Budget Management

**What It Shows:**
- Daily budget limits (tokens, images, $)
- Current usage (how much spent today)
- Remaining budget
- Pause/resume button

**What It Means:**
- **Tokens**: AI API usage (text generation)
- **Images**: Image generation count
- **Cost USD**: Total spending limit per day
- **Paused**: Stops all CMS operations

**How to Use:**
1. Set daily limits
2. Monitor spending
3. Pause if budget exhausted
4. Reset at midnight UTC

### `/admin/cms/generation` - Content Generation

**What It Shows:**
- Canary test button (test 1 article)
- Full generation button (generate batch)
- BulkGenerationPanel (configure bulk generation)

**What It Means:**
- **Canary Test**: Safe test run (1 article, $5 limit)
- **Full Generation**: Production run (configure volume)
- **Bulk Panel**: Generate multiple articles at once

**How to Use:**
1. Click "Canary Test" for safe testing
2. Configure bulk settings (articles count, quality)
3. Click "Generate Content" to start
4. Monitor progress in articles list

### `/admin/cms/health` - System Health

**What It Shows:**
- Overall system health (healthy/degraded/unhealthy)
- Agent health status (each agent's status)
- System metrics (success rates, error counts)
- Error details (if any)

**What It Means:**
- **Healthy**: All systems operational
- **Degraded**: Some issues, still functional
- **Unhealthy**: Critical problems, needs attention

**How to Use:**
1. Check overall status
2. Review agent health
3. Check metrics for anomalies
4. Review errors if unhealthy

### `/admin/cms/scrapers` - Scraper Management

**What It Shows:**
- List of all scrapers (RSS, reviews, rates)
- Scraper status (active/idle/error)
- Last run time
- Success rate
- Execute/stop controls

**What It Means:**
- **Scrapers**: Automated data collection tools
- **RSS**: News/feed scrapers
- **Reviews**: Product review scrapers
- **Rates**: Financial rate scrapers

**How to Use:**
1. View all scrapers
2. Check status
3. Click "Execute" to run manually
4. Monitor success rates

---

## 🔄 CMS CONTENT GENERATION WORKFLOW

```
USER ACTION: Click "Generate Content" in /admin/cms/generation
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  1. BUDGET CHECK (BudgetGovernorAgent)                       │
│     ✓ Has budget? → Continue                                │
│     ✗ No budget? → Stop & Alert                             │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  2. STRATEGY (StrategyAgent)                                 │
│     - Analyze trends                                         │
│     - Research keywords                                      │
│     - Select topics                                          │
│     - Determine content types                                │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  3. CONTENT GENERATION (ContentAgent)                        │
│     - Generate article content                               │
│     - Use cost-efficient AI (Ollama → DeepSeek → Groq)      │
│     - Track costs                                            │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  4. IMAGE GENERATION (ImageAgent)                            │
│     - Generate featured images                               │
│     - Track image costs                                      │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  5. QUALITY CHECK (QualityAgent)                             │
│     - Evaluate content quality                               │
│     - Score: 0-100                                           │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  6. RISK ASSESSMENT (RiskComplianceAgent)                    │
│     - Assess financial content risk                          │
│     - Score: 0-100 (higher = more risky)                     │
│     - Flag high-risk content                                 │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  7. PUBLISH DECISION (PublishAgent)                          │
│     Quality ≥ 80 AND Risk = Low → Auto-Publish              │
│     Quality < 80 OR Risk = High → Draft (Manual Review)      │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  8. TRACKING (TrackingAgent)                                 │
│     - Track performance                                      │
│     - Monitor views, clicks, conversions                     │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  9. ECONOMICS (EconomicIntelligenceAgent)                    │
│     - Calculate ROI                                          │
│     - Track revenue vs costs                                 │
│     - Update profit metrics                                  │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  10. FEEDBACK LOOP (FeedbackLoopAgent)                       │
│      - Learn from performance                                │
│      - Update strategy weights                               │
│      - Optimize future content                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 METRICS EXPLAINED: WHAT MEANS WHAT

### Articles Metrics

| Metric | What It Means | Where to Find |
|--------|---------------|---------------|
| **Views** | Number of times article was viewed | Main admin stats, ContentPerformanceTracking |
| **Status** | draft = not published, published = live, archived = removed | Articles list |
| **AI Generated** | Whether content was AI-generated | Articles list (AI badge) |
| **Read Time** | Estimated reading time in minutes | Article schema (not displayed) |
| **Quality Score** | Content quality rating (0-100) | CMS internal (not displayed) |
| **Risk Score** | Risk level (0-100, higher = riskier) | content_risk_scores table (not displayed) |
| **ROI** | Return on investment (revenue - cost) / cost | content_economics table (not displayed) |
| **Cost** | Generation cost (AI + images) | content_costs table (not displayed) |

### Product/Affiliate Metrics

| Metric | What It Means | Where to Find |
|--------|---------------|---------------|
| **Clicks** | Number of affiliate link clicks | Main admin stats, ProductPerformanceTracking |
| **Conversions** | Number of successful purchases | Main admin stats, ProductPerformanceTracking |
| **Conversion Rate** | (Conversions / Clicks) × 100 | Main admin (calculated) |
| **Revenue** | Total earnings from conversions | affiliate_clicks.commission_earned (not displayed) |
| **Commission Rate** | Percentage/fixed amount per conversion | affiliate_products table (not displayed) |
| **CTR** | Click-through rate (Clicks / Views) × 100 | product_analytics_daily (not displayed) |

### CMS Budget Metrics

| Metric | What It Means | Where to Find |
|--------|---------------|---------------|
| **Max Tokens** | Daily token limit (default: 1M) | /admin/cms/budget |
| **Tokens Used** | Tokens consumed today | /admin/cms/budget |
| **Max Images** | Daily image limit (default: 100) | /admin/cms/budget |
| **Images Used** | Images generated today | /admin/cms/budget |
| **Max Cost USD** | Daily spending limit (default: $50) | /admin/cms/budget |
| **Cost Spent USD** | Money spent today | /admin/cms/budget |
| **Is Paused** | Budget paused (stops all operations) | /admin/cms/budget |

### CMS Economics Metrics

| Metric | What It Means | Where to Find |
|--------|---------------|---------------|
| **Total Cost** | Generation cost per article | content_economics table (not displayed) |
| **Affiliate Revenue** | Revenue from affiliate links | content_economics table (not displayed) |
| **Ad Revenue** | Revenue from ads | content_economics table (not displayed) |
| **Total Revenue** | Total earnings per article | content_economics table (not displayed) |
| **ROI %** | (Revenue - Cost) / Cost × 100 | content_economics table (not displayed) |
| **Profit** | Revenue - Cost | content_economics table (not displayed) |
| **Profit/View** | Profit per view | content_economics table (not displayed) |

### Risk & Compliance Metrics

| Metric | What It Means | Where to Find |
|--------|---------------|---------------|
| **Risk Score** | 0-100 risk assessment | content_risk_scores table (not displayed) |
| **Risk Level** | low/medium/high/critical | content_risk_scores table (not displayed) |
| **Verification Status** | pending/verified/flagged/rejected | content_risk_scores table (not displayed) |
| **Can Auto-Publish** | Safe to auto-publish (quality ≥ 80 AND risk low) | content_risk_scores table (not displayed) |
| **Requires Manual Review** | Needs human review | content_risk_scores table (not displayed) |

### Diversity Metrics

| Metric | What It Means | Where to Find |
|--------|---------------|---------------|
| **Authority Content** | Long-term, evergreen content | content_diversity table (not displayed) |
| **Trend Content** | Trend-based, timely content | content_diversity table (not displayed) |
| **Commercial Content** | High-ROI affiliate content | content_diversity table (not displayed) |
| **Diversity Score** | 0-100 diversity rating | content_diversity table (not displayed) |
| **Meets Constraint** | At least 20% authority content | content_diversity table (not displayed) |

---

## 🎯 HOW TO: COMMON TASKS

### How to Generate Content

1. **Go to:** `/admin/cms/generation`
2. **For Testing:**
   - Click "Canary Test" button
   - Wait for 1 article generation
   - Check `/admin/articles` for new article
3. **For Production:**
   - Configure bulk settings (articles count, quality threshold)
   - Click "Generate Content"
   - Monitor in articles list

### How to Set Budget

1. **Go to:** `/admin/cms/budget`
2. **Set Limits:**
   - Max Tokens: Default 1,000,000
   - Max Images: Default 100
   - Max Cost USD: Default $50.00
3. **Click "Update Budget"**
4. **Monitor Usage:**
   - Check "Tokens Used" vs "Max Tokens"
   - Check "Cost Spent" vs "Max Cost"
5. **Pause if Needed:**
   - Click "Pause Budget" to stop all operations
   - Click "Resume Budget" to continue

### How to Check System Health

1. **Go to:** `/admin/cms/health`
2. **Check Overall Status:**
   - Healthy = Green (all good)
   - Degraded = Yellow (minor issues)
   - Unhealthy = Red (critical problems)
3. **Review Agent Health:**
   - Check each agent's status
   - Review error messages if any
4. **Check Metrics:**
   - Success rates
   - Error counts
   - Performance indicators

### How to View Metrics

1. **Main Dashboard:** `/admin`
   - Overview tab: Basic stats
   - Performance tab: ContentPerformanceTracking
   - Content tab: Article statistics
2. **CMS Dashboard:** `/admin/cms`
   - Budget overview
   - Quick stats
3. **CMS Budget:** `/admin/cms/budget`
   - Detailed budget metrics
4. **CMS Health:** `/admin/cms/health`
   - System diagnostics

### How to Manage Scrapers

1. **Go to:** `/admin/cms/scrapers`
2. **View All Scrapers:**
   - List shows all available scrapers
   - Status (active/idle/error)
   - Last run time
   - Success rate
3. **Execute Scraper:**
   - Click "Execute" on any scraper
   - Wait for completion
   - Check results

---

## ⚠️ WHAT TO WATCH FOR

### Budget Alerts
- **Budget Exhausted**: All operations stop
- **80% Budget Used**: Warning threshold
- **Daily Reset**: Resets at midnight UTC

### Risk Alerts
- **High Risk Content**: Requires manual review
- **Critical Risk**: Blocked from auto-publish
- **Verification Conflicts**: Two models disagree

### Health Alerts
- **Unhealthy Status**: System problems detected
- **Agent Failures**: Individual agent errors
- **High Error Rate**: Many failures

---

## 🗺️ NAVIGATION FLOW DIAGRAM

```
START: Login to Admin
    │
    ▼
/admin (Main Dashboard)
    │
    ├── Overview Tab
    │   └── Content stats, system performance
    │
    ├── Performance Tab
    │   └── ContentPerformanceTracking
    │       ├── Top articles
    │       ├── Revenue drivers
    │       └── Charts
    │
    ├── Content Tab
    │   ├── Article statistics
    │   └── Category distribution
    │
    ├── Automation Tab
    │   └── AutomationControls
    │
    ├── Social Tab
    │   └── Social media metrics
    │
    └── Trends Tab
        └── Keyword trends

    │
    ▼
/admin/cms (CMS Dashboard)
    │
    ├── Budget Overview
    │   └── Daily limits & usage
    │
    ├── Quick Links
    │   ├── /admin/cms/budget
    │   ├── /admin/cms/generation
    │   ├── /admin/cms/health
    │   └── /admin/cms/scrapers

    │
    ▼
/admin/cms/budget
    │
    └── BudgetGovernorPanel
        ├── Set limits
        ├── Monitor usage
        └── Pause/resume

    │
    ▼
/admin/cms/generation
    │
    ├── Canary Test (1 article)
    ├── Full Generation
    └── BulkGenerationPanel

    │
    ▼
/admin/cms/health
    │
    ├── Overall status
    ├── Agent health
    ├── System metrics
    └── Error details

    │
    ▼
/admin/cms/scrapers
    │
    └── ScraperDashboard
        ├── List scrapers
        ├── Execute/stop
        └── Monitor status
```

---

## 🎓 QUICK REFERENCE: WHAT PAGE SHOWS WHAT

| Page | What It Shows | When to Use |
|------|---------------|-------------|
| `/admin` | Main dashboard, overall stats | Daily monitoring, overview |
| `/admin/cms` | CMS overview, budget summary | CMS status check |
| `/admin/cms/budget` | Detailed budget management | Set/change budgets, monitor spending |
| `/admin/cms/generation` | Content generation controls | Generate new articles |
| `/admin/cms/health` | System health diagnostics | Troubleshooting, status check |
| `/admin/cms/scrapers` | Scraper management | Manual data collection |
| `/admin/articles` | Article list/manage | Edit, publish, delete articles |
| `/admin/analytics` | Detailed analytics | Deep performance analysis |
| `/admin/products` | Product catalog | Manage products |
| `/admin/affiliates` | Affiliate management | Manage affiliate links |

---

## 💡 KEY CONCEPTS EXPLAINED

### Budget Governor
- **What**: Controls daily spending limits
- **Why**: Prevents overspending on AI APIs
- **How**: Stops operations when budget exhausted
- **Where**: `/admin/cms/budget`

### Content Generation Cycle
- **What**: Automated article creation process
- **Steps**: Strategy → Content → Images → Quality → Risk → Publish
- **Time**: 2-5 minutes per article
- **Where**: `/admin/cms/generation`

### Risk Assessment
- **What**: Evaluates financial content compliance
- **Score**: 0-100 (higher = riskier)
- **Impact**: High-risk = manual review required
- **Where**: Internal (not displayed in UI)

### ROI Tracking
- **What**: Revenue vs cost calculation
- **Formula**: (Revenue - Cost) / Cost × 100
- **Purpose**: Identify profitable content
- **Where**: content_economics table (not displayed)

### Diversity Constraint
- **What**: Ensures 20% authority content
- **Purpose**: Long-term value preservation
- **Types**: Authority, Trend, Commercial
- **Where**: content_diversity table (not displayed)

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0
**Status:** Complete User Reference Guide
