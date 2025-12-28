# CMS Advanced Automation Features - Keyword Research, SEO, Social, Visual & RSS Import

**Date:** January 2025  
**Objective:** Add keyword research automation, SEO integrations, social media automation, visual content generation, and RSS import with automated article generation

---

## 🎯 New Feature Categories

### 1. Keyword Research & SEO Intelligence Automation
### 2. SEO Service Integrations (Google Search Console, Google Trends)
### 3. Social Media Automation (Buffer, Repurposing)
### 4. Visual Content Generation (Feature Images, Graphics)
### 5. RSS Import & Automated Article Generation (NEW)

---

## 📊 1. KEYWORD RESEARCH AUTOMATION

### 1.1 Long-Tail Keyword Generation

**Purpose:** Automatically generate long-tail keywords for content optimization

**Database Schema:**
```sql
-- Keyword Research & Suggestions
CREATE TABLE IF NOT EXISTS keyword_research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    primary_keyword TEXT NOT NULL,
    keyword_type TEXT NOT NULL CHECK (keyword_type IN ('primary', 'long-tail', 'semantic', 'alternative', 'lsi')),
    keyword_text TEXT NOT NULL,
    search_volume INTEGER,
    competition_score NUMERIC, -- 0-100
    difficulty_score NUMERIC, -- 0-100
    cpc NUMERIC, -- Cost per click
    trend_data JSONB, -- Trend over time
    suggestions_source TEXT, -- 'google_trends', 'search_console', 'ai_generated'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id, keyword_text)
);

CREATE INDEX idx_keyword_research_article ON keyword_research(article_id);
CREATE INDEX idx_keyword_research_type ON keyword_research(keyword_type);

-- Keyword Clusters for Topical Authority
CREATE TABLE IF NOT EXISTS keyword_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_name TEXT NOT NULL, -- Topic cluster name
    primary_keyword TEXT NOT NULL,
    related_keywords TEXT[] NOT NULL,
    authority_score NUMERIC DEFAULT 0, -- 0-100
    coverage_percentage NUMERIC DEFAULT 0, -- % of cluster keywords covered
    articles_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS article_keyword_clusters (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    cluster_id UUID REFERENCES keyword_clusters(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, cluster_id)
);
```

**API Routes:**
- `app/api/keywords/generate/route.ts` - Generate long-tail keywords from primary keyword
- `app/api/keywords/research/route.ts` - Full keyword research for article
- `app/api/keywords/clusters/route.ts` - Topical authority clustering
- `app/api/keywords/suggestions/route.ts` - Get keyword suggestions

**Components:**
- `components/admin/KeywordResearch.tsx` - Keyword research panel
- `components/admin/LongTailKeywordGenerator.tsx` - Generate long-tail variants
- `components/admin/KeywordSuggestions.tsx` - Show keyword suggestions in Inspector
- `components/admin/TopicalAuthorityTracker.tsx` - Track cluster coverage

**Features:**
- AI-powered long-tail keyword generation
- Search volume and competition data (via APIs)
- Keyword difficulty scoring
- Related keyword suggestions
- LSI (Latent Semantic Indexing) keywords

---

### 1.2 Semantic Title Generation

**Purpose:** Generate multiple semantic variations of titles optimized for SEO

**Database Schema:**
```sql
-- Generated Title Variations
CREATE TABLE IF NOT EXISTS title_variations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    title_text TEXT NOT NULL,
    variation_type TEXT CHECK (variation_type IN ('semantic', 'question', 'number', 'emotional', 'power-word')),
    seo_score INTEGER, -- SEO quality score
    click_through_score INTEGER, -- Predicted CTR score
    length_score INTEGER, -- Length optimization score
    keyword_density NUMERIC,
    is_selected BOOLEAN DEFAULT FALSE,
    generated_by TEXT, -- 'ai', 'search_console', 'trends'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_title_variations_article ON title_variations(article_id);
```

**API Routes:**
- `app/api/titles/generate/route.ts` - Generate semantic title variations
- `app/api/titles/analyze/route.ts` - Analyze title SEO quality
- `app/api/titles/optimize/route.ts` - Optimize title based on keyword research

**Components:**
- `components/admin/SemanticTitleGenerator.tsx` - Title generation interface
- `components/admin/TitleOptimizer.tsx` - Title SEO analyzer
- Integration in ArticleInspector

