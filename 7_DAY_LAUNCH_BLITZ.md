# 🚀 7-DAY LAUNCH BLITZ: InvestingPro MVP
**Target:** Functional MVP Launch by Day 7  
**Philosophy:** Ship fast, iterate faster  
**Quality Target:** 80% (Good enough to launch, perfect enough to iterate)

---

## 📋 Overview

**What We're Building:** Minimum Viable Product with:
- ✅ Core public pages working (homepage, product listings, calculators)
- ✅ Admin CMS functional (create/edit articles)
- ✅ Basic automation (1-2 pipelines)
- ✅ Essential integrations (analytics, email)
- ✅ Security basics (auth, rate limiting)
- ❌ Advanced features deferred to post-launch

**Team Setup:**
- **Solo Developer:** 80+ hours (10-12 hrs/day) - INTENSE
- **2 Developers:** 40-50 hours each - FEASIBLE
- **3 Developers:** 30-35 hours each - COMFORTABLE

---

## Day 1 (Tuesday): CRITICAL FIXES ONLY
**Goal:** Fix blockers that prevent ANY usage  
**Hours:** 10-12 hours  
**Focus:** Surgery, not polish

### Morning (4 hours)

#### 🔴 PRIORITY 1: Article Editor Crash (2 hours)
```typescript
// File: components/admin/ArticleEditor.tsx
// Line ~150-166 in onUpdate function

// Add null checks:
onUpdate: ({ editor }) => {
  const markdown = editor.storage.markdown?.getMarkdown?.() ?? '';
  const html = editor.getHTML?.() ?? '';
  
  // Add validation before string operations
  if (typeof markdown === 'string' && markdown.length > 0) {
    // Safe to use charAt() now
    onChange?.({ markdown, html });
  }
}
```

**Tasks:**
- [ ] Add null/undefined checks before ALL string operations
- [ ] Test: Edit 5 different articles (empty, short, long, with images, with tables)
- [ ] **Success:** Can edit without crashes

#### 🔴 PRIORITY 2: Dashboard NaN Values (1 hour)
```typescript
// File: app/admin/page.tsx
// Lines 78-87

const statsData = dashboardStats || {
  total_articles: 0,
  published_articles: 0,
  draft_articles: 0,
  total_views: 0,
  articles_this_month: 0,
  ai_generated_articles: 0,
  recent_activity: [],
  category_stats: []
};

// Lines 266-299: Add ?? 0 to all values
value: statsData?.total_articles ?? 0,
change: `+${statsData?.articles_this_month ?? 0} this month`,
value: Number(statsData?.total_views ?? 0).toLocaleString(),
```

**Tasks:**
- [ ] Find/replace all metric calculations with nullish coalescing
- [ ] **Success:** No NaN, no undefined displayed

#### 🔴 PRIORITY 3: Media Library (1 hour - SKIP for now)
**Decision:** Use external image URLs for MVP, build library later
- [ ] Update image components to accept URLs
- [ ] Use Unsplash API for placeholder images
- [ ] **Defer full media library to Week 2**

### Afternoon (6 hours)

#### 🟡 Security Essentials (3 hours)

**Task 1: Update Next.js (30 min)**
```bash
npm install next@latest react@latest react-dom@latest
npm run build  # Test build succeeds
```

**Task 2: Fix Auth Bypass (30 min)**
```typescript
// File: middleware.ts
// Replace lines 23-31 with:

const BYPASS_AUTH_IN_DEV = process.env.NODE_ENV === 'development' 
  && process.env.FORCE_AUTH !== 'true';

if (BYPASS_AUTH_IN_DEV) {
  console.warn('⚠️  AUTH BYPASSED - DEVELOPMENT MODE');
  return response;
}

// In .env.local: 
// FORCE_AUTH=true  (to test auth locally)
```

**Task 3: Add Basic CSP (1 hour)**
```typescript
// File: next.config.ts
// Add to headers:

{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co;"
},
{
  key: 'X-Frame-Options',
  value: 'DENY'
},
{
  key: 'X-Content-Type-Options',
  value: 'nosniff'
}
```

**Task 4: Input Sanitization (1 hour)**
```bash
npm install dompurify isomorphic-dompurify
```

```typescript
// File: components/admin/ArticleEditor.tsx
import DOMPurify from 'isomorphic-dompurify';

// Sanitize on save:
const sanitizedHtml = DOMPurify.sanitize(html);
```

#### 🟢 Quick Wins (3 hours)

