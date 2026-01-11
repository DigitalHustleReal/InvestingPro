# Fix All Calculator Export Errors
# Adds default export to broken calculator pages

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fix Calculator Export Errors" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = "c:\Users\shivp\Desktop\InvestingPro_App\app\calculators"
$fixedCount = 0
$skippedCount = 0

# Calculators to fix
$calculators = @(
    @{ name = "lumpsum"; function = "LumpsumCalculatorPage" },
    @{ name = "ppf"; function = "PPFCalculatorPage" },
    @{ name = "nps"; function = "NPSCalculatorPage" },
    @{ name = "retirement"; function = "RetirementCalculatorPage" },
    @{ name = "goal-planning"; function = "GoalPlanningCalculatorPage" },
    @{ name = "home-loan-vs-sip"; function = "HomeLoanVsSIPCalculatorPage" }
)

Write-Host "Fixing $($calculators.Count) calculator pages..." -ForegroundColor Yellow
Write-Host ""

foreach ($calc in $calculators) {
    $pagePath = Join-Path $baseDir "$($calc.name)\page.tsx"
    
    if (Test-Path $pagePath) {
        Write-Host "Processing: $($calc.name)..." -ForegroundColor White
        
        try {
            $content = Get-Content $pagePath -Raw -Encoding UTF8
            
            # Check if default export already exists
            if ($content -match "export default") {
                Write-Host "  - Already has default export" -ForegroundColor Gray
                $skippedCount++
            }
            else {
                # Check if file is empty or very small
                if ($content.Length -lt 50) {
                    Write-Host "  ⚠ File is empty or too small, skipping" -ForegroundColor Yellow
                    $skippedCount++
                    continue
                }
                
                # Find the function name
                $functionMatch = [regex]::Match($content, "export function (\w+)")
                
                if ($functionMatch.Success) {
                    $functionName = $functionMatch.Groups[1].Value
                    
                    # Add default export at the end
                    $content += "`r`n`r`nexport default $functionName;`r`n"
                    
                    # Create backup
                    $backupPath = "$pagePath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
                    Copy-Item $pagePath $backupPath -Force
                    
                    # Save updated content
                    Set-Content $pagePath $content -Encoding UTF8 -NoNewline
                    
                    Write-Host "  ✓ Added: export default $functionName" -ForegroundColor Green
                    Write-Host "  ✓ Backup: $(Split-Path $backupPath -Leaf)" -ForegroundColor Gray
                    $fixedCount++
                }
                else {
                    Write-Host "  ⚠ Could not find function export" -ForegroundColor Yellow
                    $skippedCount++
                }
            }
        }
        catch {
            Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "  ⚠ File not found: $pagePath" -ForegroundColor Yellow
        $skippedCount++
    }
    
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Export Fix Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Fixed:   $fixedCount calculators" -ForegroundColor Green
Write-Host "Skipped: $skippedCount calculators" -ForegroundColor Yellow
Write-Host ""

if ($fixedCount -gt 0) {
    Write-Host "✓ All backups created with timestamp" -ForegroundColor Gray
    Write-Host "✓ Default exports added" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Test each calculator in browser" -ForegroundColor White
    Write-Host "2. Verify no React export errors" -ForegroundColor White
    Write-Host "3. Check hub page links" -ForegroundColor White
    Write-Host "4. Run build to verify" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