**Features:**
- Generate 10+ semantic title variations
- Question-based titles ("How to...", "What is...")
- Number-based titles ("5 Ways to...", "10 Best...")
- Emotional/power-word titles
- SEO scoring for each variation
- Click-through rate prediction

---

### 1.3 Alternative Keyword Suggestions

**Purpose:** Suggest alternative keywords to improve content coverage

**Database Schema:**
```sql
-- Alternative Keywords (already in keyword_research, but enhance with)
-- Add fields to keyword_research:
ALTER TABLE keyword_research ADD COLUMN IF NOT EXISTS is_alternative BOOLEAN DEFAULT FALSE;
ALTER TABLE keyword_research ADD COLUMN IF NOT EXISTS parent_keyword_id UUID REFERENCES keyword_research(id);
ALTER TABLE keyword_research ADD COLUMN IF NOT EXISTS similarity_score NUMERIC; -- Similarity to primary keyword
```

**Features:**
- Show alternative keywords in ArticleInspector
- Auto-suggest during content creation
- Coverage analysis (which keywords are covered)
- Gap identification (missing keywords)

---

### 1.4 Topical Authority Tracking

**Purpose:** Track and improve topical authority for keyword clusters

**Components:**
- `components/admin/TopicalAuthorityDashboard.tsx` - Authority tracking dashboard
- `components/admin/ClusterCoverage.tsx` - Visualize cluster coverage
- `app/admin/topical-authority/page.tsx` - Authority management page

**Features:**
- Track keyword cluster coverage
- Authority score calculation
- Content gap identification
- Recommendations for improving authority
- Visual cluster map

---

## 🔍 2. SEO SERVICE INTEGRATIONS

### 2.1 Google Search Console Integration

**Purpose:** Connect GSC for real performance data and keyword insights

**Database Schema:**
```sql
-- Google Search Console Integration
CREATE TABLE IF NOT EXISTS seo_service_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_type TEXT NOT NULL CHECK (service_type IN ('google_search_console', 'google_trends', 'ahrefs', 'semrush', 'moz')),
    service_name TEXT NOT NULL,
    config JSONB NOT NULL, -- API keys, tokens, credentials (encrypted)
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error', 'expired')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_frequency TEXT DEFAULT 'daily' CHECK (sync_frequency IN ('hourly', 'daily', 'weekly')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GSC Performance Data
CREATE TABLE IF NOT EXISTS gsc_performance_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    query_date DATE NOT NULL,
    clicks INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    ctr NUMERIC, -- Click-through rate
    position NUMERIC, -- Average position
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(article_id, keyword, query_date)
);

CREATE INDEX idx_gsc_performance_article ON gsc_performance_data(article_id);
CREATE INDEX idx_gsc_performance_date ON gsc_performance_data(query_date DESC);

-- GSC Issues Tracking
CREATE TABLE IF NOT EXISTS gsc_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    issue_type TEXT NOT NULL, -- 'mobile-usability', 'page-speed', 'indexing', 'security'
    issue_description TEXT,
    severity TEXT CHECK (severity IN ('error', 'warning', 'info')),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_gsc_issues_article ON gsc_issues(article_id);
CREATE INDEX idx_gsc_issues_resolved ON gsc_issues(resolved);
```

**API Routes:**
- `app/api/seo/gsc/connect/route.ts` - OAuth connection to GSC
- `app/api/seo/gsc/sync/route.ts` - Sync GSC data
- `app/api/seo/gsc/performance/route.ts` - Get performance data for article
- `app/api/seo/gsc/keywords/route.ts` - Get keyword data from GSC
- `app/api/seo/gsc/issues/route.ts` - Get and track GSC issues

**Components:**
- `components/admin/GSCIntegration.tsx` - GSC connection management
- `components/admin/GSCPerformance.tsx` - Show GSC data in Inspector
- `components/admin/GSCIssues.tsx` - Display and track GSC issues
- `app/admin/seo-integrations/page.tsx` - SEO service management page

**Features:**
- OAuth connection to Google Search Console
- Automatic data sync (daily/hourly)
- Keyword performance tracking
- Click/impression/CTR data per article
- Issue detection and tracking
- Keyword suggestions from GSC data

---

### 2.2 Google Trends Integration

**Purpose:** Get trending keywords and seasonal insights