**Remove Console.logs (30 min)**
```bash
# Create script: scripts/remove-console.js
const fs = require('fs');
const glob = require('glob');

glob('app/**/*.tsx', (err, files) => {
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Replace console.log with logger
    content = content.replace(/console\.log\(/g, '// console.log(');
    fs.writeFileSync(file, content);
  });
});

node scripts/remove-console.js
```

**Fix ESLint Errors (1 hour)**
```bash
npm run lint --fix
# Manually fix remaining errors
```

**Clean Root Directory (30 min)**
```bash
mkdir -p archive/sql-scripts
mv *.sql archive/sql-scripts/
mkdir -p archive/docs
mv IMPLEMENTATION_*.md archive/docs/
```

**Product Card CTA Color Fix (1 hour)**
```typescript
// File: components/ui/ProductCard.tsx
// Line 95: Change blue to brand green

<Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
  Apply Now
</Button>
```

### Evening (2 hours): Testing Day 1 Work

- [ ] Test article editing (10 scenarios)
- [ ] Test dashboard (empty DB, populated DB)
- [ ] Run build: `npm run build`
- [ ] Fix any build errors
- [ ] Commit all changes

**Day 1 Success:** Can edit articles, dashboard shows valid data, build succeeds

---

## Day 2 (Wednesday): CORE FEATURES
**Goal:** Complete missing essential features  
**Hours:** 10-12 hours

### Morning (5 hours)

#### 📝 Simplified Media Library (3 hours)

**Approach:** Basic upload only, no fancy features

```typescript
// File: app/admin/media/page.tsx (CREATE NEW)
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

export default function MediaLibrary() {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);

  const uploadImage = async (file: File) => {
    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Media Library</h1>
      <input 
        type="file" 
        onChange={(e) => {
          if (e.target.files?.[0]) {
            uploadImage(e.target.files[0]);
          }
        }}
      />
      {/* Basic image grid */}
      <div className="grid grid-cols-4 gap-4 mt-8">
        {images.map(img => (
          <img key={img} src={img} className="w-full h-32 object-cover" />
        ))}
      </div>
    </div>
  );
}
```

**Tasks:**
- [ ] Create basic upload page (no drag-drop yet)
- [ ] List uploaded images
- [ ] Copy URL button
- [ ] **Defer:** Search, edit, bulk operations

#### ⚙️ Settings Page Essentials (2 hours)

```typescript
// File: app/admin/settings/page.tsx (CREATE NEW)
'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';

export default function Settings() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Site Name</label>
          <Input defaultValue="InvestingPro" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Tagline</label>
          <Input defaultValue="India's Financial Comparison Platform" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Google Analytics ID</label>
          <Input placeholder="G-XXXXXXXXXX" />
        </div>
        
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}
```

**Defer:** Advanced settings, email config, social media settings

### Afternoon (5 hours)

#### 🎨 Public Pages Polish (3 hours)

**Task 1: Product Detail Pages (2 hours)**
```typescript
// File: app/credit-cards/[slug]/page.tsx (CREATE NEW)
// File: app/mutual-funds/[slug]/page.tsx (CREATE NEW)

// Use existing product card as template
// Add:
// - Full description
// - Features list
// - How to apply section
// - Related products
```

**Task 2: Homepage Final Touches (1 hour)**
- [ ] Update stats (use real numbers or realistic estimates)
- [ ] Fix any layout issues
- [ ] Test on mobile (Chrome DevTools)

#### 📋 Legal Pages (2 hours)

**Use Templates:**

```markdown
<!-- /app/privacy/page.tsx -->
# Privacy Policy - InvestingPro

Last Updated: December 31, 2025

## Data We Collect
- Email address (for newsletters)
- Usage analytics (Google Analytics)
- Cookies for preferences

## How We Use Data
- Improve user experience
- Send newsletters (with consent)
- Affiliate link tracking

## Your Rights
- Request data deletion: privacy@investingpro.in
- Unsubscribe from emails anytime

## Contact
Email: privacy@investingpro.in
```

**Create 3 pages:**
- [ ] `/privacy` - Privacy Policy
- [ ] `/terms` - Terms of Service
- [ ] `/disclaimer` - Financial Disclaimer (SEBI)

**Use ChatGPT/Claude to generate templates, customize for India**

### Evening (2 hours): Test Everything

- [ ] Test all public routes
- [ ] Test admin routes
- [ ] Mobile responsiveness check
- [ ] Fix critical visual bugs only

**Day 2 Success:** All core pages exist and work

---

## Day 3 (Thursday): API INTEGRATIONS
**Goal:** Connect essential external services  
**Hours:** 10-12 hours

