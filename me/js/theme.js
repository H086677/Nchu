/* ============================================================
   详情页的极简脚本：主题切换 + 年份 + 入场动画
   （详情页不需要播放器，所以不引 main.js）
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var themeBtn = document.getElementById('themeBtn');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(dark, remember) {
    if (dark) root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式');
      themeBtn.title = dark ? '切换浅色模式' : '切换深色模式';
    }
    if (themeMeta) themeMeta.setAttribute('content', dark ? '#131316' : '#f4f4f2');
    if (remember) {
      try { localStorage.setItem('hrf-theme', dark ? 'dark' : 'light'); } catch (e) {}
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'dark', false);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') !== 'dark', true);
    });
  }

  var prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  if (prefersDark && prefersDark.addEventListener) {
    prefersDark.addEventListener('change', function (e) {
      var saved = null;
      try { saved = localStorage.getItem('hrf-theme'); } catch (err) {}
      if (!saved) applyTheme(e.matches, false);
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var topbar = document.getElementById('topbar');
  function onScroll() {
    if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 详情页内容由 games.js 注入，等它跑完再挂入场动画 */
  function observeReveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        obs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    els.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 40, 220) + 'ms';
      obs.observe(el);
    });
  }
  observeReveals();
})();
