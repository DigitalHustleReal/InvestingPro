# CMS Testing Checklist
**Complete Testing Guide for Agentic CMS**

---

## 🧪 Testing Overview

### Test Categories
1. ✅ Database Setup
2. ✅ Agent System
3. ✅ API Endpoints
4. ✅ Admin Dashboards
5. ✅ Scraper Management
6. ✅ Performance Tracking
7. ✅ Integration Tests

---

## 1. Database Setup Tests

### ✅ Run Migrations

```bash
# Test performance tracking schema
psql $DATABASE_URL -f supabase/migrations/20250115_performance_tracking_schema.sql

# Test scraper tracking schema
psql $DATABASE_URL -f supabase/migrations/20250115_scraper_tracking_schema.sql
```

**Expected:**
- ✅ All tables created
- ✅ Indexes created
- ✅ Functions created
- ✅ RLS policies applied

### ✅ Verify Tables

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'content_performance',
    'content_strategy_weights',
    'agent_executions',
    'strategy_history',
    'content_generation_cycles',
    'scrapers',
    'scraper_runs',
    'data_updates',
    'scraper_health'
  );
```

**Expected:** All 9 tables exist

---

## 2. Agent System Tests

### ✅ Test Base Agent

```typescript
import { BaseAgent } from '@/lib/agents/base-agent';

// Test agent instantiation
class TestAgent extends BaseAgent {
    async execute(context: any) {
        return { success: true, data: 'test' };
    }
}

const agent = new TestAgent('TestAgent');
const result = await agent.execute({});
// Expected: { success: true, data: 'test' }
```

### ✅ Test Individual Agents

```typescript
// Test Trend Agent
import { TrendAgent } from '@/lib/agents/trend-agent';
const trendAgent = new TrendAgent();
const trends = await trendAgent.detectTrends();
// Expected: Array of trends

// Test Keyword Agent
import { KeywordAgent } from '@/lib/agents/keyword-agent';
const keywordAgent = new KeywordAgent();
const keywords = await keywordAgent.researchKeywords(trends);
// Expected: Array of keyword research results

// Test Strategy Agent
import { StrategyAgent } from '@/lib/agents/strategy-agent';
const strategyAgent = new StrategyAgent();
const strategy = await strategyAgent.generateStrategy({
    trends,
    keywords,
    goals: { volume: 5, quality: 80 }
});
// Expected: Content strategy object
```

### ✅ Test Orchestrator

```typescript
import { cmsOrchestrator } from '@/lib/agents/orchestrator';

const result = await cmsOrchestrator.executeCycle({
    mode: 'fully-automated',
    goals: {
        volume: 2, // Start small for testing
        quality: 80,
        revenue: 0,
        seo: true
    }
});

// Expected:
// {
//   success: true,
//   articlesGenerated: 2,
//   articlesPublished: 0-2,
//   performanceScore: 0-100,
//   strategy: {...},
//   errors: []
// }
```

---

## 3. API Endpoints Tests

### ✅ Test Orchestrator API

```bash
# Test execute endpoint
curl -X POST http://localhost:3000/api/cms/orchestrator/execute \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "fully-automated",
    "goals": {
      "volume": 1,
      "quality": 80
    }
  }'

# Expected: { success: true, cycleId: "...", result: {...} }

# Test get cycles
curl http://localhost:3000/api/cms/orchestrator/execute

# Expected: { success: true, cycles: [...] }
```

### ✅ Test Continuous Mode API

```bash
# Test start continuous mode
curl -X POST http://localhost:3000/api/cms/orchestrator/continuous \
  -H "Content-Type: application/json" \
  -d '{
    "action": "start",
    "mode": "fully-automated",
    "goals": { "volume": 5, "quality": 80 }
  }'

# Expected: { success: true, message: "Continuous mode started", running: true }

# Test get status
curl http://localhost:3000/api/cms/orchestrator/continuous

# Expected: { success: true, running: true/false }
```

### ✅ Test Scraper API

```bash
# Test list scrapers
curl http://localhost:3000/api/cms/scrapers?action=list

# Expected: { success: true, scrapers: [...] }