### Morning (6 hours): Setup ALL APIs in Parallel

#### 🔧 API Setup Strategy
Work in this order (dependencies):

**1. Supabase Production (1 hour)**
- [ ] Create new Supabase project for production
- [ ] Copy schema from dev (use Supabase CLI or manual)
- [ ] Update `.env.production` with new credentials
- [ ] Test connection

**2. Google Analytics (30 min)**
- [ ] Create GA4 property: https://analytics.google.com
- [ ] Get Measurement ID: `G-XXXXXXXXXX`
- [ ] Add to `.env`: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXX`
- [ ] Verify: `components/common/Analytics.tsx` uses it
- [ ] Test: Use Google Tag Assistant Chrome extension

**3. Google Search Console (30 min)**
- [ ] Add property: investingpro.in (use "URL prefix" method)
- [ ] Verify: Upload HTML file to `/public/` OR DNS TXT record
- [ ] Submit sitemap: `/sitemap.xml`
- [ ] **Defer:** API integration for automated reports

**4. OpenAI API (1 hour)**
- [ ] Sign up: https://platform.openai.com
- [ ] Billing: Add $10-20 credit
- [ ] Set spending limit: $50/month
- [ ] Create API key
- [ ] Add to `.env`: `OPENAI_API_KEY=sk-...`
- [ ] Test:
```typescript
// Test file: scripts/test-openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function test() {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Write a 50-word article intro about SIP investing.' }],
    max_tokens: 100,
  });
  console.log(response.choices[0].message.content);
}

test();
```

**5. SendGrid Email (1 hour)**
- [ ] Sign up: https://sendgrid.com
- [ ] Create sender: noreply@investingpro.in
- [ ] Verify domain OR use single sender verification (email)
- [ ] Create API key
- [ ] Add to `.env`: `SENDGRID_API_KEY=SG...`
- [ ] Test:
```bash
npm install @sendgrid/mail
```
```typescript
// scripts/test-sendgrid.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const msg = {
  to: 'your-email@gmail.com',
  from: 'noreply@investingpro.in',
  subject: 'Test Email',
  text: 'InvestingPro is launching!',
};

sgMail.send(msg).then(() => console.log('✅ Email sent'));
```

**6. Sentry Error Tracking (1 hour)**
- [ ] Sign up: https://sentry.io (free tier)
- [ ] Create project: Next.js
- [ ] Install: `npx @sentry/wizard@latest -i nextjs`
- [ ] Follow wizard prompts
- [ ] Add to `.env`: `SENTRY_DSN=https://...`
- [ ] Test: Trigger error, verify in Sentry dashboard

**7. UptimeRobot (30 min)**
- [ ] Sign up: https://uptimerobot.com (free)
- [ ] Add monitor: investingpro.in (HTTP(s) monitor)
- [ ] Check interval: 5 minutes
- [ ] Alert contacts: Your email/SMS
- [ ] **Note:** Add AFTER domain is live (Day 6)

### Afternoon (4 hours): Basic Automation

#### 🤖 ONE Critical Automation: Daily Product Scraper

**Focus:** AMFI Mutual Fund NAVs (easiest to scrape)

```typescript
// File: lib/scraper/amfi-nav-scraper.ts
export async function scrapeAMFINAVs() {
  const url = 'https://www.amfiindia.com/spages/NAVAll.txt';
  const response = await fetch(url);
  const text = await response.text();
  
  // Parse format: Scheme Code;Scheme Name;NAV;Date
  const lines = text.split('\n');
  const navs = [];
  
  for (const line of lines) {
    if (!line.trim()) continue;
    const [code, name, nav, date] = line.split(';');
    if (code && nav) {
      navs.push({ code, name, nav: parseFloat(nav), date });
    }
  }
  
  // Store in database
  const supabase = createClient();
  await supabase.from('mutual_funds').upsert(navs, { 
    onConflict: 'code',
    ignoreDuplicates: false 
  });
  
  return navs.length;
}

// File: app/api/cron/scrape-navs/route.ts
export async function GET() {
  const count = await scrapeAMFINAVs();
  return Response.json({ success: true, count });
}
```

**Setup Vercel Cron (deployment-time):**
```json
// File: vercel.json
{
  "crons": [{
    "path": "/api/cron/scrape-navs",
    "schedule": "0 2 * * *"
  }]
}
```

**Tasks:**
- [ ] Implement AMFI scraper
- [ ] Test locally
- [ ] Create cron API route
- [ ] **Defer:** Other scrapers (RSS, trends) to post-launch

### Evening (2 hours): Integration Testing

