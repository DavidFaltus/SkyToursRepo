param(
    [switch]$SkipInstall
)

$ScriptDir = $PSScriptRoot
if (-not $ScriptDir) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
}
$StaticDir = Resolve-Path (Join-Path $ScriptDir "..")
Write-Host "Prepinam do adresare $StaticDir" -ForegroundColor Cyan
Set-Location $StaticDir

if (-not $SkipInstall) {
    Write-Host "Zjistuji pritomnost frameworku Jest a jsdom..." -ForegroundColor Yellow
    if (!(Test-Path "node_modules\jest") -or !(Test-Path "node_modules\babel-jest") -or !(Test-Path "node_modules\jest-environment-jsdom")) {
        Write-Host "Instaluji Jest, Babel a JSDOM zavislosti jako devDependency..." -ForegroundColor Cyan
        npm install --save-dev jest babel-jest @babel/core @babel/preset-env jest-environment-jsdom
    } else {
        Write-Host "Jest, Babel a JSDOM jsou jiz nainstalovany." -ForegroundColor Green
    }
}

Write-Host "Spoustim testy..." -ForegroundColor Cyan

# Spusteni jest testu ve slozce tests
npx jest tests/

if ($LASTEXITCODE -eq 0) {
    Write-Host "Vsechny testy probehly uspesne!" -ForegroundColor Green
} else {
    Write-Host "Nektere testy selhaly. Zkontrolujte vystup vyse." -ForegroundColor Red
}
