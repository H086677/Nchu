/* ============================================================
   我喜欢的游戏 —— 数据 + 渲染
   ------------------------------------------------------------
   首页卡片与详情页（game.html）共用这一份数据。
   想加游戏就往下 COPY 一段，想改内容就改各字段。
   正文部分（sections）现在是占位文案，随便写。
   ============================================================ */
(function () {
  'use strict';

  var GAMES = [
    {
      id: 'eldenring',
      title: '艾尔登法环',
      en: 'ELDEN RING',
      year: '2022',
      platforms: ['PC', 'PS5'],
      genre: '动作角色扮演',
      hours: '120 小时',
      score: '9.6',
      c1: '#3b2f1f', c2: '#8a6a35',
      tagline: '在黄金树的阴影下，被反复击倒又反复站起来。',
      sections: [
        { h: '我为什么喜欢', p: '（待填）第一次走出宁姆格福，抬头看到黄金树的那一下。' },
        { h: '印象最深的时刻', p: '（待填）某个 Boss 打了三十次，第三十一次手在抖。' },
        { h: '想说的话', p: '（待填）' }
      ]
    },
    {
      id: 'botw',
      title: '塞尔达传说 旷野之息',
      en: 'The Legend of Zelda: Breath of the Wild',
      year: '2017',
      platforms: ['Switch'],
      genre: '开放世界冒险',
      hours: '200 小时',
      score: '9.8',
      c1: '#1e3a4c', c2: '#4f8fa8',
      tagline: '看见那座山，就能走过去。',
      sections: [
        { h: '我为什么喜欢', p: '（待填）它把"好奇心"做成了主线。' },
        { h: '印象最深的时刻', p: '（待填）第一次从初始台地滑翔下来。' },
        { h: '想说的话', p: '（待填）' }
      ]
    },
    {
      id: 'wukong',
      title: '黑神话：悟空',
      en: 'Black Myth: Wukong',
      year: '2024',
      platforms: ['PC', 'PS5'],
      genre: '动作',
      hours: '60 小时',
      score: '9.0',
      c1: '#3d1f1a', c2: '#a85a34',
      tagline: '国产团队把西游做成了这个样子。',
      sections: [
        { h: '我为什么喜欢', p: '（待填）' },
        { h: '印象最深的时刻', p: '（待填）' },
        { h: '想说的话', p: '（待填）' }
      ]
    },
    {
      id: 'hollowknight',
      title: '空洞骑士',
      en: 'Hollow Knight',
      year: '2017',
      platforms: ['PC', 'Switch'],
      genre: '类银河恶魔城',
      hours: '45 小时',
      score: '9.5',
      c1: '#1a2233', c2: '#3f5f8f',
      tagline: '安静的虫子王国，和一场很孤独的旅行。',
      sections: [
        { h: '我为什么喜欢', p: '（待填）' },
        { h: '印象最深的时刻', p: '（待填）' },
        { h: '想说的话', p: '（待填）' }
      ]
    },
    {
      id: 'stardew',
      title: '星露谷物语',
      en: 'Stardew Valley',
      year: '2016',
      platforms: ['PC', 'Switch', '手机'],
      genre: '模拟经营',
      hours: '150 小时',
      score: '9.4',
      c1: '#23401f', c2: '#6a9c4f',
      tagline: '一个人做的农场，治好了很多个晚上。',
      sections: [
        { h: '我为什么喜欢', p: '（待填）' },
        { h: '印象最深的时刻', p: '（待填）' },
        { h: '想说的话', p: '（待填）' }
      ]
    },
    {
      id: 'disco',
      title: '极乐迪斯科',
      en: 'Disco Elysium',
      year: '2019',
      platforms: ['PC'],
      genre: '角色扮演',
      hours: '40 小时',
      score: '9.7',
      c1: '#2b1f33', c2: '#7a4a8f',
      tagline: '一个失忆的侦探，和他脑子里二十四个声音。',
      sections: [
        { h: '我为什么喜欢', p: '（待填）' },
        { h: '印象最深的时刻', p: '（待填）' },
        { h: '想说的话', p: '（待填）' }
      ]
    },
    {
      id: 'deathstranding',
      title: '死亡搁浅',
      en: 'Death Stranding',
      year: '2019',
      platforms: ['PC', 'PS'],
      genre: '动作冒险',
      hours: '70 小时',
      score: '8.9',
      c1: '#1c2b33', c2: '#4f7f8f',
      tagline: '走路，送货，把断掉的世界重新连起来。',
      sections: [
        { h: '我为什么喜欢', p: '（待填）' },
        { h: '印象最深的时刻', p: '（待填）' },
        { h: '想说的话', p: '（待填）' }
      ]
    },
    {
      id: 'civ6',
      title: '文明 VI',
      en: 'Sid Meier\'s Civilization VI',
      year: '2016',
      platforms: ['PC'],
      genre: '策略',
      hours: '300 小时',
      score: '9.0',
      c1: '#33261a', c2: '#8f6f3f',
      tagline: '"再来一回合"是我最常说的谎。',
      sections: [
        { h: '我为什么喜欢', p: '（待填）' },
        { h: '印象最深的时刻', p: '（待填）' },
        { h: '想说的话', p: '（待填）' }
      ]
    }
  ];

  window.HRF_GAMES = GAMES;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function initial(g) {
    return (g.title || '?').replace(/[《》：:·\s]/g, '').slice(0, 1);
  }

  function coverStyle(g) {
    return 'background:linear-gradient(145deg,' + g.c1 + ' 0%,' + g.c2 + ' 100%)';
  }

  /* ---------------- 首页卡片 ---------------- */
  var grid = document.getElementById('gameGrid');
  if (grid) {
    grid.innerHTML = '';
    GAMES.forEach(function (g) {
      var a = document.createElement('a');
      a.className = 'gcard card reveal';
      a.href = 'game.html?id=' + encodeURIComponent(g.id);
      a.innerHTML =
        '<div class="gcard-cover" style="' + coverStyle(g) + '">' +
          '<span class="gcard-initial">' + esc(initial(g)) + '</span>' +
          '<span class="gcard-score">' + esc(g.score) + '</span>' +
        '</div>' +
        '<div class="gcard-body">' +
          '<h3 class="gcard-title">' + esc(g.title) + '</h3>' +
          '<p class="gcard-en">' + esc(g.en) + '</p>' +
          '<p class="gcard-tag">' + esc(g.tagline) + '</p>' +
          '<div class="gcard-foot">' +
            '<span class="gcard-meta">' + esc(g.year) + ' · ' + esc(g.genre) + '</span>' +
            '<span class="gcard-arrow" aria-hidden="true">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13m0 0-5-5m5 5-5 5"/></svg>' +
            '</span>' +
          '</div>' +
        '</div>';
      grid.appendChild(a);
    });
  }

  /* ---------------- 详情页 ---------------- */
  var page = document.getElementById('gpage');
  if (!page) return;

  var qs = new URLSearchParams(location.search);
  var id = qs.get('id');
  var idx = -1;
  for (var i = 0; i < GAMES.length; i++) {
    if (GAMES[i].id === id) { idx = i; break; }
  }
  if (idx < 0) idx = 0;
  var g = GAMES[idx];

  document.title = g.title + ' · 我喜欢的游戏 · 黄锐锋';

  var prev = GAMES[(idx - 1 + GAMES.length) % GAMES.length];
  var next = GAMES[(idx + 1) % GAMES.length];

  var chips = g.platforms.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('');

  var body = g.sections.map(function (s) {
    return '<article class="gsec card reveal">' +
             '<h2>' + esc(s.h) + '</h2>' +
             '<p>' + esc(s.p) + '</p>' +
           '</article>';
  }).join('');

  page.innerHTML =
    '<header class="ghero" style="' + coverStyle(g) + '">' +
      '<div class="ghero-in">' +
        '<p class="ghero-kicker">GAMES · ' + esc(g.year) + '</p>' +
        '<h1 class="ghero-title">' + esc(g.title) + '</h1>' +
        '<p class="ghero-en">' + esc(g.en) + '</p>' +
        '<ul class="ghero-chips">' + chips + '</ul>' +
      '</div>' +
    '</header>' +

    '<div class="gmeta card">' +
      '<div class="gmeta-cell"><span>年份</span><b>' + esc(g.year) + '</b></div>' +
      '<div class="gmeta-cell"><span>类型</span><b>' + esc(g.genre) + '</b></div>' +
      '<div class="gmeta-cell"><span>游玩时长</span><b>' + esc(g.hours) + '</b></div>' +
      '<div class="gmeta-cell"><span>我的评分</span><b>' + esc(g.score) + '</b></div>' +
    '</div>' +

    '<p class="gintro">' + esc(g.tagline) + '</p>' +

    '<div class="gsections">' + body + '</div>' +

    '<div class="gnav">' +
      '<a class="gnav-item card" href="game.html?id=' + encodeURIComponent(prev.id) + '">' +
        '<span class="gnav-label">上一款</span>' +
        '<span class="gnav-title">' + esc(prev.title) + '</span>' +
      '</a>' +
      '<a class="gnav-item card" href="index.html#games">' +
        '<span class="gnav-label">返回</span>' +
        '<span class="gnav-title">全部游戏</span>' +
      '</a>' +
      '<a class="gnav-item card gnav-next" href="game.html?id=' + encodeURIComponent(next.id) + '">' +
        '<span class="gnav-label">下一款</span>' +
        '<span class="gnav-title">' + esc(next.title) + '</span>' +
      '</a>' +
    '</div>';
})();
