#!/usr/bin/env node
// ============================================================
// KINGMAKER 23:23 — Phase 2 auto-draw helper
//
// Usage (on the operator's local machine, at ~23:24 JST on Bell day):
//
//   ADMIN_TOKEN=kingmaker-admin-tiger-2026 \
//     node scripts/phase2-auto-draw.js
//
//   # Or with options:
//   ADMIN_TOKEN=... node scripts/phase2-auto-draw.js --cycle 2 --dry-run
//
// What it does (in this order):
//   1. Fetches the current Bitcoin block tip hash from blockstream.info
//      (fallback to mempool.space if blockstream is unreachable).
//   2. Fetches the most recent Nikkei 225 close from Yahoo Finance
//      (Friday's close, which closes at 15:00 JST = 06:00 UTC, ~8h
//      before the Bell rings at 23:23 JST).
//   3. Fetches the most recent S&P 500 close from Yahoo Finance.
//      Note: the S&P closes at 16:00 NY = 21:00 UTC, AFTER our 14:25
//      UTC draw on Friday. So this fetch will return THURSDAY'S
//      close, not Friday's. That's intentional — Thursday's close is
//      the latest one that's actually settled at draw time, and it
//      was unknowable when entries opened on Wednesday 23:23 JST, so
//      it still serves the public-verifiability requirement.
//   4. Prints the three values, asks the operator to confirm, then
//      POSTs to /game/phase2/draw with them.
//
// REQUIREMENTS:
//   - Node.js 18+ (for built-in fetch).
//   - ADMIN_TOKEN env var set.
//   - The operator's local network must be able to reach:
//       blockstream.info, mempool.space, query1.finance.yahoo.com,
//       tamjump-contact-api.animalb001.workers.dev.
//   - Run from the laptop, NOT from the Cloudflare Worker — the
//     worker's egress allowlist would need to be expanded to reach
//     these public APIs.
//
// If any data source fails, the script aborts BEFORE calling the
// worker. The operator can then paste manually using curl (see
// worker/README.md §5). v20260523p's seed-input guard refuses to
// run the draw with placeholder zeros, so this script never lies
// about what data was used.
// ============================================================

const WORKER_BASE = process.env.WORKER_BASE
  || "https://tamjump-contact-api.animalb001.workers.dev";

function parseArgs() {
  const args = { cycle: null, dryRun: false, skipPrompt: false };
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a === '--cycle') { args.cycle = parseInt(process.argv[++i], 10); }
    else if (a === '--dry-run') { args.dryRun = true; }
    else if (a === '--yes' || a === '-y') { args.skipPrompt = true; }
    else if (a === '--help' || a === '-h') {
      console.log(`Usage: ADMIN_TOKEN=<token> node scripts/phase2-auto-draw.js [options]

Options:
  --cycle N        Override cycle (default: worker uses GAME_CONFIG.currentCycle)
  --dry-run        Fetch market data and print what would be sent, but don't POST
  --yes, -y        Skip the confirmation prompt before POSTing
  --help, -h       This message`);
      process.exit(0);
    }
  }
  return args;
}

async function fetchBtcBlockHash() {
  const sources = [
    "https://blockstream.info/api/blocks/tip/hash",
    "https://mempool.space/api/blocks/tip/hash",
  ];
  for (const url of sources) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'kingmaker-phase2-fetcher/1.0' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const hash = (await r.text()).trim();
      if (!/^[a-f0-9]{64}$/i.test(hash)) {
        throw new Error(`unexpected response shape: ${hash.slice(0, 80)}`);
      }
      return { hash, source: url };
    } catch (e) {
      console.error(`  [btc] ${url} failed: ${e.message}`);
    }
  }
  throw new Error("All Bitcoin block-hash sources failed.");
}

async function fetchYahooClose(symbol, label) {
  // Yahoo's chart API returns recent quotes; the last entry's close is
  // the most recent settled value.
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=5d&interval=1d`;
  const r = await fetch(url, {
    headers: {
      'User-Agent': 'kingmaker-phase2-fetcher/1.0',
      'Accept': 'application/json',
    },
  });
  if (!r.ok) throw new Error(`${label}: HTTP ${r.status}`);
  const json = await r.json();
  const result = json && json.chart && json.chart.result && json.chart.result[0];
  if (!result) throw new Error(`${label}: no chart.result in response`);
  const timestamps = result.timestamp || [];
  const closes = (result.indicators && result.indicators.quote && result.indicators.quote[0] && result.indicators.quote[0].close) || [];
  if (timestamps.length === 0 || closes.length === 0) {
    throw new Error(`${label}: empty timestamps or closes`);
  }
  // Walk backwards to find the most recent NON-NULL close.
  for (let i = closes.length - 1; i >= 0; i--) {
    if (closes[i] != null && timestamps[i] != null) {
      return {
        value: closes[i],
        timestamp: new Date(timestamps[i] * 1000).toISOString(),
      };
    }
  }
  throw new Error(`${label}: no non-null close in last 5 days`);
}

async function confirmPrompt(text) {
  process.stdout.write(text);
  return new Promise((resolve) => {
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', (data) => {
      process.stdin.pause();
      resolve(data.toString().trim().toLowerCase());
    });
    process.stdin.resume();
  });
}

function fmt(n) {
  if (typeof n === 'number' && Number.isFinite(n)) {
    return n.toFixed(2);
  }
  return String(n);
}

async function main() {
  const args = parseArgs();

  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    console.error("ERROR: ADMIN_TOKEN env var is required.");
    console.error("Usage: ADMIN_TOKEN=<token> node scripts/phase2-auto-draw.js");
    process.exit(1);
  }

  console.log("=== KINGMAKER 23:23 Phase 2 auto-draw helper ===");
  console.log(`Worker base: ${WORKER_BASE}`);
  console.log(`Cycle:       ${args.cycle ?? "(worker default)"}`);
  console.log(`Dry run:     ${args.dryRun}`);
  console.log("");

  console.log("Step 1/4: fetching Bitcoin block tip hash...");
  const btc = await fetchBtcBlockHash();
  console.log(`  ✓ ${btc.hash}`);
  console.log(`    source: ${btc.source}`);
  console.log("");

  console.log("Step 2/4: fetching Nikkei 225 most recent close...");
  const nikkei = await fetchYahooClose("^N225", "Nikkei 225");
  console.log(`  ✓ ${fmt(nikkei.value)}  (${nikkei.timestamp})`);
  console.log("");

  console.log("Step 3/4: fetching S&P 500 most recent settled close...");
  console.log("           (note: at Fri 14:25 UTC the SAME-day S&P close");
  console.log("            hasn't happened yet — this will be Thursday's)");
  const sp500 = await fetchYahooClose("^GSPC", "S&P 500");
  console.log(`  ✓ ${fmt(sp500.value)}  (${sp500.timestamp})`);
  console.log("");

  const body = {
    btcHash: btc.hash,
    nikkeiClose: String(nikkei.value),
    sp500Close: String(sp500.value),
  };
  if (args.cycle != null) body.cycle = args.cycle;

  console.log("Step 4/4: payload to be POSTed to /game/phase2/draw:");
  console.log(JSON.stringify(body, null, 2));
  console.log("");

  if (args.dryRun) {
    console.log("--dry-run set; not posting. Exiting.");
    return;
  }

  if (!args.skipPrompt) {
    const answer = await confirmPrompt("Type 'yes' to send (anything else cancels): ");
    if (answer !== 'yes') {
      console.log("Cancelled. No request sent.");
      process.exit(0);
    }
  }

  console.log("Posting to /game/phase2/draw...");
  const r = await fetch(`${WORKER_BASE}/game/phase2/draw`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const respText = await r.text();
  let respJson;
  try { respJson = JSON.parse(respText); } catch (e) { respJson = null; }

  console.log(`Response: HTTP ${r.status}`);
  if (respJson) {
    console.log(JSON.stringify(respJson, null, 2));
  } else {
    console.log(respText);
  }

  if (!r.ok) {
    console.error("");
    console.error("Draw failed. Check the response above. Common issues:");
    console.error("  - 401: ADMIN_TOKEN is wrong.");
    console.error("  - 400: invalid cycle, or seed-input guard tripped.");
    console.error("  - 400 'No passers in this cycle.': Phase 1 had no passers.");
    process.exit(1);
  }

  if (respJson && respJson.alreadyDrawn) {
    console.log("");
    console.log("This cycle was already drawn. No change.");
  } else if (respJson && respJson.ok) {
    console.log("");
    console.log("✓ Phase 2 draw complete.");
    console.log(`  cycle:        ${respJson.cycle}`);
    console.log(`  passerCount:  ${respJson.passerCount}`);
    console.log(`  winners (king IDs): ${JSON.stringify(respJson.winners)}`);
    console.log(`  seed:         ${respJson.seed}`);
    console.log(`  hash:         ${respJson.hash}`);
  }
}

main().catch((e) => {
  console.error("");
  console.error("FATAL:", e.message);
  console.error("");
  console.error("Fall back to manual paste — see worker/README.md §5 for the curl command.");
  process.exit(1);
});
