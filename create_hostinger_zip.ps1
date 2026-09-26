$src = "c:\Users\NoxiePC\Desktop\guardalo-frontend (2)\guardalo-backend-zip"
$destZip = "c:\Users\NoxiePC\Desktop\guardalo-frontend (2)\guardalo-backend-hostinger.zip"
$tempDir = "c:\Users\NoxiePC\Desktop\guardalo-frontend (2)\temp-deploy-backend"

if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
if (Test-Path $destZip) {
    Remove-Item -Force $destZip
}

New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy necessary directories
$dirs = @('app', 'bootstrap', 'config', 'database', 'public', 'resources', 'routes', 'storage', 'vendor')
foreach ($d in $dirs) {
    Copy-Item -Path "$src\$d" -Destination "$tempDir\$d" -Recurse -Force
}

# Copy files
$files = @('artisan', 'composer.json', 'composer.lock', 'server.php', '.htaccess')
foreach ($f in $files) {
    if (Test-Path "$src\$f") {
        Copy-Item -Path "$src\$f" -Destination "$tempDir\$f" -Force
    }
}

# Copy .env.production.hostinger as .env
Copy-Item -Path "$src\.env.production.hostinger" -Destination "$tempDir\.env" -Force

# Create storage directory structure if empty
@('storage\app', 'storage\framework\cache', 'storage\framework\sessions', 'storage\framework\views', 'storage\logs') | ForEach-Object {
    $p = "$tempDir\$_"
    if (-not (Test-Path $p)) {
        New-Item -ItemType Directory -Path $p -Force | Out-Null
    }
}

Write-Host "Compressing to $destZip..."
Compress-Archive -Path "$tempDir\*" -DestinationPath $destZip -Force -CompressionLevel Optimal

Remove-Item -Recurse -Force $tempDir
$zipSize = (Get-Item $destZip).Length / 1MB
Write-Host ("SUCCESS: Created $destZip (" + [math]::Round($zipSize, 2) + " MB)")
