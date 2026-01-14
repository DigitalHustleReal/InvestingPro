/**
 * Bundle Analyzer Script
 * 
 * Analyzes bundle sizes and reports violations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BUDGETS = {
    initialJS: 200 * 1024, // 200KB
    totalJS: 500 * 1024, // 500KB
    initialCSS: 50 * 1024, // 50KB
};

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function analyzeBuildOutput() {
    const buildDir = path.join(process.cwd(), '.next');
    
    if (!fs.existsSync(buildDir)) {
        console.error('❌ Build directory not found. Run "npm run build" first.');
        process.exit(1);
    }

    const staticDir = path.join(buildDir, 'static');
    if (!fs.existsSync(staticDir)) {
        console.error('❌ Static directory not found.');
        process.exit(1);
    }

    console.log('\n📊 Bundle Size Analysis\n');
    console.log('='.repeat(60));

    // Analyze JavaScript bundles
    const jsFiles = [];
    function walkDir(dir, fileList = []) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walkDir(filePath, fileList);
            } else if (file.endsWith('.js')) {
                const size = stat.size;
                fileList.push({ path: filePath, size, name: file });
            }
        });
        return fileList;
    }

    const allJsFiles = walkDir(staticDir);
    
    // Group by chunk
    const chunks = {};
    allJsFiles.forEach(file => {
        const match = file.name.match(/^([^-]+)/);
        const chunkName = match ? match[1] : 'unknown';
        if (!chunks[chunkName]) {
            chunks[chunkName] = { files: [], totalSize: 0 };
        }
        chunks[chunkName].files.push(file);
        chunks[chunkName].totalSize += file.size;
    });

    // Sort chunks by size
    const sortedChunks = Object.entries(chunks)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.totalSize - a.totalSize);

    console.log('\n📦 JavaScript Bundles:\n');
    let totalJSSize = 0;
    sortedChunks.forEach(chunk => {
        totalJSSize += chunk.totalSize;
        const sizeStr = formatBytes(chunk.totalSize);
        const status = chunk.totalSize > BUDGETS.initialJS ? '⚠️ ' : '✅';
        console.log(`${status} ${chunk.name.padEnd(30)} ${sizeStr.padStart(10)} (${chunk.files.length} files)`);
    });

    console.log('\n' + '-'.repeat(60));
    console.log(`Total JS Size: ${formatBytes(totalJSSize)}`);
    
    // Check budgets
    console.log('\n🎯 Budget Compliance:\n');
    const violations = [];
    
    if (totalJSSize > BUDGETS.totalJS) {
        violations.push({
            name: 'Total JavaScript Bundle',
            actual: totalJSSize,
            budget: BUDGETS.totalJS,
        });
        console.log(`❌ Total JS exceeds budget: ${formatBytes(totalJSSize)} > ${formatBytes(BUDGETS.totalJS)}`);
    } else {
        console.log(`✅ Total JS within budget: ${formatBytes(totalJSSize)} <= ${formatBytes(BUDGETS.totalJS)}`);
    }

    // Check initial bundle (main chunk)
    const mainChunk = sortedChunks.find(c => c.name === 'main' || c.name.includes('main'));
    if (mainChunk) {
        if (mainChunk.totalSize > BUDGETS.initialJS) {
            violations.push({
                name: 'Initial JavaScript Bundle',
                actual: mainChunk.totalSize,
                budget: BUDGETS.initialJS,
            });
            console.log(`❌ Initial JS exceeds budget: ${formatBytes(mainChunk.totalSize)} > ${formatBytes(BUDGETS.initialJS)}`);
        } else {
            console.log(`✅ Initial JS within budget: ${formatBytes(mainChunk.totalSize)} <= ${formatBytes(BUDGETS.initialJS)}`);
        }
    }

    // Analyze CSS
    const cssFiles = [];
    function walkDirCSS(dir, fileList = []) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walkDirCSS(filePath, fileList);
            } else if (file.endsWith('.css')) {
                const size = stat.size;
                fileList.push({ path: filePath, size, name: file });
            }
        });
        return fileList;
    }

    const allCssFiles = walkDirCSS(staticDir);
    const totalCSSSize = allCssFiles.reduce((sum, file) => sum + file.size, 0);

    console.log(`\n📄 CSS Size: ${formatBytes(totalCSSSize)}`);
    if (totalCSSSize > BUDGETS.initialCSS) {
        violations.push({
            name: 'Initial CSS Bundle',
            actual: totalCSSSize,
            budget: BUDGETS.initialCSS,
        });
        console.log(`❌ CSS exceeds budget: ${formatBytes(totalCSSSize)} > ${formatBytes(BUDGETS.initialCSS)}`);
    } else {
        console.log(`✅ CSS within budget: ${formatBytes(totalCSSSize)} <= ${formatBytes(BUDGETS.initialCSS)}`);
    }

    console.log('\n' + '='.repeat(60));

    if (violations.length > 0) {
        console.log('\n⚠️  Budget Violations Detected:\n');
        violations.forEach(v => {
            console.log(`  • ${v.name}: ${formatBytes(v.actual)} > ${formatBytes(v.budget)}`);
        });
        console.log('\n💡 Recommendations:');
        console.log('  • Enable code splitting for large components');
        console.log('  • Lazy load non-critical components');
        console.log('  • Remove unused dependencies');
        console.log('  • Use dynamic imports for heavy libraries');
        process.exit(1);
    } else {
        console.log('\n✅ All budgets met!\n');
        process.exit(0);
    }
}

// Run analysis
try {
    analyzeBuildOutput();
} catch (error) {
    console.error('Error analyzing bundle:', error);
    process.exit(1);
}
