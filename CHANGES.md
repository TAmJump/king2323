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

