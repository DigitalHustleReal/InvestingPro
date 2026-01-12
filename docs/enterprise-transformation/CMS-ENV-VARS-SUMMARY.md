# CMS Environment Variables - Quick Summary
**What You Need for CMS to Work**

---

## ✅ REQUIRED (4 Minimum)

### 1. Supabase (3 variables - ALL required)
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. AI Provider (1 variable - at least ONE required)
```env
# Option 1: Free (Local)
OLLAMA_URL=http://localhost:11434

# Option 2: Cheap (Recommended for Production)
DEEPSEEK_API_KEY=sk-...

# Option 3: Fast
GROQ_API_KEY=gsk_...

# Option 4: High Quality (Expensive)
OPENAI_API_KEY=sk-...

# Option 5: Open Models
TOGETHER_API_KEY=...
```

---

## ⚙️ OPTIONAL

### Continuous Mode (Optional)
```env
CYCLE_INTERVAL_MINUTES=60
```
Only needed if you want automatic continuous content generation.

---

## 🔍 Quick Check

Since you mentioned environment variables are already there, here's what to verify:

### Must Have:
- [x] `NEXT_PUBLIC_SUPABASE_URL` - Check if set
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Check if set
- [x] `SUPABASE_SERVICE_ROLE_KEY` - Check if set
- [x] At least ONE AI provider key - Check which one(s) you have

### CMS-Specific (May be missing):
- [ ] `CYCLE_INTERVAL_MINUTES` - Only if using continuous mode

---

## 💡 What to Check

Since your env vars are already set, the most likely missing ones for CMS are:

1. **`SUPABASE_SERVICE_ROLE_KEY`** - This is often missing because it's only needed for server-side operations (migrations, admin tasks). The CMS needs this for:
   - Running migrations
   - Budget management
   - Cost tracking
   - Health monitoring

2. **AI Provider Key** - Make sure you have at least ONE of:
   - `DEEPSEEK_API_KEY` (recommended - cheapest)
   - `GROQ_API_KEY` (fast)
   - `OLLAMA_URL` (free, local)
   - `OPENAI_API_KEY` (expensive, high quality)
   - `TOGETHER_API_KEY` (open models)

---

## 🚀 Next Steps

1. **Verify your `.env.local` has:**
   - All 3 Supabase variables
   - At least 1 AI provider key

2. **If `SUPABASE_SERVICE_ROLE_KEY` is missing:**
   - Get it from Supabase Dashboard → Settings → API
   - Add to `.env.local`

3. **Run migration:**
   ```bash
   # Via Supabase Dashboard (Recommended)
   # OR
   npm run cms:migrate
   ```

4. **Initialize:**
   ```bash
   npm run cms:init
   ```

---

## 📝 Note

The CMS system will work with just the 4 minimum variables:
- 3 Supabase variables
- 1 AI provider key

Everything else is optional!

---

**Status:** Ready to proceed
**Action:** Verify `SUPABASE_SERVICE_ROLE_KEY` is set, then run migration
