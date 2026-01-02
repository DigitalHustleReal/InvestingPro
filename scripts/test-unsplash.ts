import { imageService } from '@/lib/images/stock-image-service';

async function testUnsplash() {
    console.log('📸 Testing Unsplash Gold Standard...');
    
    try {
        const query = "SIP in India: A Beginner's Guide";
        console.log(`   Searching for: "${query}"...`);
        
        // This will try Unsplash -> Freepik -> Pexels
        const result = await imageService.getFeaturedImage(query);
        
        console.log(`   ✅ Result Source: ${result.source.toUpperCase()}`);
        console.log(`   🔗 URL: ${result.url}`);
        
        if (result.source === 'unsplash') {
            console.log('   🎉 Unsplash Key is VALID!');
        } else {
            console.warn('   ⚠️ Unsplash failed, fell back to next provider.');
        }

    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

testUnsplash();
