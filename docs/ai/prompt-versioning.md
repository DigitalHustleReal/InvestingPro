# Prompt Versioning & A/B Testing

This document describes the prompt versioning and A/B testing system.

## 🎯 Overview

The prompt management system provides:
- Version control for prompts
- A/B testing framework
- Performance tracking per version
- Auto-optimization (best version selection)
- Statistical significance testing

---

## 📋 Features

### Version Control
- Multiple versions per prompt slug
- Parent-child relationships
- Version history tracking
- Active version management

### A/B Testing
- Create A/B tests with traffic splits
- Deterministic user assignment
- Statistical significance calculation
- Automatic winner declaration

### Performance Tracking
- Quality scores
- Latency metrics
- Cost tracking
- Success rates
- Engagement metrics

### Auto-Optimization
- Automatic best version selection
- Performance-based ranking
- Cost efficiency consideration

---

## 🔧 API Endpoints

### List Prompts

```http
GET /api/v1/admin/prompts?category=article_generation&include_inactive=true
```

### Create Prompt Version

```http
POST /api/v1/admin/prompts
Content-Type: application/json

{
  "base_prompt_id": "uuid",
  "updates": {
    "user_prompt_template": "New template...",
    "system_prompt": "New system prompt...",
    "temperature": 0.8
  }
}
```

### Get Prompt Performance

```http
GET /api/v1/admin/prompts/[id]/performance?days=30
```

### Create A/B Test

```http
POST /api/v1/admin/ab-tests
Content-Type: application/json

{
  "prompt_slug": "article-generator",
  "name": "Test New Template",
  "description": "Testing improved template",
  "traffic_split": {
    "A": 50,
    "B": 50
  },
  "min_sample_size": 100
}
```

### Start A/B Test

```http
POST /api/v1/admin/ab-tests/[id]/start
```

### Analyze A/B Test

```http
GET /api/v1/admin/ab-tests/[id]/analyze
```

---

## 💻 Usage Examples

### Get Best Prompt Version

```typescript
import { getBestPrompt } from '@/lib/ai/prompt-manager';

const bestPrompt = await getBestPrompt('article-generator', 'article_generation');

if (bestPrompt) {
    console.log(`Using version ${bestPrompt.version} with score ${bestPrompt.performance_score}`);
}
```

### Get Prompt for A/B Testing

```typescript
import { getPromptForABTest } from '@/lib/ai/ab-testing';

const prompt = await getPromptForABTest('article-generator', userId);

if (prompt) {
    console.log(`Selected prompt version ${prompt.version} for group ${prompt.abTestGroup}`);
}
```

### Record Performance

```typescript
import { trackABTestExecution } from '@/lib/ai/ab-testing';

await trackABTestExecution(
    promptId,
    promptVersion,
    abTestGroup,
    {
        executionId: 'exec-123',
        executionType: 'article_generation',
        latencyMs: 2500,
        tokensUsed: 5000,
        costUSD: 0.05,
        success: true,
        qualityScore: 85,
        articleId: 'article-123',
    }
);
```

### Create A/B Test

```typescript
import { createABTest, startABTest } from '@/lib/ai/prompt-manager';

// Create test
const test = await createABTest('article-generator', {
    name: 'Test Improved Template',
    description: 'Testing new template with better structure',
    trafficSplit: {
        A: 50, // Control
        B: 50, // Variant
    },
    minSampleSize: 100,
});

// Start test
if (test) {
    await startABTest(test.id);
}
```

### Auto-Optimize Prompt

```typescript
import { autoOptimizePrompt } from '@/lib/ai/prompt-manager';

// Automatically activate best performing version
await autoOptimizePrompt('article-generator');
```

---

## 📊 Performance Metrics

### Performance Score Calculation

The performance score is calculated using a weighted formula:

```
Performance Score = 
    (Quality Score × 0.4) +
    (Success Rate × 0.3) +
    (Cost Efficiency × 0.2) +
    (Speed Score × 0.1)
```

Where:
- **Quality Score**: Average quality score from content scorer (0-100)
- **Success Rate**: Percentage of successful executions (0-100)
- **Cost Efficiency**: Normalized cost efficiency (lower is better)
- **Speed Score**: Normalized latency (lower is better)

### Statistical Significance

A/B test results are analyzed using:
- Z-test for proportions
- 95% confidence level (default)
- Minimum sample size requirement
- Winner declared when statistically significant

---

## 🔐 Permissions

### Viewing Prompts
- **Admins:** Can view all prompts and versions
- **Others:** Cannot view prompts

### Managing Prompts
- **Admins:** Can create versions, manage A/B tests
- **System:** Automatically tracks performance
- **Service Role:** Can record performance

---

## 📊 Database Schema

### prompts Table (Enhanced)
- Version tracking
- A/B test group assignment
- Performance scores
- Quality metrics

### prompt_performance Table
- Detailed execution metrics
- Quality scores
- Engagement metrics
- Cost tracking

### ab_tests Table
- Test configuration
- Traffic splits
- Winner tracking
- Statistical significance

---

## 🎨 Best Practices

### 1. Version Management
- ✅ Create new versions for significant changes
- ✅ Keep old versions for rollback
- ✅ Test new versions in A/B tests first
- ✅ Monitor performance before activating

### 2. A/B Testing
- ✅ Use 50/50 splits for equal comparison
- ✅ Set appropriate minimum sample sizes
- ✅ Wait for statistical significance
- ✅ Analyze results regularly

### 3. Performance Optimization
- ✅ Track quality, cost, and speed
- ✅ Use auto-optimization carefully
- ✅ Review performance trends
- ✅ Consider context-specific prompts

---

## 🔍 Troubleshooting

### Prompt Not Found

**Problem:** `getBestPrompt` returns null.

**Solutions:**
1. Check prompt slug is correct
2. Verify prompt exists and is active
3. Check category filter
4. Review database logs

### A/B Test Not Assigning Groups

**Problem:** All users get same group.

**Solutions:**
1. Verify test is running
2. Check traffic split configuration
3. Verify user_id is passed
4. Check function logs

### Performance Not Updating

**Problem:** Performance scores not updating.

**Solutions:**
1. Verify `recordPromptPerformance` is called
2. Check trigger is firing
3. Verify function permissions
4. Review database logs

---

## 📈 Future Enhancements

- [ ] Multi-variant testing (A/B/C/D)
- [ ] Context-aware prompt selection
- [ ] ML-based prompt optimization
- [ ] Real-time performance dashboards
- [ ] Automated prompt generation

---

**Questions?** Check the code in `lib/ai/prompt-manager.ts` and `lib/ai/ab-testing.ts`
