# The build now lives in build.mjs (Netlify runs it on every push).
# This wrapper keeps the old command working on this computer.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
node build.mjs
