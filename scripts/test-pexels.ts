import { imageService } from '@/lib/images/stock-image-service';

async function testPexels() {
    console.log('📸 Testing Pexels Premium Photos...');
    
    try {
        const query = 'stock trading computer';
        console.log(`   Searching for: "${query}"...`);
        
        // This will try Freepik -> Pexels -> Pixabay
        const result = await imageService.getFeaturedImage(query);
        
        console.log(`   ✅ Result Source: ${result.source.toUpperCase()}`);
        console.log(`   🔗 URL: ${result.url}`);
        
        if (result.source === 'pexels') {
            console.log('   🎉 Pexels Key is VALID and ACTIVE!');
        } else if (result.source === 'pixabay') {
            console.warn('   ⚠️ Pexels failed, fell back to Pixabay.');
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

testPexels();
