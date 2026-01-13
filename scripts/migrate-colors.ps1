# InvestingPro Color Migration Script
# Migrates off-brand colors to unified design system tokens
# Run: .\scripts\migrate-colors.ps1

$ErrorActionPreference = "Continue"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  InvestingPro Color Migration Tool" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Define replacement mappings
$replacements = @(
    # P3-1: Gray to Slate (Neutrals)
    @{ Pattern = 'gray-50'; Replacement = 'slate-50'; Description = 'Gray 50 to Slate 50' },
    @{ Pattern = 'gray-100'; Replacement = 'slate-100'; Description = 'Gray 100 to Slate 100' },
    @{ Pattern = 'gray-200'; Replacement = 'slate-200'; Description = 'Gray 200 to Slate 200' },
    @{ Pattern = 'gray-300'; Replacement = 'slate-300'; Description = 'Gray 300 to Slate 300' },
    @{ Pattern = 'gray-400'; Replacement = 'slate-400'; Description = 'Gray 400 to Slate 400' },
    @{ Pattern = 'gray-500'; Replacement = 'slate-500'; Description = 'Gray 500 to Slate 500' },
    @{ Pattern = 'gray-600'; Replacement = 'slate-600'; Description = 'Gray 600 to Slate 600' },
    @{ Pattern = 'gray-700'; Replacement = 'slate-700'; Description = 'Gray 700 to Slate 700' },
    @{ Pattern = 'gray-800'; Replacement = 'slate-800'; Description = 'Gray 800 to Slate 800' },
    @{ Pattern = 'gray-900'; Replacement = 'slate-900'; Description = 'Gray 900 to Slate 900' },
    @{ Pattern = 'gray-950'; Replacement = 'slate-950'; Description = 'Gray 950 to Slate 950' },
    
    # P3-2: Teal to Primary (Brand Primary)
    @{ Pattern = 'teal-50'; Replacement = 'primary-50'; Description = 'Teal 50 to Primary 50' },
    @{ Pattern = 'teal-100'; Replacement = 'primary-100'; Description = 'Teal 100 to Primary 100' },
    @{ Pattern = 'teal-200'; Replacement = 'primary-200'; Description = 'Teal 200 to Primary 200' },
    @{ Pattern = 'teal-300'; Replacement = 'primary-300'; Description = 'Teal 300 to Primary 300' },
    @{ Pattern = 'teal-400'; Replacement = 'primary-400'; Description = 'Teal 400 to Primary 400' },
    @{ Pattern = 'teal-500'; Replacement = 'primary-500'; Description = 'Teal 500 to Primary 500' },
    @{ Pattern = 'teal-600'; Replacement = 'primary-600'; Description = 'Teal 600 to Primary 600' },
    @{ Pattern = 'teal-700'; Replacement = 'primary-700'; Description = 'Teal 700 to Primary 700' },
    @{ Pattern = 'teal-800'; Replacement = 'primary-800'; Description = 'Teal 800 to Primary 800' },
    @{ Pattern = 'teal-900'; Replacement = 'primary-900'; Description = 'Teal 900 to Primary 900' },
    @{ Pattern = 'teal-950'; Replacement = 'primary-950'; Description = 'Teal 950 to Primary 950' },
    
    # P3-3: Emerald/Green to Success (Semantic positive)
    @{ Pattern = 'emerald-50'; Replacement = 'success-50'; Description = 'Emerald 50 to Success 50' },
    @{ Pattern = 'emerald-100'; Replacement = 'success-100'; Description = 'Emerald 100 to Success 100' },
    @{ Pattern = 'emerald-500'; Replacement = 'success-500'; Description = 'Emerald 500 to Success 500' },
    @{ Pattern = 'emerald-600'; Replacement = 'success-600'; Description = 'Emerald 600 to Success 600' },
    @{ Pattern = 'emerald-700'; Replacement = 'success-700'; Description = 'Emerald 700 to Success 700' },
    @{ Pattern = 'green-50'; Replacement = 'success-50'; Description = 'Green 50 to Success 50' },
    @{ Pattern = 'green-100'; Replacement = 'success-100'; Description = 'Green 100 to Success 100' },
    @{ Pattern = 'green-500'; Replacement = 'success-500'; Description = 'Green 500 to Success 500' },
    @{ Pattern = 'green-600'; Replacement = 'success-600'; Description = 'Green 600 to Success 600' },
    @{ Pattern = 'green-700'; Replacement = 'success-700'; Description = 'Green 700 to Success 700' },
    
    # P3-4: Amber to Accent (Brand accent)
    @{ Pattern = 'amber-50'; Replacement = 'accent-50'; Description = 'Amber 50 to Accent 50' },
    @{ Pattern = 'amber-100'; Replacement = 'accent-100'; Description = 'Amber 100 to Accent 100' },
    @{ Pattern = 'amber-200'; Replacement = 'accent-200'; Description = 'Amber 200 to Accent 200' },
    @{ Pattern = 'amber-300'; Replacement = 'accent-300'; Description = 'Amber 300 to Accent 300' },
    @{ Pattern = 'amber-400'; Replacement = 'accent-400'; Description = 'Amber 400 to Accent 400' },
    @{ Pattern = 'amber-500'; Replacement = 'accent-500'; Description = 'Amber 500 to Accent 500' },
    @{ Pattern = 'amber-600'; Replacement = 'accent-600'; Description = 'Amber 600 to Accent 600' },
    @{ Pattern = 'amber-700'; Replacement = 'accent-700'; Description = 'Amber 700 to Accent 700' },
    @{ Pattern = 'amber-800'; Replacement = 'accent-800'; Description = 'Amber 800 to Accent 800' },
    @{ Pattern = 'amber-900'; Replacement = 'accent-900'; Description = 'Amber 900 to Accent 900' },
    
    # P3-5: Sky/Blue to Secondary (Info/Trust)
    @{ Pattern = 'sky-50'; Replacement = 'secondary-50'; Description = 'Sky 50 to Secondary 50' },
    @{ Pattern = 'sky-100'; Replacement = 'secondary-100'; Description = 'Sky 100 to Secondary 100' },
    @{ Pattern = 'sky-200'; Replacement = 'secondary-200'; Description = 'Sky 200 to Secondary 200' },
    @{ Pattern = 'sky-300'; Replacement = 'secondary-300'; Description = 'Sky 300 to Secondary 300' },
    @{ Pattern = 'sky-400'; Replacement = 'secondary-400'; Description = 'Sky 400 to Secondary 400' },
    @{ Pattern = 'sky-500'; Replacement = 'secondary-500'; Description = 'Sky 500 to Secondary 500' },
    @{ Pattern = 'sky-600'; Replacement = 'secondary-600'; Description = 'Sky 600 to Secondary 600' },
    @{ Pattern = 'sky-700'; Replacement = 'secondary-700'; Description = 'Sky 700 to Secondary 700' },
    
    # P3-6: Red to Danger (Semantic negative)
    @{ Pattern = 'red-50'; Replacement = 'danger-50'; Description = 'Red 50 to Danger 50' },
    @{ Pattern = 'red-100'; Replacement = 'danger-100'; Description = 'Red 100 to Danger 100' },
    @{ Pattern = 'red-500'; Replacement = 'danger-500'; Description = 'Red 500 to Danger 500' },
    @{ Pattern = 'red-600'; Replacement = 'danger-600'; Description = 'Red 600 to Danger 600' },
    @{ Pattern = 'red-700'; Replacement = 'danger-700'; Description = 'Red 700 to Danger 700' }
)