- [ ] Verify all API keys in `.env.production`
- [ ] Test each integration manually
- [ ] Document any issues
- [ ] Create backup `.env` file (store securely, NOT in Git)

**Day 3 Success:** All essential APIs connected and tested

---

## Day 4 (Friday): TESTING & POLISH
**Goal:** Ensure quality before deployment  
**Hours:** 10-12 hours

### Morning (6 hours): Comprehensive Testing

#### 🧪 Manual Testing Checklist (3 hours)

**Public Site Flow:**
- [ ] Homepage loads (desktop)
- [ ] Homepage loads (mobile)
- [ ] Navigation works (all dropdowns)
- [ ] Product listing pages load
- [ ] Product detail pages load
- [ ] Calculators compute correctly (try 5 scenarios each)
- [ ] Footer links work
- [ ] Signup/Login flow (Google OAuth)

**Admin Flow:**
- [ ] Login works
- [ ] Dashboard displays metrics
- [ ] Can create new article
- [ ] Can edit existing article
- [ ] Can publish article
- [ ] Can upload image (media library)
- [ ] Categories management works
- [ ] Tags management works

**Edge Cases:**
- [ ] Empty search results
- [ ] Very long article (10,000 words)
- [ ] Article with 50 images
- [ ] Concurrent admin users (if possible)

#### ⚡ Performance Check (2 hours)

**Lighthouse Audit:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run on key pages
lighthouse http://localhost:3000 --view
lighthouse http://localhost:3000/calculators/sip --view
lighthouse http://localhost:3000/credit-cards --view
```

**Target Scores (Realistic for MVP):**
- Performance: 70+ (not 90+, optimize later)
- Accessibility: 85+
- Best Practices: 90+
- SEO: 95+

**Quick Fixes:**
- [ ] Add meta descriptions to all pages
- [ ] Fix images without alt text
- [ ] Reduce unused JavaScript (if easy)
- [ ] Enable text compression (Vercel automatic)

#### 🔒 Security Spot Check (1 hour)

**Quick Tests:**
```bash
# Dependency audit
npm audit
npm audit fix  # Fix non-breaking updates only
```

**Manual Checks:**
- [ ] Try SQL injection in search: `'; DROP TABLE--`
- [ ] Try XSS in article editor: `<script>alert('xss')</script>`
- [ ] Verify rate limiting on login (try 10 wrong passwords)
- [ ] Check admin routes require auth (logged out)

### Afternoon (4 hours): Content Preparation

#### 📝 Seed Content (4 hours)

**MVP Content Goal:** 20-30 Articles

**Strategy:** Use AI to generate, human to edit

```typescript
// Script: scripts/generate-seed-articles.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const topics = [
  'Best SIP Mutual Funds for Beginners in 2025',
  'How to Choose a Credit Card in India',
  'Top 5 Savings Accounts with Highest Interest Rates',
  'PPF vs ELSS: Which is Better for Tax Saving?',
  'How to Calculate EMI for Home Loans',
  // ... 25 more topics
];

async function generateArticle(topic: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a financial expert writing for Indian investors.' },
      { role: 'user', content: `Write a 1000-word article on: ${topic}` }
    ],
    max_tokens: 1500,
  });
  
  return response.choices[0].message.content;
}

// Run in batch, save as drafts
for (const topic of topics) {
  const content = await generateArticle(topic);
  // Save to database with status='draft'
}
```

**Workflow:**
1. Generate 30 articles with AI (1 hour)
2. Human review and edit 10 best (2 hours)
3. Publish 10 articles (30 min)
4. **Defer:** Remaining 20 to publish week 2

**Minimum Viable Content:**
- 10 comparison articles (Best Credit Cards, Best SIPs, etc.)
- 5 calculator guides (How to use X calculator)
- 5 educational (What is XIRR? What is CAGR?)

### Evening (2 hours): Pre-Deployment Prep

#### 📦 Build Production Bundle

```bash
npm run build
```

**Check for:**
- [ ] No build errors
- [ ] No TypeScript errors
- [ ] Bundle size reasonable (~500KB JS, acceptable for MVP)

#### 🔍 Create `.env.production`

```env
# Copy all API keys from testing
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXX
SENTRY_DSN=https://...
```

**Security Check:**
- [ ] `.env.production` in `.gitignore` ✅
- [ ] No API keys in Git history

**Day 4 Success:** Site tested, content ready, build successful

---

## Day 5 (Saturday): DEPLOYMENT
**Goal:** Live on the internet  
**Hours:** 8-10 hours

### Morning (4 hours): Domain & Hosting Setup

