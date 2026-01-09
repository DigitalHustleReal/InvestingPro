/**
 * Glossary Seeding Script
 * Seeds 100 financial terms across categories via API endpoint
 */

const GLOSSARY_API_URL = 'http://localhost:3000/api/admin/glossary/seed';

async function seedGlossary() {
  console.log('🌱 Seeding 100 glossary terms via API...\n');

  try {
    const response = await fetch(GLOSSARY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('✅ Glossary seeding completed!');
    console.log(`📊 Added: ${result.count} terms`);
    console.log(`📋 Categories: ${Object.keys(result.byCategory).join(', ')}`);
    console.log('\nBreakdown:');
    Object.entries(result.byCategory).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} terms`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding glossary:', error);
    process.exit(1);
  }
}

seedGlossary();
