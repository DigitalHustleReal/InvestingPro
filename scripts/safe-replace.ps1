# Safe Bulk Replace Script with Backup & Validation
# Usage: .\scripts\safe-replace.ps1 -Pattern "old" -Replacement "new" -Path "components/**/*.tsx"

param(
    [Parameter(Mandatory=$true)]
    [string]$Pattern,
    
    [Parameter(Mandatory=$true)]
    [string]$Replacement,
    
    [Parameter(Mandatory=$false)]
    [string]$Path = "components/**/*.tsx",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Failure { Write-Host $args -ForegroundColor Red }

Write-Info "🔄 Safe Bulk Replace Script"
Write-Info "Pattern: $Pattern"
Write-Info "Replacement: $Replacement"
Write-Info "Path: $Path"
Write-Info ""

# 1. CREATE BACKUP
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = ".backups/$timestamp"

if (-not $DryRun) {
    Write-Info "📦 Creating backup in $backupDir..."
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
    
    Get-ChildItem $Path -Recurse -File | ForEach-Object {
        $relativePath = $_.FullName.Replace((Get-Location).Path + "\", "")
        $destPath = Join-Path $backupDir $relativePath
        $destDir = Split-Path $destPath -Parent
        
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        }
        
        Copy-Item $_.FullName $destPath -Force
    }
    Write-Success "✅ Backup created"
}

# 2. PERFORM REPLACEMENT WITH VALIDATION
$filesProcessed = 0
$filesSkipped = 0
$filesUpdated = 0

Write-Info ""
Write-Info "🔍 Processing files..."

Get-ChildItem $Path -Recurse -File | ForEach-Object {
    $filesProcessed++
    $filePath = $_.FullName
    $fileName = $_.Name
    
    try {
        $originalContent = Get-Content $filePath -Raw -ErrorAction Stop
        $originalLength = $originalContent.Length
        
        # Skip empty files
        if ($originalLength -eq 0) {
            Write-Warning "⚠️  Skipped (empty): $fileName"
            $filesSkipped++
            return
        }
        
        # Perform replacement
        $newContent = $originalContent -replace $Pattern, $Replacement
        $newLength = $newContent.Length
        
        # Validation checks
        $isValid = $true
        $reason = ""
        
        # Check 1: File not drastically reduced
        if ($newLength -lt ($originalLength * 0.5)) {
            $isValid = $false
            $reason = "File reduced by more than 50%"
        }
        
        # Check 2: File not empty
        if ($newLength -lt 50) {
            $isValid = $false
            $reason = "File would become too small"
        }
        
        # Check 3: Still contains export
        if ($fileName -like "*.tsx" -and $newContent -notmatch "export") {
            $isValid = $false
            $reason = "No export statement found after replacement"
        }
        
        # Check 4: No change needed
        if ($originalContent -eq $newContent) {
            Write-Info "  ⏭️  No change: $fileName"
            return
        }
        
        if ($DryRun) {
            if ($isValid) {
                Write-Success "  ✅ Would update: $fileName ($originalLength → $newLength bytes)"
                $filesUpdated++
            } else {
                Write-Failure "  ❌ Would SKIP: $fileName [$reason]"
                $filesSkipped++
            }
        } else {
            if ($isValid) {
                Set-Content $filePath -Value $newContent -NoNewline -ErrorAction Stop
                Write-Success "  ✅ Updated: $fileName ($originalLength → $newLength bytes)"
                $filesUpdated++
            } else {
                Write-Failure "  ❌ SKIPPED: $fileName [$reason]"
                $filesSkipped++
            }
        }
        
    } catch {
        Write-Failure "  ❌ ERROR: $fileName - $($_.Exception.Message)"
        $filesSkipped++
    }
}

# 3. RUN TYPE CHECK
Write-Info ""
if (-not $DryRun -and $filesUpdated -gt 0) {
    Write-Info "🔍 Running type check..."
    
    $typeCheckResult = & npm run type-check 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "❌ Type check FAILED! Rolling back..."
        Write-Info ""
        Write-Info "Restoring from backup..."
        
        Get-ChildItem "$backupDir\*" -Recurse -File | ForEach-Object {
            $relativePath = $_.FullName.Replace("$backupDir\", "")
            $destPath = Join-Path (Get-Location) $relativePath
            Copy-Item $_.FullName $destPath -Force
        }
        
        Write-Success "✅ Files restored from backup"
        Write-Failure "❌ Operation FAILED - changes rolled back"
        exit 1
    }
    
    Write-Success "✅ Type check passed"
}

# 4. SUMMARY
Write-Info ""
Write-Info "📊 Summary:"
Write-Info "  Files processed: $filesProcessed"
Write-Success "  Files updated: $filesUpdated"
Write-Warning "  Files skipped: $filesSkipped"

if ($DryRun) {
    Write-Warning ""
    Write-Warning "🔍 DRY RUN MODE - No files were actually modified"
    Write-Info "Run without -DryRun to apply changes"
} else {
    if ($filesUpdated -gt 0) {
        Write-Success ""
        Write-Success "✅ Operation completed successfully!"
        Write-Info "Backup location: $backupDir"
    }
}
