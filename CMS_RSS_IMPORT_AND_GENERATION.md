# RSS Import, Keyword Extraction & Automated Article Generation

**Date:** January 2025  
**Part of:** Advanced Automation Features

---

## 🎯 Overview

Automate content discovery and creation through RSS feed import, intelligent keyword extraction, and AI-powered article generation.

---

## 📊 Features

### 1. RSS Feed Import System

**Purpose:** Import and process RSS feeds automatically

**Database Tables:**
- `rss_feeds` - Feed configuration
- `rss_feed_items` - Imported items
- `rss_import_jobs` - Import job tracking

**Features:**
- ✅ RSS feed management (add, edit, delete feeds)
- ✅ Automatic feed fetching (hourly/daily/weekly)
- ✅ Feed item parsing and storage
- ✅ Filter rules (keywords, domains, date ranges)
- ✅ Duplicate detection (by GUID)
- ✅ Error handling and retry logic
- ✅ Import job tracking and history

---

### 2. Keyword Extraction from RSS Items

**Purpose:** Automatically extract keywords from imported RSS content

**Database Tables:**
- `keyword_extractions` - Extraction results
- Enhanced `rss_feed_items` with `extracted_keywords` field

**Extraction Methods:**
1. **AI-Powered Extraction** (Primary)
   - Use LLM to extract relevant keywords
   - Understand context and semantic meaning
   - Extract entities (people, places, organizations)

2. **NLP-Based Extraction** (Secondary)
   - TF-IDF analysis
   - RAKE algorithm
   - Named entity recognition

3. **Hybrid Approach** (Recommended)
   - Combine AI and NLP for accuracy
   - Validate and rank keywords

**Features:**
- ✅ Extract primary keywords
- ✅ Generate long-tail keyword variants
- ✅ Extract named entities
- ✅ Topic categorization
- ✅ Sentiment analysis
- ✅ Keyword relevance scoring

---

### 3. Automated Article Generation from RSS

**Purpose:** Generate articles automatically from RSS feed items

**Database Tables:**
- `rss_article_generation_rules` - Generation rules per feed
- Link between `rss_feed_items` and `articles`

**Generation Process:**
1. **Keyword Extraction** (if enabled)
   - Extract keywords from RSS item
   - Identify primary and secondary keywords
   - Generate long-tail variants

2. **Content Analysis**
   - Analyze RSS item content
   - Determine topic and category
   - Extract key points

3. **Article Generation**
   - Use AI to expand RSS item into full article
   - Apply transformation rules
   - Generate structured content (headings, sections, FAQs)

4. **Enhancement**
   - Add SEO metadata
   - Generate feature image
   - Add internal linking suggestions
   - Create excerpt

5. **Publication**
   - Save as draft (default) or publish
   - Add source attribution
   - Link back to original RSS item

---

## 🔧 Implementation Details

### RSS Feed Management

**API Routes:**
- `GET /api/rss/feeds` - List all RSS feeds
- `POST /api/rss/feeds` - Create new RSS feed
- `PUT /api/rss/feeds/:id` - Update RSS feed
- `DELETE /api/rss/feeds/:id` - Delete RSS feed
- `POST /api/rss/feeds/:id/fetch` - Manual fetch
- `GET /api/rss/feeds/:id/items` - Get feed items
- `GET /api/rss/feeds/:id/jobs` - Get import jobs

**Components:**
- `components/admin/RSSFeedManager.tsx` - Feed management UI
- `components/admin/RSSFeedForm.tsx` - Create/edit feed form
- `components/admin/RSSFeedList.tsx` - Feed list with status
- `components/admin/RSSFeedItems.tsx` - Display imported items
- `app/admin/rss-feeds/page.tsx` - RSS feeds management page

**Features:**
- Add RSS feed URL
- Test feed connection
- Configure import frequency
- Set filter rules
- Enable/disable auto-import
- View import history
- Error monitoring

