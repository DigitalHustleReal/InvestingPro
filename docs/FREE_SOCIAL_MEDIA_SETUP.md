# Free Social Media Automation Setup Guide

## Overview
This guide explains how to set up social media automation using **free tier** APIs and services.

## Current Status

### ✅ Email (Resend) - COMPLETE
- **Status:** Fully integrated
- **Free Tier:** 100 emails/day, 3,000 emails/month
- **Setup:** Just add `RESEND_API_KEY` to environment variables
- **Usage:** Automated newsletter emails for new articles

### ⚠️ Twitter - PARTIAL (Free Tier Available)
- **Status:** Code ready, requires API keys
- **Free Tier:** 1,500 tweets/month, 10,000 reads/month
- **Setup Required:**
  1. Apply for Twitter Developer Account (free)
  2. Create a Twitter App
  3. Get Bearer Token or OAuth credentials
  4. Add to environment variables

### ❌ LinkedIn - NOT FREE
- **Status:** Requires paid API access
- **Alternative:** Use RSS feed + IFTTT/Zapier free tier (see below)

---

## Twitter API v2 Free Tier Setup

### Step 1: Apply for Twitter Developer Account
1. Go to https://developer.twitter.com/
2. Sign in with your Twitter account
3. Apply for Developer Access (free, usually approved quickly)
4. Fill out the application form

### Step 2: Create Twitter App
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Click "Create App" or "Create Project"
3. Give your app a name (e.g., "InvestingPro Bot")
4. Get your API credentials

### Step 3: Get Bearer Token (Easiest Method)
1. In your Twitter App settings, go to "Keys and tokens"
2. Generate "Bearer Token" (OAuth 2.0)
3. Copy the token

### Step 4: Add to Environment Variables
```bash
# .env.local or Vercel Environment Variables
TWITTER_BEARER_TOKEN=your_bearer_token_here
```

### Step 5: Test
The automation will automatically use Twitter API when `TWITTER_BEARER_TOKEN` is configured.

**Free Tier Limits:**
- ✅ 1,500 tweets/month (50/day)
- ✅ 10,000 tweet reads/month
- ⚠️ Rate limits: 300 requests per 15 minutes

---

## LinkedIn - Free Alternative via RSS Feed

Since LinkedIn API requires paid access, we use RSS feed + free automation services:

### Option 1: IFTTT (Free Tier)
1. **Create RSS Feed** (already implemented in code)
   - Feed URL: `https://investingpro.in/api/rss/articles`
   
2. **Set up IFTTT Applet**
   - Trigger: RSS feed new item
   - Action: Post to LinkedIn
   - Connect your LinkedIn account
   - Map RSS fields to LinkedIn post

3. **Free Tier:** 5 applets, unlimited executions

### Option 2: Zapier (Free Tier)
1. **Create Zap**
   - Trigger: RSS feed new item
   - Action: Post to LinkedIn
   
2. **Free Tier:** 5 Zaps, 100 tasks/month

### Option 3: Manual Posting from Database
The code stores LinkedIn posts in the database table `social_posts`:
- Status: `pending`
- Platform: `linkedin`
- Content: Generated post text

You can create an admin dashboard to view and copy these posts for manual posting.

---

## Facebook/Instagram - Free via RSS

Same approach as LinkedIn:
1. Use RSS feed (`/api/rss/articles`)
2. Connect via IFTTT/Zapier free tier
3. Auto-post when new article published

---

## RSS Feed Setup (Universal Free Solution)

### Current Implementation
- **Endpoint:** `/api/rss/articles` (if exists) or generate RSS from articles table
- **Format:** Standard RSS 2.0
- **Fields:** Title, Description, Link, Published Date

### Using RSS Feed
1. **IFTTT/Zapier:** Connect RSS feed as trigger
2. **Buffer (Free Tier):** 3 social accounts, 10 scheduled posts
3. **Hootsuite (Free Tier):** 3 social profiles, 30 scheduled posts

