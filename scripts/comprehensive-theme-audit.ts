/**
 * Comprehensive Theme & UI Audit Script
 * Scans all pages, components, widgets, calculators for:
 * - Hardcoded colors without dark mode variants
 * - Missing dark theme support
 * - Text messaging issues
 * - Stock market platform styling
 */

import * as fs from 'fs';
import * as path from 'path';

interface AuditIssue {
    file: string;
    line: number;
    issue: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: 'dark-theme' | 'hardcoded-color' | 'text-messaging' | 'styling';
    suggestion: string;
}

const issues: AuditIssue[] = [];

// Patterns to check for
const patterns = {
    // Hardcoded backgrounds without dark variants
    bgWhite: {
        pattern: /bg-white(?!\s+dark:bg-)/g,
        issue: 'bg-white without dark mode variant',
        severity: 'high' as const,
        category: 'dark-theme' as const
    },
    bgSlate50: {
        pattern: /bg-slate-50(?!\s+dark:bg-)/g,
        issue: 'bg-slate-50 without dark mode variant',
        severity: 'high' as const,
        category: 'dark-theme' as const
    },
    // Hardcoded text colors
    textSlate900: {
        pattern: /text-slate-900(?!\s+dark:text-)/g,
        issue: 'text-slate-900 without dark mode variant',
        severity: 'high' as const,
        category: 'dark-theme' as const
    },
    textBlack: {
        pattern: /text-black(?!\s+dark:text-)/g,
        issue: 'text-black without dark mode variant',
        severity: 'critical' as const,
        category: 'dark-theme' as const
    },
    // Hardcoded borders
    borderSlate200: {
        pattern: /border-slate-200(?!\s+dark:border-)/g,
        issue: 'border-slate-200 without dark mode variant',
        severity: 'medium' as const,
        category: 'dark-theme' as const
    },
    borderSlate100: {
        pattern: /border-slate-100(?!\s+dark:border-)/g,
        issue: 'border-slate-100 without dark mode variant',
        severity: 'medium' as const,
        category: 'dark-theme' as const
    },
    // Hardcoded hex colors (should use theme colors)
    hexColors: {
        pattern: /#[0-9a-fA-F]{3,6}/g,
        issue: 'Hardcoded hex color (should use theme colors)',
        severity: 'medium' as const,
        category: 'hardcoded-color' as const
    },
    // Stock market platform text patterns
    stockMarketText: {
        pattern: /\b(live|real-time|ticker|market|trading|portfolio|watchlist)\b/gi,
        issue: 'Stock market platform terminology',
        severity: 'low' as const,
        category: 'text-messaging' as const
    }
};

function scanFile(filePath: string, relativePath: string) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            // Check each pattern
            Object.entries(patterns).forEach(([key, config]) => {
                const matches = line.match(config.pattern);
                if (matches && !line.includes('// AUDIT: OK') && !line.includes('// IGNORE')) {
                    // Skip if dark mode variant exists on same line
                    if (config.category === 'dark-theme' && line.includes('dark:')) {
                        return;
                    }
                    
                    issues.push({
                        file: relativePath,
                        line: index + 1,
                        issue: config.issue,
                        severity: config.severity,
                        category: config.category,
                        suggestion: getSuggestion(key, line)
                    });
                }
            });
        });
    } catch (error) {
        console.error(`Error scanning ${filePath}:`, error);
    }
}

function getSuggestion(patternKey: string, line: string): string {
    const suggestions: Record<string, string> = {
        bgWhite: 'Add dark:bg-slate-900 or dark:bg-slate-800',
        bgSlate50: 'Add dark:bg-slate-900/50 or dark:bg-slate-800/50',
        textSlate900: 'Add dark:text-white or dark:text-slate-100',
        textBlack: 'Add dark:text-white (critical for dark mode)',
        borderSlate200: 'Add dark:border-slate-700 or dark:border-slate-800',
        borderSlate100: 'Add dark:border-slate-800',
        hexColors: 'Replace with theme color (e.g., primary-500, slate-900)',
        stockMarketText: 'Review if terminology matches platform style'
    };
    return suggestions[patternKey] || 'Review and add dark mode variant';
}

function scanDirectory(dir: string, baseDir: string = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(baseDir || process.cwd(), fullPath);

        // Skip node_modules, .next, etc.
        if (entry.name.startsWith('.') || 
            entry.name === 'node_modules' || 
            entry.name === '.next' ||
            entry.name === 'dist' ||
            entry.name === 'build') {
            return;
        }

        if (entry.isDirectory()) {
            scanDirectory(fullPath, baseDir || process.cwd());
        } else if (entry.isFile() && 
                   (entry.name.endsWith('.tsx') || 
                    entry.name.endsWith('.ts') || 
                    entry.name.endsWith('.jsx') || 
                    entry.name.endsWith('.js'))) {
            scanFile(fullPath, relativePath);
        }
    });
}

