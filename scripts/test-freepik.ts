import { imageService } from '@/lib/images/stock-image-service';

async function testFreepik() {
    console.log('🖼️ Testing Freepik Premium Integration...');
    
    try {
        const query = 'stock chart growth';
        console.log(`   Searching for: "${query}"...`);
        
        // This should trigger Freepik first because we set it as Priority #1
        const result = await imageService.getFeaturedImage(query);
        
        console.log(`   ✅ Result Source: ${result.source.toUpperCase()}`);
        console.log(`   🔗 URL: ${result.url}`);
        
        if (result.source !== 'freepik') {
            console.warn('   ⚠️ Note: Did not get Freepik image. Either API failed or returned 0 results.');
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

testFreepik();