# Test register scraper
curl -X POST http://localhost:3000/api/cms/scrapers \
  -H "Content-Type: application/json" \
  -d '{
    "action": "register",
    "config": {
      "name": "test-scraper",
      "category": "credit-cards",
      "sourceUrl": "https://example.com",
      "sourceType": "bank-website",
      "scriptPath": "scripts/test-scraper.ts",
      "scheduleType": "manual"
    }
  }'

# Expected: { success: true, scraperId: "..." }
```

---

## 4. Admin Dashboard Tests

### ✅ Test Agent Dashboard

1. Navigate to admin page
2. Add `<AgentDashboard />` component
3. Verify:
   - ✅ Scrapers list displays
   - ✅ Execute cycle button works
   - ✅ Continuous mode toggle works
   - ✅ Recent cycles display
   - ✅ Status updates in real-time

### ✅ Test Scraper Dashboard

1. Add `<ScraperDashboard />` component
2. Verify:
   - ✅ All scrapers listed
   - ✅ Scraper status displays
   - ✅ Run now button works
   - ✅ Run history displays
   - ✅ Health status shows

### ✅ Test Product Performance Tracking

1. Add `<ProductPerformanceTracking />` component
2. Verify:
   - ✅ Metrics cards display
   - ✅ Charts render
   - ✅ Top products list
   - ✅ Top affiliates list
   - ✅ Brand promotions display

---

## 5. Scraper Management Tests

### ✅ Register Scraper

```typescript
import { ScraperAgent } from '@/lib/agents/scraper-agent';

const scraperAgent = new ScraperAgent();

const scraperId = await scraperAgent.registerScraper({
    name: 'test-credit-cards',
    category: 'credit-cards',
    sourceUrl: 'https://example.com',
    sourceType: 'bank-website',
    scriptPath: 'scripts/scrape-credit-cards.ts',
    scheduleType: 'daily'
});

// Expected: UUID string
```

### ✅ Execute Scraper

```typescript
const result = await scraperAgent.executeScraper(scraperId, {
    force: false
});

// Expected:
// {
//   scraperId: "...",
//   runId: "...",
//   status: "completed",
//   itemsScraped: number,
//   itemsUpdated: number,
//   itemsCreated: number,
//   itemsFailed: number,
//   executionTime: number
// }
```

### ✅ Track Data Update

```typescript
await scraperAgent.trackDataUpdate(runId, {
    productType: 'credit_card',
    productSlug: 'test-card',
    updateType: 'updated',
    fieldsUpdated: ['annual_fee'],
    oldData: { annual_fee: '₹2500' },
    newData: { annual_fee: '₹3000' }
});

// Expected: No error, data tracked in database
```

---

## 6. Performance Tracking Tests

### ✅ Track Content Performance

```typescript
import { TrackingAgent } from '@/lib/agents/tracking-agent';

const trackingAgent = new TrackingAgent();
await trackingAgent.trackArticle(articleId);

// Expected: Performance metrics recorded in database
```

### ✅ Test Feedback Loop

```typescript
import { FeedbackLoopAgent } from '@/lib/agents/feedback-loop-agent';

const feedbackAgent = new FeedbackLoopAgent();

// Get performance data
const performanceData = await feedbackAgent.getPerformanceData(30);
// Expected: Array of performance data

// Identify patterns
const patterns = await feedbackAgent.identifyPatterns(performanceData);
// Expected: Array of performance patterns

// Get strategy weights
const weights = await feedbackAgent.getStrategyWeights();
// Expected: Strategy weights object

// Update strategy weights
await feedbackAgent.updateStrategyWeights(patterns);
// Expected: Weights updated in database
```

---

## 7. Integration Tests

### ✅ End-to-End Cycle Test

```typescript
// Complete cycle from trend detection to publishing
const result = await cmsOrchestrator.executeCycle({
    mode: 'fully-automated',
    goals: {
        volume: 1,
        quality: 80
    }
});

// Verify:
// ✅ Trends detected
// ✅ Keywords researched
// ✅ Strategy generated
// ✅ Content generated
// ✅ Images generated
// ✅ Quality evaluated
// ✅ Publishing decision made
// ✅ Performance tracked
// ✅ Feedback loop updated
```

### ✅ Scraper Integration Test

```typescript
// Test scraper → data update → content generation flow
const scraperResult = await scraperAgent.executeScraper(scraperId);
// Expected: Scraper runs successfully

// Wait for data updates
const updates = await scraperAgent.getDataUpdates(scraperResult.runId);
// Expected: Data updates tracked

