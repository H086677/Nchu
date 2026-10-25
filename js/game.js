/* ==========================================================
   赣江之畔启航指南 · 交互
   ========================================================== */
'use strict';

(function () {
  const $ = (id) => document.getElementById(id);
  const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const state = {
    name: '', alloc: {}, major: null, hand: [], talents: [],
    /* —— 四年 —— */
    term: 0,          /* 当前学期索引 0-7 */
    stats: null,      /* 当前属性（会被事件改变） */
    club: null,       /* 已加入的社团对象 */
    log: [],          /* 事件记录 */
    flags: {},        /* 关键标记 */
    queue: [],        /* 本学期待办事件 */
    step: 0,          /* 本学期已处理到第几个 */
    secret: false,    /* 卢超彩蛋 */
    ending: null
  };
  let toastTimer;

  /* ---------- 属性读写 ---------- */
  const STAT_KEYS = () => STATS.map((s) => s.key);

  function stat(key) {
    return (state.stats && state.stats[key]) || 0;
  }

  function addStats(effects) {
    if (!effects || !state.stats) return;
    Object.keys(effects).forEach((key) => {
      if (state.stats[key] === undefined) return;
      state.stats[key] = Math.max(0, state.stats[key] + effects[key]);
    });
  }

  function totalStats() {
    return STAT_KEYS().reduce((sum, key) => sum + stat(key), 0);
  }

  /* 属性检定：d20 + 属性值 ≥ DC 即成功 */
  function rollCheck(check) {
    const base = stat(check.stat);
    const dice = 1 + Math.floor(Math.random() * 20);
    const total = base + dice;
    return { ok: total >= check.dc, base: base, dice: dice, total: total, dc: check.dc };
  }

  /* ---------- 提示 ---------- */
  function toast(message) {
    const el = $('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  /* ---------- 页面切换 ---------- */
  function showPage(name) {
    document.querySelectorAll('.page').forEach((page) => {
      const active = page.id === name + '-page';
      page.hidden = !active;
      page.classList.toggle('active', active);
    });
    if (name === 'allocate' && !$('allocate-list').children.length) renderAllocate();
    window.scrollTo(0, 0);
    const heading = document.querySelector('#' + name + '-page h1, #' + name + '-page h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  /* ---------- 属性计算 ---------- */
  function computeStats(majorId, talents, alloc) {
    const major = MAJORS.find((m) => m.id === majorId);
    const result = {};
    STATS.forEach((s) => { result[s.key] = BASE_STAT; });
    const points = alloc || state.alloc || {};
    STATS.forEach((s) => { result[s.key] += points[s.key] || 0; });
    if (major) {
      Object.keys(major.effects).forEach((key) => {
        if (result[key] !== undefined) result[key] += major.effects[key];
      });
    }
    (talents || []).forEach((t) => {
      Object.keys(t.effects).forEach((key) => {
        if (result[key] !== undefined) result[key] += t.effects[key];
      });
    });
    return result;
  }

  /* ---------- 属性加点 ---------- */
  /* 彩蛋模式（名字 = 卢超）下：加点直接全满、天赋可全选 */
  function allocPoints() {
    return state.secret ? ALLOCATE_MAX_PER_STAT * STATS.length : ALLOCATE_POINTS;
  }

  function pickCap() {
    return state.secret ? state.hand.length : TALENT_PICK;
  }

  /* 彩蛋模式至少要选一张，普通模式必须选满两张 */
  function pickMin() {
    return state.secret ? 1 : TALENT_PICK;
  }

  function fullAlloc() {
    const alloc = {};
    STATS.forEach((s) => { alloc[s.key] = ALLOCATE_MAX_PER_STAT; });
    return alloc;
  }

  function allocUsed() {
    return STATS.reduce((sum, s) => sum + (state.alloc[s.key] || 0), 0);
  }

  function statTotalHtml(value) {
    return (BASE_STAT + value) + '<small>' + (value > 0 ? '+' + value : '基础') + '</small>';
  }

  function renderAllocate() {
    $('allocate-list').innerHTML = STATS.map((stat) => {
      const value = state.alloc[stat.key] || 0;
      return '<div class="allocate-row' + (value > 0 ? ' has-points' : '') + '" data-stat="' + stat.key + '">' +
        '<div class="allocate-info">' +
          '<span class="allocate-name">' + icon(stat.icon) + stat.key +
            '<em>' + stat.en + '</em></span>' +
          '<span class="allocate-desc">' + stat.desc + '</span>' +
        '</div>' +
        '<div class="allocate-value">' +
          '<button class="stat-step" type="button" data-step="-1" aria-label="' + stat.key + ' 减一点">' +
            '<svg><use href="#i-minus"/></svg></button>' +
          '<span class="stat-total">' + statTotalHtml(value) + '</span>' +
          '<button class="stat-step" type="button" data-step="1" aria-label="' + stat.key + ' 加一点">' +
            '<svg><use href="#i-plus"/></svg></button>' +
        '</div>' +
        '<span class="allocate-bar"><i style="width:' + (value / ALLOCATE_MAX_PER_STAT * 100) + '%"></i></span>' +
        '</div>';
    }).join('');

    document.querySelectorAll('[data-stat] [data-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (state.secret) { toast('卢校长的属性，无需自己分配'); return; }
        const key = btn.closest('[data-stat]').dataset.stat;
        const delta = Number(btn.dataset.step);
        const current = state.alloc[key] || 0;
        const remaining = allocPoints() - allocUsed();
        if (delta > 0) {
          if (remaining <= 0) { toast('点数已经用完了'); return; }
          if (current >= ALLOCATE_MAX_PER_STAT) { toast(key + ' 最多加 ' + ALLOCATE_MAX_PER_STAT + ' 点'); return; }
          state.alloc[key] = current + 1;
        } else {
          if (current <= 0) return;
          state.alloc[key] = current - 1;
        }
        syncAllocate();
      });
    });

    syncAllocate();
  }

  function syncAllocate() {
    const secret = state.secret;
    const total = allocPoints();
    const used = allocUsed();
    const remaining = total - used;
    const pool = $('stat-pool');
    pool.textContent = remaining;
    const badge = pool.parentElement;
    badge.classList.toggle('empty', remaining === 0);
    badge.classList.toggle('full', remaining === 0);
    badge.classList.toggle('secret', secret);

    document.querySelectorAll('[data-stat]').forEach((row) => {
      const key = row.dataset.stat;
      const value = state.alloc[key] || 0;
      row.classList.toggle('has-points', value > 0);
      row.querySelector('.stat-total').innerHTML = statTotalHtml(value);
      row.querySelector('.allocate-bar i').style.width = (value / ALLOCATE_MAX_PER_STAT * 100) + '%';
      const minus = row.querySelector('[data-step="-1"]');
      const plus = row.querySelector('[data-step="1"]');
      minus.disabled = secret || value <= 0;
      plus.disabled = secret || value >= ALLOCATE_MAX_PER_STAT || remaining <= 0;
      row.classList.toggle('locked', secret);
    });

    const resetBtn = $('allocate-reset');
    if (resetBtn) resetBtn.disabled = secret;
    const subtitle = $('allocate-subtitle');
    if (subtitle) {
      subtitle.textContent = secret
        ? '彩蛋已触发 · 五项属性直接拉满，无需分配'
        : '十点自由分配 · 每项最多加五点';
    }

    $('allocate-next').disabled = remaining > 0;
    $('allocate-hint').textContent = secret
      ? '彩蛋已触发 · 属性已全满，点击下方按钮继续'
      : (remaining > 0
        ? '还有 ' + remaining + ' 点没有分配（每项最多加 ' + ALLOCATE_MAX_PER_STAT + ' 点）'
        : '十点已分配完毕，点击下方按钮继续');
  }

  /* ---------- 天赋抽卡 ---------- */
  const RARITY_LABEL = { SSR: 'SSR', SR: 'SR', R: 'R' };

  /* 按权重不放回地抽 n 张 */
  function drawTalents(n) {
    const pool = TALENTS.slice();
    const hand = [];
    for (let i = 0; i < n && pool.length; i += 1) {
      const total = pool.reduce((sum, t) => sum + RARITY[t.rarity].weight, 0);
      let roll = Math.random() * total;
      let index = pool.length - 1;
      for (let j = 0; j < pool.length; j += 1) {
        roll -= RARITY[pool[j].rarity].weight;
        if (roll <= 0) { index = j; break; }
      }
      hand.push(pool.splice(index, 1)[0]);
    }
    /* 至少保底一张 SR 以上，否则整手重抽 */
    if (!hand.some((t) => t.rarity !== 'R')) {
      return drawTalents(n);
    }
    return hand;
  }

  function effectChips(effects) {
    return Object.keys(effects).map((key) => {
      const stat = STATS.find((s) => s.key === key);
      return '<span class="effect-chip">' + icon(stat ? stat.icon : 'spark') + ' ' + key + ' +' + effects[key] + '</span>';
    }).join('');
  }

  function renderTalents(hand) {
    state.hand = hand;
    state.talents = [];
    $('talent-grid').innerHTML = hand.map((talent, index) =>
      '<button class="talent-card" type="button" data-talent="' + talent.id + '" aria-pressed="false">' +
        '<span class="talent-inner">' +
          '<span class="talent-face talent-front">' + icon(talent.icon) +
            '<b>' + RARITY_LABEL[talent.rarity] + '</b></span>' +
          '<span class="talent-face talent-back">' +
            '<span class="talent-check">' + icon('check') + '</span>' +
            '<span class="talent-rarity rarity-' + talent.rarity + '">' + RARITY_LABEL[talent.rarity] + '</span>' +
            '<span class="talent-symbol">' + icon(talent.icon) + '</span>' +
            '<span class="talent-name">' + talent.name + '</span>' +
            '<span class="talent-en">' + talent.en + '</span>' +
            '<span class="talent-desc">' + talent.desc + '</span>' +
            '<span class="talent-effects">' + effectChips(talent.effects) + '</span>' +
          '</span>' +
        '</span>' +
      '</button>').join('');

    /* 依次翻开 */
    const cards = Array.from(document.querySelectorAll('[data-talent]'));
    cards.forEach((card, index) => {
      setTimeout(() => card.classList.add('flipped'), 130 + index * 130);
    });

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const talent = TALENTS.find((t) => t.id === card.dataset.talent);
        const already = state.talents.indexOf(talent) >= 0;
        if (already) {
          state.talents = state.talents.filter((t) => t !== talent);
        } else {
          if (state.talents.length >= pickCap()) {
            toast('最多选 ' + pickCap() + ' 张，先取消一张吧');
            return;
          }
          state.talents.push(talent);
        }
        syncTalentSelection();
      });
    });

    syncTalentSelection();
  }

  function syncTalentSelection() {
    const cap = pickCap();
    document.querySelectorAll('[data-talent]').forEach((card) => {
      const talent = TALENTS.find((t) => t.id === card.dataset.talent);
      const selected = state.talents.indexOf(talent) >= 0;
      card.classList.toggle('selected', selected);
      card.classList.toggle('dim', !selected && state.talents.length >= cap);
      card.setAttribute('aria-pressed', String(selected));
    });
    const count = state.talents.length;
    const full = count >= pickMin();
    $('talent-next').disabled = !full;
    const subtitle = $('talent-subtitle');
    if (subtitle) {
      subtitle.textContent = state.secret
        ? '彩蛋已触发 · 五张全为 SSR，可全部带走'
        : '五张卡中挑两张带走 · 天赋将叠加到初始属性上';
    }
    $('talent-hint').textContent = state.secret
      ? (count
        ? '彩蛋模式：已选 ' + count + ' / ' + cap + ' 张（可继续全选）'
        : '彩蛋模式：至少选一张即可出发')
      : (full
        ? '已选「' + state.talents.map((t) => t.name).join('」「') + '」，共 ' + count + ' 张'
        : '从五张卡中挑选两张（已选 ' + count + ' / ' + cap + '）');
  }

  /* ---------- 专业卡片 ---------- */
  function renderMajors() {
    $('major-grid').innerHTML = MAJORS.map((major, index) =>
      '<button class="major-card" type="button" data-major="' + major.id + '" aria-pressed="false">' +
        '<span class="major-top"><span class="major-icon">' + icon(major.icon) + '</span>' +
        '<span class="major-number">' + String(index + 1).padStart(2, '0') + '</span></span>' +
        '<span class="major-name">' + major.name + '</span>' +
        '<span class="major-english">' + major.en + '</span>' +
        '<span class="major-college">' + major.college + '</span>' +
        '<span class="major-description">' + major.desc + '</span>' +
        '<span class="effect-row">' + effectChips(major.effects) + '</span>' +
        '<span class="major-check">' + icon('check') + '</span>' +
        '</button>').join('');

    document.querySelectorAll('[data-major]').forEach((card) => {
      card.addEventListener('click', () => {
        state.major = MAJORS.find((m) => m.id === card.dataset.major);
        document.querySelectorAll('[data-major]').forEach((item) => {
          const selected = item === card;
          item.classList.toggle('selected', selected);
          item.setAttribute('aria-pressed', String(selected));
        });
        $('major-next').disabled = false;
        $('major-hint').textContent = '已选择「' + state.major.name + '」，期待与你一起逐梦';
        toast('已选择：' + state.major.name);
      });
    });
  }

  /* ---------- 校史 ---------- */
  function renderTimeline() {
    $('timeline').innerHTML = TIMELINE.map((item) =>
      '<li' + (item.now ? ' class="now"' : '') + '>' +
      '<span class="tl-year">' + item.year + '</span>' +
      '<span class="tl-body"><span class="tl-name">' + item.name + '</span>' +
      '<span class="tl-note">' + item.note + '</span></span>' +
      '</li>').join('');
  }

  /* ---------- 成就 ---------- */
  function renderAchievements() {
    $('achv-grid').innerHTML = ACHIEVEMENTS.map((item) =>
      '<div class="achv-item" title="敬请期待">' + icon(item.icon) +
      '<span>' + item.name + '</span></div>').join('');
  }

  /* ==========================================================
     四年玩法
     ========================================================== */

  /* ---------- 彩蛋：名字取作「卢超」 ---------- */
  function isSecretName(name) {
    return name.replace(/\s/g, '') === SECRET_NAME;
  }

  /* 彩蛋模式：锁定专业、天赋全 SSR */
  function applySecretMode() {
    state.secret = true;
    const major = MAJORS.find((m) => m.id === SECRET_MAJOR);
    state.major = major || MAJORS[0];

    /* 专业页：只剩测控技术与仪器可选，其余置灰 */
    document.querySelectorAll('[data-major]').forEach((card) => {
      const locked = card.dataset.major !== SECRET_MAJOR;
      card.classList.toggle('locked', locked);
      card.classList.toggle('selected', !locked);
      card.setAttribute('aria-pressed', String(!locked));
      card.disabled = locked;
    });
    $('major-next').disabled = false;
    $('major-hint').textContent = '彩蛋已触发 · 专业已锁定为「' + state.major.name + '」';

    /* 唯一可选的那张卡滚进视野并高亮一下，免得玩家在灰卡里找 */
    const only = document.querySelector('[data-major="' + SECRET_MAJOR + '"]');
    if (only) {
      only.classList.add('locked-highlight');
      if (only.scrollIntoView) only.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setTimeout(() => only.classList.remove('locked-highlight'), 2400);
    }
  }

  function clearSecretMode() {
    state.secret = false;
    document.querySelectorAll('[data-major]').forEach((card) => {
      card.classList.remove('locked');
      card.disabled = false;
    });
  }

  /* ---------- 属性面板 ---------- */
  function renderStatPanel() {
    const panel = $('game-stats');
    if (!panel || !state.stats) return;
    panel.innerHTML = STATS.map((s) =>
      '<span class="gs-item" data-gs="' + s.key + '">' + icon(s.icon) +
      '<em>' + s.key + '</em><b>' + stat(s.key) + '</b></span>').join('');
  }

  function pulseStat(key) {
    const el = document.querySelector('[data-gs="' + key + '"]');
    if (!el) return;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 620);
  }

  /* ---------- 进度 ---------- */
  function renderTermHeader() {
    const term = TERMS[state.term];
    if (!term) return;
    $('game-term').textContent = term.label;
    $('game-year').textContent = term.year;
    const pct = Math.round((state.term / TERMS.length) * 100);
    const bar = $('game-progress-bar');
    if (bar) bar.style.width = pct + '%';
    $('game-progress-text').textContent = (state.term + 1) + ' / ' + TERMS.length;
  }

  /* ---------- 事件卡片渲染 ---------- */
  function effectChipsInline(effects) {
    if (!effects) return '';
    return Object.keys(effects).map((key) => {
      const s = STATS.find((x) => x.key === key);
      const v = effects[key];
      return '<span class="delta-chip' + (v > 0 ? '' : ' minus') + '">' +
        icon(s ? s.icon : 'spark') + ' ' + key + ' ' + (v > 0 ? '+' : '') + v + '</span>';
    }).join('');
  }

  function renderEventCard(ev, index, total) {
    const stage = $('event-stage');
    const isClub = !!ev.clubName;
    stage.innerHTML =
      '<div class="event-card">' +
        '<div class="event-head">' +
          '<span class="event-icon">' + icon(ev.icon || 'spark') + '</span>' +
          '<div class="event-meta">' +
            (isClub ? '<span class="event-club">' + ev.clubName + '</span>' : '') +
            '<span class="event-tag">' + (ev.tag || '') + '</span>' +
          '</div>' +
          '<span class="event-count">' + (index + 1) + ' / ' + total + '</span>' +
        '</div>' +
        '<h3 class="event-title">' + ev.title + '</h3>' +
        '<p class="event-text">' + ev.text.replace(/\n/g, '<br>') + '</p>' +
        '<div class="event-choices" id="event-choices"></div>' +
      '</div>';

    const box = $('event-choices');

    /* 社团招新：特殊渲染 */
    if (ev.type === 'club') {
      box.innerHTML = CLUBS.map((club) =>
        '<button class="club-option" type="button" data-club="' + club.id + '">' +
          '<span class="club-icon">' + icon(club.icon) + '</span>' +
          '<span class="club-body">' +
            '<span class="club-name">' + club.name + '</span>' +
            '<span class="club-en">' + club.en + '</span>' +
            '<span class="club-desc">' + club.desc + '</span>' +
            '<span class="club-tag">' + club.tag + '</span>' +
            '<span class="effect-row">' + effectChips(club.effects) + '</span>' +
          '</span>' +
        '</button>').join('') +
        '<button class="choice-button ghost" type="button" data-club="none">' +
          '<span class="choice-label">一个都不加，专心读书</span>' +
          '<span class="choice-hint">不加社团 · 每学期多一次自习机会</span>' +
        '</button>';

      box.querySelectorAll('[data-club]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.club;
          if (id === 'none') {
            state.club = null;
            addStats({ 笃学: 1 });
            pushLog({ term: state.term, title: '百团大战', text: '你一张报名表都没交，把时间留给了图书馆。', effects: { 笃学: 1 } });
            renderStatPanel();
            nextStep();
            return;
          }
          const club = CLUBS.find((c) => c.id === id);
          state.club = club;
          state.flags['club_' + id] = true;
          addStats(club.effects);
          pushLog({ term: state.term, title: '百团大战', text: '你加入了「' + club.name + '」。', effects: club.effects });
          renderStatPanel();
          toast('已加入：' + club.name);
          nextStep();
        });
      });
      return;
    }

    /* 普通事件：选项 */
    box.innerHTML = ev.choices.map((choice, i) =>
      '<button class="choice-button" type="button" data-choice="' + i + '">' +
        '<span class="choice-label">' + choice.label + '</span>' +
        (choice.check
          ? '<span class="choice-hint">检定 · ' + choice.check.stat + ' ' + choice.check.dc + '</span>'
          : '<span class="choice-hint">' + effectChipsInline(choice.effects) + '</span>') +
      '</button>').join('');

    box.querySelectorAll('[data-choice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const choice = ev.choices[Number(btn.dataset.choice)];
        resolveChoice(ev, choice);
      });
    });
  }

  /* ---------- 结算一个选项 ---------- */
  function resolveChoice(ev, choice) {
    const box = $('event-choices');
    let outcome;
    let checkResult = null;

    if (choice.check) {
      checkResult = rollCheck(choice.check);
      outcome = checkResult.ok ? choice.success : choice.fail;
    } else {
      outcome = { text: choice.result, effects: choice.effects };
    }

    const effects = outcome.effects || {};
    addStats(effects);
    if (outcome.flag) state.flags[outcome.flag] = true;
    if (choice.check && checkResult.ok && choice.success.flag) state.flags[choice.success.flag] = true;

    pushLog({
      term: state.term,
      title: ev.title,
      text: outcome.record || outcome.text,
      effects: effects,
      ok: checkResult ? checkResult.ok : null,
      check: checkResult
    });

    Object.keys(effects).forEach((key) => pulseStat(key));
    renderStatPanel();

    const verdict = checkResult
      ? '<span class="verdict ' + (checkResult.ok ? 'ok' : 'bad') + '">' +
          (checkResult.ok ? '检定成功' : '检定失败') + '</span>' +
        '<span class="verdict-detail">' + checkResult.base + ' + d20(' + checkResult.dice + ') = ' +
          checkResult.total + ' / ' + checkResult.dc + '</span>'
      : '';

    box.innerHTML =
      '<div class="outcome' + (checkResult && !checkResult.ok ? ' failed' : '') + '">' +
        (verdict ? '<div class="verdict-row">' + verdict + '</div>' : '') +
        '<p class="outcome-text">' + outcome.text.replace(/\n/g, '<br>') + '</p>' +
        (Object.keys(effects).length ? '<div class="effect-row">' + effectChipsInline(effects) + '</div>' : '') +
        '<button class="primary-button compact" type="button" id="event-next">继续</button>' +
      '</div>';

    $('event-next').addEventListener('click', nextStep);
  }

  function pushLog(entry) {
    state.log.push(entry);
  }

  /* ---------- 学期事件队列 ---------- */
  function buildTermQueue() {
    const queue = [];
    /* 主线事件 */
    EVENTS.filter((ev) => ev.term === state.term).forEach((ev) => queue.push(ev));
    /* 社团专属事件：第 1 / 3 / 5 学期各一次 */
    if (state.club) {
      const idx = [0, 2, 4].indexOf(state.term);
      if (idx >= 0 && state.club.events[idx]) {
        const raw = state.club.events[idx];
        queue.push(Object.assign({}, raw, { clubName: state.club.name, tag: raw.tag }));
      }
    }
    state.queue = queue;
    state.step = 0;
  }

  function renderCurrentStep() {
    const total = state.queue.length;
    if (state.step >= total) {
      showTermSummary();
      return;
    }
    renderEventCard(state.queue[state.step], state.step, total);
  }

  function nextStep() {
    state.step += 1;
    renderCurrentStep();
  }

  /* ---------- 学期小结 ---------- */
  function showTermSummary() {
    const term = TERMS[state.term];
    const last = state.term >= TERMS.length - 1;
    const stage = $('event-stage');
    const gains = STAT_KEYS().map((key) =>
      '<span class="gs-item">' + icon(STATS.find((s) => s.key === key).icon) +
      '<em>' + key + '</em><b>' + stat(key) + '</b></span>').join('');

    stage.innerHTML =
      '<div class="term-summary">' +
        '<span class="summary-label">TERM COMPLETE</span>' +
        '<h3>' + term.label + ' 结束</h3>' +
        '<p class="summary-sub">' + term.year + ' · 属性合计 ' + totalStats() + '</p>' +
        '<div class="summary-stats">' + gains + '</div>' +
        '<div class="summary-log">' +
          state.log.filter((l) => l.term === state.term).map((l) =>
            '<div class="log-line"><span class="log-dot"></span>' +
            '<span class="log-title">' + l.title + '</span>' +
            '<span class="log-text">' + l.text + '</span></div>').join('') +
        '</div>' +
        '<button class="primary-button" type="button" id="term-next">' +
          (last ? '走向毕业' : '进入 ' + TERMS[state.term + 1].label) +
          '<svg aria-hidden="true"><use href="#i-arrow"></use></svg></button>' +
      '</div>';

    $('term-next').addEventListener('click', () => {
      if (last) { finishGame(); return; }
      state.term += 1;
      buildTermQueue();
      renderTermHeader();
      renderCurrentStep();
    });
  }

  /* ---------- 开始四年 ---------- */
  function startJourney() {
    state.term = 0;
    state.log = [];
    state.flags = {};
    state.stats = computeStats(state.major.id, state.talents, state.alloc);
    buildTermQueue();
    renderTermHeader();
    renderStatPanel();
    renderCurrentStep();
    showPage('game');
  }

  /* ---------- 结局判定 ---------- */
  function pickEnding() {
    if (state.secret) return ENDINGS.find((e) => e.id === 'luchao');

    const f = state.flags;
    const aviationScore =
      (f.aviation_job ? 3 : 0) + (f.intern_ok ? 2 : 0) + (f.network ? 1 : 0) +
      (f.elite ? 1 : 0) + (stat('守正') >= 12 ? 1 : 0) + (stat('力行') >= 12 ? 1 : 0);

    const researchScore =
      (f.postgrad ? 3 : 0) + (f.postgrad_exam ? 2 : 0) + (f.mcm_award ? 2 : 0) +
      (f.challenge_award ? 1 : 0) + (stat('笃学') >= 14 ? 2 : 0);

    const industryScore =
      (f.job ? 2 : 0) + (f.intern_ok ? 1 : 0) + (f.metalwork ? 1 : 0) +
      (stat('力行') >= 13 ? 1 : 0);

    const best = Math.max(aviationScore, researchScore, industryScore);
    if (best >= 4 && aviationScore === best) return ENDINGS.find((e) => e.id === 'aviation');
    if (best >= 4 && researchScore === best) return ENDINGS.find((e) => e.id === 'postgrad');
    if (best >= 4 && industryScore === best) return ENDINGS.find((e) => e.id === 'industry');
    if (best >= 2) return ENDINGS.find((e) => e.id === 'wander');
    return ENDINGS.find((e) => e.id === 'normal');
  }

  function finishGame() {
    const ending = pickEnding();
    state.ending = ending;
    if (state.secret) state.flags[SECRET_ACHIEVEMENT] = true;
    renderEnding(ending);
    showPage('ending');
  }

  /* ---------- 结局页 ---------- */
  function renderEnding(ending) {
    $('ending-icon').innerHTML = icon(ending.icon);
    $('ending-label').textContent = ending.secret ? 'SECRET ENDING' : 'ENDING';
    $('ending-title').textContent = ending.title;
    $('ending-en').textContent = ending.en;
    $('ending-text').innerHTML = ending.text.replace(/\n/g, '<br>');

    $('ending-name').textContent = state.name;
    $('ending-major').textContent = state.major.name;
    $('ending-college').textContent = state.major.college;
    $('ending-stats').innerHTML = STATS.map((s) =>
      '<span class="stat-chip">' + icon(s.icon) + ' ' + s.key + '<b>' + stat(s.key) + '</b></span>').join('');
    $('ending-talents').innerHTML = state.talents.map((t) =>
      '<span class="talent-chip">' + icon(t.icon) + ' ' + t.name +
      '<em>' + RARITY_LABEL[t.rarity] + '</em></span>').join('');
    $('ending-club').textContent = state.club ? state.club.name : '未加入社团';

    const highlights = state.log.filter((l) => l.ok === true || (l.ok === null && l.effects &&
      Object.values(l.effects).some((v) => v > 0))).slice(-8);
    $('ending-log').innerHTML = highlights.map((l) =>
      '<li><span class="el-term">' + TERMS[l.term].short + '</span>' +
      '<span class="el-text">' + l.text + '</span></li>').join('');
  }

  /* ---------- 主题 ---------- */
  function applyTheme(dark) {
    document.body.classList.toggle('dark', dark);
    const btn = $('theme-button');
    if (btn) {
      btn.innerHTML = icon(dark ? 'sun' : 'moon');
      btn.setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式');
    }
  }

  /* ---------- 初始化 ---------- */
  function init() {
    /* 开始页引言：每次刷新随机一条 */
    const quoteEl = $('start-note-text');
    if (quoteEl && QUOTES.length) {
      quoteEl.textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    }

    /* 取名校验 */
    $('name-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const name = $('username').value.trim();
      if (!name) {
        $('name-error').textContent = '先写下你的名字，再开启这段旅程吧。';
        $('username').setAttribute('aria-invalid', 'true');
        $('username').focus();
        return;
      }
      state.name = name;
      $('name-error').textContent = '';
      $('username').removeAttribute('aria-invalid');
      clearSecretMode();
      state.secret = isSecretName(name);
      state.alloc = state.secret ? fullAlloc() : {};
      renderAllocate();
      showPage('allocate');
      if (state.secret) toast('彩蛋已触发 · 属性全满，天赋全 SSR');
    });

    $('username').addEventListener('input', () => {
      $('name-error').textContent = '';
      $('username').removeAttribute('aria-invalid');
    });

    /* 确认属性 → 选专业 */
    $('allocate-reset').addEventListener('click', () => {
      if (state.secret) { toast('彩蛋已触发 · 属性全满，无法重新分配'); return; }
      state.alloc = {};
      renderAllocate();
      toast('已重置全部加点');
    });

    $('allocate-next').addEventListener('click', () => {
      if (allocUsed() < allocPoints()) return;
      showPage('major');
      /* 卢超彩蛋：进专业页时锁定专业 */
      if (isSecretName(state.name)) applySecretMode();
    });

    /* 确认专业 → 天赋抽卡 */
    $('major-next').addEventListener('click', () => {
      if (!state.major) return;
      if (state.secret) {
        /* 彩蛋：天赋全 SSR，并且默认全部选上（可自行取消） */
        const ssr = TALENTS.filter((t) => t.rarity === 'SSR');
        renderTalents(ssr.slice(0, TALENT_DRAW));
        state.talents = state.hand.slice();
        syncTalentSelection();
        showPage('talent');
        return;
      }
      renderTalents(drawTalents(TALENT_DRAW));
      showPage('talent');
    });

    /* 重新抽取 */
    $('talent-redraw').addEventListener('click', () => {
      if (state.secret) { toast('彩蛋模式下天赋已经是最强的了'); return; }
      renderTalents(drawTalents(TALENT_DRAW));
      toast('重新抽取了 ' + TALENT_DRAW + ' 张天赋');
    });

    /* 确认天赋 → 彩蛋直接通关 / 否则开始四年 */
    $('talent-next').addEventListener('click', () => {
      if (state.talents.length < pickMin()) return;
      if (state.secret) {
        state.stats = computeStats(state.major.id, state.talents, state.alloc);
        state.flags[SECRET_ACHIEVEMENT] = true;
        state.log = [{ term: 0, title: '卢校长？', text: '你以「卢超」之名入学，专业锁定测控技术与仪器，天赋全为 SSR。' }];
        renderEnding(ENDINGS.find((e) => e.id === 'luchao'));
        showPage('ending');
        toast('隐藏成就已解锁：卢校长？');
        return;
      }
      $('profile-name').textContent = state.name;
      $('profile-major').textContent = state.major.name;
      $('profile-college').textContent = state.major.college;
      const stats = computeStats(state.major.id, state.talents, state.alloc);
      $('profile-stats').innerHTML = STATS.map((s) =>
        '<span class="stat-chip">' + icon(s.icon) + ' ' + s.key + '<b>' + stats[s.key] + '</b></span>').join('');
      $('profile-talents').innerHTML = state.talents.map((t) =>
        '<span class="talent-chip">' + icon(t.icon) + ' ' + t.name +
        '<em>' + RARITY_LABEL[t.rarity] + '</em></span>').join('');
      startJourney();
      toast('你的昌航四年，从军训开始');
    });

    /* 返回 / 跳转 */
    document.querySelectorAll('[data-back]').forEach((btn) => {
      btn.addEventListener('click', () => showPage(btn.dataset.back));
    });
    document.querySelectorAll('[data-goto]').forEach((btn) => {
      btn.addEventListener('click', () => showPage(btn.dataset.goto));
    });

    /* 重新启程 */
    $('restart').addEventListener('click', () => {
      state.name = '';
      state.alloc = {};
      state.major = null;
      state.hand = [];
      state.talents = [];
      state.term = 0;
      state.stats = null;
      state.club = null;
      state.log = [];
      state.flags = {};
      state.queue = [];
      state.step = 0;
      state.secret = false;
      state.ending = null;
      clearSecretMode();
      $('name-form').reset();
      $('name-error').textContent = '';
      $('username').removeAttribute('aria-invalid');
      $('major-next').disabled = true;
      $('major-hint').textContent = '点击专业卡片，抽取属于你的天赋';
      document.querySelectorAll('.major-card').forEach((card) => {
        card.classList.remove('selected');
        card.setAttribute('aria-pressed', 'false');
      });
      $('talent-grid').innerHTML = '';
      $('talent-next').disabled = true;
      $('talent-hint').textContent = '从五张卡中挑选两张';
      const talentSub = $('talent-subtitle');
      if (talentSub) talentSub.textContent = '五张卡中挑两张带走 · 天赋将叠加到初始属性上';
      $('allocate-list').innerHTML = '';
      syncAllocate();
      showPage('start');
      $('username').focus();
    });

    /* 结局页重新开始 */
    const endingRestart = $('ending-restart');
    if (endingRestart) {
      endingRestart.addEventListener('click', () => $('restart').click());
    }
    const endingArchive = $('ending-archive');
    if (endingArchive) {
      endingArchive.addEventListener('click', () => showPage('archive'));
    }

    /* 主题 */
    $('theme-button').addEventListener('click', () => {
      const dark = !document.body.classList.contains('dark');
      applyTheme(dark);
      try { localStorage.setItem('nchu-theme', dark ? 'dark' : 'light'); } catch (e) { /* 忽略 */ }
    });
    try {
      applyTheme(localStorage.getItem('nchu-theme') === 'dark');
    } catch (e) {
      applyTheme(false);
    }

    renderMajors();
    renderTimeline();
    renderAchievements();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* 供自动化验收读取 */
  window.__NCHU__ = {
    state: state, computeStats: computeStats, showPage: showPage, majors: MAJORS, stats: STATS,
    talents: TALENTS, drawTalents: drawTalents, renderTalents: renderTalents,
    allocUsed: allocUsed, renderAllocate: renderAllocate,
    /* 四年 */
    terms: TERMS, clubs: CLUBS, events: EVENTS, endings: ENDINGS,
    startJourney: startJourney, buildTermQueue: buildTermQueue, renderCurrentStep: renderCurrentStep,
    resolveChoice: resolveChoice, finishGame: finishGame, pickEnding: pickEnding,
    rollCheck: rollCheck, stat: stat, addStats: addStats, totalStats: totalStats,
    isSecretName: isSecretName, applySecretMode: applySecretMode
  };
})();


