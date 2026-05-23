# HANDOFF — Session ⑬ (2026-05-23)

## TL;DR

The homepage cycle-bar was on a Cycle 1 schedule that would have
counted down tonight (Sat 5/23 23:23 JST) to a "Three announced in"
event that no longer exists — Cycle 1 was sealed as a test with 0 real
participants. Fixed at commit `91fa899` (v20260523n).

The Cycle 2 launch path is now end-to-end consistent:

```
Client (js/main.js)         Worker (worker/index.js)
─────────────────────       ───────────────────────────
CYCLE2_RINGS_MS    ───── ←  bellRingsAtIso
2026-05-29T14:23Z           "2026-05-29T14:23:00Z"
```

## What was pushed this session

- `91fa899` — v20260523n — Cycle 2 state machine in `js/main.js`,
  dynamic stage dates in `index.html`, version + cache-buster bumps.

Tip of `origin/main` is `91fa899`.

## State machine

`getBellState()` in `js/main.js` now returns one of these phases
depending on wall-clock time, listed in chronological order:

| Phase                     | Window                            | Label EN / JA              | stageActive | cycle | CTA |
|---------------------------|-----------------------------------|----------------------------|-------------|-------|-----|
| `pre_open`                | before Wed 5/20 23:23 JST         | Bell opens in / 受付開始まで | 0           | 1     | off |
| `open`                    | Wed 5/20 23:23 → Fri 5/22 23:23   | Bell rings in / 受付終了まで | 1           | 1     | on  |
| ~~`pending_three`~~       | (skipped — CYCLE1_SEALED_AS_TEST) |                            |             |       |     |
| `cycle2_pre_open`         | Fri 5/22 23:23 → Wed 5/27 23:23   | Cycle 2 opens in / Cycle 2 開門まで | 0  | 2     | off |
| `cycle2_open`             | Wed 5/27 23:23 → Fri 5/29 23:23   | Bell rings in / 受付終了まで | 1           | 2     | on  |
| `cycle2_pending_three`    | Fri 5/29 23:23 → Sat 5/30 23:23   | The Three announced in / The Three 発表まで | 2 | 2 | off |
| `cycle2_complete`         | Sat 5/30 23:23 onward (weekly)    | Next Cycle opens in / 次の Cycle 開門まで | 3 | 3 | off |

Dates on the `.cb-stage` pills are dynamic:
- During Cycle 1 (cycle === 1) or by default: `5/20`, `5/22`, `5/23`.
- During Cycle 2: `5/27`, `5/29`, `5/30`.
- After Cycle 2: most-recent cycle's dates remain visible — the bar
  represents the most-recently-completed cycle's timeline.

## Preview mode for visual QA

Operator can append `?preview=…` to any URL on the site to spoof a
phase without touching the wall clock. Useful for screenshotting all
states quickly.

| `?preview=`   | State                  |
|---------------|------------------------|
| `pre`         | pre_open               |
| `open`        | open                   |
| `pending`     | pending_three          |
| `complete`    | cycle1_complete        |
| `c2_pre`      | cycle2_pre_open        |
| `c2_open`     | cycle2_open            |
| `c2_pending`  | cycle2_pending_three   |
| `c2_complete` | cycle2_complete        |

## What I deliberately did NOT touch

- **`worker/index.js`** — already correct (`currentCycle: 2`,
  `bellRingsAtIso: "2026-05-29T14:23:00Z"`, `dormancyThreshold: 1000`).
- **`api/cycle.json`** — stays at `cycle: 0, phase: "pre-launch"`. This
  file controls the **live-numbers dashboard** on the homepage (Mission
  Fund running total, patron 7d inflow, members count etc.) and is
  separate from the cycle-bar countdown. Operator should manually flip
  this file when Cycle 2 goes live — see "Operator pre-launch
  checklist" below.
