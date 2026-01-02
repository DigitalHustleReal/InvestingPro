/**
 * Card Padding Standardization Script - Week 1, Task 1.9
 * Purpose: Standardize card padding to 24px (mobile) / 32px (desktop)
 * 
 * Problem: Cards currently use inconsistent padding (16px-48px mix)
 * Solution: Apply standard p-6 (24px mobile) + md:p-8 (32px desktop)
 * 
 * Target: ~80 card components across codebase
 * 
 * Usage:
 *  node scripts/standardize-cards.js --dry-run  // Preview changes
 *  node scripts/standardize-cards.js --execute  // Apply changes
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuration
const DRY_RUN = process.argv.includes('--dry-run');
const EXECUTE = process.argv.includes('--execute');

// Directories to scan
const SCAN_DIRS = [
  'components/**/*.{tsx,ts,jsx,js}',
  'app/**/*.{tsx,ts,jsx,js}',
];

// Padding patterns to standardize
const PADDING_REPLACEMENTS = [
  // Replace inconsistent padding with standard
  {
    from: /className="([^"]*?)\bp-(?:2|3|4|5|10|12|16)\b([^"]*?)"/g,
    to: 'className="$1p-6 md:p-8$2"',
    description: 'Card padding → p-6 md:p-8 (24px/32px)',
    context: ['Card', 'card', 'panel', 'section', 'container'],
  },
  
  // Specific card component patterns
  {
    from: /(<Card[^>]*className="[^"]*?)p-(?:2|3|4|5|10|12|16)(?![0-9])([^"]*?")/g,
    to: '$1p-6 md:p-8$2',
    description: 'Card component padding standardization',
  },
  
  // Section padding updates
  {
    from: /(<section[^>]*className="[^"]*?)py-12(?![0-9])([^"]*?")/g,
    to: '$1py-16 md:py-24$2',
    description: 'Section vertical padding → py-16 md:py-24',
  },
];

// Statistics
let stats = {
  filesScanned: 0,
  filesModified: 0,
  totalReplacements: 0,
  replacementsByType: {},
};

/**
 * Check if line contains card-related keywords
 */
function isCardContext(content, position) {
  const beforeContext = content.substring(Math.max(0, position - 200), position);
  const afterContext = content.substring(position, Math.min(content.length, position + 200));
  const context = beforeContext + afterContext;
  
  const cardKeywords = [
    '<Card', 'card', 'panel', 'CardContent', 'CardHeader',
    'ProductCard', 'ComparisonCard', 'InfoCard'
  ];
  
  return cardKeywords.some(keyword => context.includes(keyword));
}

/**
 * Process a single file
 */
function processFile(filePath) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  let modifiedContent = originalContent;
  let fileModified = false;
  let fileReplacements = 0;

  // Apply padding standardization rules
  PADDING_REPLACEMENTS.forEach((rule) => {
    const before = modifiedContent;
    
    if (rule.context) {
      // Context-aware replacement (only for card-like components)
      let matches = [];
      let regex = new RegExp(rule.from.source, rule.from.flags);
      let match;
      
      while ((match = regex.exec(modifiedContent)) !== null) {
        if (isCardContext(modifiedContent, match.index)) {
          matches.push(match);
        }
      }
      
      if (matches.length > 0) {
        modifiedContent = modifiedContent.replace(rule.from, (fullMatch, ...args) => {
          const matchIndex = modifiedContent.indexOf(fullMatch);
          if (isCardContext(modifiedContent, matchIndex)) {
            return rule.to.replace(/\$(\d+)/g, (_, n) => args[parseInt(n) - 1] || '');
          }
          return fullMatch;
        });
      }
    } else {
      // Direct replacement
      modifiedContent = modifiedContent.replace(rule.from, rule.to);
    }
    
    if (before !== modifiedContent) {
      const count = (before.match(rule.from) || []).length;
      fileReplacements += count;
      stats.totalReplacements += count;
      stats.replacementsByType[rule.description] = 
        (stats.replacementsByType[rule.description] || 0) + count;
      fileModified = true;
    }
  });

  stats.filesScanned++;

  if (fileModified) {
    stats.filesModified++;
    
    if (EXECUTE) {
      // Create backup
      const backupPath = `${filePath}.cardbackup`;
      if (!fs.existsSync(backupPath)) {
        fs.writeFileSync(backupPath, originalContent);
      }
      
      // Write modified content
      fs.writeFileSync(filePath, modifiedContent);
      console.log(`✅ Modified: ${filePath} (${fileReplacements} changes)`);
    } else {
      console.log(`🔍 Would modify: ${filePath} (${fileReplacements} changes)`);
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('📦 Card Component Standardization\n');
  
  if (!DRY_RUN && !EXECUTE) {
    console.error('❌ Error: Please specify --dry-run or --execute');
    console.log('\nUsage:');
    console.log('  node scripts/standardize-cards.js --dry-run  # Preview');
    console.log('  node scripts/standardize-cards.js --execute  # Apply');
    process.exit(1);
  }
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  } else {
    console.log('✏️  EXECUTE MODE - Files will be modified\n');
  }

  console.log('🎯 Target: Standardize card padding and section spacing\n');
  console.log('Standards:');
  console.log('  • Card padding: p-6 (24px) mobile, md:p-8 (32px) desktop');
  console.log('  • Section spacing: py-16 (64px) mobile, md:py-24 (96px) desktop\n');

  // Find all files
  const files = await glob(SCAN_DIRS, {
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  });

  console.log(`📁 Found ${files.length} files to scan\n`);

  // Process each file
  files.forEach(processFile);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 STANDARDIZATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files scanned:    ${stats.filesScanned}`);
  console.log(`Files modified:   ${stats.filesModified}`);
  console.log(`Total changes:    ${stats.totalReplacements}\n`);

  if (stats.totalReplacements > 0) {
    console.log('Changes by type:');
    Object.entries(stats.replacementsByType)
      .sort((a, b) => b[1] - a[1])
      .forEach(([desc, count]) => {
        console.log(`  ${count.toString().padStart(4)}× ${desc}`);
      });
  }

  if (EXECUTE && stats.filesModified > 0) {
    console.log('\n✅ Card standardization complete!');
    console.log('💡 Backup files created with .cardbackup extension');
    console.log('🎨 Cards now have consistent, professional spacing');
    console.log('🔄 Refresh your browser to see improved layout');
  } else if (DRY_RUN && stats.filesModified > 0) {
    console.log('\n💡 Run with --execute to apply these changes');
  } else {
    console.log('\n✨ No card padding issues found!');
  }
}

// Run
main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
