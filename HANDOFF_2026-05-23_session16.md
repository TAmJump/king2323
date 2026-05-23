# HANDOFF — Session ⑯ (2026-05-23)

## TL;DR

Eliminates the operator's biggest manual step on Cycle 2 Bell day
(Fri 5/29 23:25 JST): pasting Bitcoin block hash + Nikkei close +
S&P 500 close into a curl command within a ~60-second window. New
helper script `scripts/phase2-auto-draw.js` runs on the operator's
local PC, fetches all three values automatically, and POSTs to
`/game/phase2/draw` after a one-line confirmation prompt.

Also fixes two temporally-inverted lines in `worker/README.md` that
told the operator to use the wrong day's S&P 500 close (the previous
guidance had it inverted relative to the timezone math).

Single commit pushed: `bea258f` — v20260523s. Tip of `origin/main`
is `bea258f`.

## What was pushed this session

- `bea258f` — v20260523s — `scripts/phase2-auto-draw.js` (new) +
  `worker/README.md` (market-data day corrections + helper section).

No Worker code changes this session. No redeploy needed for this
commit. The cumulative redeploy still owed from sessions ⑭/⑮
remains owed (see "Operator action items" below).

## The market-data day-of-week problem

This was a documentation bug that would have caused the operator to
use the wrong S&P 500 close on Bell day. The fix is one paragraph in
the README, but the underlying timezone math matters enough to write
up here:

| Event                  | UTC          | JST            | NY                |
|------------------------|--------------|----------------|-------------------|
| Bell rings             | Fri 14:23    | Fri 23:23 JST  | Fri 10:23         |
| Phase 2 draw fires     | Fri 14:25    | Fri 23:25 JST  | Fri 10:25         |
| Nikkei 225 closes      | Fri 06:00    | Fri 15:00 JST  | Fri 02:00         |
| S&P 500 closes         | Fri 21:00    | Sat 06:00 JST  | Fri 16:00         |
| BTC: blocks every ~10m | continuous   | continuous     | continuous        |

So at draw time:
- **Nikkei**: Friday's close has already happened 8 hours ago. Use
  same-day Friday close. ✓
- **S&P 500**: Friday's close hasn't happened yet (~7 hours away).
  Must use **Thursday's** close. ✗ (the previous README said to use
  "the day's last close" which doesn't exist yet)
- **BTC**: latest block, whatever block was mined most recently.
  Around the Bell ring there'll usually be a block within ±5
  minutes. ✓

The corrected README spells this out in three places (the API
docstring, the curl example template, and the Bell-day flow section).

## The helper script

`scripts/phase2-auto-draw.js` — standalone Node 18+ script,
no npm dependencies, ~250 lines including comments.

Run from operator's PC at ~23:24 JST on Fri 5/29:

```bash
ADMIN_TOKEN=kingmaker-admin-tiger-2026 \
  node scripts/phase2-auto-draw.js --cycle 2
```

