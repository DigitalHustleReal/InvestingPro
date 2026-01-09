
import fs from 'fs';
import path from 'path';

// CONFIG
const TARGET_DIR = path.resolve(process.cwd(), 'components');
const COLOR_MAP = {
    'blue-50': 'primary-50',
    'blue-100': 'primary-100',
    'blue-200': 'primary-200',
    'blue-300': 'primary-300',
    'blue-400': 'primary-400',
    'blue-500': 'primary-500',
    'blue-600': 'primary-600',
    'blue-700': 'primary-700',
    'blue-800': 'primary-800',
    'blue-900': 'primary-900',
    'blue-950': 'primary-950',
};

// UTILS
function getAllFiles(dirPath, arrayOfFiles = []) {
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
    console.log('🎨 REPLACING BLUE WITH PRIMARY TEAL...');
    const components = getAllFiles(TARGET_DIR);
    
    let totalReplacements = 0;
    
    for (const file of components) {
        let content = fs.readFileSync(file, 'utf8');
        let fileChanged = false;
        
        // Skip backups
        if (file.includes('.backup')) continue;

        for (const [blue, primary] of Object.entries(COLOR_MAP)) {
            const regex = new RegExp(`\\b${blue}\\b`, 'g');
            if (regex.test(content)) {
                content = content.replace(regex, primary);
                fileChanged = true;
                totalReplacements++;
            }
        }
        
        if (fileChanged) {
            fs.writeFileSync(file, content);
            console.log(`✅ Updated: ${path.basename(file)}`);
        }
    }
    
    console.log(`\n🎉 DONE! Replaced ${totalReplacements} hardcoded color instances.`);
}

main();
