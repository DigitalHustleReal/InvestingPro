// fix-encoding.js
const fs = require('fs');
const path = require('path');

const files = [
    'app/terms/page.tsx',
    'app/taxes/page.tsx',
    'app/stocks/page.tsx',
    'app/mutual-funds/page.tsx',
    'app/login/page.tsx',
    'app/signup/page.tsx',
    'app/investing/page.tsx',
    'app/ipo/page.tsx',
    'app/insurance/page.tsx',
    'app/demat-accounts/page.tsx',
    'app/component-showcase/page.tsx',
    'app/calculators/swp/page.tsx',
    'app/small-business/page.tsx',
    'app/admin/login/page.tsx',
    'app/admin/signup/page.tsx',
];

const ROOT = 'c:/Users/shivp/Desktop/InvestingPro_App';

let fixed = 0;
let errors = 0;
let totalRupeeFixed = 0;
let totalBrandFixed = 0;

console.log('🔧 Starting encoding fix...\n');

files.forEach(file => {
    const fullPath = path.join(ROOT, file);
    
    try {
        if (!fs.existsSync(fullPath)) {
            console.log(`⚠️  Skip: ${file} (not found)`);
            return;
        }
        
        // Read file
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Count replacements
        const rupeeMatches = (content.match(/â‚¹/g) || []).length;
        const brandMatches = (content.match(/InvestingPâ‚¹o/g) || []).length;
        
        if (rupeeMatches === 0 && brandMatches === 0) {
            console.log(`✓  Clean: ${file}`);
            return;
        }
        
        // Fix corrupted Rupee symbol
        content = content.replace(/â‚¹/g, '₹');
        
        // Fix corrupted brand name (more specific replacement)
        content = content.replace(/InvestingPâ‚¹o/g, 'InvestingPro');
        
        // Write file back
        fs.writeFileSync(fullPath, content, 'utf8');
        
        console.log(`✅ Fixed: ${file}`);
        if (rupeeMatches > 0) {
            console.log(`   └─ ${rupeeMatches} Rupee symbol(s)`);
            totalRupeeFixed += rupeeMatches;
        }
        if (brandMatches > 0) {
            console.log(`   └─ ${brandMatches} brand name(s)`);
            totalBrandFixed += brandMatches;
        }
        
        fixed++;
    } catch (err) {
        console.error(`❌ Error: ${file}`);
        console.error(`   └─ ${err.message}`);
        errors++;
    }
});

console.log(`\n${'='.repeat(50)}`);
console.log(`✅ Encoding fix complete!\n`);
console.log(`Files processed: ${files.length}`);
console.log(`Files fixed: ${fixed}`);
console.log(`Errors: ${errors}`);
console.log(`\nTotal corrections:`);
console.log(`  - Rupee symbols (₹): ${totalRupeeFixed}`);
console.log(`  - Brand names: ${totalBrandFixed}`);
console.log(`${'='.repeat(50)}\n`);

if (errors === 0 && fixed > 0) {
    console.log('🎉 Success! Run "git diff" to see changes.');
} else if (fixed === 0) {
    console.log('ℹ️  No corrupted text found. All files are clean!');
}
