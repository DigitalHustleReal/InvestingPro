
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('Checking articles table columns...');

  // Trick to get column names: select * limit 0 or 1
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  if (data && data.length > 0) {
    console.log('Columns found:', Object.keys(data[0]));
    
    const hasQualityScore = 'quality_score' in data[0];
    const hasMetadata = 'metadata' in data[0] || 'ai_metadata' in data[0];
    
    console.log('Has quality_score:', hasQualityScore);
    console.log('Has metadata/ai_metadata:', hasMetadata);
  } else {
    // If no data, we can't see columns easily with supabase-js select('*') unless we insert a dummy
    // But testing-cms-core inserted data, so there should be data.
    console.log('No articles found. Inserting dummy to check columns is risky without cleanup. Assuming standard schema.');
    console.log('Standard schema likely has: id, title, content, slug, status...');
  }
}

main().catch(console.error);
