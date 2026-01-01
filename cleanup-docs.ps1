# cleanup-docs.ps1
# Remove unnecessary/duplicate markdown documentation

Write-Host "Cleaning documentation files..." -ForegroundColor Cyan
Write-Host ""

# KEEP: Essential project documentation
$keepFiles = @(
    "docs/AI_CONTENT_FACTORY_COMPLETE.md",          # Master guide
    "docs/MASTER_CONTENT_PLAN.md",                  # 210 article plan
    "docs/SERP_FIX_HEADLINE_ANALYZER_COMPLETE.md",  # Latest features
    "docs/LAUNCH_READINESS_ANALYSIS.md",            # Launch requirements
    "docs/CRITICAL_DEPENDENCIES_AUDIT.md",          # API requirements
    "docs/BUILD_SESSION_SUMMARY.md",                # Session summary
    "docs/CLEANUP_COMPLETE.md"                      # Cleanup status
)

# DELETE: Outdated, duplicate, or superseded documentation
$deleteFiles = @(
    # Superseded by AI_CONTENT_FACTORY_COMPLETE.md
    "docs/AI_CONTENT_FACTORY_STRATEGY.md",
    "docs/AI_MODEL_TRAINING_EXPLAINED.md",
    "docs/AI_PROMPT_LIBRARY.md",
    "docs/FINANCIAL_EXPERT_AI_TRAINING.md",
    "docs/QUICK_START_AI_WRITER.md",
    "docs/WRITESONIC_AI_WRITER_GUIDE.md",
    
    # Superseded by LAUNCH_READINESS_ANALYSIS.md
    "docs/IMMEDIATE_ACTION_PLAN.md",
    "docs/IMPLEMENTATION_CHECKLIST.md",
    "docs/PHASE1_SUMMARY.md",
    "docs/FINAL_IMPLEMENTATION_SUMMARY.md",
    "docs/COMPREHENSIVE_STRATEGIC_ANALYSIS.md",
    "docs/STRATEGIC_COMMAND_PLAN.md",
    
    # Superseded by CRITICAL_DEPENDENCIES_AUDIT.md
    "docs/API_KEY_SETUP.md",
    "docs/QUICK_API_SETUP.md",
    "docs/MEDIA_LIBRARY_SETUP.md",
    "docs/STOCK_IMAGE_QUICK_START.md",
    "docs/STOCK_IMAGE_SETUP.md",
    "docs/STORAGE_SETUP_GUIDE.md",
    "docs/SUPABASE_STORAGE_SETUP.md",
    
    # General duplicates/old docs
    "docs/ARCHITECTURE.md",
    "docs/PRODUCTION_ARCHITECTURE.md",
    "docs/DESIGN_SYSTEM_REFERENCE.md",
    "docs/UI_UX_STRATEGY.md",
    "docs/CROSS_PLATFORM_LINKING_FRAMEWORK.md"
)

Write-Host "KEEPING essential documentation:" -ForegroundColor Green
foreach ($file in $keepFiles) {
    if (Test-Path $file) {
        $filename = Split-Path $file -Leaf
        Write-Host "  KEEP: $filename" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "DELETING outdated/duplicate documentation:" -ForegroundColor Yellow

$deletedCount = 0
foreach ($file in $deleteFiles) {
    if (Test-Path $file) {
        $filename = Split-Path $file -Leaf
        Remove-Item $file -Force
        Write-Host "  DELETED: $filename" -ForegroundColor Red
        $deletedCount++
    }
}

Write-Host ""
Write-Host "Cleanup Summary:" -ForegroundColor Cyan
Write-Host "  Files kept: 7 essential docs" -ForegroundColor Green
Write-Host "  Files deleted: $deletedCount outdated docs" -ForegroundColor Red
Write-Host ""
Write-Host "Essential documentation retained:" -ForegroundColor Green
Write-Host "  1. AI_CONTENT_FACTORY_COMPLETE.md - Complete implementation guide" -ForegroundColor White
Write-Host "  2. MASTER_CONTENT_PLAN.md - 210 article roadmap" -ForegroundColor White
Write-Host "  3. SERP_FIX_HEADLINE_ANALYZER_COMPLETE.md - Headline optimizer" -ForegroundColor White
Write-Host "  4. LAUNCH_READINESS_ANALYSIS.md - Launch checklist" -ForegroundColor White
Write-Host "  5. CRITICAL_DEPENDENCIES_AUDIT.md - API requirements" -ForegroundColor White
Write-Host "  6. BUILD_SESSION_SUMMARY.md - Session achievements" -ForegroundColor White
Write-Host "  7. CLEANUP_COMPLETE.md - Cleanup status" -ForegroundColor White
Write-Host ""
Write-Host "Documentation cleanup complete!" -ForegroundColor Green
