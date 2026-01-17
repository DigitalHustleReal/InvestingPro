# CMS Operational & Automation Implementation Plan
**Based on:** CMS Operational Audit Report  
**Goal:** Make CMS production-ready with full automation  
**Timeline:** 3-4 weeks (phased approach)

---

## EXECUTIVE SUMMARY

**Current State:** ⚠️ Not production-ready (2 blocking build errors, multiple automation gaps)  
**Target State:** ✅ Fully operational, automated CMS with monitoring, versioning, and self-healing capabilities  
**Critical Path:** Fix build errors → Implement API routes → Add automation → Deploy monitoring

---

## PHASE 1: CRITICAL FIXES (Week 1, Days 1-3)
**Goal:** Unblock production deployment

### 1.1 Fix Remaining Build Errors (Priority: CRITICAL)

#### Task 1.1.1: Create Admin Article API Routes
**Time:** 4-6 hours  
**Files to Create:**
- `app/api/admin/articles/[id]/route.ts` (GET, PUT, DELETE)
- `app/api/admin/articles/route.ts` (GET list, POST create)

**Implementation:**
```typescript
// app/api/admin/articles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { articleService } from '@/lib/cms/article-service';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const article = await articleService.getById(params.id);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    logger.error('Error fetching article', error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updated = await articleService.saveArticle(
      params.id,
      body.content,
      body.metadata
    );

    return NextResponse.json(updated);
  } catch (error) {
    logger.error('Error updating article', error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await articleService.deleteArticle(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting article', error as Error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Files to Update:**
- `app/admin/articles/[id]/edit/page.tsx` - Replace `articleService` calls with API calls
- `app/admin/articles/[id]/edit-refactored/page.tsx` - Same fix

**Test Cases:**
- [ ] GET article by ID returns correct data
- [ ] PUT updates article successfully
- [ ] DELETE removes article
- [ ] Unauthorized requests return 401
- [ ] Build completes without errors

#### Task 1.1.2: Fix Optional AWS SDK Dependency
**Time:** 30 minutes  
**File:** `scripts/archive-old-data.ts`

**Fix:**
```typescript
// Wrap in try-catch and make optional
let S3Client: any;
let PutObjectCommand: any;
try {
  const awsSdk = require('@aws-sdk/client-s3');
  S3Client = awsSdk.S3Client;
  PutObjectCommand = awsSdk.PutObjectCommand;
} catch (e) {
  console.warn('AWS SDK not available, archive feature disabled');
}
```

**Or add to devDependencies:**
```json
"devDependencies": {
  "@aws-sdk/client-s3": "^3.x.x"
}
```

### 1.2 Verify Build Completes
**Time:** 1 hour  
**Actions:**
- [ ] Run `npm run build` - should complete successfully
- [ ] Run `npm run type-check` - no TypeScript errors
- [ ] Run `npm run lint` - no linting errors
- [ ] Document any remaining warnings

**Success Criteria:** Build completes with 0 errors, warnings acceptable

---

## PHASE 2: CORE AUTOMATION (Week 1, Days 4-5 + Week 2)
**Goal:** Implement critical automation features

### 2.1 Article Versioning & Audit Trail (Priority: HIGH)

#### Task 2.1.1: Create Versioning Schema
**Time:** 2 hours  
**File:** `lib/supabase/migrations/add_article_versioning.sql`

```sql
-- Article Versions Table
CREATE TABLE IF NOT EXISTS article_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    
    -- Content snapshot
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    body_markdown TEXT,
    body_html TEXT,
    
    -- Metadata snapshot
    category TEXT,
    tags TEXT[],
    seo_title TEXT,
    seo_description TEXT,
    featured_image TEXT,
    
    -- Change tracking
    change_summary TEXT,
    changed_fields TEXT[],
    
    -- Audit
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(article_id, version)
);

-- Indexes
CREATE INDEX idx_article_versions_article_id ON article_versions(article_id);
CREATE INDEX idx_article_versions_created_at ON article_versions(created_at);

