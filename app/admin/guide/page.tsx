"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BookOpen, Search, ChevronRight, FileText, Zap, Activity, DollarSign, Rss, Sparkles, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

const guideContent = `# Admin & CMS User Guide

Complete reference for using the Admin Dashboard and CMS system.

---

## 🎯 System Overview

The Admin Dashboard is your control center for managing content, products, analytics, and the AI-powered CMS system.

### Main Sections

- **CONTENT**: Manage articles, pages, authors, categories
- **PLANNING**: Dashboard overview, content calendar
- **AUTOMATION**: Content factory, automation hub, review queue
- **CMS**: AI-powered content generation system
- **INSIGHTS**: Analytics, SEO health, experiments
- **MONETIZATION**: Products, affiliates, ads
- **SETTINGS**: Secure vault, configurations

---

## 📍 Navigation Structure

The left sidebar contains all navigation items organized by category:

### CONTENT Section
- **Articles**: List, edit, and create articles
- **Pillar Pages**: Manage pillar content
- **Authors**: Manage content authors
- **Categories**: Organize content by category
- **Tags**: Tag management
- **Media Library**: Upload and manage media files

### PLANNING Section
- **Dashboard**: Main admin page with overview stats
- **Content Calendar**: Schedule content publication

### AUTOMATION Section
- **Content Factory**: AI-powered bulk generation
- **Automation Hub**: Automation controls and settings
- **Review Queue**: Articles pending review

### CMS Section ⭐
- **CMS Dashboard**: Overview of CMS system
- **Budget**: Daily spending limits and usage
- **Generation**: Generate new content
- **Health**: System health monitoring
- **Scrapers**: Data scraper management

### INSIGHTS Section
- **Analytics**: Performance analytics
- **SEO Health**: SEO monitoring
- **Experiments**: A/B testing

### MONETIZATION Section
- **Product Catalog**: Manage products
- **Affiliates**: Affiliate link management
- **Ads**: Ad placement management

### SETTINGS Section
- **Secure Vault**: Secure storage

---

## 🎯 Main Dashboard (/admin)

The main dashboard shows:

### Top Stats Cards
- **Total Articles**: All articles count
- **Total Views**: Lifetime page views
- **Affiliate Clicks**: Total affiliate link clicks
- **Pending Reviews**: Reviews awaiting moderation

### System Status Cards
- **Scraper Network**: Data scraping status
- **AI Content Factory**: Content generation status
- **RSS Dynamics**: RSS feed status

### Tabs
- **Overview**: Content snapshot, system performance
- **Performance**: ContentPerformanceTracking component
- **Content**: Content statistics, category distribution
- **Automation**: Automation controls
- **Social**: Social media metrics
- **Trends**: Keyword trends

---

## 🎯 CMS Dashboard (/admin/cms)

### Quick Stats
- **System Health**: Overall health status
- **Budget Status**: Daily budget usage
- **Generation Ready**: Content generation status
- **Scrapers**: Scraper status

### Budget Overview
Shows daily budget limits and current usage:
- **Tokens**: AI API usage (text generation)
- **Images**: Image generation count
- **Cost USD**: Total spending limit per day

### Quick Links
- Budget Management
- Content Generation
- Health Monitor
- Scraper Management

---

## 💰 Budget Management (/admin/cms/budget)

### What It Shows
- Daily budget limits (tokens, images, cost)
- Current usage (how much spent today)
- Remaining budget
- Pause/resume controls

### How to Use
1. **Set Limits**: Configure daily spending limits
   - Max Tokens: Default 1,000,000
   - Max Images: Default 100
   - Max Cost USD: Default $50.00

2. **Monitor Usage**: Check current spending vs limits
   - Tokens Used vs Max Tokens
   - Images Used vs Max Images
   - Cost Spent vs Max Cost

3. **Control Operations**:
   - Click "Pause Budget" to stop all CMS operations
   - Click "Resume Budget" to continue
   - Budget resets daily at midnight UTC

---

## ⚡ Content Generation (/admin/cms/generation)

### What It Shows
- Canary test button (safe testing)
- Full generation button (production)
- BulkGenerationPanel (configure bulk generation)

### How to Use

#### For Testing (Canary Test)
1. Click "Canary Test" button
2. System generates 1 article with $5 budget limit
3. Check /admin/articles for new article
4. Review article quality

#### For Production
1. Configure bulk settings:
   - Total Articles: Number to generate
   - Batch Size: Articles per batch
   - Quality Threshold: Minimum quality score (0-100)
   
2. Click "Generate Content"
3. Monitor progress in articles list
4. Review generated articles

---

## ❤️ System Health (/admin/cms/health)

### What It Shows
- **Overall Status**: healthy/degraded/unhealthy
- **Agent Health**: Status of each agent
- **System Metrics**: Success rates, error counts
- **Error Details**: Error messages if any

### What It Means
- **Healthy**: All systems operational (green)
- **Degraded**: Some issues, still functional (yellow)
- **Unhealthy**: Critical problems, needs attention (red)

### How to Use
1. Check overall status badge
2. Review agent health cards
3. Check metrics for anomalies
4. Review errors if unhealthy
5. Click "Refresh" to update status

---

## 🔧 Scraper Management (/admin/cms/scrapers)

### What It Shows
- List of all scrapers (RSS, reviews, rates)
- Scraper status (active/idle/error)
- Last run time
- Success rate
- Execute/stop controls

### How to Use
1. View all available scrapers
2. Check status of each scraper
3. Click "Execute" to run manually
4. Monitor success rates
5. Review errors if any

---

## 📊 Content Generation Workflow

The CMS generates content through this process:

1. **Budget Check**: Verify budget availability
2. **Strategy**: Analyze trends, research keywords
3. **Content Generation**: Generate article content
4. **Image Generation**: Create featured images
5. **Quality Check**: Evaluate content quality (0-100)
6. **Risk Assessment**: Assess financial content risk
7. **Publish Decision**: Auto-publish if quality ≥ 80 AND risk low
8. **Tracking**: Monitor performance
9. **Economics**: Calculate ROI
10. **Feedback Loop**: Learn and optimize

---

## 📊 Metrics Explained

### Articles Metrics

| Metric | What It Means | Where to Find |
|--------|---------------|---------------|
| **Views** | Number of times article was viewed | Main admin stats, Performance tab |
| **Status** | draft = not published, published = live | Articles list |
| **AI Generated** | Whether content was AI-generated | Articles list (AI badge) |
| **Quality Score** | Content quality rating (0-100) | CMS internal |
| **Risk Score** | Risk level (0-100, higher = riskier) | CMS internal |
| **ROI** | Return on investment (revenue - cost) / cost | CMS internal |
| **Cost** | Generation cost (AI + images) | CMS internal |

### Product/Affiliate Metrics

| Metric | What It Means | Where to Find |
|--------|---------------|---------------|
| **Clicks** | Number of affiliate link clicks | Main admin stats |
| **Conversions** | Number of successful purchases | Main admin stats |
| **Conversion Rate** | (Conversions / Clicks) × 100 | Main admin (calculated) |
| **Revenue** | Total earnings from conversions | CMS internal |
| **Commission Rate** | Percentage per conversion | Product settings |

### CMS Budget Metrics

| Metric | What It Means | Where to Find |
|--------|---------------|---------------|
| **Max Tokens** | Daily token limit | /admin/cms/budget |
| **Tokens Used** | Tokens consumed today | /admin/cms/budget |
| **Max Images** | Daily image limit | /admin/cms/budget |
| **Images Used** | Images generated today | /admin/cms/budget |
| **Max Cost USD** | Daily spending limit | /admin/cms/budget |
| **Cost Spent USD** | Money spent today | /admin/cms/budget |
| **Is Paused** | Budget paused (stops operations) | /admin/cms/budget |

---

## 🎯 Quick Reference: Page Guide

| Page | What It Shows | When to Use |
|------|---------------|-------------|
| /admin | Main dashboard, overall stats | Daily monitoring, overview |
| /admin/cms | CMS overview, budget summary | CMS status check |
| /admin/cms/budget | Detailed budget management | Set/change budgets |
| /admin/cms/generation | Content generation controls | Generate new articles |
| /admin/cms/health | System health diagnostics | Troubleshooting |
| /admin/cms/scrapers | Scraper management | Manual data collection |
| /admin/articles | Article list/manage | Edit, publish articles |
| /admin/analytics | Detailed analytics | Performance analysis |
| /admin/products | Product catalog | Manage products |
| /admin/affiliates | Affiliate management | Manage affiliate links |

---

## ⚠️ Important Alerts

### Budget Alerts
- **Budget Exhausted**: All operations stop automatically
- **80% Budget Used**: Warning threshold (visual indicator)
- **Daily Reset**: Budget resets at midnight UTC

### Risk Alerts
- **High Risk Content**: Requires manual review before publishing
- **Critical Risk**: Blocked from auto-publish
- **Verification Conflicts**: Two AI models disagree (requires review)

### Health Alerts
- **Unhealthy Status**: System problems detected
- **Agent Failures**: Individual agent errors
- **High Error Rate**: Many failures detected

---

## 💡 Key Concepts

### Budget Governor
- **What**: Controls daily spending limits
- **Why**: Prevents overspending on AI APIs
- **How**: Stops operations when budget exhausted
- **Where**: /admin/cms/budget

### Content Generation Cycle
- **What**: Automated article creation process
- **Steps**: Strategy → Content → Images → Quality → Risk → Publish
- **Time**: 2-5 minutes per article
- **Where**: /admin/cms/generation

### Risk Assessment
- **What**: Evaluates financial content compliance
- **Score**: 0-100 (higher = riskier)
- **Impact**: High-risk = manual review required

### ROI Tracking
- **What**: Revenue vs cost calculation
- **Formula**: (Revenue - Cost) / Cost × 100
- **Purpose**: Identify profitable content

### Diversity Constraint
- **What**: Ensures 20% authority content
- **Purpose**: Long-term value preservation
- **Types**: Authority, Trend, Commercial

---

## 🚀 Common Tasks

### Generate Content
1. Go to /admin/cms/generation
2. Click "Canary Test" for safe testing
3. OR configure bulk settings and click "Generate Content"
4. Monitor in /admin/articles

### Set Budget
1. Go to /admin/cms/budget
2. Set limits (tokens, images, cost)
3. Click "Update Budget"
4. Monitor usage

### Check Health
1. Go to /admin/cms/health
2. Check overall status
3. Review agent health
4. Check metrics

### View Metrics
1. Main Dashboard: /admin (Performance tab)
2. CMS Dashboard: /admin/cms
3. Budget Page: /admin/cms/budget
4. Health Page: /admin/cms/health

---

**Last Updated:** 2026-04-02
**Version:** 1.0.0`;

