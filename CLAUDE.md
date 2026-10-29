# HELENI website

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