**Database Schema:**
```sql
-- Google Trends Data
CREATE TABLE IF NOT EXISTS google_trends_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword TEXT NOT NULL,
    region TEXT DEFAULT 'IN', -- Country code
    trend_date DATE NOT NULL,
    interest_score INTEGER, -- 0-100
    related_queries JSONB, -- Related rising/queries
    related_topics JSONB, -- Related topics
    seasonal_pattern JSONB, -- Seasonal trends
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(keyword, region, trend_date)
);

CREATE INDEX idx_trends_data_keyword ON google_trends_data(keyword);
CREATE INDEX idx_trends_data_date ON google_trends_data(trend_date DESC);
```

**API Routes:**
- `app/api/seo/trends/connect/route.ts` - Connect to Google Trends API
- `app/api/seo/trends/keyword/route.ts` - Get trends for keyword
- `app/api/seo/trends/related/route.ts` - Get related queries/topics
- `app/api/seo/trends/seasonal/route.ts` - Get seasonal patterns

**Components:**
- `components/admin/GoogleTrendsWidget.tsx` - Trends data display
- Integration in KeywordResearch component
- Trends-based keyword suggestions

**Features:**
- Trending keyword identification
- Seasonal pattern analysis
- Related queries suggestions
- Interest score tracking
- Regional trend data

---

### 2.3 Other SEO Services (Extensible)

**Database Schema:**
- Use `seo_service_integrations` table (already defined above)

**Supported Services:**
- Ahrefs API
- SEMrush API
- Moz API
- Screaming Frog (via API if available)

**Components:**
- `components/admin/SEOServiceManager.tsx` - Manage multiple SEO service connections
- Service-specific adapters in `lib/seo-services/adapters/`

**Features:**
- Unified interface for multiple SEO services
- Service-specific data aggregation
- Competitive analysis
- Backlink tracking

---

## 📱 3. SOCIAL MEDIA AUTOMATION

### 3.1 Buffer/Social Scheduler Integration

**Purpose:** Schedule and automate social media posts

**Database Schema:**
```sql
-- Social Media Schedulers (Buffer, Hootsuite, etc.)
CREATE TABLE IF NOT EXISTS social_scheduler_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheduler_type TEXT NOT NULL CHECK (scheduler_type IN ('buffer', 'hootsuite', 'later', 'sprout_social', 'native')),
    scheduler_name TEXT NOT NULL,
    config JSONB NOT NULL, -- API tokens, credentials (encrypted)
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Media Accounts
CREATE TABLE IF NOT EXISTS social_media_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheduler_id UUID REFERENCES social_scheduler_integrations(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'linkedin', 'instagram', 'pinterest', 'youtube')),
    account_name TEXT NOT NULL,
    account_id TEXT NOT NULL, -- Platform-specific account ID
    account_handle TEXT, -- @username
    profile_data JSONB, -- Profile info, followers, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_social_accounts_scheduler ON social_media_accounts(scheduler_id);
CREATE INDEX idx_social_accounts_platform ON social_media_accounts(platform);

-- Social Media Posts (already in content_distributions, but enhance)
-- Enhance content_distributions table:
ALTER TABLE content_distributions ADD COLUMN IF NOT EXISTS scheduler_id UUID REFERENCES social_scheduler_integrations(id);
ALTER TABLE content_distributions ADD COLUMN IF NOT EXISTS post_format JSONB; -- Platform-specific formatting
ALTER TABLE content_distributions ADD COLUMN IF NOT EXISTS media_urls TEXT[]; -- Attached media
ALTER TABLE content_distributions ADD COLUMN IF NOT EXISTS engagement_metrics JSONB; -- Likes, shares, comments
```

**API Routes:**
- `app/api/social/buffer/connect/route.ts` - OAuth connection to Buffer
- `app/api/social/buffer/accounts/route.ts` - Get connected accounts
- `app/api/social/buffer/schedule/route.ts` - Schedule post via Buffer
- `app/api/social/buffer/posts/route.ts` - Get scheduled posts
- `app/api/social/buffer/analytics/route.ts` - Get post analytics

**Components:**
- `components/admin/BufferIntegration.tsx` - Buffer connection
- `components/admin/SocialScheduler.tsx` - Schedule social posts
- `components/admin/SocialPostPreview.tsx` - Preview posts per platform
- Enhanced DistributionManager with scheduler options

