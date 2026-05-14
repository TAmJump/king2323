/* ============================================================
   KINGMAKER 23:23 — FX display layer
   Version: v20260514d
   ============================================================
   Display contract:
     - Internal accounting is ALWAYS in JPY (¥). All authored
       amounts in markup are JPY. JPY is the source of truth.
     - Display shows USD as primary, JPY as secondary.
     - USD is computed at render time using the rate from
       /js/fx.json (refreshed daily by GitHub Actions cron).
     - All price elements are .notranslate so the i18n layer
       leaves them alone.
     - On fetch failure, falls back to the embedded rate below.
   ============================================================ */
(function () {
  'use strict';

  // Fallback rate (manually refreshed when the GH Action is paused
  // or fx.json is missing). Keep within ±2% of the last live rate.
  const FALLBACK = { USD_JPY: 157.60, updated: 'fallback', source: 'embedded' };

  function fmtUsd(usd) {
    // 0       : show "$0"
    // < 1     : show 2 decimals ($0.63)
    // < 100   : show 2 decimals ($43.50)
    // ≥ 100   : show no decimals ($37,261)
    if (usd === 0) return '$0';
    const opts = (usd < 100)
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : { maximumFractionDigits: 0 };
    return '$' + usd.toLocaleString('en-US', opts);
  }

  function fmtJpy(jpy) {
    return '¥' + Math.round(jpy).toLocaleString('en-US');
  }

  // Apply rate to every [data-jpy] element in the DOM.
  //   <span class="price-usd" data-jpy="100">$0.63</span>
  //     → textContent becomes "$0.63"
  //   <span class="price-jpy" data-jpy="100">¥100</span>
  //     → textContent becomes "¥100" (idempotent)
  // The data-jpy value is JPY (the source of truth).
  // data-fx-prefix lets a caller keep a leading sign like "+".
  function applyRate(rate) {
    document.querySelectorAll('[data-jpy]').forEach(el => {
      const jpy = parseFloat(el.dataset.jpy);
      if (!Number.isFinite(jpy)) return;
      const prefix = el.dataset.fxPrefix || '';
      const wantUsd = el.classList.contains('price-usd')
                   || el.classList.contains('fx-usd')
                   || el.dataset.fxOut === 'usd';
      if (wantUsd) {
        el.textContent = prefix + fmtUsd(jpy / rate);
      } else {
        // Default: format as JPY (idempotent — keeps the ¥X,XXX label clean)
        el.textContent = prefix + fmtJpy(jpy);
      }
    });
    // Stamp the rate on every [data-fx-stamp] element for footnote display.
    const updated = (window.__fx && window.__fx.updated) || 'fallback';
    document.querySelectorAll('[data-fx-stamp]').forEach(el => {
      el.textContent = `1 USD ≈ ¥${rate.toFixed(2)} · Updated ${updated}`;
    });
  }

  function init() {
    fetch('/js/fx.json?cb=' + Date.now().toString().slice(0, 8))
      .then(r => r.ok ? r.json() : Promise.reject('not ok'))
      .then(data => {
        if (!data || typeof data.USD_JPY !== 'number') throw new Error('bad payload');
        window.__fx = data;
        applyRate(data.USD_JPY);
        console.log('%c[fx] v20260514d · 1 USD = ¥' + data.USD_JPY.toFixed(2)
                    + ' · updated ' + data.updated,
                    'color:#b8862d;font-weight:bold');
      })
      .catch(err => {
        window.__fx = FALLBACK;
        applyRate(FALLBACK.USD_JPY);
        console.warn('[fx] fx.json unavailable, using fallback ¥' + FALLBACK.USD_JPY, err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for ritual modals: when a modal opens with fresh
  // [data-jpy] elements, re-apply the rate.
  window.__fxApply = function () {
    const rate = (window.__fx && window.__fx.USD_JPY) || FALLBACK.USD_JPY;
    applyRate(rate);
  };
})();
