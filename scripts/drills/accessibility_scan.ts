
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Configuration
const SCAN_DIR = process.cwd();
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'dist', 'build'];
const EXTENSIONS = ['tsx', 'jsx'];

interface Issue {
    file: string;
    line: number;
    element: string;
    issue: string;
    severity: 'ERROR' | 'WARN';
    snippet: string;
}

const issues: Issue[] = [];

function checkFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let inComment = false;

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmed = line.trim();

        // Simple comment handling (multiline not perfectly handled but good enough for static scan)
        if (trimmed.startsWith('/*')) inComment = true;
        if (trimmed.endsWith('*/')) inComment = false;
        if (inComment || trimmed.startsWith('//')) return;

        // 1. Image Check
        // Matches <img ... > or <Image ... >
        if (trimmed.match(/<(img|Image)\s+[^>]*>/)) {
            // Check for alt prop
            if (!trimmed.match(/alt=['"`\{]/) && !trimmed.match(/alt={.*}/)) {
                issues.push({
                    file: path.relative(SCAN_DIR, filePath),
                    line: lineNum,
                    element: 'Image',
                    issue: 'Missing alt attribute',
                    severity: 'ERROR',
                    snippet: trimmed.substring(0, 100)
                });
            } else if (trimmed.match(/alt=['"]\s*['"]/)) {
                 issues.push({
                    file: path.relative(SCAN_DIR, filePath),
                    line: lineNum,
                    element: 'Image',
                    issue: 'Empty alt attribute (use null/empty only if decorative)',
                    severity: 'WARN',
                    snippet: trimmed.substring(0, 100)
                });
            }
        }

        // 2. Button Check (Empty buttons)
        // This is tricky with regex, looking for self-closing <button /> without aria-label
        if (trimmed.match(/<button[^>]*\/>/)) {
            if (!trimmed.match(/aria-label=['"`\{]/) && !trimmed.match(/title=['"`\{]/)) {
                issues.push({
                    file: path.relative(SCAN_DIR, filePath),
                    line: lineNum,
                    element: 'Button',
                    issue: 'Icon-only button missing aria-label',
                    severity: 'ERROR',
                    snippet: trimmed.substring(0, 100)
                });
            }
        }

        // 3. Input Check (Missing Label)
        // Matches <input ... >
        if (trimmed.match(/<input\s+[^>]*>/)) {
             const hasId = trimmed.match(/id=['"`\{]/);
             const hasAriaLabel = trimmed.match(/aria-label=['"`\{]/);
             const hasAriaLabelledBy = trimmed.match(/aria-labelledby=['"`\{]/);
             
             if (!hasId && !hasAriaLabel && !hasAriaLabelledBy && !trimmed.includes('hidden')) {
                  issues.push({
                    file: path.relative(SCAN_DIR, filePath),
                    line: lineNum,
                    element: 'Input',
                    issue: 'Input field missing explicit label (id/aria-label)',
                    severity: 'WARN',
                    snippet: trimmed.substring(0, 100)
                });
             }
        }

        // 4. Link Check (Generic Text)
        if (trimmed.match(/<a[^>]*>(click here|read more|here)<\/a>/i)) {
             issues.push({
                file: path.relative(SCAN_DIR, filePath),
                line: lineNum,
                element: 'Link',
                issue: 'Generic link text (bad for screen readers)',
                severity: 'WARN',
                snippet: trimmed.substring(0, 100)
            });
        }
    });

}

async function runScan() {
    console.log('♿ Starting Accessibility (A11y) Static Scan...');
    
    // Using glob pattern manually since I can't import 'glob' easily in this env without npm install
    // I'll rely on a recursive directory walk helper since I don't want to depend on external glob package if not installed
    
    // Actually, let's use a simpler recursive walk
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

    walkDir(path.join(SCAN_DIR, 'app'));
    walkDir(path.join(SCAN_DIR, 'components'));

    console.log(`✅ Scanned all components.`);
    
    const reportPath = path.join(SCAN_DIR, 'scripts/drills/audit_06_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(issues, null, 2));
    
    // Summary
    const errors = issues.filter(i => i.severity === 'ERROR').length;
    const warns = issues.filter(i => i.severity === 'WARN').length;
    
    console.log(`\n📊 Audit 6 Summary:`);
    console.log(`   - Errors: ${errors}`);
    console.log(`   - Warnings: ${warns}`);
    console.log(`   - Total Issues: ${issues.length}`);
    console.log(`   - Report saved to: ${reportPath}`);

    if (errors > 0) process.exit(1);
}

runScan().catch(console.error);