- **Game-play screens** (`play.html`, `kings.html` etc.) — read phase
  state directly from the Worker, not from `getBellState()`. They were
  already cycle-aware via `GAME_CONFIG`.
- **Doctrine pages** (`money.html`, `verify.html`) — keep their `<p>`
  + `<p class="jp">` parallel pattern. Not in scope.

## Operator pre-launch checklist for Cycle 2

Run these on Wed 2026-05-27 morning (JST), before Cycle 2's Bell
opens at 23:23 JST:

1. **Open https://king2323.tamjump.com/?preview=c2_open** and confirm
   the cycle-bar shows: dates `5/27 5/29 5/30`, label "Bell rings in",
   stage 1 highlighted, CTA "Enter the Bell" enabled. (No preview
   needed in actual operation since wall-clock will hit cycle2_open
   automatically at 23:23 JST.)
2. **Edit `api/cycle.json`** and set:
   ```json
   {
     "schema": 1,
     "cycle": 2,
     "phase": "live",
     "baseline": { "grant_fund_jpy": <current>, ... },
     "rate_jpy_per_sec": { "members": <agreed>, "patrons": <agreed> },
     "first_bell_at": "2026-05-29T14:23:00Z",
     "updated": "<commit timestamp>"
   }
   ```
   Commit + push. (Cloudflare Pages will serve the updated file.)
3. **Verify the Worker** is responding:
   ```
   curl https://tamjump-contact-api.animalb001.workers.dev/game/info
   ```
   Should return JSON with `cycle: 2, phase: "pre_bell"` and
   `secondsUntilBell` matching the wall-clock countdown.
4. **Tail the Worker logs** during the receipt window:
   `wrangler tail tamjump-contact-api` to spot any 5xx during entry
   submissions.
5. **Watch the Bell-ring transition** at Fri 5/29 23:23 JST. The
   Worker's `gameBellPhase()` should transition from `phase1` →
   `phase2` → `phase3` automatically. If the SHA-256 draw cron didn't
   fire, manually trigger via:
   ```
   curl -X POST https://tamjump-contact-api.animalb001.workers.dev/admin/game/phase2/draw \
     -H "X-Admin-Token: kingmaker-admin-tiger-2026" \
     -d '{"cycle": 2}'
   ```

## Cycle 2 calendar (for reference)

| Moment                       | UTC                  | JST              |
|------------------------------|----------------------|------------------|
| Cycle 2 Bell opens           | 2026-05-27 14:23:00Z | Wed 23:23 JST    |
| Cycle 2 Bell rings           | 2026-05-29 14:23:00Z | Fri 23:23 JST    |
| Cycle 2 Bell closes          | 2026-05-29 14:28:00Z | Fri 23:28 JST    |
| Cycle 2 The Three announced  | 2026-05-30 14:23:00Z | Sat 23:23 JST    |
| Dormancy threshold           | 1000 paid entries    |                  |

## Credentials (unchanged)

See `HANDOFF_2026-05-23_session10_FINAL.md` § 1. Master credentials
master copy not duplicated here for secret-scanning hygiene.

## Open issues / next session candidates

1. **`api/cycle.json` flip** — the actual operator step above. Pure
   data change, no code.
2. **Square integration smoke test** — confirm a single ¥100 payment
   round-trips through Worker → D1 → `Mission Entry` form and a
   receipt email is sent. Last verified during session ⑩.
3. **TIER-2 language regression** — Google Translate cookie hijack
   (German, Italian, Arabic, etc.) hasn't been spot-checked since
   the session ⑪ i18n.js rebuild. Open DevTools console and confirm
   `[i18n] v20260514d loaded · cookie:` line still appears (the
   diagnostic banner has a known-stale internal version number but
   still loads correctly).
4. **Doctrine-page 10-lang translation** — `money.html` and
   `verify.html` long-form Money Logic / Provably Fair text. Currently
   EN+JP only by design. If operator wants more, that's a
   translation/copy decision, not code.

— end of session ⑬ —