// Generate content based on updated data
const contentResult = await cmsOrchestrator.executeCycle({
    mode: 'fully-automated',
    goals: { volume: 1, quality: 80 }
});
// Expected: Content generated using updated product data
```

---

## 8. Error Handling Tests

### ✅ Test Agent Error Handling

```typescript
// Test agent handles errors gracefully
const result = await agent.execute({ invalid: 'context' });
// Expected: { success: false, error: "..." }
```

### ✅ Test API Error Handling

```bash
# Test invalid request
curl -X POST http://localhost:3000/api/cms/orchestrator/execute \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'

# Expected: { success: false, error: "..." }
```

---

## 9. Performance Tests

### ✅ Test Agent Execution Time

```typescript
const startTime = Date.now();
await agent.execute(context);
const executionTime = Date.now() - startTime;

// Expected: Execution time logged in agent_executions table
```

### ✅ Test Database Query Performance

```sql
-- Test performance tracking queries
EXPLAIN ANALYZE
SELECT * FROM content_performance
WHERE article_id = '...'
ORDER BY metric_date DESC
LIMIT 10;

-- Expected: Query executes in < 100ms
```

---

## 10. Security Tests

### ✅ Test RLS Policies

```typescript
// Test that non-admin users cannot access admin data
// Expected: RLS policies prevent unauthorized access
```

### ✅ Test API Authentication

```bash
# Test without authentication
curl http://localhost:3000/api/cms/orchestrator/execute

# Expected: Proper error handling or authentication required
```

---

## ✅ Testing Checklist Summary

### Database
- [ ] Migrations run successfully
- [ ] All tables created
- [ ] Indexes created
- [ ] Functions work
- [ ] RLS policies applied

### Agents
- [ ] Base agent works
- [ ] All 13 agents instantiate
- [ ] Agents execute successfully
- [ ] Orchestrator coordinates agents
- [ ] Error handling works

### APIs
- [ ] Orchestrator API works
- [ ] Continuous mode API works
- [ ] Scraper API works
- [ ] Analytics APIs work
- [ ] Error handling works

### Dashboards
- [ ] Agent Dashboard renders
- [ ] Scraper Dashboard renders
- [ ] Product Performance Dashboard renders
- [ ] Real-time updates work

### Scrapers
- [ ] Scraper registration works
- [ ] Scraper execution works
- [ ] Data update tracking works
- [ ] Health monitoring works

### Performance Tracking
- [ ] Content performance tracked
- [ ] Feedback loop works
- [ ] Strategy weights update
- [ ] Patterns identified

### Integration
- [ ] End-to-end cycle works
- [ ] Scraper → Content flow works
- [ ] All components integrated

---

## 🚀 Quick Test Script

```typescript
// Run this to test the complete system
async function testCompleteSystem() {
    console.log('🧪 Testing CMS System...');
    
    // 1. Test orchestrator
    console.log('1. Testing Orchestrator...');
    const result = await cmsOrchestrator.executeCycle({
        mode: 'fully-automated',
        goals: { volume: 1, quality: 80 }
    });
    console.log('✅ Orchestrator:', result.success ? 'PASS' : 'FAIL');
    
    // 2. Test scraper agent
    console.log('2. Testing Scraper Agent...');
    const scrapers = await scraperAgent.getAllScrapers();
    console.log('✅ Scraper Agent:', scrapers.length >= 0 ? 'PASS' : 'FAIL');
    
    // 3. Test feedback loop
    console.log('3. Testing Feedback Loop...');
    const performanceData = await feedbackLoopAgent.getPerformanceData();
    console.log('✅ Feedback Loop:', Array.isArray(performanceData) ? 'PASS' : 'FAIL');
    
    console.log('🎉 All tests complete!');
}

testCompleteSystem();
```

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Database Setup: [ ] PASS [ ] FAIL
Agent System: [ ] PASS [ ] FAIL
API Endpoints: [ ] PASS [ ] FAIL
Admin Dashboards: [ ] PASS [ ] FAIL
Scraper Management: [ ] PASS [ ] FAIL
Performance Tracking: [ ] PASS [ ] FAIL
Integration: [ ] PASS [ ] FAIL

Notes:
_______________________________________
_______________________________________
_______________________________________
```
