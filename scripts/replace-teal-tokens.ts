import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import path from 'path';

// Target files: Category pages only (focused scope)
const targetFiles = [
    'app/credit-cards/page.tsx',
    'app/mutual-funds/page.tsx',
    'app/loans/page.tsx',
    'app/insurance/page.tsx',
    'app/demat-accounts/page.tsx',
    'app/fixed-deposits/page.tsx'
];

// Replacement map: teal-* -> primary-*
const replacements: Record<string, string> = {
    'teal-50': 'primary-50',
    'teal-100': 'primary-100',
    'teal-200': 'primary-200',
    'teal-300': 'primary-300',
    'teal-400': 'primary-400',
    'teal-500': 'primary-500',
    'teal-600': 'primary-600',
    'teal-700': 'primary-700',
    'teal-800': 'primary-800',
    'teal-900': 'primary-900'
};

let totalReplacements = 0;

console.log('🎨 Starting Teal → Primary Color Token Replacement...\n');

targetFiles.forEach(filePath => {
    const fullPath = path.resolve(process.cwd(), filePath);
    
    try {
        let content = readFileSync(fullPath, 'utf-8');
        let fileReplacements = 0;

        Object.entries(replacements).forEach(([from, to]) => {
            const regex = new RegExp(from, 'g');
            const matches = content.match(regex);
            if (matches) {
                fileReplacements += matches.length;
                content = content.replace(regex, to);
            }
        });

        if (fileReplacements > 0) {
            writeFileSync(fullPath, content, 'utf-8');
            console.log(`✅ ${filePath}: ${fileReplacements} replacements`);
            totalReplacements += fileReplacements;
        } else {
            console.log(`⏭️  ${filePath}: No changes needed`);
        }
    } catch (error: any) {
        console.log(`⚠️  ${filePath}: File not found or error - ${error.message}`);
    }
});

console.log(`\n🎉 Complete! Total replacements: ${totalReplacements}`);
console.log(`\nNext: Verify the changes and commit.`);
