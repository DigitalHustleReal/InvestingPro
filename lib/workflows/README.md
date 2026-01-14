# Workflow Engine & State Machine

**Status:** ✅ Production Ready (65% Complete)

---

## Overview

The Workflow Engine provides declarative workflow execution for content lifecycle management. It includes:

- **State Machine** - Validates and manages content state transitions
- **Workflow Engine** - Executes multi-step workflows with dependencies
- **Monitoring** - Debugging, metrics, and execution history
- **Integration** - Hooks for article lifecycle events

---

## Quick Start

### Start a Workflow

```typescript
import { workflowService } from '@/lib/workflows';
import { ARTICLE_PUBLISHING_WORKFLOW } from '@/lib/workflows/definitions';

const instance = await workflowService.startWorkflow(
  ARTICLE_PUBLISHING_WORKFLOW,
  { articleId: 'article-123' }
);
```

### State Transition

```typescript
import { workflowService } from '@/lib/workflows';

await workflowService.transitionContentState(
  'article',
  'article-123',
  'draft',
  'review',
  'submit',
  userId
);
```

### Monitor Workflow

```typescript
import { workflowMonitor } from '@/lib/workflows';

// Get workflow status
const status = await workflowService.getInstanceStatus(instanceId);

// Get execution history
const history = await workflowService.getExecutionHistory(instanceId);

// Debug workflow
const debug = await workflowMonitor.debugWorkflow(instanceId);

// Get metrics
const metrics = await workflowMonitor.getMetrics();
```

---

## Architecture

### Core Components

1. **State Machine** (`state-machine.ts`)
   - Validates state transitions
   - Enforces lifecycle rules
   - Tracks transition history

2. **Workflow Engine** (`workflow-engine.ts`)
   - Executes declarative workflows
   - Manages step dependencies
   - Handles errors and retries

3. **Workflow Repository** (`workflow-repository.ts`)
   - Persists workflow state
   - Stores execution history
   - Queries active/failed workflows

4. **Workflow Service** (`workflow-service.ts`)
   - High-level API
   - Integrates all components
   - Publishes events

5. **Workflow Monitor** (`workflow-monitor.ts`)
   - Metrics calculation
   - Debugging utilities
   - Execution summaries

---

## Workflow Definitions

### Article Publishing Workflow

```typescript
import { ARTICLE_PUBLISHING_WORKFLOW } from '@/lib/workflows/definitions';

// Steps:
// 1. validateArticle - Validates article content
// 2. generateSEO - Generates SEO metadata
// 3. publishArticle - Publishes article
```

### Content Generation Workflow

```typescript
import { CONTENT_GENERATION_WORKFLOW } from '@/lib/workflows/definitions';

// Steps:
// 1. researchTopic - Researches topic
// 2. generateContent - Generates content
// 3. qualityCheck - Checks content quality
// 4. reviewContent - Manual review (pauses workflow)
```

---

## State Machine

### Content States

- `draft` - Initial state, content being created
- `review` - Submitted for review
- `approved` - Approved for publication
- `scheduled` - Scheduled for future publication
- `published` - Published and live
- `archived` - Archived/removed from public view

### Valid Transitions

```
draft → review (submit)
review → draft (reject)
review → approved (approve)
approved → scheduled (schedule)
approved → published (publish)
scheduled → published (publish)
published → archived (archive)
any → draft (reset)
```

---

## Workflow Steps

### Step Configuration

```typescript
{
  id: 'step-id',
  name: 'Step Name',
  action: 'actionName',
  dependsOn: ['previous-step-id'], // Optional
  timeout: 30000, // Optional (ms)
  retry: {
    maxAttempts: 3,
    backoff: 'exponential'
  },
  onError: 'fail' | 'retry' | 'skip' | 'rollback',
  manual: false // If true, workflow pauses
}
```

### Available Actions

- `validateArticle` - Validates article content
- `generateSEO` - Generates SEO metadata
- `publishArticle` - Publishes article
- `researchTopic` - Researches topic
- `generateContent` - Generates content
- `qualityCheck` - Checks content quality
- `reviewContent` - Manual review step

---

## API Endpoints

### Start Workflow

```bash
POST /api/workflows/start
Content-Type: application/json

{
  "workflowName": "article-publishing",
  "context": {
    "articleId": "uuid-here"
  }
}
```

### Get Workflow Status

```bash
GET /api/workflows/{instanceId}/status
```

### State Transition

```bash
POST /api/workflows/state/transition
Content-Type: application/json

{
  "entityType": "article",
  "entityId": "uuid-here",
  "from": "draft",
  "to": "review",
  "action": "submit",
  "metadata": {}
}
```

### Get Metrics

```bash
GET /api/workflows/metrics?workflowId={id}&start={date}&end={date}
```

### Debug Workflow

```bash
GET /api/workflows/{instanceId}/debug
```

---

## Integration Hooks

### Article Publishing Hook

```typescript
import { triggerArticlePublishingWorkflow } from '@/lib/workflows/hooks/article-workflow-hooks';

const instanceId = await triggerArticlePublishingWorkflow(articleId);
```

### State Transition Hook

```typescript
import { transitionArticleState } from '@/lib/workflows/hooks/article-workflow-hooks';

await transitionArticleState(
  articleId,
  'draft',
  'review',
  'submit',
  userId
);
```

---

## Database Schema

### Tables

1. **workflow_definitions**
   - Stores workflow definitions
   - Versioned workflows

2. **workflow_instances**
   - Tracks workflow execution
   - Stores current state and context

3. **workflow_execution_history**
   - Step-by-step execution log
   - Input/output/errors for each step

4. **state_transitions**
   - Audit trail for state changes
   - Tracks who/what/when

---

## Error Handling

### Step Error Strategies

- `fail` - Fail workflow (default)
- `retry` - Retry step with backoff
- `skip` - Skip step and continue
- `rollback` - Rollback previous steps

### Example

```typescript
{
  id: 'generate-seo',
  action: 'generateSEO',
  onError: 'retry',
  retry: {
    maxAttempts: 3,
    backoff: 'exponential'
  }
}
```

---

## Monitoring

### Metrics

- Total workflows
- By state (pending, running, completed, failed, etc.)
- Average duration
- Success/failure rates

### Debugging

- Execution history
- Step-by-step timeline
- Error details
- Recommendations

---

## Testing

### Run Test Script

```bash
npx tsx scripts/test-workflow-system.ts
```

### Manual Testing

1. Start a workflow via API
2. Check status endpoint
3. Review execution history
4. Test state transitions
5. Verify error handling

---

## Best Practices

1. **Use Workflows for Complex Operations**
   - Multi-step processes
   - Operations requiring validation
   - Long-running tasks

2. **Keep Steps Atomic**
   - Each step should do one thing
   - Steps should be idempotent when possible

3. **Handle Errors Gracefully**
   - Use appropriate error strategies
   - Log errors for debugging
   - Provide user feedback

4. **Monitor Workflows**
   - Check metrics regularly
   - Debug failed workflows
   - Optimize slow workflows

---

## Future Enhancements

- [ ] Visual workflow editor
- [ ] Workflow templates UI
- [ ] Advanced retry strategies
- [ ] Workflow scheduling
- [ ] Parallel step execution
- [ ] Workflow versioning UI

---

## Related Documentation

- [Phase 3 Summary](../docs/PHASE3_SUMMARY.md)
- [Phase 3 Final Status](../docs/PHASE3_FINAL_STATUS.md)
- [Workflow API Documentation](../../app/api/workflows/README.md)

---

**Last Updated:** January 14, 2026
