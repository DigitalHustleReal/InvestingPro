# Master Setup Checklist: InvestingPro (v1.5)

Follow this guide to set up the environment from scratch.

## 1. Prerequisites
- [ ] Install **Node.js** (v18.x or higher)
- [ ] Install **PNPM** (`npm install -g pnpm`)
- [ ] Install **Git**
- [ ] Create a **Supabase** account/project
- [ ] Create an **OpenAI** account (API Key)

## 2. Environment Setup
- [ ] Clone the repository: `git clone [repo-url]`
- [ ] Copy `.env.example` to `.env.local`: `cp .env.example .env.local`
- [ ] Populate `.env.local` with your credentials:
    - [ ] `NEXT_PUBLIC_SUPABASE_URL`
    - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - [ ] `SUPABASE_SERVICE_ROLE_KEY`
    - [ ] `OPENAI_API_KEY`
    - [ ] `NEXT_PUBLIC_BASE_URL` (set to `http://localhost:3000` for local dev)

## 3. Database Configuration
- [ ] Go to Supabase SQL Editor
- [ ] Copy and run the schema from `supabase/migrations/initial_schema.sql` (if exists) or see `lib/data` for definitions.
- [ ] Verify tables: `credit_cards`, `loans`, `mutual_funds`, `articles`.

## 4. Installation & Development
- [ ] Install dependencies: `pnpm install`
- [ ] Run development server: `npm run dev`
- [ ] Access the platform at [localhost:3000](http://localhost:3000)
- [ ] Access Admin Console at [localhost:3000/admin](http://localhost:3000/admin)

## 5. Deployment (Vercel)
- [ ] Push code to GitHub/GitLab
- [ ] Connect repository to **Vercel**
- [ ] Add all Environment Variables in Vercel Dashboard
- [ ] Deploy!

## 6. Post-Deployment Checks
- [ ] Verify SSL (HTTPS)
- [ ] Test form submissions (Lead Capture)
- [ ] Check Sentry for any startup errors
- [ ] Verify SEO metadata on key pages
