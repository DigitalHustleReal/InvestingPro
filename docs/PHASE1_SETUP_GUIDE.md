# Phase 1 Setup Guide

## ✅ Completed Implementations

### 1. Real OpenAI API Integration
- ✅ Installed `openai` package
- ✅ Updated `lib/api.ts` with real OpenAI integration
- ✅ Added fallback to mock if API key not configured
- ✅ Error handling and logging

**Usage:**
```typescript
const content = await api.integrations.Core.InvokeLLM({
  prompt: "Write an article about SIP investing..."
});
```

### 2. Python Scrapers → Supabase Connection
- ✅ Created `lib/scraper/supabase_writer.py`
- ✅ Updated `lib/scraper/pipeline.py` to use Supabase writer
- ✅ Added environment variable support

**Features:**
- Automatic upsert (update if exists, insert if new)
- Batch review writing
- Product analysis storage
- Error handling and logging

### 3. Automated Data Pipelines
- ✅ Created `/api/scraper/run` endpoint
- ✅ Created `/api/cron/scrape-mutual-funds` cron job
- ✅ Configured `vercel.json` for scheduled tasks

**Cron Schedule:** Daily at 6 PM IST (12:30 PM UTC)

### 4. Error Handling & Monitoring
- ✅ Created `ErrorBoundary` component
- ✅ Added to root layout
- ✅ Created centralized `logger` utility
- ✅ Integrated logging in API routes

### 5. Logging System
- ✅ Created `lib/logger.ts` with structured logging
- ✅ Different log levels (debug, info, warn, error)
- ✅ Production-ready monitoring hooks

## 🔧 Setup Instructions

### Step 1: Environment Variables

Create `.env.local` file in project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4o-mini

# Scraper Security
SCRAPER_SECRET=generate-random-secret-here
CRON_SECRET=generate-random-secret-here

# Base URL (auto-set on Vercel)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

**Generate Secrets:**
```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Python Dependencies

Install Python dependencies for scrapers:

```bash
cd lib/scraper
pip install -r requirements.txt
```

Or use virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3: Test Supabase Connection

Test the Supabase writer:

```bash
cd lib/scraper
python supabase_writer.py
```

Should output:
```
✓ Connected to Supabase
✓ Supabase connection successful
✓ Test write completed
```

### Step 4: Test Scraper Pipeline

Run the pipeline manually:

```bash
cd lib/scraper
python pipeline.py
```

Or via API:
```bash
curl -X POST http://localhost:3000/api/scraper/run \
  -H "Content-Type: application/json" \
  -d '{"type": "mutual_funds", "secret": "your-secret"}'
```

### Step 5: Deploy to Vercel

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Vercel will automatically:
- Set up cron jobs from `vercel.json`
- Configure function timeouts
- Handle scheduled tasks

## 🧪 Testing

### Test AI Content Generation

1. Go to Admin → AI Generator
2. Enter a topic (e.g., "Best SIP funds for 2025")
3. Click "Generate Article"
4. Should see real AI-generated content

### Test Error Boundary

1. Intentionally break a component
2. Should see error boundary UI instead of white screen
3. "Try Again" button should reset

### Test Logging

Check browser console for structured logs:
```
[2025-01-20T10:30:00.000Z] [INFO] Scraper started | Context: {"type":"mutual_funds"}
```

### Test Scraper API

```bash
# Health check
curl http://localhost:3000/api/scraper/run

# Run scraper
curl -X POST http://localhost:3000/api/scraper/run \
  -H "Content-Type: application/json" \
  -d '{"type": "mutual_funds", "secret": "your-secret"}'
```

## 📊 Monitoring

### Check Logs

**Development:**
- Browser console for client-side logs
- Terminal for server-side logs

**Production:**
- Vercel dashboard → Functions → Logs
- Supabase dashboard → Logs

### Monitor Cron Jobs

1. Vercel Dashboard → Cron Jobs
2. Check execution history
3. View logs for each run

### Database Monitoring

Check Supabase dashboard:
- `assets` table should have updated records
- `reviews` table should have new reviews
- Check `updated_at` timestamps

## 🐛 Troubleshooting

### OpenAI API Not Working

**Symptoms:** Mock responses instead of real AI

**Fix:**
1. Check `OPENAI_API_KEY` is set
2. Verify key is valid
3. Check API quota/billing
4. Review error logs

### Scraper Not Writing to Supabase

**Symptoms:** No data in database after running scraper

**Fix:**
1. Verify `SUPABASE_SERVICE_KEY` is set
2. Check Supabase connection: `python supabase_writer.py`
3. Verify table schemas match
4. Check Supabase logs for errors

### Cron Job Not Running

**Symptoms:** Scheduled tasks not executing

**Fix:**
1. Verify `vercel.json` is committed
2. Check Vercel cron configuration
3. Verify `CRON_SECRET` matches
4. Check Vercel function logs

### Error Boundary Not Catching Errors

**Symptoms:** Still seeing white screen on errors

**Fix:**
1. Verify `ErrorBoundaryProvider` wraps app in `layout.tsx`
2. Check component is client-side (`"use client"`)
3. Verify error is React error (not async/network)

## 📝 Next Steps

After Phase 1 is complete:

1. **Phase 2:** Content Factory Launch
   - Generate 1,000+ product pages
   - Create pillar pages
   - Implement structured data

2. **Phase 3:** Multi-Language Expansion
   - Set up next-intl
   - Translate core content
   - Create language-specific pages

3. **Phase 4:** Advanced Features
   - ML-enhanced ranking
   - Personalization
   - Mobile app

## 🔐 Security Notes

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Rotate secrets regularly** - Especially `SCRAPER_SECRET` and `CRON_SECRET`
3. **Use service keys carefully** - `SUPABASE_SERVICE_KEY` bypasses RLS
4. **Rate limit API endpoints** - Add rate limiting to `/api/scraper/run`
5. **Monitor API usage** - Track OpenAI API costs

## 📚 Additional Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Supabase Python Client](https://supabase.com/docs/reference/python/introduction)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Next.js Error Boundaries](https://nextjs.org/docs/app/building-your-application/routing/error-handling)

---

**Last Updated:** January 2025  
**Status:** Phase 1 Complete ✅

