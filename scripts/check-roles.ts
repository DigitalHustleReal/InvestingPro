
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkRoles() {
  console.log('🔍 Checking distinct roles in authors table...');
  const { data, error } = await supabase
    .from('authors')
    .select('role');
  
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  const distinctRoles = [...new Set(data.map(d => d.role))];
  console.log('✅ Existing Roles:', distinctRoles);
  
  // Try to insert a dummy to test 'author' specifically if not present
  if (!distinctRoles.includes('author')) {
      console.log("⚠️ 'author' role not found in existing data. Testing insertion...");
      const { error: insertError } = await supabase.from('authors').insert({
          name: 'Test Role Check',
          slug: 'test-role-check',
          role: 'author', // Testing this
          bio: 'Test',
          is_active: false
      });
      if (insertError) {
          console.error("❌ Insertion with 'author' failed:", insertError.message);
      } else {
          console.log("✅ Insertion with 'author' SUCCEEDED (will clean up).");
          await supabase.from('authors').delete().eq('slug', 'test-role-check');
      }
  }
}

checkRoles();
