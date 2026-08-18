# Runs the local checks required before staging deployment.
$ErrorActionPreference = 'Stop'

Write-Host 'Building public website...'
npm run build --prefix savrion-website

Write-Host 'Building admin panel...'
npm run build --prefix admin-panel/frontend

Write-Host 'Checking backend scripts...'
node --check admin-panel/backend/server.js
npm run verify-backup --prefix admin-panel/backend

Write-Host 'Preflight checks passed.'
