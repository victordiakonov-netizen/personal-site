(function () {
  'use strict';

  var STORAGE_KEY = 'site-font-scale';
  var BASE_PX = 16;
  var MIN_PCT = 85;
  var MAX_PCT = 140;
  var STEP_PCT = 5;
  var DEFAULT_PCT = 100;

  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

  function readSavedPct() {
    var raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    var pct = parseInt(raw, 10);
    if (!raw || isNaN(pct)) return DEFAULT_PCT;
    return clamp(pct, MIN_PCT, MAX_PCT);
  }

  function applyPct(pct) {
    document.documentElement.style.fontSize = (BASE_PX * pct / 100).toFixed(2) + 'px';
  }

  var currentPct = readSavedPct();
  applyPct(currentPct);

  function buildWidget() {
    if (document.getElementById('font-size-widget')) return;

    var wrap = document.createElement('div');
    wrap.id = 'font-size-widget';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Размер текста');

    var iconSm = document.createElement('span');
    iconSm.className = 'font-size-icon font-size-icon--sm';
    iconSm.textContent = 'A';
    iconSm.setAttribute('aria-hidden', 'true');

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.id = 'font-size-slider';
    slider.min = String(MIN_PCT);
    slider.max = String(MAX_PCT);
    slider.step = String(STEP_PCT);
    slider.value = String(currentPct);
    slider.setAttribute('aria-label', 'Размер текста на странице');
    slider.setAttribute('aria-valuemin', String(MIN_PCT));
    slider.setAttribute('aria-valuemax', String(MAX_PCT));
    slider.setAttribute('aria-valuenow', String(currentPct));
    slider.setAttribute('aria-valuetext', currentPct + '%');

    var iconLg = document.createElement('span');
    iconLg.className = 'font-size-icon font-size-icon--lg';
    iconLg.textContent = 'A';
    iconLg.setAttribute('aria-hidden', 'true');

    wrap.appendChild(iconSm);
    wrap.appendChild(slider);
    wrap.appendChild(iconLg);

    slider.addEventListener('input', function () {
      var pct = clamp(parseInt(slider.value, 10) || DEFAULT_PCT, MIN_PCT, MAX_PCT);
      applyPct(pct);
      slider.setAttribute('aria-valuenow', String(pct));
      slider.setAttribute('aria-valuetext', pct + '%');
      try { localStorage.setItem(STORAGE_KEY, String(pct)); } catch (e) {}
    });

    var navLinks = document.getElementById('nav-links');
    if (navLinks && navLinks.parentNode) {
      navLinks.insertAdjacentElement('afterend', wrap);
    } else {
      document.body.appendChild(wrap);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
}());
