const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function restoreArticles() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log("Starting Article Restoration...");

  // 1. Double check count of deleted articles
  const { count: deletedCount, error: countError } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .not('deleted_at', 'is', null);

  if (countError) {
    console.error("Error checking deleted articles:", countError);
    return;
  }

  console.log(`Found ${deletedCount} articles to restore.`);

  if (deletedCount === 0) {
    console.log("No articles found with deleted_at set. Nothing to do.");
    return;
  }

  // 2. Perform restoration
  const { data, error: updateError } = await supabase
    .from('articles')
    .update({ deleted_at: null })
    .not('deleted_at', 'is', null)
    .select('id, title');

  if (updateError) {
    console.error("Error restoring articles:", updateError);
    return;
  }

  console.log(`Successfully restored ${data?.length || 0} articles.`);
  
  // 3. Optional: Verify with a follow-up count
  const { count: remainingCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .not('deleted_at', 'is', null);

  console.log(`Remaining deleted articles: ${remainingCount}`);
  
  if (data && data.length > 0) {
    console.log("Restoration Complete!");
  }
}

restoreArticles();
