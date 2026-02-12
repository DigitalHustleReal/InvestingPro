/**
 * Custom linter to enforce design system colors
 * Prevents use of non-compliant colors
 * Usage: node scripts/lint-design-system.ts
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const FORBIDDEN_COLORS = [
  'text-slate-400', // Too low contrast on dark backgrounds
  'text-gray-400',  // Too low contrast on light backgrounds
  'text-gray-300',  // Too low contrast on light backgrounds
];

const IGNORED_DIRS = [
  'node_modules',
  '.next',
  'out',
  'build',
  'dist',
  '.git'
];

async function scanFiles() {
  console.log('🎨 Scanning for design system violations...\n');
  
  // Custom glob implementation since we can't easily rely on 'glob' package presence
  // Using recursive directory walk
  const files = getAllFiles('./app').concat(getAllFiles('./components'));
  
  let errorCount = 0;
  
  files.forEach(file => {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;
    
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      FORBIDDEN_COLORS.forEach(color => {
        if (line.includes(color)) {
          console.error(`❌ Violation in ${file}:${index + 1}`);
          console.error(`   Found forbidden color: ${color}`);
          console.error(`   ${line.trim()}`);
          console.error('   👉 Use text-slate-300 (dark) or text-gray-600 (light) instead\n');
          errorCount++;
        }
      });
    });
  });
  
  if (errorCount > 0) {
    console.error(`Found ${errorCount} violations. Please fix them before committing.`);
    process.exit(1);
  } else {
    console.log('✅ No design system violations found!');
  }
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  
  arrayOfFiles = arrayOfFiles || [];
  
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  
  return arrayOfFiles;
}

scanFiles();
