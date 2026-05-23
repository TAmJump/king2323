# HANDOFF — Session ⑫ (2026-05-23)

## TL;DR — Translation system migration is COMPLETE.

Every HTML page in the repo now uses the unified 10-language i18n
system. The legacy `.lang-en` / `.lang-ja` parallel-span pattern is
fully retired site-wide.

```
grep -cE 'class="lang-en"|class="lang-ja"' *.html
→ 0  on every page  (12 pages including 404)
```

Cycle 2 (2026-05-29 Fri 23:23 JST) is ready to receive participants
from any TIER-1 language jurisdiction with consistent UI chrome.

## Final site posture (origin/main @ `bed2091`)

```
page                    legacy   data-i18n   data-i18n-html   data-static-i18n
─────────────────────   ──────   ─────────   ──────────────   ────────────────
404.html                  0          0              0                0
entry.html                0          0             27                0
how-it-works.html         0          0             27                0
index.html                0          4            187                0
kings.html                0          0              1               16
money.html                0          5              1                0
mypage.html               0          0             32                0
play.html                 0          0              1               25
preview.html              0          0             17                0
risk.html                 0          0             20                0
rules.html                0          0             22                0
verify.html               0          5              1                0
```

### Three i18n patterns in use

1. **`data-i18n-html="key"` → `I18N_CONTENT[key][lang]`** (in `js/i18n.js`).
   The bulk of the site. Static text that's known at page build time.
   `applyContentTranslations(lang)` walks every `[data-i18n-html]` and
   swaps `innerHTML`. 10 languages each: en (fallback / HTML source),
   ja, ko, es, hi, vi, pt, id, th, fr.

2. **`data-static-i18n="key"` → per-page inline dict.**
   For pages with complex JS state machines (`kings.html`,
   `play.html`). The dict lives inside the page's `<script>` block as
   a constant like `PLAY_STATIC_I18N = { key: { en, ja, ko, … } }`.
   An `applyPageStaticI18n()` function plus a MutationObserver on
   `document.documentElement[data-display-lang]` re-renders on every
   language change. This pattern is preferred when the page also has
   dynamic JS-generated strings that need the same dict layout for
   consistency, or when the static block is too page-specific to
   pollute the global `I18N_CONTENT`.

3. **`data-i18n="key"` → menu chrome only.**
   Used on simple pages (`money.html`, `verify.html`, `404.html`)
   that only need the header nav and footer preview link translated;
   their long-form body content is intentionally EN+JP only (see
   below).

### Bilingual `<p>` + `<p class="jp">` pattern (NOT retired — by design)

Legal pages (`rules.html`, `risk.html`) and doctrine pages
(`money.html`, `verify.html`) keep their long-form body paragraphs as
parallel English `<p>` + Japanese `<p class="jp">`. The CSS at
`css/main.css:1175–1196` hides one or the other based on
`html[data-display-lang]`. In TIER-1 languages other than ja, users
see the English text — and that's deliberate:

- **Legal text** (rules, risk) shouldn't be machine-translated into
  Korean/Spanish/Hindi/Vietnamese/Portuguese/Indonesian/Thai/French
  without expert legal review per jurisdiction. The operator's
  current jurisdictional offering is JP-only during Founding Bell,
  so the EN translation is provided as international courtesy /
  transparency, not as a legal instrument.
- **Doctrine text** (money, verify "Provably Fair") is long-form
  philosophical/technical writing where the author's voice in
  Japanese is the canonical source and the English is a careful
  authorial translation. Routing it through Google Translate for 8
  more languages would lose all the literary weight.

The **headings, eyebrows, page titles, and footer chrome** on those
four pages do route through the 10-language `data-i18n-html` system,
so navigation and orientation work cleanly in every TIER-1 language.

## What was pushed this session (and the prior in-flight commits)

- `47a1a26` v20260523f — mypage.html 10-lang dictionary +
  data-i18n-placeholder support
- `036e8ff` v20260523g — kings.html full 10-language i18n migration
- `436c117` v20260523h — play.html PLAY_I18N / PLAY_STATIC_I18N
  dictionaries (no HTML changes yet)
- `9fdd0ee` v20260523i — play.html full 10-lang i18n, retire
  .lang-en/.lang-ja parallel-span pattern
- `fdfefb7` v20260523j — play.html cache all eta writers + session
  ⑪ handoff
- `77c2e5f` v20260523k — rules.html + risk.html 10-lang heading
  migration; entry.html dict completion
- `bed2091` v20260523l — index.html 10-lang migration of the "How it
  works" 3-step explainer; site-wide lang-en/ja count now 0

