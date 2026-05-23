# HANDOFF — Session ⑮ (2026-05-23)

## TL;DR

Continuing the Cycle-2 launch dry-run audit started in session ⑭.
Found and fixed three more correctness issues in `worker/index.js`,
all of which had the potential to bite during Cycle 2's live run.
Pushed as commit `66a5cdd` (v20260523p).

## ⚠️ OPERATOR ACTION REQUIRED

Same as session ⑭ — the Worker is **not auto-deployed**. Pushing
to GitHub does not deploy the Worker. The operator must manually
copy `worker/index.js` into the Cloudflare dashboard:

1. https://dash.cloudflare.com/ → Workers & Pages → `tamjump-contact-api`
2. Top right → **Edit code**
3. Ctrl+A → Delete → paste fresh `worker/index.js` from commit
   `66a5cdd` or later
4. Click **Deploy**

If you skipped session ⑭'s redeploy too, this single redeploy
covers both `v20260523o` and `v20260523p` since `66a5cdd` includes
all earlier worker changes.

## What was pushed this session

- `66a5cdd` — v20260523p — Worker: unified cycle resolution +
  SHA picker fix + seed-input guard.

Tip of `origin/main` is `66a5cdd`.

## The four fixes

### Fix 1 — `resolveCurrentCycle(env)` helper (unifies read + write)

Session ⑭ fixed `/entry/pay` (the write path) to fall back to
`GAME_CONFIG.currentCycle` when `env.CURRENT_CYCLE` is unset. But
~14 other call sites in the Worker still read
`GAME_CONFIG.currentCycle` directly, ignoring the env override
entirely. If the operator ever set `env.CURRENT_CYCLE=3` to stage-test
Cycle 3 while keeping the source at Cycle 2, **new entries would
write `founding_cohort=3` while game-session lookups would still hit
Cycle 2** — silently breaking the entry funnel.

Now everything goes through one helper:

```js
function resolveCurrentCycle(env) {
  const fromEnv = env && env.CURRENT_CYCLE ? parseInt(env.CURRENT_CYCLE, 10) : NaN;
  if (Number.isInteger(fromEnv) && fromEnv > 0) return fromEnv;
  const fromConfig = parseInt(GAME_CONFIG.currentCycle, 10);
  if (Number.isInteger(fromConfig) && fromConfig > 0) return fromConfig;
  return 1;
}
```

Behavioral test 9/9 pass. Covers: undefined, empty, `"2"`, `"3"`,
`"garbage"`, `"0"`, `"-5"`, `"99"`. Negative numbers and zero now
correctly fall back to GAME_CONFIG (the old code would have accepted
`"-5"` and bound it into SQL).

### Fix 2 — `parseCycleOverride(value, env)` helper

Admin handlers (`/game/phase2/draw`, `/game/phase3/finalize`) and
read endpoints (`/game/phase2/result`, `/game/phase3/result`)
accepted a caller-supplied override via `body.cycle` or
`?cycle=N`. The old code was:

```js
const cycle = parseInt(body.cycle || GAME_CONFIG.currentCycle, 10);
```

If `body.cycle = "abc"`, `parseInt` returned `NaN`, which bound into
SQL as `NaN`. The query returned no rows; the handler responded
"Phase 2 not yet drawn" rather than a clear validation error. An
operator debugging the issue had no signal the input was malformed.

New code:

```js
function parseCycleOverride(value, env) {
  const n = parseInt(value, 10);
  if (Number.isInteger(n) && n > 0) return n;
  return resolveCurrentCycle(env);
}
```

Then at each call site:

```js
const cycle = parseCycleOverride(body.cycle, env);
const cycle = parseCycleOverride(url.searchParams.get("cycle"), env);
```

Behavioral test 11/11 pass.

### Fix 3 — SHA-256 picker offset bug

The 3-of-N winner pick used:

```js
const chunk = hash.substring((i * 8) % 56, ((i * 8) % 56) + 8);
```

A SHA-256 hex hash is 64 chars. The code samples 8-char windows.
The valid offsets are `0, 8, 16, 24, 32, 40, 48, 56` — eight in
total. But `% 56` cycles through `{0, 8, 16, 24, 32, 40, 48}` — only
seven distinct offsets. **Offset 56 (the last 8 hex chars, i.e. the
last 32 bits of every hash) is never sampled.** The picker silently
ignored one chunk of entropy every cycle.

This isn't a security issue (the seed is publicly auditable and the
draw is still deterministic), but it's the kind of mistake that
auditors will rightly flag, and there's no good reason to leave it.

Fix:

```js
const off = (i * 8) % 57;  // 0..56 inclusive — all 8-char windows
const chunk = hash.substring(off, off + 8);
```

Verified by direct sampling of a known hash: new code finds 8
distinct (offset, chunk) pairs in the first 8 iterations; old code
found 7.

### Fix 4 — Phase 2 SHA-256 seed-input guard

