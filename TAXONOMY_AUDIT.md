# 🗂️ TAXONOMY & CATEGORY AUDIT

## 1. ⚠️ CRITICAL FINDING: INCONSISTENT DEPTH
Your application uses **3 different truths** for Category Hierarchy. This is the root cause of your Navigation 404s.

| Source | Depth | Structure | Usage |
| :--- | :--- | :--- | :--- |
| **Database** | **1 Level** | Flat (`id`, `name`) | storing Articles. |
| **Old Code** | **2 Levels** | `Category` -> `Subcategory` | Pillar Pages (`app/[category]`). |
| **New Config** | **3 Levels** | `Category` -> `Intent` -> `Collection` | Top Navbar. |

**The Conflict**:
- Navbar sends user to Level 3 (`/credit-cards/best/rewards`).
- Pillar Page expects Level 2 (`/credit-cards/rewards`).
- Database only knows Level 1 (`credit-cards`).
- **Result**: Links break.

## 2. 🗄️ DATABASE LIMITATIONS
- **Table**: `public.categories` is **Flat**.
- **Issue**: There is no `parent_id` column.
- **Workaround**: Currently using `article.editorial_notes.sub_category` as a hack.
- **Recommendation**:
    1.  Add `parent_id` column to `categories`.
    2.  Migrate "Sub-Categories" (Intent/Collections) to the `categories` table.
    3.  Make `Article` reference the `sub_category_id` (which knows its parent).

## 3. 🔗 CONTENT RELATIONSHIPS
- **Glossary**: Disconnected from Category.
- **Tools**: Hardcoded in `app/calculators`. Not strictly tied to Content Categories (e.g. SIP Calculator should belong to Investing, but is siloed).
- **CTAs**: Generic.

## 4. 🛠️ ACTION PLAN (Fix Hierarchy)

### **Option A: Flatten (Fastest)**
- Abandon Level 3 (Intent).
- Make `Best Rewards Cards` a direct child of `Credit Cards`.
- URL: `/credit-cards/best-rewards-cards` (SEO Friendly).

### **Option B: Formalize Level 3 (Best)**
- Update DB schema to support recursive categories (`parent_id`).
- Update `app/[category]/[intent]/[collection]/page.tsx` to handle the full path.

**Recommendation**: **Option A (Flatten)**.
Deep hierarchies (Level 3) are bad for SEO (URL depth) and hard to maintain without a dedicated Graph CMS.
