#!/usr/bin/env node

/**
 * Bundle Size Check Script
 * 
 * Checks if bundle sizes exceed limits and fails CI if they do
 */

const fs = require('fs');
const path = require('path');

// Bundle size limits (in bytes)
const LIMITS = {
    firstLoadJS: 200 * 1024, // 200 KB
    totalJS: 500 * 1024, // 500 KB
    totalCSS: 50 * 1024, // 50 KB
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (error) {
        return 0;
    }
}

function findLargestFiles(directory, extension = '.js') {
    const files = [];
    
    function walkDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                walkDir(fullPath);
            } else if (entry.isFile() && entry.name.endsWith(extension)) {
                const size = getFileSize(fullPath);
                files.push({ path: fullPath, size });
            }
        }
    }
    
    walkDir(directory);
    return files.sort((a, b) => b.size - a.size);
}

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function checkBundleSize() {
    log('\n📦 Checking Bundle Sizes...\n', colors.blue);

    const nextDir = path.join(process.cwd(), '.next');
    
    if (!fs.existsSync(nextDir)) {
        log('❌ .next directory not found. Run "npm run build" first.', colors.red);
        process.exit(1);
    }

    const staticDir = path.join(nextDir, 'static');
    
    if (!fs.existsSync(staticDir)) {
        log('⚠️  .next/static directory not found.', colors.yellow);
        return;
    }

    // Check JS files
    const chunksDir = path.join(staticDir, 'chunks');
    if (fs.existsSync(chunksDir)) {
        const jsFiles = findLargestFiles(chunksDir, '.js');
        
        let totalJS = 0;
        let firstLoadJS = 0;
        
        log('📊 JavaScript Bundle Sizes:', colors.blue);
        log('─'.repeat(60));
        
        for (const file of jsFiles.slice(0, 10)) {
            totalJS += file.size;
            
            // First load JS is typically framework, main, webpack chunks
            if (file.path.includes('framework') || 
                file.path.includes('main') || 
                file.path.includes('webpack')) {
                firstLoadJS += file.size;
            }
            
            log(`  ${path.basename(file.path)}: ${formatSize(file.size)}`, colors.reset);
        }
        
        log('─'.repeat(60));
        log(`  Total JS: ${formatSize(totalJS)}`, totalJS > LIMITS.totalJS ? colors.red : colors.green);
        log(`  First Load JS: ${formatSize(firstLoadJS)}`, firstLoadJS > LIMITS.firstLoadJS ? colors.red : colors.green);
        
        if (firstLoadJS > LIMITS.firstLoadJS) {
            log(`\n❌ First Load JS exceeds limit of ${formatSize(LIMITS.firstLoadJS)}`, colors.red);
            process.exit(1);
        }
        
        if (totalJS > LIMITS.totalJS) {
            log(`\n❌ Total JS exceeds limit of ${formatSize(LIMITS.totalJS)}`, colors.red);
            process.exit(1);
        }
    }

    // Check CSS files
    const cssDir = path.join(staticDir, 'css');
    if (fs.existsSync(cssDir)) {
        const cssFiles = findLargestFiles(cssDir, '.css');
        
        let totalCSS = 0;
        
        log('\n📊 CSS Bundle Sizes:', colors.blue);
        log('─'.repeat(60));
        
        for (const file of cssFiles) {
            totalCSS += file.size;
            log(`  ${path.basename(file.path)}: ${formatSize(file.size)}`, colors.reset);
        }
        
        log('─'.repeat(60));
        log(`  Total CSS: ${formatSize(totalCSS)}`, totalCSS > LIMITS.totalCSS ? colors.red : colors.green);
        
        if (totalCSS > LIMITS.totalCSS) {
            log(`\n❌ Total CSS exceeds limit of ${formatSize(LIMITS.totalCSS)}`, colors.red);
            process.exit(1);
        }
    }

    log('\n✅ All bundle sizes within limits!', colors.green);
    log(`\n💡 For detailed analysis, run: ANALYZE=true npm run build`, colors.blue);
}

// Run check
checkBundleSize();
