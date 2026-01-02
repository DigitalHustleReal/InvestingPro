
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkLatest() {
  const { data, error } = await supabase
    .from('articles')
    .select('title, quality_score, featured_image')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return;
  }
  
  console.log('--- LATEST ARTICLE ANALYSIS ---');
  console.log(`TITLE: ${data.title}`);
  console.log(`SCORE: ${data.quality_score}/100`);
  console.log(`IMAGE: ${data.featured_image}`);
}

checkLatest();
