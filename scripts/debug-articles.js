const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkArticles() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log("Checking articles with Service Role...");
  const { data: articles, count, error } = await supabase
    .from('articles')
    .select('*', { count: 'exact' });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log(`Total articles found: ${count}`);
  if (articles && articles.length > 0) {
    console.log("Sample article structure:");
    console.log(JSON.stringify(articles[0], null, 2));
    
    const statuses = articles.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});
    console.log("Status counts:", statuses);
  }

  console.log("\nChecking articles with Anon Role...");
  const anonSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const { data: anonArticles, count: anonCount, error: anonError } = await anonSupabase
    .from('articles')
    .select('*', { count: 'exact' });

  if (anonError) {
    console.error("Anon Error:", anonError);
  } else {
    console.log(`Anon articles found: ${anonCount}`);
  }

  console.log("\nChecking user_roles...");
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('*');
  
  if (rolesError) {
    console.error("Roles Error:", rolesError);
  } else {
    console.log(`Total roles found: ${roles?.length || 0}`);
    console.log(JSON.stringify(roles, null, 2));
  }

  console.log("\nChecking Auth Users...");
  const { data: { users }, error: authError } = await anonSupabase.auth.admin.listUsers();
  // Wait, anonSupabase can't list users. Need service role.
  
  const { data: { users: authUsers }, error: authServiceError } = await supabase.auth.admin.listUsers();

  if (authServiceError) {
    console.error("Auth Error:", authServiceError);
  } else {
    console.log(`Total auth users: ${authUsers?.length || 0}`);
    authUsers.forEach(u => console.log(`${u.id} - ${u.email}`));
  }
}

checkArticles();
