// Automated Export Validation Script
// Checks all component files for missing exports

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkExports(dir, errors = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively check subdirectories
      checkExports(filePath, errors);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      // Check TypeScript/React files
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Skip if file is empty or very small
      if (content.length < 10) {
        errors.push({
          file: filePath,
          error: 'File is empty or too small',
          severity: 'critical'
        });
        return;
      }
      
      // Check for export statement
      const hasExport = /export\s+(default\s+)?(function|const|class|interface|type|enum)/g.test(content);
      const hasDefaultExport = /export\s+default/g.test(content);
      
      if (!hasExport && !hasDefaultExport) {
        // Exception: Some files like types.ts might not need exports
        if (!file.includes('types.ts') && !file.includes('.d.ts')) {
          errors.push({
            file: filePath,
            error: 'No export statement found',
            severity: 'high'
          });
        }
      }
      
      // Check for common errors
      if (content.includes('export SIPCalculatorWithInflation') && content.length < 100) {
        errors.push({
          file: filePath,
          error: 'Export found but file content is suspiciously small',
          severity: 'critical'
        });
      }
    }
  });
  
  return errors;
}

// Main execution
log('cyan', '\n🔍 Checking exports in components...\n');

const componentsDir = path.join(__dirname, '..', 'components');
const errors = checkExports(componentsDir);

if (errors.length === 0) {
  log('green', '✅ All files have valid exports!\n');
  process.exit(0);
} else {
  log('red', `\n❌ Found ${errors.length} issue(s):\n`);
  
  errors.forEach(({ file, error, severity }) => {
    const color = severity === 'critical' ? 'red' : 'yellow';
    const icon = severity === 'critical' ? '🔴' : '⚠️';
    log(color, `${icon} ${path.relative(process.cwd(), file)}`);
    log(color, `   ${error}\n`);
  });
  
  log('red', '❌ Export validation failed!\n');
  process.exit(1);
}
