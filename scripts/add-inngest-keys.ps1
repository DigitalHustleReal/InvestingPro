# PowerShell Script to Add Inngest Keys to .env.local
# Run: .\scripts\add-inngest-keys.ps1

$envFile = ".env.local"
$eventKey = "EJhfpQ-6Vc60U3ziqwd1O4QsAQ13BGelG_F93VPSZjmpIesnhsx6cmXeRk9ndpgChp7jI-7svdgXVqBr51Yq1g"
$signingKey = "signkey-prod-87bbb2bb3a6f761c51cedfb5491a239e754b363f1ca7c8fb5bdfc33a0bd03f29"

Write-Host "🔑 Adding Inngest API Keys to .env.local..." -ForegroundColor Cyan

# Check if .env.local exists
if (Test-Path $envFile) {
    Write-Host "✅ Found .env.local file" -ForegroundColor Green
    
    # Read current content
    $content = Get-Content $envFile -Raw
    
    # Check if keys already exist
    if ($content -match "INNGEST_EVENT_KEY") {
        Write-Host "⚠️  INNGEST_EVENT_KEY already exists. Updating..." -ForegroundColor Yellow
        $content = $content -replace "INNGEST_EVENT_KEY=.*", "INNGEST_EVENT_KEY=$eventKey"
    } else {
        Write-Host "➕ Adding INNGEST_EVENT_KEY..." -ForegroundColor Green
        $content += "`n# Inngest Configuration`nINNGEST_EVENT_KEY=$eventKey`n"
    }
    
    if ($content -match "INNGEST_SIGNING_KEY") {
        Write-Host "⚠️  INNGEST_SIGNING_KEY already exists. Updating..." -ForegroundColor Yellow
        $content = $content -replace "INNGEST_SIGNING_KEY=.*", "INNGEST_SIGNING_KEY=$signingKey"
    } else {
        Write-Host "➕ Adding INNGEST_SIGNING_KEY..." -ForegroundColor Green
        $content += "INNGEST_SIGNING_KEY=$signingKey`n"
    }
    
    # Write back
    Set-Content -Path $envFile -Value $content -NoNewline
    Write-Host "✅ Keys added to .env.local" -ForegroundColor Green
} else {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    $content = @"
# Inngest Configuration
INNGEST_EVENT_KEY=$eventKey
INNGEST_SIGNING_KEY=$signingKey
"@
    Set-Content -Path $envFile -Value $content
    Write-Host "✅ Created .env.local with Inngest keys" -ForegroundColor Green
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Restart your dev server (if running)" -ForegroundColor White
Write-Host "2. Run: npx tsx scripts/verify-inngest-setup.ts" -ForegroundColor White
Write-Host "3. Test the API endpoint" -ForegroundColor White
