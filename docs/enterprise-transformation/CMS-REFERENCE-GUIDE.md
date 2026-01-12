# CMS Reference Guide
**Complete Implementation Reference - Save for Future Use**

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Implemented Features](#implemented-features)
3. [Agents Reference](#agents-reference)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Configuration](#configuration)
7. [Usage Examples](#usage-examples)
8. [Cost Control](#cost-control)
9. [Safety & Compliance](#safety--compliance)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

### System Components

```
CMS Orchestrator (Brain)
├── Trend Agent (Detect trends)
├── Keyword Agent (Research keywords)
├── Strategy Agent (Generate strategy + ROI optimization)
├── Content Agent (Generate articles)
├── Image Agent (Generate images)
├── Quality Agent (Evaluate quality)
├── Risk & Compliance Agent (Assess risk)
├── Publish Agent (Publish decisions)
├── Tracking Agent (Track performance)
├── Repurpose Agent (Repurpose content)
├── Social Agent (Social media)
├── Affiliate Agent (Track affiliates)
├── Feedback Loop Agent (Learn from performance)
├── Scraper Agent (Manage scrapers)
├── Bulk Generation Agent (Bulk content)
├── Budget Governor Agent (Cost control)
├── Economic Intelligence Agent (ROI tracking)
└── Health Monitor Agent (System health)
```

### Data Flow

```
1. Orchestrator.executeCycle()
   ↓
2. Trend Detection → Keyword Research → Strategy Generation
   ↓
3. Budget Check (Budget Governor)
   ↓
4. Content Generation (with cost tracking)
   ↓
5. Risk Assessment (Risk & Compliance)
   ↓
6. Quality Evaluation
   ↓
7. Publish Decision (only if risk is low AND quality ≥ 80)
   ↓
8. Cost Recording → ROI Calculation
   ↓
9. Performance Tracking → Strategy Adjustment
```

---

## ✅ Implemented Features

### Cost Control (4 Features)
1. ✅ **Enhanced Cost-First AI Routing**
   - Strict hierarchy: Ollama → DeepSeek → Groq → Together → OpenAI
   - Default priority: 'cost'
   - Expensive models only for final drafts/high-value

2. ✅ **Budget Governor Agent**
   - Daily token limits (default: 1M)
   - Daily image limits (default: 100)
   - Daily cost limits (default: $50 USD)
   - Automatic pausing when limits reached

3. ✅ **Automatic Cost Tracking**
   - All AI calls automatically record costs
   - Tracks tokens, cost, provider, model
   - Records to `content_costs` table

4. ✅ **Economic Intelligence Agent**
   - Tracks costs and revenue per article
   - Calculates ROI percentage
   - Identifies profitable keywords/categories
   - Generates ROI-based strategy

### Safety & Compliance (3 Features)
5. ✅ **Risk & Compliance Agent**
   - Flags guaranteed returns, tax claims, investment advice
   - Two-model verification (cheap first, expensive if conflict)
   - Prevents auto-publishing of high-risk content

6. ✅ **Two-Model Verification**
   - Uses cheap model (DeepSeek/Ollama) first
   - Verifies with expensive model (OpenAI) if high risk
   - Checks for conflicts

7. ✅ **Auto-Publish Blocking**
   - High-risk content never auto-publishes
   - Requires manual review
   - Stores risk assessment

### Strategy & Balance (2 Features)
8. ✅ **Strategic Diversity Constraint**
   - Ensures at least 20% authority/evergreen content
   - Prevents over-optimization to clickbait
   - Protects long-term domain authority

9. ✅ **ROI-Based Optimization**
   - Strategy agent uses ROI data
   - Prioritizes profitable keywords/categories
   - Deprioritizes unprofitable content

### Production Readiness (3 Features)
10. ✅ **Health Monitoring**
    - Agent success rates
    - Execution times
    - Budget status
    - Recent errors
    - Overall system health

11. ✅ **Retry Logic & Error Recovery**
    - Exponential backoff retry
    - Circuit breaker pattern
    - Handles transient failures

12. ✅ **System Health API**
    - `GET /api/cms/health`
    - Real-time health status
    - Agent performance metrics

---

## 🤖 Agents Reference

### Core Agents

#### CMSOrchestrator
**File:** `lib/agents/orchestrator.ts`
**Purpose:** Coordinates all agents in content generation cycle

**Key Methods:**
- `executeCycle(context)` - Execute full cycle
- `generateBulk(config)` - Bulk generation
- `startContinuousMode(context)` - Continuous operation
- `adaptiveLearning()` - Learn from performance

#### TrendAgent
**File:** `lib/agents/trend-agent.ts`
**Purpose:** Detect trending topics

**Key Methods:**
- `detectTrends()` - Detect trends

#### KeywordAgent
**File:** `lib/agents/keyword-agent.ts`
**Purpose:** Research keywords

**Key Methods:**
- `researchKeywords(trends)` - Research keywords

#### StrategyAgent
**File:** `lib/agents/strategy-agent.ts`
**Purpose:** Generate content strategy with ROI optimization

**Key Methods:**
- `generateStrategy(context)` - Generate strategy
- `selectTopics(strategy, count)` - Select topics
- `adjustStrategyBasedOnPerformance()` - Adjust strategy

#### ContentAgent
**File:** `lib/agents/content-agent.ts`
**Purpose:** Generate articles

**Key Methods:**
- `generateArticle(params)` - Generate article

#### ImageAgent
**File:** `lib/agents/image-agent.ts`
**Purpose:** Generate images

**Key Methods:**
- `generateImages(params)` - Generate images

#### QualityAgent
**File:** `lib/agents/quality-agent.ts`
**Purpose:** Evaluate content quality

**Key Methods:**
- `evaluateQuality(article)` - Evaluate quality

#### RiskComplianceAgent
**File:** `lib/agents/risk-compliance-agent.ts`
**Purpose:** Assess risk and compliance

**Key Methods:**
- `assessRisk(article)` - Assess risk
- Returns: `RiskAssessment` with `canAutoPublish` flag

#### PublishAgent
**File:** `lib/agents/publish-agent.ts`
**Purpose:** Make publishing decisions

**Key Methods:**
- `publishArticle(article)` - Publish article
- `saveDraft(article)` - Save as draft
- `makePublishDecision(article, qualityScore)` - Make decision

### Cost Control Agents

#### BudgetGovernorAgent
**File:** `lib/agents/budget-governor-agent.ts`
**Purpose:** Enforce cost discipline

**Key Methods:**
- `checkBudget(estimatedTokens, estimatedImages, estimatedCost)` - Check budget
- `recordCost(articleId, tokens, cost, provider, model, images, imageCost)` - Record cost
- `setDailyBudget(config)` - Set budget limits
- `pauseBudget(pause)` - Pause/resume budget
- `getBudgetStatus()` - Get budget status

#### EconomicIntelligenceAgent
**File:** `lib/agents/economic-intelligence-agent.ts`
**Purpose:** Track ROI and optimize for profit

**Key Methods:**
- `calculateROI(articleId, days)` - Calculate ROI
- `generateROIStrategy(days)` - Generate ROI strategy
- `updateContentEconomics(articleId, days)` - Update economics

### Monitoring Agents

#### HealthMonitorAgent
**File:** `lib/agents/health-monitor-agent.ts`
**Purpose:** Monitor system health

**Key Methods:**
- `getSystemHealth()` - Get system health
- `isHealthy()` - Check if healthy

---

## 🗄️ Database Schema

### Cost & Economic Intelligence

#### content_costs
Tracks AI and image costs per article
```sql
- id (UUID)
- article_id (UUID, FK to articles)
- ai_tokens_used (INTEGER)
- ai_cost (NUMERIC)
- ai_provider (TEXT)
- ai_model (TEXT)
- images_generated (INTEGER)
- image_cost (NUMERIC)
- total_cost (NUMERIC)
- generation_date (DATE)
```

#### content_economics
ROI calculations and profit tracking
```sql
- id (UUID)
- article_id (UUID, FK to articles)
- total_cost (NUMERIC)
- total_revenue (NUMERIC)
- roi_percentage (NUMERIC)
- profit (NUMERIC)
- profit_per_view (NUMERIC)
- profit_per_click (NUMERIC)
- views (INTEGER)
- clicks (INTEGER)
- conversions (INTEGER)
- period_start (DATE)
- period_end (DATE)
```

#### daily_budgets
Daily spending limits and tracking
```sql
- id (UUID)
- budget_date (DATE, UNIQUE)
- max_tokens (INTEGER)
- max_images (INTEGER)
- max_cost_usd (NUMERIC)
- tokens_used (INTEGER)
- images_used (INTEGER)
- cost_spent_usd (NUMERIC)
- is_paused (BOOLEAN)
```

#### content_risk_scores
Risk assessments and compliance
```sql
- id (UUID)
- article_id (UUID, FK to articles)
- risk_score (INTEGER, 0-100)
- risk_level (TEXT: 'low'|'medium'|'high'|'critical')
- has_guaranteed_returns (BOOLEAN)
- has_tax_claims (BOOLEAN)
- has_investment_advice (BOOLEAN)
- has_regulatory_sensitive (BOOLEAN)
- verification_status (TEXT: 'pending'|'verified'|'flagged'|'rejected')
- verification_model_1 (TEXT)
- verification_model_2 (TEXT)
- verification_conflict (BOOLEAN)
- requires_manual_review (BOOLEAN)
- can_auto_publish (BOOLEAN)
```

#### content_diversity
Diversity constraint tracking
```sql
- id (UUID)
- period_start (DATE)
- period_end (DATE)
- authority_content_count (INTEGER)
- trend_content_count (INTEGER)
- commercial_content_count (INTEGER)
- diversity_score (NUMERIC)
- meets_diversity_constraint (BOOLEAN)
```

### Helper Functions

#### calculate_content_roi(article_id, days)
Calculates ROI for an article
```sql
SELECT * FROM calculate_content_roi('article-uuid', 30);
```

#### check_daily_budget()
Checks if generation is allowed
```sql
SELECT * FROM check_daily_budget();
```

#### record_content_cost(...)
Records cost for an article
```sql
SELECT record_content_cost(
    'article-uuid',
    2000, -- tokens
    0.05, -- cost
    'deepseek', -- provider
    'deepseek-chat', -- model
    1, -- images
    0.02 -- image cost
);
```

---

## 🔌 API Endpoints

### Orchestrator

#### POST /api/cms/orchestrator/execute
Execute a content generation cycle

**Request:**
```json
{
  "mode": "fully-automated",
  "goals": {
    "volume": 10,
    "quality": 80,
    "revenue": 1000
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "articlesGenerated": 10,
    "articlesPublished": 8,
    "performanceScore": 85,
    "errors": []
  }
}
```

#### GET /api/cms/orchestrator/execute?limit=10
Get recent cycles

### Budget Management

#### GET /api/cms/budget
Get budget status

**Response:**
```json
{
  "success": true,
  "budget": {
    "max_tokens": 1000000,
    "max_images": 100,
    "max_cost_usd": 50.00,
    "tokens_used": 50000,
    "images_used": 10,
    "cost_spent_usd": 2.50,
    "is_paused": false
  }
}
```

#### POST /api/cms/budget
Set budget or pause/resume

**Request:**
```json
{
  "action": "set",
  "maxTokensPerDay": 1000000,
  "maxImagesPerDay": 100,
  "maxCostPerDay": 50.00
}
```

Or:
```json
{
  "action": "pause",
  "pause": true
}
```

### Health Monitoring

#### GET /api/cms/health
Get system health

**Response:**
```json
{
  "success": true,
  "health": {
    "overall": "healthy",
    "agents": [
      {
        "name": "ContentAgent",
        "successRate": 95.5,
        "avgExecutionTime": 2500,
        "status": "healthy"
      }
    ],
    "budget": {
      "status": "ok",
      "tokensRemaining": 950000,
      "costRemaining": 47.50,
      "isPaused": false
    },
    "errors": {
      "count": 2,
      "recent": [...]
    }
  }
}
```

### Bulk Generation

#### POST /api/cms/bulk-generate
Generate multiple articles

**Request:**
```json
{
  "totalArticles": 20,
  "batchSize": 5,
  "parallelBatches": 2,
  "qualityThreshold": 80,
  "parallel": true
}
```

---

## ⚙️ Configuration

### Environment Variables

#### AI Providers
```env
# Ollama (Local, Free)
OLLAMA_URL=http://localhost:11434

# DeepSeek (Very Low Cost)
DEEPSEEK_API_KEY=sk-...

# Groq (Low Cost, Fast)
GROQ_API_KEY=gsk_...

# Together AI (Low Cost)
TOGETHER_API_KEY=...

# OpenAI (Expensive, High Quality)
OPENAI_API_KEY=sk-...
```

#### Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

#### Budget (Optional)
```env
CYCLE_INTERVAL_MINUTES=1440  # 24 hours
DEFAULT_MAX_TOKENS_PER_DAY=1000000
DEFAULT_MAX_IMAGES_PER_DAY=100
DEFAULT_MAX_COST_PER_DAY=50.00
```

### Default Budget Settings

```typescript
{
  maxTokensPerDay: 1000000,
  maxImagesPerDay: 100,
  maxCostPerDay: 50.00  // USD
}
```

---

## 💻 Usage Examples

### Basic Content Generation

```typescript
import { CMSOrchestrator } from '@/lib/agents/orchestrator';

const orchestrator = new CMSOrchestrator();

const result = await orchestrator.executeCycle({
  mode: 'fully-automated',
  goals: {
    volume: 10,
    quality: 80,
    revenue: 1000
  }
});

console.log(`Generated: ${result.articlesGenerated}`);
console.log(`Published: ${result.articlesPublished}`);
```

### Set Daily Budget

```typescript
import { BudgetGovernorAgent } from '@/lib/agents/budget-governor-agent';

const budgetAgent = new BudgetGovernorAgent();

await budgetAgent.setDailyBudget({
  maxTokensPerDay: 1000000,
  maxImagesPerDay: 100,
  maxCostPerDay: 50.00
});
```

### Check Budget Before Generation

```typescript
const budgetAgent = new BudgetGovernorAgent();

const status = await budgetAgent.checkBudget(2000, 1, 0.10);
if (!status.canGenerate) {
  console.log('Budget exhausted:', status.reason);
  // Stop generation
}
```

### Get ROI Strategy

```typescript
import { EconomicIntelligenceAgent } from '@/lib/agents/economic-intelligence-agent';

const economicAgent = new EconomicIntelligenceAgent();
const strategy = await economicAgent.generateROIStrategy(90);

console.log('Profitable keywords:', strategy.profitableKeywords);
console.log('Avoid keywords:', strategy.unprofitableKeywords);
console.log('Recommendations:', strategy.recommendations);
```

### Assess Risk

```typescript
import { RiskComplianceAgent } from '@/lib/agents/risk-compliance-agent';

const riskAgent = new RiskComplianceAgent();
const assessment = await riskAgent.assessRisk({
  title: article.title,
  content: article.content,
  category: article.category
});

if (!assessment.canAutoPublish) {
  // Save as draft, require manual review
  console.log('Risk level:', assessment.riskLevel);
}
```

### Check System Health

```typescript
import { HealthMonitorAgent } from '@/lib/agents/health-monitor-agent';

const healthMonitor = new HealthMonitorAgent();
const health = await healthMonitor.getSystemHealth();

console.log('Overall health:', health.overall);
console.log('Agent status:', health.agents);
console.log('Budget status:', health.budget);
```

### Retry with Error Recovery

```typescript
import { retry } from '@/lib/utils/retry';

const result = await retry(() => someOperation(), {
  maxRetries: 3,
  delay: 1000,
  backoff: 'exponential'
});
```

---

## 💰 Cost Control

### Cost-First AI Routing

**Default Priority:** `'cost'`

**Hierarchy:**
1. Ollama (Local, Free)
2. DeepSeek (Very Low Cost)
3. Groq (Low Cost, Fast)
4. Together AI (Low Cost)
5. OpenAI (Expensive, Only when necessary)

**Usage:**
```typescript
// Default: Uses cheapest available
const content = await agent.generateWithAI(prompt, {
  articleId: article.id,
  priority: 'cost' // Default
});

// High-value content: Use better model
const content = await agent.generateWithAI(prompt, {
  articleId: article.id,
  priority: 'quality',
  isHighValue: true,
  isFinalDraft: true
});
```

### Budget Enforcement

**Automatic:**
- Budget checked before each article generation
- Generation stops if budget exhausted
- Costs recorded automatically after generation

**Manual:**
```typescript
// Check budget
const status = await budgetAgent.checkBudget(2000, 1, 0.10);

// Record cost
await budgetAgent.recordCost(
  articleId,
  tokens,
  cost,
  provider,
  model,
  images,
  imageCost
);
```

### Cost Tracking

**Automatic:**
- All AI calls via `BaseAgent.generateWithAI()` track costs
- Records to `content_costs` table
- Updates daily budget automatically

**Manual:**
```typescript
// Costs are automatically tracked when using generateWithAI
const content = await this.generateWithAI(prompt, {
  articleId: article.id,
  trackCost: true // Default: true
});
```

---

## 🛡️ Safety & Compliance

### Risk Assessment Flow

```
1. Generate Content
   ↓
2. Risk Assessment (Cheap Model First)
   ├─ Low Risk → Continue
   ├─ High Risk → Two-Model Verification
   └─ Critical Risk → Block Auto-Publish
   ↓
3. Quality Check
   ↓
4. Publish Decision
   ├─ Quality ≥ 80 AND Risk Low → Publish
   ├─ Quality ≥ 75 AND Risk Low → Schedule
   └─ Otherwise → Draft
```

### Risk Levels

- **Low:** Auto-publish allowed
- **Medium:** May require review
- **High:** Two-model verification, manual review
- **Critical:** Never auto-publish

### Risk Flags

- `hasGuaranteedReturns` - Flags guaranteed return claims
- `hasTaxClaims` - Flags tax claims
- `hasInvestmentAdvice` - Flags investment advice
- `hasRegulatorySensitive` - Flags regulatory sensitive content

---

## 🔧 Troubleshooting

### Budget Exhausted

**Problem:** Generation stops with "Budget limit reached"

**Solution:**
1. Check budget status: `GET /api/cms/budget`
2. Increase limits or wait for next day
3. Resume: `POST /api/cms/budget` with `action: "pause", pause: false`

### High Risk Content Blocked

**Problem:** Articles saved as draft due to high risk

**Solution:**
1. Check risk assessment: `content_risk_scores` table
2. Review flagged content manually
3. Adjust content to reduce risk
4. Manually publish if appropriate

### Low ROI

**Problem:** Content not generating profit

**Solution:**
1. Get ROI strategy: `economicAgent.generateROIStrategy(90)`
2. Check profitable keywords/categories
3. Adjust strategy to focus on profitable content
4. Deprioritize unprofitable keywords

### System Health Issues

**Problem:** System health shows "degraded" or "unhealthy"

**Solution:**
1. Check health: `GET /api/cms/health`
2. Review agent success rates
3. Check recent errors
4. Review budget status
5. Fix underlying issues

### Cost Tracking Not Working

**Problem:** Costs not being recorded

**Solution:**
1. Ensure `articleId` is passed to `generateWithAI()`
2. Check `trackCost` is not set to `false`
3. Verify database migration ran
4. Check `content_costs` table

---

## 📊 Key Metrics

### Cost Metrics
- Total cost per article
- Cost per token
- Cost per image
- Daily spending

### ROI Metrics
- ROI percentage
- Profit per article
- Profit per view
- Profit per click

### Performance Metrics
- Agent success rates
- Average execution times
- Error rates
- Budget utilization

### Content Metrics
- Articles generated
- Articles published
- Quality scores
- Risk levels

---

## 🚀 Quick Start Checklist

1. ✅ Run database migration
   ```bash
   psql $DATABASE_URL -f supabase/migrations/20250115_cost_economic_intelligence_schema.sql
   ```

2. ✅ Set environment variables
   - AI provider API keys
   - Supabase credentials

3. ✅ Set daily budget
   ```typescript
   await budgetAgent.setDailyBudget({
     maxTokensPerDay: 1000000,
     maxImagesPerDay: 100,
     maxCostPerDay: 50.00
   });
   ```

4. ✅ Test health endpoint
   ```bash
   curl http://localhost:3000/api/cms/health
   ```

5. ✅ Start generating
   ```typescript
   await orchestrator.executeCycle({
     mode: 'fully-automated',
     goals: { volume: 10, quality: 80 }
   });
   ```

---

## 📝 Notes

- **Default Priority:** Cost-first (uses cheapest models)
- **Auto-Publish Threshold:** Quality ≥ 80 AND Risk Low
- **Diversity Constraint:** At least 20% authority content
- **Budget Defaults:** 1M tokens, 100 images, $50/day
- **Retry Logic:** 3 retries with exponential backoff
- **Health Check:** Every 10 seconds in dashboard

---

## 🔗 Related Documents

- `CMS-MASTER-VISION-AND-EXECUTION.md` - Overall vision
- `CMS-EVOLUTION-IMPLEMENTED.md` - Implementation details
- `CMS-PRODUCTION-READY.md` - Production enhancements
- `CMS-TESTING-CHECKLIST.md` - Testing guide
- `CMS-CREDENTIALS-REQUIRED.md` - Credentials needed

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0
**Status:** Production Ready ✅

---

## 🚀 SaaS Upgrade Features (Optional)

### Overview

These upgrades transform the CMS from an internal system into a **production-grade SaaS platform**. They add:
- Multi-tenant isolation
- System survival modes
- Advanced cost attribution
- Agent drift detection
- Pre-generation risk blocking
- Unified content lifecycle state

**Status:** Documented for future implementation
**Priority:** High (for SaaS readiness)
**Complexity:** Medium to High

---

### 1. Unified Content Lifecycle State ✅

**Purpose:** Single source of truth for all article state

**Implementation:**
- New table: `content_lifecycle_state`
- Tracks: cost, quality, risk, ROI, diversity, publish status, experiment variant
- All agents read/write through this state
- No agent decisions without this state

**Benefits:**
- Eliminates data inconsistency
- Faster decision-making
- Better audit trail

**Database Schema:**
```sql
CREATE TABLE content_lifecycle_state (
    id UUID PRIMARY KEY,
    article_id UUID REFERENCES articles(id),
    tenant_id UUID, -- For SaaS
    cost_tokens INTEGER,
    cost_dollars NUMERIC,
    cost_images INTEGER,
    quality_score NUMERIC,
    risk_score NUMERIC,
    roi_percentage NUMERIC,
    diversity_bucket TEXT, -- 'authority', 'trend', 'commercial'
    publish_status TEXT, -- 'draft', 'scheduled', 'published', 'blocked'
    experiment_variant_id UUID,
    updated_at TIMESTAMP,
    UNIQUE(article_id, tenant_id)
);
```

**Impact:** Medium
**Complexity:** Medium

---

### 2. System Survival Mode ✅

**Purpose:** Prevent runaway losses with adaptive system modes

**Modes:**
- **Normal:** All features enabled
- **Conservative:** No A/B tests, no expensive models, only high-ROI keywords
- **Survival:** No new articles, only update profitable pages, no experiments, no OpenAI

**Triggers:**
- Budget remaining < 10%
- ROI trend negative for 7 days
- Error rate > 20%
- SERP volatility detected
- Google update detected

**Implementation:**
```typescript
enum SystemMode {
  NORMAL = 'normal',
  CONSERVATIVE = 'conservative',
  SURVIVAL = 'survival'
}

class SystemModeManager {
  async determineMode(): Promise<SystemMode> {
    // Check budget, ROI, errors, etc.
    // Return appropriate mode
  }
  
  async applyMode(mode: SystemMode) {
    // Adjust orchestrator behavior
  }
}
```

**Benefits:**
- Prevents catastrophic losses
- Automatic cost protection
- Adaptive resilience

**Impact:** High
**Complexity:** Medium

---

### 3. Cost Attribution by Agent & Category ✅

**Purpose:** Granular cost control and throttling

**Tracks:**
- Cost per agent (TrendAgent, ContentAgent, etc.)
- Cost per category (mutual-funds, credit-cards, etc.)
- Cost per experiment
- Cost per keyword

**Budget Governor Enhancement:**
- Throttle specific agents
- Throttle specific categories
- Throttle specific experiments

**Example:**
```typescript
// Pause ImageAgent if it exceeds ₹500 today
await budgetGovernor.throttleAgent('ImageAgent', {
  maxCost: 500,
  currency: 'INR'
});

// Pause 'credit-cards' category if ROI < 0
await budgetGovernor.throttleCategory('credit-cards', {
  minROI: 0
});
```

**Database Schema:**
```sql
CREATE TABLE agent_costs (
    id UUID PRIMARY KEY,
    tenant_id UUID,
    agent_name TEXT,
    category TEXT,
    experiment_id UUID,
    keyword TEXT,
    cost_tokens INTEGER,
    cost_dollars NUMERIC,
    date DATE,
    INDEX(tenant_id, agent_name, date),
    INDEX(tenant_id, category, date)
);
```

**Benefits:**
- Fine-grained cost control
- Identify cost drivers
- Optimize spending

**Impact:** High
**Complexity:** Medium

---

### 4. Pre-Generation Risk Blocking ✅

**Purpose:** Block risky content before generation (save costs)

**Implementation:**
- Risk phrase detection in prompts/topics
- Block or rephrase before AI call
- Trigger safer prompts automatically

**Risk Phrases:**
- Guaranteed returns
- Tax claims
- Investment advice
- Regulatory sensitive terms

**Example:**
```typescript
class PreGenerationRiskBlock {
  async checkTopic(topic: string): Promise<{
    isBlocked: boolean;
    reason?: string;
    safeAlternative?: string;
  }> {
    // Check for risk phrases
    // Return block status or safe alternative
  }
}
```

**Benefits:**
- Saves generation costs
- Prevents compliance issues early
- Faster content pipeline

**Impact:** Medium
**Complexity:** Low

---

### 5. Agent Drift Detection & Rollback ✅

**Purpose:** Maintain quality over time, prevent strategy corruption

**Implementation:**
- Baseline performance per agent
- Rolling 7-day performance tracking
- Drift score calculation
- Automatic rollback on threshold breach

**Database Schema:**
```sql
CREATE TABLE agent_drift (
    id UUID PRIMARY KEY,
    tenant_id UUID,
    agent_name TEXT,
    baseline_performance NUMERIC,
    current_performance NUMERIC,
    drift_score NUMERIC,
    last_good_strategy JSONB,
    detected_at TIMESTAMP,
    rolled_back BOOLEAN DEFAULT FALSE
);
```

**Example:**
```typescript
class DriftDetector {
  async detectDrift(agentName: string): Promise<{
    hasDrift: boolean;
    driftScore: number;
    shouldRollback: boolean;
  }> {
    // Compare baseline vs current
    // Calculate drift score
    // Determine if rollback needed
  }
  
  async rollback(agentName: string) {
    // Restore last good strategy
    // Alert dashboard
  }
}
```

**Benefits:**
- Maintains quality over time
- Prevents slow degradation
- Automatic recovery

**Impact:** High
**Complexity:** Medium

---

### 6. SaaS Tenant Isolation ✅

**Purpose:** Multi-tenant architecture for SaaS

**Implementation:**
- Add `tenant_id` to all tables
- Scope all queries by tenant
- Separate budgets per tenant
- Separate strategies per tenant
- Separate risk tolerance per tenant

**Database Changes:**
```sql
-- Add tenant_id to all existing tables
ALTER TABLE articles ADD COLUMN tenant_id UUID;
ALTER TABLE content_costs ADD COLUMN tenant_id UUID;
ALTER TABLE daily_budgets ADD COLUMN tenant_id UUID;
-- ... etc for all tables

-- Create tenant table
CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name TEXT,
    slug TEXT UNIQUE,
    status TEXT, -- 'active', 'suspended', 'trial'
    created_at TIMESTAMP
);

-- Add RLS policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON articles
  FOR ALL USING (tenant_id = current_setting('app.tenant_id')::UUID);
```

**Agent Changes:**
```typescript
// All agents must accept tenant_id
class BaseAgent {
  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }
  
  async execute(context: AgentContext) {
    // All queries scoped to tenant_id
    const { data } = await this.supabase
      .from('articles')
      .select('*')
      .eq('tenant_id', this.tenantId);
  }
}
```

**Benefits:**
- True multi-tenant SaaS
- Data isolation
- Scalable architecture

**Impact:** Very High
**Complexity:** High (requires refactoring)

---

### 7. Tenant Control Plane ✅

**Purpose:** Admin APIs for tenant management

**APIs:**
- `POST /api/tenants/{id}/budget` - Set budget
- `POST /api/tenants/{id}/risk-tolerance` - Set risk tolerance
- `POST /api/tenants/{id}/authority-percent` - Set authority content %
- `POST /api/tenants/{id}/auto-publish` - Enable/disable auto-publish
- `POST /api/tenants/{id}/revenue-goals` - Set revenue goals

**Implementation:**
```typescript
// Tenant settings table
CREATE TABLE tenant_settings (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    max_daily_budget NUMERIC,
    risk_tolerance TEXT, -- 'low', 'medium', 'high'
    authority_content_percent NUMERIC DEFAULT 20,
    auto_publish_enabled BOOLEAN DEFAULT TRUE,
    revenue_goal NUMERIC,
    updated_at TIMESTAMP
);

// API routes
app.post('/api/tenants/:id/budget', async (req, res) => {
  const { maxDailyBudget } = req.body;
  await updateTenantSetting(req.params.id, 'max_daily_budget', maxDailyBudget);
});
```

**Benefits:**
- Sellable SaaS product
- Tenant customization
- Business control

**Impact:** Very High (for SaaS)
**Complexity:** Medium

---

## 📊 SaaS Upgrade Priority Matrix

### Phase 1: Critical for SaaS (Must Have)
1. ✅ **SaaS Tenant Isolation** - Foundation for multi-tenant
2. ✅ **Tenant Control Plane** - Required for SaaS sales

### Phase 2: High Value (Should Have)
3. ✅ **System Survival Mode** - Prevents losses
4. ✅ **Cost Attribution** - Granular control
5. ✅ **Agent Drift Detection** - Quality maintenance

### Phase 3: Nice to Have (Can Add Later)
6. ✅ **Unified Content Lifecycle State** - Better architecture
7. ✅ **Pre-Generation Risk Blocking** - Cost savings

---

## 🚀 Implementation Roadmap

### Step 1: Foundation (Week 1-2)
- Implement tenant isolation
- Add tenant control plane
- Update all tables with tenant_id

### Step 2: Safety (Week 3-4)
- System survival mode
- Pre-generation risk blocking
- Enhanced cost attribution

### Step 3: Quality (Week 5-6)
- Agent drift detection
- Unified content lifecycle state

---

## ⚠️ Migration Notes

**Breaking Changes:**
- Tenant isolation requires adding `tenant_id` to all tables
- All queries must be scoped to tenant
- All agents must accept tenant_id

**Migration Strategy:**
1. Add `tenant_id` columns (nullable initially)
2. Create default tenant for existing data
3. Update all queries to include tenant_id
4. Make tenant_id required
5. Add RLS policies

**Backward Compatibility:**
- Can run in single-tenant mode (default tenant)
- Existing code works with default tenant
- Gradual migration possible

---

## 📝 Notes

- **SaaS upgrades are optional** - System works without them
- **Tenant isolation is the biggest change** - Requires careful planning
- **Can implement incrementally** - Don't need all at once
- **Test thoroughly** - Multi-tenant has many edge cases

---

**SaaS Status:** Documented, Ready for Implementation
**Recommended:** Implement Phase 1 first, then Phase 2, then Phase 3

---

## 🛡️ Autonomous Safety & Deployment Intelligence (Optional)

### Overview

These upgrades add **machine-level safety and self-awareness** so the system operates autonomously without human checklists. They create a "safety shell" around existing systems without breaking them.

**Status:** Documented, not implemented yet
**Priority:** High (for production safety)
**Impact:** Critical (prevents data loss, budget overruns, system failures)
**Complexity:** Medium

---

### 1. SystemInspector (Read-Only Reality Scan) ✅

**Purpose:** Automatic detection of system state - database, agents, APIs, AI providers

**Implementation:**
```typescript
// lib/system/SystemInspector.ts
class SystemInspector {
  async inspectDatabase(): Promise<{
    tables: Array<{ name: string; columns: string[]; indexes: string[] }>;
    foreignKeys: Array<{ table: string; column: string; references: string }>;
  }>;
  
  async inspectAgents(): Promise<Array<{
    name: string;
    version: string;
    lastExecution: Date;
    status: 'healthy' | 'degraded' | 'failed';
  }>>;
  
  async inspectAPIRoutes(): Promise<Array<{
    path: string;
    method: string;
    available: boolean;
  }>>;
  
  async inspectAIProviders(): Promise<Array<{
    provider: string;
    configured: boolean;
    reachable: boolean;
    failing: boolean;
  }>>;
  
  async fullInspection(): Promise<SystemState> {
    // Return complete system snapshot
  }
}
```

**API Endpoint:**
```
GET /api/cms/system/inspect
```

**Response:**
```json
{
  "database": {
    "tables": [...],
    "foreignKeys": [...],
    "indexes": [...]
  },
  "agents": [...],
  "apiRoutes": [...],
  "aiProviders": [...],
  "timestamp": "2025-01-15T10:00:00Z"
}
```

**Benefits:**
- Complete system visibility
- Automatic state detection
- No manual inspection needed
- Pre-flight checks before operations

**Impact:** High
**Complexity:** Medium

---

### 2. MigrationGatekeeper (Data-Safe Schema Control) ✅

**Purpose:** Prevent dangerous migrations, ensure data safety

**Rules:**
- ✅ **Allow:** `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN`, `CREATE INDEX`, `CREATE FUNCTION`
- ❌ **Block:** `DROP`, `ALTER COLUMN`, `RENAME`, `TRUNCATE`, `DELETE`

**Implementation:**
```typescript
// lib/system/MigrationGatekeeper.ts
class MigrationGatekeeper {
  async validateMigration(sql: string): Promise<{
    allowed: boolean;
    reason?: string;
    violations?: string[];
  }> {
    // Check for dangerous operations
    const dangerous = ['DROP', 'ALTER COLUMN', 'RENAME', 'TRUNCATE', 'DELETE'];
    const violations = dangerous.filter(op => sql.includes(op));
    
    if (violations.length > 0) {
      return {
        allowed: false,
        reason: 'Contains dangerous operations',
        violations
      };
    }
    
    return { allowed: true };
  }
  
  async simulateMigration(sql: string): Promise<{
    safe: boolean;
    changes: string[];
    warnings: string[];
  }> {
    // Diff existing schema
    // Simulate changes
    // Check for conflicts
  }
  
  async executeMigration(sql: string, force: boolean = false): Promise<{
    success: boolean;
    executed: boolean;
    reason?: string;
  }> {
    // Validate
    const validation = await this.validateMigration(sql);
    if (!validation.allowed && !force) {
      return {
        success: false,
        executed: false,
        reason: validation.reason
      };
    }
    
    // Simulate
    const simulation = await this.simulateMigration(sql);
    if (!simulation.safe && !force) {
      return {
        success: false,
        executed: false,
        reason: 'Simulation shows unsafe changes'
      };
    }
    
    // Execute
    // ... execute migration
    return { success: true, executed: true };
  }
}
```

**API Endpoint:**
```
POST /api/cms/system/migrate
```

**Request:**
```json
{
  "sql": "CREATE TABLE IF NOT EXISTS...",
  "force": false
}
```

**Response:**
```json
{
  "success": true,
  "executed": true,
  "validation": {
    "allowed": true,
    "violations": []
  },
  "simulation": {
    "safe": true,
    "changes": ["Added table: new_table"],
    "warnings": []
  }
}
```

**Benefits:**
- Prevents data loss
- Blocks dangerous operations
- Requires manual override for risky changes
- Automatic validation

**Impact:** Very High (prevents disasters)
**Complexity:** Medium

---

### 3. Canary Execution Mode ✅

**Purpose:** Test system before full cycle execution

**Behavior:**
- Generate exactly 1 article
- Do NOT publish
- Track: cost, quality, risk, errors
- Compare to last 7-day averages
- Abort full cycle if thresholds exceeded

**Implementation:**
```typescript
// lib/agents/orchestrator.ts
class CMSOrchestrator {
  async executeCanary(context: OrchestrationContext): Promise<{
    passed: boolean;
    metrics: {
      cost: number;
      quality: number;
      risk: number;
      errors: number;
    };
    comparison: {
      costVsBaseline: number; // 2.0 = 2× baseline
      qualityVsBaseline: number;
      riskVsBaseline: number;
    };
    action: 'proceed' | 'abort' | 'conservative';
  }> {
    // Generate 1 article (don't publish)
    const article = await this.contentAgent.generateArticle({...});
    
    // Track metrics
    const cost = await this.getCost(article.id);
    const quality = article.quality_score;
    const risk = await this.riskAgent.assessRisk(article);
    const errors = this.getErrorCount();
    
    // Get baseline (last 7 days)
    const baseline = await this.getBaselineMetrics(7);
    
    // Compare
    const costVsBaseline = cost / baseline.avgCost;
    const qualityVsBaseline = quality / baseline.avgQuality;
    const riskVsBaseline = risk.riskScore / baseline.avgRisk;
    
    // Determine action
    let action: 'proceed' | 'abort' | 'conservative' = 'proceed';
    
    if (costVsBaseline > 2.0 || qualityVsBaseline < 0.8 || errors > 0) {
      if (costVsBaseline > 3.0 || errors > 5) {
        action = 'abort';
      } else {
        action = 'conservative';
      }
    }
    
    // If abort/conservative, switch system mode
    if (action !== 'proceed') {
      await this.systemModeManager.setMode('conservative');
      await this.alertDashboard({
        type: 'canary_failed',
        metrics,
        action
      });
    }
    
    return {
      passed: action === 'proceed',
      metrics: { cost, quality: quality, risk: risk.riskScore, errors },
      comparison: { costVsBaseline, qualityVsBaseline, riskVsBaseline },
      action
    };
  }
  
  async executeCycle(context: OrchestrationContext): Promise<OrchestrationResult> {
    // Run canary first
    const canary = await this.executeCanary(context);
    
    if (!canary.passed) {
      return {
        success: false,
        articlesGenerated: 0,
        articlesPublished: 0,
        performanceScore: 0,
        strategy: null,
        errors: [`Canary failed: ${canary.action}. System switched to conservative mode.`]
      };
    }
    
    // Proceed with full cycle
    return await this.executeCycleInternal(context);
  }
}
```

**API Endpoint:**
```
POST /api/cms/orchestrator/canary
```

**Request:**
```json
{
  "mode": "canary",
  "goals": {
    "volume": 1,
    "quality": 80
  }
}
```

**Response:**
```json
{
  "passed": true,
  "metrics": {
    "cost": 0.05,
    "quality": 85,
    "risk": 20,
    "errors": 0
  },
  "comparison": {
    "costVsBaseline": 1.2,
    "qualityVsBaseline": 1.05,
    "riskVsBaseline": 0.9
  },
  "action": "proceed"
}
```

**Thresholds:**
- **Cost:** > 2× baseline → Conservative mode
- **Cost:** > 3× baseline → Abort
- **Quality:** < 80% of baseline → Conservative mode
- **Errors:** > 0 → Conservative mode
- **Errors:** > 5 → Abort

**Benefits:**
- Prevents runaway costs
- Catches issues before full cycle
- Automatic mode switching
- Dashboard alerts

**Impact:** Very High (prevents disasters)
**Complexity:** Medium

---

## 📊 Safety Features Priority Matrix

### Phase 1: Critical Safety (Must Have for Production)
1. ✅ **MigrationGatekeeper** - Prevents data loss
2. ✅ **Canary Execution Mode** - Prevents budget disasters

### Phase 2: High Value (Recommended)
3. ✅ **SystemInspector** - Complete visibility

---

## 🚀 Implementation Roadmap

### Step 1: Safety Foundation (Week 1)
- Implement MigrationGatekeeper
- Implement Canary Execution Mode
- Test with real migrations and cycles

### Step 2: Visibility (Week 2)
- Implement SystemInspector
- Add dashboard integration
- Test inspection accuracy

---

## ⚠️ Safety Notes

**MigrationGatekeeper:**
- ⚠️ **Manual Override:** Dangerous migrations require `force: true`
- ⚠️ **Logging:** All blocked migrations are logged
- ⚠️ **Audit Trail:** Complete history of migrations

**Canary Mode:**
- ⚠️ **Thresholds:** Configurable per tenant/environment
- ⚠️ **Baseline:** Rolling 7-day average
- ⚠️ **Alerts:** Dashboard + email notifications

**SystemInspector:**
- ⚠️ **Read-Only:** Never modifies system
- ⚠️ **Performance:** Cached results, refresh on demand
- ⚠️ **Accuracy:** Real-time state detection

---

## 📝 Integration Notes

**With Existing Systems:**
- ✅ Wraps around existing orchestrator
- ✅ Enhances migration process
- ✅ Adds safety layer without breaking existing code

**With SaaS Features:**
- ✅ Per-tenant canary thresholds
- ✅ Per-tenant migration policies
- ✅ Per-tenant system inspection

---

## ✅ Benefits Summary

**SystemInspector:**
- Complete system visibility
- Automatic state detection
- Pre-flight checks

**MigrationGatekeeper:**
- Prevents data loss
- Blocks dangerous operations
- Requires manual override

**Canary Mode:**
- Prevents budget disasters
- Catches issues early
- Automatic mode switching

**Combined:**
- Self-aware system
- Self-protecting
- Data-safe
- Budget-safe
- Deployable without human babysitting

---

**Safety Status:** Documented, Ready for Implementation
**Recommendation:** Implement Phase 1 (MigrationGatekeeper + Canary) first