const sections = [
    { id: 'overview', title: 'System Overview', icon: Sparkles },
    { id: 'navigation', title: 'Navigation', icon: FileText },
    { id: 'dashboard', title: 'Dashboard', icon: BarChart3 },
    { id: 'cms', title: 'CMS System', icon: Zap },
    { id: 'budget', title: 'Budget', icon: DollarSign },
    { id: 'generation', title: 'Generation', icon: Sparkles },
    { id: 'health', title: 'Health', icon: Activity },
    { id: 'scrapers', title: 'Scrapers', icon: Rss },
    { id: 'metrics', title: 'Metrics', icon: BarChart3 },
    { id: 'tasks', title: 'Common Tasks', icon: FileText },
];

export default function AdminGuidePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const filteredSections = sections.filter(section =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-2 flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-primary-400" />
                            User Guide
                        </h1>
                        <p className="text-muted-foreground dark:text-muted-foreground">Complete reference for Admin Dashboard and CMS system</p>
                    </div>
                </div>

                {/* Search Bar */}
                <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search guide..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 bg-white/5 border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground/70 dark:text-muted-foreground/70 focus:border-primary-500/50"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Table of Contents */}
                <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50">
                    <CardHeader className="border-b border-border/50 dark:border-border/50">
                        <CardTitle className="text-lg font-bold text-foreground dark:text-foreground flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary-400" />
                            Table of Contents
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                                            activeSection === section.id
                                                ? "bg-primary-500/10 border-primary-500/30 text-foreground dark:text-foreground"
                                                : "bg-white/5 border-border/50 dark:border-border/50 hover:border-primary-500/30 hover:bg-white/10 text-foreground/80 dark:text-foreground/80"
                                        )}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span className="font-medium">{section.title}</span>
                                        <ChevronRight className={cn(
                                            "w-4 h-4 ml-auto transition-transform",
                                            activeSection === section.id ? "rotate-90" : ""
                                        )} />
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Guide Content */}
                <Card className="bg-card dark:bg-card border-border/50 dark:border-border/50">
                    <CardHeader className="border-b border-border/50 dark:border-border/50">
                        <CardTitle className="text-lg font-bold text-foreground dark:text-foreground flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-primary-400" />
                            Complete Guide
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="max-w-none markdown-guide">
                            <ReactMarkdown
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground mt-8 mb-4 first:mt-0 flex items-center gap-2">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-2xl font-bold text-foreground dark:text-foreground mt-8 mb-4 border-b border-border/50 dark:border-border/50 pb-3 flex items-center gap-2">
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-xl font-bold text-foreground/90 dark:text-foreground/90 mt-6 mb-3 flex items-center gap-2">
                                            {children}
                                        </h3>
                                    ),
                                    h4: ({ children }) => (
                                        <h4 className="text-lg font-bold text-foreground/80 dark:text-foreground/80 mt-4 mb-2 flex items-center gap-2">
                                            {children}
                                        </h4>
                                    ),
                                    p: ({ children }) => (
                                        <p className="text-foreground/80 dark:text-foreground/80 mb-4 leading-relaxed">
                                            {children}
                                        </p>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc list-inside text-foreground/80 dark:text-foreground/80 mb-4 space-y-2 ml-4">
                                            {children}
                                        </ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside text-foreground/80 dark:text-foreground/80 mb-4 space-y-2 ml-4">
                                            {children}
                                        </ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="text-foreground/80 dark:text-foreground/80 leading-relaxed">
                                            {children}
                                        </li>
                                    ),
                                    code: ({ children, className }) => {
                                        const isInline = !className;
                                        return isInline ? (
                                            <code className="bg-white/10 text-primary-400 px-1.5 py-0.5 rounded text-sm font-mono">
                                                {children}
                                            </code>
                                        ) : (
                                            <code className="block bg-surface-darker/50 dark:bg-surface-darker/50 text-foreground/80 dark:text-foreground/80 p-4 rounded-xl border border-border/50 dark:border-border/50 my-4 overflow-x-auto text-sm font-mono">
                                                <pre className="whitespace-pre-wrap">{children}</pre>
                                            </code>
                                        );
                                    },
                                    table: ({ children }) => (
                                        <div className="overflow-x-auto my-6 rounded-xl border border-border/50 dark:border-border/50">
                                            <table className="min-w-full border-collapse">
                                                {children}
                                            </table>
                                        </div>
                                    ),
                                    thead: ({ children }) => (
                                        <thead className="bg-white/5">
                                            {children}
                                        </thead>
                                    ),
                                    th: ({ children }) => (
                                        <th className="border border-border dark:border-border px-4 py-3 text-left text-sm font-bold text-foreground dark:text-foreground bg-white/5">
                                            {children}
                                        </th>
                                    ),
                                    td: ({ children }) => (
                                        <td className="border border-border dark:border-border px-4 py-3 text-sm text-foreground/80 dark:text-foreground/80 bg-card/50 dark:bg-card/50">
                                            {children}
                                        </td>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-primary-500/50 pl-4 my-4 italic text-muted-foreground dark:text-muted-foreground bg-primary-500/5 py-2 rounded-r-xl">
                                            {children}
                                        </blockquote>
                                    ),
                                    a: ({ children, href }) => (
                                        <a href={href} className="text-primary-400 hover:text-primary-300 underline transition-colors">
                                            {children}
                                        </a>
                                    ),
                                    hr: () => (
                                        <hr className="border-border dark:border-border my-8" />
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="font-bold text-foreground dark:text-foreground">
                                            {children}
                                        </strong>
                                    ),
                                    em: ({ children }) => (
                                        <em className="italic text-foreground/80 dark:text-foreground/80">
                                            {children}
                                        </em>
                                    ),
                                }}
                            >
                                {guideContent}
                            </ReactMarkdown>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </AdminLayout>
    );
}
