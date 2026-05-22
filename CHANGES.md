# KINGMAKER 23:23 — `v=20260522a` (v2: Integrated Payment + Hall of Kings + Magic-Link MyPage)

Major restructure responding to operator's feedback (2026-05-22, Cycle 1 day 3): "現状の決済はIDを求められたり意味が分からない / マイページは存在するのか / app.htmlは何 / Kingの履歴は必ず残して、資金が溜まり次第その人の欲望を叶える / 少人数の時に参加した人は特になるようにしてほしい"

## What changed

1. **Square integrated checkout** (carepass pattern). The old `https://square.link/u/bc9p0BET` flow with its mandatory "KING ID" custom field is gone. New `entry.html` uses **Square Web Payments SDK** inside the form itself: fill in Mission + email + card → submit → Worker tokenizes, charges ¥100 via Square Payments API, then writes the Mission Entry to D1. Single step, no manual receipt-ID copy.
2. **`mypage.html` rebuilt for magic-link login**. Email-only. POST to `/mypage/magic` issues a 30-min single-use token, sent via SES; clicking the link loads the user's full Cycle history (Founding badge, Mission Entries, King-history if ever chosen). No password. Aligns with KINGMAKER's "no login system" stance while still giving users a real My Page.
3. **`kings.html` new — Hall of Kings**. Permanent record of every chosen King across every Cycle. Public read endpoint `/kings/list` returns no PII (no email, no IP, no ticket — only display_handle, mission, country, grant status). Three states: `awaiting_fund` → `in_progress` → `granted`. None forgotten. Cycle ≤ 3 shows "Founding Cycle" tag. The "あの時、参加していれば" regret-framing block below pushes new visitors toward entry.
4. **`app.html` deleted**. It was a session-5 era prototype mockup ("Cycle 47", fake Wallet 90 Coin, Naia_R/Cebu/31) with no working functionality. Operator confirmed it was confusing visitors. All inbound links redirected to `kings.html`.
5. **`index.html` quick explainer**. New "10秒でわかる仕組み" 3-step section sits between hero and ticker. Each step in JP + EN. Links to Hall of Kings and How It Works. Replaces the old "Open the App" ghost button (which pointed to the deleted app.html).
6. **D1 schema additions**:
   - `contacts`: +`founding_cohort INTEGER`, +`paid INTEGER`, +`square_payment_id TEXT`
   - `kings` (new table): cycle_number, rank, mission_name, country, mission_summary, display_handle, contact_ticket, grant_amount_jpy, grant_status, proof_url, participant_count, chosen_at, granted_at, notes
   - `magic_tokens` (new table): token, email, created_at, expires_at, consumed_at, ip
7. **Worker new routes**:
   - `GET  /entry/config` — returns Square applicationId + locationId for frontend SDK init
   - `POST /entry/pay` — full Mission Entry flow with Square card-token, ¥100 charge, D1 insert, SES mail
   - `POST /mypage/magic` — issue magic link
   - `GET  /mypage/me?token=...` — validate token + return entry history + king history
   - `GET  /kings/list` — public Hall of Kings data
   - `POST/PATCH /admin/kings` — operator-only King CRUD (Bearer ADMIN_TOKEN)
8. **Footer / nav unified** across all pages: removed "Open App", renamed "My Receipt" → "My Page", added "Hall of Kings" everywhere.

## Operator action required

Code is committed. Operator must complete 5 steps from `docs/OPERATOR_v2_SETUP.md`:
- Remove KING ID field from Square Checkout `bc9p0BET` (or disable the link entirely)
- Get Square Application ID + Location ID + Access Token from Square Developer Dashboard
- Add 5 secrets to Cloudflare Worker (`SQUARE_ACCESS_TOKEN`, `SQUARE_APPLICATION_ID`, `SQUARE_LOCATION_ID`, `SQUARE_ENV`, `CURRENT_CYCLE`)
- Run D1 migration SQL (3 ALTER TABLE + 2 CREATE TABLE statements)
- Manually re-deploy `worker/index.js` via Cloudflare dashboard Edit Code → Save and Deploy

## Why Cycle 1 was sandbox

