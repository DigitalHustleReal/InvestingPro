# 🔄 MIGRATION ORDER - APPLY IN THIS SEQUENCE!

**Critical:** Migrations must be applied in dependency order.

---

## ✅ **CORRECT ORDER:**

### **1. Content Tables First (Foundation)**
**File:** `supabase/migrations/20260103_content_automation_schema.sql`

**Why First?** Creates base tables that other migrations depend on:
- `glossary_terms` table
- `blog_posts` table
- `content_generation_queue` table

**Run this first!**

---

### **2. Editorial Team Second (Depends on content tables)**
**File:** `supabase/migrations/20260103_complete_editorial_team.sql`

**Why Second?** Needs glossary_terms and blog_posts to exist for:
- Auto-assignment triggers
- Attribution fields
- Author/editor relationships

**Run after step 1!**

---

### **3. Media Library Third (Independent)**
**File:** `supabase/migrations/20260103_media_library_schema.sql`

**Why Third?** Independent system, doesn't depend on others.

**Run after step 2!**

---

## 🚀 **EXECUTION STEPS:**

### **Step 1: Apply Content Schema**
```sql
-- In Supabase Dashboard → SQL Editor
-- Copy entire contents of:
-- supabase/migrations/20260103_content_automation_schema.sql
-- Then run
```

**Verify:**
```sql
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'glossary_terms'
);
-- Should return: true
```

---

### **Step 2: Apply Editorial Team**
```sql
-- Copy & run:
-- supabase/migrations/20260103_complete_editorial_team.sql
```

**Verify:**
```sql
SELECT COUNT(*) FROM public.authors;
-- Should return: 16
```

---

### **Step 3: Apply Media Library**
```sql
-- Copy & run:
-- supabase/migrations/20260103_media_library_schema.sql
```

**Verify:**
```sql
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'media'
);
-- Should return: true
```

---

## ⚠️ **THAT'S WHY YOU GOT THE ERROR!**

You tried to run **Editorial Team** migration first, but it needs **glossary_terms** table which only exists after running **Content Automation Schema** first.

---

## ✅ **FIXED ORDER:**

1. ✅ Content tables
2. ✅ Editorial team  
3. ✅ Media library

**Apply in this order and you're good!** 🚀