#### 🌐 Domain Purchase (30 min)

**Options:**
- GoDaddy India: https://godaddy.com/en-in
- Namecheap: https://namecheap.com
- BigRock (India): https://bigrock.in

**Purchase:** investingpro.in (~₹799/year)

#### ☁️ Vercel Deployment (2 hours)

**Step 1: Connect GitHub**
- [ ] Push all code to GitHub (private repo)
- [ ] Go to vercel.com
- [ ] Import repository

**Step 2: Configure Build**
```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

**Step 3: Environment Variables**
- [ ] Add ALL variables from `.env.production`
- [ ] Mark sensitive keys as "Secret"

**Step 4: Deploy**
- [ ] Click "Deploy"
- [ ] Wait 3-5 minutes
- [ ] Get deployment URL: `https://investingpro-xyz.vercel.app`

**Step 5: Test Deployment**
- [ ] Visit deployment URL
- [ ] Test critical flows (login, article view, calculator)
- [ ] Check Sentry for errors
- [ ] Check GA for page views

#### 🔗 Custom Domain (1.5 hours)

**In Vercel:**
- [ ] Go to Project Settings → Domains
- [ ] Add domain: `investingpro.in`
- [ ] Add www redirect: `www.investingpro.in` → `investingpro.in`

**In Domain Registrar (GoDaddy/Namecheap):**
- [ ] Add A record: `@` → `76.76.21.21` (Vercel IP)
- [ ] Add CNAME: `www` → `cname.vercel-dns.com`

**Wait for DNS Propagation (10-60 minutes)**
- [ ] Check: https://dnschecker.org
- [ ] Once propagated, visit `https://investingpro.in`
- [ ] SSL certificate auto-provisioned by Vercel

### Afternoon (4 hours): Post-Deployment Checks

#### ✅ Smoke Tests (1 hour)

**Critical Path Testing:**
```
1. Homepage → Product Category → Product Detail → Apply (external link)
2. Homepage → Calculator → Input values → See results
3. Admin → Login → Dashboard → Create Article → Publish
4. Newsletter signup → Confirmation email
```

**Test on Multiple Devices:**
- [ ] Desktop (Chrome)
- [ ] Mobile (iPhone Safari)
- [ ] Mobile (Android Chrome)

#### 📊 Analytics Verification (1 hour)

**Google Analytics:**
- [ ] Visit site, generate events
- [ ] Check GA4 Realtime view (should see yourself)
- [ ] Verify events firing:
  - page_view
  - calculator_use
  - product_click
  - newsletter_signup

**Sentry:**
- [ ] Trigger a test error (404 page, etc.)
- [ ] Verify appears in Sentry dashboard
- [ ] Set up alert rules (email on new error)

**Search Console:**
- [ ] Verify ownership confirmed
- [ ] Sitemap submitted and indexed
- [ ] Check Coverage report (may take 24-48 hours)

#### 🔄 Setup Cron Jobs (1 hour)

