# Bulk Color Fix Script
# Replaces ALL non-semantic colors with design system tokens

Write-Host "Starting bulk color fix..." -ForegroundColor Cyan
Write-Host "Target: app/ and components/ directories`n" -ForegroundColor Yellow

# Define all replacements
$replacements = @{
    # Blue -> Secondary (Information/Links)
    'text-blue-50' = 'text-secondary-50'
    'text-blue-100' = 'text-secondary-100'
    'text-blue-200' = 'text-secondary-200'
    'text-blue-300' = 'text-secondary-300'
    'text-blue-400' = 'text-secondary-400'
    'text-blue-500' = 'text-secondary-500'
    'text-blue-600' = 'text-secondary-600'
    'text-blue-700' = 'text-secondary-700'
    'text-blue-800' = 'text-secondary-800'
    'text-blue-900' = 'text-secondary-900'
    
    'bg-blue-50' = 'bg-secondary-50'
    'bg-blue-100' = 'bg-secondary-100'
    'bg-blue-200' = 'bg-secondary-200'
    'bg-blue-300' = 'bg-secondary-300'
    'bg-blue-400' = 'bg-secondary-400'
    'bg-blue-500' = 'bg-secondary-500'
    'bg-blue-600' = 'bg-secondary-600'
    'bg-blue-700' = 'bg-secondary-700'
    'bg-blue-800' = 'bg-secondary-800'
    'bg-blue-900' = 'bg-secondary-900'
    
    'border-blue-50' = 'border-secondary-50'
    'border-blue-100' = 'border-secondary-100'
    'border-blue-200' = 'border-secondary-200'
    'border-blue-300' = 'border-secondary-300'
    'border-blue-400' = 'border-secondary-400'
    'border-blue-500' = 'border-secondary-500'
    'border-blue-600' = 'border-secondary-600'
    'border-blue-700' = 'border-secondary-700'
    
    # Purple -> Secondary
    'text-purple-50' = 'text-secondary-50'
    'text-purple-100' = 'text-secondary-100'
    'text-purple-200' = 'text-secondary-200'
    'text-purple-300' = 'text-secondary-300'
    'text-purple-400' = 'text-secondary-400'
    'text-purple-500' = 'text-secondary-500'
    'text-purple-600' = 'text-secondary-600'
    'text-purple-700' = 'text-secondary-700'
    'text-purple-800' = 'text-secondary-800'
    'text-purple-900' = 'text-secondary-900'
    
    'bg-purple-50' = 'bg-secondary-50'
    'bg-purple-100' = 'bg-secondary-100'
    'bg-purple-200' = 'bg-secondary-200'
    'bg-purple-300' = 'bg-secondary-300'
    'bg-purple-400' = 'bg-secondary-400'
    'bg-purple-500' = 'bg-secondary-500'
    'bg-purple-600' = 'bg-secondary-600'
    'bg-purple-700' = 'bg-secondary-700'
    
    'border-purple-50' = 'border-secondary-50'
    'border-purple-100' = 'border-secondary-100'
    'border-purple-200' = 'border-secondary-200'
    'border-purple-300' = 'border-secondary-300'
    'border-purple-500' = 'border-secondary-500'
    
    # Indigo -> Primary
    'text-indigo-50' = 'text-primary-50'
    'text-indigo-100' = 'text-primary-100'
    'text-indigo-200' = 'text-primary-200'
    'text-indigo-300' = 'text-primary-300'
    'text-indigo-400' = 'text-primary-400'
    'text-indigo-500' = 'text-primary-500'
    'text-indigo-600' = 'text-primary-600'
    'text-indigo-700' = 'text-primary-700'
    
    'bg-indigo-50' = 'bg-primary-50'
    'bg-indigo-100' = 'bg-primary-100'
    'bg-indigo-200' = 'bg-primary-200'
    'bg-indigo-300' = 'bg-primary-300'
    'bg-indigo-400' = 'bg-primary-400'
    'bg-indigo-500' = 'bg-primary-500'
    'bg-indigo-600' = 'bg-primary-600'
    
    'border-indigo-200' = 'border-primary-200'
    'border-indigo-500' = 'border-primary-500'
    
    # Gradients
    'from-blue-400' = 'from-secondary-400'
    'from-blue-500' = 'from-secondary-500'
    'from-blue-600' = 'from-secondary-600'
    'to-blue-400' = 'to-secondary-400'
    'to-blue-500' = 'to-secondary-500'
    'to-blue-600' = 'to-secondary-600'
    'via-blue-400' = 'via-secondary-400'
    'via-blue-500' = 'via-secondary-500'
    
    'from-purple-400' = 'from-secondary-400'
    'from-purple-500' = 'from-secondary-500'
    'from-purple-600' = 'from-secondary-600'
    'to-purple-400' = 'to-secondary-400'
    'to-purple-500' = 'to-secondary-500'
    'to-purple-600' = 'to-secondary-600'
    'via-purple-500' = 'via-secondary-500'
    
    'from-indigo-400' = 'from-primary-400'
    'from-indigo-500' = 'from-primary-500'
    'to-indigo-500' = 'to-primary-500'
}

# Get all files
$files = Get-ChildItem -Path app,components -Recurse -Include *.tsx,*.ts -File
$totalFiles = $files.Count
$modifiedFiles = 0
$totalReplacements = 0

Write-Host "Found $totalFiles files to process`n" -ForegroundColor Green

# Process each file
$i = 0
foreach ($file in $files) {
    $i++
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if (-not $content) { continue }
    
    $modified = $false
    $fileReplacements = 0
    
    foreach ($old in $replacements.Keys) {
        if ($content -match [regex]::Escape($old)) {
            $count = ([regex]::Matches($content, [regex]::Escape($old))).Count
            $content = $content -replace [regex]::Escape($old), $replacements[$old]
            $modified = $true
            $fileReplacements += $count
        }
    }
    
    if ($modified) {
        Set-Content $file.FullName -Value $content -NoNewline
        $modifiedFiles++
        $totalReplacements += $fileReplacements
        Write-Host "[$i/$totalFiles] Fixed: $($file.Name) ($fileReplacements changes)" -ForegroundColor Yellow
    }
    
    # Progress indicator
    if ($i % 50 -eq 0) {
        Write-Host "Progress: $i/$totalFiles files processed..." -ForegroundColor Cyan
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Files processed: $totalFiles" -ForegroundColor White
Write-Host "Files modified: $modifiedFiles" -ForegroundColor Yellow
Write-Host "Total replacements: $totalReplacements" -ForegroundColor Cyan
Write-Host "`nYour design system is now unified! 🎉" -ForegroundColor Green
