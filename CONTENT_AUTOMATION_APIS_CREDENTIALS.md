# 🤖 Content Automation - Required APIs & Credentials

## Overview
This document lists all APIs, credentials, and services required to fully automate content generation for InvestingPro articles.

---

## 📋 **Table of Contents**
1. [AI Content Generation](#ai-content-generation)
2. [Database & Storage](#database--storage)
3. [SEO & Analytics](#seo--analytics)
4. [Image Generation](#image-generation)
5. [Data Sources](#data-sources)
6. [Optional Enhancements](#optional-enhancements)
7. [Environment Variables Setup](#environment-variables-setup)

---

## 🤖 **1. AI Content Generation**

### **Primary: OpenAI API**
- **Purpose**: Generate article content, summaries, SEO metadata
- **Required For**: 
  - Article body generation
  - Meta descriptions
  - Title optimization
  - Content rewriting
  - Keyword extraction
- **Credentials Needed**:
  ```env
  OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
  OPENAI_MODEL=gpt-4-turbo-preview  # or gpt-4o
  ```
- **Pricing**: ~$0.01 per 1K tokens (input), ~$0.03 per 1K tokens (output)
- **Sign Up**: https://platform.openai.com/signup
- **Docs**: https://platform.openai.com/docs

### **Alternative: Anthropic Claude**
- **Purpose**: Alternative AI for content generation
- **Credentials Needed**:
  ```env
  ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
  ANTHROPIC_MODEL=claude-3-opus-20240229
  ```
- **Pricing**: ~$0.015 per 1K tokens (input), ~$0.075 per 1K tokens (output)
- **Sign Up**: https://console.anthropic.com/
- **Docs**: https://docs.anthropic.com/

### **Alternative: Google Gemini**
- **Purpose**: Free tier for content generation
- **Credentials Needed**:
  ```env
  GOOGLE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxx
  GEMINI_MODEL=gemini-1.5-pro
  ```
- **Pricing**: Free tier available, then pay-as-you-go
- **Sign Up**: https://makersuite.google.com/app/apikey
- **Docs**: https://ai.google.dev/docs

---

## 💾 **2. Database & Storage**

### **Supabase** (Already Configured ✅)
- **Purpose**: Store articles, metadata, analytics
- **Required For**:
  - Article storage
  - User management
  - Performance tracking
  - Content versioning
- **Credentials Needed**:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Status**: ✅ Already configured
- **Pricing**: Free tier (500MB database, 1GB file storage)
- **Docs**: https://supabase.com/docs

---

## 📊 **3. SEO & Analytics**

### **Google Search Console API**
- **Purpose**: Submit sitemaps, monitor search performance
- **Required For**:
  - Automatic sitemap submission
  - Search performance tracking
  - Indexing status monitoring
- **Credentials Needed**:
  ```env
  GOOGLE_SEARCH_CONSOLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
  GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
  GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN=1//xxxxxxxxxxxxx
  ```
- **Setup Steps**:
  1. Go to https://console.cloud.google.com/
  2. Create a new project
  3. Enable "Google Search Console API"
  4. Create OAuth 2.0 credentials
  5. Add your site to Search Console
- **Pricing**: Free
- **Docs**: https://developers.google.com/webmaster-tools/v1/api_reference_index

### **Google Analytics 4 API**
- **Purpose**: Track article performance, user engagement
- **Required For**:
  - Page view tracking
  - User behavior analysis
  - Conversion tracking
- **Credentials Needed**:
  ```env
  NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
  GA4_API_SECRET=xxxxxxxxxxxxx
  ```
- **Setup Steps**:
  1. Create GA4 property at https://analytics.google.com/
  2. Get Measurement ID from Admin > Data Streams
  3. Create API secret in Admin > Data Streams > Measurement Protocol API secrets
- **Pricing**: Free
- **Docs**: https://developers.google.com/analytics/devguides/collection/protocol/ga4

---

## 🎨 **4. Image Generation**

### **Option A: DALL-E 3 (OpenAI)**
- **Purpose**: Generate featured images, infographics
- **Credentials Needed**:
  ```env
  OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx  # Same as above
  ```
- **Pricing**: ~$0.04 per image (1024x1024), ~$0.08 per image (1024x1792)
- **Quality**: High-quality, photorealistic
- **Docs**: https://platform.openai.com/docs/guides/images

### **Option B: Stable Diffusion (Stability AI)**
- **Purpose**: Cost-effective image generation
- **Credentials Needed**:
  ```env
  STABILITY_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
  ```
- **Pricing**: ~$0.002 per image
- **Sign Up**: https://platform.stability.ai/
- **Docs**: https://platform.stability.ai/docs

### **Option C: Unsplash API**
- **Purpose**: Free stock photos (no generation)
- **Credentials Needed**:
  ```env
  UNSPLASH_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxx
  ```
- **Pricing**: Free (5,000 requests/hour)
- **Sign Up**: https://unsplash.com/developers
- **Docs**: https://unsplash.com/documentation

---

## 📈 **5. Data Sources**

### **Financial Data APIs**

#### **Alpha Vantage**
- **Purpose**: Stock prices, mutual fund NAV, market data
- **Credentials Needed**:
  ```env
  ALPHA_VANTAGE_API_KEY=xxxxxxxxxxxxxxxxxxxxx
  ```
- **Pricing**: Free tier (25 requests/day), Premium from $49.99/month
- **Sign Up**: https://www.alphavantage.co/support/#api-key
- **Docs**: https://www.alphavantage.co/documentation/

#### **Yahoo Finance API (Unofficial)**
- **Purpose**: Real-time stock data, historical prices
- **Credentials Needed**:
  ```env
  RAPIDAPI_KEY=xxxxxxxxxxxxxxxxxxxxx  # Via RapidAPI
  ```
- **Pricing**: Free tier (500 requests/month), Pro from $9.99/month
- **Sign Up**: https://rapidapi.com/apidojo/api/yahoo-finance1
- **Docs**: https://rapidapi.com/apidojo/api/yahoo-finance1

#### **NSE/BSE India APIs**
- **Purpose**: Indian stock market data
- **Credentials Needed**:
  ```env
  NSE_API_KEY=xxxxxxxxxxxxxxxxxxxxx
  BSE_API_KEY=xxxxxxxxxxxxxxxxxxxxx
  ```
- **Pricing**: Varies by provider
- **Note**: May require data vendor subscription
- **Alternatives**: Use web scraping with proper rate limiting

---

## 🔧 **6. Optional Enhancements**

### **Plagiarism Detection: Copyscape API**
- **Purpose**: Ensure content originality
- **Credentials Needed**:
  ```env
  COPYSCAPE_API_KEY=xxxxxxxxxxxxxxxxxxxxx
  COPYSCAPE_USERNAME=your-username
  ```
- **Pricing**: ~$0.03 per check
- **Sign Up**: https://www.copyscape.com/apiconfigure.php
- **Docs**: https://www.copyscape.com/apidoc.php

### **Grammar Check: Grammarly API**
- **Purpose**: Automated proofreading
- **Credentials Needed**:
  ```env
  GRAMMARLY_API_KEY=xxxxxxxxxxxxxxxxxxxxx
  ```
- **Pricing**: Enterprise pricing (contact sales)
- **Alternative**: Use LanguageTool API (open-source)
- **Docs**: Contact Grammarly for API access

### **Translation: Google Translate API**
- **Purpose**: Multi-language content
- **Credentials Needed**:
  ```env
  GOOGLE_TRANSLATE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxx
  ```
- **Pricing**: $20 per 1M characters
- **Sign Up**: https://cloud.google.com/translate
- **Docs**: https://cloud.google.com/translate/docs

### **Scheduling: Cron Jobs (Vercel/Railway)**
- **Purpose**: Automated content generation schedule
- **Credentials Needed**:
  ```env
  CRON_SECRET=your-secret-key-for-cron-endpoints
  ```
- **Pricing**: Free on Vercel/Railway
- **Setup**: Configure in `vercel.json` or Railway dashboard

---

## 🔐 **7. Environment Variables Setup**

### **Complete .env.local Template**

```env
# ========================================
# DATABASE & STORAGE
# ========================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ========================================
# AI CONTENT GENERATION
# ========================================
# OpenAI (Primary)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo-preview

# Anthropic Claude (Alternative)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_MODEL=claude-3-opus-20240229

# Google Gemini (Free Alternative)
GOOGLE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxx
GEMINI_MODEL=gemini-1.5-pro

# ========================================
# SEO & ANALYTICS
# ========================================
# Google Analytics 4
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=xxxxxxxxxxxxx

# Google Search Console
GOOGLE_SEARCH_CONSOLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_SEARCH_CONSOLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN=1//xxxxxxxxxxxxx

# ========================================
# IMAGE GENERATION
# ========================================
# DALL-E (uses OPENAI_API_KEY above)
# Stability AI
STABILITY_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
# Unsplash
UNSPLASH_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxx

# ========================================
# FINANCIAL DATA
# ========================================
# Alpha Vantage
ALPHA_VANTAGE_API_KEY=xxxxxxxxxxxxxxxxxxxxx
# Yahoo Finance (via RapidAPI)
RAPIDAPI_KEY=xxxxxxxxxxxxxxxxxxxxx
# NSE/BSE
NSE_API_KEY=xxxxxxxxxxxxxxxxxxxxx
BSE_API_KEY=xxxxxxxxxxxxxxxxxxxxx

# ========================================
# OPTIONAL ENHANCEMENTS
# ========================================
# Copyscape
COPYSCAPE_API_KEY=xxxxxxxxxxxxxxxxxxxxx
COPYSCAPE_USERNAME=your-username
# Google Translate
GOOGLE_TRANSLATE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxx
# Cron Security
CRON_SECRET=your-secret-key-for-cron-endpoints

# ========================================
# APPLICATION SETTINGS
# ========================================
NEXT_PUBLIC_SITE_URL=https://investingpro.in
NODE_ENV=production
```

---

## 📝 **Priority Setup Order**

### **Phase 1: Essential (Start Here)**
1. ✅ **Supabase** - Already configured
2. 🔴 **OpenAI API** - Required for content generation
3. 🟡 **Google Analytics 4** - Track performance

### **Phase 2: SEO & Discovery**
4. 🟡 **Google Search Console** - Submit sitemaps
5. 🟢 **Unsplash API** - Free featured images

### **Phase 3: Data & Enhancement**
6. 🟢 **Alpha Vantage** - Financial data (free tier)
7. 🟢 **Copyscape** - Content originality

### **Phase 4: Scale & Optimize**
8. 🟢 **Stability AI** - Cost-effective images
9. 🟢 **Google Translate** - Multi-language support

---

## 💰 **Estimated Monthly Costs**

### **Minimal Setup (100 articles/month)**
- OpenAI API: ~$50-100
- Supabase: Free
- Google Analytics: Free
- Google Search Console: Free
- Unsplash: Free
- **Total: $50-100/month**

### **Full Setup (100 articles/month)**
- OpenAI API: ~$50-100
- Stability AI: ~$10
- Alpha Vantage: $49.99
- Copyscape: ~$3
- Google Translate: ~$5
- Supabase: Free
- Analytics: Free
- **Total: ~$120-170/month**

### **Enterprise Setup (500 articles/month)**
- OpenAI API: ~$250-500
- Stability AI: ~$50
- Alpha Vantage: $249.99
- Copyscape: ~$15
- Google Translate: ~$25
- Supabase: $25
- **Total: ~$615-865/month**

---

## 🚀 **Quick Start Guide**

### **Step 1: Get OpenAI API Key**
```bash
# 1. Go to https://platform.openai.com/signup
# 2. Create account and verify email
# 3. Go to API Keys section
# 4. Create new secret key
# 5. Copy and save securely
```

### **Step 2: Add to Environment**
```bash
# Create .env.local file
echo "OPENAI_API_KEY=your-key-here" >> .env.local
```

### **Step 3: Test API Connection**
```bash
# Run test script
npx tsx scripts/test-openai-connection.ts
```

### **Step 4: Generate First Article**
```bash
# Run content generation
npx tsx scripts/generate-article.ts "SIP vs Lumpsum"
```

---

## 📚 **Additional Resources**

### **Documentation**
- [OpenAI Best Practices](https://platform.openai.com/docs/guides/production-best-practices)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

### **Cost Optimization**
- Use GPT-3.5-turbo for drafts, GPT-4 for final polish
- Cache API responses where possible
- Implement rate limiting
- Use free tiers during development

### **Security Best Practices**
- Never commit API keys to Git
- Use environment variables
- Rotate keys regularly
- Monitor API usage
- Set spending limits

---

## ✅ **Checklist**

- [ ] OpenAI API key obtained and tested
- [ ] Supabase credentials verified
- [ ] Google Analytics 4 configured
- [ ] Google Search Console connected
- [ ] Image generation API selected
- [ ] Financial data API configured
- [ ] Environment variables set
- [ ] API usage monitoring enabled
- [ ] Spending limits configured
- [ ] Backup credentials stored securely

---

**Last Updated**: January 1, 2026  
**Status**: Ready for automated content generation  
**Next Steps**: Obtain OpenAI API key and configure environment variables
