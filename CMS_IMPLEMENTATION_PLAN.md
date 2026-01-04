# 🚀 CMS PRODUCTION-READY - START NOW!

**Created:** January 3, 2026, 10:00 PM  
**Goal:** Production-ready CMS  
**Time:** 40 hours total

---

## ⚡ **START RIGHT NOW (5 minutes)**

### **Step 0: Apply Editorial Team Migration**

```bash
# 1. Go to Supabase Dashboard → SQL Editor
# 2. Copy contents of: supabase/migrations/20260103_complete_editorial_team.sql
# 3. Run migration
# 4. Verify: SELECT COUNT(*) FROM authors; -- Should be 16
```

**DO THIS FIRST!** ✅

---

## 🔴 **PHASE 1: MEDIA LIBRARY (12 hours)**

### **Why?** Can't publish without images!

### **Step 1: Database (30 min)**

Run this SQL in Supabase:

```sql
-- Create media table
CREATE TABLE public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_media_created_at ON public.media(created_at DESC);

-- RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON public.media FOR SELECT USING (true);
CREATE POLICY "Authenticated upload" ON public.media FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');
```

### **Step 2: Storage Bucket (15 min)**

In Supabase Dashboard → Storage:
1. Create bucket: `media`
2. Make it public
3. Set size limit: 10MB

### **Step 3: Build Service (2 hours)**

Create file: `lib/media/media-service.ts`
- Upload images
- List media
- Search media
- Delete media

### **Step 4: Upload Component (1 hour)**

Create: `components/media/MediaUploader.tsx`
- Drag & drop
- File validation
- Progress indicator

### **Step 5: Library Browser (3 hours)**

Create: `components/media/MediaLibrary.tsx`
- Grid view of images
- Search functionality
- Delete action
- Select mode

### **Step 6: Featured Image Selector (2 hours)**

Create: `components/media/FeaturedImageSelector.tsx`
- Modal picker
- Preview selected image
- Change/remove actions

### **Step 7: Integrate with Article Editor (1 hour)**

Add to article editor:
- Featured image field
- Image insertion in content

---

## 🟡 **PHASE 2: PREVIEW SYSTEM (8 hours)**

### **Step 1: Preview Component (3 hours)**

Create: `components/cms/ArticlePreview.tsx`
- Side-by-side editor/preview
- Live markdown rendering
- Responsive preview toggle

### **Step 2: Preview Route (2 hours)**

Create: `app/api/preview/route.ts`
- Generate preview token
- Verify token
- Render draft content

### **Step 3: Preview Page (3 hours)**

Create: `app/preview/[id]/page.tsx`
- Authenticated preview
- Full article layout
- "This is a preview" banner

---

## 🟢 **PHASE 3: ADMIN CONSOLIDATION (10 hours)**

### **Goal:** Clean, unified admin dashboard

### **Step 1: Audit Current Routes (1 hour)**

Map all `/admin/*` routes:
- Identify duplicates
- Mark for removal
- Plan consolidation

### **Step 2: New Navigation (2 hours)**

Create: `components/admin/AdminNav.tsx`
```
Dashboard
├─ Content
│  ├─ Articles
│  ├─ Glossary
│  └─ Media
├─ Automation
│  ├─ AI Generator
│  └─ Scheduling
├─ Analytics
└─ Settings
   ├─ Team
   ├─ Categories
   └─ General
```

### **Step 3: Unified Dashboard (4 hours)**

Redesign: `app/admin/page.tsx`
- Key metrics widgets
- Recent content
- Quick actions
- Activity feed

### **Step 4: Remove Duplicates (3 hours)**

Delete/archive old routes:
- `/admin/generator` → `/admin/automation/ai`
- `/admin/pillar-pages` → `/admin/content/articles`
- etc.

---

## ⏱️ **TIME BREAKDOWN**

| Phase | Task | Hours |
|-------|------|-------|
| 0 | Migration | 0.08 |
| 1 | Media Library | 12 |
| 2 | Preview System | 8 |
| 3 | Admin Consolidation | 10 |
| 4 | Bulk Operations | 8 |
| 5 | Testing & Polish | 2 |
| **Total** | | **40** |

---

## 📅 **SUGGESTED SCHEDULE**

### **Tonight (Jan 3):**
- ✅ Apply migration (5 min)
- 🔴 Start media library DB setup (30 min)

### **Tomorrow (Jan 4):**
- 🔴 Complete media library (11.5 hours)

### **Sunday (Jan 5):**
- 🟡 Preview system (8 hours)

### **Monday-Tuesday (Jan 6-7):**
- 🟢 Admin consolidation (10 hours)
- 🟢 Bulk operations (8 hours)

### **Wednesday (Jan 8):**
- Testing & deployment (2 hours)

---

## ✅ **SUCCESS CRITERIA**

After completion, you should be able to:

1. ✅ Upload images via drag & drop
2. ✅ Browse media library
3. ✅ Select featured images for articles
4. ✅ Preview articles before publishing
5. ✅ Navigate admin cleanly
6. ✅ Bulk publish/delete articles
7. ✅ Auto-generate content with images
8. ✅ Track editorial workflow

---

## 🚀 **LET'S START!**

**Next Action:** Run the editorial team migration NOW!

Then start building the media library step-by-step.

I'll provide detailed code for each component as you build.

**Ready to start with Step 0?**
