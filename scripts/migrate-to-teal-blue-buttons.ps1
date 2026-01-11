# PowerShell script to replace old primary hover pattern with new teal-blue interactive pattern
# Pattern: bg-primary-600 hover:bg-primary-700 → bg-primary-600 hover:bg-blue-600 dark:bg-primary-500 dark:hover:bg-blue-500

$searchPattern = "bg-primary-600 hover:bg-primary-700"
$replacePattern = "bg-primary-600 hover:bg-blue-600 dark:bg-primary-500 dark:hover:bg-blue-500"

# Target directories
$directories = @(
    "app",
    "components"
)

$count = 0
$files = @()

foreach ($dir in $directories) {
    $path = Join-Path $PWD $dir
    Get-ChildItem -Path $path -Recurse -Include "*.tsx","*.ts" | ForEach-Object {
        $file = $_
        $content = Get-Content $file.FullName -Raw
        
        if ($content -match [regex]::Escape($searchPattern)) {
            $newContent = $content -replace [regex]::Escape($searchPattern), $replacePattern
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            $count++
            $files += $file.FullName
            Write-Host "✓ Updated: $($file.FullName)" -ForegroundColor Green
        }
    }
}

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "Migration Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Files updated: $count" -ForegroundColor Yellow
Write-Host "Pattern: Teal-base + Blue-hover with dark mode support" -ForegroundColor Cyan
Write-Host "`nUpdated files:" -ForegroundColor Yellow
$files | ForEach-Object { Write-Host "  - $_" }