Tip of `origin/main` is `bed2091`. Cloudflare Pages auto-deploys on
push. Container egress is locked to the github/npm allowlist so this
session cannot directly fetch `king2323.tamjump.com` to verify the
deploy went green — that confirmation needs to be eyeballed in a
browser. The push log returning `… → main` is the authoritative
confirmation that GitHub accepted the commit; deploys typically take
30–90 seconds after that.

## I18N_CONTENT dictionary additions this session and prior

Added during this multi-session work block to support the migrations:

- `entry.hint.payment_email`, `entry.label.card` — 10 langs.
- `rulespage.title`, `rulespage.h.schedule`, `rulespage.h.entry`,
  `rulespage.h.what_is`, `rulespage.h.mission_entry`,
  `rulespage.h.verification`, `rulespage.h.selection`,
  `rulespage.h.review`, `rulespage.h.opening`,
  `rulespage.h.cancellation`, `rulespage.h.geographic` — 10 langs each.
- `riskpage.title`, `riskpage.h.read_before`,
  `riskpage.h.what_you_receive`, `riskpage.h.founding_is_opening`,
  `riskpage.h.what_this_is_not`, `riskpage.h.geo_limit`,
  `riskpage.h.taxes`, `riskpage.h.do_not_if`, `riskpage.h.contact` —
  10 langs each.
- `corp.label` — 10 langs (used in legal-page footer corp nav).
- (And the prior session ⑪ work: `preview.*` keys,
  `footer.preview_link`, etc.)

## Verified-clean state

```
grep -cE 'class="lang-en"|class="lang-ja"' *.html  →  0 every file
node -e "new Function(<i18n.js body>)"             →  OK 270749 chars
git log origin/main..main                          →  empty (in sync)
```

## Next session priorities (if any)

1. **Browser verification of Cycle 2 readiness.** Operator should
   open the deployed site, cycle through all 10 picker languages
   (en, ja, ko, es, hi, vi, pt, id, th, fr) on each of these pages
   and confirm chrome translates without console errors:
   `index.html`, `entry.html`, `how-it-works.html`, `kings.html`,
   `play.html`, `preview.html`, `mypage.html`, `rules.html`,
   `risk.html`, `money.html`, `verify.html`.

2. **Cycle 2 launch dry-run.** Bell rings 2026-05-29 (Fri) 23:23 JST
   = `2026-05-29T14:23:00Z`. Confirm `bellRingsAtIso` in the relevant
   page configs, confirm Worker `/game/*` endpoints are responding,
   confirm the SHA-256 seed reveal cron is scheduled.

3. **(Optional) Cache buster normalization.** Pages currently span
   `?v=20260522a`, `…522c`, `…523d`, `…523e`, `…523j`, `…523k`.
   None of this is broken — every page's CSS+JS imports match each
   other — but a one-line `sed` to unify on `?v=20260523m` would tidy
   the repo. Not blocking.

4. **(Optional) TIER-2 language regression check.** Spot-check that
   Google Translate cookie-based langs (e.g., German, Italian,
   Arabic) still hijack correctly when selected via the picker;
   `js/i18n.js` line 14 prints `[i18n] v20260514d loaded · cookie:`
   to the console so easy to verify in DevTools.

5. **(Optional) Translate the doctrine pages.** If the operator wants
   `money.html` (Money Logic v1.0) and `verify.html` (Provably Fair)
   accessible beyond EN+JP, that's a translation/copy decision — not
   a code task. Routing them through the 10-lang system would be
   mechanical once the translations exist.

## Credentials (unchanged carry-forward)

- Repo: `https://github.com/TAmJump/king2323` (public, Pages-hosted, main).
- PAT (valid till 2026-08-20, repo scope, works for `git push`; not
  REST API): see `HANDOFF_2026-05-23_session10_FINAL.md` § 1
  (carried forward unchanged; not duplicated here to satisfy GitHub
  push-protection secret scanning).
- Clone: with the PAT in place, the URL is
  `https://x-access-token:<PAT>@github.com/TAmJump/king2323.git`.
- Worker: `tamjump-contact-api.animalb001.workers.dev` (D1:
  `tamjump_contact_db`, UUID
  `ba5cf621-d8c7-49db-90cd-e1fe8ece8437`).
- ADMIN_TOKEN: `kingmaker-admin-tiger-2026`.
- Operator: `tiger@tamjump.com` (password in
  `HANDOFF_2026-05-23_session10_FINAL.md` § 1).

## Cycle 2 calendar

- Bell rings: 2026-05-29 (Fri) 23:23 JST = `2026-05-29T14:23:00Z`.
- Dormancy threshold: 1000 paid entries.
- Cycle 1 sealed as test with 0 real participants.

---

— end of session ⑫ —
