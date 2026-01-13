/**
 * Generate ONE article on SIP vs SWP
 * Run with: npx tsx scripts/generate-sip-swp-article.ts
 */

import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

// Get from .env.local manually or set before running
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-proj-T_GpkAOc0BZ2oyTyysrQ9K15SF7hrd8AuQvdYFkAYaIVhc2TQauQKSHxaalnmhoxKCo76qW-EBUxuMctaRVewXOJmQ'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txwxmbmbqltefwvilsii.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4d3htYm1icWx0ZWZ3dmlsc2lpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDY4MjEzMSwiZXhwIjoyMDUwMjU4MTMxfQ.o4OncbjLpZg7eie2_WTnVhMMBB0'

if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY missing')
  process.exit(1)
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Supabase keys missing')
  process.exit(1)
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

console.log('✅ Environment loaded successfully')
console.log('🚀 Generating SIP vs SWP article...\n')

const topic = {
  category: 'investing',
  title: 'SIP vs SWP: Complete Guide to Systematic Investment and Withdrawal Plans',
  keywords: 'SIP, SWP, systematic investment plan, systematic withdrawal plan, mutual funds, retirement planning',
  target_audience: 'Investors planning for wealth creation and retirement income'
}

async function generateArticle() {
  const prompt = `You are a financial content writer for InvestingPro, India's leading financial comparison platform.

Write a comprehensive, SEO-optimized article on: "${topic.title}"

REQUIREMENTS:
1. **Target Audience:** ${topic.target_audience}
2. **Keywords to include:** ${topic.keywords}
3. **Length:** 1000-1200 words
4. **Tone:** Professional yet approachable, helpful, non-promotional
5. **Format:** CLEAN HTML ONLY with PROFESSIONAL COMPONENTS

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

1. **KEY TAKEAWAYS BOX** (Place immediately after Introduction):
<div class="bg-gradient-to-br from-success-50 to-success-100 border-2 border-success-500 rounded-lg p-6 my-8">
  <h3 class="text-xl font-bold text-emerald-900 mb-4">Key Takeaways</h3>
  <ul class="space-y-3">
    <li class="flex items-start gap-3">
      <span class="flex-shrink-0 w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
      <span class="text-slate-800">SIP focuses on wealth accumulation while SWP enables systematic income withdrawal</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="flex-shrink-0 w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
      <span class="text-slate-800">Key point here</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="flex-shrink-0 w-6 h-6 bg-success-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
      <span class="text-slate-800">Key point here</span>
    </li>
  </ul>
</div>

2. **COMPARISON SLIDER** (MUST include for SIP vs SWP):
<div class="my-6 p-6 bg-gradient-to-r from-success-50 to-blue-50 rounded-lg border border-slate-200">
  <div class="flex justify-between mb-3">
    <span class="font-semibold text-slate-900">SIP (Accumulation)</span>
    <span class="font-semibold text-slate-900">SWP (Withdrawal)</span>
  </div>
  <div class="relative h-12 bg-white rounded-full overflow-hidden border-2 border-slate-300">
    <div class="absolute left-0 top-0 h-full bg-gradient-to-r from-success-500 to-success-600 flex items-center justify-end pr-4" style="width: 60%">
      <span class="text-white font-bold text-sm">60%</span>
    </div>
    <div class="absolute right-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-start pl-4" style="width: 40%">
      <span class="text-white font-bold text-sm">40%</span>
    </div>
  </div>
  <p class="text-xs text-slate-600 mt-2 text-center">Based on investor preference for wealth building vs income generation</p>
</div>

3. **TIMELINE** (Show SIP process):
<div class="my-6">
  <div class="flex gap-4 mb-6">
    <div class="flex flex-col items-center">
      <div class="w-10 h-10 rounded-full bg-success-600 text-white flex items-center justify-center font-bold text-lg">1</div>
      <div class="w-0.5 h-full bg-emerald-200 mt-2"></div>
    </div>
    <div class="flex-1 pb-6">
      <h4 class="font-bold text-slate-900 mb-1">Step title</h4>
      <p class="text-slate-600 text-sm">Description</p>
    </div>
  </div>
</div>

4. **PRO TIP CALLOUT**:
<div class="my-6 p-6 rounded-lg border-l-4 bg-accent-50 border-accent-500">
  <h4 class="font-bold text-lg mb-2 text-accent-900">💡 Pro Tip</h4>
  <p class="text-slate-700">Expert advice here</p>
</div>

STRUCTURE:
1. Introduction - Explain what SIP and SWP are
2. KEY TAKEAWAYS - 3-5 main differences
3. What is SIP? - Detailed explanation
4. What is SWP? - Detailed explanation
5. SIP vs SWP Comparison - COMPARISON SLIDER + table
6. How SIP Works - TIMELINE
7. How SWP Works - Process explanation
8. When to Use SIP - Use cases
9. When to Use SWP - Use cases
10. PRO TIP - Expert advice
11. Common Mistakes - What to avoid
12. Conclusion - Summary + CTA

INDIA-SPECIFIC:
- Use ₹ for rupees
- Mention Indian AMCs (HDFC, SBI, ICICI Prudential, Axis)
- Reference SEBI regulations
- Use Indian tax sections (80C for SIP, capital gains tax for withdrawals)

OUTPUT FORMAT:
Return ONLY the HTML body content.
Start with <h2>Introduction</h2> and end with closing tag.
MUST include: Key Takeaways, Comparison Slider, Timeline, Pro Tip.`

  try {
    console.log('📡 Calling OpenAI API...')
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert financial content writer specializing in India-focused content. You write in clean HTML format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    })
    
    const body_html = completion.choices[0].message.content?.trim() || ''
    
    console.log(`✅ Content generated: ${body_html.length} characters`)
    
    // Create slug
    const slug = topic.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    
    // Extract excerpt
    const excerptMatch = body_html.match(/<p>(.*?)<\/p>/)
    const excerpt = excerptMatch ? excerptMatch[1].substring(0, 160) + '...' : ''
    
    // Calculate stats
    const text = body_html.replace(/<[^>]*>/g, '')
    const word_count = text.split(/\s+/).length
    const reading_time = Math.ceil(word_count / 200)
    
    // Save to database
    console.log('💾 Saving to database...')
    
    const articleData = {
      title: topic.title,
      slug,
      excerpt,
      category: topic.category,
      body_html,
      meta_title: `${topic.title} | InvestingPro`,
      meta_description: `Complete guide to SIP and SWP in India. Understand the differences, benefits, and when to use each strategy for wealth creation and retirement income.`,
      status: 'draft',
      reading_time,
      word_count,
      structured_content: {
        h2_count: (body_html.match(/<h2>/g) || []).length,
        h3_count: (body_html.match(/<h3>/g) || []).length,
        word_count,
        reading_time
      }
    }
    
    const { data, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single()
    
    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }
    
    console.log('\n✅ SUCCESS!')
    console.log(`📝 Title: "${data.title}"`)
    console.log(`📊 Stats: ${word_count} words | ${reading_time} min read`)
    console.log(`🔗 URL: /articles/${slug}`)
    console.log(`\n🌐 View in browser: http://localhost:3000/articles/${slug}`)
    console.log(`🔧 Edit in admin: http://localhost:3000/admin/articles/${data.id}/edit`)
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

generateArticle()
  .then(() => {
    console.log('\n✅ Article generation complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })
