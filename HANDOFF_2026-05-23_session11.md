# HANDOFF — Session ⑪ (2026-05-23)

## TL;DR

Translation surface and `preview.html` discoverability — both operator
complaints from 2026-05-23 afternoon — are resolved. Three pages
(`preview.html`, `kings.html`, `play.html`, plus `mypage.html` from an
earlier sub-commit) are now fully on the 10-language `data-static-i18n`
+ per-file dict pattern. The legacy `.lang-en` / `.lang-ja` parallel-span
pattern is retired from those four pages. Every HTML except the orphan
`404.html` and `preview.html` itself now carries an inbound footer link
to `preview.html` (tiny dust-colored, `rel="nofollow noindex"`).

Six pages still use the legacy bilingual pattern: `entry.html`,
`how-it-works.html`, `risk.html`, `rules.html`, `money.html`,
`verify.html`. They render correctly today (the CSS show/hide rules in
`main.css` for `.lang-en` / `.lang-ja` are still in place) but cap at
en/ja. Migration is mechanical and can be done page-by-page in future
sessions.

## What was pushed this session

- `4c017ee` — v20260523e — preview.html rebuild + 10-lang preview UI +
  preview-link injection into 10 HTMLs + I18N_CONTENT dictionary
  extension + applyContentTranslations dual handling.
- `47a1a26` — v20260523f — mypage.html 10-lang dictionary +
  data-i18n-placeholder support.
- `036e8ff` — v20260523g — kings.html full 10-language i18n migration
  (KINGS_I18N dynamic dict, KINGS_STATIC_I18N static dict, 13
  data-static-i18n attrs, MutationObserver wired).
- `436c117` — v20260523h — play.html dictionaries injected
  (PLAY_I18N / PLAY_STATIC_I18N, applyPlayStaticI18n, observer; HTML
  not yet swapped).
- `9fdd0ee` — v20260523i — play.html HTML body fully swapped to
  data-static-i18n pattern (11 lang-pairs retired, stale `-ja` IDs
  removed, applier upgraded with dynamic-value cache replay).

Tip of `origin/main` is `9fdd0ee`. Cloudflare Pages auto-deploys on push.

## Pattern reference (for migrating the remaining 6 pages)

For each page that still has `<span class="lang-en">…</span> <span class="lang-ja">…</span>`:

1. **Inject two dicts inside the page's existing `<script>` block:**

   ```js
   const PAGE_I18N = { /* dynamic strings written by JS, keys = camelCase */ };
   const PAGE_STATIC_I18N = { /* HTML strings, keys = snake_case */ };
   // Each entry: { en, ja, ko, es, hi, vi, pt, id, th, fr }
   ```

2. **Add a `pick()` helper** that reads `document.documentElement.dataset.displayLang || 'en'` and returns the right localized string, falling back to `.en` then to the source.

3. **Replace every `<span class="lang-en">EN</span> <span class="lang-ja">JA</span>` pair** with a single element carrying `data-static-i18n="key"`. The element's existing HTML stays as English fallback.

4. **Add `applyPageStaticI18n()`** that walks `[data-static-i18n]` and swaps `innerHTML`. Run it on initial load (`setTimeout(applyPageStaticI18n, 0)`) and wire a `MutationObserver` on `document.documentElement` for `data-display-lang` attribute changes.

5. **If the static template contains IDs that JS writes to** (e.g. `<strong id="dormant-count">`), use the `window.__pageDynamic = { id: value }` cache + replay pattern from `play.html`'s `applyPlayStaticI18n` — the lang-swap rebuilds those inner IDs each time, wiping any one-shot writes.

6. **Verify:** `grep -cE 'class="lang-en"|class="lang-ja"' page.html` → 0; `node -e "new Function(<script body>)"` → OK.

7. **Bump cache buster** on `css/main.css?v=…` and `js/i18n.js?v=…` in that page.

8. **Commit & push.**

## Remaining work (priority order)

1. `entry.html` — currently has the most lang-en/lang-ja spans of the remaining six; migration would benefit Cycle 2 entry funnel users from outside JP. Use `entry.*` keys in i18n.js or page-local dict.

2. `how-it-works.html` — second highest impact (linked from PRE-bell state in play.html as "→ Why dormant?" fallback). Long-form content, will be a chunky dict.

3. `verify.html` — has 5 `data-i18n` keys already, but the dictionary in `i18n.js` may not cover them in all 10 langs. Audit first, then extend dict (smaller task).

4. `rules.html`, `risk.html`, `money.html` — three legal/policy pages; lower traffic but cited by footer links.

5. **Optional polish:** unify all cache busters site-wide once the migration is complete. Right now they're a mix of `?v=20260523a`, `…d`, `…e`, `…f`, `…g`, `…h`, `…i`. A single `sed` pass after the next big migration is enough.

## Architecture notes (refresher for next session)

- **Site-wide picker** is in the header of every page via `.lang-picker`. Its handler lives in `js/i18n.js`. Selecting a language sets `document.documentElement.dataset.displayLang` (TIER 1) or applies a `googtrans` cookie (TIER 2).
- **TIER 1 (10 langs)** = en, ja, ko, es, hi, vi, pt, id, th, fr. Translated by our dictionaries (no Google Translate involvement).
- **TIER 2 (~98 langs)** = Google Translate via `googtrans` cookie. Triggered by tier-2 selections in the picker. Marked-up tokens with `class="notranslate" translate="no"` are protected from Google's pass.
- **Brand-locked tokens** (never translate, even in TIER 1 dictionaries): KINGMAKER, Bell, Cycle, Phase, King, Mission, The Three, Founding Bell, Founding Member, Hall of Kings, Mission Fund, Crown, Crown Slot, Royal Duty, THE TRIAL, 23:23, 5-minute, SHA-256, KYC, AML, Claude, ¥100, My Page, Mission Entry, The Five, The Trial, The Vote, Bells.
- **Three translation surfaces in `js/i18n.js`:**
  1. `I18N_CONTENT` — `data-i18n="key"` / `data-i18n-html="key"` lookup table, dotted keys (e.g. `preview.btn_new`, `footer.preview_link`). Applied by `applyContentTranslations(lang)`.
  2. `MENU_TRANSLATIONS` — header nav menu items. Applied by `applyMenuTranslations(lang)`.
  3. `.lang-en` / `.lang-ja` parallel-span pattern (legacy) — driven by CSS rules `html[data-display-lang="ja"] .lang-en { display:none }` etc.
- **Per-page dicts** (`PREVIEW_I18N`, `KINGS_I18N`, `KINGS_STATIC_I18N`, `MYPAGE_I18N`, `PLAY_I18N`, `PLAY_STATIC_I18N`) live inline in their respective HTML files because they're tightly coupled to the page's JS state machine. This avoids bloating `i18n.js`.

## Credentials (carry forward unchanged)

- Repo: https://github.com/TAmJump/king2323 (public, Pages-hosted, main).
- PAT (valid till 2026-08-20, repo scope): stored only in
  `HANDOFF_2026-05-23_session10_FINAL.md` § 1 (not duplicated here to
  avoid GitHub Push Protection rejecting the commit). To clone:
  read the token from that file and substitute it into:
  `git clone "https://x-access-token:<PAT>@github.com/TAmJump/king2323.git" repo`.
- Worker: `tamjump-contact-api.animalb001.workers.dev` (D1: `tamjump_contact_db`).
- ADMIN_TOKEN: `kingmaker-admin-tiger-2026`.
- Operator account: `tiger@tamjump.com` (password in master handoff
  `HANDOFF_2026-05-23_session10_FINAL.md` § 1, not duplicated here).

## Cycle 2 calendar

- Bell rings: 2026-05-29 (Fri) 23:23 JST (= 2026-05-29T14:23:00Z).
- Configured in: `bellRingsAtIso="2026-05-29T14:23:00Z"`.
- Dormancy threshold: 1000 paid entries.
- Cycle 1 sealed as test (0 real participants).

## Verification queue for next session

1. Open https://king2323.tamjump.com/play.html in a private window.
2. Switch the lang picker through all 10 TIER-1 languages.
3. Confirm Pre-Bell, Quiz, Phase 2 wait, Phase 3 vote, Post, Dormant,
   and Gate state copy all visibly translate.
4. Confirm the countdown timer doesn't break during a switch (it'll
   show `—` for at most 2 seconds before `tick()` refreshes).
5. Confirm the footer `↳ Quiz preview (operator)` link translates.
6. Repeat on `kings.html` and `mypage.html` for parity check.
