/**
 * Generate One Article via CMS (using API)
 * Calls POST /api/admin/generate-and-save-article so generation runs in Next server context.
 *
 * Usage (with dev server running on port 3000):
 *   npx tsx scripts/generate-one-article-cms.ts "Best Credit Card for Digital Marketers in 2026"
 *   npx tsx scripts/generate-one-article-cms.ts "Article Title" "keyword1" "keyword2"
 *
 * Or call the API directly:
 *   curl -X POST http://localhost:3000/api/admin/generate-and-save-article \
 *     -H "Content-Type: application/json" \
 *     -d '{"topic":"Best Credit Card for Digital Marketers in 2026"}'
 */

const topic = process.argv[2] || 'Best Credit Card for Digital Marketers in 2026';
const extraKeywords = process.argv.slice(3);
const keywords = [
  'credit card',
  'digital marketers',
  '2026',
  'rewards',
  'cashback',
  'business credit card',
  'travel rewards',
  'expense management',
  ...extraKeywords,
];

const BASE = process.env.APP_URL || 'http://localhost:3000';

async function main() {
  console.log('📝 CMS: Generating article via API...');
  console.log(`   Topic: ${topic}`);
  console.log(`   API: ${BASE}/api/admin/generate-and-save-article\n`);

  const res = await fetch(`${BASE}/api/admin/generate-and-save-article`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, keywords, tone: 'educational' }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error('❌ Error:', data.error || res.statusText);
    if (data.details) console.error('   ', data.details);
    process.exit(1);
  }

  console.log('✅ Article created and saved via CMS\n');
  console.log('   ID:', data.article?.id);
  console.log('   Title:', data.article?.title);
  console.log('   Slug:', data.article?.slug);
  console.log('   Status:', data.article?.status);
  console.log('\n   View:', data.viewUrl || `/articles/${data.article?.slug}`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