**Vercel Cron Configuration:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/scrape-navs",
      "schedule": "0 2 * * *"
    }
  ]
}
```

- [ ] Push `vercel.json` to Git
- [ ] Redeploy
- [ ] Test cron: Manually visit `/api/cron/scrape-navs`
- [ ] Check database for updated NAVs

#### 📧 Email Setup (1 hour)

**SendGrid Domain Authentication:**
- [ ] Domain authentication wizard
- [ ] Add DNS records (CNAME for SPF, DKIM)
- [ ] Wait for verification (~10-30 min)
- [ ] Send test email from `noreply@investingpro.in`
- [ ] Check inbox + spam folder

**Test Flows:**
- [ ] Signup confirmation email
- [ ] Password reset email
- [ ] Newsletter subscription

### Evening (2 hours): Final Polish

#### 🎨 Visual Fixes

**Homepage:**
- [ ] Update hero stats with real numbers
- [ ] Fix any broken images
- [ ] Ensure mobile menu works

**Product Pages:**
- [ ] Add product images (use Unsplash placeholders if no partner images)
- [ ] Add "Last Updated" dates
- [ ] Add disclaimers

**Admin:**
- [ ] Update branding (logo, colors)
- [ ] Fix any UI bugs noticed during testing

#### 📱 Social Media Placeholder Accounts

**Create Basic Profiles (15 min each):**
- [ ] Facebook Page: InvestingPro India
- [ ] Twitter: @InvestingProIN
- [ ] LinkedIn: InvestingPro

**Add Links:**
- [ ] Footer social icons link to correct profiles
- [ ] Add social meta tags for sharing:
```typescript
// app/layout.tsx or page-specific metadata
export const metadata = {
  openGraph: {
    title: 'InvestingPro - Compare Financial Products',
    description: 'India\'s smartest way to compare mutual funds, credit cards, and loans.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@InvestingProIN',
  },
};
```

**Day 5 Success:** Site is LIVE at investingpro.in

---

## Day 6 (Sunday): MONITORING & RECOVERY
**Goal:** Ensure stability, fix critical issues  
**Hours:** 6-8 hours (lighter day)

### Morning (3 hours): Monitor & Fix

#### 📈 Check All Dashboards (1 hour)

**Rotation Every Hour:**
1. **Vercel Analytics** - Traffic, errors, performance
2. **Google Analytics** - Realtime visitors, popular pages
3. **Sentry** - New errors (fix critical ones immediately)
4. **Supabase** - Database health, query performance
5. **UptimeRobot** - Uptime percentage (should be 100%)

**Create Alerts:**
- [ ] Sentry: Email on new error
- [ ] UptimeRobot: Email/SMS on downtime
- [ ] Vercel: Email on deployment failure

#### 🐛 Bug Triage (2 hours)

**Categorize Issues:**

**P0 (Fix Immediately):**
- Site completely down
- Cannot login
- Payment/transaction failures
- Data corruption

**P1 (Fix Today):**
- Broken calculator
- Major visual bug on mobile
- Slow page loads (>5s)
- Console errors visible to users

**P2 (Fix This Week):**
- Minor visual issues
- Non-critical features broken
- UX improvements

**P3 (Backlog):**
- Nice-to-have features
- Future optimizations

**Action:**
- [ ] Fix all P0 bugs immediately
- [ ] Fix P1 bugs within 6 hours
- [ ] Document P2/P3 for later

### Afternoon (3 hours): Growth Prep

#### 📣 Soft Launch Announcement (2 hours)

**Create Launch Post Template:**
```markdown
🚀 Introducing InvestingPro - India's Smart Financial Comparison Platform

We're on a mission to make financial product comparison transparent, 
unbiased, and fast.

✅ Compare 500+ mutual funds, credit cards, and loans
✅ Free financial calculators (SIP, EMI, Tax)
✅ Expert ratings and user reviews
✅ Completely unbiased recommendations

Visit: https://investingpro.in

#FinTech #InvestingIndia #PersonalFinance
```

**Channels:**
- [ ] LinkedIn (personal profile + company page)
- [ ] Twitter (@InvestingProIN)
- [ ] Facebook Page
- [ ] Family & Friends WhatsApp (personal network)
- [ ] Reddit: r/IndiaInvestments (as helpful resource, not spam)

**Defer:** Paid ads, influencer outreach, PR to Week 2

#### 📧 Newsletter Welcome Series (1 hour)

**Using ConvertKit/Mailchimp:**
- [ ] Sign up for ConvertKit (free trial)
- [ ] Create "Welcome" sequence:
  - Email 1: Welcome + introduce platform
  - Email 2: How to use calculators (link to guides)
  - Email 3: Featured article of the week
  - Email 4: Invite to follow social media

**Or Simple Approach:**
- [ ] Create email template in SendGrid
- [ ] Manually send to first 50 subscribers
- [ ] Automate later

### Evening (1-2 hours): Backup & Documentation

#### 💾 Backup Everything

- [ ] Export Supabase database (SQL dump)
- [ ] Backup `.env.production` (secure location)
- [ ] Export analytics settings
- [ ] Screenshot all dashboards
- [ ] Git tag release: `v1.0.0-mvp`

#### 📚 Create Runbook

```markdown
# InvestingPro Operations Runbook

## Daily Tasks
- [ ] Check Sentry for new errors
- [ ] Review GA traffic
- [ ] Verify cron jobs ran (NAV scraper)
- [ ] Respond to user emails

## Weekly Tasks
- [ ] Publish 3-5 new articles
- [ ] Review product data accuracy
- [ ] Check competitor sites for updates
- [ ] Update top-performing articles

## Emergency Contacts
- Vercel Support: support@vercel.com
- Supabase: support@supabase.io
- Your phone: +91-XXX-XXX-XXXX

## Rollback Plan
If site is broken:
1. Vercel → Deployments → Redeploy previous version
2. Check Sentry for error details
3. Fix in dev, redeploy