**Features:**
- OAuth connection to Buffer (and other schedulers)
- Multi-platform scheduling
- Post formatting per platform
- Schedule optimization (best times)
- Post performance tracking

---

### 3.2 Content Repurposing (Long-form → Social Posts)

**Purpose:** Automatically create social media posts from long-form content

**Database Schema:**
```sql
-- Content Repurposing Templates
CREATE TABLE IF NOT EXISTS repurposing_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'linkedin', 'instagram', 'pinterest')),
    template_structure JSONB NOT NULL, -- How to extract/format content
    character_limit INTEGER,
    include_hashtags BOOLEAN DEFAULT TRUE,
    include_cta BOOLEAN DEFAULT TRUE,
    include_media BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Repurposed Content
CREATE TABLE IF NOT EXISTS repurposed_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES repurposing_templates(id),
    platform TEXT NOT NULL,
    content_text TEXT NOT NULL,
    media_urls TEXT[],
    hashtags TEXT[],
    extracted_from TEXT, -- 'excerpt', 'section_1', 'key_points', etc.
    auto_generated BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_repurposed_content_article ON repurposed_content(source_article_id);
```

**API Routes:**
- `app/api/content/repurpose/route.ts` - Generate repurposed content from article
- `app/api/content/repurpose/templates/route.ts` - Manage repurposing templates
- `app/api/content/repurpose/preview/route.ts` - Preview repurposed content

**Components:**
- `components/admin/ContentRepurposing.tsx` - Repurposing interface
- `components/admin/RepurposingTemplates.tsx` - Template manager
- `components/admin/RepurposedContentPreview.tsx` - Preview repurposed posts
- Integration in ArticleInspector - "Repurpose" button

**Features:**
- Auto-extract key points from article
- Generate platform-specific posts
- Multiple variations per platform
- Hashtag suggestion and inclusion
- Quote extraction for Twitter/LinkedIn
- Thread generation for Twitter
- Carousel generation for Instagram

**AI Prompt Strategy:**
```typescript
// Repurposing prompts per platform
const REPURPOSING_PROMPTS = {
  twitter: "Extract 3-5 key insights from this article and create Twitter thread (280 chars per tweet, max 5 tweets)",
  linkedin: "Create a professional LinkedIn post (300-500 words) with key takeaways and CTA",
  facebook: "Create an engaging Facebook post (200-300 words) with hook and call-to-action",
  instagram: "Create Instagram carousel post with 5-7 slides, each with key point and visual description"
};
```

---

## 🎨 4. VISUAL CONTENT GENERATION

### 4.1 Inbuilt Feature Image Generation

**Purpose:** Automatically generate feature images for articles using AI

**Database Schema:**
```sql
-- Generated Images
CREATE TABLE IF NOT EXISTS generated_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    image_type TEXT NOT NULL CHECK (image_type IN ('feature', 'social', 'thumbnail', 'infographic', 'graphic')),
    prompt_used TEXT NOT NULL,
    image_url TEXT NOT NULL,
    provider TEXT, -- 'dalle', 'midjourney', 'stable_diffusion', 'custom'
    generation_params JSONB, -- Size, style, etc.
    brand_colors JSONB, -- Colors used from brand palette
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_generated_images_article ON generated_images(article_id);
CREATE INDEX idx_generated_images_type ON generated_images(image_type);

-- Brand Color Palette (for consistent visuals)
CREATE TABLE IF NOT EXISTS brand_color_palette (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    color_name TEXT NOT NULL, -- 'primary', 'secondary', 'accent', etc.
    hex_code TEXT NOT NULL,
    usage_context TEXT[], -- ['feature_images', 'graphics', 'social_posts']
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**API Routes:**
- `app/api/images/generate/route.ts` - Generate image using AI
- `app/api/images/generate/feature/route.ts` - Generate feature image specifically
- `app/api/images/generate/batch/route.ts` - Generate multiple variations
- `app/api/images/brand-colors/route.ts` - Manage brand color palette

**Components:**
- `components/admin/ImageGenerator.tsx` - Image generation interface
- `components/admin/FeatureImageGenerator.tsx` - Feature image generator
- `components/admin/BrandColorPicker.tsx` - Brand color management
- Integration in ArticleInspector - "Generate Feature Image" button

**Features:**
- AI image generation (DALL-E, Stable Diffusion, etc.)
- Automatic prompt generation from article content
- Brand color integration
- Multiple style options
- Image variations generation
- Automatic optimization (compression, format conversion)
- Social media optimized sizes (Facebook, Twitter, LinkedIn, Instagram)

**Image Generation Prompts:**
```typescript
// Auto-generate prompt from article
const generateImagePrompt = (article: Article) => {
  return `Professional feature image for article: "${article.title}". 
    Style: Modern, clean, financial/business theme. 
    Colors: ${brandColors.primary}, ${brandColors.secondary}. 
    No text overlay, suitable for blog header.`;
};
```

---

### 4.2 Graphics & Visual Content with Brand Colors

**Purpose:** Generate graphics, infographics, and visual elements for content

**Database Schema:**
```sql
-- Generated Graphics
CREATE TABLE IF NOT EXISTS generated_graphics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    graphic_type TEXT NOT NULL CHECK (graphic_type IN ('infographic', 'chart', 'diagram', 'quote_card', 'cta_banner', 'icon')),
    content_data JSONB NOT NULL, -- Data to visualize
    template_id UUID, -- Reference to graphic template
    image_url TEXT NOT NULL,
    brand_colors_used TEXT[], -- Array of hex codes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_generated_graphics_article ON generated_graphics(article_id);

