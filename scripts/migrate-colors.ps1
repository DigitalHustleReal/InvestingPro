# migrate-colors.ps1
# Migrates raw Tailwind colors to semantic tokens
# Run: .\scripts\migrate-colors.ps1

$ErrorActionPreference = "Continue"

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Semantic Color Migration" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Define color replacements
$replacements = @(
    # Blue to Secondary (info, links, trust)
    @{ From = 'bg-blue-50'; To = 'bg-secondary-50' },
    @{ From = 'bg-blue-100'; To = 'bg-secondary-100' },
    @{ From = 'bg-blue-200'; To = 'bg-secondary-200' },
    @{ From = 'bg-blue-300'; To = 'bg-secondary-300' },
    @{ From = 'bg-blue-400'; To = 'bg-secondary-400' },
    @{ From = 'bg-blue-500'; To = 'bg-secondary-500' },
    @{ From = 'bg-blue-600'; To = 'bg-secondary-600' },
    @{ From = 'bg-blue-700'; To = 'bg-secondary-700' },
    @{ From = 'bg-blue-800'; To = 'bg-secondary-800' },
    @{ From = 'bg-blue-900'; To = 'bg-secondary-900' },
    @{ From = 'text-blue-50'; To = 'text-secondary-50' },
    @{ From = 'text-blue-100'; To = 'text-secondary-100' },
    @{ From = 'text-blue-200'; To = 'text-secondary-200' },
    @{ From = 'text-blue-300'; To = 'text-secondary-300' },
    @{ From = 'text-blue-400'; To = 'text-secondary-400' },
    @{ From = 'text-blue-500'; To = 'text-secondary-500' },
    @{ From = 'text-blue-600'; To = 'text-secondary-600' },
    @{ From = 'text-blue-700'; To = 'text-secondary-700' },
    @{ From = 'text-blue-800'; To = 'text-secondary-800' },
    @{ From = 'text-blue-900'; To = 'text-secondary-900' },
    @{ From = 'border-blue-50'; To = 'border-secondary-50' },
    @{ From = 'border-blue-100'; To = 'border-secondary-100' },
    @{ From = 'border-blue-200'; To = 'border-secondary-200' },
    @{ From = 'border-blue-300'; To = 'border-secondary-300' },
    @{ From = 'border-blue-400'; To = 'border-secondary-400' },
    @{ From = 'border-blue-500'; To = 'border-secondary-500' },
    @{ From = 'border-blue-600'; To = 'border-secondary-600' },
    @{ From = 'ring-blue-500'; To = 'ring-secondary-500' },
    @{ From = 'ring-blue-600'; To = 'ring-secondary-600' },
    @{ From = 'hover:bg-blue-50'; To = 'hover:bg-secondary-50' },
    @{ From = 'hover:bg-blue-100'; To = 'hover:bg-secondary-100' },
    @{ From = 'hover:bg-blue-600'; To = 'hover:bg-secondary-600' },
    @{ From = 'hover:bg-blue-700'; To = 'hover:bg-secondary-700' },
    @{ From = 'hover:text-blue-600'; To = 'hover:text-secondary-600' },
    @{ From = 'hover:text-blue-700'; To = 'hover:text-secondary-700' },
    @{ From = 'focus:ring-blue-500'; To = 'focus:ring-secondary-500' },
    
    # Yellow to Accent (warning, highlights, CTAs)
    @{ From = 'bg-yellow-50'; To = 'bg-accent-50' },
    @{ From = 'bg-yellow-100'; To = 'bg-accent-100' },
    @{ From = 'bg-yellow-200'; To = 'bg-accent-200' },
    @{ From = 'bg-yellow-300'; To = 'bg-accent-300' },
    @{ From = 'bg-yellow-400'; To = 'bg-accent-400' },
    @{ From = 'bg-yellow-500'; To = 'bg-accent-500' },
    @{ From = 'bg-yellow-600'; To = 'bg-accent-600' },
    @{ From = 'bg-yellow-700'; To = 'bg-accent-700' },
    @{ From = 'text-yellow-50'; To = 'text-accent-50' },
    @{ From = 'text-yellow-100'; To = 'text-accent-100' },
    @{ From = 'text-yellow-200'; To = 'text-accent-200' },
    @{ From = 'text-yellow-300'; To = 'text-accent-300' },
    @{ From = 'text-yellow-400'; To = 'text-accent-400' },
    @{ From = 'text-yellow-500'; To = 'text-accent-500' },
    @{ From = 'text-yellow-600'; To = 'text-accent-600' },
    @{ From = 'text-yellow-700'; To = 'text-accent-700' },
    @{ From = 'text-yellow-800'; To = 'text-accent-800' },
    @{ From = 'border-yellow-200'; To = 'border-accent-200' },
    @{ From = 'border-yellow-300'; To = 'border-accent-300' },
    @{ From = 'border-yellow-400'; To = 'border-accent-400' },
    @{ From = 'border-yellow-500'; To = 'border-accent-500' },
    
    # Red to Danger (errors, losses, negative)
    @{ From = 'bg-red-50'; To = 'bg-danger-50' },
    @{ From = 'bg-red-100'; To = 'bg-danger-100' },
    @{ From = 'bg-red-200'; To = 'bg-danger-200' },
    @{ From = 'bg-red-300'; To = 'bg-danger-300' },
    @{ From = 'bg-red-400'; To = 'bg-danger-400' },
    @{ From = 'bg-red-500'; To = 'bg-danger-500' },
    @{ From = 'bg-red-600'; To = 'bg-danger-600' },
    @{ From = 'bg-red-700'; To = 'bg-danger-700' },
    @{ From = 'text-red-50'; To = 'text-danger-50' },
    @{ From = 'text-red-100'; To = 'text-danger-100' },
    @{ From = 'text-red-200'; To = 'text-danger-200' },
    @{ From = 'text-red-300'; To = 'text-danger-300' },
    @{ From = 'text-red-400'; To = 'text-danger-400' },
    @{ From = 'text-red-500'; To = 'text-danger-500' },
    @{ From = 'text-red-600'; To = 'text-danger-600' },
    @{ From = 'text-red-700'; To = 'text-danger-700' },
    @{ From = 'text-red-800'; To = 'text-danger-800' },
    @{ From = 'border-red-200'; To = 'border-danger-200' },
    @{ From = 'border-red-300'; To = 'border-danger-300' },
    @{ From = 'border-red-400'; To = 'border-danger-400' },
    @{ From = 'border-red-500'; To = 'border-danger-500' },
    @{ From = 'ring-red-500'; To = 'ring-danger-500' },
    @{ From = 'hover:bg-red-600'; To = 'hover:bg-danger-600' },
    @{ From = 'hover:bg-red-700'; To = 'hover:bg-danger-700' },
    
    # Green to Success (gains, positive, success)
    @{ From = 'bg-green-50'; To = 'bg-success-50' },
    @{ From = 'bg-green-100'; To = 'bg-success-100' },
    @{ From = 'bg-green-200'; To = 'bg-success-200' },
    @{ From = 'bg-green-300'; To = 'bg-success-300' },
    @{ From = 'bg-green-400'; To = 'bg-success-400' },
    @{ From = 'bg-green-500'; To = 'bg-success-500' },
    @{ From = 'bg-green-600'; To = 'bg-success-600' },
    @{ From = 'bg-green-700'; To = 'bg-success-700' },
    @{ From = 'text-green-50'; To = 'text-success-50' },
    @{ From = 'text-green-100'; To = 'text-success-100' },
    @{ From = 'text-green-200'; To = 'text-success-200' },
    @{ From = 'text-green-300'; To = 'text-success-300' },
    @{ From = 'text-green-400'; To = 'text-success-400' },
    @{ From = 'text-green-500'; To = 'text-success-500' },
    @{ From = 'text-green-600'; To = 'text-success-600' },
    @{ From = 'text-green-700'; To = 'text-success-700' },
    @{ From = 'text-green-800'; To = 'text-success-800' },
    @{ From = 'border-green-200'; To = 'border-success-200' },
    @{ From = 'border-green-300'; To = 'border-success-300' },
    @{ From = 'border-green-400'; To = 'border-success-400' },
    @{ From = 'border-green-500'; To = 'border-success-500' },
    @{ From = 'ring-green-500'; To = 'ring-success-500' },
    @{ From = 'hover:bg-green-600'; To = 'hover:bg-success-600' },
    @{ From = 'hover:bg-green-700'; To = 'hover:bg-success-700' },
    
    # Orange to Accent (attention, warnings)
    @{ From = 'bg-orange-50'; To = 'bg-accent-50' },
    @{ From = 'bg-orange-100'; To = 'bg-accent-100' },
    @{ From = 'bg-orange-200'; To = 'bg-accent-200' },
    @{ From = 'bg-orange-300'; To = 'bg-accent-300' },
    @{ From = 'bg-orange-400'; To = 'bg-accent-400' },
    @{ From = 'bg-orange-500'; To = 'bg-accent-500' },
    @{ From = 'bg-orange-600'; To = 'bg-accent-600' },
    @{ From = 'text-orange-500'; To = 'text-accent-500' },
    @{ From = 'text-orange-600'; To = 'text-accent-600' },
    @{ From = 'border-orange-200'; To = 'border-accent-200' },
    @{ From = 'border-orange-300'; To = 'border-accent-300' },
    
    # Purple to Primary (brand)
    @{ From = 'bg-purple-50'; To = 'bg-primary-50' },
    @{ From = 'bg-purple-100'; To = 'bg-primary-100' },
    @{ From = 'bg-purple-200'; To = 'bg-primary-200' },
    @{ From = 'bg-purple-500'; To = 'bg-primary-500' },
    @{ From = 'bg-purple-600'; To = 'bg-primary-600' },
    @{ From = 'bg-purple-700'; To = 'bg-primary-700' },
    @{ From = 'text-purple-500'; To = 'text-primary-500' },
    @{ From = 'text-purple-600'; To = 'text-primary-600' },
    @{ From = 'text-purple-700'; To = 'text-primary-700' },
    @{ From = 'border-purple-200'; To = 'border-primary-200' },
    @{ From = 'border-purple-500'; To = 'border-primary-500' },
    
    # Indigo to Primary (brand)
    @{ From = 'bg-indigo-50'; To = 'bg-primary-50' },
    @{ From = 'bg-indigo-100'; To = 'bg-primary-100' },
    @{ From = 'bg-indigo-500'; To = 'bg-primary-500' },
    @{ From = 'bg-indigo-600'; To = 'bg-primary-600' },
    @{ From = 'bg-indigo-700'; To = 'bg-primary-700' },
    @{ From = 'text-indigo-500'; To = 'text-primary-500' },
    @{ From = 'text-indigo-600'; To = 'text-primary-600' },
    @{ From = 'border-indigo-200'; To = 'border-primary-200' },
    @{ From = 'border-indigo-500'; To = 'border-primary-500' },
    
    # Cyan to Secondary (info variant)
    @{ From = 'bg-cyan-50'; To = 'bg-secondary-50' },
    @{ From = 'bg-cyan-100'; To = 'bg-secondary-100' },
    @{ From = 'bg-cyan-500'; To = 'bg-secondary-500' },
    @{ From = 'bg-cyan-600'; To = 'bg-secondary-600' },
    @{ From = 'text-cyan-500'; To = 'text-secondary-500' },
    @{ From = 'text-cyan-600'; To = 'text-secondary-600' },
    
    # Pink to Danger (alerts)
    @{ From = 'bg-pink-50'; To = 'bg-danger-50' },
    @{ From = 'bg-pink-100'; To = 'bg-danger-100' },
    @{ From = 'bg-pink-500'; To = 'bg-danger-500' },
    @{ From = 'bg-pink-600'; To = 'bg-danger-600' },
    @{ From = 'text-pink-500'; To = 'text-danger-500' },
    @{ From = 'text-pink-600'; To = 'text-danger-600' }
)

# Get all TSX files
$files = Get-ChildItem -Path "app","components" -Recurse -Include "*.tsx" -File

$totalReplacements = 0
$modifiedFiles = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    $originalContent = $content
    $fileModified = $false
    
    foreach ($replacement in $replacements) {
        if ($content -match [regex]::Escape($replacement.From)) {
            $content = $content -replace [regex]::Escape($replacement.From), $replacement.To
            $fileModified = $true
            $totalReplacements++
        }
    }
    
    if ($fileModified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline -Encoding UTF8
        $modifiedFiles += $file.FullName.Replace((Get-Location).Path, "").TrimStart("\")
        Write-Host "Modified: $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host "  Migration Complete!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Total replacements: $totalReplacements" -ForegroundColor White
Write-Host "Files modified: $($modifiedFiles.Count)" -ForegroundColor White
