# Script para iniciar el Backend de Guardalo.com (Laravel API)
$phpExe = "C:\Users\NoxiePC\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.1_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Iniciando Backend Guardalo.com (Puerto 8080)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Set-Location $PSScriptRoot
& $phpExe artisan serve --port=8080
