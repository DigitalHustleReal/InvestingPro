# 🤖 AI Content Automation System

Automated content generation system for InvestingPro using OpenAI GPT-4o-mini.

---

## 📋 Overview

This system automatically generates SEO-optimized, properly formatted articles for InvestingPro with:
- ✅ Clean HTML structure (h2, h3, p, ul, li, strong, em, blockquote)
- ✅ India-specific financial content (SEBI, RBI, IRDAI compliance)
- ✅ Auto-generated slugs, meta descriptions, and SEO fields
- ✅ Reading time and word count calculation
- ✅ Automatic database insertion
- ✅ Zero manual intervention required

---

## 🚀 Quick Start

### Prerequisites

1. **OpenAI API Key** - Required for content generation
2. **Supabase Service Role Key** - Required for database writes

### Setup

1. Add keys to `.env.local`:
```bash
OPENAI_API_KEY=sk-your-openai-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

2. Install dependencies (if not already):
```bash
npm install openai
```

---

## 📝 Usage

### Option 1: Generate Sample Article (Manual Test)

For testing formatting before bulk generation:

```bash
npm run generate:sample
```

This outputs a JSON object you can manually paste into the admin interface to test formatting.

---

### Option 2: Bulk Generation (Automated)

Generate 10 articles automatically:

```bash
npm run generate:content
```

Generate custom number of articles:

```bash
npx tsx scripts/ai-content-generator.ts 20
```

---

## 📊 What Gets Generated

Each article includes:

### Content Fields
- **title** - SEO-optimized article title
- **slug** - Auto-generated from title
- **excerpt** - First paragraph (160 chars)
- **category** - Article category (credit_cards, mutual_funds, etc.)
- **body_html** - Clean HTML content with proper structure
- **status** - Set to'draft' for review before publishing

### SEO Fields
- **meta_title** - Page title for search engines
- **meta_description** - Auto-generated compelling description (150-160 chars)

### Stats
- **word_count** - Automatic word counting
- **reading_time** - Calculated at 200 words/minute
- **structured_content** - JSON with h2/h3 counts, list presence, etc.

---

## 🎨 Content Format

### HTML Structure

All content follows this strict format:

```html
<h2>Introduction</h2>
<p>Introduction paragraph...</p>

<h2>Main Section Title</h2>
<p>Content paragraph...</p>

<h3>Subsection Title</h3>
<p>More content...</p>

<ul>
<li>List item 1</li>
<li>List item 2</li>
</ul>

<blockquote>
Expert tip or important note
</blockquote>

