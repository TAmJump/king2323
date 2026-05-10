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
