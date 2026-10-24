'use strict';

// 专业名称依据南昌航空大学招生信息网《2026年本科招生专业目录》整理。
const majors = [
  { id: 'aerospace', name: '飞行器设计工程', english: 'Aircraft Design', icon: 'plane', description: '以创新为翼，让每一份想象都有起飞的力量。' },
  { id: 'low-altitude', name: '低空技术与工程', english: 'Low-altitude Technology', icon: 'wing', description: '探索低空新航道，在未来的天空写下自己的航线。' },
  { id: 'unmanned', name: '无人驾驶航空器系统工程', english: 'Unmanned Aircraft Systems', icon: 'compass', description: '让智慧与飞行器同行，解锁无人系统的无限可能。' },
  { id: 'propulsion', name: '飞行器动力工程', english: 'Aircraft Propulsion', icon: 'spark', description: '聆听引擎的心跳，为每一次远行注入澎湃动力。' },
  { id: 'flight-control', name: '飞行器控制与信息工程', english: 'Aircraft Control & Information', icon: 'chip', description: '连接控制与信息，让每一次飞行都从容而精准。' },
  { id: 'airworthiness', name: '飞行器适航技术', english: 'Airworthiness Technology', icon: 'check', description: '以严谨守护安全，为每一段蓝天旅程保驾护航。' },
  { id: 'manufacturing', name: '飞行器制造工程', english: 'Aircraft Manufacturing', icon: 'chart', description: '从图纸到机翼，把精密的构想变成真实的飞行。' },
  { id: 'mechanical', name: '机械设计制造及其自动化', english: 'Mechanical Engineering', icon: 'chart', description: '让齿轮咬合创意，用工程设计驱动未来。' },
  { id: 'materials', name: '金属材料工程', english: 'Metallic Materials', icon: 'flask', description: '在微观世界里，寻找支撑航空梦想的坚韧力量。' },
  { id: 'composites', name: '复合材料与工程', english: 'Composite Materials', icon: 'flask', description: '探索轻盈与坚韧的平衡，为飞行器打造全新骨骼。' },
  { id: 'welding', name: '焊接技术与工程', english: 'Welding Technology', icon: 'spark', description: '让每一道连接可靠而精准，以匠心铸就航空品质。' },
  { id: 'environment', name: '环境工程', english: 'Environmental Engineering', icon: 'sun', description: '用科学守护碧水蓝天，让发展与美好环境同行。' },
  { id: 'computer', name: '计算机科学与技术', english: 'Computer Science', icon: 'code', description: '用代码连接世界，写下属于你的数字答案。' },
  { id: 'software', name: '软件工程', english: 'Software Engineering', icon: 'code', description: '从一个想法到一款产品，构建改变生活的数字工具。' },
  { id: 'ai', name: '人工智能', english: 'Artificial Intelligence', icon: 'spark', description: '与智能时代同频，让数据与算法打开新的边界。' },
  { id: 'data', name: '数据科学与大数据技术', english: 'Data Science & Big Data', icon: 'chart', description: '在海量信息中看见规律，让数据成为探索的向导。' },
  { id: 'electronic', name: '电子信息工程', english: 'Electronic Information', icon: 'chip', description: '捕捉每一束信号，让科技与生活同频共振。' },
  { id: 'communication', name: '通信工程', english: 'Communication Engineering', icon: 'chip', description: '跨越山海传递信息，让世界始终紧密相连。' },
  { id: 'automation', name: '自动化', english: 'Automation', icon: 'compass', description: '赋予系统感知与思考，让复杂运转变得从容有序。' },
  { id: 'measurement', name: '测控技术与仪器', english: 'Measurement & Control', icon: 'compass', description: '精准丈量世界，让每一次探索都有迹可循。' },
  { id: 'photonics', name: '光电信息科学与工程', english: 'Optoelectronic Information', icon: 'sun', description: '追逐光的脚步，在精密世界中点亮创新的灵感。' },
  { id: 'economics', name: '经济学', english: 'Economics', icon: 'chart', description: '读懂选择的逻辑，在变化的世界中洞察价值。' },
  { id: 'industrial-design', name: '工业设计', english: 'Industrial Design', icon: 'spark', description: '兼顾想象与实用，让好设计为生活带来惊喜。' },
  { id: 'english', name: '英语', english: 'English', icon: 'wing', description: '用语言架起桥梁，让青春的视野延伸到更远的地方。' }
];

