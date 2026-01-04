const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
try {
    let content = fs.readFileSync(envPath, 'utf8');
    // Remove BOM if present
    content = content.replace(/^\uFEFF/, '');
    // Remove null bytes if any
    content = content.replace(/\u0000/g, '');
    
    fs.writeFileSync(envPath, content, 'utf8');
    console.log('Successfully fixed .env.local encoding (removed BOM/Nulls)');
} catch (e) {
    console.error('Error fixing .env.local:', e);
}
