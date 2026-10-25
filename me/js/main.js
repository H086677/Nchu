/* ============================================================
   黄锐锋 · 个人主页  —  main.js
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- 歌词（周杰伦《彩虹》，LRC 时间轴） ---------------- */
  var LYRICS = [
    [13.48, '哪里有彩虹告诉我'],
    [19.07, '能不能把我的愿望还给我'],
    [26.36, '为什么天这么安静'],
    [32.04, '所有的云都跑到我这里'],
    [38.96, '有没有口罩一个给我'],
    [44.90, '释怀说了太多就成真不了'],
    [51.89, '也许时间是一种解药'],
    [57.56, '也是我现在正服下的毒药'],
    [64.05, '看不见你的笑 我怎么睡得着'],
    [70.55, '你的声音这么近我却抱不到'],
    [77.03, '没有地球太阳还是会绕'],
    [83.53, '没有理由我也能自己走'],
    [90.04, '你要离开 我知道很简单'],
    [96.50, '你说依赖 是我们的阻碍'],
    [102.99, '就算放开 但能不能别没收我的爱'],
    [110.25, '当作我最后才明白'],
    [116.73, '有没有口罩一个给我'],
    [122.80, '释怀说了太多就成真不了'],
    [129.71, '也许时间是一种解药'],
    [135.40, '也是我现在正服下的毒药'],
    [141.88, '看不见你的笑 我怎么睡得着'],
    [148.38, '你的声音这么近我却抱不到'],
    [154.95, '没有地球太阳还是会绕'],
    [161.34, '没有理由我也能自己走'],
    [167.79, '你要离开 我知道很简单'],
    [174.33, '你说依赖 是我们的阻碍'],
    [180.80, '就算放开 但能不能别没收我的爱'],
    [188.07, '当作我最后才明白'],
    [194.59, '看不见你的笑 要我怎么睡得着'],
    [198.26, '你的声音这么近我却抱不到'],
    [201.51, '没有地球太阳还是会绕会绕'],
    [204.72, '没有理由我也能自己走掉'],
    [207.98, '释怀说了太多就成真不了'],
    [211.20, '也许时间是一种解药解药'],
    [214.46, '也是我现在正服下的毒药'],
    [219.69, '你要离开 我知道很简单'],
    [226.17, '你说依赖 是我们的阻碍'],
    [232.73, '就算放开 但能不能别没收我的爱'],
    [243.26, '当作我最后才明白']
  ];

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* ---------------- 元素 ---------------- */
  var audio      = $('#audio');
  var player     = $('#player');
  var disc       = $('#disc');
  var tonearm    = $('#tonearm');
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

  /* ---------------- 渲染歌词 ---------------- */
  var lyricEls = [];
  if (lyricList) {
    LYRICS.forEach(function (row) {
      var li = document.createElement('li');
      li.textContent = row[1];
      lyricList.appendChild(li);
      lyricEls.push(li);
    });
  }

  var currentLine = -1;
  function syncLyrics(t) {
    if (!lyricEls.length) return;
    var idx = -1;
    for (var i = 0; i < LYRICS.length; i++) {
      if (t + 0.25 >= LYRICS[i][0]) idx = i; else break;
    }
    if (idx === currentLine) return;

    if (currentLine >= 0 && lyricEls[currentLine]) {
      lyricEls[currentLine].classList.remove('active');
    }
    currentLine = idx;

    var box = lyricList.parentNode;
    var boxH = box ? box.clientHeight : 132;

    if (idx >= 0 && lyricEls[idx]) {
      lyricEls[idx].classList.add('active');
      var lineH = lyricEls[idx].offsetHeight || 33;
      // 让当前行垂直居中
      var y = (boxH / 2) - (idx * lineH) - (lineH / 2);
      lyricList.style.transform = 'translateY(' + Math.round(y) + 'px)';
    } else {
      lyricList.style.transform = 'translateY(0px)';
    }
  }

  /* ---------------- 播放状态 UI ---------------- */
  var isPlaying = false;

  function paintPlayState(playing) {
    isPlaying = playing;
    if (player)  player.classList.toggle('is-playing', playing);
    if (disc)    disc.classList.toggle('playing', playing);
    if (tonearm) tonearm.classList.toggle('on', playing);
    if (btnPlay) btnPlay.setAttribute('aria-label', playing ? '暂停' : '播放');
    if (heroPlay) {
      heroPlay.classList.toggle('is-playing', playing);
      var label = heroPlay.querySelector('span');
      if (label) label.textContent = playing ? '暂停《彩虹》' : '播放《彩虹》';
    }
    if (playerHint) {
      playerHint.textContent = playing ? '正在播放 · 周杰伦《彩虹》' : '已暂停，点击继续';
    }
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
    if (audio.paused) play(); else audio.pause();
  }

  if (btnPlay)  btnPlay.addEventListener('click', toggle);
  if (heroPlay) heroPlay.addEventListener('click', toggle);

  audio.addEventListener('play',  function () { paintPlayState(true);  });
  audio.addEventListener('pause', function () { paintPlayState(false); });
  audio.addEventListener('ended', function () { paintPlayState(false); });

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
      progress.setPointerCapture && progress.setPointerCapture(e.pointerId);
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
    btnLoop.title = looping ? '单曲循环：开' : '单曲循环：关';
    audio.loop = looping;
  }
  if (btnLoop) {
    btnLoop.addEventListener('click', function () {
      looping = !looping;
      paintLoop();
      toast(looping ? '已开启单曲循环' : '已关闭单曲循环');
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

  /* ---------------- 导航 ---------------- */
  var nav = $('#nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 当前区块高亮 */
  var navLinks = $$('.nav-links a');
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
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 45, 260) + 'ms';
      revObs.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- 复制联系方式 ---------------- */
  var toastEl = $('#toast');
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1900);
  }

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

  /* ---------------- 年份 ---------------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- 键盘：空格控制播放（非输入态） ---------------- */
  document.addEventListener('keydown', function (e) {
    if (e.code !== 'Space') return;
    var t = e.target;
    var tag = (t && t.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'A' || tag === 'SELECT') return;
    e.preventDefault();
    toggle();
  });

  /* ---------------- 初始化 ---------------- */
  paintPlayState(false);
  if (timeAll) timeAll.textContent = '04:23';
  syncLyrics(0);
})();
