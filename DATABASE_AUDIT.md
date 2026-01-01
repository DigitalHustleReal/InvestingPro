# 🗄️ DATABASE SCHEMA AUDIT

## 1. 🛑 CRITICAL CONFLICT
**Severity: CRITICAL**
You have two conflicting definitions of the `articles` table:
1.  **Old (`cms_schema.sql`)**: Uses `category_id UUID`.
2.  **New (`article_advanced_schema.sql`)**: Uses `category TEXT`.

**Current Reality**: The code uses the **New** schema (Text based).
**Risk**: If you run the wrong migration, you break the app.
**Action**: Archive/Delete `cms_schema.sql`.

## 2. 💣 STRUCTURAL RISKS
### **Hardcoded Category Enum**
- The `articles` table prevents new categories via `CHECK (category IN ('mutual-funds', ...))`.
- **Problem**: If you want to add "crypto" next week, you must run a Database Migration to `ALTER TABLE`. You cannot just add it in the Admin Panel.
- **Fix**: Remove the `CHECK` constraint.

### **Missing Foreign Keys**
- `affiliate_products` is `TEXT[]`. It points to IDs but the DB doesn't enforce it.
- If you delete a Product, the Article still links to it (Data Integrity issue).

## 3. 📉 MISSING TABLES FOR SCALE
### **1. Event Analytics**
- You have `views` (Counter).
- You are missing `analytics_events` (Timestamp, User Agent, Event Type).
- **Impact**: Zero ability to calculate Conversion Rate.

### **2. Link Tracking**
- Missing `affiliate_clicks` table.
- **Impact**: Zero revenue tracking.

## 4. 🥇 SEO READINESS
**Grade: A**
- Your `keyword_research` and `keyword_clusters` tables are world-class.
- You are ready for Programmatic SEO and Topical Authority mapping.

## 5. 🛠️ CLEANUP PLAN
1.  **Delete**: `cms_schema.sql` (Obsolete).
2.  **Alter**: Drop the `CHECK` constraint on `articles.category`.
3.  **Create**: `analytics_events` table.