-- Graphic Templates
CREATE TABLE IF NOT EXISTS graphic_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    graphic_type TEXT NOT NULL,
    template_structure JSONB NOT NULL, -- SVG/HTML structure
    default_colors JSONB, -- Default color scheme
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**API Routes:**
- `app/api/graphics/generate/route.ts` - Generate graphic from data
- `app/api/graphics/templates/route.ts` - Manage graphic templates
- `app/api/graphics/infographic/route.ts` - Generate infographic from article

**Components:**
- `components/admin/GraphicsGenerator.tsx` - Graphics generation interface
- `components/admin/InfographicBuilder.tsx` - Build infographics
- `components/admin/GraphicTemplates.tsx` - Template library
- `components/admin/BrandGraphics.tsx` - Brand-consistent graphics

**Features:**
- Infographic generation from article content
- Quote cards with brand styling
- Chart/diagram generation
- CTA banners
- Icon generation
- Brand color enforcement
- SVG/PNG output options

---

## 📰 5. RSS IMPORT & AUTOMATED ARTICLE GENERATION

### 5.1 RSS Feed Import System

**Purpose:** Automatically import and process RSS feeds

**Database Schema:**
- See `lib/supabase/rss_import_schema.sql` for complete schema
- `rss_feeds` - Feed configuration and settings
- `rss_feed_items` - Imported RSS items
- `rss_import_jobs` - Import job tracking

**Features:**
- RSS feed management (add, edit, delete)
- Automatic feed fetching (hourly/daily/weekly)
- Feed item parsing and storage
- Filter rules (keywords, domains, date ranges)
- Duplicate detection
- Error handling and retry logic

**API Routes:**
- `GET /api/rss/feeds` - List all feeds
- `POST /api/rss/feeds` - Create feed
- `PUT /api/rss/feeds/:id` - Update feed
- `POST /api/rss/feeds/:id/fetch` - Manual fetch
- `GET /api/rss/feeds/:id/items` - Get feed items
- `GET /api/rss/feeds/:id/jobs` - Get import jobs

**Components:**
- `components/admin/RSSFeedManager.tsx` - Feed management
- `components/admin/RSSFeedForm.tsx` - Create/edit feed
- `components/admin/RSSFeedItems.tsx` - Display items
- `app/admin/rss-feeds/page.tsx` - RSS management page

---

### 5.2 Keyword Extraction from RSS Items

**Purpose:** Automatically extract keywords from imported RSS content

**Database Schema:**
- `keyword_extractions` - Extraction results
- `rss_feed_items.extracted_keywords` - Keywords array

**Extraction Methods:**
1. **AI-Powered** - Use LLM for contextual extraction
2. **NLP-Based** - TF-IDF, RAKE, named entity recognition
3. **Hybrid** - Combine both for accuracy

**Features:**
- Extract primary and long-tail keywords
- Named entity recognition (people, places, organizations)
- Topic categorization
- Sentiment analysis
- Keyword relevance scoring

