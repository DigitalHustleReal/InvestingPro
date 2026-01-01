# CMS Fixes Implementation Plan

## FIX 1: TipTap Editor - Proper Content Loading

**Problem**: Editor initialized empty, then content set in useEffect causing timing issues.

**Solution**: 
- Use `key` prop to force re-initialization when article changes
- Normalize content BEFORE editor creation
- Initialize editor with content directly if available

## FIX 2: Unified Content Contract

**Problem**: Multiple content sources causing confusion.

**Solution**:
- `body_markdown` is PRIMARY (source of truth)
- `body_html` is DERIVED (always generated from markdown)
- `content` is legacy fallback only

## FIX 3: Save/Publish Flow

**Problem**: Cache not invalidating properly, UI not updating.

**Solution**:
- Proper optimistic updates
- Targeted cache invalidation
- RevalidatePath for public routes
- Always set published_at on publish

## FIX 4: Article List State

**Problem**: List resets, cache issues.

**Solution**:
- Single fetch method
- Consistent cache keys
- Proper invalidation on mutations

## FIX 5: Routing & Preview

**Problem**: Preview 404s, slug mismatches.

**Solution**:
- Stable slug generation
- Better error handling
- Consistent fetch logic


