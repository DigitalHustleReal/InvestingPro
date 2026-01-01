# InvestingPro Content Factory: Setup Guide

To operationalize the automation-first content factory, ensure the following environment variables are set in your deployment environment (Vercel/DigitalOcean) or your `.env.local` file.

## 1. Core Infrastructure (Supabase)
Required for saving articles, tracking trends, and user auth.
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key.
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (required for background workers to bypass RLS).

## 2. AI & Writing Engine (OpenAI)
Powers the "Machine Writer" and Keyword Research.
- `OPENAI_API_KEY`: Your OpenAI Secret Key.
- `OPENAI_MODEL`: Set to `gpt-4o-mini` (fast/cheap) or `gpt-4o` (high quality).

## 3. Background Workers (Vercel/Cron)
Ensures the factory runs even when you are asleep.
- `CRON_SECRET`: A long random string. Used to secure the `/api/cron/process-pipeline` endpoint.
- `NEXT_PUBLIC_SITE_URL`: Set to `https://investingpro.in` (used for Schema and Sitemaps).

## 4. Visual Assets (Unsplash/Pexels)
For automated "Featured Image" selection.
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`: From Unsplash Developer Portal.
- `NEXT_PUBLIC_PEXELS_API_KEY`: From Pexels API Portal.

## 5. Google Integration (Next Steps)
To fully "NerdWallet" the site:
- **Google Search Console**: You will need to verify the site and add the Google Service Account JSON to auto-index new articles.
- **Google AdSense**: Once you exceed 50+ articles, add your `AD_CLIENT_ID`.

---
*Note: This file is a reference. Do not commit actual keys to GitHub.*