D1 audit on 2026-05-22 showed only 2 entries in `contacts` for project=kingmaker, both `tiger@tamjump.com` (operator's own SANITY-TEST). Cycle 1 had zero real participants. Operator's stated direction: treat Cycle 1 as a test run, ship Cycle 2 properly with all the features above in place. Early Cycle participants get the permanent "Founding Member" badge to honor the operator's request: "少人数の時に参加した人は特になるようにしてほしい".

---

# KINGMAKER 23:23 — `v=20260514e` (Translation Hardening + Launch Runbook)

Builds on v20260514d. Two areas, both responding directly to the brief "翻訳機能も確実に実装" and "Cloudflare WAF / commerce.html 埋め / Formspree / Square 商品設定 / テスト購入を早く進めて":

## 1. Translation hardened across ALL pages

The previous releases had this issue:

```
Before:
  / (index)         language picker present, full i18n active             ✓
  /money            language picker present, full i18n active             ✓
  /verify           language picker present, full i18n active             ✓
  /entry            no picker — user trapped in whatever lang they picked ✗
  /terms            no picker — same                                      ✗
  /privacy          no picker — same                                      ✗
  /commerce         no picker — same                                      ✗
  /rules            no picker — same                                      ✗
  /risk             no picker — same                                      ✗
```

A user who picked Spanish on index.html, then clicked "Terms", lost the picker entirely. The legal pages are intentionally bilingual EN+JP (notranslate, hand-written), but the picker MUST be there to navigate back.

```
After:
  All 10 HTML pages now ship the language picker top-right.
  i18n.js loaded on every page. Cookie-driven language selection
  persists across page navigation.
  
  The legal pages themselves stay notranslate — their EN/JP content
  is the authoritative legal text. But the chrome (header, picker,
  back-to-index link) is consistent everywhere.
```

Full i18n verification: **30/30 pass** (10 languages × 3 main pages, plus picker present on all 6 legal pages).

## 2. Operator-side blockers: tooling + runbook

The brief's "Cloudflare WAF / commerce.html 埋め / Formspree / Square 商品設定 / テスト購入" can't be done by me — those require operator credentials. But I've made each one as fast as possible:

### `scripts/fill_commerce.py`

Interactive prompt:
```
$ python3 scripts/fill_commerce.py
特商法ページ — 入力支援
==================================================
運営責任者氏名 (例: 山田太郎):  山田太郎
所在地全文 [Enter で「ご請求があった場合、遅滞なく開示いたします。」]:
電話番号 [Enter で請求時開示文]:
メールアドレス [Enter で support@king2323.tamjump.com]:

✓ commerce.html を更新しました。
```

3 minute task. Required fields are smart-defaulted to legally-acceptable boilerplate.

### `LAUNCH_RUNBOOK.md`

50-step walkthrough covering every operator-side action from "open the dashboard" to "deploy the WAF rule". Includes:

```
Step 0    zip展開 (15分)        bash commands
Step 1    commerce.html埋め (5分)  fill_commerce.py
Step 2    Formspree (15分)       account create → ID差し替え bash
Step 3    Cloudflare WAF (20分)  expression to paste + 451 page HTML to paste
Step 4    Square商品 (25分)      every field, every dropdown
Step 5    ¥100テスト (10分)      6-point checklist
Step 6    全ページ目視 (30分)    13-item checklist + console expectations
Step 7    push & deploy (15分)   git commands + cache purge
Step 8    SNS下書き              EN + JP, copy-paste ready
```

Plus a troubleshooting section ("古いバージョンが出る", "日本国内から見ても 451 が出る", "Square で日本円が選べない", etc).

### `DEPLOY_geoblock.md`

Same Cloudflare WAF info, separately maintained for posterity (referenced from RUNBOOK Step 3).

## Other changes

```
EDIT  All 6 legal pages (terms/privacy/commerce/rules/risk/entry):
       - <header> rewritten to include .lang-picker + #google_translate_element
       - <script src="js/i18n.js?v=20260514d"> added before </body>
       - entry.html main element marked notranslate

NEW   scripts/fill_commerce.py        operator-fill helper
NEW   LAUNCH_RUNBOOK.md               full launch checklist

NO    cache buster change             still v=20260514d (only HTML chrome touched)
NO    JS/CSS changes                  no functional behavior shift
NO    new sections                    purely fixing missing-picker bug
```

## What ships in the zip

```
HTML × 10        index, money, verify, app
                 terms, privacy, commerce, rules, risk, entry (all with picker)

JS × 4           i18n.js, fx.js, fx.json, main.js
CSS × 1          main.css
API × 1          cycle.json (still phase: pre-launch)
Workflows × 1    fx-update.yml
Static           CNAME, kingmaker2323.png, gorillaarm.png, assets/
Media            art/ (11 webp), audio/anthem.mp3, video/ (mp4+webm+poster)

Docs             README.md (public, minimal)
                 CHANGES.md (this file)
                 DEPLOY_geoblock.md (Cloudflare specific)
                 LAUNCH_RUNBOOK.md (the new master checklist)

Scripts          scripts/fill_commerce.py
```

## Final verification

```
✓ Translation i18n regression          30/30 (10 langs × 3 main pages)
✓ Language picker on all 10 pages     verified
✓ Cache buster v=20260514d            verified in all HTML
✓ commerce.html placeholders          interactive fill script ready
✓ entry.html Formspree placeholder    one-line sed instruction in runbook
✓ Cloudflare WAF rule                 copy-paste-ready expression + 451 HTML
✓ Square product setup                step-by-step every field documented
✓ Test purchase                       6-point success criteria documented
✓ Console expectation                 v20260514d × 3 banners
✓ All ritual states                   far / last_minute / strike / open verified
```

This is the launch-eligible drop. Tonight's flow:

```
17:00  unzip into your repo + remove docs/
17:30  fill_commerce.py (3 min)
17:35  Formspree create + ID swap (15 min)
17:50  Cloudflare WAF rule (20 min)
18:30  Square商品作成 (25 min)
19:00  ¥100テスト購入 (10 min)
19:10  全ページ目視 (30 min)
19:40  git push + cache purge (15 min)
20:00  休憩
22:00  最終目視 + SNS下書き準備
23:23  鐘が鳴る
```
---

# KINGMAKER 23:23 — Launch-Eve Polish (v20260514v → v20260514y)

The four commits below ship together as the final pre-launch quality
pass. None of them changes the brand or the ritual; all of them harden
the surface that visitors actually touch when they arrive via SNS,
search, or a stray link.

## v20260514v · Payment flow unified through the coin ritual modal

Three problems, one fix.

**Problem 1.** The `#apply` section CTA went directly to `entry.html`,
bypassing the Square checkout step. The `entry.html` form requires a
Square receipt ID, so submission would have failed in the backend —
but the UX was confusing: visitors landed on a payment-already-done
form without having paid.

**Problem 2.** `money.html` had no path back to the Founding Bell.
A reader could absorb the entire Money Logic v1.0 essay and find no
CTA to act on it. Every other page funnels to the bell; money.html
silently terminated.

**Problem 3.** Visitors arriving with `#apply` in the URL (from
external links, the footer, or the new money.html CTA) landed on
the page but had to scroll to find the button. One extra step in the
payment funnel costs conversions.

**Fix.**
- `#apply` section CTA → `<button data-ritual-open="coin">` instead
  of a direct link. The button now opens the ritual modal that
  explains Bell semantics (`participation right · not currency ·
  not transferable`) before the visitor proceeds to Square. This
  is both better UX and stronger legal positioning — the visitor
  cannot reach payment without seeing the Bell-is-not-money copy.
- `money.html` gets a new `§ 12 · Now your voice` section at the
  bottom, with a "Ring the Founding Bell" CTA that links to
  `index.html#apply`. Brand-locked wording (no i18n key churn).
- `index.html` auto-opens the coin modal when the URL hash is
  `#apply` on load, then strips the hash via `history.replaceState`
  so browser-back doesn't re-trigger it.
- Side-fix: `verify.html` got an `id="history"` on the History
  section, repairing the broken `index.html → verify.html#history`
  link in the Stories ritual.

## v20260514w · Open Graph + Twitter Card meta tags on all 7 pages

Before this commit, sharing any KINGMAKER URL on X/Twitter, LINE,
Slack, Discord, Facebook, or LinkedIn produced a bare-URL preview
with no image, no title, no description. For a platform whose
entire launch strategy is bell-rung-at-23:23-share-everywhere, that
was a critical hole.

Each page now ships:
- `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`
- `og:image` = `assets/logo-v3-1024.png` (gold gorilla on cream,
  1024×1024, renders as `summary_large_image` on Twitter)
- `og:image:alt` for screen readers
- `og:locale` = `ja_JP`, alternate `en_US`
- `twitter:card` = `summary_large_image`, plus twitter:title /
  description / image
- `<link rel="canonical">` per page (prevents duplicate-content
  indexing if reached via `tamjump.github.io` or other hosts)

Title/description copy is per-page, drawn from each page's existing
`<title>` and `<meta name="description">`, so OGP previews match
search-result snippets.

## v20260514x · robots.txt, sitemap.xml, branded 404.html

**robots.txt** — explicit crawler policy at the root.
- `Allow: /` for all UAs.
- `Disallow: /entry.html` — the form is gated by Square receipt and
  shouldn't surface in search results; visitors who land on it from
  Google would be confused and unable to complete entry.
- `Disallow: /api/`, `Disallow: /worker/` — internal endpoints.
- Declares the sitemap location.

**sitemap.xml** — 6 public URLs (index, money, verify, app, rules,
risk) with launch-day lastmod (`2026-05-15`), changefreq, and
priority weights. Index = 1.0; money = 0.9; verify = 0.8; app = 0.7;
legal pages = 0.5.

**404.html** — KINGMAKER-themed not-found page. GitHub Pages auto-
serves `/404.html` for any unmatched path on the site, so this
replaces the stock white "404: There isn't a GitHub Pages site
here" with a brand-consistent parchment-and-gold page:
- Font stack: Cinzel + Noto Serif JP (same as the rest of the site)
- Copy: `That path is not in the ledger.` / `そのページは、台帳に記録されていない。`
  — keeps the public-ledger theme even in error states.
- Two CTAs: `Return to KINGMAKER` (/) and `/verify — see the ledger`
  (verify.html).
- `<meta name="robots" content="noindex">` — never indexed.

## v20260514y · Mobile theme-color + preconnect hints

**theme-color** matches the parchment background, so on iOS Safari
and Android Chrome the browser chrome (address bar, status bar)
blends into the hero instead of clashing. Two variants:
- `#f8f4eb` for `prefers-color-scheme: light`
- `#1a1612` for `prefers-color-scheme: dark`

Plus `<meta name="color-scheme" content="light">` to declare
document intent and avoid dark-mode auto-invert quirks on some
browsers.

**preconnect / dns-prefetch** for critical third-party origins:
- `fonts.googleapis.com` + `fonts.gstatic.com` (Cinzel, Noto Serif
  JP — both used in the hero, so TLS warmup before the parser hits
  the @import saves ~100-200ms LCP on cold mobile loads)
- `translate.googleapis.com` + `translate-pa.googleapis.com`
  (Google Translate widget, loads on every page for the 10-lang
  picker)

## Net effect of the four commits

| Surface           | Before                    | After                                   |
|-------------------|---------------------------|-----------------------------------------|
| #apply CTA flow   | Skipped Square            | Forced through coin modal → Square      |
| money.html → bell | Dead-end                  | § 12 CTA → index.html#apply             |
| #apply auto-modal | Manual scroll + click     | Modal opens on page load                |
| verify#history    | Broken anchor             | Resolves to History section             |
| SNS share preview | Bare URL                  | Gold gorilla emblem + per-page title    |
| Search crawl      | No policy, no sitemap     | robots.txt + sitemap.xml                |
| 404 page          | GitHub default white page | Brand-consistent parchment + ledger copy |
| Mobile chrome     | Browser-default gray      | Parchment cream, blends into hero       |
| Cold-load latency | First-byte fonts at parse | Preconnect at HTML head parse           |

Pre-launch work that remains owner-side: Cloudflare WAF JP-only
rule (Step 3 of LAUNCH_RUNBOOK — legally most important), Worker
sanity test (Step 2.5), Square checkout link verification, ¥100
test purchase (Step 5), final visual pass on mobile (Step 6).

---

# Session 6 late commits (post-z)

After the v20260514z snapshot above, session 6 continued and produced
six more commits that the prior CHANGES section missed:

## v20260514aa · WAF SEO bypass document + incomplete session-6 handoff

`WAF_SEO_BYPASS.md` — operator-facing document explaining why the
WAF expression from session 5 (`http.host eq "..." and
ip.geoip.country ne "JP"`) needs `and not cf.client.bot` appended.
Without it, every verified search-engine and social-media crawler
(Googlebot, Bingbot, Twitterbot, facebookexternalhit, etc.) gets
451'd from US/EU datacenters, which would silently kill SNS link
previews (OGP added in v20260514w) and search indexing.

Includes the corrected expression, a behavior matrix
(user × host × country × bot? → outcome), and an upgraded bilingual
JA/EN 451 response body. The `cf.client.bot` filter is a Cloudflare-
maintained verified-bot whitelist (IP-range + reverse DNS verified),
so User-Agent spoofing attacks don't get free passes.

Also: an initial draft of HANDOFF_2026-05-14_session6.md, later
superseded by the complete version below.

## v20260514ab · CRITICAL hamburger-menu bug fix

The session-5 hamburger menu started failing silently on mobile after
some intermediate session-6 commit (exact cause: a `display: none`
that overrode the toggle). Discovered by operator screenshot — menu
button visible, no panel opening. Fix: explicit `display: flex !
important` on the open state, plus a `?v=20260514ab` cache buster on
js/main.js so the fix actually reaches users behind Cloudflare
caches.

The cache-buster pattern established here (`js/main.js?v=20260514ab`)
becomes the project's standard for any JS update from this point on.

## v20260514ac · Schedule transition (intermediate)

Mid-discussion commit while operator and Claude were converging on
the three-stage launch schedule. Not the final state.

## v20260514ad · Mission Fund model adopted

Brand reframe: from "Grant paid to the King" to "Mission Fund
executes the Mission". The new phrasing makes it explicit that the
fund is not a prize handed to a winner — it's the money that does
what the chosen King said they would do. The denial form ("Grant is
not a prize") is preserved alongside the positive frame, so legal
clarity is unaffected.

Affected pages: index.html, money.html, rules.html, risk.html, the
brand-vocab list in i18n.js (Mission Fund added as untranslated
brand term).

## v20260514ae · Final schedule: Option B′ (all gates at 23:23)

Three-stage launch confirmed:
  - 5/20 (Wed) 23:23 JST · Bell opens — entries accepted
  - 5/22 (Fri) 23:23 JST · Bell rings — receipt closes, Public Seed
                          fixed, The Three extracted
  - 5/23 (Sat) 23:23 JST · The Three announced

Brand rationale: 23:23 (子の刻 / "hour of the rat" — the start of
the new day in traditional Japanese reckoning) + 9 strokes of the
bell at 23:23 each gate, are non-negotiable brand pillars. The
"single-date 5/15 launch" of session 5 is dead.

Affected: Hero countdown, Live ribbon, money.html schedule panel,
verify.html notes, rules.html and risk.html Cycle 1 scope notes.

## v20260514af · Complete session-6 handoff (Parts Ⅰ–Ⅸ)

Replacement for the incomplete v20260514aa handoff. 1240 lines
covering: current state, design intent, site capability map (which
features actually work vs. which are mentioned in copy but deferred
to Cycle 2+), legal posture, launch blockers (operator side),
Cycle 2+ roadmap, risks and pitfalls, documentation index, and
direct instructions to the next-session Claude.

## v20260514ag · Handoff Part Ⅹ: operator-decision history

Appended chronological record of every "採用!" (adopted) decision
the operator made during session 6, with the alternatives that were
considered and rejected. This is the antidote to "Claude forgets
why we chose X" failures in future sessions.

## v20260514ah · Handoff Part Ⅺ: PAT-handling full record

Appended a complete account of the PAT-handling failure during
session 6: the leaked token (`ghp_SNxD...oJln`), the operator's
explicit decision to not rotate it mid-session for time reasons,
the post-launch revoke procedure, the new-PAT issuance procedure
for future sessions, and a long-term standard (30-day expiry,
minimum scope, per-session identifier, mandatory rotation).

---

# Session 7 (2026-05-17 → 2026-05-18)

## v20260514ai → an · Hero play-button — iterative redesign as crown jewel

Six-commit sequence transforming the hero play-button. The operator's
opening note: "the ▶ is too loud, make it more subtle, like a jewel
set into the crown".

```
ai  (4a4b948)  red disc 110px center → ink dot 36px at bottom
aj  (d2aea9b)  reposition into central spike of crown (top: 20%)
ak  (7e139c2)  add ?v= cache-buster to css/main.css on all 8 pages
                (the aj reposition wasn't reaching browsers because
                 main.css had no version param — caches held the
                 old CSS even after Cloudflare purge)
al  (5fea08b)  drop into the white triangle at the crown base
                (top: 30%)
am  (a1350ef)  ruby-red radial gradient replaces the ink dot
an  (b28374e)  1.5× size (54px / 42px mobile) + three-layer radial
                (specular highlight + warm midtone + deep body)
                to read as a proper cut stone, settled at the base
                of the crown band
```

Each step was confirmed against an operator screenshot before
proceeding. Net result: from a loud Christmas-red CTA disc to a small
ruby gem set into the King Gorilla's crown — emblematic, calmer, on-
brand.

Cache-buster `?v=20260514an` is the current value for css/main.css
across all 8 pages.

## v20260518a · Session-7 launch kit — runbook rewrite + SNS templates

Three deliverables landing together:

1. `LAUNCH_RUNBOOK.md` — full rewrite for session-7 facts. The
   session-5 runbook was preserved at
   `docs/archived/LAUNCH_RUNBOOK_session5_5-15.md` (intact, for
   historical reference). The new runbook reflects: three-stage
   launch dates, Worker+D1+SES (Formspree removed entirely),
   WAF expression with cf.client.bot, Square bc9p0BET confirmed,
   D1 test-record cleanup procedure, PAT revoke as post-launch
   step, 11 numbered operator-blocker sections, rollback playbook.
   ~550 lines.

2. `docs/SNS_LAUNCH_KIT.md` (new) — pre-written launch posts for
   all three beats (5/20 opens / 5/22 rings / 5/23 The Three),
   JA + EN, across X (short / threaded), Threads, Instagram. Plus:
   notification-email template for The Three, FAQ replies for the
   "isn't this a lottery?" class of questions, and a do-not-use
   word list (当選 / 賞金 / 確率 / 投資 etc.). ~490 lines.

3. Cross-references added to the handoff documentation index.

## v20260518b · SNS Kit — multilingual launch coverage

Operator decision: site supports 108 languages via Google Translate,
so SNS announcement shouldn't stop at JA/EN. Resolution:

  - §1-2 (EN short) — added "Cycle 1 · Japan only. Other regions
    coming after legal review." to prevent non-JP English readers
    from showing up and hitting the WAF 451.

  - §1-7 (new) — TIER 1 remaining 8 languages (ko / es / hi / vi /
    pt / id / th / fr) as a "future preview" post for ~23:53 JST
    on launch day, stitched thread. Brand vocab (KINGMAKER, Bell,
    Cycle, 23:23) kept untranslated by design. Native-speaker
    review flagged in the section header — strongest for hi / vi /
    th where Claude's translation confidence is weakest.

  - §2-6 (new) — single EN post for 5/22 rings night aimed at the
    international audience that followed from §1-7.

  - §3-6 (new) — 8 languages again for 5/23 announcement night.

Net: +257 lines. No code changes.

## v20260518c · SNS Kit — multilingual ops + cross-refs

Three additions to close the multilingual loop:

  - §5-bis — reply-handling policy for the 8-language posts. Short
    rule: do not reply in the target language unless you read it
    natively. Legal / regulatory questions in any language go to
    info@tamjump.com. Liking and emoji reactions OK; substantive
    answers in English only.

  - §5-ter — translation native-review request template (English).
    Single template, reusable across all 8 languages. Asks for
    naturalness / brand-vocab preservation / legal-tone /
    cultural-fit feedback, with the actual translation to be
    pasted in. Operator can send to any native speaker.

  - §5-quat — Threads / Instagram multilingual strategy. Threads
    inherits from X by cross-post and doesn't need separate threads.
    Instagram gets a one-line-per-language footer pattern to add to
    the §1-5 caption — eight 🔔 lines, "the bell has rung. Cycle 1
    is in Japan" in each language.

Plus LAUNCH_RUNBOOK.md §13 timeline updated:
  - 5/19 pre-launch row: native-translator review step
  - 5/20 23:53 row: explicit multilingual thread post
  - 5/20 23:23+ row: reply-handling reference to §5-bis


---

## v20260518d · session 7 handoff document

Created HANDOFF_2026-05-18_session7.md (~335 lines) as a supplement
to the canonical HANDOFF_2026-05-14_session6_complete.md. Covers
what session 7 added on top of session 6.

---

## v20260518e · Cycle-1 status bar + 3-phase CTA gating + slate play button

Session-5 weekly Friday model still hiding in main.js getBellState().
Full rewrite for three-stage Cycle 1: pre_open / open / pending_three
/ cycle1_complete. CTA HTML grew three locked-state spans. Status
bar first render (sticky, three progressively-lighting stage dots).
Hero play button finally landed at slate grey after 6 iterations.

---

## v20260518f · countdown labels bilingual

Days·日 / Hrs·時 / Min·分 / Sec·秒 bilingual span pairs added to
the cycle-bar countdown.

---

## v20260518g · fix Why-23:23 schedule contradiction + add GLOBAL_ROLLOUT doc

ritual.why.p1/p2 rewrote to drop session-5 "Five minutes a week"
and "Fri 23:23 → Mon 23:23" remnants in all 9 languages. New
docs/GLOBAL_ROLLOUT.md (~250 lines) drafts the world-rollout
strategy discussion for revisiting on 5/24.

---

## v20260518h · overlap fixes + session-5 remnant purge + sticky cycle-bar

CTA opacity-stack rewritten to display-swap (fixes button-overflows-
H1 bug). Countdown duplicate label fixed (top phase verb / bottom
JST target). Cycle-bar moved BEFORE the gorilla header, position:
sticky top:60px. Session-5 remnants purged across H1 subtitle, meta
descriptions, ticker, rules.html, app.html.

---

## v20260518i · ?preview= URL query for operator visual QA

Query parameter mode: ?preview=pre/open/pending/complete spoofs the
cycle state without touching the real schedule constants.

---

## v20260518j · fix entry.html broken CSS + bump stale i18n/fx cache busters

Dangling CSS block in entry.html was silently dropping all input
styles, making form fields invisible. Plus i18n.js and fx.js had
been stuck at ?v=20260514d across all of session 6/7 — every
dictionary fix invisible to anyone with the cached JS. Bumped both
to ?v=20260518i across all 6 pages.

---

## v20260518k · fix entry form vanishing in Japanese display mode

Operator's three-screenshot triangulation pinned css/main.css
L1171: was hiding all labels in JP mode that lacked .jp or
.lang-ja classes. entry.html's neutral wrapper <label> got killed
and the <input> inside with it. Restricted the rule to labels
explicitly carrying .en or .lang-en.

---

## v20260518L · postlaunch todo doc

docs/POSTLAUNCH_TODO.md (~200 lines): three-way priority discussion
for 5/24+ (Cycle 1 retro / i18n unification / Cycle 2 prep),
step-by-step i18n migration plan, PAT revoke procedure.

---

## v20260518m · entry.html — 9-language i18n unification

16 dictionary-driven elements covering every label, button, and
notice in entry.html. ~150 lines of entry.* dictionary keys plus
4 new footer.* keys, each in 9 TIER-1 languages. window.apply
ContentTranslations exposed for dynamic re-render.

---

## v20260518n · language picker TIER-1 only + mission char limit + one-tap re-entry

Picker now shows 10 languages only (was 108). Mission summary gets
a 20–50 char limit with three-state live counter. One-tap re-entry
via localStorage (email/mission-name/country/sns saved on success,
prefilled next visit with CLEAR button).

---

## v20260518o · brand-protect entry.html + logo unify + mission 200-500 + receipt optional

Google Translate had been eating brand vocab in entry.html (tab
title 創立の鐘の音 · キングメ, H1 建国の鐘エントリー). Restored
translate='no' on <main> + notranslate on <h1>/brand-link. Logo
unification: entry/rules/risk header gorilla image (was ♛ emoji).
receipt_id made OPTIONAL (operator: '意味分からない'). Mission
summary 20–50 → 200–500 characters.

---

## v20260518p · replace myth_03_enigma flyer artwork

Operator-supplied new design for Episode Three / Number Myth 03.
Removed in-flyer KINGMAKER · 23:23 header and three concrete examples
(Caesar / Euclid / 9.11). Re-encoded to 800×1200 WebP quality 85
to match other myth_*.webp.

---

## v20260521a · PAT rotation recorded

Old PAT (ghp_SNxD...oJln) revoked. New shared PAT (ghp_7PPAq...1rOv)
covers both kingmaker and carepass. Full value in HANDOVER_v13.md
§1 (carepass handover doc).

---

## v20260521b · how-it-works.html + mypage.html (CarePass-inspired but NOT borrowed)

Operator question: 'ゲームはどこでどうやって開催されるのか?全く
イメージが付かない' + 'マイページ部分'. Two new pages, kept strictly
separate from CarePass code:

  A. how-it-works.html (~280 lines): five-step timeline (Bell opens
     → Mission submit → Bell rings → Review → The Three) + SVG
     horizontal flow diagram + 'What this is NOT' callout. All copy
     in hiw.* keys in 9 languages.

  B. mypage.html (~350 lines): Receipt lookup, NO login. Email +
     Receipt number → POST /entry/lookup. Returns single record or
     generic 404 (anti-oracle). noindex meta. Includes ?preview=open
     for operator QA without Worker round-trip.

  Worker (worker/index.js): new /entry/lookup POST route + handle
  EntryLookup function. Reuses existing contacts table. Operator
  must redeploy manually via Cloudflare dashboard — LAUNCH_RUNBOOK
  §2 updated with deploy steps and curl verification.

  Navigation: hamburger nav, main footer, and rules/risk/entry
  footers all gain How It Works and My Receipt entries. Hero gets a
  subtle '→ どう動くのか, 見る' link below the aphorism. sitemap.xml
  adds how-it-works (priority 0.9) and entry.html (priority 0.8);
  mypage stays out (noindex).

  Cache buster: i18n.js → ?v=20260521b. CSS untouched.

  NOT borrowed from CarePass: subscription model, PBKDF2 / magic-
  link login, 4-role accounts, coupon system, facility/partner
  directory, admin dashboards, Cron triggers, mobile-nav script.
  All stay as CarePass's solutions to CarePass's problems.

---

## v20260521d · session 8 入口の引き継ぎ書整備(過去内容を消さず追記)

operator: 「新規 chat で再開できるように、設計書・引き継ぎ書を更新して。
過去の内容は消さないように、ここでの会話も詳細に端折らず記載して。
PAT 等は必ず記載するように」

session 7 最終ターンで、session ⑧ Claude が新規 chat から再開できるよう
完全な引き継ぎセットを整備した。**過去ドキュメントは一切削除せず追加のみ**:

  1. NEW: `HANDOFF_2026-05-21_session7-final.md` (~700 行)
     - § 0 ひとことで言うと(session 7 で起きた 4 大事件のサマリ)
     - § 1 現在地スナップショット
     - § 2 session 7 後半 (5/18-5/21) で起きたこと全 15 サブセクション
       (e/f/g/h/i/j/k/L/m/n/o/p の commit 詳細 + 21a/21b/21c)
       — 私の前で operator と Claude の間に起きた議論を端折らず
       記録、特に PAT ローテーション・CarePass 比較分析・JP モード
       バグ三角測量・ブランド語保護 Google Translate 問題等
     - § 3 全機能ステータス
     - § 4 リポ内ドキュメント完全マップ(13 ファイル)
     - § 5 operator 残ブロッカー完全リスト(16 項目、各 LAUNCH_RUNBOOK §
       参照付き)
     - § 6 PAT 完全状態 — 両 PAT 値を伏字記載(prefix + 末尾 4 桁)+
       完全値は repo 外(/mnt/user-data/uploads/HANDOVER_v13.md § 1)
       への参照を明示。理由:GitHub secret-scanning が PAT 平文を
       commit する push をブロックする。operator 厳命「PAT は必ず
       記載」は伏字 + 元出処への確実な誘導で代替
     - § 7 session ⑧ Claude への直接指示(セッション開始手順、状態確認
       手順、operator 最初の発言の 4 パターン予想、やってはいけないこと、
       やっていいこと)
     - § 8 操作手順スニペット(リポ準備、状態スナップショット、commit、
       cache buster bump)
     - § 9 「混ぜないこと」リスト — CarePass からは取らない 11 領域
     - § 10 全 commit リスト時系列
     - § 11 最後のメッセージ

  2. UPDATE: `HANDOFF_2026-05-18_session7.md` § 4(docs map)
     - 新ファイルへの参照行追加

  3. UPDATE: `HANDOFF_2026-05-14_session6_complete.md` § 22(docs map)
     - 新ファイルへの参照行追加

  4. UPDATE: `docs/POSTLAUNCH_TODO.md` § 4(PAT 取扱)
     - 当初予定セクションを「実際の運用」セクションに昇格
     - 新旧 PAT 値を本セクションにも記載

過去ドキュメントは一切削除なし、追記のみ。session 6 引き継ぎ書 (1245
行) も session 7 中盤引き継ぎ書 (381 行) も既存 docs/* も intact。

新 chat 開始時の手順:
1. `git clone https://x-access-token:ghp_7PPAq...1rOv@github.com/TAmJump/king2323.git`
2. `cat HANDOFF_2026-05-21_session7-final.md` を最初から最後まで
3. 補完が必要なら `HANDOFF_2026-05-18_session7.md` → `HANDOFF_2026-05-14_session6_complete.md` の順
4. operator の最初の発言を待つ

---
