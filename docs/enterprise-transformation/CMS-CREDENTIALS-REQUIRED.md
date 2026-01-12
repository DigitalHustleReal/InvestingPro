# CMS Credentials & API Keys Required
**Complete Guide to Required Credentials**

---

## 🔑 Required Credentials

### ✅ CRITICAL (Must Have)

#### 1. Supabase Database
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Where to get:**
- Go to https://supabase.com
- Create/select project
- Go to Settings → API
- Copy URL and keys

**Why needed:**
- All data storage
- Agent execution logs
- Performance tracking
- Scraper management
- Authentication

---

#### 2. At Least One AI Provider

**Option A: OpenAI (Recommended for Quality)**
```env
OPENAI_API_KEY=sk-...
```

**Option B: Groq (Recommended for Speed)**
```env
GROQ_API_KEY=gsk_...
```

**Option C: DeepSeek (Recommended for Cost)**
```env
DEEPSEEK_API_KEY=sk-...
```

**Option D: Ollama (Local, Free)**
```env
OLLAMA_URL=http://localhost:11434
```

**Where to get:**
- **OpenAI:** https://platform.openai.com/api-keys
- **Groq:** https://console.groq.com/keys
- **DeepSeek:** https://platform.deepseek.com/api_keys
- **Ollama:** Install locally, no API key needed

**Why needed:**
- Content generation
- Keyword research
- Strategy generation
- Quality evaluation
- Pattern identification

---

### ⚠️ OPTIONAL (Recommended)

#### 3. Additional AI Providers (For Fallback)

```env
# Together AI
TOGETHER_API_KEY=...

# Hugging Face
HUGGINGFACE_API_KEY=...

# Mistral
MISTRAL_API_KEY=...
```

**Why recommended:**
- Fallback if primary provider fails
- Cost optimization
- Speed optimization

---

#### 4. Image Generation (Optional)

```env
# OpenAI DALL-E
OPENAI_API_KEY=sk-... # (same as above)

# Or other image providers
STABILITY_AI_API_KEY=...
MIDJOURNEY_API_KEY=...
```

**Why optional:**
- System can work without images
- Can use placeholder images
- Can generate images later

---

#### 5. SEO & Analytics (Optional)

```env
# SERP API (for keyword research)
SERPAPI_KEY=...

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Why optional:**
- Basic keyword research works without SERP API
- Analytics can be added later

---

## 📋 Complete Environment Variables

### Copy to `.env.local`:

```env
# ===========================================
# DATABASE (REQUIRED)
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ===========================================
# AI PROVIDERS (AT LEAST ONE REQUIRED)
# ===========================================
# Primary (choose one or more)
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
DEEPSEEK_API_KEY=sk-...

# Optional (for fallback)
TOGETHER_API_KEY=...
HUGGINGFACE_API_KEY=...
MISTRAL_API_KEY=...

# Local (optional, free)
OLLAMA_URL=http://localhost:11434

# ===========================================
# SCHEDULING (OPTIONAL)
# ===========================================
CYCLE_INTERVAL_MINUTES=1440  # 24 hours (default)

# ===========================================
# APPLICATION CONFIG
# ===========================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🚀 Setup Steps

### Step 1: Get Supabase Credentials

1. Go to https://supabase.com
2. Sign up / Log in
3. Create new project (or use existing)
4. Wait for project to initialize
5. Go to Settings → API
6. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Get AI Provider API Key

**For OpenAI:**
1. Go to https://platform.openai.com
2. Sign up / Log in
3. Go to API Keys
4. Create new secret key
5. Copy to `OPENAI_API_KEY`

**For Groq:**
1. Go to https://console.groq.com
2. Sign up / Log in
3. Go to API Keys
4. Create new API key
5. Copy to `GROQ_API_KEY`

**For DeepSeek:**
1. Go to https://platform.deepseek.com
2. Sign up / Log in
3. Go to API Keys
4. Create new API key
5. Copy to `DEEPSEEK_API_KEY`

**For Ollama (Local):**
1. Install Ollama: https://ollama.ai
2. Run: `ollama serve`
3. Set: `OLLAMA_URL=http://localhost:11434`
4. No API key needed!

### Step 3: Run Database Migrations

```bash
# Apply performance tracking schema
psql $DATABASE_URL -f supabase/migrations/20250115_performance_tracking_schema.sql

# Apply scraper tracking schema
psql $DATABASE_URL -f supabase/migrations/20250115_scraper_tracking_schema.sql
```

### Step 4: Test Configuration

```typescript
// Test script
import { createClient } from '@/lib/supabase/client';
import { multiProviderAI } from '@/lib/ai/providers/multi-provider';

// Test Supabase
const supabase = createClient();
const { data } = await supabase.from('articles').select('id').limit(1);
console.log('Supabase:', data ? '✅ Connected' : '❌ Failed');

// Test AI Provider
try {
    const result = await multiProviderAI.generate({
        prompt: 'Test',
        priority: 'quality'
    });
    console.log('AI Provider:', result ? '✅ Working' : '❌ Failed');
} catch (error) {
    console.log('AI Provider:', '❌ Failed', error);
}
```

---

## 💰 Cost Estimates

### Free Tier Options

1. **Ollama** - 100% Free (Local)
   - No API costs
   - Requires local setup
   - Good for development

2. **Groq** - Free Tier Available
   - Generous free usage
   - Fast inference
   - Good for production

3. **DeepSeek** - Very Low Cost
   - $0.14 per 1M tokens
   - High quality
   - Good for production

### Paid Options

1. **OpenAI** - $2-30 per 1M tokens
   - Highest quality
   - Best for production
   - GPT-4o-mini is cost-effective

2. **Together AI** - $0.20-0.60 per 1M tokens
   - Open models
   - Good balance

---

## 🔒 Security Notes

### Never Commit These Files:
- `.env.local`
- `.env`
- Any file with API keys

### Best Practices:
1. ✅ Use `.env.local` for local development
2. ✅ Use environment variables in production (Vercel, etc.)
3. ✅ Never log API keys
4. ✅ Rotate keys regularly
5. ✅ Use service role key only server-side

---

## ✅ Verification Checklist

- [ ] Supabase URL set
- [ ] Supabase Anon Key set
- [ ] Supabase Service Role Key set
- [ ] At least one AI provider API key set
- [ ] Database migrations run
- [ ] Test connection successful
- [ ] Test AI generation successful

---

## 🆘 Troubleshooting

### "Supabase not configured"
- ✅ Check `.env.local` exists
- ✅ Check variable names are correct
- ✅ Restart dev server after adding env vars

### "AI Provider failed"
- ✅ Check API key is valid
- ✅ Check API key has credits/quota
- ✅ Check internet connection
- ✅ Try different provider

### "Database migration failed"
- ✅ Check Supabase connection
- ✅ Check you have admin access
- ✅ Check SQL syntax
- ✅ Check tables don't already exist

---

## 📞 Support

If you need help:
1. Check error logs
2. Verify all credentials
3. Test each component individually
4. Check documentation

**All credentials are stored securely and never logged or exposed! 🔒**
