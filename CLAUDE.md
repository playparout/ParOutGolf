# Working on the Par Out Golf site

Static site (no build step), hosted on Netlify. See README.md for hosting and page files.
Netlify publishes the repo root as-is, so anything in this file is publicly readable — keep secrets out.

## How the owner likes to work

- Make the requested change, then send desktop (1440px) and phone (390px) screenshots before anything goes live.
- Keep all changes on one working branch and one pull request. Open a PR (which creates a Netlify
  preview link) only when the owner asks — merges to `main` cost Netlify deploy credits, previews don't.
- While reviewing on a preview, the password gate may be removed. **Always restore it before merging to
  `main`** unless the owner says the site is launching. The gate is the `<script>` block right after
  `<meta name="robots">` in each page's `<head>` (index, faq, privacy, terms, 404).
- Point out anything inconsistent, repeated, or factually shaky as you go, and recommend a fix.

## Copy conventions

- Short "X. Y." slogan headlines: capitalize each word and end with a period
  ("Book. Unlock. Play.", "Precision Tech. Honest Rates.", "Your Coach. Your Schedule.").
- Full-sentence headlines: normal sentence case with a period ("Tell us what league you want.").
- Buttons, league-card options and labels: sentence case ("Join the list", "Stroke play", "6 weeks").
- Small mono labels are written in capitals in the source (e.g. "PER BAY · PER HOUR").
- US spelling ("specialty"). Use curly apostrophes (’) in body copy.
- "Up to 4 players" appears only in the hero stats, the Rates intro and the FAQ — don't add it elsewhere.
- The public low rate is $35/hr (Night Owl); $25/hr is the member rate — label it "for members".

## Where things live

- Nearly all content is in `index.html`. Several sections render from JS data near the bottom of the file:
  league card questions (`BALLOT`), Technology tabs (`techVals()`), rate toggle notes.
- Trackman logo: `assets/powered-by-trackman-reversed.svg` (orange mark, white text, for dark backgrounds),
  centered at the bottom of the Technology section.
- Arrow and close icons: the site fonts don't include ← → ↗ ✕, so never type those symbols. Copy an
  existing inline `<svg>` icon (16×16 viewBox, `stroke="currentColor"`, sized at `1em`) instead. Its path is:
  ← `M13 8H3M7 4L3 8l4 4` (back links), → `M3 8h10M9 4l4 4-4 4`, ↗ `M4.5 11.5l7-7M6 4.5h5.5V10`,
  ✕ `M4 4l8 8M12 4l-8 8`.
- Phone number (518) 727-3442 is always a tap-to-call link (`tel:+15187273442`), on every page.

## Taking screenshots in a cloud session

The pages load React/Babel from unpkg.com, which may be blocked. Install the same versions from npm into a
scratch folder (`react@18.3.1 react-dom@18.3.1 @babel/standalone@7.29.0`), serve the repo with
`python3 -m http.server`, and in Playwright route `unpkg.com` requests to the local `node_modules` files.
Set `localStorage.pog_preview_ok = '1'` (e.g. via `addInitScript`) to get past the password gate.
Start the server in the same shell command as the screenshot script — background servers get cleaned up.