// Main execution
console.log('🔍 Starting Comprehensive Theme Audit...\n');

const directoriesToScan = [
    path.join(process.cwd(), 'app'),
    path.join(process.cwd(), 'components'),
    path.join(process.cwd(), 'lib')
];

directoriesToScan.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`Scanning ${dir}...`);
        scanDirectory(dir);
    }
});

// Generate report
console.log(`\n✅ Audit complete. Found ${issues.length} issues.\n`);

// Group by category
const byCategory = issues.reduce((acc, issue) => {
    if (!acc[issue.category]) acc[issue.category] = [];
    acc[issue.category].push(issue);
    return acc;
}, {} as Record<string, AuditIssue[]>);

// Group by severity
const bySeverity = issues.reduce((acc, issue) => {
    if (!acc[issue.severity]) acc[issue.severity] = [];
    acc[issue.severity].push(issue);
    return acc;
}, {} as Record<string, AuditIssue[]>);

// Generate markdown report
const report = `# 🔍 Comprehensive Theme & UI Audit Report
**Generated:** ${new Date().toISOString()}
**Total Issues Found:** ${issues.length}

## 📊 Summary by Severity

- **Critical:** ${bySeverity.critical?.length || 0} issues
- **High:** ${bySeverity.high?.length || 0} issues
- **Medium:** ${bySeverity.medium?.length || 0} issues
- **Low:** ${bySeverity.low?.length || 0} issues

## 📊 Summary by Category

- **Dark Theme:** ${byCategory['dark-theme']?.length || 0} issues
- **Hardcoded Colors:** ${byCategory['hardcoded-color']?.length || 0} issues
- **Text Messaging:** ${byCategory['text-messaging']?.length || 0} issues
- **Styling:** ${byCategory['styling']?.length || 0} issues

---

## 🚨 Critical Issues

${(bySeverity.critical || []).map(issue => `
### \`${issue.file}:${issue.line}\`
- **Issue:** ${issue.issue}
- **Suggestion:** ${issue.suggestion}
- **Code:** \`${getLinePreview(issue.file, issue.line)}\`
`).join('\n')}

---

## ⚠️ High Priority Issues

${(bySeverity.high || []).slice(0, 50).map(issue => `
### \`${issue.file}:${issue.line}\`
- **Issue:** ${issue.issue}
- **Suggestion:** ${issue.suggestion}
`).join('\n')}

${bySeverity.high && bySeverity.high.length > 50 ? `\n*... and ${bySeverity.high.length - 50} more high priority issues*\n` : ''}

---

## 📋 All Issues by File

${Object.entries(
    issues.reduce((acc, issue) => {
        if (!acc[issue.file]) acc[issue.file] = [];
        acc[issue.file].push(issue);
        return acc;
    }, {} as Record<string, AuditIssue[]>)
).map(([file, fileIssues]) => `
### ${file}
**Total Issues:** ${fileIssues.length}

${fileIssues.map(issue => `- **Line ${issue.line}:** ${issue.issue} (${issue.severity}) - ${issue.suggestion}`).join('\n')}
`).join('\n')}

---

## 🎯 Recommendations

1. **Fix Critical Issues First** - These break dark mode completely
2. **Fix High Priority** - These affect user experience significantly
3. **Systematic Fix** - Fix by file to maintain consistency
4. **Test After Each Fix** - Verify dark mode works correctly

---

**Next Steps:** Review this report and fix issues systematically.
`;

function getLinePreview(filePath: string, lineNum: number): string {
    try {
        const fullPath = path.join(process.cwd(), filePath);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        return lines[lineNum - 1]?.trim() || 'N/A';
    } catch {
        return 'N/A';
    }
}

// Write report
fs.writeFileSync(
    path.join(process.cwd(), 'COMPREHENSIVE_THEME_AUDIT_REPORT.md'),
    report
);

console.log('📄 Report saved to COMPREHENSIVE_THEME_AUDIT_REPORT.md');
console.log('\n📊 Quick Stats:');
console.log(`   Critical: ${bySeverity.critical?.length || 0}`);
console.log(`   High: ${bySeverity.high?.length || 0}`);
console.log(`   Medium: ${bySeverity.medium?.length || 0}`);
console.log(`   Low: ${bySeverity.low?.length || 0}`);
