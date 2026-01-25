/**
 * Sync Author Personas to Supabase
 * 
 * Upserts all 16 authors from author-personas.ts to the authors table
 * Run: npx ts-node scripts/sync-author-personas.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Import personas
import { AUTHORS, EDITORS, ALL_PERSONAS } from '../lib/content/author-personas';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Interface matching ACTUAL DB schema
interface AuthorRecord {
  slug: string;
  name: string;
  // title: string; // Missing in DB
  bio: string;
  credentials: string[];
  photo_url: string;
  role: string;
  assigned_categories: string[];
  categories: string[]; // Populate both for safety
  is_ai_persona: boolean;
  ai_system_prompt: string;
  years_experience: number;
  location: string;
  is_active: boolean; // Renamed from active
}

async function syncAuthors() {
  console.log('🔄 Syncing author personas to database...\n');

  const records: AuthorRecord[] = [];

  // Convert personas to database records
  for (const persona of Object.values(ALL_PERSONAS)) {
    records.push({
      slug: persona.slug,
      name: persona.name,
      // title: persona.title, // Column missing in DB
      bio: persona.bio || persona.shortBio,
      credentials: persona.credentials,
      photo_url: persona.photoUrl,
      role: persona.role,
      assigned_categories: persona.categories,
      categories: persona.categories,
      is_ai_persona: true,
      ai_system_prompt: persona.systemPrompt,
      years_experience: persona.yearsExperience,
      location: persona.location,
      is_active: true,
    });
  }

  console.log(`📝 Preparing to sync ${records.length} authors...`);

  // Upsert each author
  let successCount = 0;
  let errorCount = 0;

  for (const record of records) {
    try {
      const { error } = await supabase
        .from('authors')
        .upsert(record, { onConflict: 'slug' });

      if (error) {
        console.error(`❌ Error syncing ${record.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Synced: ${record.name} (${record.role})`);
        successCount++;
      }
    } catch (err: any) {
      console.error(`❌ Exception syncing ${record.name}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n📊 SYNC SUMMARY:');
  console.log(`✅ Success: ${successCount}/${records.length}`);
  console.log(`❌ Errors: ${errorCount}/${records.length}`);

  return { successCount, errorCount };
}

// Run if called directly
if (require.main === module) {
  syncAuthors()
    .then(() => {
      console.log('\n✨ Sync complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { syncAuthors };