## Database Restore
If data corrupted:
1. Supabase → Database → Point-in-time recovery
2. Restore to last known good state
```

**Day 6 Success:** Site stable, monitoring in place, ready for users

---

## Day 7 (Monday): ITERATE & OPTIMIZE
**Goal:** Quick improvements based on real usage  
**Hours:** 6-8 hours

### Morning (4 hours): Quick Wins

#### 🎨 Visual Polish Based on Testing (2 hours)

**Common Issues to Address:**
- [ ] Mobile menu not closing after click
- [ ] Buttons too small on mobile
- [ ] Images not loading on slow connections
- [ ] Footer overlapping content

**Tools:**
- Chrome DevTools (mobile emulation)
- Lighthouse (accessibility)
- PageSpeed Insights

#### ⚡ Performance Quick Wins (2 hours)

**Low-Hanging Fruit:**

1. **Image Optimization:**
```typescript
// Replace <img> with Next.js Image
import Image from 'next/image';

<Image 
  src="/product.jpg" 
  width={300} 
  height={200} 
  alt="Product"
  loading="lazy"
/>
```

2. **Add Loading States:**
```typescript
// Add to calculators, product listings
{isLoading ? <Skeleton /> : <ProductList />}
```

3. **Cache API Responses:**
```typescript
// React Query configuration (already exists)
queryClient.setDefaultOptions({
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
  },
});
```

### Afternoon (3 hours): Content & SEO

#### 📝 Optimize Top 5 Articles (2 hours)

**Use Google Search Console to identify:**
- Articles with impressions but low CTR
- Articles ranking 11-20 (easy to boost to page 1)

**Optimizations:**
- [ ] Improve title tags (add year, numbers)
- [ ] Add internal links
- [ ] Update with fresh data
- [ ] Add comparison tables
- [ ] Optimize images (alt text, compress)

**Before:** "Best Credit Cards"  
**After:** "10 Best Credit Cards in India 2025 (Expert Tested)"

#### 🔍 SEO Checklist for All Pages (1 hour)

```typescript
// Verify metadata on key pages:
export const metadata = {
  title: 'Best SIP Mutual Funds 2025 - Expert Ratings | InvestingPro',
  description: 'Compare top SIP mutual funds with our expert ratings. Updated NAVs, returns, and fees. Start investing smarter today.',
  keywords: 'sip mutual funds, best sip, mutual fund returns, india investing',
  openGraph: {
    title: 'Best SIP Mutual Funds 2025',
    description: 'Expert-rated SIP funds with live NAV data',
    images: ['/og-sip-funds.png'],
  },
};
```

- [ ] Check 10 most important pages
- [ ] Ensure unique titles/descriptions
- [ ] No missing meta tags
- [ ] Proper heading hierarchy (H1 > H2 > H3)

### Evening (1-2 hours): Launch Retrospective

#### 📊 Week 1 Metrics Review

**Traffic:**
- Total visitors: ___
- Top pages: ___
- Traffic sources: ___
- Bounce rate: ___

**Engagement:**
- Newsletter signups: ___
- Calculator usage: ___
- Product clicks: ___
- Time on site: ___

**Technical:**
- Uptime: ___ % (target 99.9%)
- Errors: ___ (target <10)
- P90 page load: ___ seconds (target <3s)

#### 📝 Create Week 2 Plan

**Focus Areas:**
1. Content production (10 more articles)
2. Advanced automation (RSS, trends)
3. User feedback collection
4. SEO improvements
5. Performance optimization

**New Features to Add:**
- Comment system
- User accounts (save comparisons)
- Advanced filters on product pages
- Email notifications

**Day 7 Success:** MVP launched, live, and improving

---

## 🎯 SUCCESS CRITERIA FOR 7-DAY MVP

### ✅ Must-Have (Cannot Launch Without)

- [x] Homepage loads without errors
- [x] At least 10 published articles
- [x] Admin can create/edit articles
- [x] Calculators work correctly
- [x] Product listing pages functional
- [x] SSL certificate (HTTPS)
- [x] Google Analytics tracking
- [x] Privacy policy + disclaimers
- [x] Mobile responsive (basic)
- [x] No critical bugs (P0)

### ⭐ Should-Have (Launch with These)

- [x] 20-30 published articles
- [x] Product detail pages
- [x] Basic automation (1 scraper)
- [x] Error monitoring (Sentry)
- [x] Email notifications
- [x] Social media profiles set up
- [x] Newsletter signup working
- [x] Search Console configured

### 🌟 Nice-to-Have (Post-Launch Week 2)

- [ ] 100+ articles
- [ ] User accounts
- [ ] Advanced filters
- [ ] AI auto-publishing
- [ ] Affiliate tracking dashboard
- [ ] A/B testing
- [ ] Advanced analytics

---

## 💰 ESTIMATED COSTS (First Month)

| Service | Cost | Required? |
|---------|------|-----------|
| Domain (investingpro.in) | ₹799/year | ✅ Yes |
| Vercel Hosting | Free tier | ✅ Yes |
| Supabase | Free tier | ✅ Yes |
| OpenAI API | ~₹1,500 ($20) | ✅ Yes |
| SendGrid | ₹1,200 ($15) | ✅ Yes |
| Sentry | Free tier | ✅ Yes |
| Google Services | Free | ✅ Yes |
| UptimeRobot | Free | ✅ Yes |
| **TOTAL MONTH 1** | **~₹3,500 ($45)** | |

**Month 2-3:** Add ConvertKit (₹2,400) + paid ads (₹5,000+)

---

## 🚨 RISK MITIGATION

### What Could Go Wrong?

**Risk 1: Can't fix editor crash**
- **Mitigation:** Use WordPress export → Markdown converter
- **Backup:** Write articles in Google Docs, paste HTML

**Risk 2: API quota exceeded**
- **Mitigation:** Set spending limits on ALL paid APIs
- **Backup:** Manual content creation for week 1

**Risk 3: Deployment fails**
- **Mitigation:** Test build locally BEFORE deploying
- **Backup:** Use Netlify or Railway as alternative

**Risk 4: Domain not available**
- **Mitigation:** Have 5 backup names ready
- **Options:** financepro.in, smartinvest.in, comparepro.in

**Risk 5: Burnout (working 10+ hours/day)**
- **Mitigation:** Take 30-min breaks every 2 hours
- **Backup:** Extend to 10-day timeline if needed

---

## 📞 RESOURCES & HELP

### Quick Links
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **OpenAI API:** https://platform.openai.com/docs

### Community Support
- **Stack Overflow:** Tag questions with `nextjs`, `supabase`
- **Vercel Discord:** https://vercel.com/discord
- **Reddit:** r/nextjs, r/webdev

### Emergency Contacts
- **Your Email:** (for password resets, etc.)
- **Domain Registrar Support**
- **Payment Gateway Support**

---

## ✅ FINAL CHECKLIST BEFORE GOING LIVE

**Pre-Launch (Day 5 Morning):**
- [ ] All critical bugs fixed
- [ ] Build succeeds locally
- [ ] Environment variables ready
- [ ] Content ready (minimum 10 articles)
- [ ] Legal pages complete
- [ ] Analytics installed
- [ ] Error monitoring configured

**During Launch (Day 5 Afternoon):**
- [ ] Domain connected
- [ ] SSL certificate active
- [ ] Production deploy successful
- [ ] Smoke tests passed
- [ ] No critical errors in Sentry

**Post-Launch (Day 5 Evening):**
- [ ] Monitoring all green
- [ ] Real users can access site
- [ ] Newsletter signup works
- [ ] Calculators functional
- [ ] Admin panel accessible

---

## 🎉 LAUNCH DAY ANNOUNCEMENT

**Sample LinkedIn Post:**

```
🚀 After 7 intense days of building, I'm thrilled to launch InvestingPro - 
India's first truly unbiased financial comparison platform!

