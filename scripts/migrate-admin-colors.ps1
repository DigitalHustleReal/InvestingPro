# Admin Theme Migration Script
# Bulk replace hardcoded colors with theme-aware classes

$filePath = "c:\Users\shivp\Desktop\InvestingPro_App\app\admin\page.tsx"

# Read the file
$content = Get-Content $filePath -Raw

# Background color replacements
$content = $content -replace 'bg-slate-950/95', 'bg-surface-darkest/95 dark:bg-surface-darkest/95'
$content = $content -replace 'bg-slate-950', 'bg-surface-darkest dark:bg-surface-darkest'
$content = $content -replace 'bg-slate-900/50', 'bg-surface-darker/50 dark:bg-surface-darker/50'
$content = $content -replace 'bg-slate-900', 'bg-surface-darker dark:bg-surface-darker'
$content = $content -replace 'bg-slate-800', 'bg-muted dark:bg-muted'
$content = $content -replace 'bg-white/\[0\.03\]', 'bg-card dark:bg-card'
$content = $content -replace 'bg-white/\[0\.02\]', 'bg-card/50 dark:bg-card/50'
$content = $content -replace 'bg-white/\[0\.05\]', 'bg-accent/5 dark:bg-accent/5'

# Text color replacements
$content = $content -replace '(?<!-)text-white(?!/)' , 'text-foreground dark:text-foreground'
$content = $content -replace 'text-slate-100', 'text-foreground/95 dark:text-foreground/95'
$content = $content -replace 'text-slate-200', 'text-foreground/90 dark:text-foreground/90'
$content = $content -replace 'text-slate-300', 'text-foreground/80 dark:text-foreground/80'
$content = $content -replace 'text-slate-400', 'text-muted-foreground dark:text-muted-foreground'
$content = $content -replace 'text-slate-500', 'text-muted-foreground/70 dark:text-muted-foreground/70'
$content = $content -replace 'text-slate-600', 'text-muted-foreground/50 dark:text-muted-foreground/50'

# Border color replacements
$content = $content -replace 'border-white/10', 'border-border dark:border-border'
$content = $content -replace 'border-white/5', 'border-border/50 dark:border-border/50'
$content = $content -replace 'border-white/20', 'border-border/80 dark:border-border/80'

# Write back to file
Set-Content $filePath $content -NoNewline

Write-Host "✅ Migration complete for admin/page.tsx"
Write-Host "Total replacements made - check git diff for details"
