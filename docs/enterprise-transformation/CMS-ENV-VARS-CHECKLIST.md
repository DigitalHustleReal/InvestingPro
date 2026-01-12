# CMS Environment Variables Checklist
**Complete List of Required and Optional Variables**

---

## ✅ REQUIRED Environment Variables

### Supabase (All 3 Required)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Why:**
- `NEXT_PUBLIC_SUPABASE_URL` - Database connection URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public client key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side operations (migrations, admin tasks)

---

## 🤖 AI Provider Variables (At Least ONE Required)

### Option 1: Ollama (Free, Local)
```env
OLLAMA_URL=http://localhost:11434
```
**Best for:** Local development, zero cost
**Note:** Requires Ollama installed and running locally

### Option 2: DeepSeek (Cheap, Recommended)
```env
DEEPSEEK_API_KEY=sk-...
```
**Best for:** Production, very low cost (~$0.14 per 1M tokens)

### Option 3: Groq (Fast, Low Cost)
```env
GROQ_API_KEY=gsk_...
```
**Best for:** Fast inference, low latency

### Option 4: OpenAI (Expensive, High Quality)
```env
OPENAI_API_KEY=sk-...
```
**Best for:** High-quality content when needed
**Note:** Only used when `priority: 'quality'` is set

### Option 5: Together AI (Open Models)
```env
TOGETHER_API_KEY=...
```
**Best for:** Open-source models, low cost

---

## ⚙️ Optional CMS Configuration

### Continuous Mode Interval (Optional)
```env
CYCLE_INTERVAL_MINUTES=60
```
**Default:** Not set (manual execution only)
**Purpose:** Sets interval for continuous content generation cycles

---

## 📋 Quick Checklist

### Minimum Required (4 variables):
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] At least ONE AI provider key (`OLLAMA_URL`, `DEEPSEEK_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY`, or `TOGETHER_API_KEY`)

### Recommended Setup:
- [ ] All 3 Supabase variables
- [ ] `DEEPSEEK_API_KEY` (for production - cheapest)
- [ ] `OLLAMA_URL` (for local development - free)
- [ ] `CYCLE_INTERVAL_MINUTES` (if using continuous mode)

---

## 🔍 How to Verify

Run the verification script:
```bash
npm run cms:verify
```

This will check:
- ✅ All required Supabase variables
- ✅ At least one AI provider configured
- ✅ Database connectivity
- ✅ Required tables exist

---

## 💡 Recommendations

### For Development:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# AI Provider (Free)
OLLAMA_URL=http://localhost:11434
```

### For Production:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# AI Provider (Cheap)
DEEPSEEK_API_KEY=sk-...

# Optional: Backup provider
GROQ_API_KEY=gsk_...
```

### For High-Quality Content:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Primary (Cheap)
DEEPSEEK_API_KEY=sk-...

# High-Quality (Expensive, used only when needed)
OPENAI_API_KEY=sk-...
```

---

## ⚠️ Important Notes

1. **Service Role Key:** Must be kept secret! Never expose in client-side code.
2. **AI Provider Priority:** System uses cost-first routing (Ollama → DeepSeek → Groq → Together → OpenAI)
3. **Multiple Providers:** You can set multiple AI providers - system will auto-select cheapest available
4. **Ollama Setup:** If using Ollama, ensure it's running: `ollama serve`

---

## 🚀 Next Steps

Once all required variables are set:

1. **Verify Setup:**
   ```bash
   npm run cms:verify
   ```

2. **Run Migration:**
   ```bash
   npm run cms:migrate
   ```

3. **Initialize CMS:**
   ```bash
   npm run cms:init
   ```

4. **Start Generating:**
   ```bash
   npm run dev
   # Then test with canary endpoint
   ```

---

**Status:** Ready to verify
**Action:** Run `npm run cms:verify` to check your current setup