What makes us different:
✅ 100% transparent - we show you how we make money
✅ AI-powered insights - personalized recommendations
✅ Live data - real-time mutual fund NAVs, interest rates
✅ Free tools - SIP calculator, EMI calculator, tax calculator

We're starting with 30 hand-curated articles comparing 500+ financial 
products - and we're adding more every day.

This is just the beginning. Our goal: Help 10 million Indians make 
smarter financial decisions by 2026.

Check it out: https://investingpro.in

Feedback welcome! 🙏

#FinTech #InvestingIndia #BuildInPublic #MVP
```

---

## 📈 WEEK 2 PRIORITIES (POST-LAUNCH)

1. **Monitor & Fix** (Days 8-9)
   - Fix any bugs reported by users
   - Optimize slow pages
   - Improve mobile UX

2. **Content Scale** (Days 10-12)
   - Publish 15 more articles
   - Implement RSS automation
   - Set up social auto-posting

3. **SEO & Growth** (Days 13-14)
   - Submit to directories (ProductHunt, BetaList)
   - Pitch to finance bloggers
   - Start basic SEO optimizations

**By End of Week 2:** 50+ articles, 1,000+ visitors, stable platform

---

**Let's ship this! 🚀**

**Remember:** Perfect is the enemy of done. Launch at 80%, iterate to 100%.

**Your mantra this week:** "Ship > Polish"
