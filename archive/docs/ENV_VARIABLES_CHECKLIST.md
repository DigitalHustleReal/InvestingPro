# Environment Variables Checklist

## ✅ Required Variables (Must Set in Vercel)

### Supabase (Database & Auth)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)

### Security Secrets
- [ ] `SCRAPER_SECRET` - Secret for scraper API authentication
- [ ] `CRON_SECRET` - Secret for cron job authentication

### Application
- [ ] `NEXT_PUBLIC_BASE_URL` - Production URL (e.g., https://investingpro.in)

---

## 🔧 Optional but Recommended

### Stripe (Payment Processing)
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key (test or live)
- [ ] `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Same as STRIPE_PUBLISHABLE_KEY

### OpenAI (AI Features)
- [ ] `OPENAI_API_KEY` - OpenAI API key for content generation

### Analytics
- [ ] `NEXT_PUBLIC_GA_ID` - Google Analytics ID

### Social Media (Optional)
- [ ] `NEXT_PUBLIC_FACEBOOK_URL`
- [ ] `NEXT_PUBLIC_TWITTER_URL`
- [ ] `NEXT_PUBLIC_INSTAGRAM_URL`
- [ ] `NEXT_PUBLIC_LINKEDIN_URL`
- [ ] `NEXT_PUBLIC_YOUTUBE_URL`

---

## 📝 How to Set in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable:
   - **Name:** Variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value:** Your actual value
   - **Environment:** Select Production, Preview, Development as needed
3. Click **Save**
4. **Redeploy** for changes to take effect

---

## ⚠️ Important Notes

- **Never commit** `.env.local` to git
- Use **different keys** for development and production
- **Rotate secrets** periodically
- All `NEXT_PUBLIC_*` variables are exposed to the browser
- Variables without `NEXT_PUBLIC_` are server-side only

---

## 🔍 Verification

After setting variables, verify:
- [ ] Build succeeds in Vercel
- [ ] Database connections work
- [ ] Authentication works
- [ ] API routes respond correctly
- [ ] Stripe integration works (if enabled)

---

**Status:** Ready for Vercel configuration
**Last Updated:** Now

