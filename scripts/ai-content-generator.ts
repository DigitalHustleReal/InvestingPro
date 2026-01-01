/**
 * AI Content Automation System
 * 
 * Generates bulk articles using OpenAI with proper HTML formatting
 * Automatically creates SEO-optimized content without manual intervention
 * 
 * Usage:
 *   npm run generate-content
 *   OR
 *   npx tsx scripts/ai-content-generator.ts
 */

import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

// Configuration - Hardcoded to avoid env issues
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-proj-Vu1Tz6Wy9kAZhZZfuNGCDGMlrKOJhBKkHUFqmPfZGWJXNlpTdmZnCJVPmNT3BlbkFJCqAqPqPqPqPqPqPqPqPqPqPqPqPqPqPqPqPqPqPqPqPqPqPqPqPqPq'
const SUPABASE_URL = 'https://txwxmbmbqltefwvilsii.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4d3htYm1icWx0ZWZ3dmlsc2lpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjMwNjEzMSwiZXhwIjoyMDgxODgyMTMxfQ.o4OncbjLpZg7eie2_WTnVhMMBB0tddiBmYFhl454t3U'

if (!OPENAI_API_KEY || OPENAI_API_KEY.includes('PqPqPq')) {
  console.error('❌ Error: Valid OPENAI_API_KEY required')
  console.error('Please set OPENAI_API_KEY environment variable')
  process.exit(1)
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Article topics to generate
const ARTICLE_TOPICS = [
  {
    category: 'investing',
    title: 'SIP vs SWP: Complete Guide to Systematic Investment and Withdrawal Plans',
    keywords: 'SIP, SWP, systematic investment plan, systematic withdrawal plan, mutual funds, retirement planning',
    target_audience: 'Investors planning for wealth creation and retirement income'
  },
  {
    category: 'credit_cards',
    title: 'Best Credit Cards in India 2025',
    keywords: 'credit cards, rewards, cashback, travel cards',
    target_audience: 'Indian consumers looking for credit cards'
  },
  {
    category: 'mutual_funds',
    title: 'Top 10 SIP Mutual Funds for Long-Term Wealth Creation',
    keywords: 'SIP, mutual funds, investment, wealth creation',
    target_audience: 'New investors starting SIP investments'
  },
  {
    category: 'personal_loans',
    title: 'How to Get Personal Loan Approval in 24 Hours',
    keywords: 'personal loan, instant loan, loan approval, quick loan',
    target_audience: 'People needing quick personal loans'
  },
  {
    category: 'insurance',
    title: 'Term Insurance vs. Whole Life Insurance: Which is Better?',
    keywords: 'term insurance, life insurance, insurance comparison',
    target_audience: 'Families looking for life insurance'
  },
  {
    category: 'investing',
    title: 'SIP vs Lumpsum Investment: Which Strategy Works Better?',
    keywords: 'SIP, lumpsum, investment strategy, mutual funds',
    target_audience: 'Investors deciding between SIP and lumpsum'
  },
  {
    category: 'tax',
    title: 'Complete Guide to Section 80C Tax Deductions in India',
    keywords: 'tax saving, 80C, deductions, income tax',
    target_audience: 'Taxpayers looking to save on income tax'
  },
  {
    category: 'credit_score',
    title: 'How to Check and Improve Your CIBIL Score for Free',
    keywords: 'CIBIL score, credit score, free credit report',
    target_audience: 'People wanting to check/improve their credit score'
  },
  {
    category: 'fixed_deposits',
    title: 'Best FD Rates in India 2025: Banks vs. NBFCs Comparison',
    keywords: 'FD rates, fixed deposit, interest rates, savings',
    target_audience: 'Conservative investors looking for safe returns'
  },
  {
    category: 'home_loans',
    title: 'Home Loan EMI Calculator: How Much Can You Afford?',
    keywords: 'home loan, EMI calculation, housing loan, mortgage',
    target_audience: 'First-time home buyers'
  },
  {
    category: 'gold_investment',
    title: 'Digital Gold vs. Physical Gold: Which is Better in 2025?',
    keywords: 'gold investment, digital gold, physical gold',
    target_audience: 'Investors interested in gold'
  }
]

/**
 * Generate article content using OpenAI
 */
async function generateArticleContent(topic: typeof ARTICLE_TOPICS[0]) {
  console.log(`\n📝 Generating: "${topic.title}"...`)
  
  const prompt = `You are a financial content writer for InvestingPro, India's leading financial comparison platform.

Write a comprehensive, SEO-optimized article on: "${topic.title}"

REQUIREMENTS:
1. **Target Audience:** ${topic.target_audience}
2. **Keywords to include:** ${topic.keywords}
3. **Length:** 1000-1200 words
4. **Tone:** Professional yet approachable, helpful, non-promotional
5. **Format:** CLEAN HTML ONLY with PROFESSIONAL COMPONENTS (see below)

FORMATTING RULES (CRITICAL):
- Use ONLY these HTML tags: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>, <hr>, <div>
- NO <h1> tags (title is separate)
- NO Markdown symbols (#, ##, **, etc.)
- Start with <h2>Introduction</h2>
- Include 6-8 <h2> sections
- Use <h3> for sub-sections
- Include at least 3-4 <ul> lists
- Add 1-2 <blockquote> with expert tips
- End with <h2>Conclusion</h2>

PROFESSIONAL COMPONENTS (MUST INCLUDE):

1. **KEY TAKEAWAYS BOX** (Place RIGHT AFTER Introduction):
<div class="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-500 rounded-lg p-6 my-8">
  <h3 class="text-xl font-bold text-emerald-900 mb-4">Key Takeaways</h3>
  <ul class="space-y-3">
    <li class="flex items-start gap-3">
      <span class="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
      <span class="text-gray-800">First key point here</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
      <span class="text-gray-800">Second key point here</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
      <span class="text-gray-800">Third key point here</span>
    </li>
  </ul>
</div>

2. **PRO TIP CALLOUT** (Use 1-2 times in article):
<div class="my-6 p-6 rounded-lg border-l-4 bg-amber-50 border-amber-500">
  <h4 class="font-bold text-lg mb-2 text-amber-900">💡 Pro Tip</h4>
  <p class="text-gray-700">Your expert tip here...</p>
</div>

3. **WARNING BOX** (If applicable):
<div class="my-6 p-6 rounded-lg border-l-4 bg-red-50 border-red-500">
  <h4 class="font-bold text-lg mb-2 text-red-900">⚠️ Important Warning</h4>
  <p class="text-gray-700">Critical information users should know...</p>
</div>

4. **VISUAL GRAPHICS** (Use 2-3 per article based on context):

A. **PROGRESS BARS** - Use when showing allocation percentages:
<div class="my-6 p-6 bg-gray-50 rounded-lg">
  <div class="mb-4">
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium text-gray-700">Category Name</span>
      <span class="text-sm font-bold text-gray-900">XX%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div class="h-3 rounded-full bg-emerald-600" style="width: XX%"></div>
    </div>
  </div>
</div>

B. **BAR CHART** - Use when comparing returns, fees, or metrics:
<div class="my-6 p-6 bg-white border border-gray-200 rounded-lg">
  <div class="flex items-end justify-around gap-4 h-64">
    <div class="flex flex-col items-center flex-1">
      <div class="mb-2 text-sm font-semibold text-gray-900">12.5%</div>
      <div class="w-full bg-gray-100 rounded-t-lg relative" style="height: 62.5%">
        <div class="absolute bottom-0 w-full rounded-t-lg bg-emerald-600" style="height: 100%"></div>
      </div>
      <div class="mt-2 text-xs text-center text-gray-600">Option 1</div>
    </div>
    <div class="flex flex-col items-center flex-1">
      <div class="mb-2 text-sm font-semibold text-gray-900">8.5%</div>
      <div class="w-full bg-gray-100 rounded-t-lg relative" style="height: 42.5%">
        <div class="absolute bottom-0 w-full rounded-t-lg bg-blue-600" style="height: 100%"></div>
      </div>
      <div class="mt-2 text-xs text-center text-gray-600">Option 2</div>
    </div>
  </div>
</div>

C. **PIE CHART** - Use for portfolio/asset allocation:
<div class="flex flex-col md:flex-row items-center gap-6 my-6">
  <div class="relative w-48 h-48 rounded-full overflow-hidden" style="background: conic-gradient(#10b981 0deg 252deg, #3b82f6 252deg 342deg, #f59e0b 342deg 360deg)">
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center">
        <span class="text-2xl font-bold text-gray-900">100%</span>
      </div>
    </div>
  </div>
  <div class="space-y-2">
    <div class="flex items-center gap-3">
      <div class="w-4 h-4 rounded bg-emerald-600"></div>
      <span class="text-sm text-gray-700">Category 1</span>
      <span class="text-sm font-semibold text-gray-900">70%</span>
    </div>
  </div>
</div>

D. **TIMELINE** - Use for step-by-step processes:
<div class="my-6">
  <div class="flex gap-4 mb-6">
    <div class="flex flex-col items-center">
      <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">1</div>
      <div class="w-0.5 h-full bg-emerald-200 mt-2"></div>
    </div>
    <div class="flex-1 pb-6">
      <h4 class="font-bold text-gray-900 mb-1">Step Title</h4>
      <p class="text-gray-600 text-sm">Step description</p>
    </div>
  </div>
</div>

E. **COMPARISON SLIDER** - Use for vs. comparisons (SIP vs Lumpsum, etc.):
<div class="my-6 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-gray-200">
  <div class="flex justify-between mb-3">
    <span class="font-semibold text-gray-900">Option A</span>
    <span class="font-semibold text-gray-900">Option B</span>
  </div>
  <div class="relative h-12 bg-white rounded-full overflow-hidden border-2 border-gray-300">
    <div class="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-end pr-4" style="width: 65%">
      <span class="text-white font-bold text-sm">65%</span>
    </div>
    <div class="absolute right-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-start pl-4" style="width: 35%">
      <span class="text-white font-bold text-sm">35%</span>
    </div>
  </div>
</div>

F. **METRIC CARDS** - Use for displaying key numbers:
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
  <div class="bg-white border-2 border-emerald-200 rounded-lg p-6 text-center shadow-sm">
    <div class="text-4xl mb-2">📈</div>
    <p class="text-sm text-gray-600 mb-2">Metric Name</p>
    <p class="text-3xl font-bold text-emerald-600 mb-2">14.2%</p>
    <p class="text-xs font-medium text-green-600">+2.3% trend</p>
  </div>
</div>

**WHEN TO USE WHICH GRAPHIC:**
- Returns/Performance comparison → BAR CHART
- Portfolio/Asset allocation → PIE CHART or PROGRESS BARS
- Process/How-to steps → TIMELINE
- A vs B comparison → COMPARISON SLIDER
- Key metrics/stats → METRIC CARDS
- Feature availability → Feature grid (with checkmarks)

STRUCTURE WITH COMPONENTS:
1. <h2>Introduction</h2> - Introduce the problem
2. **KEY TAKEAWAYS BOX** - 3-5 main points
3. <h2>Main Section 1</h2> - Educational content
4. **PRO TIP CALLOUT** - Expert advice
5. <h2>Main Section 2</h2> - More content
6. <h2>Comparison/Analysis</h2> - Data and insights
7. **WARNING BOX** (if needed) - Important caveats
8. <h2>Common Mistakes</h2> - What to avoid
9. <h2>Expert Tips</h2> - Best practices
10. <h2>Conclusion</h2> - Summary + CTA

INDIA-SPECIFIC:
- Use ₹ for rupees
- Mention Indian banks (HDFC, SBI, ICICI, Axis)
- Mention AMCs (Axis, HDFC, SBI, ICICI Prudential)
- Reference regulations (SEBI, RBI, IRDAI)
- Use Indian examples and scenarios
- Mention Indian tax sections (80C, 80D, etc.)

OUTPUT FORMAT:
Return ONLY the HTML body content (no wrapping tags, no extra text).
Start directly with <h2>Introduction</h2> and end with closing </p> tag.
MUST include:
- Key Takeaways box (after introduction)
- At least 1 Pro Tip callout
- 2-3 VISUAL GRAPHICS chosen intelligently based on content:
  * If discussing returns/performance → Include BAR CHART
  * If discussing allocation → Include PIE CHART or PROGRESS BARS
  * If explaining process → Include TIMELINE
  * If comparing options → Include COMPARISON SLIDER
  * If showing key stats → Include METRIC CARDS`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Faster and cheaper
      messages: [
        {
          role: 'system',
          content: 'You are an expert financial content writer specializing in India-focused content. You write in clean HTML format only, never using Markdown.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    })
    
    const body_html = completion.choices[0].message.content?.trim() || ''
    
    if (!body_html || body_html.length < 500) {
      throw new Error('Generated content too short or empty')
    }
    
    // Validate HTML structure
    if (!body_html.includes('<h2>') || !body_html.includes('</p>')) {
      throw new Error('Invalid HTML structure in generated content')
    }
    
    console.log(`✅ Generated ${body_html.length} characters`)
    return body_html
  } catch (error: any) {
    console.error(`❌ OpenAI Error: ${error.message}`)
    return null
  }
}

/**
 * Generate meta description using OpenAI
 */
async function generateMetaDescription(title: string, bodyHtml: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Write a compelling meta description (150-160 characters) for this article:
          
Title: ${title}

Requirements:
- Include primary keyword
- Make it click-worthy
- 150-160 characters
- No quotes or special formatting`
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    })
    
    return completion.choices[0].message.content?.trim() || ''
  } catch (error) {
    // Fallback to auto-generated
    return `Comprehensive guide to ${title.toLowerCase()}. Learn expert tips, comparisons, and make informed financial decisions.`
  }
}

/**
 * Create slug from title
 */
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Calculate reading time
 */
function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).length
  return Math.ceil(words / 200) // 200 words per minute
}

/**
 * Save article to database
 */
async function saveArticle(articleData: any) {
  const { data, error } = await supabase
    .from('articles')
    .insert([articleData])
    .select()
    .single()
  
  if (error) {
    throw new Error(`Database error: ${error.message}`)
  }
  
  return data
}

/**
 * Main generation function
 */
async function generateArticles(count: number = 10) {
  console.log(`\n🚀 AI Content Automation Started`)
  console.log(`📊 Generating ${count} articles...\n`)
  
  const topics = ARTICLE_TOPICS.slice(0, count)
  let successCount = 0
  let failCount = 0
  
  for (const topic of topics) {
    try {
      // Step 1: Generate content
      const body_html = await generateArticleContent(topic)
      if (!body_html) {
        failCount++
        continue
      }
      
      // Step 2: Generate meta description
      const meta_description = await generateMetaDescription(topic.title, body_html)
      
      // Step 3: Create slug
      const slug = createSlug(topic.title)
      
      // Step 4: Extract excerpt (first paragraph)
      const excerptMatch = body_html.match(/<p>(.*?)<\/p>/)
      const excerpt = excerptMatch ? excerptMatch[1].substring(0, 160) + '...' : ''
      
      // Step 5: Calculate stats
      const reading_time = calculateReadingTime(body_html)
      const word_count = body_html.replace(/<[^>]*>/g, '').split(/\s+/).length
      
      // Step 6: Prepare article data
      const articleData = {
        title: topic.title,
        slug,
        excerpt,
        category: topic.category,
        body_html,
        meta_title: `${topic.title} | InvestingPro`,
        meta_description,
        status: 'published', // Auto-publish
        reading_time,
        word_count,
        structured_content: {
          h2_count: (body_html.match(/<h2>/g) || []).length,
          h3_count: (body_html.match(/<h3>/g) || []).length,
          word_count,
          reading_time,
          has_lists: body_html.includes('<ul>'),
          has_blockquote: body_html.includes('<blockquote>')
        }
      }
      
      // Step 7: Save to database
      const savedArticle = await saveArticle(articleData)
      
      console.log(`✅ Created: "${savedArticle.title}"`)
      console.log(`   📝 ${word_count} words | ⏱️  ${reading_time} min read`)
      console.log(`   🔗 /blog/${slug}`)
      
      successCount++
      
      // Rate limiting: Wait 2 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error: any) {
      console.error(`❌ Failed: "${topic.title}" - ${error.message}`)
      failCount++
    }
  }
  
  console.log(`\n📊 Generation Complete!`)
  console.log(`✅ Success: ${successCount} articles`)
  console.log(`❌ Failed: ${failCount} articles`)
  console.log(`\n🌐 View articles at: http://localhost:3000/admin/articles`)
}

// CLI Interface
const args = process.argv.slice(2)
const count = parseInt(args[0]) || 10

generateArticles(count)
  .then(() => {
    console.log('\n✅ Automation complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })
