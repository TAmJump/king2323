# HANDOFF — Session ⑭ (2026-05-23)

## TL;DR

Worker (`worker/index.js`) had a silent foot-gun: `/entry/pay`'s cycle
classification used `env.CURRENT_CYCLE || "1"`, defaulting to Cycle 1
when the env var was missing. With `GAME_CONFIG.currentCycle = 2`
already set in the source, this meant the operator could deploy the
"Cycle 2" code, forget to set the env var, and silently misclassify
every Cycle-2 entry as `founding_cohort=1`.

**Fixed at `f2d484c` (v20260523o).** Cycle resolution now falls back to
`GAME_CONFIG.currentCycle` when the env var is unset. Also rewrote
`worker/README.md` into a Cycle-2 launch runbook with all 13 env vars
documented, 6-step verification checklist, sandbox smoke-test
procedure, and day-of monitoring queries.

## ⚠️ OPERATOR ACTION REQUIRED

The Worker is **not auto-deployed**. Pushing to GitHub does not deploy
the Worker. The operator must manually copy `worker/index.js` into the
Cloudflare dashboard before the fix takes effect:

1. https://dash.cloudflare.com/ → Workers & Pages → `tamjump-contact-api`
2. Top right → **Edit code**
3. Editor: **Ctrl+A → Delete** to clear completely
4. Paste fresh content from `worker/index.js` (commit `f2d484c` or
   later)
5. Click **Deploy**

If this step is skipped, the live Worker still has the v20260522
foot-gun.

## What was pushed this session

- `f2d484c` — v20260523o — Worker cycle-resolution fix + README
  launch runbook.

Tip of `origin/main` is `f2d484c`.

## The fix (`worker/index.js`)

Before (line 829):
```js
const cycleNumber = parseInt(env.CURRENT_CYCLE || "1", 10) || 1;
```

After:
```js
const cycleNumber = parseInt(env.CURRENT_CYCLE || String(GAME_CONFIG.currentCycle) || "1", 10) || 1;
```

Behavioral test (7/7 pass):

| `env.CURRENT_CYCLE`    | resolved cycle | notes                                  |
|------------------------|----------------|----------------------------------------|
| `undefined`            | 2              | uses `GAME_CONFIG.currentCycle=2`      |
| `""`                   | 2              | uses `GAME_CONFIG.currentCycle=2`      |
| `"2"`                  | 2              | env matches config                     |
| `"3"`                  | 3              | env overrides config (Cycle 3 hatch)   |
| `"garbage"`            | 1              | parse-fail floor                       |
| `"0"`                  | 1              | zero-floor                             |
| `"99"`                 | 99             | operator override accepted             |

The env var is now an *override hatch*, not a required setting.
Source of truth is `GAME_CONFIG.currentCycle` in `worker/index.js`.

## The README rewrite (`worker/README.md`)

Old README had 92 lines, documented 7 env vars, the curl example used
the legacy `/entry` endpoint (entry.html stopped using it in v20260522
when integrated payment landed). New README has 252 lines and covers:

- **All 13 env vars** the Worker reads: `ADMIN_EMAIL`, `FROM_EMAIL`,
  `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`,
  `ADMIN_TOKEN`, `TURNSTILE_SECRET`, `CURRENT_CYCLE`, `SQUARE_ENV`,
  `SQUARE_APPLICATION_ID`, `SQUARE_LOCATION_ID`, `SQUARE_ACCESS_TOKEN`,
  and the D1 `DB` binding.
- **All endpoints** with auth requirements (Mission Entry × 4, My Page
  × 4, Game × 10, Hall of Kings × 2, Admin × 2).
- **Cycle 2 launch checklist** in 6 steps: env vars → source sync →
  health curl → sandbox smoke test → cron trigger → day-of monitoring.
- **D1 contacts column mapping** updated with `founding_cohort`,
  `paid`, `square_payment_id` (the columns added in v20260522 when the
  integrated Square flow landed).

## Cycle 2 launch — operator action items (recap)

By Wed 2026-05-27 morning JST:

1. **Re-deploy the Worker** (manual paste step above) so the cycle-
   resolution fix is live.
2. **Verify env vars** (per README §1):
   - `SQUARE_ENV=production`
   - `SQUARE_APPLICATION_ID`, `SQUARE_LOCATION_ID`, `SQUARE_ACCESS_TOKEN`
     set with production Square credentials
   - `CURRENT_CYCLE=2` is now *optional* but recommended for clarity
3. **Update `api/cycle.json`** to:
   ```json
   { "schema": 1, "cycle": 2, "phase": "live", ... }
   ```
   (Pages auto-deploys this; no manual step.)
4. **Verify** via the curl health checks in `worker/README.md` §3.
5. **Sandbox smoke test** if you want to be paranoid: temporarily flip
   `SQUARE_ENV=sandbox`, run one ¥100 test on entry.html with card
   `4111 1111 1111 1111`, verify D1 row has `founding_cohort=2` and
   `paid=1`, then flip `SQUARE_ENV=production` and redeploy.

## Open issues / next session candidates

1. **Translate doctrine pages.** `money.html` (Money Logic v1.0) and
   `verify.html` (Provably Fair) are EN+JP-only by design. Operator
   may want broader access — that's a translation/copy decision.
2. **TIER-2 language regression check.** Google Translate cookie
   hijack hasn't been spot-checked in a browser since the session ⑪
   `i18n.js` rebuild.
3. **`/admin/game/phase2/draw` cron audit.** The README assumes a
   cron schedule of `25 14 * * 5` (Fri 14:25 UTC = 23:25 JST). Need to
   verify in the Cloudflare dashboard that this trigger is actually
   configured, not just documented.
4. **Mission Fund running total backfill.** `kings.html` reads
   `/game/mission-fund` which returns `totalCollectedJpy` and
   `totalPaidEntries` across all cycles. With Cycle 1 sealed as a test
   (0 paid entries), this should return `{ totalPaidEntries: 0,
   totalCollectedJpy: 0 }` right now. Worth spot-checking after the
   Worker redeploy.

## Credentials (unchanged)

See `HANDOFF_2026-05-23_session10_FINAL.md` § 1.

— end of session ⑭ —
