# cleanup-backups.ps1
# Removes all backup files from the project
# Run: .\scripts\cleanup-backups.ps1

$ErrorActionPreference = "Continue"
$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  InvestingPro Backup File Cleanup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Define patterns to delete
$patterns = @(
    "*.backup",
    "*.cardbackup", 
    "*.fontbackup",
    "*.backup-*"
)

# Directories to exclude
$excludeDirs = @("node_modules", ".next", ".git", "dist", "build")

$totalDeleted = 0
$deletedFiles = @()

foreach ($pattern in $patterns) {
    Write-Host "Searching for: $pattern" -ForegroundColor Yellow
    
    $files = Get-ChildItem -Path $projectRoot -Recurse -Filter $pattern -File -ErrorAction SilentlyContinue | Where-Object {
        $fullPath = $_.FullName
        $exclude = $false
        foreach ($dir in $excludeDirs) {
            if ($fullPath -like "*\$dir\*") {
                $exclude = $true
                break
            }
        }
        -not $exclude
    }
    
    foreach ($file in $files) {
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart("\")
        Write-Host "  Deleting: $relativePath" -ForegroundColor Gray
        Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
        if ($?) {
            $totalDeleted++
            $deletedFiles += $relativePath
        }
    }
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host "  Cleanup Complete!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Total files deleted: $totalDeleted" -ForegroundColor White

if ($totalDeleted -gt 0) {
    Write-Host ""
    Write-Host "Deleted files:" -ForegroundColor Yellow
    $deletedFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run 'npm run build' to verify" -ForegroundColor White
Write-Host "  2. Commit the cleanup: git add -A && git commit -m 'chore: remove backup files'" -ForegroundColor White
Write-Host ""
