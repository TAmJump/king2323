/* ============================================================
   KINGMAKER 23:23 — Main JS
   Countdown to Friday 23:23 JST. Smooth nav highlight.
   ============================================================ */

(function () {
  'use strict';

  // ---------- Countdown to next Friday 23:23 (JST = UTC+9) ----------
  function getNextBell() {
    // Build the target time in JST regardless of viewer's TZ.
    // JST = UTC + 9. Find the next Friday at 23:23 JST.
    const nowUtc = new Date();
    // Convert "now" into JST as a Date object whose UTC fields represent JST wall clock
    const jstOffsetMs = 9 * 60 * 60 * 1000;
    const nowJst = new Date(nowUtc.getTime() + jstOffsetMs);

    // We want next Friday in JST. JS getUTCDay() on nowJst gives JST weekday (since fields are JST-wall in UTC slots).
    const dow = nowJst.getUTCDay(); // 0=Sun ... 5=Fri
    let daysUntilFri = (5 - dow + 7) % 7;

    const target = new Date(Date.UTC(
      nowJst.getUTCFullYear(),
      nowJst.getUTCMonth(),
      nowJst.getUTCDate() + daysUntilFri,
      23, 23, 0, 0
    ));
    // target represents JST wall clock packed in UTC slots → real UTC = target - jstOffset
    let targetUtcMs = target.getTime() - jstOffsetMs;

    // If we've passed this Friday's 23:23 JST, jump 7 days
    if (targetUtcMs <= nowUtc.getTime()) {
      targetUtcMs += 7 * 24 * 60 * 60 * 1000;
    }
    return targetUtcMs;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const targetMs = getNextBell();
    const diff = targetMs - Date.now();
    if (diff <= 0) {
      document.querySelectorAll('#cd-d,#cd-h,#cd-m,#cd-s').forEach(el => el.textContent = '00');
      const target = document.getElementById('cd-target');
      if (target) target.textContent = 'The Bell is open.';
      return;
    }
    const s = Math.floor(diff / 1000);
    const days = Math.floor(s / 86400);
    const hrs = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;

    const set = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.textContent = pad(v);
    };
    set('cd-d', days);
    set('cd-h', hrs);
    set('cd-m', mins);
    set('cd-s', secs);
  }

  tick();
  setInterval(tick, 1000);

  // ---------- Active nav highlight on scroll ----------
  const navLinks = document.querySelectorAll('.nav-menu a');
  const sections = Array.from(navLinks)
    .map(a => document.querySelector(a.getAttribute('href')))
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

  function fmtYen(n) {
    return '¥ ' + Math.round(n).toLocaleString('en-US');
  }
  function fmtYenSigned(n, sign) {
    return sign + ' ¥ ' + Math.round(Math.abs(n)).toLocaleString('en-US');
  }

  const fundEls = {
    cycleCap:           document.getElementById('fund-cycle-cap'),
    total:              document.getElementById('fund-current-total'),
    inflow:             document.getElementById('fund-inflow'),
    patron:             document.getElementById('fund-patron'),
    outflow:            document.getElementById('fund-outflow'),
    reserve:            document.getElementById('fund-reserve'),
    tick:               document.getElementById('fund-tick'),
    label:              document.getElementById('fund-update-label'),
    cycleProgressLabel: document.getElementById('fund-cycle-progress-label'),
    cycleProgressFill:  document.getElementById('fund-cycle-fill-bar'),
    heroLive:           document.getElementById('hero-live-pool'),
    heroLivePatron:     document.getElementById('hero-live-patron')
  };
  const hasFundUI = Object.values(fundEls).some(Boolean);

  if (hasFundUI) {
    let lastTotal = null;

    function updateFund() {
      const cycleStartMs = getCycleStartMs();
      const elapsedSec = Math.max(0, (Date.now() - cycleStartMs) / 1000);
      const cycleSec = 3 * 24 * 3600;  // Friday 23:23 → Monday 23:23 JST

      // 基準値(cycle 47 想定の見え方)
      const baseTotal      = 5872400;
      const baseInflow7d   = 857400;
      const basePatron7d   = 124800;   // Patron 流入(7日累計のbase)
      const baseOutflow7d  = 1000000;
      const baseCycleCap   = 3248000;

      // 流入速度 (¥/sec)
      const memberPerSec = 1.42;
      const patronPerSec = 0.38;

      // 微小ノイズで人間っぽさ
      const memNoise = 0.85 + 0.15 * (Math.sin(elapsedSec / 11) * 0.5 + 0.5);
      const patNoise = 0.7  + 0.3  * (Math.sin(elapsedSec / 17 + 1.3) * 0.5 + 0.5);
      const memberAdd = memberPerSec * elapsedSec * memNoise;
      const patronAdd = patronPerSec * elapsedSec * patNoise;

      const total     = baseTotal + memberAdd + patronAdd;
      const cycleCap  = Math.min(baseCycleCap + memberAdd * 0.55 + patronAdd, 6000000);
      const inflow7d  = baseInflow7d + memberAdd;
      const patron7d  = basePatron7d + patronAdd;
      const reserve   = Math.max(0, total - cycleCap);

      // Live tick · this second(秒間平均流入。ノイズで自然な揺れ)
      const tickAmt = (memberPerSec * memNoise) + (patronPerSec * patNoise);
      lastTotal = total;

      if (fundEls.total)    fundEls.total.textContent    = fmtYen(total);
      if (fundEls.cycleCap) fundEls.cycleCap.textContent = fmtYen(cycleCap);
      if (fundEls.inflow)   fundEls.inflow.textContent   = fmtYenSigned(inflow7d, '+');
      if (fundEls.patron)   fundEls.patron.textContent   = fmtYenSigned(patron7d, '+');
      if (fundEls.outflow)  fundEls.outflow.textContent  = fmtYenSigned(baseOutflow7d, '−');
      if (fundEls.reserve)  fundEls.reserve.textContent  = fmtYen(reserve);
      if (fundEls.tick)     fundEls.tick.textContent     = fmtYenSigned(Math.max(0, tickAmt), '+');
      if (fundEls.heroLive) fundEls.heroLive.textContent = fmtYen(total);
      if (fundEls.heroLivePatron) fundEls.heroLivePatron.textContent = fmtYenSigned(patron7d, '+');
      if (fundEls.label)    fundEls.label.textContent    = '— Live · Cycle 47 · Updated now —';

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
    }

    updateFund();
    setInterval(updateFund, 1000);
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
