# cleanup-temp-files.ps1
# Removes temporary files created during development

Write-Host "🧹 Cleaning up temporary files..." -ForegroundColor Cyan

# Temporary test scripts (superseded)
$tempFiles = @(
    "scripts/test-api-keys.ts",
    "scripts/test-article-generation.ts",
    "scripts/test-article-simple.ts"
)

# Duplicate/consolidated documentation
$dupeDocs = @(
    "docs/PHASE1_TESTING_GUIDE.md",
    "docs/PHASE1_TESTING_SUMMARY.md",
    "docs/PHASE2_COMPLETE.md",
    "docs/PHASE3_COMPLETE.md",
    "docs/CONTENT_FACTORY_READY.md",
    "docs/LAUNCH_CHECKLIST.md",
    "docs/QUICK_START.md",
    "docs/PHASE1_KEYWORD_DIFFICULTY_COMPLETE.md"
)

$allToDelete = $tempFiles + $dupeDocs

foreach ($file in $allToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "✅ Deleted: $file" -ForegroundColor Green
    } else {
        Write-Host "⏩ Skip (not found): $file" -ForegroundColor Gray
    }
}

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
Write-Host "Kept essential production files only." -ForegroundColor Cyan
