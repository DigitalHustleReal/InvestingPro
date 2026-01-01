# cleanup-sample-content.ps1
# Comprehensive cleanup of sample/test content

Write-Host "Cleaning Sample/Test Content..." -ForegroundColor Cyan
Write-Host ""

# Sample/test scripts to delete
$filesToDelete = @(
    "scripts/sample-article-data.ts",
    "scripts/generate-sample.ts",
    "scripts/test-samples.ts"
)

Write-Host "Cleaning sample files..." -ForegroundColor Yellow
foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Deleted: $file" -ForegroundColor Green
    } else {
        Write-Host "Not found: $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Database Cleanup Instructions:" -ForegroundColor Yellow
Write-Host "Run this SQL in Supabase SQL Editor:" -ForegroundColor White
Write-Host "supabase/migrations/CLEANUP_SAMPLE_CONTENT.sql" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will:" -ForegroundColor White
Write-Host "- Delete test/sample articles" -ForegroundColor Green
Write-Host "- Remove articles less than 500 characters" -ForegroundColor Green
Write-Host "- Clean draft/deleted status" -ForegroundColor Green
Write-Host "- Delete sample glossary terms" -ForegroundColor Green
Write-Host "- Remove orphaned data" -ForegroundColor Green

Write-Host ""
Write-Host "File cleanup complete!" -ForegroundColor Green
