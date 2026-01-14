# Centralized Logging Setup

This document describes how to set up centralized logging with Axiom (or other services).

## 🎯 Recommended: Axiom (Free Tier)

**Why Axiom?**
- ✅ **500 GB/month FREE** (forever, no credit card)
- ✅ Fast, modern platform
- ✅ Great for startups
- ✅ Easy setup

**Alternative:** Better Stack (3 GB/month free) or Datadog (limited free tier)

---

## Quick Setup (5 minutes)

### Step 1: Sign Up for Axiom

1. Go to [https://axiom.co](https://axiom.co)
2. Click "Sign Up" (no credit card required)
3. Create a free account
4. Create a new dataset (e.g., `investingpro-logs`)

### Step 2: Get API Key

1. In Axiom dashboard, go to **Settings** → **API Tokens**
2. Click **Create Token**
3. Select your dataset
4. Copy the API token

### Step 3: Configure Environment Variables

Add to your `.env.local` (or Vercel environment variables):

```env
# Enable external logging
EXTERNAL_LOGGING_ENABLED=true

# Service selection (axiom, better-stack, or datadog)
EXTERNAL_LOGGING_SERVICE=axiom

# Axiom configuration
AXIOM_API_KEY=your-api-key-here
AXIOM_DATASET=investingpro-logs

# Optional: Batch configuration
EXTERNAL_LOGGING_BATCH_SIZE=10
EXTERNAL_LOGGING_FLUSH_INTERVAL=5000
```

### Step 4: Initialize Logging

The logging is automatically initialized when the app starts. No code changes needed!

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EXTERNAL_LOGGING_ENABLED` | No | `false` | Enable/disable external logging |
| `EXTERNAL_LOGGING_SERVICE` | No | `axiom` | Service: `axiom`, `better-stack`, `datadog` |
| `AXIOM_API_KEY` | Yes (if Axiom) | - | Axiom API token |
| `AXIOM_DATASET` | Yes (if Axiom) | - | Axiom dataset name |
| `BETTER_STACK_API_KEY` | Yes (if Better Stack) | - | Better Stack API token |
| `BETTER_STACK_SOURCE` | Yes (if Better Stack) | - | Better Stack source name |
| `DATADOG_API_KEY` | Yes (if Datadog) | - | Datadog API key |
| `EXTERNAL_LOGGING_BATCH_SIZE` | No | `10` | Number of logs to batch before sending |
| `EXTERNAL_LOGGING_FLUSH_INTERVAL` | No | `5000` | Flush interval in milliseconds |

---

## Using the Logger

The logger is already integrated. Just use it as normal:

```typescript
import { logger } from '@/lib/logger';

// Info log
logger.info('User logged in', { userId: '123' });

// Error log
logger.error('Failed to process payment', error, { orderId: '456' });

// Performance log
logger.performance('database_query', 150, { query: 'SELECT * FROM users' });
```

All logs are automatically forwarded to Axiom (if enabled).

---

## Log Structure

Each log entry includes:

```json
{
  "level": "info",
  "message": "User logged in",
  "timestamp": "2026-01-15T10:30:00.000Z",
  "correlationId": "req-123",
  "requestId": "req-456",
  "userId": "user-789",
  "service": "investingpro-api",
  "environment": "production",
  "context": {
    "additional": "data"
  },
  "metrics": {
    "duration": 150,
    "memory": 45
  }
}
```

---

## Querying Logs in Axiom

### Find logs by correlation ID:
```
['correlationId'] = 'req-123'
```

### Find errors in last hour:
```
['level'] = 'error' AND _time > now() - 1h
```

### Find slow API requests:
```
['metrics.duration'] > 1000 AND ['message'] LIKE 'API%'
```

### Find logs for specific user:
```
['userId'] = 'user-789'
```

---

## Better Stack Setup (Alternative)

If you prefer Better Stack:

```env
EXTERNAL_LOGGING_ENABLED=true
EXTERNAL_LOGGING_SERVICE=better-stack
BETTER_STACK_API_KEY=your-key-here
BETTER_STACK_SOURCE=investingpro-logs
```

**Note:** Better Stack free tier is 3 GB/month (vs 500 GB for Axiom).

---

## Datadog Setup (Alternative)

If you prefer Datadog:

```env
EXTERNAL_LOGGING_ENABLED=true
EXTERNAL_LOGGING_SERVICE=datadog
DATADOG_API_KEY=your-key-here
```

---

## Troubleshooting

### Logs not appearing in Axiom

1. **Check environment variables:**
   ```bash
   echo $EXTERNAL_LOGGING_ENABLED
   echo $AXIOM_API_KEY
   echo $AXIOM_DATASET
   ```

2. **Check logs are being created:**
   - Look for `[Logging] External logging initialized: axiom` in console
   - Check for error messages

3. **Verify API key:**
   - Test with curl:
   ```bash
   curl -X POST https://api.axiom.co/v1/datasets/YOUR_DATASET/ingest \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '[{"message": "test"}]'
   ```

4. **Check batch flushing:**
   - Logs are batched and flushed every 5 seconds
   - Or when batch size (10) is reached
   - On app shutdown, all logs are flushed

### Logs appearing but slow

- Increase `EXTERNAL_LOGGING_BATCH_SIZE` (e.g., 20)
- Increase `EXTERNAL_LOGGING_FLUSH_INTERVAL` (e.g., 10000)

### Too many logs

- Filter in code before logging
- Use log levels appropriately (debug only in development)
- Set up log retention in Axiom dashboard

---

## Cost Management

### Axiom Free Tier:
- **500 GB/month** - More than enough for a startup
- **Free forever** - No credit card required
- **When you exceed:** $0.030 per GB (very affordable)

### Monitoring Usage:
1. Go to Axiom dashboard → **Usage**
2. Set up alerts for approaching limits
3. Review logs to optimize unnecessary logging

---

## Best Practices

1. **Use appropriate log levels:**
   - `debug`: Development only
   - `info`: Important events
   - `warn`: Potential issues
   - `error`: Actual errors

2. **Include context:**
   ```typescript
   logger.error('Payment failed', error, {
     userId: user.id,
     orderId: order.id,
     amount: order.amount
   });
   ```

3. **Use correlation IDs:**
   - Automatically added by middleware
   - Helps trace requests across services

4. **Don't log sensitive data:**
   - No passwords, tokens, or PII
   - Use hashing or masking if needed

---

## Next Steps

- ✅ Logging setup complete
- 🔄 Next: Set up alerting (Task 4.2)
- 🔄 Next: Add distributed tracing (Task 5.1)

---

**Questions?** Check the code in `lib/logging/external-logger.ts` or `lib/logger.ts`
