# cleanup-root-md.ps1
# Clean up all unnecessary .md files from root directory

Write-Host "Cleaning root directory markdown files..." -ForegroundColor Cyan
Write-Host ""

# KEEP in root: Only README.md (standard)
$keepInRoot = @(
    "README.md"
)

# Get all .md files in root (excluding node_modules)
$allMdFiles = Get-ChildItem -Path "." -Filter "*.md" -File | Where-Object { $_.FullName -notlike "*node_modules*" }

Write-Host "Found $($allMdFiles.Count) markdown files in root directory" -ForegroundColor Yellow
Write-Host ""

$deletedCount = 0
$keptCount = 0

foreach ($file in $allMdFiles) {
    $filename = $file.Name
    
    if ($keepInRoot -contains $filename) {
        Write-Host "  KEEP: $filename" -ForegroundColor Green
        $keptCount++
    } else {
        Remove-Item $file.FullName -Force
        $deletedCount++
    }
}

Write-Host ""
Write-Host "Root directory cleanup complete!" -ForegroundColor Green
Write-Host "  Files kept: $keptCount (README.md only)" -ForegroundColor Green
Write-Host "  Files deleted: $deletedCount outdated docs" -ForegroundColor Red
Write-Host ""
Write-Host "All project documentation now in docs/ folder" -ForegroundColor Cyan
