/**
 * Update Author Images
 * Updates author records with image URLs
 * Use this to apply previously generated images without regenerating
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Author image URLs from your previous generation
// Update these URLs with your actual image URLs from Supabase Storage
const AUTHOR_IMAGES: { [key: string]: string } = {
    // Writers
    'arjun-sharma': '',  // Add your Supabase image URL here
    'priya-menon': '',
    'vikram-singh-rathore': '',
    'aisha-khan': '',
    'suresh-patel': '',
    'anjali-deshmukh': '',
    'kavita-sharma': '',
    'rahul-chatterjee': '',
    
    // Editors
    'rajesh-mehta': '',
    'dr-meera-iyer': '',
    'harpreet-kaur': '',
    'thomas-fernandes': '',
    'nandini-reddy': '',
    'amit-desai': '',
    'deepika-singh': '',
    'karthik-menon': ''
};

async function updateAuthorImages() {
    console.log('📸 Updating author images...\n');
    
    let updated = 0;
    let skipped = 0;
    
    for (const [slug, imageUrl] of Object.entries(AUTHOR_IMAGES)) {
        if (!imageUrl) {
            console.log(`⏭️  Skipping ${slug} - no URL provided`);
            skipped++;
            continue;
        }
        
        try {
            const { error } = await supabase
                .from('authors')
                .update({ photo_url: imageUrl })
                .eq('slug', slug);
            
            if (error) {
                console.error(`❌ Failed to update ${slug}:`, error.message);
            } else {
                console.log(`✅ Updated ${slug}`);
                updated++;
            }
        } catch (error: any) {
            console.error(`❌ Error updating ${slug}:`, error.message);
        }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Updated: ${updated}`);
    console.log(`  ⏭️  Skipped: ${skipped}`);
    console.log(`  Total: ${Object.keys(AUTHOR_IMAGES).length}`);
}

// Alternative: Set all to placeholder image
async function setPlaceholderImages() {
    console.log('🖼️  Setting placeholder images...\n');
    
    const placeholderUrl = 'https://ui-avatars.com/api/?name={name}&background=10b981&color=fff&size=200';
    
    const authors = [
        { slug: 'arjun-sharma', name: 'Arjun Sharma' },
        { slug: 'priya-menon', name: 'Priya Menon' },
        { slug: 'vikram-singh-rathore', name: 'Vikram Singh Rathore' },
        { slug: 'aisha-khan', name: 'Aisha Khan' },
        { slug: 'suresh-patel', name: 'Suresh Patel' },
        { slug: 'anjali-deshmukh', name: 'Anjali Deshmukh' },
        { slug: 'kavita-sharma', name: 'Kavita Sharma' },
        { slug: 'rahul-chatterjee', name: 'Rahul Chatterjee' },
        { slug: 'rajesh-mehta', name: 'Rajesh Mehta' },
        { slug: 'dr-meera-iyer', name: 'Dr Meera Iyer' },
        { slug: 'harpreet-kaur', name: 'Harpreet Kaur' },
        { slug: 'thomas-fernandes', name: 'Thomas Fernandes' },
        { slug: 'nandini-reddy', name: 'Nandini Reddy' },
        { slug: 'amit-desai', name: 'Amit Desai' },
        { slug: 'deepika-singh', name: 'Deepika Singh' },
        { slug: 'karthik-menon', name: 'Karthik Menon' }
    ];
    
    for (const author of authors) {
        const url = placeholderUrl.replace('{name}', encodeURIComponent(author.name));
        
        const { error } = await supabase
            .from('authors')
            .update({ photo_url: url })
            .eq('slug', author.slug);
        
        if (error) {
            console.error(`❌ Failed to update ${author.slug}`);
        } else {
            console.log(`✅  ${author.name}`);
        }
    }
    
    console.log('\n✅ All authors now have placeholder avatars!');
}

// Run based on command line argument
const mode = process.argv[2];

if (mode === 'placeholder') {
    setPlaceholderImages()
        .then(() => process.exit(0))
        . catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
} else {
    updateAuthorImages()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}

export { updateAuthorImages, setPlaceholderImages };
