# 📦 Product Population Guide

## Overview
This guide will help you populate the InvestingPro database with realistic products across all categories.

---

## ✅ Prerequisites

1. **Environment Variables** (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

2. **Database Schema**: Ensure `products` table exists with correct columns

---

## 🚀 Quick Start

### Option 1: Populate ALL Products (Recommended)
```bash
npx tsx scripts/populate-all-products.ts
```

**What it does**:
- Populates **~650 products** across all categories
- Uses AI to generate realistic data
- Each product gets: name, description, features, pros, cons, ratings
- Takes ~10-15 minutes (1 second per product to avoid API limits)

**Expected Output**:
```
📦 Credit Cards (150 products)
  [1/150] HDFC Regalia Gold... ✅
  [2/150] SBI Card ELITE... ✅
  ...
  
📦 Loans (200 products)
📦 Insurance (120 products)
📦 Banking (60 products)
📦 Investing (800 products via AMFI)
📦 Brokers (11 products)

✨ Population complete!
✅ Success: 645
❌ Failed: 5
📊 Total: 650
```

---

### Option 2: Sample Products (Quick Test)
```bash
npx tsx scripts/populate-real-products.ts
```

**What it does**:
- Populates ~10 sample products only
- Good for testing the flow
- Takes ~30 seconds

---

## 📊 Products Being Added

### Credit Cards (150+)
- **Premium**: HDFC Regalia, Axis Magnus, AMEX Platinum (20)
- **Cashback**: Amazon Pay ICICI, Flipkart Axis, Swiggy HDFC (30)
- **Travel**: Yatra SBI, Air India Signature, Vistara HDFC (25)
- **Fuel**: HDFC IndianOil, ICICI HPCL, SBI BPCL (20)
- **Shopping**: Shoppers Stop ICICI, Big Bazaar, Reliance Smart (30)
- **Budget**: Entry-level cards (25)

### Loans (200+)
- **Home Loans**: SBI, HDFC, ICICI, LIC Housing (40)
- **Personal Loans**: All major banks (60)
- **Car Loans**: Auto finance options (30)
- **Education Loans**: Student loans, Credila (25)
- **Gold Loans**: Muthoot, Manappuram, Rupeek (20)
- **Business Loans**: MSME, SME loans (25)

### Insurance (120+)
- **Health Insurance**: Star Health, Max Bupa, Care Health (40)
- **Life Insurance**: LIC, SBI Life, HDFC Life (30)
- **Term Insurance**: Click 2 Protect, iProtect Smart (30)
- **Car/Bike Insurance**: Motor insurance (20)

### Banking (60+)
- **Savings Accounts**: High-interest accounts (20)
- **Fixed Deposits**: FD schemes (20)
- **Current Accounts**: Business accounts (10)
- **Salary Accounts**: Zero-balance options (10)

### Mutual Funds (800+)
- **Equity Funds**: Large cap, mid cap, small cap
- **Debt Funds**: Liquid, short-term, long-term
- **Hybrid Funds**: Balanced, aggressive
- *(Synced from AMFI real-time data)*

### Brokers (11)
- Zerodha, Groww, Upstox, Angel One, 5Paisa
- ICICI Direct, HDFC Securities, Kotak, etc.

---

## 🎯 What Gets Generated (Per Product)

```json
{
  "slug": "hdfc-regalia-gold",
  "name": "HDFC Bank Regalia Gold Credit Card",
  "category": "credit_card",
  "provider_name": "HDFC Bank",
  "description": "Premium lifestyle credit card with travel benefits",
  "rating": 4.6,
  "features": {
    "annual_fee": "₹2,500",
    "reward_rate": "4 pts per ₹150",
    "lounge_access": "12 visits/year",
    "fuel_surcharge": "1% waiver"
  },
  "pros": [
    "Airport lounge access",
    "High reward rate",
    "Comprehensive insurance",
    "Global acceptance"
  ],
  "cons": [
    "High annual fee",
    "Eligibility: ₹20L+ income",
    "Reward capping on some categories"
  ],
  "affiliate_link": "https://www.hdfcbank.com/...",
  "image_url": "https://...",
  "trust_score": 87,
  "verification_status": "verified",
  "last_verified_at": "2026-01-04T10:45:00Z"
}
```

---

## 🛠️ Troubleshooting

### Error: "column does not exist"
**Fix**: Run Supabase migrations first
```bash
npm run db:migrate
```

### Error: "API key invalid"
**Fix**: Check `.env.local` has valid `GOOGLE_GEMINI_API_KEY`

### Error: "Rate limit exceeded"
**Fix**: Script already has 1-second delays. If still hitting limits:
- Reduce batch size in script
- Wait 1 hour and retry

### Products Not Showing in UI
**Fix**:
1. Check Supabase dashboard - verify products inserted
2. Restart dev server: `npm run dev`
3. Clear browser cache

---

## ⚡ Performance Tips

1. **Run in Background**: Takes 10-15 minutes
   ```bash
   nohup npx tsx scripts/populate-all-products.ts > populate.log 2>&1 &
   ```

2. **Resume from Failure**: Script uses `upsert`, so re-running is safe

3. **Parallel Runs**: DON'T run multiple instances (API limits)

---

## 📈 After Population

### Verify Data
```sql
-- Check counts
SELECT category, COUNT(*) FROM products GROUP BY category;

-- Expected:
-- credit_card: 150
-- loan: 200
-- insurance: 120
-- mutual_fund: 800
-- broker: 11
```

### Update Stats
The homepage stats will automatically update based on actual product counts!

---

## 🎉 Next Steps

Once populated:
1. ✅ Homepage will show realistic numbers
2. ✅ Category pages will have products
3. ✅ Search will return results
4. ✅ Comparison will work
5. ✅ Trust scores will be visible

**Ready for demo/launch!**
