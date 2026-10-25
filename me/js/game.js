/* ============================================================
   歌词节奏游戏  —  game.js
   谱面直接由 js/main.js 里的歌词时间轴生成，所以不用另做 beatmap
   ============================================================ */
(function () {
  'use strict';

  var HRF = window.HRF;
  if (!HRF) return;

  var TRACKS = HRF.TRACKS;
  var audio  = HRF.audio;
  var CFG    = window.HRF_CONFIG || {};

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var card = $('#gameCard');
  if (!card || !audio || !TRACKS) return;

  /* ---------------- 元素 ---------------- */
  var elStart   = $('#gameStart');
  var elPlay    = $('#gamePlay');
  var elResult  = $('#gameResult');
  var elSongs   = $('#gameSongs');
  var elBegin   = $('#gameBegin');
  var elRecords = $('#gameRecords');
  var elField   = $('#gameField');
  var elNotes   = $('#gameNotes');
  var elJudge   = $('#gameJudgeLine');
  var elLyric   = $('#gameLyric');
  var elCallout = $('#gameCallout');
  var elPause   = $('#gamePause');
  var elScore   = $('#hudScore');
  var elCombo   = $('#hudCombo');
  var elAcc     = $('#hudAcc');
  var elQuit    = $('#gameQuit');
  var elResume  = $('#gameResume');
  var elGrade   = $('#resultGrade');
  var elRSong   = $('#resultSong');
  var elRScore  = $('#resultScore');
  var elRAcc    = $('#resultAcc');
  var elRCombo  = $('#resultCombo');
  var elRPerfect= $('#resultPerfect');
  var elRGood   = $('#resultGood');
  var elRMiss   = $('#resultMiss');
  var elAgain   = $('#resultAgain');
  var elBack    = $('#resultBack');

  /* ---------------- 常量 ---------------- */
  var LANES    = 4;
  var NOTE_H   = 26;
  var W_PERFECT = 0.075;   /* 秒 */
  var W_GOOD    = 0.165;
  var SCROLL    = 2.0 / (Number(CFG.rhythmSpeed) || 1);  /* 音符从出现到判定线的时间 */

  var DIFFS = [
    { id: 'easy',   name: '简单', d: 0 },
    { id: 'medium', name: '普通', d: 1 },
    { id: 'hard',   name: '困难', d: 2 }
  ];

  var KEYMAP = { KeyD: 0, KeyF: 1, KeyJ: 2, KeyK: 3 };

  /* ---------------- 谱面生成 ---------------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* 每行歌词内部按固定间隔铺音符：间隔越小越难。
     歌词行的起始时间就是这一行的第一颗音符，落点始终"踩在歌词上"。 */
  var DIFF_STEP = [1.15, 0.78, 0.52];

  function buildChart(ti, di) {
    var rows = TRACKS[ti].lyrics;
    var rnd  = mulberry32(20240 + ti * 977 + di * 131);
    var step = DIFF_STEP[di] || DIFF_STEP[1];
    var notes = [];
    var lastLane = -1;

    for (var i = 0; i < rows.length; i++) {
      var t0 = rows[i][0];
      var tNext = (i + 1 < rows.length) ? rows[i + 1][0] : t0 + 2.4;
      var end = tNext - 0.24;
      if (end <= t0) end = t0 + 0.01;

      for (var t = t0; t <= end + 0.001; t += step) {
        var lane = Math.floor(rnd() * LANES);
        if (lane === lastLane) lane = (lane + 1 + Math.floor(rnd() * 3)) % LANES;
        lastLane = lane;

        notes.push({
          t: Math.round(t * 1000) / 1000,
          lane: lane,
          line: i,
          done: false,
          el: null
        });
      }
    }
    return notes;
  }

  /* ---------------- 状态 ---------------- */
  var G = {
    active: false,
    paused: false,
    song: 0,
    diff: 1,
    notes: [],
    cols: [],
    judgeY: 0,
    raf: 0,
    needSeek: true,
    firstNote: 0,
    lyricIdx: -2,
    score: 0,
    combo: 0,
    maxCombo: 0,
    perfect: 0,
    good: 0,
    miss: 0,
    judged: 0,
    prevLoop: true
  };

  /* ---------------- 布局 ---------------- */
  function buildColumns() {
    elNotes.innerHTML = '';
    G.cols = [];
    for (var i = 0; i < LANES; i++) {
      var c = document.createElement('div');
      c.className = 'note-col';
      c.setAttribute('data-lane', String(i));
      elNotes.appendChild(c);
      G.cols.push(c);
    }
  }

  function layout() {
    if (!elField || !elJudge) return;
    var fr = elField.getBoundingClientRect();
    var jr = elJudge.getBoundingClientRect();
    if (!fr.height) return;
    G.judgeY = (jr.top - fr.top) + jr.height / 2;
  }

  /* ---------------- 音符 ---------------- */
  function makeNoteEl(n) {
    var d = document.createElement('div');
    d.className = 'note note-l' + n.lane;
    d.style.height = NOTE_H + 'px';
    G.cols[n.lane].appendChild(d);
    return d;
  }

  function dropNoteEl(el, kind) {
    el.classList.add('is-' + kind);
    setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 240);
  }

  /* ---------------- 判定 ---------------- */
  function callout(text, kind) {
    if (!elCallout) return;
    elCallout.textContent = text;
    elCallout.className = 'game-callout show ' + kind;
    void elCallout.offsetWidth;
  }

  function judge(n, kind) {
    n.done = true;
    G.judged++;

    if (kind === 'perfect') {
      G.perfect++;
      G.combo++;
      G.score += 300 + Math.min(G.combo, 60) * 2;
    } else if (kind === 'good') {
      G.good++;
      G.combo++;
      G.score += 100 + Math.min(G.combo, 60);
    } else {
      G.miss++;
      G.combo = 0;
      G.score = Math.max(0, G.score);
    }

    if (G.combo > G.maxCombo) G.maxCombo = G.combo;

    if (n.el) dropNoteEl(n.el, kind);

    if (kind === 'perfect') callout('PERFECT', 'perfect');
    else if (kind === 'good') callout('GOOD', 'good');
    else callout('MISS', 'miss');

    paintHud();
  }

  function paintHud() {
    if (elScore) elScore.textContent = String(G.score);
    if (elCombo) {
      elCombo.textContent = String(G.combo);
      elCombo.parentNode.classList.toggle('hot', G.combo >= 10);
    }
    if (elAcc) {
      var acc = G.judged ? (G.perfect + G.good * 0.6) / G.judged : 1;
      elAcc.textContent = (acc * 100).toFixed(1) + '%';
    }
  }

  /* ---------------- 按键 ---------------- */
  function pressLane(lane) {
    if (!G.active || G.paused) return;

    var t = audio.currentTime;
    var best = null, bestDt = 1e9;

    for (var i = 0; i < G.notes.length; i++) {
      var n = G.notes[i];
      if (n.done || n.lane !== lane) continue;
      var dt = n.t - t;
      if (dt > W_GOOD) break;              /* 数组按时间升序 */
      if (dt < -W_GOOD) continue;
      var ad = Math.abs(dt);
      if (ad < bestDt) { bestDt = ad; best = n; }
    }

    var laneEl = $$('.lane')[lane];
    if (laneEl) {
      laneEl.classList.add('press');
      setTimeout(function () { laneEl.classList.remove('press'); }, 110);
    }

    if (!best) return;
    judge(best, bestDt <= W_PERFECT ? 'perfect' : 'good');
  }

  /* ---------------- 主循环 ---------------- */
  function frame() {
    if (!G.active) return;
    G.raf = requestAnimationFrame(frame);
    if (G.paused) return;

    /* 元数据就绪后定位到第一颗音符前 2.6 秒 */
    if (G.needSeek && audio.readyState >= 1) {
      G.needSeek = false;
      try { audio.currentTime = Math.max(0, G.firstNote - 2.6); } catch (e) {}
      HRF.markStarted();
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    }

    var t = audio.currentTime;

    updateLyric(t);

    var remain = 0;

    for (var i = 0; i < G.notes.length; i++) {
      var n = G.notes[i];
      if (n.done) continue;
      remain++;

      var dt = n.t - t;

      if (dt > SCROLL + 0.6) {
        if (n.el) n.el.style.visibility = 'hidden';
        continue;
      }

      if (dt < -W_GOOD) { judge(n, 'miss'); remain--; continue; }

      if (!n.el) n.el = makeNoteEl(n);
      n.el.style.visibility = 'visible';

      var y = G.judgeY - NOTE_H / 2 - (dt / SCROLL) * (G.judgeY + NOTE_H / 2);
      n.el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    }

    if (remain <= 0) { finish(); return; }

    var dur = audio.duration;
    if (isFinite(dur) && dur > 0 && t >= dur - 0.12) finish();
  }

  /* ---------------- 歌词 ---------------- */
  function updateLyric(t) {
    if (!elLyric) return;
    var rows = TRACKS[G.song].lyrics;
    var idx = -1;
    for (var i = 0; i < rows.length; i++) {
      if (t >= rows[i][0] - 0.45) idx = i; else break;
    }
    if (idx === G.lyricIdx) return;
    G.lyricIdx = idx;
    elLyric.textContent = idx >= 0 ? rows[idx][1] : '';
    elLyric.classList.remove('pop');
    void elLyric.offsetWidth;
    elLyric.classList.add('pop');
  }

  /* ---------------- 开始 / 结束 ---------------- */
  function resetStats() {
    G.score = 0; G.combo = 0; G.maxCombo = 0;
    G.perfect = 0; G.good = 0; G.miss = 0; G.judged = 0;
    G.lyricIdx = -2;
    paintHud();
  }

  function startGame(songIdx, diffIdx) {
    G.song = songIdx;
    G.diff = diffIdx;
    G.notes = buildChart(songIdx, diffIdx);
    G.firstNote = G.notes.length ? G.notes[0].t : 0;
    G.needSeek = true;
    G.paused = false;
    G.active = true;

    resetStats();

    elStart.hidden = true;
    elResult.hidden = true;
    elPlay.hidden = false;
    if (elPause) elPause.hidden = true;
    document.body.classList.add('is-gaming');
    card.classList.add('is-live');

    buildColumns();
    layout();

    if (elLyric) elLyric.textContent = '';

    audio.pause();
    G.prevLoop = audio.loop;
    audio.loop = false;

    HRF.setCurrent(songIdx);
    HRF.loadTrack(songIdx, false);

    cancelAnimationFrame(G.raf);
    G.raf = requestAnimationFrame(frame);
  }

  function finish() {
    if (!G.active) return;
    G.active = false;
    cancelAnimationFrame(G.raf);

    var acc = G.judged ? (G.perfect + G.good * 0.6) / G.judged : 0;
    var grade = acc >= 0.95 ? 'S' : acc >= 0.88 ? 'A' : acc >= 0.78 ? 'B' : acc >= 0.65 ? 'C' : 'D';

    audio.pause();
    audio.loop = G.prevLoop;
    document.body.classList.remove('is-gaming');
    card.classList.remove('is-live');
    if (elPause) elPause.hidden = true;

    if (elRSong)   elRSong.textContent = TRACKS[G.song].title + ' · ' + DIFFS[G.diff].name;
    if (elRScore)  elRScore.textContent = String(G.score);
    if (elRAcc)    elRAcc.textContent = (acc * 100).toFixed(1) + '%';
    if (elRCombo)  elRCombo.textContent = String(G.maxCombo);
    if (elRPerfect) elRPerfect.textContent = String(G.perfect);
    if (elRGood)   elRGood.textContent = String(G.good);
    if (elRMiss)   elRMiss.textContent = String(G.miss);
    if (elGrade) {
      elGrade.textContent = grade;
      elGrade.className = 'result-grade grade-' + grade.toLowerCase();
    }

    saveBest(acc);
    renderRecords();

    elPlay.hidden = true;
    elResult.hidden = false;
  }

  function exitGame() {
    G.active = false;
    G.paused = false;
    cancelAnimationFrame(G.raf);
    audio.pause();
    audio.loop = G.prevLoop;
    document.body.classList.remove('is-gaming');
    card.classList.remove('is-live');
    if (elPause) elPause.hidden = true;
    elPlay.hidden = true;
    elResult.hidden = true;
    elStart.hidden = false;
    renderRecords();
  }

  function pauseGame() {
    if (!G.active || G.paused) return;
    G.paused = true;
    audio.pause();
    if (elPause) elPause.hidden = false;
  }

  function resumeGame() {
    if (!G.active || !G.paused) return;
    G.paused = false;
    if (elPause) elPause.hidden = true;
    var p = audio.play();
    if (p && p.catch) p.catch(function () {});
  }

  /* ---------------- 存档 ---------------- */
  function bestKey(song, diff) { return 'hrf-rhythm:' + song + ':' + diff; }

  function readBest(song, diff) {
    try {
      var raw = localStorage.getItem(bestKey(song, diff));
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveBest(acc) {
    var prev = readBest(G.song, G.diff);
    var cur = { score: G.score, acc: acc, grade: gradeOf(acc), combo: G.maxCombo };
    if (!prev || cur.score > prev.score) {
      try { localStorage.setItem(bestKey(G.song, G.diff), JSON.stringify(cur)); } catch (e) {}
    }
  }

  function gradeOf(acc) {
    return acc >= 0.95 ? 'S' : acc >= 0.88 ? 'A' : acc >= 0.78 ? 'B' : acc >= 0.65 ? 'C' : 'D';
  }

  function renderRecords() {
    if (!elRecords) return;
    var best = readBest(G.song, G.diff);
    if (!best) {
      elRecords.innerHTML = '<span class="rec-empty">还没有成绩 · 打完一局会记在这里</span>';
      return;
    }
    elRecords.innerHTML =
      '<span class="rec-item"><b class="rec-grade grade-' + String(best.grade).toLowerCase() + '">' +
      best.grade + '</b>' + (best.acc * 100).toFixed(1) + '%</span>' +
      '<span class="rec-item">最高分 <b>' + best.score + '</b></span>' +
      '<span class="rec-item">最大连击 <b>' + best.combo + '</b></span>';
  }

  /* ---------------- 选择界面 ---------------- */
  function buildSelector() {
    if (!elSongs) return;
    elSongs.innerHTML = '';

    var songWrap = document.createElement('div');
    songWrap.className = 'pick-group';
    songWrap.innerHTML = '<span class="pick-label">曲目</span>';

    var songRow = document.createElement('div');
    songRow.className = 'pick-row';
    TRACKS.forEach(function (t, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pick-card' + (i === G.song ? ' on' : '');
      b.innerHTML = '<img src="' + t.cover + '" alt="" width="56" height="56" loading="lazy">' +
        '<span class="pick-main"><b>' + t.title + '</b><i>' + t.artist + ' · ' + t.album + '</i></span>';
      b.addEventListener('click', function () {
        G.song = i;
        $$('.pick-card', songRow).forEach(function (x, j) { x.classList.toggle('on', j === i); });
        renderRecords();
      });
      songRow.appendChild(b);
    });
    songWrap.appendChild(songRow);

    var diffWrap = document.createElement('div');
    diffWrap.className = 'pick-group';
    diffWrap.innerHTML = '<span class="pick-label">难度</span>';

    var diffRow = document.createElement('div');
    diffRow.className = 'pick-row pick-row-diff';
    DIFFS.forEach(function (d, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pick-diff' + (i === G.diff ? ' on' : '');
      b.textContent = d.name;
      b.addEventListener('click', function () {
        G.diff = i;
        $$('.pick-diff', diffRow).forEach(function (x, j) { x.classList.toggle('on', j === i); });
        renderRecords();
      });
      diffRow.appendChild(b);
    });
    diffWrap.appendChild(diffRow);

    elSongs.appendChild(songWrap);
    elSongs.appendChild(diffWrap);
  }

  /* ---------------- 事件绑定 ---------------- */
  if (elBegin) {
    elBegin.addEventListener('click', function () {
      startGame(G.song, G.diff);
    });
  }

  if (elQuit) elQuit.addEventListener('click', exitGame);
  if (elResume) elResume.addEventListener('click', resumeGame);

  if (elAgain) {
    elAgain.addEventListener('click', function () { startGame(G.song, G.diff); });
  }
  if (elBack) {
    elBack.addEventListener('click', function () {
      elResult.hidden = true;
      elStart.hidden = false;
      renderRecords();
    });
  }

  $$('.lane').forEach(function (laneEl) {
    var idx = Number(laneEl.getAttribute('data-lane'));
    laneEl.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      pressLane(idx);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (!G.active) return;

    if (e.code === 'Escape') { pauseGame(); return; }
    if (e.code === 'Space' && G.paused) { e.preventDefault(); resumeGame(); return; }

    var lane = KEYMAP[e.code];
    if (lane === undefined) return;
    e.preventDefault();
    if (e.repeat) return;
    pressLane(lane);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && G.active && !G.paused) pauseGame();
  });

  /* 音频放完但谱面还没走完（例如手动拖到结尾）：直接结算。
     main.js 的 ended 处理器会跳过 is-gaming 状态，所以不会把歌重播一遍。 */
  audio.addEventListener('ended', function () {
    if (G.active) finish();
  });

  window.addEventListener('resize', function () {
    if (G.active) layout();
  });

  /* ---------------- 初始化 ---------------- */
  buildSelector();
  renderRecords();
})();
