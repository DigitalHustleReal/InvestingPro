# Inngest Setup Guide - 24/7 Content Automation

## What is Inngest?
Inngest is a background job scheduler that handles cron jobs, retries, and monitoring. It's already integrated into your codebase and ready to activate.

## Quick Setup (5 Minutes)

### Step 1: Sign Up for Inngest (FREE)
1. Go to https://www.inngest.com/
2. Sign up with your email
3. Create a new project called "InvestingPro"

### Step 2: Get Your API Keys
1. In Inngest dashboard, go to **Settings** → **Keys**
2. Copy your **Event Key** (starts with `inngest_event_key_`)
3. Copy your **Signing Key** (starts with `signkey-prod-`)

### Step 3: Add Keys to .env.local
```bash
# Open .env.local and add these lines:
INNGEST_EVENT_KEY=your_event_key_here
INNGEST_SIGNING_KEY=your_signing_key_here
```

### Step 4: Restart Your Dev Server
```bash
# Press Ctrl+C to stop
# Then restart:
npm run dev
```

### Step 5: Verify Inngest Endpoint
```bash
# Test the endpoint:
curl http://localhost:3000/api/inngest

# You should see Inngest's response
```

### Step 6: Test Auto-Content Generation
```bash
# Trigger a manual test:
curl -X POST http://localhost:3000/api/inngest \
  -H "Content-Type: application/json" \
  -d '{"name": "cron/auto.content.generate", "data": {}}'
```

## What Happens Next?

Once activated, the system will:
- ✅ Run every 2 hours automatically
- ✅ Generate 10 articles per day
- ✅ Detect trending topics from RSS feeds
- ✅ Respond to events (Budget, RBI rate cuts)
- ✅ Quality-gate all content (only publish good articles)
- ✅ Save failed articles as drafts for review

## Monitoring

### Check Admin Dashboard
```
http://localhost:3000/admin
```

### View Inngest Dashboard
```
https://app.inngest.com/
```

### Check Generation Logs
```sql
SELECT * FROM generation_logs 
WHERE job_type = 'auto_content_generator'
ORDER BY created_at DESC;
```

## Inngest Free Tier Limits
- ✅ 50,000 function runs/month
- ✅ Unlimited cron jobs
- ✅ 7-day log retention
- ✅ Perfect for 10 articles/day (300/month)

## Troubleshooting

**Q: Cron job not running?**
- Check Inngest dashboard for errors
- Verify API keys are correct
- Check endpoint is accessible: `curl http://localhost:3000/api/inngest`

**Q: Articles not generating?**
- Check generation logs in admin dashboard
- Verify AI API keys (Gemini, Groq, etc.) are set
- Check Supabase connection

**Q: All articles going to draft?**
- Lower quality threshold in `lib/automation/article-generator.ts`
- Check plagiarism settings
- Review quality metrics in admin panel

## Next Steps

1. **Sign up for Inngest** (5 min)
2. **Add API keys** (1 min)
3. **Restart server** (1 min)
4. **Test first generation** (2 min)
5. **Monitor for 24 hours** (passive)

That's it! Your 24/7 content factory will be running.
