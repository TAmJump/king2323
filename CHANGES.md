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
