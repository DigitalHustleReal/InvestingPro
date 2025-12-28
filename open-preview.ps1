# Open preview in default browser
Write-Host "Opening preview in browser..." -ForegroundColor Green

$url = "http://localhost:3000"

# Check if server is running
$response = try {
    Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    $true
} catch {
    $false
}

if ($response) {
    Write-Host "Server is running! Opening browser..." -ForegroundColor Green
    Start-Process $url
} else {
    Write-Host "Server is not responding. Starting dev server..." -ForegroundColor Yellow
    Write-Host "Please run 'npm run dev' in another terminal first." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or run this command to start it:" -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor White
}


