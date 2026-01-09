/**
 * Glossary Enrichment Script
 * 
 * Run with: npx tsx scripts/enrich-glossary-terms.ts
 * 
 * This script enriches all basic glossary terms with AI-generated
 * Investopedia-style content including examples, use cases, and related content.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { enrichAllTerms, enrichSingleTerm } from '../lib/services/glossary-enrichment';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Enrich single term for testing
    const slug = args[0];
    console.log(`🎯 Enriching single term: ${slug}\n`);
    await enrichSingleTerm(slug);
  } else {
    // Enrich all terms
    console.log('🌱 Starting glossary enrichment...\n');
    console.log('This will add Investopedia-style content to all glossary terms:');
    console.log('  - Extended definitions (200-300 words)');
    console.log('  - Why it matters sections');
    console.log('  - Numeric examples with calculations');
    console.log('  - How to use guides');
    console.log('  - Common mistakes');
    console.log('  - Related terms and calculators');
    console.log('  - SEO optimization\n');
    
    await enrichAllTerms(5); // Process 5 terms at a time
  }
  
  console.log('\n🎉 Enrichment complete!');
  console.log('📍 Next: Run the auto-linker to connect terms across the platform');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
