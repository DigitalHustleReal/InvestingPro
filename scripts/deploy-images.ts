
import fs from 'fs';
import path from 'path';

const SOURCE_DIR = 'C:/Users/shivp/.gemini/antigravity/brain/26f54a24-cc46-4b7a-ad45-27447a7c7d5f';
const TARGET_DIR = 'c:/Users/shivp/Desktop/InvestingPro_App/public/images/authors';

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.png'));

console.log(`Found ${files.length} png files in source.`);

files.forEach(file => {
    // Format: name_part_TIMESTAMP.png
    // e.g. aisha_khan_12345.png
    const parts = file.replace('.png', '').split('_');
    
    // Remove last part (timestamp) if it looks like a number
    const lastPart = parts[parts.length - 1];
    if (/^\d+$/.test(lastPart)) {
        parts.pop();
    }
    
    const newName = parts.join('-') + '.png';
    const sourcePath = path.join(SOURCE_DIR, file);
    const targetPath = path.join(TARGET_DIR, newName);
    
    console.log(`Copying ${file} -> ${newName}`);
    fs.copyFileSync(sourcePath, targetPath);
});

console.log('Done.');
