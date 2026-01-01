# ⚙️ CMS SYSTEM AUDIT

## 1. 🏗️ ARCHITECTURE
**Type: Client-Side CMS (Supabase-first)**
- The admin panel **bypasses the Next.js API Layer**.
- It uses `lib/cms/article-service.ts` to talk directly to Supabase.
- **Pros**: Fast, Real-time.
- **Cons**: Security depends entirely on RLS policies. Business logic is exposed in client bundle.

## 2. 🧩 FEATURE MATRIX

| Feature | UI Status | Backend Status | Finding |
| :--- | :--- | :--- | :--- |
| **Article CRUD** | ✅ Complete | ✅ Supabase SDK | Good. |
| **Publishing** | ✅ Active | ✅ Direct Update | Works. |
| **AI Generation** | ✅ Active | ✅ Edge Functions | Integrated. |
| **Image Library** | ✅ Active | ✅ Storage Bucket | Good. |
| **Moderation** | ❌ Partial | ❌ None | `ArticleModeration` UI exists but has no backend workflow. |

## 3. 🚦 WORKFLOW GAPS
### **1. The "Review" Void**
- **Draft** -> **Publish** works.
- **Draft** -> **Review** is missing.
- You have a `status='review'` in the DB, but no UI button to "Submit for Review".
- **Risk**: Editors can accidentally publish without approval.

### **2. No Versioning**
- If an editor overwrites an article, the **old version is lost forever**.
- There is no `article_versions` table or history tracking.
- **Risk**: Content loss.

## 4. 🛠️ ACTION PLAN

### **Critical Fixes (Before Launch)**
1.  **Strict RLS**: Double check `articles` table RLS. Ensure only `role='admin'` or `role='editor'` can UPDATE.
2.  **Submit for Review**: Add a button in `ArticleInspector` that sets `status='review'`.

### **Nice to Have (Phase 2)**
1.  **Versioning**: Create an `article_history` table to store JSON snapshots on every save.
2.  **API Layer**: Move critical logic (like publishing) to `app/api/admin/articles` to hide the logic from the browser.
