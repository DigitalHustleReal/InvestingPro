
import fs from 'fs';
import path from 'path';

// Configuration
const SCAN_DIR = process.cwd();
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build', 'public'];
const EXTENSIONS = ['tsx', 'jsx', 'css'];

interface Issue {
    file: string;
    line: number;
    issue: string;
    severity: 'ERROR' | 'WARN';
    snippet: string;
}

const issues: Issue[] = [];

// Regex Patterns
const HARDCODED_WIDTH = /width:\s*[4-9][0-9][0-9]px|w-\[[4-9][0-9][0-9]px\]/; // Widths > 400px hardcoded
const FIXED_WIDTH_CONTAINER = /(min-w|width|w)-(\[.*px\]|[0-9]+px)/; // Any fixed width check (broad)
const VIEWPORT_META = /<meta\s+name=["']viewport["']\s+content=["']([^"']+)["']/;

function checkFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativePath = path.relative(SCAN_DIR, filePath);

    // 1. Check Global Layout for Viewport (Only once)
    if (relativePath.includes('layout.tsx') || relativePath.includes('index.html')) {
        const matches = content.match(VIEWPORT_META);
        if (matches) {
            if (!matches[1].includes('width=device-width') || !matches[1].includes('initial-scale=1')) {
                 issues.push({
                    file: relativePath,
                    line: 1,
                    issue: 'Viewport meta tag might be malformed',
                    severity: 'WARN',
                    snippet: matches[0]
                });
            }
        }
    }

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmed = line.trim();

        if (trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

        // 2. Hardcoded Large Widths (Bad for Mobile)
        // Check for w-[500px] or width: 600px
        const widthMatch = trimmed.match(HARDCODED_WIDTH);
        if (widthMatch) {
             // Ignore if inside a media query (hard to detect statically single line, but usually Tailwind handles it)
             // However, w-[600px] without md: prefix is suspicious
             if (!trimmed.includes('md:') && !trimmed.includes('lg:') && !trimmed.includes('xl:')) {
                 issues.push({
                    file: relativePath,
                    line: lineNum,
                    issue: 'Hardcoded large width (>400px) without responsive prefix',
                    severity: 'WARN',
                    snippet: trimmed.substring(0, 100)
                });
             }
        }

        // 3. Overflow Hidden on Body/HTML (Can break scroll)
        if (filePath.endsWith('globals.css')) {
            if (trimmed.includes('overflow: hidden') && (trimmed.includes('html') || trimmed.includes('body'))) {
                 issues.push({
                    file: relativePath,
                    line: lineNum,
                    issue: 'Global overflow:hidden on body/html can break mobile scrolling',
                    severity: 'WARN',
                    snippet: trimmed.substring(0, 100)
                });
            }
        }
    });
}

function walkDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) walkDir(fullPath);
        } else {
            if (EXTENSIONS.some(ext => file.endsWith(`.${ext}`))) {
                checkFile(fullPath);
            }
        }
    }
}

async function runScan() {
    console.log('📱 Starting Responsive Design Static Scan (Audit 24)...');
    
    walkDir(path.join(SCAN_DIR, 'app'));
    walkDir(path.join(SCAN_DIR, 'components'));
    // globals.css
    if (fs.existsSync(path.join(SCAN_DIR, 'app/globals.css'))) {
        checkFile(path.join(SCAN_DIR, 'app/globals.css'));
    }

    console.log(`✅ Scanned codebase for responsive patterns.`);
    
    const reportPath = path.join(SCAN_DIR, 'scripts/drills/audit_24_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(issues, null, 2));
    
    console.log(`\n📊 Audit 24 Summary:`);
    console.log(`   - Potential Issues: ${issues.length}`);
    console.log(`   - Report saved to: ${reportPath}`);
}

runScan().catch(console.error);
