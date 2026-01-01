# Article Workflow Guide

## Overview
This guide explains the complete article workflow in the InvestingPro admin CMS.

## Workflow States

### 1. **Draft** (`status: 'draft'`)
- Initial state when creating a new article
- Articles in draft are visible to admins only
- Can be edited freely
- Not visible to public

### 2. **Review** (`status: 'review'`)
- Articles submitted for review
- Waiting for admin approval
- Can be edited by author
- Not visible to public

### 3. **Published** (`status: 'published'`)
- Articles that are live and visible to public
- Requires `submission_status: 'approved'` for user submissions
- Visible on the website
- Can be edited (changes go back to draft or stay published based on settings)

### 4. **Archived** (`status: 'archived'`)
- Old articles that are no longer active
- Not visible to public
- Can be restored to draft or published

## Submission Status (for user submissions)

- **`pending`**: Waiting for admin review
- **`approved`**: Approved by admin, can be published
- **`rejected`**: Rejected by admin
- **`revision-requested`**: Admin requested changes

## Article Creation Workflow

### Step 1: Create New Article
1. Go to `/admin/articles`
2. Click "New Article" button
3. Enter title and content
4. Set metadata in the inspector panel (right side)
5. Click "Save" to create as draft

### Step 2: Edit Article
1. From articles list, click the edit icon (pencil) on any article
2. Or navigate to `/admin/articles/[id]/edit`
3. Make changes to title, content, or metadata
4. Click "Save" to update

### Step 3: Publish Article
1. Open article in editor
2. In inspector panel, change status to "Published"
3. Click "Save" or "Publish" button
4. Article becomes visible to public

## Current Implementation

### Pages
- **`/admin/articles`** - List all articles with filters
- **`/admin/articles/new`** - Create new article
- **`/admin/articles/[id]/edit`** - Edit existing article

### API Methods
- **`Article.list()`** - Get all articles
- **`Article.getById(id)`** - Get single article by ID
- **`Article.create(data)`** - Create new article
- **`Article.update(id, data)`** - Update existing article
- **`Article.filter(filters)`** - Filter articles

### Features
- ✅ Create new articles
- ✅ Edit existing articles (including drafts)
- ✅ Save as draft
- ✅ Publish articles
- ✅ View article list with status filters
- ✅ Search articles
- ✅ Rich text editor (TipTap)
- ✅ Metadata management (SEO, categories, tags)

## Troubleshooting

### Draft articles not opening in editor
1. Check browser console for errors
2. Verify article ID is correct
3. Check if RLS is blocking access (if enabled)
4. Verify article exists in database

### Articles not saving
1. Check browser console for errors
2. Verify required fields (title, content)
3. Check network tab for API errors
4. Verify user is authenticated

### Articles not visible in list
1. Check status filter (might be filtering out drafts)
2. Check if RLS is enabled and blocking access
3. Verify articles exist in database
4. Check browser console for errors

## Next Steps

1. **RLS**: Currently disabled for development. Re-enable when ready for production.
2. **Auto-save**: Consider implementing auto-save functionality
3. **Versioning**: Consider adding article version history
4. **Preview**: Implement preview functionality
5. **Bulk actions**: Add bulk edit/publish/delete