---

## Environment Variables Summary

### Required for Email (Resend):
```bash
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=InvestingPro <newsletter@investingpro.in>
```

### Optional for Twitter (Free Tier):
```bash
TWITTER_BEARER_TOKEN=your_bearer_token
```

### Optional for Revenue Reports:
```bash
REVENUE_REPORT_EMAIL=admin@investingpro.in,founder@investingpro.in
```

---

## Current Automation Flow

### Email (✅ Working):
1. New article published → Triggers content distribution cron
2. Fetches newsletter subscribers from database
3. Generates HTML email
4. Sends via Resend API (batches of 50)
5. Logs success/failure

### Twitter (⚠️ Needs Setup):
1. New article published → Generates Twitter post
2. Stores in `social_posts` table (status: pending)
3. If `TWITTER_BEARER_TOKEN` configured → Posts via API
4. If not configured → Post remains in database for manual posting

### LinkedIn (❌ Requires Manual/RSS):
1. New article published → Generates LinkedIn post
2. Stores in `social_posts` table (status: pending)
3. Either:
   - Manual posting from admin dashboard
   - RSS feed → IFTTT/Zapier → LinkedIn

---

## Recommended Setup for Free Tier

### Minimum Setup (Email Only):
1. ✅ Configure `RESEND_API_KEY`
2. ✅ Set `RESEND_FROM_EMAIL`
3. ✅ Done! Newsletter emails will send automatically

### Full Free Setup (Email + Twitter):
1. ✅ Configure Resend (above)
2. ✅ Get Twitter Developer Account
3. ✅ Add `TWITTER_BEARER_TOKEN`
4. ✅ Done! Auto-posting to Twitter + Email

### Maximum Free Setup (All Platforms):
1. ✅ Configure Resend
2. ✅ Configure Twitter
3. ✅ Create RSS feed endpoint
4. ✅ Set up IFTTT/Zapier applets for LinkedIn/Facebook
5. ✅ Done! Multi-platform automation

---

## Cost Summary

| Service | Free Tier | Cost After Free Tier |
|---------|-----------|---------------------|
| Resend | 100 emails/day | $20/month for 50k emails |
| Twitter API | 1,500 tweets/month | Free (no paid tier needed) |
| IFTTT | 5 applets | $3.99/month |
| Zapier | 5 Zaps, 100 tasks/month | $20/month |
| RSS Feed | Unlimited | Free (self-hosted) |

**Total Cost for Full Automation: $0/month** (using free tiers)

---

## Troubleshooting

### Email Not Sending
- ✅ Check `RESEND_API_KEY` is set
- ✅ Check `RESEND_FROM_EMAIL` format: `Name <email@domain.com>`
- ✅ Verify Resend account has verified sending domain
- ✅ Check Resend dashboard for rate limits (100/day free tier)

### Twitter Not Posting
- ✅ Check `TWITTER_BEARER_TOKEN` is set
- ✅ Verify Twitter Developer account is approved
- ✅ Check Twitter API rate limits (300/15min)
- ✅ Check monthly tweet limit (1,500/month)

### LinkedIn Posts Not Auto-Posting
- ⚠️ LinkedIn API requires paid access
- ✅ Use RSS feed + IFTTT/Zapier as alternative
- ✅ Or use manual posting from admin dashboard

---

## Next Steps

1. ✅ **Complete Resend Setup** (if not done)
2. ⚠️ **Optional: Set up Twitter API** (free, but requires developer account)
3. ⚠️ **Optional: Set up RSS feed** for LinkedIn/Facebook automation
4. ✅ **Test email automation** with a test article
5. ✅ **Monitor usage** to stay within free tier limits

---

**Last Updated:** January 23, 2026  
**Status:** Email ✅ | Twitter ⚠️ | LinkedIn ❌ (RSS alternative available)
