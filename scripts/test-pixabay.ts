import { imageService } from '@/lib/images/stock-image-service';

async function testPixabay() {
    console.log('📸 Testing Pixabay Image Fetch...');
    
    try {
        const queries = ['mutual funds', 'stock market', 'rupees'];
        
        for (const q of queries) {
            console.log(`   Searching for: "${q}"...`);
            const result = await imageService.getFeaturedImage(q);
            console.log(`   ✅ Result (${result.source}): ${result.url}`);
            console.log(`      Alt: ${result.alt}`);
        }
    } catch (error) {
        console.error('❌ Test Failed:', error);
    }
}

testPixabay();
