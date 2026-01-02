
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs';
import { generateArticleCore } from '../lib/automation/article-generator';

async function generatePreview() {
    const topic = "How to Start SIP in India for Beginners 2026";
    console.log(`🚀 Generating Preview for: "${topic}"...`);
    console.log('   (Using Unsplash, Vikram Mehta Persona, & Quality Gates)');

    try {
        // Run with dryRun=true (3rd arg)
        const result = await generateArticleCore(topic, (msg: string) => console.log(msg), true);
        
        console.log('DEBUG RESULT:', JSON.stringify(result, null, 2));

        if (result) {
            console.log('✅ Article Generated Successfully!');
            
            // Write to file for review
            const report = `
# 📝 Article Preview

## Reference
**Title:** ${result.title}
**Slug:** ${result.slug}
**Quality Score:** ${result.quality_score}/100
**Uniqueness:** ${result.uniqueness_score}%
**Image:** ${result.featured_image}
**Alt Text:** ${result.image_alt_text}

## 🖼️ Image
![Featured Image](${result.featured_image})

---

## 📄 Content (Rendered HTML)

${result.body_markdown || result.body_html}

---

## 📊 Quality Report
- **Readability:** ${result.readability_score}
- **Verified:** ${result.is_verified_quality ? 'YES' : 'NO'}
- **Schema:** ${JSON.stringify(result.schema_markup, null, 2)}
            `;
            
            fs.writeFileSync('preview_article_quality_check.md', report);
            console.log('\n💾 Saved preview to: preview_article_quality_check.md');
        }

    } catch (error) {
        console.error('❌ Generation Failed:', error);
    }
}

generatePreview();
