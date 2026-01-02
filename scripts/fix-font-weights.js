/**
 * Font Weight Migration Script - Week 1, Task 1.4
 * Purpose: Replace font-black (900) with font-bold (700) for professional fintech aesthetic
 * 
 * Problem: font-black (900 weight) looks amateurish and reduces legibility
 * Solution: 
 *  - Large text (4xl-7xl): font-black → font-bold tracking-tight
 *  - Small labels (xs-sm): font-black → font-semibold
 *  - Medium text: font-black → font-bold
 * 
 * Target: 447 instances across codebase
 * 
 * Usage:
 *  node scripts/fix-font-weights.js --dry-run  // Preview changes
 *  node scripts/fix-font-weights.js --execute  // Apply changes
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

// Replacement rules (order matters - most specific first!)
const REPLACEMENTS = [
  // Rule 1: Large headings (4xl-7xl) - Add tracking-tight
  {
    from: /className="([^"]*?)font-black([^"]*?)(text-(?:4xl|5xl|6xl|7xl))([^"]*)"/g,
    to: 'className="$1font-bold tracking-tight$2$3$4"',
    description: 'Large headings: font-black → font-bold tracking-tight (4xl-7xl)',
  },
  
  // Rule 2: Small labels/badges (xs, sm, 10px, 11px) - Use semibold
  {
    from: /className="([^"]*?)font-black([^"]*?)text-(?:xs|sm|\[10px\]|\[11px\])([^"]*)"/g,
    to: 'className="$1font-semibold$2text-$3"',
    description: 'Small labels: font-black → font-semibold (xs, sm, 10-11px)',
  },
  
  // Rule 3: Uppercase labels with tracking - Use semibold
  {
    from: /className="([^"]*?)font-black([^"]*?)uppercase([^"]*?)tracking-(?:wide|wider|widest)([^"]*)"/g,
    to: 'className="$1font-semibold$2uppercase$3tracking-$4"',
    description: 'Uppercase labels: font-black → font-semibold',
  },
  
  // Rule 4: Medium headings (xl-3xl) - Just font-bold
  {
    from: /className="([^"]*?)font-black([^"]*?)(text-(?:xl|2xl|3xl))([^"]*)"/g,
    to: 'className="$1font-bold$2$3$4"',
    description: 'Medium headings: font-black → font-bold (xl-3xl)',
  },
  
  // Rule 5: Stats/numbers in large size - Keep font-bold
  {
    from: /className="([^"]*?)font-black([^"]*?)text-(?:2xl|3xl)([^"]*?)(?:font-mono|tabular-nums)([^"]*)"/g,
    to: 'className="$1font-bold$2text-$3$4"',
    description: 'Large numbers: font-black → font-bold',
  },
  
  // Rule 6: Catch-all remaining font-black - Default to font-bold
  {
    from: /\bfont-black\b/g,
    to: 'font-bold',
    description: 'Remaining: font-black → font-bold',
  },
];

// Statistics
let stats = {
  filesScanned: 0,
  filesModified: 0,
  totalReplacements: 0,
  replacementsByType: {},
  fileDetails: [],
};

/**
 * Process a single file
 */
function processFile(filePath) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  let modifiedContent = originalContent;
  let fileModified = false;
  let fileReplacements = 0;
  const fileChanges = [];

  // Apply all replacement rules
  REPLACEMENTS.forEach((rule) => {
    const before = modifiedContent;
    modifiedContent = modifiedContent.replace(rule.from, rule.to);
    
    if (before !== modifiedContent) {
      const matches = before.match(rule.from);
      if (matches) {
        const count = matches.length;
        fileReplacements += count;
        stats.totalReplacements += count;
        stats.replacementsByType[rule.description] = 
          (stats.replacementsByType[rule.description] || 0) + count;
        fileModified = true;
        fileChanges.push({ rule: rule.description, count });
      }
    }
  });

  stats.filesScanned++;

  if (fileModified) {
    stats.filesModified++;
    stats.fileDetails.push({
      path: filePath,
      changes: fileReplacements,
      details: fileChanges,
    });
    
    if (EXECUTE) {
      // Create backup
      const backupPath = `${filePath}.fontbackup`;
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
  console.log('✍️  Font Weight Migration - Professional Typography\n');
  
  if (!DRY_RUN && !EXECUTE) {
    console.error('❌ Error: Please specify --dry-run or --execute');
    console.log('\nUsage:');
    console.log('  node scripts/fix-font-weights.js --dry-run  # Preview');
    console.log('  node scripts/fix-font-weights.js --execute  # Apply');
    process.exit(1);
  }
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  } else {
    console.log('✏️  EXECUTE MODE - Files will be modified\n');
  }

  console.log('🎯 Target: Replace font-black (900) with context-appropriate weights\n');
  console.log('Rules:');
  console.log('  • Large headings (4xl+):  font-bold + tracking-tight');
  console.log('  • Small labels (xs/sm):   font-semibold');
  console.log('  • Medium headings:        font-bold');
  console.log('  • Uppercase labels:       font-semibold\n');

  // Find all files
  const files = await glob(SCAN_DIRS, {
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  });

  console.log(`📁 Found ${files.length} files to scan\n`);

  // Process each file
  files.forEach(processFile);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TYPOGRAPHY MIGRATION SUMMARY');
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
    
    if (DRY_RUN && stats.fileDetails.length > 0 && stats.fileDetails.length <= 20) {
      console.log('\n📝 Top files with changes:');
      stats.fileDetails
        .sort((a, b) => b.changes - a.changes)
        .slice(0, 10)
        .forEach(file => {
          console.log(`  ${file.changes.toString().padStart(3)}× ${file.path.replace(/\\/g, '/')}`);
        });
    }
  }

  if (EXECUTE && stats.filesModified > 0) {
    console.log('\n✅ Typography migration complete!');
    console.log('💡 Backup files created with .fontbackup extension');
    console.log('🎨 Your typography now has professional fintech weight');
    console.log('🔄 Refresh your browser to see changes');
  } else if (DRY_RUN && stats.filesModified > 0) {
    console.log('\n💡 Run with --execute to apply these changes');
    console.log('⚠️  Recommended: Review the changes list above first');
  } else {
    console.log('\n✨ No font-black instances found!');
  }
}

// Run
main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