# File extensions to process
$extensions = @("*.tsx", "*.ts", "*.jsx", "*.js")

# Directories to exclude
$excludeDirs = @("node_modules", ".next", ".git", "dist", "build")

# Track statistics
$totalFiles = 0
$totalReplacements = 0
$changedFiles = @()

Write-Host "Scanning project files..." -ForegroundColor Yellow
Write-Host ""

# Get all files to process
$files = Get-ChildItem -Path $projectRoot -Recurse -Include $extensions | Where-Object {
    $exclude = $false
    foreach ($dir in $excludeDirs) {
        if ($_.FullName -like "*\$dir\*") {
            $exclude = $true
            break
        }
    }
    -not $exclude
}

Write-Host "Found $($files.Count) files to scan" -ForegroundColor Cyan
Write-Host ""

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    $originalContent = $content
    $fileChanges = 0
    
    foreach ($replacement in $replacements) {
        # Use word boundary matching to avoid partial replacements
        $pattern = "\b$($replacement.Pattern)\b"
        $matches = [regex]::Matches($content, $pattern)
        
        if ($matches.Count -gt 0) {
            $content = $content -replace $pattern, $replacement.Replacement
            $fileChanges += $matches.Count
        }
    }
    
    if ($fileChanges -gt 0) {
        # Write changes back to file
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalFiles++
        $totalReplacements += $fileChanges
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart("\")
        $changedFiles += @{ Path = $relativePath; Changes = $fileChanges }
        Write-Host "  + $relativePath ($fileChanges changes)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Migration Complete!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  Files modified: $totalFiles" -ForegroundColor White
Write-Host "  Total replacements: $totalReplacements" -ForegroundColor White
Write-Host ""

if ($changedFiles.Count -gt 0) {
    Write-Host "Changed files:" -ForegroundColor Yellow
    foreach ($cf in $changedFiles | Sort-Object -Property Changes -Descending | Select-Object -First 20) {
        Write-Host "  - $($cf.Path): $($cf.Changes) changes" -ForegroundColor Gray
    }
    if ($changedFiles.Count -gt 20) {
        Write-Host "  ... and $($changedFiles.Count - 20) more files" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Run 'npm run build' to verify changes" -ForegroundColor White
Write-Host "  2. Review visual appearance in dev server" -ForegroundColor White
Write-Host "  3. Commit changes" -ForegroundColor White
Write-Host ""
