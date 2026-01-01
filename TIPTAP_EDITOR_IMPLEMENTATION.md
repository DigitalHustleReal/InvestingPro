# Production-Grade TipTap Editor Implementation

## Overview
This is a compiler-style CMS editor built with TipTap v2 (React), designed for production use with 10,000+ articles.

## Architecture

### Core Principles
1. **Markdown is PRIMARY** - `body_markdown` is the source of truth
2. **HTML is DERIVED** - `body_html` is compiled from markdown
3. **No Business Logic in Editor** - Editor only handles content
4. **Semantic Images Only** - No file uploads, only references (e.g., `auto:elss:hero`)

### Data Flow

```
LOAD:
  body_markdown (PRIMARY) → HTML → TipTap Editor
  OR body_html (DERIVED) → TipTap Editor
  OR content (legacy) → TipTap Editor

SAVE:
  TipTap Editor → HTML → body_html (DERIVED)
  TipTap Editor → HTML → Markdown → body_markdown (PRIMARY)
```

## Components

### 1. `TiptapEditor` Component
**Location:** `components/admin/TiptapEditor.tsx`

**Features:**
- Headless TipTap configuration
- Loads from `body_markdown` (primary) or `body_html` (derived)
- Saves to both `body_markdown` and `body_html`
- Stable editor instance (no re-creation on re-render)
- SSR-safe (client-only rendering)

**Extensions Used:**
- StarterKit (with history disabled)
- Heading (H1-H3 only)
- Link (no auto-open)
- Table (resizable)
- SemanticImage (custom)
- HardBreak
- HorizontalRule

### 2. `SemanticImage` Extension
**Location:** `components/admin/extensions/SemanticImage.ts`

**Purpose:**
- Accepts semantic image references only (`auto:*`)
- Stores src exactly as provided
- Renders placeholder in editor
- Never resolves or fetches images

**Example Usage:**
- `auto:elss:hero`
- `auto:elss:diagram:lockin`
- `auto:mutual-funds:chart:returns`

### 3. Markdown Conversion Utilities
**Location:** `lib/editor/markdown.ts`

**Functions:**
- `markdownToHTML(markdown)` - Converts markdown to HTML (for editor loading)
- `htmlToMarkdown(html)` - Converts HTML to markdown (for saving)
- `tiptapToHTML(editor)` - Gets HTML from TipTap editor

**Libraries:**
- `marked` - Markdown → HTML
- `turndown` - HTML → Markdown

## Save Contract

When saving an article, the payload MUST include:
```typescript
{
    body_markdown: string,  // PRIMARY - source of truth
    body_html: string,      // DERIVED - compiled from markdown
    updated_at: string,     // ISO timestamp
    // ... other fields
}
```

**DO NOT:**
- Change status (only inspector does this)
- Publish content (only inspector does this)
- Modify metadata (only inspector does this)
- Touch featured_image (only inspector does this)
- Infer any business logic

## Usage

### Edit Page
```typescript
<TiptapEditor
    bodyMarkdown={article.body_markdown}
    bodyHtml={article.body_html}
    content={article.content} // Legacy fallback
    onChange={(markdown, html) => {
        setBodyMarkdown(markdown);
        setBodyHtml(html);
    }}
/>
```

### Save Handler
```typescript
await api.entities.Article.update(id, {
    body_markdown: bodyMarkdown, // PRIMARY
    body_html: bodyHtml,         // DERIVED
    updated_at: new Date().toISOString(),
});
```

## Database Schema

The `articles` table should have:
- `body_markdown` (TEXT) - PRIMARY content storage
- `body_html` (TEXT) - DERIVED content storage
- `content` (TEXT) - Legacy field (for backward compatibility)

## Testing Checklist

- [ ] Draft articles load correctly
- [ ] Existing content (markdown) loads correctly
- [ ] Existing content (HTML) loads correctly
- [ ] Empty editor works
- [ ] Saving creates both markdown and HTML
- [ ] Semantic images render as placeholders
- [ ] Editor doesn't crash on empty content
- [ ] Cursor position is preserved on updates
- [ ] Editor doesn't reset on re-render

## Performance Considerations

- Editor instance is memoized (created once)
- Content loading happens once on mount
- onChange is debounced (via TipTap's onUpdate)
- No unnecessary re-renders
- SSR-safe (client-only)

## Future Enhancements

Possible additions (NOT in current scope):
- Custom blocks (product comparison, calculator embed)
- Version history
- Collaborative editing
- Real-time preview
- Auto-save (with debounce)