-- Function to auto-increment version
CREATE OR REPLACE FUNCTION get_next_article_version(article_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    next_version INTEGER;
BEGIN
    SELECT COALESCE(MAX(version), 0) + 1
    INTO next_version
    FROM article_versions
    WHERE article_id = article_uuid;
    RETURN next_version;
END;
$$ LANGUAGE plpgsql;

-- Audit Log Table
CREATE TABLE IF NOT EXISTS article_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'publish', 'archive', 'restore')),
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_log_article_id ON article_audit_log(article_id);
CREATE INDEX idx_audit_log_created_at ON article_audit_log(created_at);
```

#### Task 2.1.2: Implement Versioning Service
**Time:** 4-6 hours  
**File:** `lib/cms/article-versioning.ts`

**Features:**
- Auto-create version on article update
- Compare versions to detect changes
- Rollback to previous version
- Generate change summaries

**Integration Points:**
- Update `articleService.saveArticle()` to create version
- Update `articleService.publishArticle()` to create version
- Add version comparison utility

#### Task 2.1.3: Add Version UI Components
**Time:** 3-4 hours  
**Files:**
- Update `components/admin/ArticleVersionHistory.tsx` to use real backend
- Add version comparison view
- Add rollback confirmation dialog

**Test Cases:**
- [ ] Version created on every save
- [ ] Version history displays correctly
- [ ] Rollback restores previous version
- [ ] Change summary shows differences

### 2.2 Automated Scraper Pipeline (Priority: HIGH)

#### Task 2.2.1: Implement Credit Card Scraper
**Time:** 8-12 hours  
**File:** `scripts/scrapers/credit-card-scraper.ts`

**Implementation Steps:**
1. Install Playwright: `npm install playwright`
2. Create scraper for each bank:
   - HDFC Bank
   - SBI Card
   - ICICI Bank
   - Axis Bank
3. Add rate limiting (1 request per 2 seconds)
4. Add retry logic (3 attempts with exponential backoff)
5. Add data validation against schema
6. Add change detection (compare with previous run)

**Code Structure:**
```typescript
import { chromium } from 'playwright';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';

interface CreditCard {
  name: string;
  provider: string;
  annual_fee: number;
  rewards_rate: number;
  // ... other fields
}

