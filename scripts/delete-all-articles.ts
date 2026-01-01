import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://txwxmbmbqltefwvilsii.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4d3htYm1icWx0ZWZ3dmlsc2lpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjMwNjEzMSwiZXhwIjoyMDgxODgyMTMxfQ.o4OncbjLpZg7eie2_WTnVhMMBB0tddiBmYFhl454t3U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function deleteAllArticles() {
  console.log('🗑️  Deleting all articles from database...')
  
  try {
    // First, get count
    const { count } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📊 Found ${count} articles`)
    
    // Delete all
    const { error } = await supabase
      .from('articles')
      .delete()
      .gte('created_at', '1970-01-01') // This matches all records
    
    if (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
    
    console.log('✅ All articles deleted successfully!')
    
    // Verify
    const { count: newCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📊 Remaining articles: ${newCount}`)
    
  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  }
}

deleteAllArticles()