<h2>Conclusion</h2>
<p>Conclusion paragraph with CTA...</p>
```

### Allowed HTML Tags
- `<h2>`, `<h3>` - Headings (no h1!)
- `<p>` - Paragraphs
- `<ul>`, `<ol>`, `<li>` - Lists
- `<strong>`, `<em>` - Text formatting
- `<blockquote>` - Quotes/tips
- `<hr>` - Horizontal rules

### ❌ NOT Allowed
- Markdown symbols (#, ##, **, etc.)
- `<h1>` tags
- `<div>`, `<span>` tags
- Inline styles
- JavaScript

---

## 📚 Pre-Configured Topics

The system includes 10 pre-configured article topics:

1. **Credit Cards** - Best Credit Cards in India 2025
2. **Mutual Funds** - Top 10 SIP Mutual Funds
3. **Personal Loans** - Get Loan Approval in 24 Hours
4. **Insurance** - Term vs. Whole Life Insurance
5. **Investing** - SIP vs Lumpsum Strategy
6. **Tax** - Section 80C Tax Deductions Guide
7. **Credit Score** - How to Check CIBIL Score
8. **Fixed Deposits** - Best FD Rates Comparison
9. **Home Loans** - Home Loan EMI Calculator Guide
10. **Gold** - Digital vs. Physical Gold Investment

To add more topics, edit `scripts/ai-content-generator.ts` and add to the `ARTICLE_TOPICS` array.

---

## 🔧 Customization

### Adding New Topics

Edit `scripts/ai-content-generator.ts`:

```typescript
const ARTICLE_TOPICS = [
  // Existing topics...
  {
    category: 'your_category',
    title: 'Your Article Title',
    keywords: 'keyword1, keyword2, keyword3',
    target_audience: 'Description of target readers'
  }
]
```

### Changing AI Model

In `ai-content-generator.ts`, change:

```typescript
model: 'gpt-4o-mini', // Fast & cheap ($0.15/1M tokens)
// OR
model: 'gpt-4o',      // Higher quality ($2.50/1M tokens)
```

### Adjusting Content Length

Modify the prompt in `generateArticleContent()`:

```typescript
// Change this line:
3. **Length:** 800-1000 words
// To:
3. **Length:** 1200-1500 words
```

---

## 💰 Cost Estimate

Using **GPT-4o-mini** (recommended):
- **Cost per article:** ~$0.02 - $0.05
- **10 articles:** ~$0.30
- **100 articles:** ~$3.00

Using **GPT-4o** (higher quality):
- **Cost per article:** ~$0.30 - $0.50
- **10 articles:** ~$4.00
- **100 articles:** ~$40.00

---

## ⚡ Rate Limiting

The script includes automatic rate limiting:
- **2 second delay** between each article generation
- Prevents OpenAI API rate limit errors
- Can be adjusted in `generateArticles()` function

To speed up (reduce delay):
```typescript
await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second
```

To slow down (increase delay):
```typescript
await new Promise(resolve => setTimeout(resolve, 5000)) // 5 seconds
```

---

## 🧪 Testing Workflow

### Step 1: Generate Sample
```bash
npm run generate:sample
```

### Step 2: Manual Test
1. Copy the JSON output
2. Go to http://localhost:3000/admin/articles
3. Click "Create New Article"
4. Paste the `body_html` content
5. Verify formatting looks good in editor

### Step 3: Bulk Generation
Once formatting is confirmed:
```bash
npm run generate:content
```

### Step 4: Review & Publish
1. Go to http://localhost:3000/admin/articles
2. Articles are created as **drafts**
3. Review each article
4. Edit if needed
5. Change status to **published**

---

## 🐛 Troubleshooting

### "OPENAI_API_KEY not found"
**Solution:** Add your OpenAI API key to `.env.local`

### "Database error: permission denied"
**Solution:** Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (not the anon key)

### "Generated content too short"
**Solution:** OpenAI might have hit token limit. Increase `max_tokens` in the script.

### Articles look unformatted in editor
**Solution:** Check that HTML uses only allowed tags (no Markdown, no divs/spans)

### Rate limit errors from OpenAI
**Solution:** Increase delay between requests (currently 2 seconds)

---

## 📈 Performance

**Generation Speed:**
- 1 article: ~10-15 seconds
- 10 articles: ~2-3 minutes (with rate limiting)
- 100 articles: ~25-30 minutes

**Quality:**
- GPT-4o-mini: Good quality, fast, cheap
- GPT-4o: Excellent quality, slower, more expensive

**Recommendation:** Use GPT-4o-mini for bulk generation, GPT-4o for high-value cornerstone content.

---

## 🔐 Security Notes

1. **Never commit API keys** - Use `.env.local` only
2. **Service Role Key** - Keep secret, grants admin access
3. **Generated content** - Always review before publishing (AI can make mistakes)
4. **Fact-checking** - Verify financial figures, regulations, and claims

---

## 📋 Checklist Before Bulk Generation

- [ ] OpenAI API key configured
- [ ] Supabase service role key configured
- [ ] Sample article tested and formatting confirmed
- [ ] Editor displays content correctly
- [ ] Topics list reviewed and customized if needed
- [ ] Rate limiting appropriate for API plan
- [ ] Ready to review generated drafts

---

## 🚀 Next Steps

1. **Test Sample:** `npm run generate:sample`
2. **Verify Formatting:** Paste into admin and check display
3. **Generate Bulk:** `npm run generate:content`
4. **Review Drafts:** Go to admin articles page
5. **Publish:** Change status from draft to published

---

## 🎯 Future Enhancements

Planned features:
- [ ] Image generation integration (DALL-E)
- [ ] Automatic internal linking
- [ ] Content calendar scheduling
- [ ] Multi-language support
- [ ] Product integration (auto-link to credit cards/funds)
- [ ] Performance tracking (views, engagement)

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review the script logs for error messages
3. Ensure all environment variables are set correctly
4. Test with sample generation first before bulk

---

**Happy Content Generating! 🎉**
