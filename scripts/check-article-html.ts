import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://txwxmbmbqltefwvilsii.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4d3htYm1icWx0ZWZ3dmlsc2lpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjMwNjEzMSwiZXhwIjoyMDgxODgyMTMxfQ.o4OncbjLpZg7eie2_WTnVhMMBB0tddiBmYFhl454t3U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkArticle() {
  const { data, error } = await supabase
    .from('articles')
    .select('body_html')
    .limit(1)
    .single()
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log('First 1000 characters of body_html:')
  console.log(data.body_html.substring(0, 1000))
  console.log('\n---\n')
  console.log('Has key-takeaways class:', data.body_html.includes('key-takeaways'))
  console.log('Has pro-tip class:', data.body_html.includes('pro-tip'))
  console.log('Has warning-box class:', data.body_html.includes('warning-box'))
}

checkArticle()
