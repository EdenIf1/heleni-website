# HELENI website

## Reminder for the owner (say this at the start of the next session on the computer)
- Set up Cloudflare Web Analytics (free, no cookies) so the owner can see visitor numbers:
  sign up at dash.cloudflare.com, Web Analytics > Add a site > heleni.netlify.app, then paste the beacon token.
  Adding it means: allow static.cloudflareinsights.com in script-src and cloudflareinsights.com in connect-src
  (the CSP lives in build.mjs), and update the privacy-policy sentence that says the site loads no external services.
  Remove this reminder once done.

## Netlify credits
The free plan has 300 credits a month (resets on the 28th); each production deploy costs about 15.
Batch changes and push to `main` only when the owner says to upload. Pushes that change only docs are skipped (see `ignore` in netlify.toml).

## "תעלה את זה לאתר" / "upload it to the site"
When the owner says to upload, publish or put a change on the site, it means:
commit the change and push it directly to `main` (no separate branch, no pull request).
Netlify publishes only `main`, so anything left on another branch never goes live.
After pushing, check the Netlify deploy finished (Deploys at app.netlify.com, or the live site at https://heleni.netlify.app).

## How the site is built
- Edit only `nagariyat-haleni-demo.html` (plus photos/icons in `images/`).
- Netlify runs `node build.mjs` on every push (see `netlify.toml`) and publishes `site/`.
- Never hand-edit files in `site/`; the build overwrites them.
- Locally, `node build.mjs` (or `build.ps1`) builds the same output for checking.