**API Routes:**
- `POST /api/keywords/extract` - Extract from text
- `POST /api/keywords/extract/rss-item/:id` - Extract from RSS item
- `GET /api/keywords/extractions/:id` - Get results

**Components:**
- `components/admin/KeywordExtractionPanel.tsx` - Show extracted keywords
- `components/admin/KeywordExtractor.tsx` - Manual extraction
- Integration in RSS items view

---

### 5.3 Automated Article Generation from RSS

**Purpose:** Generate articles automatically from RSS feed items

**Database Schema:**
- `rss_article_generation_rules` - Generation rules per feed
- `rss_feed_items.generated_article_id` - Link to article

**Generation Process:**
1. Keyword extraction (if enabled)
2. Content analysis
3. AI article generation (structured JSON)
4. SEO enhancement
5. Feature image generation (optional)
6. Save as draft or publish

**Features:**
- Configurable generation rules per feed
- Content transformation (summarize, expand)
- Template-based generation
- Category mapping
- Source attribution
- Auto-publish or draft mode

**API Routes:**
- `POST /api/rss/generate-article/:itemId` - Generate article
- `POST /api/rss/generate-batch` - Batch generation
- `GET /api/rss/generation-rules/:feedId` - Get rules
- `POST /api/rss/generation-rules` - Create/update rules
- `POST /api/rss/generate-preview/:itemId` - Preview

**Components:**
- `components/admin/RSSArticleGenerator.tsx` - Generation interface
- `components/admin/GenerationRules.tsx` - Rule configuration
- `components/admin/GeneratedArticlePreview.tsx` - Preview

**Service:**
```typescript
// lib/rss-import/article-generator.ts
export class RSSArticleGenerator {
  async generateFromRSSItem(item: RSSFeedItem, rules: GenerationRule): Promise<Article>
  async extractAndEnhanceKeywords(item: RSSFeedItem): Promise<Keyword[]>
  async transformContent(content: string, prompt: string): Promise<StructuredContent>
}
```

---

## 🔧 Implementation Architecture

### Service Layer Structure

```
lib/
├── keyword-research/
│   ├── generators/
│   │   ├── LongTailGenerator.ts
│   │   ├── SemanticTitleGenerator.ts
│   │   └── AlternativeKeywordGenerator.ts
│   ├── analyzers/
│   │   ├── TopicalAuthorityAnalyzer.ts
│   │   └── KeywordClusterAnalyzer.ts
│   ├── extractors/
│   │   ├── KeywordExtractor.ts (AI-powered)
│   │   ├── NLPKeywordExtractor.ts (TF-IDF, RAKE)
│   │   └── HybridKeywordExtractor.ts
│   └── KeywordResearchService.ts
├── rss-import/
│   ├── feed-parser/
│   │   ├── RSSParser.ts
│   │   └── FeedFetcher.ts
│   ├── article-generator/
│   │   ├── RSSArticleGenerator.ts
│   │   └── ContentTransformer.ts
│   ├── keyword-extraction/
│   │   └── RSSKeywordExtractor.ts
│   └── RSSImportService.ts
├── seo-services/
│   ├── adapters/
│   │   ├── GoogleSearchConsoleAdapter.ts
│   │   ├── GoogleTrendsAdapter.ts
│   │   ├── AhrefsAdapter.ts
│   │   └── SEMrushAdapter.ts
│   └── SEOServiceManager.ts
├── social-media/
│   ├── schedulers/
│   │   ├── BufferAdapter.ts
│   │   ├── HootsuiteAdapter.ts
│   │   └── NativeScheduler.ts
│   ├── repurposing/
│   │   ├── ContentRepurposer.ts
│   │   └── PlatformFormatters.ts
│   └── SocialMediaService.ts
└── visual-content/
    ├── image-generation/
    │   ├── ImageGenerator.ts (DALL-E, Stable Diffusion)
    │   └── PromptBuilder.ts
    ├── graphics/
    │   ├── InfographicGenerator.ts
    │   ├── ChartGenerator.ts
    │   └── TemplateRenderer.ts
    └── brand/
        └── BrandColorManager.ts
```

---

## 📋 Component Integration Points

### ArticleInspector Enhancements

Add new sections to `ArticleInspector.tsx`:

1. **Keyword Research Panel**
   - Long-tail keyword suggestions
   - Semantic title variations
   - Alternative keyword options
   - Topical authority score
   - **Extracted keywords** (if from RSS)

