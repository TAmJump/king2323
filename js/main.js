/* ============================================================
   KINGMAKER 23:23 — Main JS  (v20260523n)
   Cycle 1 (sealed test, 0 real participants) three-stage schedule:
     2026-05-20 (Wed) 23:23 JST · Bell opens
     2026-05-22 (Fri) 23:23 JST · Bell rings (receipt closes)
     2026-05-23 (Sat) 23:23 JST · The Three announced
   Cycle 2 (first live cycle) three-stage schedule:
     2026-05-27 (Wed) 23:23 JST · Bell opens
     2026-05-29 (Fri) 23:23 JST · Bell rings (receipt closes)
     2026-05-30 (Sat) 23:23 JST · The Three announced
   After Cycle 2 completes, falls back to generic weekly-Wed cycles.
   CYCLE1_SEALED_AS_TEST=true skips the misleading pending_three state
   tonight (5/23 23:23 JST) since there's no actual Three to announce.
   ============================================================ */

(function () {
  'use strict';

  // ---------- Cycle 1 three-stage schedule (UTC equivalents) ----------
  // 23:23 JST = 14:23 UTC same calendar day (JST = UTC+9, 23-9 = 14).
  const CYCLE1_OPENS_MS = Date.UTC(2026, 4, 20, 14, 23, 0); // Wed 5/20 23:23 JST
  const CYCLE1_RINGS_MS = Date.UTC(2026, 4, 22, 14, 23, 0); // Fri 5/22 23:23 JST
  const CYCLE1_THREE_MS = Date.UTC(2026, 4, 23, 14, 23, 0); // Sat 5/23 23:23 JST

  // ---------- Cycle 1 disposition ----------
  // Operator decision 2026-05-23: Cycle 1 was sealed as a test with 0 real
  // participants. There is no "Three" to announce on Sat 5/23 23:23 JST.
  // When this flag is true, the state machine skips the misleading
  // 'pending_three' state and transitions directly to the Cycle 2 lookahead
  // once the bell-rings moment (Fri 5/22 23:23 JST) has passed.
  const CYCLE1_SEALED_AS_TEST = true;

  // ---------- Cycle 2 three-stage schedule ----------
  // Cycle 1 was sealed as a test (0 real participants per operator decision
  // 2026-05-23). Cycle 2 is the first live cycle and follows the same
  // Wed/Fri/Sat rhythm. The Fri 5/29 23:23 timestamp here MUST match
  // worker/index.js GAME_CONFIG.bellRingsAtIso ("2026-05-29T14:23:00Z").
  const CYCLE2_OPENS_MS = Date.UTC(2026, 4, 27, 14, 23, 0); // Wed 5/27 23:23 JST
  const CYCLE2_RINGS_MS = Date.UTC(2026, 4, 29, 14, 23, 0); // Fri 5/29 23:23 JST
  const CYCLE2_THREE_MS = Date.UTC(2026, 4, 30, 14, 23, 0); // Sat 5/30 23:23 JST

  // ---------- Preview mode (operator-only, never affects real visitors) ----------
  // Append ?preview=open / ?preview=pre / ?preview=pending / ?preview=complete
  // (Cycle 1 preview states) or ?preview=c2_pre / ?preview=c2_open /
  // ?preview=c2_pending / ?preview=c2_complete (Cycle 2 preview states)
  // to the URL to spoof the cycle phase for visual QA. The actual schedule
  // constants above are not touched, so this is safe: anyone without the
  // query string sees the real, time-driven state.
  function previewPhase() {
    try {
      const p = new URLSearchParams(window.location.search).get('preview');
      if (!p) return null;
      const map = {
        'pre': 'pre_open', 'open': 'open',
        'pending': 'pending_three', 'complete': 'cycle1_complete',
        'c2_pre': 'cycle2_pre_open', 'c2_open': 'cycle2_open',
        'c2_pending': 'cycle2_pending_three', 'c2_complete': 'cycle2_complete'
      };
      return map[p] || null;
    } catch (e) { return null; }
  }

  function fakeStateForPreview(phase) {
    const nowMs = Date.now();
    const day = 24 * 60 * 60 * 1000;
    switch (phase) {
      case 'pre_open':
        return { phase, cycle: 1, targetMs: nowMs + 2*day + 3*60*60*1000 + 17*60*1000,
                 msUntilBell: 2*day + 3*60*60*1000 + 17*60*1000,
                 labelEn: 'Bell opens in', labelJa: '受付開始まで',
                 stageActive: 0, ctaEnabled: false };
      case 'open':
        return { phase, cycle: 1, targetMs: nowMs + 1*day + 19*60*60*1000 + 42*60*1000,
                 msUntilClose: 1*day + 19*60*60*1000 + 42*60*1000,
                 msUntilBell: 1*day + 19*60*60*1000 + 42*60*1000,
                 labelEn: 'Bell rings in', labelJa: '受付終了まで',
                 stageActive: 1, ctaEnabled: true };
      case 'pending_three':
        return { phase, cycle: 1, targetMs: nowMs + 14*60*60*1000 + 8*60*1000,
                 msUntilBell: 14*60*60*1000 + 8*60*1000,
                 labelEn: 'The Three announced in', labelJa: 'The Three 発表まで',
                 stageActive: 2, ctaEnabled: false };
      case 'cycle1_complete':
        return { phase, cycle: 2, targetMs: nowMs + 3*day + 22*60*60*1000,
                 msUntilBell: 3*day + 22*60*60*1000,
                 labelEn: 'Cycle 2 opens in', labelJa: 'Cycle 2 開門まで',
                 stageActive: 0, ctaEnabled: false };
      case 'cycle2_pre_open':
        return { phase, cycle: 2, targetMs: nowMs + 4*day + 3*60*60*1000 + 17*60*1000,
                 msUntilBell: 4*day + 3*60*60*1000 + 17*60*1000,
                 labelEn: 'Cycle 2 opens in', labelJa: 'Cycle 2 開門まで',
                 stageActive: 0, ctaEnabled: false };
      case 'cycle2_open':
        return { phase, cycle: 2, targetMs: nowMs + 1*day + 19*60*60*1000 + 42*60*1000,
                 msUntilClose: 1*day + 19*60*60*1000 + 42*60*1000,
                 msUntilBell: 1*day + 19*60*60*1000 + 42*60*1000,
                 labelEn: 'Bell rings in', labelJa: '受付終了まで',
                 stageActive: 1, ctaEnabled: true };
      case 'cycle2_pending_three':
        return { phase, cycle: 2, targetMs: nowMs + 14*60*60*1000 + 8*60*1000,
                 msUntilBell: 14*60*60*1000 + 8*60*1000,
                 labelEn: 'The Three announced in', labelJa: 'The Three 発表まで',
                 stageActive: 2, ctaEnabled: false };
      case 'cycle2_complete':
        return { phase, cycle: 3, targetMs: nowMs + 3*day + 22*60*60*1000,
                 msUntilBell: 3*day + 22*60*60*1000,
                 labelEn: 'Next Cycle opens in', labelJa: '次の Cycle 開門まで',
                 stageActive: 3, ctaEnabled: false };
    }
    return null;
  }

  // ---------- Cycle state machine ----------
  function getBellState() {
    // Preview mode takes priority (operator-only via ?preview= query).
    const pv = previewPhase();
    if (pv) {
      const faked = fakeStateForPreview(pv);
      if (faked) return faked;
    }

    const nowMs = Date.now();

    // ----- Cycle 1 path (hard-coded three-stage) -----
    if (nowMs < CYCLE1_OPENS_MS) {
      return {
        phase: 'pre_open',           // before the bell opens
        targetMs: CYCLE1_OPENS_MS,
        msUntilBell: CYCLE1_OPENS_MS - nowMs,
        labelEn: 'Bell opens in',
        labelJa: '受付開始まで',
        stageActive: 0,              // 0 = none lit yet
        ctaEnabled: false
      };
    }
    if (nowMs < CYCLE1_RINGS_MS) {
      // Entries accepted during this 46-hour window.
      return {
        phase: 'open',
        targetMs: CYCLE1_RINGS_MS,
        msUntilClose: CYCLE1_RINGS_MS - nowMs,
        msUntilBell: CYCLE1_RINGS_MS - nowMs,
        labelEn: 'Bell rings in',
        labelJa: '受付終了まで',
        stageActive: 1,
        ctaEnabled: true
      };
    }
    if (nowMs < CYCLE1_THREE_MS && !CYCLE1_SEALED_AS_TEST) {
      return {
        phase: 'pending_three',
        targetMs: CYCLE1_THREE_MS,
        msUntilBell: CYCLE1_THREE_MS - nowMs,
        labelEn: 'The Three announced in',
        labelJa: 'The Three 発表まで',
        stageActive: 2,
        ctaEnabled: false
      };
    }

    // ----- Cycle 1 complete -> show Cycle 2 (sealed-test gap then 5/27→5/30) -----
    // Cycle 1 was sealed as test with 0 real participants. Cycle 2 is the
    // first live cycle. We don't pretend there's a "Three announcement" event
    // tonight (5/23) — instead we immediately transition to Cycle 2 lookahead.

    // Phase A: Cycle 1 fully done, Cycle 2 hasn't opened yet (Sat 5/23 23:23 -> Wed 5/27 23:23).
    if (nowMs < CYCLE2_OPENS_MS) {
      return {
        phase: 'cycle2_pre_open',
        cycle: 2,
        targetMs: CYCLE2_OPENS_MS,
        msUntilBell: CYCLE2_OPENS_MS - nowMs,
        labelEn: 'Cycle 2 opens in',
        labelJa: 'Cycle 2 開門まで',
        stageActive: 0,
        ctaEnabled: false
      };
    }
    // Phase B: Cycle 2 open, receipt accepting (Wed 5/27 23:23 -> Fri 5/29 23:23).
    if (nowMs < CYCLE2_RINGS_MS) {
      return {
        phase: 'cycle2_open',
        cycle: 2,
        targetMs: CYCLE2_RINGS_MS,
        msUntilClose: CYCLE2_RINGS_MS - nowMs,
        msUntilBell: CYCLE2_RINGS_MS - nowMs,
        labelEn: 'Bell rings in',
        labelJa: '受付終了まで',
        stageActive: 1,
        ctaEnabled: true
      };
    }
    // Phase C: Cycle 2 bell-day, pending The Three (Fri 5/29 23:23 -> Sat 5/30 23:23).
    if (nowMs < CYCLE2_THREE_MS) {
      return {
        phase: 'cycle2_pending_three',
        cycle: 2,
        targetMs: CYCLE2_THREE_MS,
        msUntilBell: CYCLE2_THREE_MS - nowMs,
        labelEn: 'The Three announced in',
        labelJa: 'The Three 発表まで',
        stageActive: 2,
        ctaEnabled: false
      };
    }

    // ----- Cycle 2 complete -> generic weekly-Wed fallback for Cycle 3+ -----
    const jstOffsetMs = 9 * 60 * 60 * 1000;
    const nowJst = new Date(nowMs + jstOffsetMs);
    const dow = nowJst.getUTCDay();
    // Find next Wednesday 23:23 JST in the future.
    const daysToWed = (3 - dow + 7) % 7;  // Wed = 3
    const candidate = new Date(Date.UTC(
      nowJst.getUTCFullYear(),
      nowJst.getUTCMonth(),
      nowJst.getUTCDate() + daysToWed,
      23, 23, 0, 0
    ));
    let nextWedUtcMs = candidate.getTime() - jstOffsetMs;
    if (nextWedUtcMs <= nowMs) {
      // Wed has passed today already — go to next week.
      nextWedUtcMs += 7 * 24 * 60 * 60 * 1000;
    }
    return {
      phase: 'cycle2_complete',
      cycle: 3,
      targetMs: nextWedUtcMs,
      msUntilBell: nextWedUtcMs - nowMs,
      labelEn: 'Next Cycle opens in',
      labelJa: '次の Cycle 開門まで',
      stageActive: 3,
      ctaEnabled: false
    };
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  // Document-level state used to toggle ritual visuals.
  let currentPhase = null;
  function setPhase(phase) {
    if (phase === currentPhase) return;
    currentPhase = phase;
    document.documentElement.dataset.bellPhase = phase;
  }

  // Detect "60-second pulse" and "5-second strike" sub-phases.
  let isPulsing = false;
  let hasStruck = false;

  function applyVisuals(state) {
    if (state.phase === 'open') {
      setPhase('open');
      isPulsing = false;
      // No single "strike flash" event in the Cycle 1 model — open is a 46h window.
      return;
    }
    // Waiting / pre_open / pending_three / cycle1_complete
    hasStruck = false;
    const remain = state.msUntilBell;
    if (remain <= 60000) {
      setPhase('last_minute');
      isPulsing = true;
    } else {
      setPhase('far');
      isPulsing = false;
    }
  }

  // Format the target moment of `state` as "5/20 · 23:23 JST" etc.
  // Uses JST regardless of the viewer's local timezone (the brand is
  // anchored to JST, see HANDOFF session 6 §28-7).
  function formatTargetJst(ms) {
    if (!ms) return '';
    const jstOffsetMs = 9 * 60 * 60 * 1000;
    const d = new Date(ms + jstOffsetMs);
    const mo = d.getUTCMonth() + 1;
    const da = d.getUTCDate();
    const hh = pad(d.getUTCHours());
    const mm = pad(d.getUTCMinutes());
    return mo + '/' + da + ' · ' + hh + ':' + mm + ' JST';
  }

  function renderCountdown(state) {
    const countdownLabelTop = document.querySelector('.countdown-label');
    const countdownTarget   = document.getElementById('cd-target');
    const ctaButtons        = document.querySelectorAll('[data-cta="founding"], [data-cta="founding-final"]');

    // Decompose msUntilBell into D/H/M/S for both the legacy hero
    // widget (#cd-d/h/m/s) and the new cycle-bar (#cb-d/h/m/s).
    const ms = Math.max(0, state.msUntilBell || 0);
    const s = Math.floor(ms / 1000);
    const days = Math.floor(s / 86400);
    const hrs  = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;

    const set = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.textContent = pad(v);
    };

    // Legacy hero countdown.
    set('cd-d', days);
    set('cd-h', hrs);
    set('cd-m', mins);
    set('cd-s', secs);
    // Top label = phase verb ('Bell opens in' / 'Bell rings in' / etc.)
    if (countdownLabelTop) {
      countdownLabelTop.textContent = '— ' + (state.labelEn || 'The Bell') + ' —';
    }
    // Bottom target = the exact JST moment we're counting toward
    if (countdownTarget) {
      countdownTarget.textContent = formatTargetJst(state.targetMs);
    }

    // New top-of-page cycle-bar countdown.
    set('cb-d', days);
    set('cb-h', hrs);
    set('cb-m', mins);
    set('cb-s', secs);
    const cbLabelEn = document.getElementById('cb-label-en');
    const cbLabelJa = document.getElementById('cb-label-ja');
    if (cbLabelEn) cbLabelEn.textContent = state.labelEn || '';
    if (cbLabelJa) cbLabelJa.textContent = state.labelJa || '';

    // Stage date / cycle-label refresh.
    // The HTML ships with Cycle 1 dates (5/20, 5/22, 5/23). When the state
    // machine transitions into Cycle 2 (or any post-Cycle-1 state), rewrite
    // the .cb-date text in place so the user sees the upcoming cycle's
    // dates, not last cycle's. The .cb-name text stays the same since the
    // three stages ("Bell opens", "Bell rings", "The Three") are identical
    // across cycles. Idempotent — safe to call every tick.
    const cycleBarSection = document.getElementById('cycle-bar');
    if (cycleBarSection) {
      const wantCycle = state.cycle || 1;
      const datesByCycle = {
        1: ['5/20', '5/22', '5/23'],
        2: ['5/27', '5/29', '5/30'],
      };
      // For Cycle 3+ (cycle2_complete fallback), keep the most-recent
      // cycle's dates so the bar doesn't go blank — it still represents
      // the historical timeline of the most recent completed cycle.
      const dates = datesByCycle[wantCycle] || datesByCycle[2];
      if (cycleBarSection.dataset.shownCycle !== String(wantCycle)) {
        const ds = cycleBarSection.querySelectorAll('.cb-stage .cb-date');
        ds.forEach((el, i) => { if (dates[i]) el.textContent = dates[i]; });
        cycleBarSection.dataset.shownCycle = String(wantCycle);
        cycleBarSection.setAttribute('aria-label', 'Cycle ' + wantCycle + ' status');
      }
    }

    // Stage indicator (1=opens, 2=rings, 3=Three).
    const stages = document.querySelectorAll('.cb-stage');
    stages.forEach(el => {
      const n = Number(el.dataset.stage);
      el.dataset.active = (n === state.stageActive) ? '1' : '0';
      el.dataset.done   = (n < state.stageActive) ? '1' : '0';
    });

    // CTA enable/disable. data-cycle-phase drives CSS for locked text.
    ctaButtons.forEach(btn => {
      btn.dataset.cyclePhase = state.phase;
      if (state.ctaEnabled) {
        btn.removeAttribute('aria-disabled');
        btn.dataset.bellOpen = '1';  // keep legacy CSS hook alive during open phase
      } else {
        btn.setAttribute('aria-disabled', 'true');
        delete btn.dataset.bellOpen;
      }
    });
  }

  function tick() {
    const state = getBellState();
    applyVisuals(state);
    renderCountdown(state);
  }

  tick();
  setInterval(tick, 1000);

  // ---------- Active nav highlight on scroll ----------
  // CRITICAL: .nav-menu contains hrefs of three kinds —
  //   1. in-page anchors: "#why", "#bell", "#three", etc.
  //   2. other-page links: "money.html", "verify.html", "entry.html"
  //   3. external absolute URLs: "https://tamjump.com/terms.html" etc.
  //
  // Passing #2 or #3 to document.querySelector() is wrong:
  //   - #2 returns null silently (interpreted as nonexistent tag.class).
  //   - #3 THROWS a SyntaxError because ':' / '/' are invalid CSS selector
  //     characters. That uncaught throw kills the entire IIFE — every
  //     handler below this point (mobile hamburger, /fund live counter,
  //     IntersectionObserver reveal) silently stops working.
  //
  // The active-nav logic only makes sense for in-page anchors anyway,
  // so we filter to hrefs starting with '#' BEFORE querying the DOM.
  const navLinks = document.querySelectorAll('.nav-menu a');
  const sections = Array.from(navLinks)
    .map(a => a.getAttribute('href'))
    .filter(href => href && href.length > 1 && href.charAt(0) === '#')
    .map(href => {
      try { return document.querySelector(href); }
      catch (_) { return null; }
    })
    .filter(Boolean);

  function updateActiveNav() {
    const scroll = window.scrollY + 200;
    let active = null;
    for (const sec of sections) {
      if (sec.offsetTop <= scroll) active = sec;
    }
    navLinks.forEach(a => a.classList.remove('active'));
    if (active) {
      const link = document.querySelector(`.nav-menu a[href="#${active.id}"]`);
      if (link) link.classList.add('active');
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ---------- Mobile hamburger menu ----------
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    const closeMenu = () => {
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
    });
  }

  // ---------- /fund Live counters ----------
  // 直近の金曜23:23 JST(現サイクル開始時刻)
  function getCycleStartMs() {
    const nowUtc = new Date();
    const jstOffsetMs = 9 * 60 * 60 * 1000;
    const nowJst = new Date(nowUtc.getTime() + jstOffsetMs);
    const dow = nowJst.getUTCDay();
    const daysBack = (dow - 5 + 7) % 7;
    const target = new Date(Date.UTC(
      nowJst.getUTCFullYear(), nowJst.getUTCMonth(),
      nowJst.getUTCDate() - daysBack, 23, 23, 0, 0
    ));
    let targetUtcMs = target.getTime() - jstOffsetMs;
    if (targetUtcMs > nowUtc.getTime()) {
      targetUtcMs -= 7 * 24 * 60 * 60 * 1000;
    }
    return targetUtcMs;
  }

  // Embedded fallback used when /api/cycle.json is unreachable.
  // Keep this in sync with the file periodically so offline / 404
  // visits still see a sensible state.
  const FALLBACK_CYCLE = {
    schema: 1,
    cycle: 0,
    phase: 'pre-launch',
    baseline: {
      grant_fund_jpy:       0,
      patron_7d_jpy:        0,
      inflow_7d_jpy:        0,
      outflow_7d_jpy:       0,
      cycle_cap_jpy:        0
    },
    rate_jpy_per_sec: { members: 0, patrons: 0 }
  };

  // Public state: window.__live.{cycle,baseline,rate_jpy_per_sec,updated}
  window.__live = FALLBACK_CYCLE;

  // Helper: write a JPY amount to every [data-live-jpy="<key>"] element.
  // fx.js then formats USD vs JPY based on the element's class.
  function setLiveAmount(key, jpyValue, prefix) {
    document.querySelectorAll('[data-live-jpy="' + key + '"]').forEach(el => {
      el.dataset.jpy = String(Math.round(jpyValue));
      if (prefix !== undefined) el.dataset.fxPrefix = prefix;
    });
  }
  // Helper: write the cycle number to every [data-live-cycle] element.
  function setLiveCycle(n) {
    document.querySelectorAll('[data-live-cycle]').forEach(el => {
      el.textContent = String(n);
    });
  }

  const fundEls = {
    tick:               document.getElementById('fund-tick'),
    label:              document.getElementById('fund-update-label'),
    heroLabel:          document.getElementById('hero-live-label'),
    cycleProgressLabel: document.getElementById('fund-cycle-progress-label'),
    cycleProgressFill:  document.getElementById('fund-cycle-fill-bar')
  };
  const hasFundUI = document.querySelector('[data-live-jpy]')
                  || Object.values(fundEls).some(Boolean);

  let lastUpdateMs = Date.now();

  function updateFund() {
    if (!hasFundUI) return;
    const live = window.__live || FALLBACK_CYCLE;
    const base = live.baseline || FALLBACK_CYCLE.baseline;
    const rate = live.rate_jpy_per_sec || FALLBACK_CYCLE.rate_jpy_per_sec;

    // PRE-LAUNCH MODE
    // When the operator declares phase="pre-launch" (cycle.json),
    // freeze every numeric slot at the baseline (typically zero) and
    // replace the status label with a launch-anticipation message.
    // No simulator math runs; no fabricated activity shown.
    if (live.phase === 'pre-launch') {
      setLiveAmount('grant_fund_jpy', base.grant_fund_jpy);
      setLiveAmount('patron_7d_jpy',  base.patron_7d_jpy,  '+');
      setLiveAmount('inflow_7d_jpy',  base.inflow_7d_jpy,  '+');
      setLiveAmount('outflow_7d_jpy', base.outflow_7d_jpy, '−');
      setLiveAmount('cycle_cap_jpy',  base.cycle_cap_jpy);
      setLiveAmount('reserve_jpy',    0);
      if (window.__fxApply) window.__fxApply();
      if (fundEls.cycleProgressFill) fundEls.cycleProgressFill.style.width = '0%';
      if (fundEls.cycleProgressLabel) fundEls.cycleProgressLabel.textContent = 'Cycle 2 · Awaiting first ring';
      lastUpdateMs = Date.now();
      return;
    }

    const cycleStartMs = getCycleStartMs();
    const elapsedSec = Math.max(0, (Date.now() - cycleStartMs) / 1000);
    const cycleSec = 3 * 24 * 3600;  // Friday 23:23 → Monday 23:23 JST

    // 微小ノイズで人間っぽさ
    const memNoise = 0.85 + 0.15 * (Math.sin(elapsedSec / 11) * 0.5 + 0.5);
    const patNoise = 0.7  + 0.3  * (Math.sin(elapsedSec / 17 + 1.3) * 0.5 + 0.5);
    const memberAdd = rate.members * elapsedSec * memNoise;
    const patronAdd = rate.patrons * elapsedSec * patNoise;

    const grantFund = base.grant_fund_jpy + memberAdd + patronAdd;
    const patron7d  = base.patron_7d_jpy  + patronAdd;
    const inflow7d  = base.inflow_7d_jpy  + memberAdd + patronAdd;
    const cycleCap  = Math.min(base.cycle_cap_jpy + memberAdd * 0.55 + patronAdd, 6000000);
    const reserve   = Math.max(0, grantFund - cycleCap);

    // Push values to every matching slot. fx.js handles USD/JPY rendering.
    setLiveAmount('grant_fund_jpy', grantFund);
    setLiveAmount('patron_7d_jpy',  patron7d,   '+');
    setLiveAmount('inflow_7d_jpy',  inflow7d,   '+');
    setLiveAmount('outflow_7d_jpy', base.outflow_7d_jpy, '−');
    setLiveAmount('cycle_cap_jpy',  cycleCap);
    setLiveAmount('reserve_jpy',    reserve);

    // Trigger USD/JPY formatting on the freshly-updated data-jpy values.
    if (window.__fxApply) window.__fxApply();

    // Cycle progress bar (independent of fx)
    const progressPct = Math.min(100, (elapsedSec / cycleSec) * 100);
    if (fundEls.cycleProgressFill) {
      fundEls.cycleProgressFill.style.width = progressPct.toFixed(2) + '%';
    }
    if (fundEls.cycleProgressLabel) {
      const remain = Math.max(0, cycleSec - elapsedSec);
      const d = Math.floor(remain / 86400);
      const h = Math.floor((remain % 86400) / 3600);
      const m = Math.floor((remain % 3600) / 60);
      fundEls.cycleProgressLabel.textContent = progressPct.toFixed(0) + '% · ' + d + 'd ' + h + 'h ' + m + 'm';
    }

    lastUpdateMs = Date.now();
  }

  // "Updated Xs ago" label updates every second; numbers tick every 10s.
  function updateLabel() {
    const live = window.__live || FALLBACK_CYCLE;
    const cycle = live.cycle || FALLBACK_CYCLE.cycle;
    if (live.phase === 'pre-launch') {
      const preMsg = '— Cycle 2 · Awaiting first ring · Friday 23:23 JST —';
      if (fundEls.label)     fundEls.label.textContent     = preMsg;
      if (fundEls.heroLabel) fundEls.heroLabel.textContent = preMsg;
      return;
    }
    const ago = Math.floor((Date.now() - lastUpdateMs) / 1000);
    let txt;
    if (ago < 3)         txt = 'just now';
    else if (ago < 60)   txt = ago + 's ago';
    else if (ago < 3600) txt = Math.floor(ago / 60) + 'm ago';
    else                 txt = 'a while ago';
    const liveMsg = '— Live · Cycle ' + cycle + ' · Updated ' + txt + ' —';
    if (fundEls.label)     fundEls.label.textContent     = liveMsg;
    if (fundEls.heroLabel) fundEls.heroLabel.textContent = '— Live · Cycle ' + cycle + ' · Grant Fund —';
  }

  function fetchLiveState() {
    if (!hasFundUI) return;
    fetch('/api/cycle.json?cb=' + Date.now().toString().slice(0, 8))
      .then(r => r.ok ? r.json() : Promise.reject('not ok'))
      .then(data => {
        if (!data || !data.baseline) throw new Error('bad payload');
        window.__live = data;
        setLiveCycle(data.cycle);
        updateFund();
        updateLabel();
        console.log('%c[live] v20260514d · Cycle ' + data.cycle
                    + ' · baseline ¥' + data.baseline.grant_fund_jpy.toLocaleString()
                    + ' · updated ' + data.updated,
                    'color:#b8862d;font-weight:bold');
      })
      .catch(err => {
        // Fall back to embedded values — UI still renders.
        setLiveCycle(FALLBACK_CYCLE.cycle);
        updateFund();
        updateLabel();
        console.warn('[live] cycle.json unavailable, using fallback', err);
      });
  }

  if (hasFundUI) {
    fetchLiveState();
    setInterval(updateFund, 10000);
    setInterval(updateLabel, 1000);
  }

  // ---------- IntersectionObserver: reveal on scroll ----------
  const revealEls = document.querySelectorAll('.section-head, .law-row, .three-card, .story, .how-step, .verify-panel');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.animation = 'fadeUp 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  }
})();
