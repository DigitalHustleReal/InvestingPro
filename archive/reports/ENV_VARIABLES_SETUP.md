# Environment Variables Setup Guide

**Where to add your environment variables for local development and production.**

---

## 📁 For Local Development

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the **root directory** of your project:

```
c:\Users\shivp\Desktop\InvestingPro_App\.env.local
```

### Step 2: Add these variables

Open `.env.local` and add these lines:

```env
# Axiom Logging (already configured)
EXTERNAL_LOGGING_ENABLED=true
EXTERNAL_LOGGING_SERVICE=axiom
AXIOM_API_KEY=xaat-fe826ead-6418-4364-bf50-c7ddb5377e52
AXIOM_DATASET=investingpro-logs

# OpenTelemetry Tracing
OTEL_ENABLED=true
AXIOM_OTLP_ENDPOINT=https://api.axiom.co/v1/traces
SERVICE_NAME=investingpro-api
SERVICE_VERSION=1.0.0

# Alerting (optional)
ALERT_EMAIL=digitalhustlereal@gmail.com
ADMIN_EMAIL=digitalhustlereal@gmail.com
```

### Step 3: Restart your dev server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🌐 For Production (Vercel)

### Step 1: Go to Vercel Dashboard

1. Go to [https://vercel.com](https://vercel.com)
2. Select your project: **InvestingPro_App**
3. Click **Settings** → **Environment Variables**

### Step 2: Add each variable

Click **Add New** and add each variable one by one:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `EXTERNAL_LOGGING_ENABLED` | `true` | Production, Preview, Development |
| `EXTERNAL_LOGGING_SERVICE` | `axiom` | Production, Preview, Development |
| `AXIOM_API_KEY` | `xaat-fe826ead-6418-4364-bf50-c7ddb5377e52` | Production, Preview, Development |
| `AXIOM_DATASET` | `investingpro-logs` | Production, Preview, Development |
| `OTEL_ENABLED` | `true` | Production, Preview, Development |
| `AXIOM_OTLP_ENDPOINT` | `https://api.axiom.co/v1/traces` | Production, Preview, Development |
| `SERVICE_NAME` | `investingpro-api` | Production, Preview, Development |
| `SERVICE_VERSION` | `1.0.0` | Production, Preview, Development |
| `ALERT_EMAIL` | `digitalhustlereal@gmail.com` | Production, Preview, Development |
| `ADMIN_EMAIL` | `digitalhustlereal@gmail.com` | Production, Preview, Development |

**Important:** Select **Production**, **Preview**, and **Development** for each variable.

### Step 3: Redeploy

After adding variables, **Redeploy** your application:
- Go to **Deployments** tab
- Click **⋯** (three dots) on latest deployment
- Click **Redeploy**

---

## 📋 Quick Reference

### File Location for Local Development:

```
c:\Users\shivp\Desktop\InvestingPro_App\.env.local
```

### Complete `.env.local` Template:

```env
# ============================================
# AXIOM LOGGING
# ============================================
EXTERNAL_LOGGING_ENABLED=true
EXTERNAL_LOGGING_SERVICE=axiom
AXIOM_API_KEY=xaat-fe826ead-6418-4364-bf50-c7ddb5377e52
AXIOM_DATASET=investingpro-logs

# ============================================
# OPENTELEMETRY TRACING
# ============================================
OTEL_ENABLED=true
AXIOM_OTLP_ENDPOINT=https://api.axiom.co/v1/traces
SERVICE_NAME=investingpro-api
SERVICE_VERSION=1.0.0

# ============================================
# ALERTING (Optional)
# ============================================
ALERT_EMAIL=digitalhustlereal@gmail.com
ADMIN_EMAIL=digitalhustlereal@gmail.com
```

---

## ✅ Verification

### Check if variables are loaded:

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Look for initialization messages:**
   ```
   [Logging] External logging initialized: axiom
   OpenTelemetry tracing initialized
   ```

3. **If you see errors:**
   - Check `.env.local` file exists
   - Check variable names are correct (no typos)
   - Check no extra spaces around `=`
   - Restart dev server

---

## 🔒 Security Notes

- ✅ `.env.local` is in `.gitignore` (won't be committed)
- ✅ Never commit `.env.local` to git
- ✅ Use Vercel environment variables for production
- ✅ Rotate API keys if exposed

---

## 📝 Existing Environment Variables

You may already have these in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `GROQ_API_KEY`
- etc.

**Just add the new ones** - don't remove existing variables!

---

## 🆘 Troubleshooting

### Variables not loading?

1. **Check file name:** Must be exactly `.env.local` (not `.env.local.txt`)
2. **Check location:** Must be in project root (same folder as `package.json`)
3. **Restart server:** Variables only load on startup
4. **Check syntax:** No quotes needed, no spaces around `=`

### Example of correct format:

```env
# ✅ CORRECT
AXIOM_API_KEY=xaat-fe826ead-6418-4364-bf50-c7ddb5377e52

# ❌ WRONG (don't use quotes)
AXIOM_API_KEY="xaat-fe826ead-6418-4364-bf50-c7ddb5377e52"

# ❌ WRONG (no spaces around =)
AXIOM_API_KEY = xaat-fe826ead-6418-4364-bf50-c7ddb5377e52
```

---

**Need help?** Check if `.env.local` exists and has the correct format!
