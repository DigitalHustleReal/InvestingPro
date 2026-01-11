# Calculator SEO Batch Update Script
# Updates year from 2024 to 2026 and standardizes colors (teal -> primary)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Calculator SEO Batch Update Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define calculator directories
$calculatorDirs = @(
    "emi",
    "tax",
    "fd",
    "swp",
    "gst",
    "retirement",
    "ppf",
    "nps",
    "lumpsum",
    "goal-planning",
    "home-loan-vs-sip",
    "inflation-adjusted-returns"
)

$baseDir = "c:\Users\shivp\Desktop\InvestingPro_App\app\calculators"
$updatedCount = 0
$skippedCount = 0
$errorCount = 0

# Color replacements
$colorReplacements = @{
    'text-teal-600' = 'text-primary-600'
    'text-teal-700' = 'text-primary-700'
    'text-teal-500' = 'text-primary-500'
    'text-teal-400' = 'text-primary-400'
    'bg-teal-50' = 'bg-primary-50'
    'bg-teal-100' = 'bg-primary-100'
    'bg-teal-600' = 'bg-primary-600'
    'bg-teal-700' = 'bg-primary-700'
    'border-teal-200' = 'border-primary-200'
    'border-teal-300' = 'border-primary-300'
    'border-teal-500' = 'border-primary-500'
    'from-teal-50' = 'from-primary-50'
    'to-teal-50' = 'to-primary-50'
    'from-teal-600' = 'from-primary-600'
    'to-blue-600' = 'to-secondary-600'
    'hover:text-teal-700' = 'hover:text-primary-700'
    'hover:bg-teal-50' = 'hover:bg-primary-50'
    'hover:border-teal-500' = 'hover:border-primary-500'
    'group-hover:text-teal-600' = 'group-hover:text-primary-600'
    'group-hover:text-teal-700' = 'group-hover:text-primary-700'
}

Write-Host "Starting batch update for $($calculatorDirs.Count) calculators..." -ForegroundColor Yellow
Write-Host ""

foreach ($dir in $calculatorDirs) {
    $pagePath = Join-Path $baseDir "$dir\page.tsx"
    
    if (Test-Path $pagePath) {
        Write-Host "Processing: $dir..." -ForegroundColor White
        
        try {
            # Read file content
            $content = Get-Content $pagePath -Raw -Encoding UTF8
            $originalContent = $content
            $changes = @()
            
            # Update year: 2024 -> 2026
            if ($content -match '2024') {
                $content = $content -replace '2024', '2026'
                $changes += "Year: 2024 → 2026"
            }
            
            # Update colors
            $colorChanges = 0
            foreach ($oldColor in $colorReplacements.Keys) {
                $newColor = $colorReplacements[$oldColor]
                if ($content -match [regex]::Escape($oldColor)) {
                    $content = $content -replace [regex]::Escape($oldColor), $newColor
                    $colorChanges++
                }
            }
            
            if ($colorChanges -gt 0) {
                $changes += "Colors: $colorChanges replacements"
            }
            
            # Save if changes were made
            if ($content -ne $originalContent) {
                # Create backup
                $backupPath = "$pagePath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
                Copy-Item $pagePath $backupPath -Force
                
                # Save updated content
                Set-Content $pagePath $content -Encoding UTF8 -NoNewline
                
                Write-Host "  ✓ Updated: $($changes -join ', ')" -ForegroundColor Green
                Write-Host "  ✓ Backup: $(Split-Path $backupPath -Leaf)" -ForegroundColor Gray
                $updatedCount++
            } else {
                Write-Host "  - No changes needed" -ForegroundColor Gray
                $skippedCount++
            }
        }
        catch {
            Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
            $errorCount++
        }
    } else {
        Write-Host "  ⚠ File not found: $pagePath" -ForegroundColor Yellow
        $skippedCount++
    }
    
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Batch Update Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Updated:  $updatedCount files" -ForegroundColor Green
Write-Host "Skipped:  $skippedCount files" -ForegroundColor Yellow
Write-Host "Errors:   $errorCount files" -ForegroundColor Red
Write-Host ""

if ($updatedCount -gt 0) {
    Write-Host "✓ All backups created with timestamp" -ForegroundColor Gray
    Write-Host "✓ Changes applied successfully" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Review changes in updated files" -ForegroundColor White
    Write-Host "2. Test calculators in browser" -ForegroundColor White
    Write-Host "3. Validate schema markup" -ForegroundColor White
    Write-Host "4. Commit changes to git" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
