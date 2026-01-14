# 🔑 Inngest API Keys Setup

**Date:** January 13, 2026  
**Status:** ✅ Keys Received - Ready to Configure

---

## 🔑 Your Inngest API Keys

You've provided your Inngest API keys. Here's how to add them:

### Event Key
```
EJhfpQ-6Vc60U3ziqwd1O4QsAQ13BGelG_F93VPSZjmpIesnhsx6cmXeRk9ndpgChp7jI-7svdgXVqBr51Yq1g
```

### Signing Key
```
signkey-prod-87bbb2bb3a6f761c51cedfb5491a239e754b363f1ca7c8fb5bdfc33a0bd03f29
```

---

## 📝 Step 1: Add to `.env.local`

Create or edit `.env.local` in your project root:

```env
# Inngest Configuration
INNGEST_EVENT_KEY=EJhfpQ-6Vc60U3ziqwd1O4QsAQ13BGelG_F93VPSZjmpIesnhsx6cmXeRk9ndpgChp7jI-7svdgXVqBr51Yq1g
INNGEST_SIGNING_KEY=signkey-prod-87bbb2bb3a6f761c51cedfb5491a239e754b363f1ca7c8fb5bdfc33a0bd03f29
```

**Important:**
- No spaces around the `=` sign
- No quotes around the values
- File should be in project root (same level as `package.json`)

---

## 📝 Step 2: Add to Deployment Platform

### If Using Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to: **Settings** → **Environment Variables**
4. Add:
   - **Name:** `INNGEST_EVENT_KEY`
   - **Value:** `EJhfpQ-6Vc60U3ziqwd1O4QsAQ13BGelG_F93VPSZjmpIesnhsx6cmXeRk9ndpgChp7jI-7svdgXVqBr51Yq1g`
   - **Environment:** Production, Preview, Development (select all)
5. Add:
   - **Name:** `INNGEST_SIGNING_KEY`
   - **Value:** `signkey-prod-87bbb2bb3a6f761c51cedfb5491a239e754b363f1ca7c8fb5bdfc33a0bd03f29`
   - **Environment:** Production, Preview, Development (select all)
6. **Redeploy** your application

---

## ✅ Step 3: Verify Setup

Run the verification script:

```bash
npx tsx scripts/verify-inngest-setup.ts
```

**Expected Output:**
```
🔍 Verifying Inngest Setup...

📊 Verification Results:

✅ Inngest Package: Package installed
✅ INNGEST_EVENT_KEY: Environment variable set
✅ INNGEST_SIGNING_KEY: Environment variable set
✅ Inngest Client: Client initialized
✅ API Route: API route exists
✅ Job Definitions: All job definitions exist

📈 Summary:
   ✅ Passed: 6
   ❌ Failed: 0
   ⚠️  Warnings: 0

🎉 All critical checks passed! Inngest is ready to use.
```

---

## 🚀 Step 4: Test the Queue

### Test Article Generation

```bash
# Test the API endpoint
curl -X POST http://localhost:3000/api/articles/generate-comprehensive \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Test Article",
    "category": "investing-basics",
    "wordCount": 1500
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Article generation queued",
  "jobId": "event-id-here",
  "status": "queued",
  "statusUrl": "/api/jobs/event-id-here/status"
}
```

### Check Inngest Dashboard

1. Visit: https://app.inngest.com
2. Go to: **Functions**
3. You should see 4 functions:
   - `generate-article`
   - `generate-comprehensive-article` ✅
   - `bulk-generate`
   - `image-generation`

---

## 🔍 Troubleshooting

### Keys Not Working?

1. **Check `.env.local` exists:**
   ```bash
   # Windows PowerShell
   Test-Path .env.local
   
   # Should return: True
   ```

2. **Verify keys are correct:**
   - No extra spaces
   - No quotes
   - Exact match (case-sensitive)

3. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   # Start again
   npm run dev
   ```

4. **Check environment variables are loaded:**
   ```bash
   # In Node.js/Next.js, environment variables are loaded at startup
   # Restart required after adding to .env.local
   ```

### Functions Not Appearing?

1. **Deploy first:**
   - Inngest discovers functions on deployment
   - Local development may not show in dashboard immediately

2. **Check `/api/inngest` route:**
   - Visit: `http://localhost:3000/api/inngest`
   - Should return function definitions (if Inngest dev server running)

3. **Verify route is accessible:**
   - Check `app/api/inngest/route.ts` exists
   - Check all job functions are exported

---

## 📊 Next Steps

After keys are configured:

1. ✅ **Verify setup** - Run verification script
2. ✅ **Test locally** - Test article generation
3. ✅ **Deploy** - Deploy to production
4. ✅ **Check dashboard** - Verify functions appear
5. ✅ **Update frontend** - Add job status polling

---

## 🔒 Security Notes

- ✅ `.env.local` is gitignored (won't be committed)
- ✅ Never commit API keys to git
- ✅ Use different keys for dev/prod if needed
- ✅ Rotate keys if compromised

---

*Inngest Keys Setup - January 13, 2026*
