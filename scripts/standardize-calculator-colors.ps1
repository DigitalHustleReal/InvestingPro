# Calculator Color Standardization Script
# Replaces remaining hardcoded hex colors with HSL theme values

Write-Host "🎨 Calculator Color Standardization Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$calcPath = "c:\Users\shivp\Desktop\InvestingPro_App\components\calculators"
$changesCount = 0

# Define color replacements (hex -> HSL theme values)
$replacements = @{
    # Blue chart colors
    "'#2563eb'" = "'hsl(217 91% 60%)'" # secondary-500
    '"#2563eb"' = '"hsl(217 91% 60%)"'
    "'#3b82f6'" = "'hsl(217 91% 60%)'" # info-500/secondary-500
    '"#3b82f6"' = '"hsl(217 91% 60%)"'
    
    # Green chart colors  
    "'#10b981'" = "'hsl(160 84% 39%)'" # success-500
    '"#10b981"' = '"hsl(160 84% 39%)"'
    
    # Grid/Axis colors (lighter for visibility)
    "'#f1f5f9'" = "'hsl(210 40% 96%)'" # slate-100
    '"#f1f5f9"' = '"hsl(210 40% 96%)"'
    "'#cbd5e1'" = "'hsl(215 20% 75%)'" # slate-300
    '"#cbd5e1"' = '"hsl(215 20% 75%)"'
    "'#64748b'" = "'hsl(215 16% 47%)'" # slate-500
    '"#64748b"' = '"hsl(215 16% 47%)"'
    "'#e2e8f0'" = "'hsl(214 32% 91%)'" # slate-200
    '"#e2e8f0"' = '"hsl(214 32% 91%)"'
    
    # Tooltip background
    "'#f8fafc'" = "'hsl(210 40% 98%)'" # slate-50
    '"#f8fafc"' = '"hsl(210 40% 98%)"'
}

# Get all calculator component files
$files = Get-ChildItem -Path $calcPath -Filter "*.tsx" -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $fileChanges = 0
    
    foreach ($hex in $replacements.Keys) {
        if ($content -match [regex]::Escape($hex)) {
            $content = $content -replace [regex]::Escape($hex), $replacements[$hex]
            $fileChanges++
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "✅ Updated: $($file.Name) ($fileChanges replacements)" -ForegroundColor Green
        $changesCount += $fileChanges
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ Total replacements made: $changesCount" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
