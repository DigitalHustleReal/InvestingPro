# Component Color Update Script
# Updates calculator component colors from teal/orange to primary tokens

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Calculator Component Color Update" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$componentsDir = "c:\Users\shivp\Desktop\InvestingPro_App\components\calculators"
$updatedCount = 0
$totalReplacements = 0

# Define all color replacements (expanded list)
$colorReplacements = @{
    # Teal colors
    'bg-teal-50' = 'bg-primary-50'
    'bg-teal-100' = 'bg-primary-100'
    'bg-teal-200' = 'bg-primary-200'
    'bg-teal-300' = 'bg-primary-300'
    'bg-teal-400' = 'bg-primary-400'
    'bg-teal-500' = 'bg-primary-500'
    'bg-teal-600' = 'bg-primary-600'
    'bg-teal-700' = 'bg-primary-700'
    'bg-teal-800' = 'bg-primary-800'
    'bg-teal-900' = 'bg-primary-900'
    
    'text-teal-50' = 'text-primary-50'
    'text-teal-100' = 'text-primary-100'
    'text-teal-200' = 'text-primary-200'
    'text-teal-300' = 'text-primary-300'
    'text-teal-400' = 'text-primary-400'
    'text-teal-500' = 'text-primary-500'
    'text-teal-600' = 'text-primary-600'
    'text-teal-700' = 'text-primary-700'
    'text-teal-800' = 'text-primary-800'
    'text-teal-900' = 'text-primary-900'
    
    'border-teal-50' = 'border-primary-50'
    'border-teal-100' = 'border-primary-100'
    'border-teal-200' = 'border-primary-200'
    'border-teal-300' = 'border-primary-300'
    'border-teal-400' = 'border-primary-400'
    'border-teal-500' = 'border-primary-500'
    'border-teal-600' = 'border-primary-600'
    'border-teal-700' = 'border-primary-700'
    
    'ring-teal-500' = 'ring-primary-500'
    'ring-teal-600' = 'ring-primary-600'
    
    'from-teal-50' = 'from-primary-50'
    'from-teal-500' = 'from-primary-500'
    'from-teal-600' = 'from-primary-600'
    'to-teal-50' = 'to-primary-50'
    'to-teal-500' = 'to-primary-500'
    'to-teal-600' = 'to-primary-600'
    
    'hover:bg-teal-50' = 'hover:bg-primary-50'
    'hover:bg-teal-600' = 'hover:bg-primary-600'
    'hover:bg-teal-700' = 'hover:bg-primary-700'
    'hover:text-teal-600' = 'hover:text-primary-600'
    'hover:text-teal-700' = 'hover:text-primary-700'
    'hover:border-teal-500' = 'hover:border-primary-500'
    'hover:border-teal-600' = 'hover:border-primary-600'
    
    'focus:ring-teal-500' = 'focus:ring-primary-500'
    'focus:border-teal-500' = 'focus:border-primary-500'
    
    'group-hover:text-teal-600' = 'group-hover:text-primary-600'
    'group-hover:text-teal-700' = 'group-hover:text-primary-700'
    
    # Orange colors (EMI/FD specific)
    'bg-orange-50' = 'bg-primary-50'
    'bg-orange-100' = 'bg-primary-100'
    'bg-orange-400' = 'bg-primary-400'
    'bg-orange-500' = 'bg-primary-500'
    'bg-orange-600' = 'bg-primary-600'
    'bg-orange-700' = 'bg-primary-700'
    
    'text-orange-500' = 'text-primary-500'
    'text-orange-600' = 'text-primary-600'
    'text-orange-700' = 'text-primary-700'
    
    'border-orange-500' = 'border-primary-500'
    'border-orange-600' = 'border-primary-600'
    
    'hover:bg-orange-600' = 'hover:bg-primary-600'
    'hover:bg-orange-700' = 'hover:bg-primary-700'
    
    # Hex color replacements (for inline styles and chart configs)
    '#14b8a6' = 'hsl(var(--primary))'  # teal-500
    '#0d9488' = 'hsl(var(--primary))'  # teal-600
    '#0f766e' = 'hsl(var(--primary))'  # teal-700
    '#f97316' = 'hsl(var(--primary))'  # orange-500
    '#ea580c' = 'hsl(var(--primary))'  # orange-600
}

# Calculator components to update
$components = @(
    "SIPCalculatorWithInflation.tsx",
    "EMICalculatorEnhanced.tsx",
    "FDCalculator.tsx",
    "SWPCalculator.tsx",
    "GSTCalculator.tsx",
    "TaxCalculator.tsx",
    "RetirementCalculator.tsx",
    "PPFCalculator.tsx",
    "NPSCalculator.tsx",
    "LumpsumCalculatorWithInflation.tsx",
    "GoalPlanningCalculator.tsx",
    "HomeLoanVsSIPCalculator.tsx",
    "InflationAdjustedCalculator.tsx"
)

Write-Host "Updating $($components.Count) calculator components..." -ForegroundColor Yellow
Write-Host ""

foreach ($component in $components) {
    $filePath = Join-Path $componentsDir $component
    
    if (Test-Path $filePath) {
        Write-Host "Processing: $component..." -ForegroundColor White
        
        try {
            $content = Get-Content $filePath -Raw -Encoding UTF8
            $originalContent = $content
            $fileReplacements = 0
            
            # Apply all color replacements
            foreach ($oldColor in $colorReplacements.Keys) {
                $newColor = $colorReplacements[$oldColor]
                $pattern = [regex]::Escape($oldColor)
                $matches = [regex]::Matches($content, $pattern)
                
                if ($matches.Count -gt 0) {
                    $content = $content -replace $pattern, $newColor
                    $fileReplacements += $matches.Count
                }
            }
            
            if ($content -ne $originalContent) {
                # Create backup
                $backupPath = "$filePath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
                Copy-Item $filePath $backupPath -Force
                
                # Save updated content
                Set-Content $filePath $content -Encoding UTF8 -NoNewline
                
                Write-Host "  ✓ Updated: $fileReplacements color replacements" -ForegroundColor Green
                Write-Host "  ✓ Backup: $(Split-Path $backupPath -Leaf)" -ForegroundColor Gray
                $updatedCount++
                $totalReplacements += $fileReplacements
            } else {
                Write-Host "  - No changes needed" -ForegroundColor Gray
            }
        }
        catch {
            Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "  ⚠ File not found: $component" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Component Update Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files Updated:      $updatedCount" -ForegroundColor Green
Write-Host "Total Replacements: $totalReplacements" -ForegroundColor Green
Write-Host ""

if ($updatedCount -gt 0) {
    Write-Host "✓ All backups created with timestamp" -ForegroundColor Gray
    Write-Host "✓ Color standardization complete" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Test calculators in browser" -ForegroundColor White
    Write-Host "2. Verify color consistency" -ForegroundColor White
    Write-Host "3. Check dark mode" -ForegroundColor White
    Write-Host "4. Commit changes to git" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
