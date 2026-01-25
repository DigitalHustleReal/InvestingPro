
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ROLES_TO_TEST = [
  'author', 'Author', 'AUTHOR',
  'account_admin', 'admin',
  'contributor', 'Contributor',
  'writer', 'Writer',
  'creator', 'Creator',
  'staff', 'Staff',
  'editor', 'Editor' // Control
];

async function bruteForceRoles() {
  console.log('🔨 Brute-forcing roles...');
  
  for (const role of ROLES_TO_TEST) {
    process.stdout.write(`Testing '${role}'... `);
    const { error } = await supabase.from('authors').insert({
      name: `Test Role ${role}`,
      slug: `test-role-${role.toLowerCase()}`,
      role: role,
      bio: 'Test',
      is_active: false
    });

    if (!error) {
      console.log('✅ SUCCEEDED');
      // Cleanup
      await supabase.from('authors').delete().eq('slug', `test-role-${role.toLowerCase()}`);
    } else {
      console.log('❌ FAILED');
    }
  }
}

bruteForceRoles();