The handler accepted optional `btcHash`, `nikkeiClose`, `sp500Close`
in the request body. If any was missing, it silently filled in
zeros (`0000...0000`, `0`, `0`) and ran the draw anyway:

```js
const btc = body.btcHash || "0000000000000000000000000000000000000000000000000000000000000000";
const nikkei = body.nikkeiClose || "0";
const sp500 = body.sp500Close || "0";
```

The seed would still be deterministic and the hash publicly
verifiable, but it would not be bound to real-world market data —
defeating the whole purpose of the public-verifiability narrative
(Bell-day Bitcoin block hash + market closes can't be predicted in
advance; zeros can).

If the operator forgets to paste the live values when running the
cron, every Cycle 2 winner can correctly object that the operator
could have run the draw at any moment, with any seed of their
choosing.

Fix: handler now returns `400 { error: "Public seed inputs
required..." }` unless either:

- all three of `btcHash`, `nikkeiClose`, `sp500Close` are supplied,
  OR
- the caller explicitly sets `allowSyntheticSeed: true` (testing
  only).

The `allowSyntheticSeed` hatch is documented in the error message
itself so an operator who really does want a synthetic draw (dry-run
testing) knows how to opt in.

## Updated draw-day operator workflow (for the cron — or manual call)

On Bell day (Fri 5/29 23:23 JST + a few seconds for the cron):

```bash
# Real run — must include all three market inputs
curl -X POST https://tamjump-contact-api.animalb001.workers.dev/game/phase2/draw \
  -H "Authorization: Bearer kingmaker-admin-tiger-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "cycle": 2,
    "btcHash": "<paste latest BTC block hash here>",
    "nikkeiClose": "<5/29 Nikkei 225 close>",
    "sp500Close": "<5/29 S&P 500 close>"
  }'

# Dry-run / testing only
curl -X POST https://tamjump-contact-api.animalb001.workers.dev/game/phase2/draw \
  -H "Authorization: Bearer kingmaker-admin-tiger-2026" \
  -H "Content-Type: application/json" \
  -d '{"cycle": 2, "allowSyntheticSeed": true}'
```

If the operator-side cron is configured to call `/game/phase2/draw`
without a body, it will now return a 400. The cron needs to be
updated to either:
- Fetch the BTC hash + market closes itself before calling the
  endpoint, OR
- Pass `allowSyntheticSeed: true` (NOT recommended — defeats the
  public-verifiability narrative).

The README needs a follow-up update to document this; see "Next
session priorities" below.

## Behavioral verification (offline, in this container)

| Test                                              | Result          |
|---------------------------------------------------|-----------------|
| `resolveCurrentCycle()` — 9 input variants       | 9/9 pass        |
| `parseCycleOverride()` — 11 input combinations    | 11/11 pass      |
| SHA picker — sample all 8 windows                 | 8 windows found |
| SHA picker old code (for comparison)              | 7 windows found |
| Seed-input guard — accept/reject matrix           | 6/6 pass        |
| `node --check worker/index.js`                    | OK              |

## Cycle 2 launch — operator action items (cumulative recap)

By Wed 2026-05-27 morning JST:

1. **Re-deploy the Worker** (manual paste step). Picks up `v20260523o`
   (session ⑭ cycle resolver) AND `v20260523p` (this session's
   audit fixes) in one paste.
2. **Verify env vars** (per `worker/README.md` § 1).
3. **Update `api/cycle.json`** to `cycle: 2, phase: "live"`.
4. **Update the operator-side cron** that calls `/game/phase2/draw`
   to fetch and pass the three market inputs. Without this, the
   Fri 5/29 23:23 draw will 400.
5. **Verify** via curl health checks in `worker/README.md` § 3.
6. **Sandbox smoke test** if paranoid: flip `SQUARE_ENV=sandbox`,
   one ¥100 test entry, verify D1 row, flip back.

## Open issues / next session candidates

1. **Update `worker/README.md` for v20260523p.** The README's curl
   example for `/game/phase2/draw` needs to include the new
   required body fields. The "draw with zeros" path should be
   documented as deprecated / testing-only.
2. **Operator-side cron audit.** If a cron exists in the Cloudflare
   dashboard that calls `/game/phase2/draw` without a body, it
   needs to either be updated to pass the three market inputs or
   replaced with a wrapper that fetches them before forwarding the
   call. Without dashboard access I can't see what's actually
   configured.
3. **Translate doctrine pages.** `money.html` (Money Logic v1.0) and
   `verify.html` (Provably Fair) are EN+JP-only by design. Operator
   may want broader access — translation/copy decision.
4. **TIER-2 language regression check.** Google Translate cookie
   hijack hasn't been spot-checked in a browser since the session
   ⑪ `i18n.js` rebuild.
5. **End-to-end Cycle 2 dry-run.** With Worker redeployed and
   `api/cycle.json` flipped, run one ¥100 entry from a personal
   account in sandbox mode and walk through quiz → wait → vote on
   the staged date.

## Credentials (unchanged)

See `HANDOFF_2026-05-23_session10_FINAL.md` § 1.

— end of session ⑮ —
