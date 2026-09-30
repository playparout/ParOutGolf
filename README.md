# Par Out Golf — private preview build

Static export of the site, password-gated for private review.

**Password:** `POG123` (stored in the browser after first entry; clear site data to see the gate again.)

## Hosting
Hosted on Netlify (project `parout-golf`) at https://parout.golf. Netlify deploys
automatically whenever `main` changes; pull requests get a preview link. There is
no build step — Netlify publishes the repo root as-is.

DNS is managed at Porkbun: an ALIAS record for `parout.golf` pointing to
`apex-loadbalancer.netlify.com`, and a CNAME for `www` pointing to
`parout-golf.netlify.app`.

## Files
- index.html, faq.html, privacy.html, terms.html — the four pages
- support.js, fonts/, assets/ — required; keep the folder structure intact
- robots.txt — blocks search engines while the site is private; at launch replace with
  `User-agent: *`, `Allow: /`, `Sitemap: https://parout.golf/sitemap.xml`
- sitemap.xml — list of pages for search engines (at the root, where robots.txt points)
- 404.html — branded "page not found" page (Netlify serves it for any missing URL; uses root-absolute paths so it works at any depth)
- favicon.ico, assets/favicon.svg, assets/apple-touch-icon.png — site icons

## Note on the password
This is a client-side gate: it hides the site from the public, but anyone who views
the page source can get past it. Fine for partner review, not a substitute for real
auth. Before launch, delete the gate script block at the top of each page's <head>
and remove robots.txt (or replace it with the live one).
