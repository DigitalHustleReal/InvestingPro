# 🎭 Staging Environment Setup Guide

## ✅ Branch Created

```
Staging Branch: staging
GitHub: https://github.com/DigitalHustleReal/InvestingPro/tree/staging
```

---

## 🚀 Option 1: Vercel Preview (Easiest)

Vercel automatically creates preview URLs for each branch.

### Step 1: Go to Vercel Dashboard
```
https://vercel.com/dashboard
```

### Step 2: Find Your Project
Look for "InvestingPro" or import from GitHub if not already connected.

### Step 3: Check Preview Deployments
The `staging` branch will automatically have a preview URL like:
```
https://investingpro-git-staging-your-username.vercel.app
```

### Step 4: Test on Staging URL
```bash
# Test the staging deployment
curl https://investingpro-git-staging-your-username.vercel.app/api/cms/budget
```

---

## 🚀 Option 2: Separate Vercel Project (More Isolated)

For complete separation:

### Step 1: Create New Vercel Project
```bash
# In your project directory
vercel --name investingpro-staging
```

### Step 2: Link to Staging Branch
In Vercel Dashboard:
1. Go to Project Settings → Git
2. Set "Production Branch" to `staging`

### Step 3: Add Environment Variables
Copy all env vars from production to staging project.

---

## 🗄️ Database Options

### Option A: Same Database (Recommended for Testing)
- Uses same Supabase instance
- Articles marked as `status: 'draft'` won't affect production content
- ✅ Already configured!

### Option B: Separate Database (Full Isolation)
1. Create new Supabase project: `investingpro-staging`
2. Run all migrations
3. Update `.env.local` with new Supabase URL/keys
4. Deploy with these new env vars

---

## 📋 Testing Checklist for Staging

Run these tests on staging before promoting to production:

### 1. Health Check
```bash
curl https://your-staging-url.vercel.app/api/cms/budget
```

### 2. Generate Test Articles (10-20)
```bash
# Generate 5 articles in different categories
for category in "mutual-funds" "credit-cards" "loans" "insurance" "tax-planning"; do
  curl -X POST https://your-staging-url.vercel.app/api/cms/orchestrator/canary \
    -H "Content-Type: application/json" \
    -d "{\"topic\":\"Best $category Guide\",\"category\":\"$category\"}"
  sleep 60  # Wait between articles
done
```

### 3. Review Generated Content
- Check article titles are personal finance focused
- Verify authors are assigned correctly
- Confirm images are present
- Review content quality

### 4. Check Costs
```bash
curl https://your-staging-url.vercel.app/api/cms/budget
```
Verify tokens/cost usage is reasonable.

---

## ✅ When Staging Tests Pass

### Promote to Production:

```bash
# Merge staging to master
git checkout master
git merge staging
git push origin master
```

### Or via GitHub:
1. Create Pull Request: `staging` → `master`
2. Review changes
3. Merge PR
4. Vercel auto-deploys production

---

## 🔄 Workflow Summary

```
Development (local)
      ↓
   staging branch
      ↓
Preview URL (Vercel auto-generates)
      ↓
Run 10-20 test articles
      ↓
Review quality
      ↓
Merge to master
      ↓
Production deployment
```

---

## 📊 Current Status

| Environment | Branch | Status |
|-------------|--------|--------|
| Local Dev | `platform-ready` | ✅ Tested |
| Staging | `staging` | ✅ Branch created, awaiting deployment |
| Production | `master` | Pending staging approval |
