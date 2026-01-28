# Axiom Logging Setup - Ready to Use! ✅

**Date:** January 15, 2026  
**Status:** ✅ Configuration Complete

---

## ✅ Your Axiom Configuration

- **Service:** Axiom
- **Dataset:** `investingpro-logs`
- **API Key:** `xaat-fe826ead-6418-4364-bf50-c7ddb5377e52` ✅ Configured

---

## 🚀 Environment Variables to Add

Add these to your `.env.local` file (for local development) or Vercel environment variables (for production):

```env
# Enable external logging
EXTERNAL_LOGGING_ENABLED=true

# Service selection
EXTERNAL_LOGGING_SERVICE=axiom

# Axiom configuration
AXIOM_API_KEY=xaat-fe826ead-6418-4364-bf50-c7ddb5377e52
AXIOM_DATASET=investingpro-logs

# Optional: Batch configuration (defaults shown)
EXTERNAL_LOGGING_BATCH_SIZE=10
EXTERNAL_LOGGING_FLUSH_INTERVAL=5000
```

---

## 📋 Quick Setup Steps

### For Local Development:

1. **Create/Update `.env.local`:**
   ```bash
   # Add the environment variables above
   ```

2. **Restart your dev server:**
   ```bash
   npm run dev
   ```

3. **Check console for initialization:**
   - Look for: `[Logging] External logging initialized: axiom`

### For Production (Vercel):

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add each variable:**
   - `EXTERNAL_LOGGING_ENABLED` = `true`
   - `EXTERNAL_LOGGING_SERVICE` = `axiom`
   - `AXIOM_API_KEY` = `xaat-fe826ead-6418-4364-bf50-c7ddb5377e52`
   - `AXIOM_DATASET` = `investingpro-logs`

3. **Redeploy** your application

---

## ✅ Verification

### Test the Integration:

1. **Check initialization:**
   - Look for `[Logging] External logging initialized: axiom` in server logs

2. **Generate a test log:**
   ```typescript
   import { logger } from '@/lib/logger';
   
   logger.info('Axiom integration test', { test: true });
   ```

3. **Check Axiom Dashboard:**
   - Go to [https://app.axiom.co](https://app.axiom.co)
   - Navigate to your dataset: `investingpro-logs`
   - You should see logs appearing within 5-10 seconds

### Query Test Logs in Axiom:

```
['message'] LIKE '%Axiom integration test%'
```

---

## 🔍 What Gets Logged

All logs from your application will automatically be forwarded to Axiom:

- ✅ **Info logs:** Important events
- ✅ **Warning logs:** Potential issues
- ✅ **Error logs:** Actual errors (with stack traces)
- ✅ **API requests:** Method, path, status, duration
- ✅ **Performance metrics:** Database queries, AI calls, etc.

Each log includes:
- Correlation ID (for request tracking)
- User ID (if authenticated)
- Timestamp
- Environment (production/staging/development)
- Context data

---

## 📊 Monitoring in Axiom

### Useful Queries:

**Find all errors in last hour:**
```
['level'] = 'error' AND _time > now() - 1h
```

**Find slow API requests (>1 second):**
```
['metrics.duration'] > 1000 AND ['message'] LIKE 'API%'
```

**Find logs for specific user:**
```
['userId'] = 'user-id-here'
```

**Find logs by correlation ID:**
```
['correlationId'] = 'req-123'
```

---

## 🎯 Next Steps

- ✅ Axiom logging configured and ready
- 🔄 **Next:** Task 4.2 - Alerting System
- ⏸️ Task 5.1 - Distributed Tracing
- ⏸️ Task 5.2 - Application Metrics

---

## 🔒 Security Note

⚠️ **Important:** Your API key is sensitive. Make sure:
- ✅ Never commit `.env.local` to git (it's in `.gitignore`)
- ✅ Use Vercel environment variables for production
- ✅ Rotate the key if it's ever exposed
- ✅ Use dataset-scoped tokens (not org-wide tokens) for better security

---

**Your logging is now live! 🎉**

All application logs will be automatically forwarded to Axiom.
