/**
 * Design System Migration Script - Week 1, Task 1.3
 * Purpose: Automated color class replacement for fintech design system
 * 
 * Changes:
 *  - primary-500 → primary-600 (darker brand teal)
 *  - secondary-* → primary-* (remove blue, use teal)
 *  - Remove references to old emerald primary colors
 * 
 * Usage:
 *  node scripts/migrate-colors.js --dry-run  // Preview changes
 *  node scripts/migrate-colors.js --execute  // Apply changes
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

// Replacement rules (order matters!)
const REPLACEMENTS = [
  // Primary color migration: Emerald → Teal
  // - primary-500 → primary-600 (darker, richer brand color)
  {
    from: /(bg|text|border|ring|shadow)-primary-500/g,
    to: '$1-primary-600',
    description: 'primary-500 → primary-600 (darker brand)',
  },
  
  // Secondary color removal: Blue → Teal Primary
  // - All secondary-* → primary-*
  {
    from: /(bg|text|border|ring|shadow)-secondary-(\d+)/g,
    to: '$1-primary-$2',
    description: 'secondary-* → primary-* (remove blue)',
  },
  
  // Specific common patterns
  {
    from: /bg-blue-600/g,
    to: 'bg-primary-600',
    description: 'bg-blue-600 → bg-primary-600 (button default)',
  },
  {
    from: /hover:bg-blue-700/g,
    to: 'hover:bg-primary-700',
    description: 'hover:bg-blue-700 → hover:bg-primary-700',
  },
  {
    from: /text-blue-600/g,
    to: 'text-primary-600',
    description: 'text-blue-600 → text-primary-600',
  },
  {
    from: /border-blue-600/g,
    to: 'border-primary-600',
    description: 'border-blue-600 → border-primary-600',
  },
  
  // Emerald to Teal (where emerald was used as primary)
  {
    from: /bg-emerald-([56]00)/g,
    to: 'bg-primary-$1',
    description: 'bg-success-500/600 → bg-primary (fintech teal)',
  },
  
  // Shadow updates
  {
    from: /shadow-primary\b/g,
    to: 'shadow-primary',
    description: 'shadow-primary (teal brand shadow)',
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
 * Process a single file
 */
function processFile(filePath) {
  const originalContent = fs.readFileSync(filePath, 'utf8');
  let modifiedContent = originalContent;
  let fileModified = false;
  let fileReplacements = 0;

  // Apply all replacement rules
  REPLACEMENTS.forEach((rule) => {
    const matches = modifiedContent.match(rule.from);
    if (matches) {
      modifiedContent = modifiedContent.replace(rule.from, rule.to);
      const count = matches.length;
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
      const backupPath = `${filePath}.backup`;
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
  console.log('🎨 Design System Migration - Color Classes\n');
  
  if (!DRY_RUN && !EXECUTE) {
    console.error('❌ Error: Please specify --dry-run or --execute');
    console.log('\nUsage:');
    console.log('  node scripts/migrate-colors.js --dry-run  # Preview');
    console.log('  node scripts/migrate-colors.js --execute  # Apply');
    process.exit(1);
  }
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  } else {
    console.log('✏️  EXECUTE MODE - Files will be modified\n');
  }

  // Find all files
  const files = await glob(SCAN_DIRS, {
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  });

  console.log(`📁 Found ${files.length} files to scan\n`);

  // Process each file
  files.forEach(processFile);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION SUMMARY');
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
    console.log('\n✅ Migration complete!');
    console.log('💡 Backup files created with .backup extension');
    console.log('🔄 Run "npm run build" to verify changes');
  } else if (DRY_RUN && stats.filesModified > 0) {
    console.log('\n💡 Run with --execute to apply these changes');
  } else {
    console.log('\n✨ No changes needed!');
  }
}

// Run
main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
