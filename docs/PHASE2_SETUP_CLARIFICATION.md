# 🔍 Phase 2: Setup Clarification - What Account?

**Date:** January 13, 2026

---

## 📋 The Account You Need

### **Inngest Account** (Message Queue Service)

**What is Inngest?**
- A serverless workflow and background job platform
- Handles long-running tasks (like article generation) asynchronously
- Prevents API timeouts
- Provides automatic retries and job tracking

**Why do you need an account?**
- The code is already migrated to use Inngest
- But Inngest requires API keys to work
- You get these keys from your Inngest account dashboard

---

## 🚀 Step-by-Step Setup

### Step 1: Create Inngest Account (5 minutes)

1. **Visit:** https://www.inngest.com
2. **Click "Sign Up"** (free tier available)
3. **Sign up with:**
   - Email address
   - Password
   - Or use GitHub/Google OAuth

**That's it!** No credit card required for free tier.

---

### Step 2: Get API Keys (2 minutes)

After signing up:

1. **Go to Dashboard:** https://app.inngest.com
2. **Navigate to:** Settings → Keys
3. **Copy these two keys:**
   - **Event Key** (starts with `evt_...`)
   - **Signing Key** (starts with `signkey_...`)

---

### Step 3: Add to Environment Variables (2 minutes)

Add to your `.env.local` file:

```env
INNGEST_EVENT_KEY=evt_your_event_key_here
INNGEST_SIGNING_KEY=signkey_your_signing_key_here
```

**Also add to:**
- Vercel environment variables (if deploying to Vercel)
- Any other deployment platform you use

---

### Step 4: Verify Setup (1 minute)

Run this command:
```bash
npx tsx scripts/verify-inngest-setup.ts
```

**Expected output:**
```
✅ Inngest Package: Package installed
✅ INNGEST_EVENT_KEY: Environment variable set
✅ INNGEST_SIGNING_KEY: Environment variable set
✅ Inngest Client: Client initialized
✅ API Route: API route exists
✅ Job Definitions: All job definitions exist
```

---

## 🎯 Why This Account is Needed

### Current Situation:
- ✅ Code is ready (migration complete)
- ✅ Routes use Inngest queue
- ❌ But Inngest can't connect without API keys
- ❌ Jobs won't execute without authentication

### After Setup:
- ✅ Inngest can authenticate
- ✅ Jobs will execute in background
- ✅ Article generation won't timeout
- ✅ You can track job status

---

## 💰 Cost

**Free Tier Includes:**
- 25,000 function invocations/month
- Unlimited events
- Basic monitoring
- Perfect for development and small-scale production

**Paid Plans:**
- Start at $20/month for higher limits
- Only needed if you exceed free tier

**For your use case:** Free tier should be sufficient initially.

---

## 🔄 Alternative: Skip Inngest (Not Recommended)

If you don't want to create an account right now:

1. **Keep routes synchronous** (current backup files)
2. **Risk:** API timeouts on long-running tasks
3. **Impact:** Article generation may fail on Vercel (10-60s limits)

**Recommendation:** Create the account - it's free and takes 5 minutes.

---

## 📝 Quick Checklist

- [ ] Visit https://www.inngest.com
- [ ] Sign up for free account
- [ ] Get Event Key from dashboard
- [ ] Get Signing Key from dashboard
- [ ] Add both to `.env.local`
- [ ] Run verification script
- [ ] Deploy and check dashboard

**Total Time:** ~10 minutes

---

## 🆘 Troubleshooting

### "I can't find the keys"
- Go to: https://app.inngest.com
- Click: Settings (gear icon)
- Click: Keys
- Copy both keys

### "Verification fails"
- Check keys are correct (no extra spaces)
- Check keys are in `.env.local` (not just `.env`)
- Restart dev server after adding keys

### "Functions don't appear in dashboard"
- Deploy your application first
- Inngest discovers functions on deployment
- Check: https://app.inngest.com → Functions

---

## 📚 Related Documentation

- `docs/INNGEST_SETUP_GUIDE.md` - Detailed setup guide
- `docs/PHASE2_MIGRATION_COMPLETE.md` - Migration status
- `docs/PHASE2_MIGRATION_STATUS.md` - Current progress

---

**TL;DR:** Create a free Inngest account at https://www.inngest.com, get API keys, add to `.env.local`. Takes ~10 minutes total.

*Setup Clarification - January 13, 2026*
