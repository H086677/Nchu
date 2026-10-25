/* ============================================================
   黄锐锋 · 个人主页  —  main.js
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- 曲库 ---------------- */
  /* 歌单在 js/tracks.js（window.HRF_TRACKS）里，改歌就改那个文件。 */
  var TRACKS = (window.HRF_TRACKS || []).slice();

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  var CFG = window.HRF_CONFIG || {};

  /* ---------------- 元素 ---------------- */
  var audio      = $('#audio');
  var playerGrid = $('.player-grid');
  var btnPlay    = $('#btnPlay');
  var btnLoop    = $('#btnLoop');
  var btnMute    = $('#btnMute');
  var volume     = $('#volume');
  var progress   = $('#progress');
  var progressFill = $('#progressFill');
  var progressBuf  = $('#progressBuf');
  var timeNow    = $('#timeNow');
  var timeAll    = $('#timeAll');
  var lyricList  = $('#lyricList');
  var playerHint = $('#playerHint');
  var heroPlay   = $('#heroPlay');
  var trackTitle = $('#trackTitle');
  var trackMeta  = $('#trackMeta');
  var coverImg   = $('#coverImg');
  var tracklistEl = $('#tracklist');
  var trackRows  = [];
  var toastEl    = $('#toast');

  var current = 0;
  var started = false;   /* 用户是否已经和播放器交互过 */

  /* ---------------- 歌词渲染 ---------------- */
  var lyricEls = [];
  var currentLine = -1;

  function renderLyrics() {
    if (!lyricList) return;
    lyricList.innerHTML = '';
    lyricEls = [];
    currentLine = -1;
    TRACKS[current].lyrics.forEach(function (row) {
      var li = document.createElement('li');
      li.textContent = row[1];
      lyricList.appendChild(li);
      lyricEls.push(li);
    });
    lyricList.style.transform = 'translateY(0px)';
  }

  function syncLyrics(t) {
    if (!lyricEls.length) return;
    var rows = TRACKS[current].lyrics;
    var idx = -1;
    for (var i = 0; i < rows.length; i++) {
      if (t + 0.25 >= rows[i][0]) idx = i; else break;
    }
    if (idx === currentLine) return;

    if (currentLine >= 0 && lyricEls[currentLine]) {
      lyricEls[currentLine].classList.remove('active');
    }
    currentLine = idx;

    var box = lyricList.parentNode;
    var boxH = box ? box.clientHeight : 200;

    if (idx >= 0 && lyricEls[idx]) {
      lyricEls[idx].classList.add('active');
      var lineH = lyricEls[idx].offsetHeight || 30;
      var y = (boxH / 2) - (idx * lineH) - (lineH / 2);
      lyricList.style.transform = 'translateY(' + Math.round(y) + 'px)';
    } else {
      lyricList.style.transform = 'translateY(0px)';
    }
  }

  /* ---------------- 曲目切换 ---------------- */
  function paintTrack() {
    var t = TRACKS[current];
    if (trackTitle) trackTitle.textContent = t.title;
    if (trackMeta)  trackMeta.textContent = t.artist + ' · ' + t.album;
    if (coverImg) {
      coverImg.src = t.cover;
      coverImg.alt = t.title + ' 专辑封面';
    }
    trackRows.forEach(function (row, i) {
      row.classList.toggle('is-active', i === current);
    });
    renderLyrics();
    if (timeNow) timeNow.textContent = '00:00';
    if (timeAll) timeAll.textContent = '00:00';
    if (progressFill) progressFill.style.width = '0%';
    if (progressBuf)  progressBuf.style.width = '0%';
    paintMini();
  }

  function loadTrack(i, autoplay) {
    if (i < 0 || i >= TRACKS.length) return;
    var wasPlaying = autoplay || !audio.paused;
    current = i;
    paintTrack();
    audio.src = TRACKS[i].src;
    audio.load();
    if (wasPlaying) {
      started = true;
      var p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function () { paintPlayState(false); });
      }
    }
  }

  var trackFilter = $('#trackFilter');
  var trackEmpty  = $('#trackEmpty');
  var filterText  = '';

  function matchTrack(t) {
    if (!filterText) return true;
    var hay = (t.title + ' ' + t.artist + ' ' + t.album).toLowerCase();
    return hay.indexOf(filterText) >= 0;
  }

  function renderTracklist() {
    if (!tracklistEl) return;
    tracklistEl.innerHTML = '';
    trackRows = [];
    var shown = 0;
    TRACKS.forEach(function (t, i) {
      if (!matchTrack(t)) return;
      shown++;
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.className = 'track-row' + (i === current ? ' is-active' : '');
      b.type = 'button';
      b.setAttribute('data-track', String(i));
      b.setAttribute('aria-label', '播放 ' + t.title);
      b.innerHTML =
        '<span class="track-num">' + (i < 9 ? '0' : '') + (i + 1) + '</span>' +
        '<span class="track-main">' +
          '<span class="track-name">' + esc(t.title) + '</span>' +
          '<span class="track-sub">' + esc(t.artist + ' · ' + t.album) + '</span>' +
        '</span>' +
        '<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>';
      b.addEventListener('click', function () {
        if (i === current) { toggle(); return; }
        loadTrack(i, true);
      });
      li.appendChild(b);
      tracklistEl.appendChild(li);
      trackRows.push(b);
    });
    if (trackEmpty) trackEmpty.hidden = shown > 0;
    var countEl = $('#trackCount');
    if (countEl) {
      countEl.textContent = filterText
        ? shown + ' / ' + TRACKS.length + ' 首'
        : TRACKS.length + ' 首';
    }
  }

  if (trackFilter) {
    trackFilter.addEventListener('input', function () {
      filterText = trackFilter.value.trim().toLowerCase();
      renderTracklist();
    });
  }

  /* ---------------- 播放状态 UI ---------------- */
  var isPlaying = false;

  function paintPlayState(playing) {
    isPlaying = playing;
    if (playerGrid) playerGrid.classList.toggle('is-playing', playing);
    if (btnPlay) btnPlay.setAttribute('aria-label', playing ? '暂停' : '播放');
    if (heroPlay) {
      heroPlay.classList.toggle('is-playing', playing);
      var label = heroPlay.querySelector('span');
      if (label) label.textContent = playing ? '暂停音乐' : '播放音乐';
    }
    if (playerHint) {
      var t = TRACKS[current];
      playerHint.textContent = playing
        ? '正在播放 · ' + t.artist + '《' + t.title + '》'
        : '已暂停，点击继续';
    }
    paintMini();
  }

  /* ---------------- 播放控制 ---------------- */
  function play() {
    var p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () {
        if (playerHint) playerHint.textContent = '播放被浏览器拦截了，请再点一次播放键';
        paintPlayState(false);
      });
    }
  }

  function toggle() {
    started = true;
    if (audio.paused) play(); else audio.pause();
  }

  if (btnPlay)  btnPlay.addEventListener('click', toggle);
  if (heroPlay) heroPlay.addEventListener('click', toggle);

  audio.addEventListener('play',  function () { paintPlayState(true);  });
  audio.addEventListener('pause', function () { paintPlayState(false); });

  /* 播放结束：单曲循环 or 下一首 */
  audio.addEventListener('ended', function () {
    if (looping) { audio.currentTime = 0; play(); return; }
    if (current < TRACKS.length - 1) loadTrack(current + 1, true);
    else paintPlayState(false);
  });

  /* ---------------- 进度 ---------------- */
  function setProgressFromAudio() {
    var d = audio.duration || 0;
    var c = audio.currentTime || 0;
    var pct = d > 0 ? (c / d) * 100 : 0;
    if (progressFill) progressFill.style.width = pct.toFixed(3) + '%';
    if (timeNow) timeNow.textContent = fmt(c);
    if (progress) progress.setAttribute('aria-valuenow', Math.round(pct));
    if (d > 0 && timeAll) timeAll.textContent = fmt(d);

    if (audio.buffered && audio.buffered.length && progressBuf && d > 0) {
      var end = audio.buffered.end(audio.buffered.length - 1);
      progressBuf.style.width = Math.min(100, (end / d) * 100).toFixed(2) + '%';
    }
    if (miniBarFill) miniBarFill.style.width = pct.toFixed(2) + '%';
    syncLyrics(c);
  }

  audio.addEventListener('timeupdate', setProgressFromAudio);
  audio.addEventListener('loadedmetadata', setProgressFromAudio);
  audio.addEventListener('progress', setProgressFromAudio);
  audio.addEventListener('durationchange', setProgressFromAudio);

  /* 拖动 / 点击进度条 */
  var seeking = false;
  function seekAt(clientX) {
    var r = progress.getBoundingClientRect();
    var ratio = (clientX - r.left) / r.width;
    ratio = Math.max(0, Math.min(1, ratio));
    if (audio.duration) audio.currentTime = ratio * audio.duration;
    setProgressFromAudio();
  }
  if (progress) {
    progress.addEventListener('pointerdown', function (e) {
      seeking = true;
      if (progress.setPointerCapture) progress.setPointerCapture(e.pointerId);
      seekAt(e.clientX);
    });
    progress.addEventListener('pointermove', function (e) { if (seeking) seekAt(e.clientX); });
    progress.addEventListener('pointerup',   function () { seeking = false; });
    progress.addEventListener('pointercancel', function () { seeking = false; });
    progress.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { audio.currentTime = Math.max(0, audio.currentTime - 5); e.preventDefault(); }
      if (e.key === ' ' || e.key === 'Enter') { toggle(); e.preventDefault(); }
    });
  }

  /* ---------------- 单曲循环 ---------------- */
  var looping = true;
  function paintLoop() {
    if (!btnLoop) return;
    btnLoop.setAttribute('aria-pressed', looping ? 'true' : 'false');
    btnLoop.title = looping ? '单曲循环：开' : '单曲循环：关（放完切下一首）';
    audio.loop = looping;
  }
  if (btnLoop) {
    btnLoop.addEventListener('click', function () {
      looping = !looping;
      paintLoop();
      toast(looping ? '已开启单曲循环' : '已关闭单曲循环 · 放完切下一首');
    });
  }
  paintLoop();

  /* ---------------- 音量 / 静音 ---------------- */
  audio.volume = 0.8;
  var lastVolume = 0.8;

  if (volume) {
    volume.addEventListener('input', function () {
      var v = Number(volume.value) / 100;
      audio.volume = v;
      audio.muted = v === 0;
      if (v > 0) lastVolume = v;
      paintMute();
    });
  }

  function paintMute() {
    if (!btnMute) return;
    var m = audio.muted || audio.volume === 0;
    btnMute.setAttribute('aria-pressed', m ? 'true' : 'false');
    btnMute.title = m ? '取消静音' : '静音';
    btnMute.setAttribute('aria-label', m ? '取消静音' : '静音');
    var wave = btnMute.querySelector('.wave');
    if (wave) wave.style.opacity = m ? '.25' : '1';
  }

  if (btnMute) {
    btnMute.addEventListener('click', function () {
      if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = lastVolume || 0.8;
        if (volume) volume.value = String(Math.round(audio.volume * 100));
      } else {
        lastVolume = audio.volume;
        audio.muted = true;
      }
      paintMute();
    });
  }
  paintMute();

  /* ---------------- 深色模式 ---------------- */
  var themeBtn = $('#themeBtn');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var root = document.documentElement;

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
    paintVizColors();
  }

  var prefersDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  applyTheme(root.getAttribute('data-theme') === 'dark', false);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') !== 'dark', true);
    });
  }
  if (prefersDark && prefersDark.addEventListener) {
    prefersDark.addEventListener('change', function (e) {
      var saved = null;
      try { saved = localStorage.getItem('hrf-theme'); } catch (err) {}
      if (!saved) applyTheme(e.matches, false);
    });
  }

  /* ---------------- 音频可视化 ---------------- */
  var viz = $('#viz');
  var vizCtx = viz ? viz.getContext('2d') : null;
  var audioCtx = null, analyser = null, freqData = null, sourceNode = null;
  var vizRaf = 0;
  var vizBars = [];
  var BAR_COUNT = 40;

  for (var bi = 0; bi < BAR_COUNT; bi++) vizBars.push(0);

  function vizPalette() {
    var dark = root.getAttribute('data-theme') === 'dark';
    return dark
      ? { bar: 'rgba(120,170,255,.85)', bar2: 'rgba(90,140,240,.35)' }
      : { bar: 'rgba(31,111,235,.82)', bar2: 'rgba(31,111,235,.28)' };
  }

  function paintVizColors() { /* 颜色在每帧读取，这里只为接口一致 */ }

  function initAudioGraph() {
    if (audioCtx || !audio) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      audioCtx = new AC();
      sourceNode = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.82;
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
      freqData = new Uint8Array(analyser.frequencyBinCount);
    } catch (e) {
      audioCtx = null; analyser = null;
    }
  }

  function resizeViz() {
    if (!viz) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = viz.clientWidth || 320;
    var h = viz.clientHeight || 56;
    if (viz.width !== Math.round(w * dpr) || viz.height !== Math.round(h * dpr)) {
      viz.width = Math.round(w * dpr);
      viz.height = Math.round(h * dpr);
    }
    if (vizCtx) vizCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawViz() {
    if (!vizCtx || !viz) return;
    vizRaf = requestAnimationFrame(drawViz);

    var w = viz.clientWidth || 320;
    var h = viz.clientHeight || 56;
    var pal = vizPalette();

    vizCtx.clearRect(0, 0, w, h);

    var live = analyser && isPlaying;
    if (live) {
      analyser.getByteFrequencyData(freqData);
    }

    var gap = 3;
    var bw = (w - gap * (BAR_COUNT - 1)) / BAR_COUNT;
    if (bw < 1) bw = 1;

    for (var i = 0; i < BAR_COUNT; i++) {
      var target;
      if (live) {
        var idx = Math.floor(i * (freqData.length * 0.62) / BAR_COUNT);
        target = (freqData[idx] / 255) * h;
      } else {
        target = 1.2;
      }
      /* 上升快、回落慢，看起来更"活" */
      vizBars[i] += (target - vizBars[i]) * (target > vizBars[i] ? 0.55 : 0.14);
      var bh = Math.max(1.2, vizBars[i]);
      var x = i * (bw + gap);
      var y = h - bh;
      vizCtx.fillStyle = pal.bar;
      vizCtx.globalAlpha = 0.35 + 0.65 * Math.min(1, bh / (h * 0.8));
      roundRect(vizCtx, x, y, bw, bh, Math.min(bw / 2, 2));
      vizCtx.fill();
    }
    vizCtx.globalAlpha = 1;
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) { c.roundRect(x, y, w, h, r); return; }
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  if (viz) {
    resizeViz();
    window.addEventListener('resize', resizeViz);
    drawViz();
  }

  /* 首次播放（用户手势内）才能建图 */
  audio.addEventListener('play', function () {
    initAudioGraph();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }, { passive: true });

  /* ---------------- 迷你播放器 ---------------- */
  var mini      = $('#mini');
  var miniCover = $('#miniCover');
  var miniTitle = $('#miniTitle');
  var miniSub   = $('#miniSub');
  var miniPlay  = $('#miniPlay');
  var miniBarFill = $('#miniBarFill');
  var musicSection = $('#music');
  var musicVisible = true;

  function paintMini() {
    if (!mini) return;
    var t = TRACKS[current];
    if (miniCover) miniCover.src = t.cover;
    if (miniTitle) miniTitle.textContent = t.title;
    if (miniSub)   miniSub.textContent = t.artist;
    if (miniPlay) {
      miniPlay.setAttribute('aria-label', isPlaying ? '暂停' : '播放');
      miniPlay.classList.toggle('is-playing', isPlaying);
    }
    var show = started && !musicVisible;
    mini.classList.toggle('show', show);
    mini.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  if (miniPlay) {
    miniPlay.addEventListener('click', function () { started = true; toggle(); });
  }

  if (musicSection && 'IntersectionObserver' in window) {
    var musicObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        musicVisible = en.isIntersecting;
        paintMini();
      });
    }, { threshold: 0.08 });
    musicObs.observe(musicSection);
  } else {
    musicVisible = true;
  }

  /* ---------------- 导航 ---------------- */
  var topbar = $('#topbar');
  function onScroll() {
    if (topbar) topbar.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var navLinks = $$('.nav a');
  var sections = navLinks.map(function (a) {
    var id = a.getAttribute('href');
    return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
  });
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = sections.indexOf(en.target);
        if (i < 0) return;
        navLinks.forEach(function (a, j) { a.classList.toggle('active', i === j); });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(function (s) { if (s) secObs.observe(s); });
  }

  /* ---------------- 滚动入场动画 ---------------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        revObs.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 40, 220) + 'ms';
      revObs.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- Toast ---------------- */
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1900);
  }

  /* ---------------- 复制联系方式 ---------------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error('copy failed'));
      } catch (err) { reject(err); }
    });
  }

  $$('.contact-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var value = card.getAttribute('data-copy');
      var kind  = card.getAttribute('data-kind') || '';
      copyText(value).then(function () {
        toast(kind + '已复制：' + value);
      }).catch(function () {
        toast(kind + '：' + value);
      });
    });
  });

  /* ---------------- 留言板 ---------------- */
  var GUEST_KEY = CFG.guestbookKey || 'hrf-guestbook';
  var guestBody  = $('#guestBody');
  var guestMount = $('#guestMount');
  var guestForm  = $('#guestForm');
  var guestName  = $('#guestName');
  var guestText  = $('#guestText');
  var guestList  = $('#guestList');
  var guestEmpty = $('#guestEmpty');
  var guestNote  = $('#guestNote');
  var giscus = CFG.giscus || {};

  function guestLoad() {
    try {
      var raw = localStorage.getItem(GUEST_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function guestSave(arr) {
    try { localStorage.setItem(GUEST_KEY, JSON.stringify(arr)); return true; }
    catch (e) { return false; }
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function relTime(ts) {
    var d = (Date.now() - ts) / 1000;
    if (d < 60) return '刚刚';
    if (d < 3600) return Math.floor(d / 60) + ' 分钟前';
    if (d < 86400) return Math.floor(d / 3600) + ' 小时前';
    if (d < 86400 * 30) return Math.floor(d / 86400) + ' 天前';
    var dt = new Date(ts);
    return dt.getFullYear() + '.' + (dt.getMonth() + 1) + '.' + dt.getDate();
  }

  function guestRender() {
    if (!guestList) return;
    var arr = guestLoad();
    guestList.innerHTML = '';
    arr.slice().reverse().forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'guest-item';
      var initial = (item.name || '匿').slice(0, 1);
      li.innerHTML =
        '<span class="guest-avatar" aria-hidden="true">' + esc(initial) + '</span>' +
        '<div class="guest-item-main">' +
          '<div class="guest-item-head">' +
            '<span class="guest-item-name">' + esc(item.name || '匿名') + '</span>' +
            '<span class="guest-item-time">' + esc(relTime(item.ts)) + '</span>' +
          '</div>' +
          '<p class="guest-item-text">' + esc(item.text) + '</p>' +
        '</div>';
      guestList.appendChild(li);
    });
    if (guestEmpty) guestEmpty.hidden = arr.length > 0;
  }

  function mountGiscus() {
    if (!guestMount) return;
    var ok = giscus.repo && giscus.repoId && giscus.category && giscus.categoryId;
    if (!ok) return false;

    if (guestBody) guestBody.hidden = true;
    guestMount.hidden = false;

    var s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.setAttribute('data-repo', giscus.repo);
    s.setAttribute('data-repo-id', giscus.repoId);
    s.setAttribute('data-category', giscus.category);
    s.setAttribute('data-category-id', giscus.categoryId);
    s.setAttribute('data-mapping', 'pathname');
    s.setAttribute('data-strict', '0');
    s.setAttribute('data-reactions-enabled', '1');
    s.setAttribute('data-emit-metadata', '0');
    s.setAttribute('data-input-position', 'top');
    s.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    s.setAttribute('data-lang', 'zh-CN');
    s.setAttribute('crossorigin', 'anonymous');
    s.async = true;
    guestMount.appendChild(s);
    return true;
  }

  if (guestForm) {
    var savedName = '';
    try { savedName = localStorage.getItem('hrf-guest-name') || ''; } catch (e) {}
    if (savedName && guestName) guestName.value = savedName;

    guestForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (guestName ? guestName.value : '').trim() || '匿名';
      var text = (guestText ? guestText.value : '').trim();
      if (!text) {
        toast('写点什么再发吧');
        if (guestText) guestText.focus();
        return;
      }
      var arr = guestLoad();
      arr.push({ name: name.slice(0, 16), text: text.slice(0, 200), ts: Date.now() });
      if (guestSave(arr)) {
        try { localStorage.setItem('hrf-guest-name', name.slice(0, 16)); } catch (err) {}
        if (guestText) guestText.value = '';
        guestRender();
        toast('留言已保存到本机');
      } else {
        toast('存储空间满了，存不下这条留言');
      }
    });
  }

  var giscusMounted = mountGiscus();
  if (!giscusMounted) {
    guestRender();
    if (guestNote) {
      guestNote.textContent = '本地留言 · 只保存在这台设备';
      guestNote.title = '在 js/config.js 里填好 giscus 配置后，留言会变成所有人可见';
    }
  }

  /* ---------------- 年份 ---------------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- 键盘：空格控制播放 ---------------- */
  document.addEventListener('keydown', function (e) {
    if (e.code !== 'Space') return;
    var t = e.target;
    var tag = (t && t.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'A' || tag === 'SELECT') return;
    e.preventDefault();
    toggle();
  });

  /* ---------------- 初始化 ---------------- */
  renderTracklist();
  paintTrack();
  paintPlayState(false);
  syncLyrics(0);

  /* ---------------- 对外接口（给 game.js 用） ---------------- */
  window.HRF = {
    TRACKS: TRACKS,
    audio: audio,
    fmt: fmt,
    toast: toast,
    play: play,
    pause: function () { audio.pause(); },
    toggle: toggle,
    loadTrack: loadTrack,
    getCurrent: function () { return current; },
    isPlaying: function () { return isPlaying; },
    theme: function () { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  };
})();
