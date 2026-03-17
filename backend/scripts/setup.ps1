Param(
  [string]$DatabaseUrl = ""
)

$ErrorActionPreference = "Stop"

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Split-Path -Parent $here
$envFile = Join-Path $backend ".env"
$exampleEnvFile = Join-Path $backend ".env.example"

Write-Host "HealthEase backend setup" -ForegroundColor Cyan

if (-not (Test-Path $envFile)) {
  if (Test-Path $exampleEnvFile) {
    Copy-Item $exampleEnvFile $envFile
    Write-Host "Created backend/.env from .env.example" -ForegroundColor Green
  } else {
    New-Item -ItemType File -Path $envFile | Out-Null
    Write-Host "Created empty backend/.env" -ForegroundColor Yellow
  }
}

if ($DatabaseUrl -ne "") {
  $envText = Get-Content $envFile -Raw
  if ($envText -match "DATABASE_URL=") {
    $envText = [regex]::Replace($envText, "(?m)^DATABASE_URL=.*$", "DATABASE_URL=`"$DatabaseUrl`"")
  } else {
    $envText = $envText.TrimEnd() + "`r`nDATABASE_URL=`"$DatabaseUrl`"`r`n"
  }
  Set-Content -Path $envFile -Value $envText -Encoding UTF8
  Write-Host "Updated DATABASE_URL in backend/.env" -ForegroundColor Green
} else {
  Write-Host "Tip: pass -DatabaseUrl to write DATABASE_URL into backend/.env" -ForegroundColor DarkGray
}

Push-Location $backend

Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

Write-Host "Creating/updating tables with Prisma (db push)..." -ForegroundColor Cyan
npx prisma db push

Write-Host "Seeding demo data..." -ForegroundColor Cyan
npm run seed

Write-Host "Done. Start the API with: npm run dev" -ForegroundColor Green

Pop-Location

