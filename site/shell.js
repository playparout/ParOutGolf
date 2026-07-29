/* Par Out — shared shell: nav + footer + email capture injected into every page */
/* Usage: <header data-nav></header> and <footer data-foot></footer> + <script src="shell.js"></script> */

(function () {
  /* ============================================================
     PRE-LAUNCH PASSWORD GATE — temporary, remove when the site goes live.
     Blocks the page behind a simple password screen. Not real security
     (the password ships in this file) — just keeps casual visitors and
     search engines out before launch. Session persists per-browser via
     sessionStorage, so a phone can be unlocked once and reused.
     TO REMOVE AT LAUNCH: delete this block (down to the matching
     END PASSWORD GATE marker) and the CSS to go with it is self-contained
     below — nothing else in the site depends on it.
     ============================================================ */
  const GATE_PASSWORD = 'paroutpreview';
  const GATE_KEY = 'parout-gate-ok';
  if (sessionStorage.getItem(GATE_KEY) !== '1') {
    document.documentElement.style.visibility = 'hidden';
    const show = () => {
      document.documentElement.style.visibility = '';
      const overlay = document.createElement('div');
      overlay.innerHTML = `
        <div style="position:fixed;inset:0;z-index:99999;background:#251E1E;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,sans-serif;">
          <form id="gate-form" style="background:#FDF5E6;border-radius:16px;padding:40px 32px;max-width:360px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.4);">
            <div style="font-weight:700;font-size:20px;color:#251E1E;margin-bottom:6px;">Par Out Golf</div>
            <p style="font-size:14px;color:#251E1E;opacity:.7;margin:0 0 20px;">Preview build — enter the password to continue.</p>
            <input id="gate-input" type="password" placeholder="Password" autocomplete="off" style="width:100%;box-sizing:border-box;padding:12px 14px;border-radius:8px;border:1px solid #251E1E33;font-size:16px;margin-bottom:12px;">
            <button type="submit" style="width:100%;padding:12px 14px;border:none;border-radius:8px;background:#05805B;color:#fff;font-size:16px;font-weight:600;cursor:pointer;">Enter</button>
            <p id="gate-error" style="color:#A84D0D;font-size:13px;margin:12px 0 0;visibility:hidden;">Incorrect password — try again.</p>
          </form>
        </div>`;
      document.body.appendChild(overlay);
      const form = document.getElementById('gate-form');
      const input = document.getElementById('gate-input');
      const err = document.getElementById('gate-error');
      input.focus();
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value === GATE_PASSWORD) {
          sessionStorage.setItem(GATE_KEY, '1');
          overlay.remove();
        } else {
          err.style.visibility = 'visible';
          input.value = '';
          input.focus();
        }
      });
    };
    if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
  }
  /* -- END PASSWORD GATE ------------------------------------------------ */

  /* ============================================================
     SITE LINKS — SINGLE SOURCE OF TRUTH.
     Fill these in once you have the real URLs. Every external
     button on the site is tagged data-cta="<key>" and wired up
     from here automatically — you never edit individual pages.
     A value left as '#' keeps that button inert (no link yet).
     ============================================================ */
  const LINKS = {
    book:   '#',  // TODO: Alba Play — bay booking          ("Book a bay")
    lesson: '#',  // TODO: Alba Play — lesson booking        ("Book a lesson")
    join:   '#',  // TODO: Alba Play — membership signup     ("Join / Go annual / Start monthly / founding spot")
    shop:   '#',  // TODO: Alba Play — punchcard/gift store  ("Buy on Alba / Open Alba shop")
    league: '#',  // TODO: league team signup                ("Sign up a team / Join a team")
    leaderboard: '#',  // TODO: Trackman live league leaderboard   ("View the live leaderboard")
  };
  const SOCIAL = {
    instagram: 'https://www.instagram.com/parout.golf/',
    facebook:  'https://www.facebook.com/profile.php?id=61590569169332',
  };

  /* ============================================================
     MAILERLITE — email signup. Fill in the two IDs below from your
     MailerLite *classic* embedded form snippet. In the embed code
     the subscribe URL looks like:
        https://assets.mailerlite.com/jsonp/123456/forms/789012/subscribe
                                            ^account        ^form
     Paste those two numbers here. Until both are set, the form
     just shows the friendly inline "thanks" without sending — so
     the site is safe to ship pre-launch.
     ============================================================ */
  const MAILERLITE = {
    account: '2458692',             // account ID (number after /jsonp/)
    form:    '190754754254604190',  // form ID (number after /forms/)
  };

  /* ============================================================
     GOOGLE ANALYTICS (GA4) — site traffic stats.
     Paste your Measurement ID below (looks like 'G-XXXXXXXXXX').
     Until it's set, nothing loads — the site is safe to ship
     without it. Once set, every page is tracked automatically.
     ============================================================ */
  const GA_ID = 'G-K7S36LVFBM';  // GA4 Measurement ID

  if (GA_ID && !/^G-X+$/i.test(GA_ID)) {
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }
  // NOTE: "Book a bay" links that point to #book (hero, nav, footer) intentionally
  // scroll down to the booking CTA band on the page — they are not external links.

  const ROUTES = [
    { href: 'rates.html',       label: 'Rates' },
    { href: 'memberships.html', label: 'Memberships' },
    { href: 'league.html',      label: 'Leagues' },
    { href: 'lessons.html',     label: 'Lessons' },
    { href: 'how-it-works.html',label: 'How it works' },
  ];
  const MORE_ROUTES = [
    { href: 'technology.html',     label: 'Technology' },
    { href: 'punchcards.html',     label: 'Punchcards & gift cards' },
    { href: 'private-events.html', label: 'Private events' },
    { href: 'faq.html',            label: 'FAQ' },
    { href: 'contact.html',        label: 'Contact' },
  ];

  const current = (location.pathname.split('/').pop() || 'index.html');

  /* -- NAV ------------------------------------------------------------- */
  const navMount = document.querySelector('[data-nav]');
  if (navMount) {
    navMount.innerHTML = `
      <a class="skip-link" href="#main">Skip to main content</a>
      <nav class="nav" aria-label="Main navigation">
        <div class="nav-bar">
        <div class="nav-in">
          <a href="index.html" class="brand">
            <img src="../assets/ParOut_Logo.svg" alt="">
            <span class="wm">Par&nbsp;Out</span>
          </a>
          <div class="nav-links" id="nav-links">
            ${ROUTES.map(r => `<a href="${r.href}"${current === r.href ? ' aria-current="page"' : ''}>${r.label}</a>`).join('')}
            <div class="nav-more">
              <button class="nav-more-btn" aria-controls="nav-more-menu" aria-expanded="false"${MORE_ROUTES.some(r => r.href === current) ? ' data-current="true"' : ''}>More <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg></button>
              <div class="nav-more-menu" id="nav-more-menu">
                ${MORE_ROUTES.map(r => `<a href="${r.href}"${current === r.href ? ' aria-current="page"' : ''}>${r.label}</a>`).join('')}
              </div>
            </div>
          </div>
          <div class="nav-cta">
            <a class="btn" href="#book">Book a bay</a>
            <button class="nav-menu-btn" aria-label="Open menu" aria-controls="nav-links" aria-expanded="false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
        </div>
        <div class="brand-stripe nav-stripe" aria-hidden="true"></div>
      </nav>
    `;
    const btn = navMount.querySelector('.nav-menu-btn');
    const links = navMount.querySelector('#nav-links');
    if (btn && links) btn.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    const more = navMount.querySelector('.nav-more');
    const moreBtn = navMount.querySelector('.nav-more-btn');
    if (more && moreBtn) {
      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = more.classList.toggle('open');
        moreBtn.setAttribute('aria-expanded', open);
      });
      document.addEventListener('click', (e) => {
        if (!more.contains(e.target)) { more.classList.remove('open'); moreBtn.setAttribute('aria-expanded', 'false'); }
      });
    }
    /* Escape closes either open menu and returns focus to its toggle. */
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (more && more.classList.contains('open')) {
        more.classList.remove('open');
        moreBtn.setAttribute('aria-expanded', 'false');
        moreBtn.focus();
      } else if (links && links.classList.contains('open')) {
        links.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open menu');
        btn.focus();
      }
    });
  }

  /* -- EMAIL CAPTURE + FOOTER ----------------------------------------- */
  const footMount = document.querySelector('[data-foot]');
  if (footMount) {
    footMount.innerHTML = `
      <section class="email-capture" id="stay-loop">
        <div class="email-capture-in">
          <div class="eyebrow">Stay in the loop</div>
          <h2>Early-bird slots. League start dates. Just info, no fluff.</h2>
          <p>Updates on discounts, league signups, and late-night specials. No spam, unsubscribe whenever.</p>
          <form class="email-form" id="ml-form" novalidate>
            <label for="email-capture-input" class="sr-only">Email address</label>
            <input id="email-capture-input" class="input" name="email" type="email" placeholder="you@example.com" required autocomplete="email">
            <button class="btn btn--hot" type="submit">Keep me posted</button>
          </form>
          <p class="sr-only" role="status"></p>
        </div>
      </section>
      <footer class="foot">
        <div class="foot-tracer" aria-hidden="true"></div>
        <div class="foot-in">
          <div>
            <a href="index.html" class="brand">
              <img src="../assets/ParOut_Logo.svg" alt="" style="height:48px">
              <span class="wm">Par&nbsp;Out</span>
            </a>
            <p class="foot-tag">A slice of the great indoors.<br>Open 24/7 in Loudonville, NY.</p>
            <div class="foot-socials">
              <a href="#" data-social="instagram" aria-label="Par Out on Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg></a>
              <a href="#" data-social="facebook" aria-label="Par Out on Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            </div>
          </div>
          <div class="foot-cols">
            <div class="foot-col">
              <div class="cap">Play</div>
              <a href="rates.html">Rates</a>
              <a href="memberships.html">Memberships</a>
              <a href="lessons.html">Lessons</a>
              <a href="punchcards.html">Punchcards</a>
              <a href="punchcards.html">Gift Cards</a>
            </div>
            <div class="foot-col">
              <div class="cap">Visit</div>
              <a href="how-it-works.html">How it works</a>
              <a href="faq.html">FAQ</a>
              <a href="technology.html">Technology</a>
              <a href="contact.html">Contact</a>
            </div>
            <div class="foot-col">
              <div class="cap">More</div>
              <a href="league.html">Leagues</a>
              <a href="private-events.html">Private events</a>
              <a href="#book">Book a bay</a>
            </div>
            <div class="foot-col">
              <div class="cap">Find us</div>
              <p><span style="white-space:nowrap;">457 Albany Shaker Rd</span><br>Albany, NY 12211<br><br>Open 24/7</p>
            </div>
          </div>
        </div>
        <div class="foot-btm">
          <span>© 2026 Par Out Golf · Loudonville, NY</span>
          <span class="foot-legal">
            <a href="privacy.html">Privacy</a>
            <a href="terms.html">Terms</a>
          </span>
          <span>Par Out, anytime.</span>
        </div>
      </footer>
    `;
  }

  /* -- MAILERLITE SUBMIT (JSONP, no backend) -------------------------- */
  function mlSubmit(email) {
    return new Promise((resolve, reject) => {
      if (!MAILERLITE.account || !MAILERLITE.form) { reject(new Error('not-configured')); return; }
      const cb = 'ml_cb_' + Date.now();
      const s = document.createElement('script');
      const timer = setTimeout(() => { cleanup(); reject(new Error('timeout')); }, 10000);
      function cleanup() { clearTimeout(timer); delete window[cb]; s.remove(); }
      window[cb] = (data) => { cleanup(); resolve(data); };
      const params = new URLSearchParams({ 'fields[email]': email, 'ml-submit': '1', 'anticsrf': 'true', 'callback': cb });
      s.src = `https://assets.mailerlite.com/jsonp/${MAILERLITE.account}/forms/${MAILERLITE.form}/subscribe?` + params.toString();
      s.onerror = () => { cleanup(); reject(new Error('network')); };
      document.body.appendChild(s);
    });
  }

  const mlForm = document.getElementById('ml-form');
  if (mlForm) {
    const btn = mlForm.querySelector('button');
    const status = mlForm.parentElement.querySelector('[role=status]');
    const original = btn.textContent;
    mlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!mlForm.reportValidity()) return;
      const email = mlForm.querySelector('input[type=email]').value.trim();
      btn.disabled = true; btn.textContent = 'Signing up…';
      const done = () => { btn.textContent = 'Signed up ✓'; if (status) status.textContent = 'Thanks — you are on the list.'; };
      const fail = () => { btn.disabled = false; btn.textContent = original; if (status) status.textContent = 'Hmm, that did not go through. Try again?'; };
      mlSubmit(email).then(done).catch((err) => { err.message === 'not-configured' ? done() : fail(); });
    });
  }

  /* -- MAIN LANDMARK: give <main> a focus target for the skip link -------- */
  const mainEl = document.querySelector('main');
  if (mainEl && !mainEl.id) {
    mainEl.id = 'main';
    mainEl.setAttribute('tabindex', '-1');
  }

  /* -- PLACEHOLDER BADGE ---------------------------------------------- */
  document.querySelectorAll('.is-placeholder').forEach(el => {
    if (el.querySelector('.ph-badge')) return;
    const badge = document.createElement('span');
    badge.className = 'ph-badge';
    badge.textContent = 'Image placeholder';
    el.appendChild(badge);
    /* Optional: a centered "recommended resolution" label so whoever supplies
       the real photo knows the target size. Opt in with data-ph-size="WxH". */
    const size = el.getAttribute('data-ph-size');
    if (size && !el.querySelector('.ph-size')) {
      const s = document.createElement('span');
      s.className = 'ph-size';
      s.innerHTML = '<b>' + size + '</b><small>Recommended · 4:3</small>';
      el.appendChild(s);
    }
  });

  /* -- WIRE EXTERNAL LINKS FROM CONFIG -------------------------------- */
  function applyUrl(el, url) {
    if (!url || url === '#') return;            // not set yet — leave inert
    el.setAttribute('href', url);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  }
  document.querySelectorAll('[data-cta]').forEach(el => applyUrl(el, LINKS[el.getAttribute('data-cta')]));
  document.querySelectorAll('[data-social]').forEach(el => applyUrl(el, SOCIAL[el.getAttribute('data-social')]));

  /* The nav/footer "Book a bay" links scroll to the #book band on the page.
     Pages without that band (e.g. 404) would otherwise have a dead #book
     anchor — point those at the home page's booking band instead. */
  if (!document.getElementById('book')) {
    document.querySelectorAll('a[href="#book"]').forEach(a => a.setAttribute('href', 'index.html#book'));
  }

  /* -- SHOT-TRACER MOTIF ----------------------------------------------
     Injects the brand shot-tracer (exact brand vector, inlined below) into
     hero motif slots as a static, fully-drawn graphic.
     To REMOVE from a page: delete its `<div class="rings">` hero element.
     To RESIZE: edit `.page-head .rings` / `.tech-hero .rings` width+height
     in site.css.
     ------------------------------------------------------------------- */
  const TRACER_SVG = `
    <svg viewBox="0 0 1546 3131" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M730.017 2592.64L724.164 2606.45L751.785 2618.15L757.639 2604.34L743.828 2598.49L730.017 2592.64ZM293.828 636.997C293.828 681.18 329.645 716.997 373.828 716.997C418.011 716.997 453.828 681.18 453.828 636.997C453.828 592.814 418.011 556.997 373.828 556.997C329.645 556.997 293.828 592.814 293.828 636.997ZM743.828 2598.49L757.639 2604.34C930.381 2196.77 1080.17 1767.29 1186.07 1377.95C1291.88 988.897 1354.16 638.859 1351.2 390.567C1349.72 266.708 1332.02 166.068 1293.64 98.5002C1274.3 64.4508 1249.43 38.3162 1218.34 22.2268C1187.2 6.10803 1151.02 0.688711 1110.15 6.11177C1029.19 16.8556 928.365 70.3259 805.594 170.895C682.424 271.792 535.536 421.471 362.35 627.34L373.828 636.997L385.307 646.653C557.87 441.523 703.42 293.374 824.605 194.103C946.19 94.5042 1041.64 45.4667 1114.1 35.8511C1149.94 31.0944 1179.75 36.0324 1204.55 48.8691C1229.41 61.7352 1250.42 83.1541 1267.55 113.317C1302.12 174.176 1319.74 268.597 1321.2 390.925C1324.12 635.007 1262.71 981.842 1157.12 1370.07C1051.61 1758.01 902.275 2186.21 730.017 2592.64L743.828 2598.49Z" fill="#F2C94C"></path>
      <path d="M719.33 964.498C719.33 1008.68 755.147 1044.5 799.33 1044.5C843.513 1044.5 879.33 1008.68 879.33 964.498C879.33 920.316 843.513 884.498 799.33 884.498C755.147 884.498 719.33 920.316 719.33 964.498ZM622.83 2610.5L637.073 2605.79C346.252 1725.58 221.866 948.336 253.826 576.069C261.847 482.633 279.537 417.593 304.629 382.523C316.869 365.416 330.097 356.497 344.01 353.738C358.071 350.95 375.452 353.933 396.905 365.905C440.428 390.194 495.228 448.433 560.905 548.469C626.237 647.978 701.222 787.085 785.702 970.766L799.33 964.498L812.958 958.231C728.138 773.812 652.445 633.234 585.984 532.004C519.868 431.299 461.76 367.743 411.524 339.708C386.098 325.519 361.386 319.708 338.175 324.311C314.815 328.943 295.591 343.598 280.231 365.067C250.124 407.147 232.026 479.259 223.935 573.503C191.445 951.961 317.409 1733.91 608.587 2615.2L622.83 2610.5Z" fill="#E06F1E"></path>
      <path d="M487.729 2705.31L495.027 2718.41L521.237 2703.82L513.939 2690.71L500.834 2698.01L487.729 2705.31ZM1385.83 824.001C1385.83 868.184 1421.65 904.001 1465.83 904.001C1510.02 904.001 1545.83 868.184 1545.83 824.001C1545.83 779.818 1510.02 744.001 1465.83 744.001C1421.65 744.001 1385.83 779.818 1385.83 824.001ZM500.834 2698.01L513.939 2690.71C281.916 2274.1 136.413 1924.32 70.8215 1640.54C5.16756 1356.49 20.057 1140.73 105.746 990.108C191.022 840.212 348.443 751.417 576.217 725.523C804.308 699.594 1101.26 737.059 1461.77 838.441L1465.83 824.001L1469.9 809.561C1107.66 707.694 806.425 669.16 572.828 695.715C338.913 722.307 171.146 814.48 79.6701 975.273C-11.3923 1135.34 -24.8164 1359.98 41.5922 1647.3C108.064 1934.88 254.998 2287.42 487.729 2705.31L500.834 2698.01Z" fill="#05805B"></path>
      <path d="M65.3281 1408.5C65.3281 1452.68 101.145 1488.5 145.328 1488.5C189.511 1488.5 225.328 1452.68 225.328 1408.5C225.328 1364.32 189.511 1328.5 145.328 1328.5C101.145 1328.5 65.3281 1364.32 65.3281 1408.5ZM841.328 2667.5L854.003 2675.52C1082.76 2314.07 1262.98 1998.16 1377.22 1741.56C1434.35 1613.26 1475.17 1499.36 1497.25 1401.72C1519.28 1304.32 1522.99 1221.71 1504.39 1156.75C1485.51 1090.85 1443.86 1043.91 1378.05 1018.96C1313.2 994.363 1225.96 991.492 1115.6 1010.07C894.79 1047.24 574.515 1171.54 138.483 1395.15L145.328 1408.5L152.173 1421.85C587.741 1198.47 904.578 1076.01 1120.58 1039.65C1228.63 1021.47 1309.73 1025.13 1367.41 1047.01C1424.14 1068.52 1459.21 1107.97 1475.55 1165.01C1492.15 1222.98 1489.53 1299.86 1467.99 1395.11C1446.5 1490.12 1406.5 1602.04 1349.82 1729.35C1236.46 1983.97 1057.15 2298.44 828.653 2659.48L841.328 2667.5Z" fill="#05805B"></path>
      <g class="base">
        <circle cx="698.828" cy="2855.5" r="265.5" fill="#FDF5E6" stroke="#FDF5E6" stroke-width="20"></circle>
        <path d="M911.683 2937C888.642 2939.14 878.261 2957.18 875.95 2965.93" stroke="#251E1E" stroke-width="7.56058" stroke-linecap="round"></path>
        <path d="M836.54 2930.54C813.957 2933.62 804.503 2951.81 802.599 2960.52" stroke="#251E1E" stroke-width="7.44652" stroke-linecap="round"></path>
        <path d="M771.993 2920.32C749.049 2923.45 739.443 2941.93 737.509 2950.78" stroke="#251E1E" stroke-width="7.56591" stroke-linecap="round"></path>
        <path d="M895.604 2878C873.026 2881.11 863.6 2899.32 861.709 2908.03" stroke="#251E1E" stroke-width="7.44652" stroke-linecap="round"></path>
        <path d="M832.006 2866.93C809.066 2870.09 799.488 2888.59 797.567 2897.44" stroke="#251E1E" stroke-width="7.56591" stroke-linecap="round"></path>
        <path d="M889.399 2827.11C866.252 2826.44 853.75 2843.1 850.392 2851.51" stroke="#251E1E" stroke-width="7.56591" stroke-linecap="round"></path>
        <path d="M851.747 2987.84C828.88 2991.39 819.625 3010.04 817.856 3018.92" stroke="#251E1E" stroke-width="7.56058" stroke-linecap="round"></path>
        <path d="M777.543 2982.45C754.969 2985.6 745.567 3003.81 743.688 3012.53" stroke="#251E1E" stroke-width="7.44652" stroke-linecap="round"></path>
        <path d="M712.054 2973.06C689.118 2976.25 679.566 2994.76 677.656 3003.62" stroke="#251E1E" stroke-width="7.56591" stroke-linecap="round"></path>
        <path d="M794.214 3039.95C771.298 3043.17 761.774 3061.67 759.877 3070.52" stroke="#251E1E" stroke-width="7.56058" stroke-linecap="round"></path>
        <path d="M720.642 3032.68C698.072 3035.85 688.692 3054.08 686.823 3062.8" stroke="#251E1E" stroke-width="7.44652" stroke-linecap="round"></path>
        <path d="M654.239 3024.09C631.307 3027.31 621.776 3045.83 619.877 3054.69" stroke="#251E1E" stroke-width="7.56591" stroke-linecap="round"></path>
        <path d="M688.328 2624L688.328 2484" stroke="#FDF5E6" stroke-width="15" stroke-linecap="round"></path>
        <path d="M688.328 2374L688.328 2234" stroke="#FDF5E6" stroke-width="15" stroke-linecap="round"></path>
        <path d="M688.328 2124L688.328 1984" stroke="#FDF5E6" stroke-width="15" stroke-linecap="round"></path>
        <path d="M688.328 1874L688.328 1734" stroke="#FDF5E6" stroke-width="15" stroke-linecap="round"></path>
        <path d="M688.328 1624L688.328 1484" stroke="#FDF5E6" stroke-width="15" stroke-linecap="round"></path>
        <path d="M688.328 1374L688.328 1234" stroke="#FDF5E6" stroke-width="15" stroke-linecap="round"></path>
        <path d="M688.328 1124L688.328 984" stroke="#FDF5E6" stroke-width="15" stroke-linecap="round"></path>
        <path d="M688.328 874L688.328 734" stroke="#FDF5E6" stroke-width="15" stroke-linecap="round"></path>
        <path d="M688.328 624L688.328 484" stroke="#FDF5E6" stroke-width="20" stroke-linecap="round"></path>
        <path d="M688.328 400L688.328 260" stroke="#FDF5E6" stroke-width="20" stroke-linecap="round"></path>
        <path d="M688.328 150L688.328 10" stroke="#FDF5E6" stroke-width="20" stroke-linecap="round"></path>
      </g>
    </svg>`;

  /* Hero slots, the footer anchor, and any cream brand-band all share the
     one tracer vector. To stop a slot getting it, remove its element. */
  document.querySelectorAll('.page-head > .rings, .tech-hero > .rings, .foot-tracer, .brand-band-tracer').forEach(function (ring) {
    /* Only fill empty slots — a page can opt out of the shared tracer by
       placing its own SVG inline (e.g. the league page's teed-ball motif). */
    if (!ring.querySelector('svg')) ring.innerHTML = TRACER_SVG;
  });

  /* -- LOCAL BUSINESS STRUCTURED DATA (sitewide, single source of truth) --
     One LocalBusiness/GolfCourse block injected on every page so Google sees
     consistent business identity (name, address, hours, price range) on every
     URL it crawls. `sameAs` (social profile links) auto-fills from the SOCIAL
     config above the moment those URLs are set — nothing else to edit.
     Page-specific schema (e.g. the FAQPage block on faq.html) lives inline on
     that page and coexists with this one. */
  (function injectBusinessSchema() {
    if (document.querySelector('script[data-ld="business"]')) return;
    const sameAs = Object.values(SOCIAL).filter(u => u && u !== '#');
    const biz = {
      "@context": "https://schema.org",
      "@type": ["SportsActivityLocation", "GolfCourse"],
      "@id": "https://parout.golf/#business",
      "name": "Par Out Golf",
      "description": "24/7 unstaffed indoor golf with Trackman simulators in the Loudonville neighborhood (Town of Colonie), Albany, NY.",
      "url": "https://parout.golf/",
      "image": "https://parout.golf/assets/og-image.jpg",
      "email": "support@parout.golf",
      "priceRange": "$$",
      "address": { "@type": "PostalAddress", "streetAddress": "457 Albany Shaker Rd", "addressLocality": "Albany", "addressRegion": "NY", "postalCode": "12211", "addressCountry": "US" },
      // geo — exact pin coordinates from the Google Maps listing.
      "geo": { "@type": "GeoCoordinates", "latitude": 42.70529108056403, "longitude": -73.77568081600789 },
      "hasMap": "https://maps.google.com/maps?q=457+Albany+Shaker+Rd,+Albany,+NY+12211",
      "logo": "https://parout.golf/assets/ParOut_Logo.svg",
      // "telephone": "+1XXXXXXXXXX",  // TODO: add once a booking/help number exists (must match GBP + Contact page exactly)
      "areaServed": [
        { "@type": "Place", "name": "Loudonville, NY" },
        { "@type": "Place", "name": "Colonie, NY" },
        { "@type": "Place", "name": "Albany, NY" },
        { "@type": "Place", "name": "Latham, NY" },
        { "@type": "Place", "name": "Newtonville, NY" },
        { "@type": "Place", "name": "Menands, NY" }
      ],
      "openingHoursSpecification": { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], "opens": "00:00", "closes": "23:59" },
      "amenityFeature": { "@type": "LocationFeatureSpecification", "name": "Trackman iO simulators", "value": true }
    };
    if (sameAs.length) biz.sameAs = sameAs;
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-ld', 'business');
    s.textContent = JSON.stringify(biz);
    document.head.appendChild(s);
  })();
})();
