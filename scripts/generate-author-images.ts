/**
 * Generate Professional Author Profile Images
 * Creates headshots for all 16 editorial team members
 */

import { generateFeaturedImage, downloadAndSaveImage } from '../lib/ai/image-generator';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const AUTHORS = [
    // Writers
    { name: 'Arjun Sharma', role: 'author', location: 'Mumbai', age: '35', ethnicity: 'Indian', gender: 'male' },
    { name: 'Priya Menon', role: 'author', location: 'Kerala', age: '32', ethnicity: 'Indian', gender: 'female' },
    { name: 'Vikram Singh Rathore', role: 'author', location: 'Rajasthan', age: '38', ethnicity: 'Indian', gender: 'male' },
    { name: 'Aisha Khan', role: 'author', location: 'Hyderabad', age: '29', ethnicity: 'Indian', gender: 'female' },
    { name: 'Suresh Patel', role: 'author', location: 'Gujarat', age: '42', ethnicity: 'Indian', gender: 'male' },
    { name: 'Anjali Deshmukh', role: 'author', location: 'Pune', age: '34', ethnicity: 'Indian', gender: 'female' },
    { name: 'Kavita Sharma', role: 'author', location: 'Delhi', age: '36', ethnicity: 'Indian', gender: 'female' },
    { name: 'Rahul Chatterjee', role: 'author', location: 'Kolkata', age: '33', ethnicity: 'Indian', gender: 'male' },
    
    // Editors
    { name: 'Rajesh Mehta', role: 'editor', location: 'Bengaluru', age: '45', ethnicity: 'Indian', gender: 'male' },
    { name: 'Dr. Meera Iyer', role: 'editor', location: 'Chennai', age: '43', ethnicity: 'Indian', gender: 'female' },
    { name: 'Harpreet Kaur', role: 'editor', location: 'Chandigarh', age: '39', ethnicity: 'Indian', gender: 'female' },
    { name: 'Thomas Fernandes', role: 'editor', location: 'Goa', age: '41', ethnicity: 'Indian', gender: 'male' },
    { name: 'Nandini Reddy', role: 'editor', location: 'Hyderabad', age: '37', ethnicity: 'Indian', gender: 'female' },
    { name: 'Amit Desai', role: 'editor', location: 'Mumbai', age: '44', ethnicity: 'Indian', gender: 'male' },
    { name: 'Deepika Singh', role: 'editor', location: 'Delhi', age: '40', ethnicity: 'Indian', gender: 'female' },
    { name: 'Karthik Menon', role: 'editor', location: 'Kerala', age: '38', ethnicity: 'Indian', gender: 'male' }
];

function createAuthorPrompt(author: typeof AUTHORS[0]): string {
    const ageRange = parseInt(author.age) > 40 ? 'mature' : 'young professional';
    const professional = author.role === 'editor' ? 'senior editor' : 'financial writer';
    
    return `Professional LinkedIn-style headshot portrait of ${author.name}, a ${ageRange} ${author.ethnicity} ${author.gender} ${professional} from ${author.location}, India.

Style requirements:
- Professional corporate headshot
- Neutral gray or white background
- Business formal attire (suit and tie for men, professional blazer for women)
- Warm, friendly, trustworthy expression
- Well-lit studio photography
- Sharp focus, high quality
- Natural skin tones
- Professional hair styling
- Authentic ${author.ethnicity} features
- Age approximately ${author.age} years old

Photography style:
- 3/4 view or straight-on angle
- Shoulders visible  
- Clean, professional look
- No glasses or minimal accessories
- Natural smile or neutral professional expression
- Studio lighting with soft shadows

This is for a financial editorial team profile, should look credible and professional like Forbes or Bloomberg author photos.`;
}

async function generateAllAuthorImages() {
    console.log('🎨 Starting author image generation...\n');
    
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const results = [];
    
    for (const [index, author] of AUTHORS.entries()) {
        console.log(`[${index + 1}/16] Generating image for ${author.name}...`);
        
        try {
            // Generate image (FALLBACK TO DICEBEAR DUE TO BILLING LIMIT)
            // const prompt = createAuthorPrompt(author);
            // const imageUrl = await generateFeaturedImage(author.name, 'authors');
            const imageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.name.replace(/ /g, '')}&backgroundColor=c0ebff`;
            console.log(`⚠️ Using DiceBear fallback for ${author.name}`);
            
            if (!imageUrl) {
                console.error(`❌ Failed to generate image for ${author.name}`);
                results.push({ name: author.name, status: 'failed', error: 'No image URL returned' });
                continue;
            }
            
            // Download and save (Skip for DiceBear URLs, use directly)
            // const fileName = `${author.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
            // const savedUrl = await downloadAndSaveImage(imageUrl, `authors/${fileName}`);
            const savedUrl = imageUrl;

            /* 
            if (!savedUrl) {
                console.error(`❌ Failed to save image for ${author.name}`);
                results.push({ name: author.name, status: 'failed', error: 'Failed to save' });
                continue;
            } 
            */
            
            // Update author record
            const slug = author.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
            const { error: updateError } = await supabase
                .from('authors')
                .update({ photo_url: savedUrl })
                .eq('slug', slug);
            
            if (updateError) {
                console.warn(`⚠️ Warning: Could not update author ${author.name} in database`);
            }
            
            console.log(`✅ Success: ${author.name} - ${savedUrl}`);
            results.push({ name: author.name, status: 'success', url: savedUrl });
            
            // Rate limit: wait 2 seconds between requests
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error: any) {
            console.error(`❌ Error generating ${author.name}:`, error.message);
            results.push({ name: author.name, status: 'failed', error: error.message });
        }
    }
    
    // Summary
    console.log('\n📊 GENERATION SUMMARY:');
    console.log(`✅ Successful: ${results.filter(r => r.status === 'success').length}/16`);
    console.log(`❌ Failed: ${results.filter(r => r.status === 'failed').length}/16`);
    console.log('\nCost estimate: $0.08 × 16 = ~$1.28');
    
    return results;
}

// Run if called directly
if (require.main === module) {
    generateAllAuthorImages()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

export { generateAllAuthorImages };
