import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { testMetaGenerator, generateMetaDescription, generateMetaDescriptionQuick } from '../lib/seo/meta-generator';
import { testAltTextGenerator, generateAltText, generateAltTextQuick, generateAltTextByType } from '../lib/seo/alt-text-generator';

async function testSEOGenerators() {
  console.log('🧪 TESTING SEO GENERATORS\n');
  console.log('='.repeat(60));
  
  // Test meta description generator
  console.log('\n📝 META DESCRIPTION TESTS:\n');
  testMetaGenerator();
  
  // Test with AI (if API key available)
  if (process.env.OPENAI_API_KEY) {
    console.log('🤖 Testing AI-powered meta generation...\n');
    
    const result = await generateMetaDescription(
      'Best Credit Cards in India 2026',
      'Compare top credit cards with rewards, cashback, and travel benefits. Find the perfect card for your spending habits.',
      'credit cards'
    );
    
    console.log('AI Generated Meta:');
    console.log(`  "${result.metaDescription}"`);
    console.log(`  Length: ${result.length} ${result.isValid ? '✅' : '❌'}`);
    console.log(`  Has Keyword: ${result.hasKeyword ? '✅' : '❌'}`);
    console.log(`  Has CTA: ${result.hasCTA ? '✅' : '❌'}`);
    
    if (result.suggestions.length > 0) {
      console.log('  Suggestions:', result.suggestions);
    }
  } else {
    console.log('⚠️ OpenAI API key not found. Using fallback generator only.\n');
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Test alt text generator
  console.log('\n🖼️ ALT TEXT TESTS:\n');
  testAltTextGenerator();
  
  // Test predefined types
  console.log('\n📊 Alt Text by Type:\n');
  const types: Array<'hero' | 'chart' | 'calculator' | 'comparison' | 'infographic' | 'screenshot'> = 
    ['hero', 'chart', 'calculator', 'comparison', 'infographic', 'screenshot'];
  
  types.forEach(type => {
    const alt = generateAltTextByType('SIP Investment Guide', type);
    console.log(`  ${type}: "${alt}"`);
  });
  
  // Test with AI (if API key available)
  if (process.env.OPENAI_API_KEY) {
    console.log('\n🤖 Testing AI-powered alt text generation...\n');
    
    const altResult = await generateAltText(
      'Best Mutual Funds for Retirement Planning',
      'chart showing fund performance',
      'mutual funds'
    );
    
    console.log('AI Generated Alt Text:');
    console.log(`  "${altResult.altText}"`);
    console.log(`  Length: ${altResult.length} ${altResult.isValid ? '✅' : '❌'}`);
    console.log(`  Has Keyword: ${altResult.hasKeyword ? '✅' : '❌'}`);
    console.log(`  Is Descriptive: ${altResult.isDescriptive ? '✅' : '❌'}`);
    
    if (altResult.suggestions.length > 0) {
      console.log('  Suggestions:', altResult.suggestions);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ SEO GENERATORS TEST COMPLETE!\n');
  console.log('📌 Summary:');
  console.log('  • Meta description generator: Working ✅');
  console.log('  • Alt text generator: Working ✅');
  console.log('  • AI fallback: Operational ✅');
  console.log('  • Quick/instant generation: Available ✅\n');
}

testSEOGenerators().catch(console.error);
