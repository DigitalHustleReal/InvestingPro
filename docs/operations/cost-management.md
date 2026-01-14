# Cost Alerts & Budget Management

This document describes the cost alert and budget management system.

## 🎯 Overview

The cost management system provides:
- Daily and monthly budget tracking
- Automatic alerts at 50%, 80%, and 100% thresholds
- Auto-pause at 100% budget
- Daily cost reports
- Cost breakdown by provider and operation type
- Projected monthly cost calculations

---

## 📋 Budget Types

### Daily Budget
- **Default:** $50 USD per day
- **Tracks:** Cost, tokens, images
- **Alerts:** 50%, 80%, 100%
- **Auto-pause:** At 100%

### Monthly Budget
- **Default:** $1,500 USD per month
- **Tracks:** Total cost
- **Alerts:** 50%, 80%, 100%
- **Auto-pause:** At 100%

---

## 🔔 Alert Thresholds

### Daily Budget Alerts
- **50%:** Info alert - Budget at half
- **80%:** Warning alert - Budget nearly exhausted
- **100%:** Critical alert + Auto-pause - Budget exceeded

### Monthly Budget Alerts
- **50%:** Info alert - Half month budget used
- **80%:** Warning alert - Most of monthly budget used
- **100%:** Critical alert + Auto-pause - Monthly budget exceeded

---

## 📊 Cost Tracking

### By Provider
- OpenAI (GPT-4, GPT-3.5)
- Google Gemini
- Anthropic Claude
- Groq
- Mistral
- Other providers

### By Operation Type
- Premium content (GPT-4, Claude-3)
- Standard content (GPT-3.5, Gemini)
- Budget content (Groq, Mistral)
- Image generation
- Other operations

---

## 🔧 API Endpoints

### Get Cost Dashboard

```http
GET /api/v1/admin/cost-dashboard?start_date=2026-01-01&end_date=2026-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dailyBudget": {
      "budget_date": "2026-01-21",
      "max_cost_usd": 50.00,
      "cost_spent_usd": 25.50,
      "max_tokens": 1000000,
      "tokens_used": 500000,
      "max_images": 100,
      "images_used": 50,
      "is_paused": false
    },
    "monthlyBudget": {
      "budget_month": "2026-01-01",
      "max_cost_usd": 1500.00,
      "cost_spent_usd": 750.00,
      "is_paused": false
    },
    "providerBreakdown": [
      {
        "provider": "gemini",
        "total_cost": 12.50,
        "total_tokens": 50000,
        "operation_count": 10
      }
    ],
    "projection": {
      "current_month_cost": 750.00,
      "projected_monthly_cost": 1500.00,
      "budget_limit": 1500.00,
      "projected_over_budget": false
    }
  }
}
```

---

## 💻 Usage Examples

### Check Budget Before Generation

```typescript
import { BudgetGovernorAgent } from '@/lib/agents/budget-governor-agent';

const budgetGovernor = new BudgetGovernorAgent();
const status = await budgetGovernor.checkBudget(estimatedTokens, estimatedImages, estimatedCost);

if (!status.canGenerate) {
    console.error('Cannot generate:', status.reason);
    return;
}
```

### Record Cost

```typescript
const result = await budgetGovernor.recordCost(
    articleId,
    tokensUsed,
    costUSD,
    'gemini',
    'gemini-pro',
    imagesGenerated,
    imageCost
);

if (result.alertsTriggered > 0) {
    console.log(`${result.alertsTriggered} alerts triggered`);
}

if (result.autoPaused) {
    console.warn('Budget auto-paused at 100%');
}
```

### Set Daily Budget

```typescript
await budgetGovernor.setDailyBudget({
    maxTokensPerDay: 1000000,
    maxImagesPerDay: 100,
    maxCostPerDay: 50.00,
});
```

### View Cost Dashboard

```typescript
import CostDashboard from '@/components/admin/CostDashboard';

<CostDashboard />
```

---

## 🔐 Permissions

### Viewing Cost Data
- **Admins:** Can view all cost data
- **Others:** Cannot view cost data

### Managing Budgets
- **Admins:** Can set budgets, pause/resume
- **System:** Automatically tracks costs
- **Service Role:** Can record costs

---

## 📊 Database Schema

### daily_budgets Table
- Tracks daily budget limits and usage
- Alerts sent tracking
- Auto-pause status

### monthly_budgets Table
- Tracks monthly budget limits and usage
- Alert flags (50%, 80%, 100%)
- Auto-pause status

### content_costs Table
- Records all AI costs
- Provider and model tracking
- Token and image usage

### cost_alerts Table
- Stores all cost alerts
- Notification channels
- Acknowledgment tracking

---

## 🎨 Best Practices

### 1. Budget Management
- ✅ Set realistic daily/monthly budgets
- ✅ Monitor projected costs
- ✅ Review provider breakdown regularly
- ✅ Adjust budgets based on usage

### 2. Alert Response
- ✅ Acknowledge alerts promptly
- ✅ Review cost trends
- ✅ Adjust generation strategy if needed
- ✅ Resume paused budgets when ready

### 3. Cost Optimization
- ✅ Use cheaper providers for simple tasks
- ✅ Cache expensive operations
- ✅ Batch operations when possible
- ✅ Monitor cost per operation

---

## 🔍 Troubleshooting

### Budget Not Pausing

**Problem:** Budget reaches 100% but doesn't pause.

**Solutions:**
1. Check `check_and_trigger_cost_alerts()` function
2. Verify daily_budgets table updates
3. Check alert trigger cron job
4. Review database logs

### Alerts Not Sending

**Problem:** Cost alerts not being sent.

**Solutions:**
1. Check alert manager configuration
2. Verify notification channels
3. Check alert cooldown periods
4. Review alert logs

### Cost Not Recording

**Problem:** Costs not being tracked.

**Solutions:**
1. Verify `record_content_cost_with_alerts()` is called
2. Check content_costs table inserts
3. Verify RLS policies
4. Review function logs

---

## 📈 Future Enhancements

- [ ] Budget forecasting (ML-based)
- [ ] Cost optimization recommendations
- [ ] Provider cost comparison
- [ ] ROI-based budget allocation
- [ ] Custom budget periods (weekly, quarterly)

---

**Questions?** Check the code in `lib/agents/budget-governor-agent.ts` and `lib/notifications/cost-alerts.ts`
