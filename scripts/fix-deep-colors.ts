
import fs from 'fs';
import path from 'path';

// CONFIG
const TARGET_DIRS = [
    path.resolve(process.cwd(), 'components'),
    path.resolve(process.cwd(), 'app'),
    path.resolve(process.cwd(), 'lib/charts'), // If exists
];

const REPLACEMENTS = [
    // Class Names
    { from: /text-emerald-([0-9]+)/g, to: 'text-primary-$1' },
    { from: /bg-emerald-([0-9]+)/g, to: 'bg-primary-$1' },
    { from: /border-emerald-([0-9]+)/g, to: 'border-primary-$1' },
    { from: /ring-emerald-([0-9]+)/g, to: 'ring-primary-$1' },
    { from: /shadow-emerald-([0-9]+)/g, to: 'shadow-primary-$1' },
    { from: /decoration-emerald-([0-9]+)/g, to: 'decoration-primary-$1' },
    
    { from: /text-indigo-([0-9]+)/g, to: 'text-primary-$1' }, // Unify Indigo
    { from: /bg-indigo-([0-9]+)/g, to: 'bg-primary-$1' },
    
    { from: /text-violet-([0-9]+)/g, to: 'text-primary-$1' }, // Unify Violet
    
    // Hex Codes (Common Emerald/Teal variants to Primary Hex - assuming Primary is Teal-600 approx)
    // Primary 500 equivalent: #14b8a6 (Teal 500) or #10b981 (Emerald 500) -> var(--primary)
    // NOTE: In inline styles or props, we often need the hex or the var.
    
    // Replace hardcoded Emerald Green (#10b981) with a placeholder we can define or map to primary
    // Strategy: Replace specific hexes with 'current' or specific variables if easy, else strict swap
    { from: /"#10b981"/g, to: '"#0d9488"' }, // Map Emerald-500 -> Teal-600 (Primary Base)
    { from: /"#059669"/g, to: '"#0f766e"' }, // Emerald-600 -> Teal-700
    { from: /"#34d399"/g, to: '"#2dd4bf"' }, // Emerald-400 -> Teal-400
    { from: /"#064e3b"/g, to: '"#115e59"' }, // Emerald-900 -> Teal-900
    { from: /"#ecfdf5"/g, to: '"#f0fdfa"' }, // Emerald-50 -> Teal-50
    
    // Chart Specific
    { from: /stroke="#10b981"/g, to: 'stroke="#0d9488"' },
    { from: /fill="#10b981"/g, to: 'fill="#0d9488"' }
];

// UTILS
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;
    
    const files = fs.readdirSync(dirPath);
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

// MAIN
async function main() {
    console.log('🎨 STARTING DEEP COLOR AUDIT & FIX...');
    
    let allFiles: string[] = [];
    TARGET_DIRS.forEach(dir => {
        allFiles = getAllFiles(dir, allFiles);
    });

    let totalReplacements = 0;
    
    for (const file of allFiles) {
        let content = fs.readFileSync(file, 'utf8');
        let fileChanged = false;
        
        // Skip backups/node_modules
        if (file.includes('.backup') || file.includes('node_modules')) continue;

        for (const rule of REPLACEMENTS) {
            if (rule.from.test(content)) {
                content = content.replace(rule.from, rule.to);
                fileChanged = true;
                totalReplacements++;
            }
        }
        
        if (fileChanged) {
            fs.writeFileSync(file, content);
            console.log(`✅ Updated: ${path.basename(file)}`);
        }
    }
    
    console.log(`\n🎉 DEEP CLEAN COMPLETE! Replaced ${totalReplacements} inconsistencies.`);
    console.log(`✨ System is now using unified Primary (Teal) theme.`);
}

main();