---

### Keyword Extraction Service

**API Routes:**
- `POST /api/keywords/extract` - Extract keywords from text
- `POST /api/keywords/extract/rss-item/:id` - Extract from RSS item
- `GET /api/keywords/extractions/:id` - Get extraction results

**Service Implementation:**
```typescript
// lib/keyword-research/extractors/KeywordExtractor.ts

export class KeywordExtractor {
  // AI-powered extraction (using LLM)
  async extractWithAI(text: string): Promise<KeywordExtractionResult>
  
  // NLP-based extraction (TF-IDF, RAKE)
  async extractWithNLP(text: string): Promise<KeywordExtractionResult>
  
  // Hybrid approach (combine both)
  async extractHybrid(text: string): Promise<KeywordExtractionResult>
  
  // Extract from RSS item
  async extractFromRSSItem(itemId: string): Promise<KeywordExtractionResult>
  
  // Extract entities (named entity recognition)
  async extractEntities(text: string): Promise<Entity[]>
}
```

**Components:**
- `components/admin/KeywordExtractionPanel.tsx` - Show extracted keywords
- `components/admin/KeywordExtractor.tsx` - Manual extraction interface
- Integration in RSS feed items view

**Extraction Prompt (AI):**
```typescript
const EXTRACTION_PROMPT = `
Extract keywords from this content:
${content}

Return JSON:
{
  "primary_keywords": ["keyword1", "keyword2"],
  "long_tail_keywords": ["long tail 1", "long tail 2"],
  "entities": {
    "people": [],
    "organizations": [],
    "places": []
  },
  "topics": ["topic1", "topic2"],
  "sentiment": 0.5
}
`;
```

---

### Article Generation from RSS

**API Routes:**
- `POST /api/rss/generate-article/:itemId` - Generate article from RSS item
- `POST /api/rss/generate-batch` - Generate articles for multiple items
- `GET /api/rss/generation-rules/:feedId` - Get generation rules
- `POST /api/rss/generation-rules` - Create/update generation rules
- `POST /api/rss/generate-preview/:itemId` - Preview generated article

**Service Implementation:**
```typescript
// lib/rss-import/article-generator.ts

export class RSSArticleGenerator {
  // Generate article from RSS item
  async generateFromRSSItem(
    rssItem: RSSFeedItem,
    rules: GenerationRule
  ): Promise<Article>
  
  // Extract and enhance keywords
  async extractAndEnhanceKeywords(rssItem: RSSFeedItem): Promise<Keyword[]>
  
  // Transform content using AI
  async transformContent(
    rssContent: string,
    transformationPrompt: string
  ): Promise<StructuredContent>
  
  // Generate full article with structure
  async generateFullArticle(
    rssItem: RSSFeedItem,
    keywords: Keyword[],
    rules: GenerationRule
  ): Promise<Article>
}
```

**Components:**
- `components/admin/RSSArticleGenerator.tsx` - Generation interface
- `components/admin/GenerationRules.tsx` - Rule configuration
- `components/admin/GeneratedArticlePreview.tsx` - Preview before saving
- Integration in RSS feed items list

**Generation Prompt Template:**
```typescript
const ARTICLE_GENERATION_PROMPT = `
Based on this RSS feed item, generate a comprehensive article:

Title: ${rssItem.title}
Content: ${rssItem.content}
Primary Keywords: ${keywords.primary.join(', ')}
Category: ${category}

Requirements:
- Generate structured JSON content (headings, sections, FAQs, tables)
- Word count: ${targetWordCount}
- Include SEO optimization
- Add source attribution
- Expand on key points from RSS item
- Make it comprehensive and valuable

Return structured JSON following the StructuredContent interface.
`;
```

---

## 🔄 Automation Workflow

### Automated RSS Import & Generation Flow

