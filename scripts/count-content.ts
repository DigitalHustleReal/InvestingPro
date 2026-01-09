import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ContentCounts {
  articles: number;
  glossary: number;
  products: number;
  legalPages: number;
}

interface MVLTargets {
  articles: number;
  glossary: number;
  products: number;
  legalPages: number;
}

const MVL_TARGETS: MVLTargets = {
  articles: 60,
  glossary: 100,
  products: 300,
  legalPages: 5
};

async function countContent(): Promise<ContentCounts> {
  console.log('📊 Counting platform content...\n');

  // Count published articles
  const { count: articlesCount, error: articlesError } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  if (articlesError) {
    console.error('Error counting articles:', articlesError);
  }

  // Count glossary terms
  const { count: glossaryCount, error: glossaryError } = await supabase
    .from('glossary')
    .select('*', { count: 'exact', head: true });

  if (glossaryError) {
    console.error('Error counting glossary:', glossaryError);
  }

  // Count products
  const { count: productsCount, error: productsError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (productsError) {
    console.error('Error counting products:', productsError);
  }

  // Count legal pages (static pages)
  const legalPages = ['about', 'privacy', 'terms', 'disclaimer', 'contact'];
  let legalPagesCount = 0;

  for (const page of legalPages) {
    const { data, error } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', page)
      .single();

    if (!error && data) {
      legalPagesCount++;
    }
  }

  return {
    articles: articlesCount || 0,
    glossary: glossaryCount || 0,
    products: productsCount || 0,
    legalPages: legalPagesCount
  };
}

function calculateReadiness(counts: ContentCounts): number {
  const articlesScore = Math.min((counts.articles / MVL_TARGETS.articles) * 100, 100);
  const glossaryScore = Math.min((counts.glossary / MVL_TARGETS.glossary) * 100, 100);
  const productsScore = Math.min((counts.products / MVL_TARGETS.products) * 100, 100);
  const legalScore = (counts.legalPages / MVL_TARGETS.legalPages) * 100;

  // Weighted average
  return (
    articlesScore * 0.35 +
    glossaryScore * 0.25 +
    productsScore * 0.25 +
    legalScore * 0.15
  );
}

function printReport(counts: ContentCounts) {
  console.log('═══════════════════════════════════════════════════════');
  console.log('           📊 CONTENT READINESS REPORT');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('📝 ARTICLES');
  console.log(`   Current: ${counts.articles}`);
  console.log(`   Target:  ${MVL_TARGETS.articles}`);
  console.log(`   Status:  ${counts.articles >= MVL_TARGETS.articles ? '✅ READY' : '⚠️  NEEDS MORE'}`);
  console.log(`   Gap:     ${Math.max(0, MVL_TARGETS.articles - counts.articles)} articles needed\n`);

  console.log('📖 GLOSSARY TERMS');
  console.log(`   Current: ${counts.glossary}`);
  console.log(`   Target:  ${MVL_TARGETS.glossary}`);
  console.log(`   Status:  ${counts.glossary >= MVL_TARGETS.glossary ? '✅ READY' : '⚠️  NEEDS MORE'}`);
  console.log(`   Gap:     ${Math.max(0, MVL_TARGETS.glossary - counts.glossary)} terms needed\n`);

  console.log('🏷️  PRODUCTS');
  console.log(`   Current: ${counts.products}`);
  console.log(`   Target:  ${MVL_TARGETS.products}`);
  console.log(`   Status:  ${counts.products >= MVL_TARGETS.products ? '✅ READY' : '⚠️  NEEDS MORE'}`);
  console.log(`   Gap:     ${Math.max(0, MVL_TARGETS.products - counts.products)} products needed\n`);

  console.log('⚖️  LEGAL PAGES');
  console.log(`   Current: ${counts.legalPages}`);
  console.log(`   Target:  ${MVL_TARGETS.legalPages}`);
  console.log(`   Status:  ${counts.legalPages >= MVL_TARGETS.legalPages ? '✅ READY' : '⚠️  NEEDS MORE'}`);
  console.log(`   Missing: ${Math.max(0, MVL_TARGETS.legalPages - counts.legalPages)} pages\n`);

  const readinessScore = calculateReadiness(counts);
  console.log('═══════════════════════════════════════════════════════');
  console.log(`🎯 OVERALL CONTENT READINESS: ${readinessScore.toFixed(1)}%`);
  console.log('═══════════════════════════════════════════════════════\n');

  if (readinessScore >= 80) {
    console.log('✅ LAUNCH READY - Content meets MVL targets!\n');
  } else if (readinessScore >= 60) {
    console.log('⚠️  CONDITIONAL LAUNCH - Can launch but continue generating content\n');
  } else {
    console.log('❌ NOT READY - Need more content before launch\n');
  }

  // Recommendations
  console.log('📋 RECOMMENDATIONS:\n');
  
  if (counts.articles < MVL_TARGETS.articles) {
    console.log(`   • Generate ${MVL_TARGETS.articles - counts.articles} more articles via /admin/content-factory`);
  }
  
  if (counts.glossary < MVL_TARGETS.glossary) {
    console.log(`   • Add ${MVL_TARGETS.glossary - counts.glossary} glossary terms`);
  }
  
  if (counts.legalPages < MVL_TARGETS.legalPages) {
    console.log(`   • Create missing legal pages (About, Privacy, Terms, Disclaimer, Contact)`);
  }
  
  if (readinessScore >= 80) {
    console.log('   • Run production build: npm run build');
    console.log('   • Deploy to staging for final testing');
    console.log('   • Prepare for launch! 🚀');
  }
  
  console.log('');
}

async function main() {
  try {
    const counts = await countContent();
    printReport(counts);
    
    // Exit with appropriate code
    const readinessScore = calculateReadiness(counts);
    process.exit(readinessScore >= 60 ? 0 : 1);
  } catch (error) {
    console.error('❌ Error counting content:', error);
    process.exit(1);
  }
}

main();
