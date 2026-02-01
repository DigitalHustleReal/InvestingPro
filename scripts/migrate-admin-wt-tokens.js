/**
 * One-off: replace slate/primary/semantic tokens with wt-* in components/admin
 * Run: node scripts/migrate-admin-wt-tokens.js
 */
const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '..', 'components', 'admin');

const replacements = [
  // Slate text (with dark:)
  [/\btext-slate-900\s+dark:text-white\b/g, 'text-wt-text'],
  [/\btext-slate-600\s+dark:text-slate-400\b/g, 'text-wt-text-muted'],
  [/\btext-slate-600\s+dark:text-slate-400\s+mt-1\b/g, 'text-wt-text-muted mt-1'],
  [/\bhover:text-slate-900\s+dark:hover:text-white\b/g, 'hover:text-wt-text'],
  [/\btext-slate-800\s+dark:text-slate-200\b/g, 'text-wt-text'],
  [/\btext-slate-700\s+dark:text-slate-300\b/g, 'text-wt-text'],
  [/\btext-slate-500\b/g, 'text-wt-text-muted'],
  [/\btext-slate-600\b/g, 'text-wt-text-muted'],
  [/\btext-slate-400\b/g, 'text-wt-text-dim'],
  [/\btext-slate-900\b/g, 'text-wt-text'],
  // Slate bg
  [/\bbg-slate-50\b/g, 'bg-wt-surface-hover'],
  [/\bbg-slate-100\b/g, 'bg-wt-card'],
  [/\bbg-slate-100\s+dark:bg-slate-900\b/g, 'bg-wt-card'],
  [/\bdark:bg-slate-900\b/g, 'bg-wt-card'],
  [/\bdark:bg-slate-800\b/g, 'bg-wt-surface'],
  [/\bbg-slate-500\/10\b/g, 'bg-wt-card'],
  [/\bbg-slate-500\/20\b/g, 'bg-wt-surface-hover'],
  // Slate border
  [/\bborder-slate-200\b/g, 'border-wt-border'],
  [/\bborder-slate-200\s+dark:border-slate-800\b/g, 'border-wt-border'],
  [/\bdark:border-slate-800\b/g, 'border-wt-border'],
  [/\bborder-slate-300\b/g, 'border-wt-border'],
  [/\bborder-slate-700\b/g, 'border-wt-border'],
  [/\bborder-slate-600\b/g, 'border-wt-border'],
  // Hover
  [/\bhover:bg-slate-50\b/g, 'hover:bg-wt-surface-hover'],
  [/\bdark:hover:bg-slate-900\b/g, 'hover:bg-wt-surface-hover'],
  [/\bhover:bg-slate-50\s+dark:hover:bg-slate-900\b/g, 'hover:bg-wt-surface-hover'],
  [/\bhover:border-primary-300\b/g, 'hover:border-wt-gold'],
  // Card / semantic
  [/\bbg-card\/50\b/g, 'bg-wt-surface/50'],
  [/\bbg-card\b/g, 'bg-wt-surface'],
  [/\bborder-border\/50\b/g, 'border-wt-border/50'],
  [/\bborder-border\b/g, 'border-wt-border'],
  [/\btext-foreground\b/g, 'text-wt-text'],
  [/\btext-muted-foreground\b/g, 'text-wt-text-muted'],
  [/\bbg-muted\/50\b/g, 'bg-wt-card'],
  [/\bbg-muted\/10\b/g, 'bg-wt-surface-hover'],
  [/\bbg-muted\/20\b/g, 'bg-wt-surface-hover'],
  [/\bhover:bg-muted\/20\b/g, 'hover:bg-wt-surface-hover'],
  [/\bhover:bg-muted\/30\b/g, 'hover:bg-wt-surface-hover'],
  [/\bbg-background\b/g, 'bg-wt-surface'],
  // Primary
  [/\bbg-primary-500\/10\b/g, 'bg-wt-gold-subtle'],
  [/\bbg-primary-600\b/g, 'bg-wt-gold'],
  [/\bhover:bg-primary-700\b/g, 'hover:bg-wt-gold-hover'],
  [/\bhover:bg-primary-600\b/g, 'hover:bg-wt-gold-hover'],
  [/\btext-primary-600\b/g, 'text-wt-gold'],
  [/\btext-primary-400\b/g, 'text-wt-gold'],
  [/\bborder-primary-500\b/g, 'border-wt-gold'],
  [/\bborder-primary-500\/30\b/g, 'border-wt-gold/30'],
  [/\bfocus:ring-primary-500\b/g, 'focus:ring-wt-gold'],
  [/\bfocus:border-primary-500\b/g, 'focus:border-wt-gold'],
  [/\bborder-primary-500\b/g, 'border-wt-gold'],
  [/\bbg-primary-50\b/g, 'bg-wt-gold-subtle'],
  [/\bdark:bg-primary-900\/20\b/g, 'bg-wt-gold-subtle'],
  [/\bborder-primary-500\s+bg-primary-50\b/g, 'border-wt-gold bg-wt-gold-subtle'],
  [/\bborder-primary-300\b/g, 'border-wt-border-light'],
  // Success
  [/\bbg-success-500\/10\b/g, 'bg-wt-green-subtle'],
  [/\btext-success-600\b/g, 'text-wt-green'],
  [/\btext-success-700\b/g, 'text-wt-green'],
  // Accent
  [/\bbg-accent-500\/10\b/g, 'bg-wt-gold-subtle'],
  [/\btext-accent-600\b/g, 'text-wt-gold'],
  // Danger
  [/\bbg-danger-500\b/g, 'bg-wt-danger'],
  [/\bhover:bg-danger-600\b/g, 'hover:bg-wt-danger/90'],
  [/\btext-danger-400\b/g, 'text-wt-danger'],
  [/\bbg-danger-500\/10\b/g, 'bg-wt-danger-subtle'],
  [/\bbg-danger-500\/20\b/g, 'bg-wt-danger-subtle'],
  [/\bhover:bg-danger-500\/20\b/g, 'hover:bg-wt-danger/20'],
  [/\bhover:bg-danger-500\/30\b/g, 'hover:bg-wt-danger/20'],
  // Secondary
  [/\bbg-secondary-600\b/g, 'bg-wt-nav'],
  [/\bhover:bg-secondary-700\b/g, 'hover:bg-wt-nav-light'],
  [/\bbg-secondary-500\/20\b/g, 'bg-wt-gold-subtle'],
  [/\bhover:bg-secondary-500\/30\b/g, 'hover:bg-wt-gold-subtle'],
  [/\btext-secondary-400\b/g, 'text-wt-gold'],
  // White/dark overlays (admin is light) – do NOT replace in AdminTopBar (nav uses white/10)
  [/\bbg-white\/5\b/g, 'bg-wt-surface-hover'],
  [/\bhover:bg-white\/20\b/g, 'hover:bg-wt-surface-hover'],
  // More primary/success/slate variants
  [/\bborder-primary-600\b/g, 'border-wt-gold'],
  [/\bborder-primary-200\b/g, 'border-wt-border-light'],
  [/\bbg-primary-100\b/g, 'bg-wt-gold-subtle'],
  [/\bbg-primary-500\/20\b/g, 'bg-wt-gold-subtle'],
  [/\btext-primary-700\b/g, 'text-wt-gold'],
  [/\btext-primary-900\b/g, 'text-wt-text'],
  [/\btext-primary-500\b/g, 'text-wt-gold'],
  [/\bbg-secondary-50\b/g, 'bg-wt-gold-subtle'],
  [/\bbg-success-500\/20\b/g, 'bg-wt-green-subtle'],
  [/\btext-success-400\b/g, 'text-wt-green'],
  [/\bbg-success-100\b/g, 'bg-wt-green-subtle'],
  [/\btext-success-800\b/g, 'text-wt-green'],
  [/\bborder-success-200\b/g, 'border-wt-border-light'],
  [/\bbg-success-500\b/g, 'bg-wt-green'],
  [/\bbg-success-50\b/g, 'bg-wt-green-subtle'],
  [/\btext-slate-700\b/g, 'text-wt-text'],
  [/\bdata-\[state=active\]:bg-slate-700\b/g, 'data-[state=active]:bg-wt-gold-subtle'],
  [/\bdark:data-\[state=active\]:bg-slate-700\b/g, ''],
  [/\bdark:border-primary-800\b/g, 'border-wt-border'],
  [/\bdark:border-primary-400\b/g, 'border-wt-gold'],
  [/\bdark:text-primary-100\b/g, 'text-wt-text'],
  [/\bdark:text-primary-300\b/g, 'text-wt-text-muted'],
  [/\bhover:text-primary-900\b/g, 'hover:text-wt-text'],
  [/\bhover:bg-success-50\b/g, 'hover:bg-wt-green-subtle'],
  [/\bhover:text-success-700\b/g, 'hover:text-wt-green'],
  [/\bborder-primary-200\s+dark:border-primary-800\b/g, 'border-wt-border'],
  [/\btext-primary-900\s+dark:text-primary-100\b/g, 'text-wt-text'],
  [/\btext-primary-700\s+dark:text-primary-300\b/g, 'text-wt-text-muted'],
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat?.isDirectory()) results = results.concat(walk(full));
    else if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(full);
  }
  return results;
}

const files = walk(adminDir);
let changed = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let next = content;
  for (const [re, replacement] of replacements) {
    next = next.replace(re, replacement);
  }
  if (next !== content) {
    fs.writeFileSync(file, next, 'utf8');
    changed++;
    console.log('Updated:', path.relative(adminDir, file));
  }
}
console.log('Done. Files updated:', changed);