Output (sample, on the operator's machine where network works):

```
=== KINGMAKER 23:23 Phase 2 auto-draw helper ===
Worker base: https://tamjump-contact-api.animalb001.workers.dev
Cycle:       2
Dry run:     false

Step 1/4: fetching Bitcoin block tip hash...
  ✓ 00000000000000000000abc...def123  (64 hex chars)
    source: https://blockstream.info/api/blocks/tip/hash

Step 2/4: fetching Nikkei 225 most recent close...
  ✓ 38542.21  (2026-05-29T06:00:00.000Z)

Step 3/4: fetching S&P 500 most recent settled close...
           (note: at Fri 14:25 UTC the SAME-day S&P close
            hasn't happened yet — this will be Thursday's)
  ✓ 5847.92  (2026-05-28T20:00:00.000Z)   ← Thursday confirmed

Step 4/4: payload to be POSTed to /game/phase2/draw:
{
  "btcHash": "00000000000000000000abc...def123",
  "nikkeiClose": "38542.21",
  "sp500Close": "5847.92",
  "cycle": 2
}

Type 'yes' to send (anything else cancels): yes
Posting to /game/phase2/draw...
Response: HTTP 200
{
  "ok": true,
  "cycle": 2,
  "seed": "cycle:2|btc:00...|nikkei:38542.21|sp500:5847.92|n:1247",
  "hash": "abc123...",
  "winners": [12, 47, 191],
  "passerCount": 1247
}

✓ Phase 2 draw complete.
```

Options:
- `--cycle N` — override the cycle the worker would otherwise resolve
- `--dry-run` — fetch data and print payload, but don't POST
- `--yes` / `-y` — skip the confirmation prompt
- `--help` — print usage

Data sources (all public, no API key needed):
- BTC: `blockstream.info/api/blocks/tip/hash` (fallback:
  `mempool.space/api/blocks/tip/hash`).
- Nikkei: `query1.finance.yahoo.com/v8/finance/chart/^N225`.
- S&P 500: `query1.finance.yahoo.com/v8/finance/chart/^GSPC`.

If any source fails (network down, API rate-limited, regional
geoblock, etc.), the script aborts BEFORE the POST and tells the
operator to fall back to the manual curl in `worker/README.md §5`.

## Why a local script, not a second Cloudflare Worker

I considered the alternative — adding a `/admin/game/phase2/auto-draw`
endpoint inside the existing Worker that does the fetches server-side.
Rejected for three reasons:

1. **Egress allowlist unknown.** The contact-form Worker can talk to
   AWS SES and Square but blockstream/mempool/yahoo aren't in its
   allowlist (the operator's `wrangler.toml` doesn't grant general
   internet egress). Adding three new domains would be a separate
   dashboard step the operator would need to verify and may not want
   to grant.
2. **Single point of failure.** If Yahoo Finance rate-limits or returns
   an unexpected schema during the Worker's run, the Worker would
   have to either fail (taking down the draw) or succeed-with-degraded
   (which is exactly what the v20260523p seed-input guard was meant
   to prevent). Running on the operator's PC means a human is in the
   loop and any anomaly aborts before the irreversible POST.
3. **Operator already has a console open.** Bell day requires
   `wrangler tail tamjump-contact-api` (per README §6) which runs
   from the operator's PC. Adding one more `node scripts/...`
   command in the same terminal session is no friction.

If the operator prefers full automation in the future (e.g. Cycle 5+
when they're confident in the flow), the script's logic can be
trivially adapted into a second Cron-Trigger-fired Worker. The
fetch/POST pattern is identical; only the network egress permissions
need adding.

## Behavioral verification (in this container)

```
node --check scripts/phase2-auto-draw.js   → syntax OK
node scripts/phase2-auto-draw.js --help    → prints usage
node scripts/phase2-auto-draw.js           → "ERROR: ADMIN_TOKEN env var is required"
ADMIN_TOKEN=x node scripts/phase2-auto-draw.js --dry-run
  → cleanly fails at BTC fetch with HTTP 403 (this container's
    allowlist doesn't include blockstream.info), then prints the
    "Fall back to manual paste" message. Exit code 1.
```

The actual fetch behavior on the operator's unrestricted PC cannot
be tested from this container. That's the operator's pre-launch
verification step (#4 in the action items below).

## Cumulative Cycle 2 operator action items (all owed)

By Wed 2026-05-27 morning JST:

1. **Redeploy the Worker** via Cloudflare dashboard.
   - One paste of `worker/index.js` covers `v20260523o` (session ⑭),
     `v20260523p` (session ⑮ audit fixes), and `v20260523r` (session
     ⑮ scheduled handler).
   - This session ⑯ does NOT add code to the Worker, so the same
     paste is sufficient — no second redeploy needed.
2. **Set up the Cron Trigger** (one-time, in Cloudflare dashboard).
   - Workers & Pages → `tamjump-contact-api` → Triggers → Cron
     Triggers → Add → schedule `30 14 * * 5`.
3. **Update `api/cycle.json`** to `cycle: 2, phase: "live"`. Commit
   + push (Pages auto-deploys this file).
4. **NEW: Verify the helper script runs on operator's PC.** Run
   `node scripts/phase2-auto-draw.js --dry-run` before Bell day to
   confirm all three data sources are reachable from the operator's
   network. If anything fails, the operator has time to either fix
   the network or commit to manual paste.

## Open issues / next session candidates (largely unchanged from ⑮)

1. **Operator-side cron audit.** If there's any pre-existing external
   scheduler that calls `/game/phase2/draw` without market data,
   v20260523p will start 400'ing it. Operator-only visibility.
2. **Doctrine pages translation.** `money.html` + `verify.html` are
   EN+JP-only by design. Translation/copy decision.
3. **TIER-2 language regression check.** Google Translate cookie
   hijack untested since session ⑪.
4. **End-to-end Cycle 2 dry-run.** With worker redeployed +
   `api/cycle.json` flipped + Cron Trigger set + helper script
   verified: stage a full 5-minute simulation from a personal account
   in sandbox mode. Walk through quiz → wait → vote on a staged date.
5. **(no longer in this list)** ~~External market-data fetcher
   worker~~ — superseded by this session's local script. Promote the
   script into a second Worker only if/when full unattended automation
   is desired (see "Why a local script" above).

## Credentials (unchanged)

See `HANDOFF_2026-05-23_session10_FINAL.md` § 1.

— end of session ⑯ —
