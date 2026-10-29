// Builds the HELENI site from nagariyat-haleni-demo.html (the only file you edit).
// Netlify runs this on every push, so edits made on GitHub (even from a phone) go live.
//   site/                 what Netlify publishes (local fonts, external script, security headers)
//   heleni-site.html      single file with photos inside, for sending or opening locally
//   artifact/heleni.html  copy for the private claude.ai preview link
// Run locally with:  node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.dirname(fileURLToPath(import.meta.url)));
const read = (f) => fs.readFileSync(f, 'utf8');
const write = (f, s) => fs.writeFileSync(f, s, 'utf8');
const src = read('nagariyat-haleni-demo.html');

// ---------- 1) hosting folder ----------
let site = src;
// fonts from our own server instead of Google
site = site.replace(
  /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">[\s\S]*?display=swap">/g,
  '<link rel="stylesheet" href="fonts/fonts.css">'
);
site = site.replaceAll(
  '<p>האתר טוען גופנים משירות Google Fonts, ולכן כתובת ה־IP של הדפדפן נחשפת לגוגל בעת הטעינה.</p>',
  '<p>האתר לא טוען תוכן משירותים חיצוניים. כל הקבצים, כולל הגופנים, מוגשים מהשרת של האתר.</p>'
);
// move the page script to its own file so the security policy can forbid inline scripts
const m = site.match(/<script>\s*(\(function\(\)\{[\s\S]*?\}\)\(\);)\s*<\/script>/);
if (!m) throw new Error('page script not found');
fs.mkdirSync('site/images', { recursive: true });
write('site/main.js', m[1]);
site = site.replaceAll(m[0], '<script src="main.js" defer></script>');
// every photo and icon in images/ goes to the site
for (const f of fs.readdirSync('images')) fs.copyFileSync(path.join('images', f), path.join('site/images', f));
fs.copyFileSync('og-image.jpg', 'site/og-image.jpg');
write('site/index.html', site);

const headers = `/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin`;
write('site/_headers', headers);

// Netlify only needs the site folder
if (process.env.NETLIFY) {
  console.log('built: site/');
  process.exit(0);
}

// ---------- 2) single file ----------
let one = src;
for (let n = 1; n <= 8; n++) {
  const b64 = fs.readFileSync(`images/p${n}.jpg`).toString('base64');
  one = one.replaceAll(`images/p${n}.jpg`, `data:image/jpeg;base64,${b64}`);
}
write('heleni-site.html', one);

// ---------- 3) artifact copy ----------
let a = one
  .replace(/<!doctype html>\s*/gi, '')
  .replace(/<html[^>]*>\s*/gi, '')
  .replace(/<\/html>\s*/gi, '')
  .replace(/<head>\s*/gi, '')
  .replace(/<\/head>\s*/gi, '')
  .replace(/<meta charset="utf-8">\s*/gi, '')
  .replace(/<meta name="viewport"[^>]*>\s*/gi, '');
a = a.replaceAll('<body>', '<div dir="rtl" lang="he">').replaceAll('</body>', '</div>');
fs.mkdirSync('artifact', { recursive: true });
write('artifact/heleni.html', a);
fs.copyFileSync('og-image.jpg', 'artifact/og-image.jpg');

console.log('built: site/, heleni-site.html, artifact/heleni.html');
