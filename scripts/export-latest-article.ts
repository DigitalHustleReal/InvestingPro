
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function exportLatest() {
  const { data, error } = await supabase
    .from('articles')
    .select('title, content, featured_image, quality_score, category')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  const preview = `
=================================================================
TITLE: ${data.title}
CATEGORY: ${data.category}
IMAGE: ${data.featured_image}
QUALITY SCORE: ${data.quality_score}/100
=================================================================

${data.content}
  `;

  fs.writeFileSync('latest_article_preview.html', preview);
  console.log('Saved to latest_article_preview.html');
}

exportLatest();