```
1. RSS Feed Fetch (Scheduled Job)
   ↓
2. Parse RSS Items
   ↓
3. Filter Items (by rules)
   ↓
4. Store RSS Items
   ↓
5. Keyword Extraction (if enabled)
   ↓
6. Article Generation (if auto_generate_articles = true)
   ↓
7. Save as Draft (default) or Publish
   ↓
8. Generate Feature Image (if enabled)
   ↓
9. Distribute to Social (if enabled)
```

---

## 🎨 UI Components

### RSS Feeds Management Page

**Location:** `/admin/rss-feeds`

**Features:**
- List of all RSS feeds
- Add new feed button
- Feed status indicators
- Last fetch time
- Item count
- Error indicators
- Quick actions (fetch now, edit, delete)

### RSS Feed Items View

**Features:**
- List of imported items from feed
- Filter by status (pending, processed, generated, skipped)
- Search by title/keywords
- Bulk actions (generate articles, extract keywords)
- Item details (title, description, keywords, generated article link)

### Generation Rules Configuration

**Features:**
- Template selection
- Transformation prompt editor
- Keyword strategy selection
- Category mapping
- Auto-publish settings
- Word count target
- Preview generated content

---

## 📋 Keyword Extraction Strategies

### 1. Extract-Only Strategy
- Extract keywords from RSS item
- Use extracted keywords for article

### 2. Use Feed Keywords
- Use RSS categories/tags as keywords
- Supplement with extracted keywords

### 3. Generate New Keywords
- Generate fresh keywords based on content
- Use AI to suggest relevant keywords

### 4. Hybrid Strategy (Recommended)
- Extract keywords from RSS item
- Generate additional keywords
- Use RSS categories as secondary keywords
- Combine and rank all keywords

---

## 🔗 Integration Points

### Enhanced ArticleInspector

Add to ArticleInspector:
- **Source Information Panel** (if from RSS)
  - Original RSS feed name
  - Original RSS item link
  - Import date
  - Source attribution settings

### Enhanced Content Calendar

- Show RSS imports on calendar
- Show generated articles from RSS
- Track generation schedule

### Enhanced Automation Controls

- Add RSS feed fetch triggers
- Add batch article generation
- RSS import job status

---

## 📊 Database Schema Summary

**New Tables:**
1. `rss_feeds` - Feed configuration
2. `rss_feed_items` - Imported items
3. `rss_import_jobs` - Import tracking
4. `keyword_extractions` - Extraction results
5. `rss_article_generation_rules` - Generation rules

**Enhanced Tables:**
- `rss_feed_items.extracted_keywords` - Keywords from extraction
- `rss_feed_items.generated_article_id` - Link to generated article

---

## 🚀 Implementation Priority

### Phase 1: RSS Import (Week 1)
- RSS feed management
- Feed fetching and parsing
- Item storage
- Import job tracking

### Phase 2: Keyword Extraction (Week 2)
- Keyword extraction service
- AI-powered extraction
- NLP-based extraction
- Keyword storage

### Phase 3: Article Generation (Week 3-4)
- Generation rules system
- AI article generation
- Content transformation
- Preview and review system

---

## ✅ Success Metrics

**RSS Import:**
- Feeds successfully imported: >95%
- Items processed per feed: All items
- Import frequency: As configured (hourly/daily/weekly)

**Keyword Extraction:**
- Keywords extracted per item: 10-20
- Extraction accuracy: >85%
- Processing time: <5 seconds per item

**Article Generation:**
- Articles generated from RSS: >80% of eligible items
- Quality score: >80/100
- Auto-publish rate: Configurable (default: draft)

---

## 🔌 External Dependencies

- RSS Parser library (e.g., `rss-parser` for Node.js)
- LLM API for keyword extraction and article generation
- NLP libraries (optional, for hybrid extraction)

---

This system enables fully automated content discovery, keyword extraction, and article generation from RSS feeds, significantly reducing manual content creation effort.

