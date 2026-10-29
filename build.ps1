# Builds the three versions of the HELENI site from nagariyat-haleni-demo.html:
#   site\          ready to upload to hosting (local fonts, external script, security headers)
#   heleni-site.html  single file with photos inside, for sending or opening locally
#   artifact\heleni.html  copy for the private claude.ai preview link
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$utf8 = New-Object Text.UTF8Encoding $false
$src = [IO.File]::ReadAllText("$PWD\nagariyat-haleni-demo.html", [Text.Encoding]::UTF8)

# ---------- 1) hosting folder ----------
$site = $src
# fonts from our own server instead of Google
$site = [regex]::Replace($site, '(?s)<link rel="preconnect" href="https://fonts.googleapis.com">.*?display=swap">', '<link rel="stylesheet" href="fonts/fonts.css">')
$site = $site.Replace('<p>האתר טוען גופנים משירות Google Fonts, ולכן כתובת ה־IP של הדפדפן נחשפת לגוגל בעת הטעינה.</p>', '<p>האתר לא טוען תוכן משירותים חיצוניים. כל הקבצים, כולל הגופנים, מוגשים מהשרת של האתר.</p>')
# move the page script to its own file so the security policy can forbid inline scripts
$m = [regex]::Match($site, '(?s)<script>\s*(\(function\(\)\{.*?\}\)\(\);)\s*</script>')
if (-not $m.Success) { throw 'page script not found' }
[IO.File]::WriteAllText("$PWD\site\main.js", $m.Groups[1].Value, $utf8)
$site = $site.Replace($m.Value, '<script src="main.js" defer></script>')
New-Item -ItemType Directory -Force site\images | Out-Null
Copy-Item images\p*.jpg site\images\ -Force
Copy-Item og-image.jpg site\ -Force
[IO.File]::WriteAllText("$PWD\site\index.html", $site, $utf8)

$headers = @'
/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin
'@
[IO.File]::WriteAllText("$PWD\site\_headers", $headers, $utf8)

# ---------- 2) single file ----------
$one = $src
foreach ($n in 1..8) {
  $b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("$PWD\images\p$n.jpg"))
  $one = $one.Replace("images/p$n.jpg", "data:image/jpeg;base64,$b64")
}
[IO.File]::WriteAllText("$PWD\heleni-site.html", $one, $utf8)

# ---------- 3) artifact copy ----------
$a = $one -replace '<!doctype html>\s*','' -replace '<html[^>]*>\s*','' -replace '</html>\s*','' -replace '<head>\s*','' -replace '</head>\s*','' -replace '<meta charset="utf-8">\s*','' -replace '<meta name="viewport"[^>]*>\s*',''
$a = $a.Replace('<body>','<div dir="rtl" lang="he">').Replace('</body>','</div>')
New-Item -ItemType Directory -Force artifact | Out-Null
[IO.File]::WriteAllText("$PWD\artifact\heleni.html", $a, $utf8)
Copy-Item og-image.jpg artifact\ -Force

"built: site\, heleni-site.html, artifact\heleni.html"
