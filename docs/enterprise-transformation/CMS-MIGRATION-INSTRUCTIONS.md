# CMS Migration Instructions
**Running the Cost/Economic Intelligence Schema Migration**

---

## ✅ Migration File Ready

**File:** `supabase/migrations/20250115_cost_economic_intelligence_schema.sql`

**What it creates:**
- `content_costs` - Tracks AI generation costs per article
- `content_economics` - ROI and profit calculations
- `daily_budgets` - Daily spending limits
- `content_risk_scores` - Risk assessments for content
- `content_diversity` - Content type diversity tracking
- Helper functions: `calculate_content_roi()`, `check_daily_budget()`, `record_content_cost()`

**Safety:** ✅ Uses `IF NOT EXISTS` - safe to run multiple times

---

## 🚀 Method 1: Supabase Dashboard (Recommended)

### Steps:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy Migration SQL**
   - Open: `supabase/migrations/20250115_cost_economic_intelligence_schema.sql`
   - Copy ALL contents

4. **Paste and Run**
   - Paste into SQL Editor
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

5. **Verify Success**
   - Check for "Success" message
   - Verify tables exist in "Table Editor"

---

## 🚀 Method 2: Via Script (If tsx is installed)

```bash
npm run cms:migrate
```

**Note:** If `tsx` is not installed, use Method 1 instead.

---

## 🚀 Method 3: Via psql (Command Line)

```bash
# Set your database URL
export DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"

# Run migration
psql $DATABASE_URL -f supabase/migrations/20250115_cost_economic_intelligence_schema.sql
```

---

## ✅ Verification

After running the migration, verify tables exist:

### In Supabase Dashboard:
1. Go to "Table Editor"
2. Check for these tables:
   - ✅ `content_costs`
   - ✅ `content_economics`
   - ✅ `daily_budgets`
   - ✅ `content_risk_scores`
   - ✅ `content_diversity`

### Via SQL:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'content_costs',
  'content_economics',
  'daily_budgets',
  'content_risk_scores',
  'content_diversity'
);
```

---

## ⚠️ Troubleshooting

### Error: "relation already exists"
- **Meaning:** Tables already exist (safe)
- **Action:** Migration is idempotent, you can ignore this

### Error: "permission denied"
- **Meaning:** Need service role key
- **Action:** Use Supabase Dashboard (has full permissions)

### Error: "function already exists"
- **Meaning:** Functions already exist (safe)
- **Action:** Migration uses `CREATE OR REPLACE`, safe to continue

---

## 📝 Next Steps After Migration

1. **Verify Migration:**
   ```bash
   npm run cms:verify
   ```

2. **Initialize CMS:**
   ```bash
   npm run cms:init
   ```

3. **Test System:**
   ```bash
   npm run dev
   # Then test: POST /api/cms/orchestrator/canary
   ```

---

**Status:** ✅ Ready to run
**Recommended Method:** Supabase Dashboard (Method 1)