2. **SEO Integration Panel**
   - GSC performance data
   - Google Trends insights
   - SEO service connections status

3. **Visual Content Panel**
   - Generate feature image button
   - Brand color picker
   - Graphics generator
   - Image gallery

4. **Social Media Panel**
   - Repurpose to social posts
   - Schedule social distribution
   - Preview social posts
   - Buffer/scheduler status

5. **Source Information Panel** (NEW - if from RSS)
   - Original RSS feed name
   - Original RSS item link
   - Import date
   - Source attribution settings

---

## 🚀 API Integration Requirements

### External APIs Needed

1. **Google Search Console API**
   - OAuth 2.0 authentication
   - Search Analytics API
   - URL Inspection API

2. **Google Trends API**
   - Unofficial API (via pytrends or similar)
   - Or Google Trends Data API (if available)

3. **Buffer API**
   - OAuth 2.0 authentication
   - Posts API
   - Profiles API
   - Analytics API

4. **Image Generation APIs**
   - OpenAI DALL-E API
   - Stability AI API (Stable Diffusion)
   - Or custom image generation service

---

## 📊 Database Migration Summary

```sql
-- Run all migrations in order:
1. keyword_research.sql
2. seo_service_integrations.sql
3. social_scheduler_integrations.sql
4. repurposing_templates.sql
5. generated_images.sql
6. generated_graphics.sql
7. brand_color_palette.sql
```

---

## 🎯 Implementation Priority

### Phase 1: Keyword Research (Week 1-2)
1. Long-tail keyword generation
2. Semantic title generation
3. Alternative keyword suggestions
4. Basic topical authority tracking

### Phase 2: SEO Integrations (Week 3-4)
5. Google Search Console integration
6. Google Trends integration
7. SEO service manager

### Phase 3: Visual Content (Week 5-6)
8. Feature image generation
9. Brand color system
10. Basic graphics generation

### Phase 4: Social Automation (Week 7-8)
11. Buffer integration
12. Content repurposing
13. Social scheduling automation

### Phase 5: RSS Import & Generation (Week 9-10)
14. RSS feed import system
15. Keyword extraction from RSS
16. Automated article generation from RSS

---

## ✅ Success Metrics

**Keyword Research:**
- Average keywords per article (target: 15-20)
- Long-tail keyword coverage (target: >60%)
- Title optimization score (target: >85)

**SEO Integration:**
- GSC data sync frequency (target: daily)
- Keyword discovery rate from GSC
- Issue resolution time (target: <24 hours)

**Visual Content:**
- % articles with generated images (target: >80%)
- Brand color consistency (target: 100%)
- Graphics per article (target: 2-3)

**Social Automation:**
- % content repurposed to social (target: >90%)
- Social posts per article (target: 3-5 platforms)
- Scheduling automation rate (target: >95%)

**RSS Import & Generation:**
- RSS feeds actively importing (target: 10+ feeds)
- Items imported per day (target: 50+ items)
- Articles generated from RSS (target: >80% of eligible items)
- Keyword extraction accuracy (target: >85%)
- Generation quality score (target: >80/100)

---

## 📰 RSS Import & Generation Details

### Automated Workflow

```
RSS Feed Fetch (Scheduled) 
  → Parse RSS Items 
  → Filter by Rules 
  → Store Items 
  → Extract Keywords (if enabled)
  → Generate Article (if auto_generate = true)
  → Save as Draft/Publish
  → Generate Feature Image (optional)
  → Distribute to Social (optional)
```

### Keyword Extraction from RSS

**Extraction Methods:**
1. **AI-Powered** - Contextual understanding with LLM
2. **NLP-Based** - TF-IDF, RAKE, entity recognition
3. **Hybrid** - Combine both for best accuracy

**Output:**
- Primary keywords (5-10)
- Long-tail keywords (10-20)
- Named entities (people, places, organizations)
- Topics/categories
- Sentiment score

### Article Generation Rules

**Configurable per feed:**
- Content transformation (summarize, expand, rewrite)
- Keyword strategy (extract, use feed tags, generate)
- Category mapping (RSS category → Article category)
- Word count target
- Auto-publish or draft mode
- Source attribution settings

---

This comprehensive enhancement transforms the CMS into a fully automated, intelligent content creation and distribution system with advanced SEO, visual, and RSS import capabilities.

