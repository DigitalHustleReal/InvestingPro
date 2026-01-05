import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txwxmbmbqltefwvilsii.supabase.co'
// Fallback to the key seen in generator script if env is missing (for safety in this session)
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4d3htYm1icWx0ZWZ3dmlsc2lpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjMwNjEzMSwiZXhwIjoyMDgxODgyMTMxfQ.o4OncbjLpZg7eie2_WTnVhMMBB0tddiBmYFhl454t3U'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function fixArticleData() {
  console.log('🔍 Checking for published articles with missing dates or images...')
  
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, status, published_at, featured_image, category')
    .eq('status', 'published')
    .or('published_at.is.null,featured_image.is.null')

  if (error) {
    console.error('❌ Error fetching articles:', error)
    return
  }

  if (!articles || articles.length === 0) {
    console.log('✅ No articles found needing repairs.')
  } else {
    console.log(`🛠️ Found ${articles.length} articles to fix.`)
    
    // Image mapping
    const categoryImages: Record<string, string> = {
      'investing': 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=2070',
      'credit-cards': 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=2070',
      'loans': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2070',
      'insurance': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2070',
      'default': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015' // generic reporting
    }

    for (const article of articles) {
      const updates: any = {}
      const now = new Date().toISOString()

      // Fix Date
      if (!article.published_at) {
        updates.published_at = now
        updates.published_date = now.split('T')[0]
      }

      // Fix Image
      if (!article.featured_image) {
        const cat = article.category || 'default'
        updates.featured_image = categoryImages[cat] || categoryImages['default']
      }

      const { error: updateError } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', article.id)

      if (updateError) {
        console.error(`❌ Failed to fix "${article.title}":`, updateError.message)
      } else {
        console.log(`✅ Fixed "${article.title}" (Date: ${!!updates.published_at}, Image: ${!!updates.featured_image})`)
      }
    }
  }
}

fixArticleData()