async function scrapeHDFC(): Promise<CreditCard[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.hdfcbank.com/personal/pay/cards/credit-cards', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Extract card data using selectors
    const cards = await page.evaluate(() => {
      // Scraping logic
    });
    
    return cards;
  } finally {
    await browser.close();
  }
}
```

#### Task 2.2.2: Add Scraper Monitoring & Alerts
**Time:** 4-6 hours  
**Files:**
- `lib/scraper/scraper-monitor.ts` - Track scraper runs, success rates
- `app/api/cron/scraper-health-check/route.ts` - Health check endpoint
- Update scraper dashboard with real-time status

**Features:**
- Track last run time
- Track success/failure rates
- Alert on consecutive failures
- Alert on data anomalies

#### Task 2.2.3: Implement Data Change Detection
**Time:** 3-4 hours  
**File:** `lib/scraper/change-detector.ts`

**Features:**
- Compare current scrape with previous
- Detect new products
- Detect price/rate changes
- Generate change reports
- Auto-update articles referencing changed products

### 2.3 AI Cost Tracking & Budget Management (Priority: MEDIUM)

#### Task 2.3.1: Implement Per-Article Cost Attribution
**Time:** 4-6 hours  
**Files:**
- `lib/ai/cost-tracker.ts` - Track costs per operation
- Update `lib/ai/content-pipeline.ts` to log costs
- Create `ai_costs` table in database

**Schema:**
```sql
CREATE TABLE ai_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id),
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    operation TEXT NOT NULL, -- 'generate', 'proofread', 'translate'
    input_tokens INTEGER,
    output_tokens INTEGER,
    cost_usd NUMERIC(10, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Task 2.3.2: Enhance Budget Dashboard
**Time:** 3-4 hours  
**File:** `components/admin/CostDashboard.tsx`

**Features:**
- Real-time cost tracking
- Budget alerts (email/Slack)
- Cost breakdown by article, provider, operation
- Projected monthly costs
- Cost optimization suggestions

#### Task 2.3.3: Implement Budget Governor
**Time:** 4-6 hours  
**File:** `components/admin/BudgetGovernorPanel.tsx`

**Features:**
- Set daily/monthly budgets
- Auto-pause AI operations when budget exceeded
- Alert thresholds (80%, 90%, 100%)
- Emergency stop functionality

---

## PHASE 3: SECURITY & ACCESS CONTROL (Week 2, Days 3-5)
**Goal:** Implement role-based access and security hardening

### 3.1 Role-Based Access Control (Priority: HIGH)

#### Task 3.1.1: Create User Roles System
**Time:** 4-6 hours  
**Files:**
- `lib/auth/roles.ts` - Role definitions and permissions
- `lib/supabase/migrations/add_user_roles.sql` - Database schema

**Schema:**
```sql
-- User Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'author', 'viewer')),
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own role"
ON user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON user_roles FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);
```

#### Task 3.1.2: Implement Permission Middleware
**Time:** 3-4 hours  
**File:** `lib/middleware/permissions.ts`

**Features:**
- Check user role before API operations
- Protect admin routes
- Protect article edit/delete operations
- Log permission denials

#### Task 3.1.3: Update RLS Policies
**Time:** 2-3 hours  
**File:** `lib/supabase/migrations/update_rls_policies.sql`

**Changes:**
- Replace generic "authenticated" with role checks
- Add editor vs admin distinction
- Add viewer read-only access

### 3.2 PII Encryption (Priority: MEDIUM)

#### Task 3.2.1: Encrypt Sensitive Fields
**Time:** 4-6 hours  
**Files:**
- `lib/encryption/field-encryption.ts` - Encryption utilities
- Update article service to encrypt `author_email`
- Update newsletter service to encrypt subscriber emails

**Implementation:**
```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32-byte key
const ALGORITHM = 'aes-256-gcm';

export function encryptField(value: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptField(encrypted: string): string {
  const [ivHex, authTagHex, encryptedData] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

#### Task 3.2.2: Migrate Existing Data
**Time:** 2-3 hours  
**File:** `scripts/migrate-encrypt-pii.ts`

**Actions:**
- Encrypt existing `author_email` fields
- Encrypt existing newsletter subscriber emails
- Verify decryption works correctly

### 3.3 CSRF Protection Enhancement (Priority: MEDIUM)

#### Task 3.3.1: Add CSRF Tokens to Admin Forms
**Time:** 2-3 hours  
**Files:**
- `lib/middleware/csrf.ts` - CSRF token generation/validation
- Update admin forms to include CSRF tokens
- Update API routes to validate tokens

---

## PHASE 4: MONITORING & OPERATIONS (Week 3)
**Goal:** Full observability and operational readiness

### 4.1 Performance Monitoring (Priority: MEDIUM)

#### Task 4.1.1: Add Web Vitals Tracking
**Time:** 2-3 hours  
**Files:**
- `components/analytics/WebVitals.tsx` - Track Core Web Vitals
- Integrate with Vercel Analytics or Google Analytics
- Create dashboard for performance metrics

#### Task 4.1.2: API Latency Monitoring
**Time:** 3-4 hours  
**Files:**
- `lib/middleware/api-timing.ts` - Track API response times
- Store metrics in database or send to monitoring service
- Create alerts for slow endpoints (>2s)

#### Task 4.1.3: Build Size Analysis
**Time:** 1-2 hours  
**Actions:**
- Run `npm run analyze` after build
- Document bundle sizes
- Identify optimization opportunities
- Set up CI check for bundle size limits

### 4.2 Automated Testing & CI/CD (Priority: HIGH)

#### Task 4.2.1: Add Integration Tests
**Time:** 6-8 hours  
**Files:**
- `__tests__/integration/cms-workflow.test.ts` - Full CMS workflow
- `__tests__/integration/scraper-pipeline.test.ts` - Scraper tests
- `__tests__/integration/ai-generation.test.ts` - AI workflow tests

**Test Coverage:**
- [ ] Article create → edit → publish → archive workflow
- [ ] Scraper runs and updates data
- [ ] AI generation creates valid articles
- [ ] Cache invalidation works correctly
- [ ] Versioning creates versions on updates

#### Task 4.2.2: Set Up CI/CD Pipeline
**Time:** 4-6 hours  
**File:** `.github/workflows/ci.yml` or Vercel configuration

**Pipeline Steps:**
1. Install dependencies
2. Type check (`npm run type-check`)
3. Lint (`npm run lint`)
4. Run tests (`npm test`)
5. Build (`npm run build`)
6. Deploy to staging (if tests pass)
7. Run E2E tests on staging
8. Deploy to production (manual approval)

#### Task 4.2.3: Load Testing
**Time:** 4-6 hours  
**Tools:** k6, Artillery, or Playwright

**Test Scenarios:**
- [ ] Homepage load (100 concurrent users)
- [ ] Article page load (50 concurrent users)
- [ ] Admin dashboard load (10 concurrent users)
- [ ] API endpoint stress test
- [ ] Cache effectiveness test

### 4.3 Operations Runbook (Priority: MEDIUM)

#### Task 4.3.1: Create Operations Documentation
**Time:** 4-6 hours  
**File:** `docs/OPERATIONS_RUNBOOK.md`

**Sections:**
1. **Deployment Process**
   - Pre-deployment checklist
   - Deployment steps
   - Post-deployment verification
   - Rollback procedure

2. **Database Operations**
   - Migration process
   - Backup/restore procedures
   - Performance tuning
   - Troubleshooting

3. **Cache Management**
   - Clearing cache
   - Cache warming
   - Monitoring cache hit rates

4. **Emergency Procedures**
   - Emergency stop automation
   - Database rollback
   - Incident response

5. **Monitoring & Alerts**
   - Alert configuration
   - On-call procedures
   - Escalation paths

#### Task 4.3.2: Set Up Alerting
**Time:** 3-4 hours  
**Integration:** Email, Slack, PagerDuty (optional)

**Alerts to Configure:**
- Build failures
- Scraper failures (3 consecutive)
- AI cost threshold exceeded
- API latency > 2s
- Error rate > 1%
- Database connection failures
- Cache hit rate < 80%

---

## PHASE 5: ADVANCED AUTOMATION (Week 4)
**Goal:** Self-healing and intelligent automation

### 5.1 Automated Content Refresh (Priority: MEDIUM)

#### Task 5.1.1: Content Health Monitoring
**Time:** 4-6 hours  
**File:** `lib/automation/content-health.ts`

**Features:**
- Detect stale articles (>6 months old)
- Detect outdated product data
- Auto-flag for review/update
- Generate update suggestions

#### Task 5.1.2: Automated Content Updates
**Time:** 6-8 hours  
**File:** `lib/automation/auto-refresh.ts`

**Features:**
- Auto-update product prices/rates when scraped data changes
- Auto-update article statistics (views, engagement)
- Auto-generate follow-up articles based on trends
- Auto-optimize SEO based on performance

### 5.2 Intelligent Scraper Scheduling (Priority: LOW)

#### Task 5.2.1: Adaptive Scraper Frequency
**Time:** 4-6 hours  
**File:** `lib/scraper/adaptive-scheduling.ts`

**Logic:**
- Increase frequency if changes detected
- Decrease frequency if no changes
- Skip runs if source unavailable
- Retry failed scrapes intelligently

### 5.3 Automated Quality Assurance (Priority: MEDIUM)

#### Task 5.3.1: Content Quality Checks
**Time:** 6-8 hours  
**File:** `lib/automation/quality-checks.ts`

**Checks:**
- SEO score validation
- Readability score
- Fact-checking (cross-reference with scraped data)
- Citation validation
- Image optimization
- Broken link detection

**Actions:**
- Auto-fix minor issues
- Flag major issues for review
- Generate quality reports

---

## IMPLEMENTATION CHECKLIST

### Week 1
- [ ] **Day 1-2:** Fix build errors (API routes)
- [ ] **Day 3:** Verify build, test fixes
- [ ] **Day 4-5:** Implement article versioning (schema + service)

### Week 2
- [ ] **Day 1-2:** Complete versioning UI, implement credit card scraper
- [ ] **Day 3-4:** Add scraper monitoring, implement role-based access
- [ ] **Day 5:** PII encryption, CSRF protection

### Week 3
- [ ] **Day 1-2:** Performance monitoring, Web Vitals
- [ ] **Day 3-4:** Integration tests, CI/CD pipeline
- [ ] **Day 5:** Load testing, operations runbook

### Week 4
- [ ] **Day 1-2:** Automated content refresh
- [ ] **Day 3-4:** Quality assurance automation
- [ ] **Day 5:** Final testing, documentation, deployment

---

## SUCCESS METRICS

### Build & Deployment
- ✅ Build completes in < 5 minutes
- ✅ Zero build errors
- ✅ CI/CD pipeline passes 100% of tests
- ✅ Deployment time < 10 minutes

### Automation
- ✅ Scrapers run automatically (weekly)
- ✅ Article versions created on every save
- ✅ AI costs tracked per article
- ✅ Budget alerts trigger correctly

### Performance
- ✅ Page load time < 2s (p95)
- ✅ API response time < 500ms (p95)
- ✅ Cache hit rate > 85%
- ✅ Build size < 2MB (gzipped)

### Security
- ✅ All admin routes protected
- ✅ Role-based access working
- ✅ PII encrypted in database
- ✅ CSRF protection on all forms

### Operations
- ✅ Runbook complete and tested
- ✅ Alerts configured and tested
- ✅ Monitoring dashboards operational
- ✅ Incident response time < 15 minutes

---

## RISK MITIGATION

### High-Risk Items
1. **Scraper Implementation** - May break if websites change
   - **Mitigation:** Add robust error handling, fallback to manual data entry
   
2. **Versioning Migration** - May impact existing articles
   - **Mitigation:** Run migration in staging first, have rollback plan

3. **Role-Based Access** - May lock out legitimate users
   - **Mitigation:** Test thoroughly, have admin override mechanism

### Dependencies
- Playwright for scrapers (adds ~200MB to node_modules)
- Encryption key management (use Vercel environment variables)
- Monitoring service (use Vercel Analytics or Sentry)

---

## POST-IMPLEMENTATION

### Week 5: Stabilization
- Monitor for issues
- Fix any bugs discovered
- Optimize performance based on real usage
- Gather user feedback

### Ongoing Maintenance
- Weekly scraper health checks
- Monthly cost reviews
- Quarterly security audits
- Continuous performance monitoring

---

## RESOURCES NEEDED

### Development Time
- **Phase 1:** 1 developer, 3 days
- **Phase 2:** 1 developer, 7 days
- **Phase 3:** 1 developer, 5 days
- **Phase 4:** 1 developer, 5 days
- **Phase 5:** 1 developer, 5 days
- **Total:** ~25 developer days (5 weeks)

### Infrastructure
- Vercel Pro (for better monitoring)
- Upstash Redis (for caching)
- Sentry (for error tracking)
- Optional: PagerDuty (for alerts)

### Tools
- Playwright (for scrapers)
- k6 or Artillery (for load testing)
- GitHub Actions (for CI/CD)

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-XX  
**Next Review:** After Phase 1 completion
