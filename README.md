# Par Out Golf — private preview build

Static export of the site, password-gated for private review.

**Password:** `POG123` (stored in the browser after first entry; clear site data to see the gate again.)

## Deploy to GitHub Pages
1. Create a repo (public repos are fine — the gate keeps casual visitors out).
2. Upload the entire contents of this folder to the repo root (index.html must be at the top level).
3. Settings → Pages → Source: "Deploy from a branch" → branch `main`, folder `/ (root)` → Save.
4. Wait ~1 minute, then open https://<user>.github.io/<repo>/

## Files
- index.html, faq.html, privacy.html, terms.html — the four pages
- support.js, fonts/, assets/ — required; keep the folder structure intact
- robots.txt — blocks search engines while the site is private
- .nojekyll — stops GitHub from reprocessing the files
- 404.html — redirects stray URLs to the homepage

## Note on the password
This is a client-side gate: it hides the site from the public, but anyone who views
the page source can get past it. Fine for partner review, not a substitute for real
auth. Before launch, delete the gate script block at the top of each page's <head>
and remove robots.txt (or replace it with the live one).
