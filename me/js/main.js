/* ============================================================
   黄锐锋 · 个人主页  —  main.js
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- 曲库 ---------------- */
  var TRACKS = [
    {
      title: '彩虹',
      artist: '周杰伦',
      album: '我很忙',
      src: 'assets/audio/rainbow.mp3',
      cover: 'assets/img/rainbow-cover.jpg',
      lyrics: [
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
      ]
    },
    {
      title: '听海',
      artist: '张惠妹',
      album: 'Bad Boy',
      src: 'assets/audio/tinghai.mp3',
      cover: 'assets/img/tinghai-cover.jpg',
      lyrics: [
        [45.21, '写信告诉我今天 海是什么颜色'],
        [52.91, '夜夜陪着你的海 心情又如何'],
        [60.28, '灰色是不想说 蓝色是忧郁'],
        [67.64, '而漂泊的你 狂浪的心'],
        [72.01, '停在哪里'],
        [76.13, '写信告诉我今夜 你想要梦什么'],
        [83.84, '梦里外的我是否 都让你无从选择'],
        [91.46, '我揪着一颗心 整夜都闭不了眼睛'],
        [99.16, '为何你明明动了情 却又不靠近'],
        [107.53, '听 海哭的声音'],
        [114.62, '叹惜着谁又被伤了心'],
        [118.38, '却还不清醒'],
        [123.59, '一定不是我 至少我很冷静'],
        [130.03, '可是泪水 就连泪水也都不相信'],
        [138.88, '听 海哭的声音'],
        [145.44, '这片海未免也太多情'],
        [149.35, '悲泣到天明'],
        [154.49, '写封信给我 就当最后约定'],
        [161.09, '说你在离开我的时候'],
        [164.83, '是怎样的心情'],
        [196.14, '写信告诉我今夜 你想要梦什么'],
        [204.01, '梦里外的我是否 都让你无从选择'],
        [211.46, '我揪着一颗心 整夜都闭不了眼睛'],
        [219.20, '为何你明明动了情 却又不靠近'],
        [227.80, '听 海哭的声音'],
        [234.69, '叹惜着谁又被伤了心'],
        [238.42, '却还不清醒'],
        [243.54, '一定不是我 至少我很冷静'],
        [250.16, '可是泪水 就连泪水也都不相信'],
        [258.88, '听 海哭的声音'],
        [265.57, '这片海未免也太多情'],
        [269.17, '悲泣到天明'],
        [274.65, '写封信给我 就当最后约定'],
        [281.07, '说你在离开我的时候'],
        [285.19, '是怎样的心情']
      ]
    }
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
  var trackRows  = $$('.track-row');

  var current = 0;

  /* ---------------- 歌词渲染 ---------------- */
  var lyricEls = [];

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

  var currentLine = -1;
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
  }

  function loadTrack(i, autoplay) {
    if (i < 0 || i >= TRACKS.length) return;
    var wasPlaying = autoplay || !audio.paused;
    current = i;
    paintTrack();
    audio.src = TRACKS[i].src;
    audio.load();
    if (wasPlaying) {
      var p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function () { paintPlayState(false); });
      }
    }
  }

  trackRows.forEach(function (row) {
    row.addEventListener('click', function () {
      var i = Number(row.getAttribute('data-track'));
      if (i === current) { toggle(); return; }
      loadTrack(i, true);
    });
  });

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
  paintTrack();
  paintPlayState(false);
  syncLyrics(0);
})();
