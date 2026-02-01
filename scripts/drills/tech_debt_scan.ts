
import fs from 'fs';
import path from 'path';

// Configuration
const SCAN_DIR = process.cwd();
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build', 'public', '.gemini'];
const EXTENSIONS = ['ts', 'tsx', 'js', 'jsx', 'css', 'scss', 'md'];

interface DebtItem {
    file: string;
    line: number;
    type: 'TODO' | 'FIXME' | 'NOTE' | 'HACK';
    content: string;
    snippet: string;
}

const debts: DebtItem[] = [];

// Regex Patterns
const TODO_REGEX = /(\/\/|\/\*|<!--)\s*(TODO|FIXME|NOTE|HACK)\s*:?\s*(.*)/i;

function checkFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativePath = path.relative(SCAN_DIR, filePath);

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const match = line.match(TODO_REGEX);
        
        if (match) {
            const typeUpper = match[2].toUpperCase();
            if (['TODO', 'FIXME', 'NOTE', 'HACK'].includes(typeUpper)) {
                 debts.push({
                    file: relativePath,
                    line: lineNum,
                    type: typeUpper as any,
                    content: match[3].trim(),
                    snippet: line.trim().substring(0, 100)
                });
            }
        }
    });
}

function walkDir(dir: string) {
    // Avoid scanning hidden directories if starts with . (except app/components)
    // But SCAN_DIR root might have them.
    
    let files;
    try {
        files = fs.readdirSync(dir);
    } catch (e) {
        return;
    }

    for (const file of files) {
        if (IGNORE_DIRS.includes(file)) continue;
        
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else {
            if (EXTENSIONS.some(ext => file.endsWith(`.${ext}`))) {
                checkFile(fullPath);
            }
        }
    }
}

async function runScan() {
    console.log('🧹 Starting Technical Debt Scan (Audit 30)...');
    console.log('   Looking for TODO, FIXME, HACK comments in codebase.');
    
    walkDir(SCAN_DIR);

    console.log(`✅ Scanned codebase.`);
    
    // Group by Type
    const summary = {
        TODO: debts.filter(d => d.type === 'TODO').length,
        FIXME: debts.filter(d => d.type === 'FIXME').length,
        HACK: debts.filter(d => d.type === 'HACK').length,
        NOTE: debts.filter(d => d.type === 'NOTE').length,
        TOTAL: debts.length
    };
    
    const reportPath = path.join(SCAN_DIR, 'scripts/drills/audit_30_report.json');
    fs.writeFileSync(reportPath, JSON.stringify({ summary, debts }, null, 2));
    
    console.log(`\n📊 Audit 30 Summary:`);
    console.log(`   - TODOs:  ${summary.TODO}`);
    console.log(`   - FIXMEs: ${summary.FIXME}`);
    console.log(`   - HACKs:  ${summary.HACK}`);
    console.log(`   - Total:  ${summary.TOTAL}`);
    console.log(`   - Report saved to: ${reportPath}`);
}

runScan().catch(console.error);