const talents = [
  { id: 'sky', name: '天选航空人', rarity: 'SSR', icon: 'plane', description: '心怀蓝天，步履不停。向着热爱出发时，总有顺风相伴。' },
  { id: 'top-student', name: '绩点领航员', rarity: 'SSR', icon: 'chart', description: '目标清晰，行动坚定，每一次认真都在为未来积蓄高度。' },
  { id: 'inventor', name: '科创逐梦家', rarity: 'SSR', icon: 'spark', description: '灵感不止于想象，你总能把奇妙的点子变成真实作品。' },
  { id: 'lucky', name: '校园锦鲤', rarity: 'SSR', icon: 'spark', description: '好运常伴左右，平淡的日子里也总有小惊喜。' },
  { id: 'morning', name: '卧龙晨光', rarity: 'SR', icon: 'sun', description: '早起不再是难题，每个清晨都元气满满、收获满满。' },
  { id: 'library', name: '图书馆常驻客', rarity: 'SR', icon: 'spark', description: '知识的海洋任你遨游，专注学习的时光格外高效。' },
  { id: 'lab', name: '实验室新星', rarity: 'SR', icon: 'flask', description: '动手能力点满，在一次次尝试中离真相更近一步。' },
  { id: 'coder', name: '代码永动机', rarity: 'SR', icon: 'code', description: '面对 Bug 从容不迫，再来一行，也许就能成功运行。' },
  { id: 'precision', name: '毫厘之间', rarity: 'SR', icon: 'compass', description: '细节之中见真章，认真是你最可靠的超能力。' },
  { id: 'team', name: '团队主心骨', rarity: 'SR', icon: 'wing', description: '擅长倾听也敢于担当，有你在的团队总能并肩向前。' },
  { id: 'competition', name: '竞赛破风手', rarity: 'SR', icon: 'plane', description: '面对挑战越战越勇，把压力化作突破自我的动力。' },
  { id: 'volunteer', name: '温暖志愿者', rarity: 'SR', icon: 'sun', description: '用真诚回应需要，让微小的善意汇聚成校园的温暖。' },
  { id: 'photographer', name: '光影收藏家', rarity: 'SR', icon: 'spark', description: '总能发现独特视角，把昌航的四季珍藏进镜头。' },
  { id: 'sports', name: '操场追风者', rarity: 'SR', icon: 'wing', description: '迎着风全力奔跑，青春的每一步都充满能量。' },
  { id: 'speaker', name: '表达闪光者', rarity: 'SR', icon: 'spark', description: '清晰表达心中所想，你的声音值得被更多人听见。' },
  { id: 'english-talent', name: '国际视野家', rarity: 'SR', icon: 'compass', description: '好奇世界，也乐于交流，不同的文化为你打开新窗。' },
  { id: 'club', name: '社团社交达人', rarity: 'R', icon: 'wing', description: '轻松结识志同道合的伙伴，你的大学生活从不孤单。' },
  { id: 'night', name: '卧龙湖夜猫子', rarity: 'R', icon: 'moon', description: '夜色让你灵感迸发，但也不要忘记好好照顾自己。' },
  { id: 'foodie', name: '食堂美食雷达', rarity: 'R', icon: 'spark', description: '总能精准找到美味窗口，认真吃饭也是生活的仪式感。' },
  { id: 'planner', name: '时间管理师', rarity: 'R', icon: 'chart', description: '把忙碌安排得井井有条，学习与生活都不辜负。' },
  { id: 'musician', name: '旋律制造机', rarity: 'R', icon: 'sun', description: '耳机里有自己的宇宙，也能用音乐感染身边的人。' },
  { id: 'artist', name: '灵感涂鸦家', rarity: 'R', icon: 'spark', description: '一点色彩、一根线条，就能让平凡的角落生动起来。' },
  { id: 'explorer', name: '校园探索家', rarity: 'R', icon: 'compass', description: '不愿错过每一处风景，总能发现校园里的隐藏惊喜。' },
  { id: 'optimist', name: '元气补给站', rarity: 'R', icon: 'sun', description: '自带快乐能量，你的笑容总能给伙伴们加满元气。' }
];

const state = { name: '', major: null, talent: null, offers: [], refreshes: 2, timer: null };
const $ = (id) => document.getElementById(id);
const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`;
let toastTimer;

function toast(message) {
  $('toast').textContent = message;
  $('toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('toast').classList.remove('show'), 2400);
}

function showPage(name) {
  clearTimeout(state.timer);
  document.querySelectorAll('.page').forEach((page) => {
    const active = page.id === `${name}-page`;
    page.hidden = !active;
    page.classList.toggle('active', active);
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
  const heading = document.querySelector(`#${name}-page h1, #${name}-page h2`);
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}

