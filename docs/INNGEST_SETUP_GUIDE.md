# 🚀 Inngest Setup Guide

**Purpose:** Complete setup instructions for Inngest message queue integration

---

## 📋 Prerequisites

- Node.js project (Next.js)
- Vercel account (or deployment platform)
- Inngest account (free tier available)

---

## Step 1: Install Package

```bash
npm install inngest
```

---

## Step 2: Create Inngest Account

1. **Sign Up**
   - Go to https://www.inngest.com
   - Sign up for free account
   - Verify email

2. **Create App**
   - Click "Create App"
   - Name: `InvestingPro`
   - Environment: `Production` (or `Development` for testing)

3. **Get API Keys**
   - Go to Settings → API Keys
   - Copy:
     - **Event Key** (for sending events)
     - **Signing Key** (for webhook verification)

---

## Step 3: Add Environment Variables

### Local Development (`.env.local`)

```env
# Inngest Configuration
INNGEST_EVENT_KEY=your_event_key_here
INNGEST_SIGNING_KEY=your_signing_key_here

# Optional: Inngest Dev Server (for local testing)
INNGEST_DEV_SERVER_URL=http://localhost:8288
```

### Vercel Production

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add:
   - `INNGEST_EVENT_KEY` = `your_event_key`
   - `INNGEST_SIGNING_KEY` = `your_signing_key`
3. Apply to: Production, Preview, Development

---

## Step 4: Deploy to Vercel

1. **Push Code**
   ```bash
   git add .
   git commit -m "Add Inngest message queue integration"
   git push
   ```

2. **Vercel Auto-Deploy**
   - Vercel will automatically deploy
   - Inngest will discover functions via `/api/inngest`

3. **Verify Deployment**
   - Check Inngest Dashboard → Apps
   - Should see your app with 3 functions:
     - `generate-article`
     - `bulk-generate`
     - `generate-image`

---

## Step 5: Test Setup

### Option 1: Inngest Dashboard

1. Go to Inngest Dashboard → Events
2. Click "Send Event"
3. Event Name: `article/generate`
4. Event Data:
   ```json
   {
     "topic": "SIP vs SWP",
     "options": {
       "dryRun": false
     }
   }
   ```
5. Click "Send"
6. Check Functions → Should see job executing

### Option 2: API Test

```bash
curl -X POST https://your-domain.com/api/articles/generate-comprehensive \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "SIP vs SWP",
    "category": "mutual-funds"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Article generation queued"
}
```

---

## Step 6: Monitor Jobs

1. **Inngest Dashboard**
   - Go to Functions → View execution history
   - Check job status, logs, errors
   - Monitor performance metrics

2. **Application Logs**
   - Check Vercel logs for job execution
   - Verify event publishing
   - Check error handling

---

## 🔧 Troubleshooting

### Issue: Functions Not Appearing

**Solution:**
- Verify `/api/inngest/route.ts` exists
- Check environment variables are set
- Redeploy to Vercel
- Check Inngest Dashboard → Apps

### Issue: Jobs Not Executing

**Solution:**
- Check Inngest Dashboard → Events (verify events received)
- Check Vercel logs for errors
- Verify function IDs match event names
- Check environment variables

### Issue: Authentication Errors

**Solution:**
- Verify `INNGEST_SIGNING_KEY` is correct
- Check key hasn't expired
- Regenerate keys if needed

---

## 📊 Verification Checklist

- [ ] Package installed (`npm install inngest`)
- [ ] Inngest account created
- [ ] API keys obtained
- [ ] Environment variables added (local + Vercel)
- [ ] Code deployed to Vercel
- [ ] Functions appear in Inngest Dashboard
- [ ] Test event sent successfully
- [ ] Job executed without errors
- [ ] Logs show successful execution

---

## 🎯 Next Steps

After setup is complete:

1. **Migrate API Routes**
   - Update `/api/articles/generate-comprehensive` to use queue
   - Update `/api/cms/bulk-generate` to use queue
   - Test each migration

2. **Monitor Performance**
   - Track job execution times
   - Monitor error rates
   - Optimize as needed

3. **Add More Jobs**
   - Image generation
   - Social media posts
   - Batch operations

---

## 📝 Notes

- **Free Tier:** 25,000 function runs/month
- **Pricing:** $20/month for 100k runs
- **Local Dev:** Use Inngest Dev Server for testing
- **Production:** Functions auto-discover on Vercel

---

*Inngest Setup Guide - January 13, 2026*
