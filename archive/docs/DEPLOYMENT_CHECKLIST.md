# InvestingPro - Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Create `.env.local` file from `.env.example`
- [ ] Set all Supabase credentials:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Set OpenAI API key (if using AI features)
- [ ] Set security secrets:
  - [ ] `SCRAPER_SECRET` (generate with `openssl rand -hex 32`)
  - [ ] `CRON_SECRET` (generate with `openssl rand -hex 32`)
- [ ] Set `NEXT_PUBLIC_BASE_URL` to production domain
- [ ] Set Stripe keys (if implementing payments):
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Set social media URLs (optional):
  - [ ] `NEXT_PUBLIC_FACEBOOK_URL`
  - [ ] `NEXT_PUBLIC_TWITTER_URL`
  - [ ] `NEXT_PUBLIC_INSTAGRAM_URL`
  - [ ] `NEXT_PUBLIC_LINKEDIN_URL`
  - [ ] `NEXT_PUBLIC_YOUTUBE_URL`

### 2. Database Setup
- [ ] Create Supabase project
- [ ] Apply all SQL migrations:
  - [ ] `lib/supabase/credit_card_schema.sql`
  - [ ] `lib/supabase/mutual_fund_schema.sql`
  - [ ] `lib/supabase/cms_schema.sql`
  - [ ] `lib/supabase/portfolio_schema.sql`
  - [ ] `lib/supabase/affiliate_product_schema.sql`
  - [ ] `lib/supabase/ad_placement_schema.sql`
- [ ] Verify Row Level Security (RLS) policies are enabled
- [ ] Create admin user in Supabase Auth
- [ ] Set admin role in `user_profiles` table
- [ ] Test database connections

### 3. Code Review
- [ ] Review all API routes for security
- [ ] Verify admin authentication middleware is working
- [ ] Check error handling in all routes
- [ ] Verify CORS settings (if needed)
- [ ] Review environment variable usage
- [ ] Check for hardcoded secrets (remove if any)

### 4. Content & Legal
- [ ] Review disclaimer page content
- [ ] Verify Terms of Service page
- [ ] Verify Privacy Policy page
- [ ] Update footer copyright year
- [ ] Update social media links in footer
- [ ] Review all legal disclaimers
- [ ] Verify affiliate disclosure statements

### 5. Testing
- [ ] Test admin panel access (should require login)
- [ ] Test scraper API endpoints
- [ ] Test cron job endpoints
- [ ] Test product pages load correctly
- [ ] Test calculator functionality
- [ ] Test search functionality
- [ ] Test responsive design on mobile
- [ ] Test error pages (404, 500)

---

## 🚀 Deployment Steps

### Step 1: Vercel Setup
- [ ] Create Vercel account (if not exists)
- [ ] Connect GitHub repository to Vercel
- [ ] Import project in Vercel dashboard

### Step 2: Environment Variables in Vercel
- [ ] Go to Project Settings > Environment Variables
- [ ] Add all variables from `.env.local`
- [ ] Set environment for Production, Preview, and Development
- [ ] Verify all variables are set correctly

### Step 3: Build Configuration
- [ ] Verify `next.config.ts` is correct
- [ ] Verify `vercel.json` cron jobs are configured
- [ ] Check build command: `npm run build`
- [ ] Verify output directory (default: `.next`)

### Step 4: Deploy
- [ ] Trigger deployment: `vercel deploy --prod`
- [ ] Or push to main branch (if auto-deploy enabled)
- [ ] Monitor build logs for errors
- [ ] Wait for deployment to complete

### Step 5: Post-Deployment Verification
- [ ] Visit production URL
- [ ] Verify homepage loads
- [ ] Test navigation
- [ ] Verify admin panel redirects to login
- [ ] Check API routes are accessible
- [ ] Verify cron jobs are scheduled in Vercel dashboard

---

## 🔧 Post-Deployment Configuration

### 1. Stripe (if implemented)
- [ ] Set up Stripe webhook endpoint:
  - [ ] URL: `https://your-domain.com/api/stripe/webhook`
  - [ ] Events to listen: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
- [ ] Test webhook with Stripe CLI or dashboard
- [ ] Verify webhook secret matches environment variable

### 2. Monitoring & Analytics
- [ ] Set up Google Analytics (if using)
- [ ] Set up error tracking (Sentry/LogRocket)
- [ ] Configure error alerts
- [ ] Set up uptime monitoring

### 3. SEO
- [ ] Submit sitemap to Google Search Console:
  - [ ] URL: `https://your-domain.com/sitemap.xml`
- [ ] Verify robots.txt is accessible
- [ ] Test structured data with Google Rich Results Test
- [ ] Submit site for indexing

### 4. Cron Jobs
- [ ] Verify cron jobs are active in Vercel dashboard
- [ ] Test manual trigger of cron endpoints
- [ ] Monitor cron job execution logs
- [ ] Set up alerts for failed cron jobs

### 5. Database
- [ ] Set up database backups in Supabase
- [ ] Configure connection pooling (if needed)
- [ ] Monitor database performance
- [ ] Set up query alerts

---

## 🔒 Security Checklist

- [ ] All admin routes are protected
- [ ] API routes have proper authentication
- [ ] Environment variables are not exposed in client code
- [ ] Secrets are stored securely (Vercel environment variables)
- [ ] CORS is configured correctly
- [ ] Rate limiting is implemented (if needed)
- [ ] Input validation on all API routes
- [ ] SQL injection prevention (using Supabase client)
- [ ] XSS prevention (React auto-escapes)
- [ ] HTTPS is enforced (Vercel default)

---

## 📊 Performance Checklist

- [ ] Run Lighthouse audit
- [ ] Verify Core Web Vitals scores
- [ ] Optimize images (Next.js Image component)
- [ ] Enable caching where appropriate
- [ ] Verify CDN is working (Vercel default)
- [ ] Test page load times
- [ ] Optimize bundle size

---

## 🐛 Troubleshooting

### Common Issues

**Build Fails:**
- Check environment variables are set
- Verify all dependencies are in `package.json`
- Check for TypeScript errors
- Review build logs

**Admin Panel Not Accessible:**
- Verify middleware is working
- Check Supabase auth is configured
- Verify admin user exists in database

**Cron Jobs Not Running:**
- Check `vercel.json` configuration
- Verify cron secret is set
- Check Vercel cron dashboard

**Database Connection Errors:**
- Verify Supabase credentials
- Check RLS policies
- Verify network access

---

## 📞 Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Stripe Docs:** https://stripe.com/docs

---

**Last Updated:** January 2025  
**Next Review:** After each deployment