function renderMajors() {
  $('major-grid').innerHTML = majors.map((major, index) => `
    <button class="major-card" type="button" data-major="${major.id}" aria-pressed="false">
      <span class="major-top"><span class="major-icon">${icon(major.icon)}</span><span class="major-number">${String(index + 1).padStart(2, '0')}</span></span>
      <span class="major-name">${major.name}</span>
      <span class="major-english">${major.english}</span>
      <span class="major-description">${major.description}</span>
      <span class="major-check">${icon('check')}</span>
    </button>`).join('');
  document.querySelectorAll('[data-major]').forEach((card) => {
    card.addEventListener('click', () => {
      state.major = majors.find((major) => major.id === card.dataset.major);
      document.querySelectorAll('[data-major]').forEach((item) => {
        const selected = item === card;
        item.classList.toggle('selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      $('major-next').disabled = false;
      $('major-hint').textContent = `已选择「${state.major.name}」，期待与你一起逐梦`;
    });
  });
}

function shuffleTalents() {
  const shuffled = [...talents];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 3);
}

function renderTalents() {
  state.talent = null;
  state.offers = shuffleTalents();
  $('talent-next').disabled = true;
  $('talent-hint').textContent = '正在翻开你的大学好运…';
  $('talent-grid').innerHTML = state.offers.map((talent, index) => `
    <article class="talent-card" data-talent="${talent.id}" style="--delay:${index * 100}ms">
      <div class="talent-inner">
        <div class="talent-face talent-front">${icon('wing')}<span>NCHU · TALENT</span></div>
        <div class="talent-face talent-back">
          <span class="talent-rarity rarity-${talent.rarity}">${talent.rarity} · ${talent.rarity === 'SSR' ? '传说' : talent.rarity === 'SR' ? '稀有' : '优秀'}</span>
          <span class="talent-symbol">${icon(talent.icon)}</span>
          <h3 class="talent-name">${talent.name}</h3>
          <p class="talent-desc">${talent.description}</p>
          <span class="talent-selected-label">${icon('check')} 已选择</span>
        </div>
      </div>
      <button type="button" aria-label="选择天赋：${talent.name}" aria-pressed="false">选择天赋</button>
    </article>`).join('');
  const cards = [...document.querySelectorAll('.talent-card')];
  cards.forEach((card, index) => {
    card.querySelector('button').addEventListener('click', () => selectTalent(index));
    setTimeout(() => {
      if (state.offers[index]?.id === card.dataset.talent) card.classList.add('flipped');
    }, 250 + index * 170);
  });
  state.timer = setTimeout(() => { $('talent-hint').textContent = '点击卡片，选择一项与你同行的好运'; }, 900);
}

function selectTalent(index) {
  state.talent = state.offers[index];
  document.querySelectorAll('.talent-card').forEach((card, i) => {
    const selected = i === index;
    card.classList.toggle('selected', selected);
    card.querySelector('button').setAttribute('aria-pressed', String(selected));
  });
  $('talent-next').disabled = false;
  $('talent-hint').textContent = `「${state.talent.name}」将成为你的初始天赋`;
}

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
  showPage('major');
});

$('username').addEventListener('input', () => {
  $('name-error').textContent = '';
  $('username').removeAttribute('aria-invalid');
});
$('major-next').addEventListener('click', () => { if (state.major) { showPage('talent'); renderTalents(); } });
$('refresh-talents').addEventListener('click', () => {
  if (state.refreshes < 1) return;
  state.refreshes -= 1;
  $('refresh-count').textContent = state.refreshes;
  $('refresh-talents').disabled = state.refreshes === 0;
  renderTalents();
});
$('random-talent').addEventListener('click', () => {
  const index = Math.floor(Math.random() * state.offers.length);
  selectTalent(index);
  toast(`命运为你选择了「${state.talent.name}」`);
});
$('talent-next').addEventListener('click', () => {
  if (!state.talent) return;
  $('profile-name').textContent = state.name;
  $('profile-major').textContent = state.major.name;
  $('profile-talent').textContent = `${state.talent.name} · ${state.talent.rarity}`;
  showPage('coming');
});
document.querySelectorAll('[data-back]').forEach((button) => {
  button.addEventListener('click', () => showPage(button.dataset.back));
});
$('restart').addEventListener('click', () => {
  Object.assign(state, { name: '', major: null, talent: null, offers: [], refreshes: 2 });
  $('name-form').reset();
  $('refresh-count').textContent = '2';
  $('refresh-talents').disabled = false;
  $('major-next').disabled = true;
  $('major-hint').textContent = '点击专业卡片，继续抽取你的专属天赋';
  document.querySelectorAll('.major-card').forEach((card) => { card.classList.remove('selected'); card.setAttribute('aria-pressed', 'false'); });
  showPage('start');
  $('username').focus();
});
$('theme-button').addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark');
  localStorage.setItem('nchu-theme', dark ? 'dark' : 'light');
  $('theme-button').innerHTML = icon(dark ? 'sun' : 'moon');
  $('theme-button').setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式');
});
try {
  if (localStorage.getItem('nchu-theme') === 'dark') {
    document.body.classList.add('dark');
    $('theme-button').innerHTML = icon('sun');
    $('theme-button').setAttribute('aria-label', '切换浅色模式');
  }
} catch { /* 主题记忆不可用时，网站仍可正常使用。 */ }
renderMajors();

// 供本地自动化验收读取，不参与页面流程。
window.__NCHU_CONTENT__ = Object.freeze({ majors, talents });
