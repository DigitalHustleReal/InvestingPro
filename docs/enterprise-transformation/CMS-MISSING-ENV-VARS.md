# CMS Missing Environment Variables
**What You Might Be Missing**

---

## 🔍 Based on Your `env.template`

I checked your `env.template` file. Here's what you have vs what CMS needs:

### ✅ You Already Have:
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅
- `GROQ_API_KEY` ✅
- `OPENAI_API_KEY` ✅

### ⚠️ CMS-Specific Variables That Might Be Missing:

#### 1. DeepSeek API Key (Recommended - Cheapest)
```env
DEEPSEEK_API_KEY=sk-...
```
**Why:** CMS uses cost-first routing. DeepSeek is the cheapest option (~$0.14 per 1M tokens).
**Status:** Not in your template, but optional if you have GROQ or OPENAI.

#### 2. Ollama URL (Free, Local)
```env
OLLAMA_URL=http://localhost:11434
```
**Why:** Free local AI for development/testing.
**Status:** Not in your template, but optional.

#### 3. Together AI Key (Open Models)
```env
TOGETHER_API_KEY=...
```
**Why:** Low-cost open models alternative.
**Status:** Not in your template, but optional.

#### 4. Continuous Mode (Optional)
```env
CYCLE_INTERVAL_MINUTES=60
```
**Why:** For automatic continuous content generation.
**Status:** Not in your template, optional.

---

## ✅ What You Need to Add

### Minimum (You're Good!):
Since you have:
- ✅ All 3 Supabase variables
- ✅ At least 1 AI provider (GROQ or OPENAI)

**You're ready to go!** No additional env vars required.

### Recommended Addition:
Add DeepSeek for cost savings:
```env
DEEPSEEK_API_KEY=sk-...
```

**Why:** CMS will automatically use DeepSeek first (cheapest), then fall back to GROQ/OPENAI if needed.

---

## 🚀 Next Steps

Since your env vars are already set:

1. **Verify Setup:**
   - Check that `SUPABASE_SERVICE_ROLE_KEY` is in your `.env.local`
   - Verify at least one AI provider key is set

2. **Run Migration:**
   ```bash
   # Option 1: Via Supabase Dashboard (Recommended)
   # Copy: supabase/migrations/20250115_cost_economic_intelligence_schema.sql
   # Paste in Supabase SQL Editor and run
   
   # Option 2: Via script (if tsx is installed)
   npm run cms:migrate
   ```

3. **Initialize CMS:**
   ```bash
   npm run cms:init
   ```

4. **Start Generating:**
   ```bash
   npm run dev
   # Then test: POST /api/cms/orchestrator/canary
   ```

---

## 📝 Summary

**Required Env Vars for CMS:**
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - You have it
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - You have it
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - You have it
- ✅ At least 1 AI provider - You have GROQ/OPENAI

**Optional (Recommended):**
- `DEEPSEEK_API_KEY` - Add for cost savings
- `OLLAMA_URL` - Add for free local testing
- `CYCLE_INTERVAL_MINUTES` - Add for continuous mode

---

**Status:** ✅ You have all required variables!
**Next:** Run migration and initialize CMS
