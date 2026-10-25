/* ==========================================================
   赣江之畔启航指南 · 数据层
   属性 / 专业 / 校史 / 成就 / 引言

   专业数据依据南昌航空大学招生信息网「专业介绍」
   （zsw.nchu.edu.cn，2026 年本科招生专业目录）逐院核对：
   专业名称、所属学院、培养方向、主干课程与标志性平台。
   ========================================================== */
'use strict';

/* ---------- 五项属性 ---------- */
const STATS = [
  { key: '笃学', en: 'DIL', icon: 'book',   desc: '课堂与自习室里的积累' },
  { key: '力行', en: 'PRA', icon: 'tool',   desc: '金工实习与实验室里的手感' },
  { key: '守正', en: 'INT', icon: 'shield', desc: '底线、规矩与航空报国的信念' },
  { key: '求新', en: 'INN', icon: 'spark',  desc: '航模队、挑战杯与通宵的灵光' },
  { key: '体质', en: 'STA', icon: 'pulse',  desc: '体育课、夜跑与赣江边的风' }
];

/* 基础值：每项 3 点，合计 15 点 */
const BASE_STAT = 3;

/* 加点：10 点自由分配，每项最多 5 点 */
const ALLOCATE_POINTS = 10;
const ALLOCATE_MAX_PER_STAT = 5;

/* ---------- 24 个专业 ----------
   icon 对应 index.html 顶部 <svg class="icon-library"> 里的 symbol 名，
   描述语取自该专业官方介绍里的核心课程、特色方向或标志性平台。
   ------------------------------------------------------------ */
const MAJORS = [
  /* —— 航空宇航学院 —— */
  { id: 'fzd',   name: '飞行器设计与工程',       en: 'Aircraft Design & Engineering',   college: '航空宇航学院',           icon: 'plane',   effects: { 求新: 2 },          desc: '空气动力学、飞行力学与结构设计，在风洞里把想象吹成能飞的形状。' },
  { id: 'wrj',   name: '无人驾驶航空器系统工程', en: 'UAV Systems Engineering',         college: '航空宇航学院',           icon: 'drone',   effects: { 求新: 1, 笃学: 1 }, desc: '无人集群协同与自主决策，让飞行器自己找到回家的航线。' },
  { id: 'fkxx',  name: '飞行器控制与信息工程',   en: 'Flight Control & Information',    college: '航空宇航学院',           icon: 'compass', effects: { 笃学: 1, 力行: 1 }, desc: '飞控律、导航与信息链路，让飞机稳稳飞在预设航线上。' },

  /* —— 动力与能源学院（航空发动机学院）—— */
  { id: 'fdl',   name: '飞行器动力工程',         en: 'Aircraft Propulsion Engineering', college: '动力与能源学院',         icon: 'flame',   effects: { 力行: 1, 求新: 1 }, desc: '涡喷试车台的轰鸣里，航空发动机的每一次点火与喘振。' },

  /* —— 机电学院 —— */
  { id: 'jixie', name: '机械设计制造及其自动化', en: 'Mechanical Design & Automation',  college: '机电学院',               icon: 'gear',    effects: { 力行: 2 },          desc: '从画法几何到数控编程，图纸上的线变成机床里的零件。' },
  { id: 'fzz',   name: '飞行器制造工程',         en: 'Aircraft Manufacturing',          college: '机电学院',               icon: 'tool',    effects: { 力行: 1, 守正: 1 }, desc: '工艺、装配与工装夹具，把设计图纸变成真能飞的实物。' },

  /* —— 材料科学与工程学院 —— */
  { id: 'jscl',  name: '金属材料工程',           en: 'Metal Materials Engineering',     college: '材料科学与工程学院',     icon: 'cube',    effects: { 笃学: 1, 力行: 1 }, desc: '热处理与表面防护，航空热表方向一半以上的技术骨干出自这里。' },
  { id: 'hjjs',  name: '焊接技术与工程',         en: 'Welding Technology',              college: '材料科学与工程学院',     icon: 'weld',    effects: { 力行: 1, 体质: 1 }, desc: '一道焊缝决定一架飞机的寿命，弧光底下从来没有小事。' },

  /* —— 环境与化学工程学院 —— */
  { id: 'yyhx',  name: '应用化学',               en: 'Applied Chemistry',               college: '环境与化学工程学院',     icon: 'atom',    effects: { 笃学: 2 },          desc: '现代仪器分析与精细化工，在分子尺度上调配出答案。' },
  { id: 'hjgc',  name: '环境工程',               en: 'Environmental Engineering',       college: '环境与化学工程学院',     icon: 'leaf',    effects: { 守正: 1, 笃学: 1 }, desc: '让废水与废气在工艺里转身，还赣江一江清水。' },

  /* —— 信息工程学院（人工智能学院）—— */
  { id: 'dzxx',  name: '电子信息工程',           en: 'Electronic Information Engineering', college: '信息工程学院',         icon: 'chip',    effects: { 笃学: 1, 求新: 1 }, desc: '航空电子与嵌入式系统，把信号送进座舱的每一块屏幕。' },
  { id: 'txgc',  name: '通信工程',               en: 'Communication Engineering',       college: '信息工程学院',           icon: 'signal',  effects: { 笃学: 1, 守正: 1 }, desc: '从机载数据链到地面站，让信息跨越山海不失真。' },
  { id: 'zdh',   name: '自动化',                 en: 'Automation',                      college: '信息工程学院',           icon: 'bolt',    effects: { 力行: 1, 笃学: 1 }, desc: '传感器、控制器与执行机构，让机器学会自己判断。' },
  { id: 'ai',    name: '人工智能',               en: 'Artificial Intelligence',         college: '信息工程学院',           icon: 'neural',  effects: { 求新: 2 },          desc: '算法、算力与数据，教机器看懂这片天空。' },
  { id: 'jsj',   name: '计算机科学与技术',       en: 'Computer Science & Technology',   college: '信息工程学院',           icon: 'monitor', effects: { 笃学: 1, 求新: 1 }, desc: '从操作系统到编译原理，弄懂这台机器的每一次运算。' },

  /* —— 软件学院 —— */
  { id: 'rjgc',  name: '软件工程',               en: 'Software Engineering',            college: '软件学院',               icon: 'code',    effects: { 力行: 1, 求新: 1 }, desc: '凌云班里写代码，把航空软件做成真能上天的产品。' },
  { id: 'dsj',   name: '数据科学与大数据技术',   en: 'Data Science & Big Data',         college: '软件学院',               icon: 'chart',   effects: { 笃学: 1, 求新: 1 }, desc: '从海量数据里挖出规律，让每一个判断都有据可依。' },

  /* —— 仪器科学与光电工程学院 —— */
  { id: 'ckyq',  name: '测控技术与仪器',         en: 'Measurement & Control Technology', college: '仪器科学与光电工程学院', icon: 'scan',    effects: { 守正: 1, 笃学: 1 }, desc: '无损检测：不拆一颗铆钉，也能看穿机翼内部的裂纹。' },

  /* —— 民航与交通学院（飞行学院）—— */
  { id: 'fxjs',  name: '飞行技术',               en: 'Flight Technology',               college: '民航与交通学院',         icon: 'wing',    effects: { 体质: 2 },          desc: '「2+2」培养、141 航校实训，毕业时学历和执照一起拿到。' },
  { id: 'sxjs',  name: '飞行器适航技术',         en: 'Aircraft Airworthiness',          college: '民航与交通学院',         icon: 'shield',  effects: { 守正: 2 },          desc: '适航审定与安全性评估，为每一次起飞签字把关。' },

  /* —— 艺术与设计学院 —— */
  { id: 'gysj',  name: '工业设计',               en: 'Industrial Design',               college: '艺术与设计学院',         icon: 'draft',   effects: { 求新: 1, 体质: 1 }, desc: '交通工具与航空产品的造型，从草图一路做到油泥模型。' },

  /* —— 经济管理学院 —— */
  { id: 'jjx',   name: '经济学',                 en: 'Economics',                       college: '经济管理学院',           icon: 'coin',    effects: { 笃学: 1, 守正: 1 }, desc: '微观、宏观到计量，用数据读懂产业与政策的走向。' },

  /* —— 文法学院 —— */
  { id: 'faxue', name: '法学',                   en: 'Law',                             college: '文法学院',               icon: 'scale',   effects: { 守正: 2 },          desc: '法理、民法与民用航空法，让规则替蓝天护航。' },

  /* —— 外国语学院 —— */
  { id: 'yy',    name: '英语',                   en: 'English',                         college: '外国语学院',             icon: 'lang',    effects: { 笃学: 1, 求新: 1 }, desc: '语言加航空，专四专八之外还有一整门科技英语翻译。' }
];

/* ---------- 天赋卡池 ----------
   rarity 决定抽中权重与卡片配色；effects 与专业加成叠加。
   每次抽 5 张，从中选 2 张带走。
   ------------------------------------------------------------ */
const TALENT_DRAW = 5;
const TALENT_PICK = 2;

const RARITY = {
  SSR: { weight: 1 },
  SR:  { weight: 4 },
  R:   { weight: 9 }
};

const TALENTS = [
  /* —— SSR —— */
  { id: 'wpen',   rarity: 'SSR', icon: 'flame',   name: '涡喷之心',         en: 'Turbine Heart',      effects: { 力行: 2, 求新: 1 }, desc: '听得懂发动机每一次喘振与熄火，试车台的轰鸣是你的摇篮曲。' },
  { id: 'wind',   rarity: 'SSR', icon: 'compass', name: '风洞常客',         en: 'Wind Tunnel Regular', effects: { 求新: 2, 笃学: 1 }, desc: '空气动力学的直觉比公式更准，你能「看见」气流怎么绕过机翼。' },
  { id: 'eye',    rarity: 'SSR', icon: 'scan',    name: '无损之眼',         en: 'Nondestructive Eye',  effects: { 守正: 2, 笃学: 1 }, desc: '不拆一颗铆钉就能看穿内部裂纹——全国 80% 无损检测骨干的传承。' },
  { id: 'ling',   rarity: 'SSR', icon: 'code',    name: '凌云班苗子',       en: 'Lingyun Candidate',   effects: { 笃学: 2, 求新: 1 }, desc: '软件学院拔尖班的预备役，代码写得比说话利索。' },
  { id: 'pilot',  rarity: 'SSR', icon: 'plane',   name: '141 航校预备役',   en: 'Flight School Reserve', effects: { 体质: 2, 守正: 1 }, desc: '检查单倒背如流，模拟机上的每个动作都刻进了肌肉。' },
  { id: 'clan',   rarity: 'SSR', icon: 'medal',   name: '航空报国世家',     en: 'Aviation Dynasty',    effects: { 守正: 2, 力行: 1 }, desc: '三代人的名字，分别写在三个不同型号的任务书上。' },

  /* —— SR —— */
  { id: 'model',  rarity: 'SR',  icon: 'drone',   name: '航模队队长',       en: 'Model Aircraft Captain', effects: { 求新: 1, 力行: 1 }, desc: '摔过十七架，第十八架终于稳稳飞起来了。' },
  { id: 'hand',   rarity: 'SR',  icon: 'tool',    name: '金工车间的手感',   en: 'Workshop Touch',      effects: { 力行: 2 },          desc: '锉刀推出去的那一刻，你就知道公差刚好。' },
  { id: 'closing',rarity: 'SR',  icon: 'book',    name: '图书馆闭馆曲',     en: 'Closing Melody',      effects: { 笃学: 2 },          desc: '你比管理员更熟悉那首每天响起的闭馆音乐。' },
  { id: 'night',  rarity: 'SR',  icon: 'draft',   name: '图纸画到天亮',     en: 'Dawn Drafting',       effects: { 笃学: 1, 力行: 1 }, desc: '通宵改完第七版，老师只回了两个字：再改。' },
  { id: 'run',    rarity: 'SR',  icon: 'pulse',   name: '赣江夜跑',         en: 'River Night Run',     effects: { 体质: 2 },          desc: '五公里，从八一大桥跑到前湖，风是免费的。' },
  { id: 'canteen',rarity: 'SR',  icon: 'bowl',    name: '食堂三楼常客',     en: 'Third Floor Regular', effects: { 体质: 1, 守正: 1 }, desc: '你知道哪个窗口几点出什么菜，从不扑空。' },
  { id: 'defend', rarity: 'SR',  icon: 'bolt',    name: '答辩型选手',       en: 'Defense Specialist',  effects: { 守正: 1, 求新: 1 }, desc: '越被追问越兴奋，评委沉默的时候你最放松。' },
  { id: 'switch', rarity: 'SR',  icon: 'refresh', name: '转专业未遂',       en: 'Transfer That Wasn\'t', effects: { 求新: 1, 笃学: 1 }, desc: '阴差阳错留了下来，却越学越觉得对味。' },
  { id: 'glue',   rarity: 'SR',  icon: 'star',    name: '社团万能胶',       en: 'Club All-Rounder',    effects: { 力行: 1, 体质: 1 }, desc: '哪个活动缺人，你都能顶上那个位置。' },
  { id: 'drill',  rarity: 'SR',  icon: 'shield',  name: '军训练出来的腰板', en: 'Drilled Backbone',    effects: { 体质: 2 },          desc: '站军姿两小时不倒，走路自带风声。' },

  /* —— R —— */
  { id: 'morning',rarity: 'R',   icon: 'clock',   name: '早八幸存者',       en: 'Morning Class Survivor', effects: { 体质: 1 },       desc: '靠着三个闹钟和一点意志力活到了今天。' },
  { id: 'notes',  rarity: 'R',   icon: 'note',    name: '笔记整理癖',       en: 'Note Hoarder',        effects: { 笃学: 1 },          desc: '一学期的笔记整理出来，差不多能出本书。' },
  { id: 'repair', rarity: 'R',   icon: 'monitor', name: '修好室友的电脑',   en: 'Dorm IT Support',     effects: { 力行: 1 },          desc: '从装系统到换硬盘，你都会，而且不收钱。' },
  { id: 'speed',  rarity: 'R',   icon: 'signal',  name: '抢课手速',         en: 'Course Grab Reflex',  effects: { 求新: 1 },          desc: '0.3 秒内完成提交，选课系统都追不上你。' },
  { id: 'seat',   rarity: 'R',   icon: 'book',    name: '图书馆占座术',     en: 'Seat Claiming',       effects: { 笃学: 1 },          desc: '六点半的四楼，靠窗第三个位置永远是你的。' },
  { id: 'runner', rarity: 'R',   icon: 'medal',   name: '竞赛陪跑员',       en: 'Contest Regular',     effects: { 求新: 1 },          desc: '参加过，努力过，没进决赛，但下次还会再来。' },
  { id: 'cram',   rarity: 'R',   icon: 'moon',    name: '考前突击王',       en: 'Last-Minute King',    effects: { 笃学: 1 },          desc: '三天学完一学期，成绩居然还过得去。' },
  { id: 'clinic', rarity: 'R',   icon: 'pulse',   name: '校医院常客',       en: 'Clinic Familiar',     effects: { 体质: 1 },          desc: '每次都是自己走进去，再自己走出来。' },
  { id: 'snack',  rarity: 'R',   icon: 'bowl',    name: '夜宵合伙人',       en: 'Midnight Snack Partner', effects: { 体质: 1 },       desc: '后街炒粉的老板，见你就多抓一把。' },
  { id: 'three',  rarity: 'R',   icon: 'spark',   name: '三分钟热度',       en: 'Three-Minute Flame',  effects: { 求新: 1 },          desc: '但每一次，都真的认真热过那三分钟。' },
  { id: 'map',    rarity: 'R',   icon: 'route',   name: '校园活地图',       en: 'Living Campus Map',   effects: { 笃学: 1 },          desc: '闭着眼睛也能找到任何一间教室。' },
  { id: 'card',   rarity: 'R',   icon: 'ticket',  name: '捡到校园卡',       en: 'Found Your Card',     effects: { 守正: 1 },          desc: '在田径场捡到过三张，一张不落都还了回去。' },

  /* —— SSR · 扩充 —— */
  { id: 'qianhu',  rarity: 'SSR', icon: 'star',    name: '前湖的天赋',       en: 'Born for This',        effects: { 求新: 2, 笃学: 1 }, desc: '有些题目你只是看了一眼，就知道答案该往哪个方向长。老师说这叫天分，你自己觉得只是运气好。' },
  { id: 'ironhand',rarity: 'SSR', icon: 'weld',    name: '焊枪不抖的手',     en: 'Steady Hand',          effects: { 力行: 2, 体质: 1 }, desc: '一道 0.8 毫米的薄板对接，别人要练三个月，你第三天就焊出了鱼鳞纹。' },
  { id: 'nightowl',rarity: 'SSR', icon: 'moon',    name: '通宵体质',         en: 'Nocturnal',            effects: { 笃学: 1, 体质: 2 }, desc: '别人熬一夜要缓三天，你熬三夜还能去跑早操。这具身体的电池容量不太正常。' },
  { id: 'memory',  rarity: 'SSR', icon: 'note',    name: '过目不忘',         en: 'Eidetic Memory',       effects: { 笃学: 3 },          desc: '一整本《空气动力学》的公式表，你翻两遍就能默出来，连页码都对得上。' },
  { id: 'leader',  rarity: 'SSR', icon: 'medal',   name: '天生的队长',       en: 'Natural Captain',      effects: { 守正: 2, 力行: 1 }, desc: '一群人乱成一锅粥的时候，你开口说三句话，所有人就都知道该干什么了。' },
  { id: 'luck',    rarity: 'SSR', icon: 'spark',   name: '锦鲤附体',         en: 'Fortune\'s Favorite',  effects: { 求新: 1, 体质: 1 }, desc: '抽签永远抽到好签，补考永远排到最后一排，连食堂打菜都能多一勺肉。' },

  /* —— SR · 扩充 —— */
  { id: 'tape',    rarity: 'SR',  icon: 'tool',    name: '绝缘胶带大师',     en: 'Duct Tape Master',     effects: { 力行: 1, 求新: 1 }, desc: '实验室里没有什么是胶带解决不了的，如果有，就再缠两圈。' },
  { id: 'ppt',     rarity: 'SR',  icon: 'chart',   name: 'PPT 圣手',         en: 'Slide Wizard',         effects: { 求新: 1, 守正: 1 }, desc: '同样的内容，你的排版就是比别人的好看三倍。答辩评委的第一印象分全靠它。' },
  { id: 'coffee',  rarity: 'SR',  icon: 'bowl',    name: '咖啡因耐受',       en: 'Caffeine Tolerant',    effects: { 体质: 2 },          desc: '第四杯美式下肚，你的心跳依然稳在 68，而室友已经在抖腿了。' },
  { id: 'senior',  rarity: 'SR',  icon: 'globe',   name: '学长人脉',         en: 'Senior Network',       effects: { 守正: 1, 笃学: 1 }, desc: '考试重点、选课攻略、实验室门禁——你总能提前一步知道。' },
  { id: 'labrat',  rarity: 'SR',  icon: 'flask',   name: '实验室钉子户',     en: 'Lab Squatter',         effects: { 力行: 2 },          desc: '老师傅都认识你，钥匙你有两把，连仪器报错代码你都背下来了。' },
  { id: 'english', rarity: 'SR',  icon: 'lang',    name: '英语原片无字幕',   en: 'Raw Subtitles Off',    effects: { 笃学: 1, 求新: 1 }, desc: '别人还在看字幕，你已经在听讲座、读原版手册了。' },
  { id: 'sleepless',rarity: 'SR', icon: 'clock',   name: '四点半的清醒',     en: '4:30 AM Clarity',      effects: { 笃学: 1, 体质: 1 }, desc: '凌晨四点半，别人都在打盹，只有你的脑子转得最快。' },
  { id: 'handy',   rarity: 'SR',  icon: 'gear',    name: '什么都会修',       en: 'Fix Anything',         effects: { 力行: 1, 体质: 1 }, desc: '室友的风扇、学姐的自行车、辅导员的投影仪——都修过。' },
  { id: 'orator',  rarity: 'SR',  icon: 'scale',   name: '站上台就发光',     en: 'Stage Presence',       effects: { 守正: 1, 求新: 1 }, desc: '台下腿抖，上台就稳。你天生适合被一群人看着说话。' },
  { id: 'memory2', rarity: 'SR',  icon: 'book',    name: '错题本执念',       en: 'Error Log Zealot',     effects: { 笃学: 2 },          desc: '每道错题都要抄三遍，抄到最后你发现自己能预判出题人的思路。' },
  { id: 'early',   rarity: 'SR',  icon: 'sun',     name: '五点半的生物钟',   en: '5:30 Internal Clock',  effects: { 体质: 2 },          desc: '不用闹钟，每天五点半自然醒。图书馆的保洁阿姨都跟你打招呼。' },
  { id: 'design',  rarity: 'SR',  icon: 'draft',   name: '草图信手拈来',     en: 'Instant Sketch',       effects: { 求新: 2 },          desc: '别人还在描述那个零件长什么样，你已经在纸上画完了三视图。' },

  /* —— R · 扩充 —— */
  { id: 'bike',    rarity: 'R',   icon: 'route',   name: '共享单车猎人',     en: 'Bike Hunter',          effects: { 体质: 1 },          desc: '早八前五分钟，你能在教学楼周围找到唯一一辆有电的电动车。' },
  { id: 'umbrella',rarity: 'R',   icon: 'leaf',    name: '永远带伞',         en: 'Always Prepared',      effects: { 守正: 1 },          desc: '南昌的雨说来就来，而你的包里永远有一把。' },
  { id: 'group',   rarity: 'R',   icon: 'globe',   name: '小组作业扛把子',   en: 'Group Project Carrier',effects: { 力行: 1 },          desc: '最后永远是你在凌晨两点把五个人的部分合成一份。' },
  { id: 'print',   rarity: 'R',   icon: 'monitor', name: '打印机克星',       en: 'Printer Whisperer',    effects: { 力行: 1 },          desc: '卡纸、缺墨、连不上网——你拍两下它就好了，没人知道为什么。' },
  { id: 'noodle',  rarity: 'R',   icon: 'bowl',    name: '泡面鉴赏家',       en: 'Instant Noodle Critic',effects: { 体质: 1 },          desc: '哪个牌子第几分钟下料包最好吃，你有完整的研究结论。' },
  { id: 'walk',    rarity: 'R',   icon: 'pulse',   name: '每天两万步',       en: '20K Steps',            effects: { 体质: 1 },          desc: '微信步数榜常年第一，室友怀疑你在宿舍里转圈。' },
  { id: 'quiet',   rarity: 'R',   icon: 'shield',  name: '图书馆静音区常驻', en: 'Silent Zone Resident', effects: { 笃学: 1 },          desc: '你能在完全安静的环境里坐六个小时，一句话都不说。' },
  { id: 'doodle',  rarity: 'R',   icon: 'draft',   name: '课本涂鸦家',       en: 'Margin Doodler',       effects: { 求新: 1 },          desc: '整本教材的页边都被你画满了飞机，老师翻到的时候愣了一下，然后笑了。' },
  { id: 'deadline',rarity: 'R',   icon: 'clock',   name: '死线战士',         en: 'Deadline Warrior',     effects: { 笃学: 1 },          desc: '不拖到最后一天绝对不动手，但每次都能按时交。' },
  { id: 'canteen2',rarity: 'R',   icon: 'coin',    name: '食堂省钱专家',     en: 'Canteen Economist',    effects: { 守正: 1 },          desc: '同样的钱，你能比别人多打一个菜，还知道哪个窗口几点打折。' },
  { id: 'coach',   rarity: 'R',   icon: 'medal',   name: '运动会常客',       en: 'Sports Meet Regular',  effects: { 体质: 1 },          desc: '每年运动会都报名，从来没进过前三，但每年都报名。' },
  { id: 'lucky2',  rarity: 'R',   icon: 'ticket',  name: '抽奖必中',         en: 'Lucky Draw Winner',    effects: { 求新: 1 },          desc: '社团抽奖、讲座抽奖、食堂开业抽奖——奖品堆了一抽屉。' }
];

/* ---------- 校史节点 ---------- */
const TIMELINE = [
  { year: '1952.03', name: '汉口航空工业学校',              note: '新中国最早成立的六所航空院校之一，诞生于抗美援朝烽火中' },
  { year: '1952.08', name: '汉口航空工业专科学校',          note: '升格专科，首批红色航空工程师在此起步' },
  { year: '1953.09', name: '中南第一工业学校',              note: '调整办学定位，服务新中国工业建设' },
  { year: '1954.08', name: '迁校江西南昌',                  note: '从汉口到赣江之畔，航校的根扎进了红土地' },
  { year: '1955.09', name: '南昌工业学校',                  note: '更名南昌工业学校，融入地方工业体系' },
  { year: '1956.03', name: '南昌航空工业学校',              note: '正式冠以「航空」之名' },
  { year: '1960.06', name: '南昌航空工业专科学校',          note: '办学层次提升，专业设置日趋完备' },
  { year: '1969.06', name: '国营赣江机械厂（502 厂）',      note: '一段特殊年代的厂校岁月' },
  { year: '1978.04', name: '南昌航空工业学院',              note: '恢复本科办学，开启高等教育新篇' },
  { year: '2007.04', name: '南昌航空大学',                  note: '更名大学，工理文管经法教艺协调发展' },
  { year: '2024',    name: '博士学位授予单位',              note: '航空宇航、仪器、环境三个一级学科博士点' },
  { year: '2026',    name: '现在 · 前湖之畔',               note: '七十四载航空报国路，故事从你开始', now: true }
];

/* ---------- 成就 ----------
   id 用于持久化解锁记录（localStorage: nchu-achievements）。
   kind:
     'flag'  —— 结算时检查 state.flags[flag]
     'stat'  —— 结算时检查属性 stat >= value
     'log'   —— 结算时检查 state.log 中出现过 log（事件标题/记录文本匹配）
     'count' —— 结算时检查某项计数 count >= value（见 game.js 的 achievementCounters）
     'end'   —— 结算时检查结局 ending === value
   secret: true 的成就未解锁时不显示名称，只显示「？？？」。
   ------------------------------------------------------------ */
const ACHIEVEMENTS = [
  /* —— 入学 · 开局 —— */
  { id: 'first_day',   icon: 'star',    name: '入学第一课',       desc: '走进前湖校区，成为 2026 级新生',              kind: 'always' },
  { id: 'talent_ssr',  icon: 'medal',   name: '天选之子',         desc: '开局抽到 SSR 天赋',                          kind: 'flag',  flag: 'got_ssr' },
  { id: 'allround',    icon: 'compass', name: '五项全能',         desc: '开局属性全部达到 6 点',                       kind: 'count', count: 'balanced', value: 1 },
  { id: 'perfect_alloc',icon: 'pulse',  name: '精打细算',         desc: '把 10 点加点一分不剩地分完',                  kind: 'flag',  flag: 'alloc_full' },

  /* —— 学业 —— */
  { id: 'cet4_pass',   icon: 'book',    name: '四级上岸',         desc: '通过大学英语四级考试',                        kind: 'flag',  flag: 'cet4' },
  { id: 'cet6_pass',   icon: 'book',    name: '六级战士',         desc: '通过大学英语六级考试',                        kind: 'flag',  flag: 'cet6' },
  { id: 'metalwork',   icon: 'tool',    name: '金工实习',         desc: '在工程训练中心做出一把合格的锤子',            kind: 'flag',  flag: 'metalwork' },
  { id: 'core_ok',     icon: 'shield',  name: '硬骨头',           desc: '熬过最难的一学期且全部通过',                  kind: 'flag',  flag: 'core_ok' },
  { id: 'thesis_ok',   icon: 'draft',   name: '开题通过',         desc: '毕业设计开题一次通过',                        kind: 'flag',  flag: 'thesis_ok' },
  { id: 'defense_ok',  icon: 'medal',   name: '答辩优秀',         desc: '毕业答辩获得优秀评价',                        kind: 'flag',  flag: 'defense_ok' },
  { id: 'scholar',     icon: 'note',    name: '学神',             desc: '毕业时笃学达到 18 点',                        kind: 'stat',  stat: '笃学', value: 18 },

  /* —— 竞赛 —— */
  { id: 'mcm_award',   icon: 'chart',   name: '数模获奖',         desc: '在全国大学生数学建模竞赛中获奖',              kind: 'flag',  flag: 'mcm_award' },
  { id: 'challenge',   icon: 'spark',   name: '挑战杯',           desc: '在挑战杯省赛中获奖',                          kind: 'flag',  flag: 'challenge_award' },
  { id: 'elite_class', icon: 'medal',   name: '菁英特训班',       desc: '入选航空菁英特训班',                          kind: 'flag',  flag: 'elite' },
  { id: 'contest_king',icon: 'star',    name: '竞赛收割机',       desc: '同一局里拿到两项以上竞赛奖项',                kind: 'count', count: 'awards', value: 2 },

  /* —— 社团 —— */
  { id: 'club_join',   icon: 'globe',   name: '百团大战',         desc: '在火箭广场加入一个社团',                      kind: 'flag',  flag: 'club_join' },
  { id: 'club_leader', icon: 'scale',   name: '社长大人',         desc: '当选社团负责人',                              kind: 'flag',  flag: 'club_leader' },
  { id: 'club_all',    icon: 'globe',   name: '社团全勤',         desc: '走完全部三次社团专属事件',                    kind: 'count', count: 'club_events', value: 3 },
  { id: 'drone_fly',   icon: 'drone',   name: '首飞成功',         desc: '让第一架自制航模真正飞起来',                  kind: 'flag',  flag: 'drone_fly' },

  /* —— 生活 —— */
  { id: 'night_run',   icon: 'pulse',   name: '赣江夜跑',         desc: '把体质练到 14 点以上',                        kind: 'stat',  stat: '体质', value: 14 },
  { id: 'iron_body',   icon: 'flame',   name: '铁打的人',         desc: '毕业时体质达到 18 点',                        kind: 'stat',  stat: '体质', value: 18 },
  { id: 'canteen',     icon: 'bowl',    name: '食堂三楼',         desc: '成为食堂三楼常客',                            kind: 'flag',  flag: 'canteen_friend' },
  { id: 'library',     icon: 'book',    name: '图书馆闭馆曲',     desc: '在图书馆待到闭馆至少三次',                    kind: 'count', count: 'library', value: 3 },
  { id: 'night_owl',   icon: 'moon',    name: '图纸画到天亮',     desc: '通宵赶工至少两次',                            kind: 'count', count: 'allnighter', value: 2 },
  { id: 'love',        icon: 'spark',   name: '青春恋爱物语',     desc: '在大学里谈了一场恋爱',                        kind: 'flag',  flag: 'love' },
  { id: 'heartbreak',  icon: 'leaf',    name: '毕业即分手',       desc: '恋爱走到毕业季却没能继续',                    kind: 'flag',  flag: 'heartbreak' },

  /* —— 挫折与危险 —— */
  { id: 'fail_exam',   icon: 'shield',  name: '挂科初体验',       desc: '第一次挂科',                                  kind: 'flag',  flag: 'fail_exam' },
  { id: 'probation',   icon: 'clock',   name: '学业预警',         desc: '收到一次学业预警通知',                        kind: 'flag',  flag: 'probation' },
  { id: 'survive',     icon: 'flame',   name: '悬崖勒马',         desc: '在收到学业预警后仍顺利毕业',                  kind: 'flag',  flag: 'survived_probation' },
  { id: 'expelled',    icon: 'lock',    name: '劝退通知',         desc: '因学业原因被学校劝退',                        kind: 'end',   end: 'expelled' },
  { id: 'dropout',     icon: 'compass', name: '另一种选择',       desc: '主动退学，走上另一条路',                      kind: 'end',   end: 'dropout' },

  /* —— 职业 —— */
  { id: 'intern_ok',   icon: 'tool',    name: '实习优秀',         desc: '生产实习获得优秀鉴定',                        kind: 'flag',  flag: 'intern_ok' },
  { id: 'aviation_job',icon: 'plane',   name: '航空报国',         desc: '签约航空国防单位',                            kind: 'flag',  flag: 'aviation_job' },
  { id: 'postgrad',    icon: 'wing',    name: '保研成功',         desc: '拿到推免资格',                                kind: 'flag',  flag: 'postgrad' },
  { id: 'network',     icon: 'globe',   name: '人脉',             desc: '实习期间结识三位以上工程师',                  kind: 'flag',  flag: 'network' },

  /* —— 结局收集 —— */
  { id: 'end_aviation',icon: 'plane',   name: '航空报国 · 结局',  desc: '达成「航空报国」结局',                        kind: 'end',   end: 'aviation' },
  { id: 'end_postgrad',icon: 'wing',    name: '凌云直上 · 结局',  desc: '达成「凌云直上」结局',                        kind: 'end',   end: 'postgrad' },
  { id: 'end_industry',icon: 'tool',    name: '脚踏实地 · 结局',  desc: '达成「脚踏实地」结局',                        kind: 'end',   end: 'industry' },
  { id: 'end_wander',  icon: 'compass', name: '另辟蹊径 · 结局',  desc: '达成「另辟蹊径」结局',                        kind: 'end',   end: 'wander' },
  { id: 'end_normal',  icon: 'star',    name: '平凡四年 · 结局',  desc: '达成「平凡四年」结局',                        kind: 'end',   end: 'normal' },
  { id: 'end_legend',  icon: 'flame',   name: '传奇 · 结局',      desc: '达成「传奇」结局',                            kind: 'end',   end: 'legend' },
  { id: 'end_entrepreneur', icon: 'coin', name: '创业 · 结局',    desc: '达成「创业」结局',                            kind: 'end',   end: 'entrepreneur' },
  { id: 'end_love',    icon: 'spark',   name: '双向奔赴 · 结局',  desc: '达成「双向奔赴」结局',                        kind: 'end',   end: 'love' },
  { id: 'end_exam',    icon: 'book',    name: '上岸 · 结局',      desc: '达成「上岸」结局',                            kind: 'end',   end: 'postgrad_exam' },

  /* —— 隐藏 —— */
  { id: 'luchao',      icon: 'medal',   name: '卢校长？',         desc: '以「卢超」之名入学并直接通关',                kind: 'flag',  flag: 'luchao', secret: true },
  { id: 'completionist', icon: 'star',  name: '全收集',           desc: '解锁其余所有成就',                            kind: 'count', count: 'all_others', value: 1, secret: true },
  { id: 'ten_lives',   icon: 'refresh', name: '十世轮回',         desc: '累计完成十次大学四年',                        kind: 'count', count: 'playthroughs', value: 10, secret: true }
];

/* ---------- 开场引言 ---------- */
const QUOTES = [
  '「日新自强，知行合一。」 —— 南昌航空大学校训',
  '1952 年，汉口。一群年轻人在抗美援朝的烽火里，画下了新中国最早的航空图纸。',
  '1954 年，他们带着图纸南下，把根扎进了赣江之畔的红土地。',
  '七十四年后，前湖的风依旧吹过图书馆的窗，而这一次，轮到你了。',
  '这里有 41 个航空、国防类相关专业，占招生专业总数的 76%。',
  '这里有 24 万名毕业生，其中 35% 走进了航空国防领域。',
  '全国航空航发主机厂 40% 的热加工技术骨干、80% 的无损检测技术骨干，从这里走出。',
  '「勤奋、文明、求实、创新。」 —— 昌航校风'
];

/* ==========================================================
   以下为「四年」玩法数据
   ========================================================== */

/* ---------- 彩蛋 ----------
   名字取作「卢超」（学校现任校长）时：专业锁定测控技术与仪器、
   天赋全为 SSR、选完直接通关，并解锁隐藏成就。
   ---------------------------------------------------------- */
const SECRET_NAME = '卢超';
const SECRET_MAJOR = 'ckyq';
const SECRET_ACHIEVEMENT = 'luchao';

/* ---------- 八个学期 ---------- */
const TERMS = [
  { label: '大一 · 上学期', year: '2026 秋', short: '大一上' },
  { label: '大一 · 下学期', year: '2027 春', short: '大一下' },
  { label: '大二 · 上学期', year: '2027 秋', short: '大二上' },
  { label: '大二 · 下学期', year: '2028 春', short: '大二下' },
  { label: '大三 · 上学期', year: '2028 秋', short: '大三上' },
  { label: '大三 · 下学期', year: '2029 春', short: '大三下' },
  { label: '大四 · 上学期', year: '2029 秋', short: '大四上' },
  { label: '大四 · 下学期', year: '2030 春', short: '大四下' }
];

/* ---------- 社团 ----------
   校团委「五彩社团」体系下的六类代表社团。
   加入后，第 1 / 3 / 5 学期会触发该社团的专属事件。
   ---------------------------------------------------------- */
const CLUBS = [
  {
    id: 'hangmo', name: '航模队', en: 'MODEL AIRCRAFT TEAM', icon: 'drone',
    tag: '火箭广场东侧 · 每年只招 30 人',
    desc: '从 KT 板到碳纤维，从手抛到自主飞行。摔机是这里的日常，飞起来是这里的信仰。',
    effects: { 求新: 1, 力行: 1 },
    events: [
      {
        icon: 'drone', title: '第一架飞机', tag: '航模队 · 第一次试飞',
        text: '队里发给你一堆 KT 板和一根热熔胶枪。老队员说：「不用图纸，先飞起来再说。」你在操场边上折腾了三个晚上，机身歪得像被门夹过。',
        choices: [
          { label: '按自己的思路改，赌一把', check: { stat: '求新', dc: 12 },
            success: { text: '第四晚，它真的离地了。歪歪扭扭地飞了 40 米，然后一头扎进灌木丛——但所有人都在鼓掌。', effects: { 求新: 2 }, record: '第一架自制航模首飞成功', flag: 'drone_fly' },
            fail: { text: '它刚出手就翻了个跟头。老队员拍拍你：「摔二十架之后，你就入门了。」', effects: { 力行: 1 }, record: '第一架航模首飞失败' } },
          { label: '老老实实照着队里的图纸做', check: { stat: '力行', dc: 10 },
            success: { text: '标准图纸、标准工艺，第一次试飞就平稳滑翔了 60 米。稳，但也只是稳。', effects: { 力行: 2 }, record: '按图纸完成首飞', flag: 'drone_fly' },
            fail: { text: '胶水涂多了，机翼重得像块砖。它飞了五米就掉了。', effects: { 力行: 1 } } }
        ]
      },
      {
        icon: 'wing', title: '社团文化艺术节', tag: '航模队 · 火箭广场',
        text: '第十八届社团文化艺术节，火箭广场上挤满了人。队里分到一个展位，队长把一架两米翼展的大家伙往桌上一放，说：「你来讲。」',
        choices: [
          { label: '讲空气动力学，讲升力系数', check: { stat: '笃学', dc: 12 },
            success: { text: '你从伯努利方程讲到翼型弯度，围过来的人越来越多，还有两个学弟当场填了报名表。', effects: { 笃学: 1, 求新: 1 }, record: '艺术节上讲了一场空气动力学' },
            fail: { text: '讲到一半自己绕进去了，人群散了一半。队长在旁边憋笑。', effects: { 求新: 1 } } },
          { label: '直接飞一场给他们看', check: { stat: '体质', dc: 11 },
            success: { text: '你顶着风把飞机抛了出去。它划出一道漂亮的弧线，稳稳落在跑道尽头，人群爆发出掌声。', effects: { 体质: 1, 求新: 1 }, record: '艺术节上完成一次完美飞行' },
            fail: { text: '风太大，飞机侧翻挂在了树上。你和三个队友爬上去才把它救下来。', effects: { 体质: 1 } } }
        ]
      },
      {
        icon: 'medal', title: '队长换届', tag: '航模队 · 大学生活动中心 111',
        text: '又是一年社长大会。老队长要毕业了，把钥匙和一本写满参数的笔记本放在桌上：「谁接？」会议室里安静了十秒。',
        choices: [
          { label: '我来', check: { stat: '守正', dc: 13 },
            success: { text: '你接过了钥匙。笔记本扉页上写着一行字：「别让它们摔在地上。」', effects: { 守正: 2, 求新: 1 }, record: '当选航模队队长', flag: 'club_leader' },
            fail: { text: '你张了张嘴，最终没站起来。钥匙给了别人，但你留下来做了技术组组长。', effects: { 力行: 1 } } },
          { label: '继续做技术，不当队长', effects: { 求新: 1, 力行: 1 }, result: '你把那本笔记本从头到尾抄了一遍。有些东西，不必拿钥匙也能守住。' }
        ]
      }
    ]
  },
  {
    id: 'shumo', name: '数学建模协会', en: 'MATHEMATICAL MODELING', icon: 'chart',
    tag: '逸夫楼 · 常年灯火通明',
    desc: '三天三夜，一篇论文，一个模型。这里的人把现实世界拆成变量和约束。',
    effects: { 笃学: 1, 求新: 1 },
    events: [
      {
        icon: 'chart', title: '第一次组队', tag: '数模协会 · 组队',
        text: '协会群里在刷「求队友」。你需要一个写作的、一个编程的。有人私聊你：「你负责建模，行吗？」',
        choices: [
          { label: '行，我来建模', check: { stat: '笃学', dc: 11 },
            success: { text: '你把题目里的「交通流量」抽象成了一个带约束的优化问题。队友看完说：「就按这个来。」', effects: { 笃学: 2 }, record: '第一次数模组队成功' },
            fail: { text: '你写了三页假设，队友问：「所以结论是什么？」你答不上来。', effects: { 笃学: 1 } } },
          { label: '我更想写代码', check: { stat: '力行', dc: 10 },
            success: { text: '你把队友的模型跑通了，还用遗传算法调了一遍参数，结果比预期好 8%。', effects: { 力行: 1, 求新: 1 } },
            fail: { text: '代码跑到一半内存溢出。你熬到凌晨四点，最后靠一段暴力枚举交了差。', effects: { 力行: 1 } } }
        ]
      },
      {
        icon: 'medal', title: '国赛三天', tag: '数模协会 · 全国大学生数学建模竞赛',
        text: '三天三夜。逸夫楼的空调嗡嗡响，桌上堆满了泡面盒。第二天凌晨，论文还差结果部分。',
        choices: [
          { label: '推翻重来，换一个模型', check: { stat: '求新', dc: 14 },
            success: { text: '新模型跑通了，结果干净得不像真的。第三天下午交稿时，三个人谁也没说话，只是笑了笑。', effects: { 求新: 2, 笃学: 1 }, record: '数模国赛推翻重来并获奖', flag: 'mcm_award' },
            fail: { text: '时间不够了，你们用了原来的模型草草收尾。省三，聊胜于无。', effects: { 笃学: 1 } } },
          { label: '守住现有结果，把论文写扎实', check: { stat: '笃学', dc: 12 },
            success: { text: '摘要改了七遍，图表重画了三遍。评委在评语里写：「写作规范，逻辑清晰。」省一等奖。', effects: { 笃学: 2 }, record: '数模国赛省一等奖', flag: 'mcm_award' },
            fail: { text: '最后一段结论和摘要对不上，你们交稿前十分钟才发现，已经来不及改了。', effects: { 笃学: 1 } } }
        ]
      },
      {
        icon: 'star', title: '带新人', tag: '数模协会 · 换届',
        text: '协会要换届了。会长问：「你要不要带一支队伍？」',
        choices: [
          { label: '带，把自己踩过的坑都告诉他们', check: { stat: '守正', dc: 12 },
            success: { text: '第二年，你带的队伍拿了国二。他们在致谢里写了你的名字。', effects: { 守正: 2, 笃学: 1 }, record: '带出第一支获奖队伍', flag: 'club_leader' },
            fail: { text: '队伍中途散了两个。你一个人补完了全部工作，累到发烧。', effects: { 笃学: 1, 体质: -1 } } },
          { label: '不了，我要专心准备考研', effects: { 笃学: 1 }, result: '你把整理了三年的模板和代码全部上传到了协会群文件夹。' }
        ]
      }
    ]
  },
  {
    id: 'robot', name: '机器人协会', en: 'ROBOTICS ASSOCIATION', icon: 'gear',
    tag: '工程训练中心 · 通宵是常态',
    desc: '舵机、电控、视觉。这里的人相信，能动起来的东西才叫作品。',
    effects: { 力行: 1, 求新: 1 },
    events: [
      {
        icon: 'gear', title: '舵机烧了', tag: '机器人协会 · 赛前一周',
        text: '省赛还有七天。调试到第三轮时，机械臂的舵机「啪」一声冒了烟。备件要三天才能到。',
        choices: [
          { label: '自己绕线圈，改驱动板', check: { stat: '力行', dc: 13 },
            success: { text: '你用旧舵机的壳和一块自制驱动板拼出了替代方案，扭矩还大了 15%。凌晨四点，机械臂重新抬了起来。', effects: { 力行: 2, 求新: 1 }, record: '自己修好了烧毁的舵机' },
            fail: { text: '改到第五版还是不动。最后借了隔壁组的备用件，勉强赶上比赛。', effects: { 力行: 1 } } },
          { label: '改方案，砍掉机械臂', check: { stat: '求新', dc: 11 },
            success: { text: '你把抓取改成了推铲，结构简单了一半，速度反而更快。省二等奖。', effects: { 求新: 2 }, record: '临阵改方案拿到省二' },
            fail: { text: '新方案没调完，比赛时机器人在场上原地打转。', effects: { 求新: 1 } } }
        ]
      },
      {
        icon: 'chip', title: '社团文化艺术节', tag: '机器人协会 · 火箭广场',
        text: '展位前围了一圈小朋友。会长说：「让它走个迷宫给大家看。」',
        choices: [
          { label: '现场调视觉识别', check: { stat: '求新', dc: 12 },
            success: { text: '在人群围观、光线乱变的情况下，它还是稳稳走完了整条赛道。有个高中生问你：「学长，我考你们学校要多少分？」', effects: { 求新: 1, 守正: 1 }, record: '艺术节现场演示成功' },
            fail: { text: '现场光线太杂，识别一直失败。你只好改成遥控演示。', effects: { 力行: 1 } } },
          { label: '直接遥控，稳妥', effects: { 力行: 1 }, result: '遥控演示很成功，但你在心里记下了：下次一定要让视觉方案更鲁棒。' }
        ]
      },
      {
        icon: 'tool', title: '实验室的钥匙', tag: '机器人协会 · 换届',
        text: '指导老师把实验室钥匙递过来：「以后晚上归你管。」',
        choices: [
          { label: '接过来', check: { stat: '守正', dc: 12 },
            success: { text: '你成了那个凌晨两点还在实验室、并且会记得关电闸的人。', effects: { 守正: 2, 力行: 1 }, record: '接管机器人实验室', flag: 'club_leader' },
            fail: { text: '你接过钥匙，却在第三周把烙铁落在桌上烧穿了一块桌布。老师收回了钥匙。', effects: { 力行: 1 } } },
          { label: '让给更合适的人', effects: { 求新: 1 }, result: '你把钥匙推了回去。有些责任，交给更合适的人也是一种负责。' }
        ]
      }
    ]
  },
  {
    id: 'zhiyuan', name: '青年志愿者协会', en: 'VOLUNTEERS', icon: 'leaf',
    tag: '大学生活动中心 · 红马甲',
    desc: '敬老院、社区、乡村小学、赛事现场。红马甲是校园里最常见也最不起眼的颜色。',
    effects: { 守正: 1, 体质: 1 },
    events: [
      {
        icon: 'leaf', title: '第一次下乡', tag: '青志协 · 暑期三下乡',
        text: '七月，赣北的一个村子。你们要在十天里做完支教、调研和一场文艺汇演。第一天晚上，停电了。',
        choices: [
          { label: '打着手电继续备课', check: { stat: '守正', dc: 11 },
            success: { text: '那十天里，你把六年级的数学课讲完了大半本教材。走的时候，有个小女孩塞给你一张画。', effects: { 守正: 2, 笃学: 1 }, record: '三下乡支教十天' },
            fail: { text: '条件比想象中艰苦，你连着两天没睡好，课上得磕磕绊绊。', effects: { 守正: 1 } } },
          { label: '去村里借发电机，把汇演办成', check: { stat: '体质', dc: 12 },
            success: { text: '你和三个队友推着板车走了两公里，借回来一台柴油发电机。那晚的汇演，全村人都来了。', effects: { 体质: 2, 守正: 1 }, record: '借发电机办成一场村晚' },
            fail: { text: '发电机没借到，汇演改在白天。太阳底下，孩子们唱得还是很响。', effects: { 体质: 1 } } }
        ]
      },
      {
        icon: 'pulse', title: '校园迷你马拉松', tag: '青志协 · 志愿服务',
        text: '「奋斗者 正青春」校园迷你马拉松，两千人参加。你被分在补给点，负责第 3 公里的水。',
        choices: [
          { label: '把每一杯水都递到手上', check: { stat: '体质', dc: 10 },
            success: { text: '三个小时，你弯了四百多次腰。最后一个跑过来的是个老师，他说：「小伙子，辛苦了。」', effects: { 体质: 1, 守正: 1 }, record: '马拉松补给点站了三小时' },
            fail: { text: '站到第二个小时，你的腰就直不起来了，只能换到桌后面。', effects: { 守正: 1 } } },
          { label: '自己也报个名跑', check: { stat: '体质', dc: 13 },
            success: { text: '你跑完了全程，还在终点帮人递水。腿抖了三天，但奖牌挂在了床头。', effects: { 体质: 2 }, record: '跑完校园迷你马拉松' },
            fail: { text: '跑到第五公里岔气，被收容车拉回了终点。奖牌还是拿到了。', effects: { 体质: 1 } } }
        ]
      },
      {
        icon: 'shield', title: '红马甲的交接', tag: '青志协 · 换届',
        text: '会长把一摞志愿服务时长登记表放在你面前：「下一届，你来带吧。」',
        choices: [
          { label: '我来带', check: { stat: '守正', dc: 12 },
            success: { text: '你成了那个在每次活动前半小时到、最后半小时走的人。', effects: { 守正: 2, 体质: 1 }, record: '接任青志协会长', flag: 'club_leader' },
            fail: { text: '你答应了，但学业压力太大，活动组织了三次就交给了副会长。', effects: { 守正: 1 } } },
          { label: '继续做普通志愿者', effects: { 守正: 1 }, result: '你退到队伍里，继续做那个准时出现、默默搬桌子的人。' }
        ]
      }
    ]
  },
  {
    id: 'shufa', name: '书法协会', en: 'CALLIGRAPHY SOCIETY', icon: 'draft',
    tag: '上海路校区图书馆 5 楼 · 墨香',
    desc: '一方砚台，一支笔。在这里，快是没有用的。',
    effects: { 笃学: 1, 守正: 1 },
    events: [
      {
        icon: 'draft', title: '第一张字', tag: '书法协会 · 临帖',
        text: '老师让你先临三个月的《多宝塔碑》。你写了二十张，没有一张满意。',
        choices: [
          { label: '老老实实临帖', check: { stat: '笃学', dc: 10 },
            success: { text: '第三个月，你写出了一个「永」字。老师看了很久，说：「有点意思了。」', effects: { 笃学: 2 }, record: '临帖三个月写成一个「永」字' },
            fail: { text: '写到第五十张，你发现自己连起笔的方向都是错的。', effects: { 笃学: 1 } } },
          { label: '不临了，自己写', check: { stat: '求新', dc: 13 },
            success: { text: '你写了一幅「日新自强，知行合一」。老师说：「不像颜真卿，但像你。」', effects: { 求新: 2 }, record: '写出属于自己的校训' },
            fail: { text: '写出来像小学生的作业。你默默把纸揉了，回去继续临帖。', effects: { 笃学: 1 } } }
        ]
      },
      {
        icon: 'book', title: '上海路的新场地', tag: '书法协会 · 焕新启幕',
        text: '协会在上海路校区图书馆 5 楼的新场地布置好了，要办一场启幕笔会。',
        choices: [
          { label: '写一幅大的，挂正墙', check: { stat: '守正', dc: 12 },
            success: { text: '你写了「航空报国」四个字，一米二见方。挂上去那天，很多人在前面拍照。', effects: { 守正: 2, 笃学: 1 }, record: '为书法协会新场地题字' },
            fail: { text: '最后一笔没稳住，「国」字的框歪了。你重新写了三遍，还是不满意。', effects: { 笃学: 1 } } },
          { label: '负责布展和讲解', effects: { 守正: 1, 笃学: 1 }, result: '你把每幅作品的来历都讲了一遍。来看展的人，比预想的多。' }
        ]
      },
      {
        icon: 'star', title: '换届', tag: '书法协会 · 社长大会',
        text: '社长要毕业了，协会需要一个人接下去。',
        choices: [
          { label: '接任社长', check: { stat: '守正', dc: 12 },
            success: { text: '你成了那个每周三下午准时开门、并且记得给每个人研墨的人。', effects: { 守正: 2 }, record: '接任书法协会社长', flag: 'club_leader' },
            fail: { text: '你接了下来，但社团招新只招到四个人。', effects: { 守正: 1 } } },
          { label: '继续当普通会员', effects: { 笃学: 1 }, result: '你还是每周三来，还是坐在靠窗那个位置。' }
        ]
      }
    ]
  },
  {
    id: 'bianlun', name: '辩论队', en: 'DEBATE TEAM', icon: 'scale',
    tag: '逸夫楼 · 赛前一周必通宵',
    desc: '把一个问题拆成四个层面，然后在四十分钟里说服所有人。',
    effects: { 笃学: 1, 守正: 1 },
    events: [
      {
        icon: 'scale', title: '第一场正式比赛', tag: '辩论队 · 校赛初赛',
        text: '辩题是「人工智能是否会取代工程师」。你抽到反方，赛前四十八小时，一辩稿还没定。',
        choices: [
          { label: '从工程伦理切入', check: { stat: '守正', dc: 12 },
            success: { text: '你问对方：「如果算法决定了机翼的厚度，谁在适航证上签字？」全场安静了两秒。最佳辩手。', effects: { 守正: 2, 笃学: 1 }, record: '校赛初赛最佳辩手' },
            fail: { text: '对方一句「那只是责任分配问题」就把你绕过去了。你们输了。', effects: { 笃学: 1 } } },
          { label: '从技术瓶颈切入', check: { stat: '笃学', dc: 13 },
            success: { text: '你列了三项至今无法被替代的工程判断能力，评委在点评时专门引用了你的论点。', effects: { 笃学: 2 }, record: '校赛以技术论据取胜' },
            fail: { text: '数据引错了年份，被对方当场指出。', effects: { 笃学: 1 } } }
        ]
      },
      {
        icon: 'bolt', title: '省赛决赛', tag: '辩论队 · 省赛',
        text: '决赛对手是省内老牌强队。自由辩论环节，对方连抛三个问题。',
        choices: [
          { label: '正面接，一个一个拆', check: { stat: '守正', dc: 14 },
            success: { text: '你把三个问题逐个拆开，最后一句「所以对方的论证，恰恰证明了我们的立场」落下时，计时器刚好归零。省一等奖。', effects: { 守正: 2, 笃学: 1 }, record: '省赛决赛拿下最佳辩手', flag: 'debate_award' },
            fail: { text: '第三个问题你没答上来，节奏被打乱了。省二等奖。', effects: { 笃学: 1 } } },
          { label: '反问，把战场拉回来', check: { stat: '求新', dc: 14 },
            success: { text: '你没有正面回答，而是反问了一个更尖锐的问题。对方愣了一下——那一秒，胜负已分。', effects: { 求新: 2 }, record: '省赛决赛以反问翻盘', flag: 'debate_award' },
            fail: { text: '评委认为你在回避问题。', effects: { 求新: 1 } } }
        ]
      },
      {
        icon: 'medal', title: '队长的位置', tag: '辩论队 · 换届',
        text: '老队长把队服和一本记满辩题库的册子交给你。',
        choices: [
          { label: '接过来', check: { stat: '守正', dc: 12 },
            success: { text: '你成了那个赛前一周把所有人关在逸夫楼里、并且最后一个走的人。', effects: { 守正: 2, 笃学: 1 }, record: '接任辩论队队长', flag: 'club_leader' },
            fail: { text: '你接了下来，但下一届校赛队伍止步八强。', effects: { 守正: 1 } } },
          { label: '专心打比赛就好', effects: { 笃学: 1 }, result: '你把辩题库抄了一遍，留给了下一届。' }
        ]
      }
    ]
  }
];

/* ---------- 主线事件 ----------
   term 为学期索引（0-7）。choices 里带 check 的会进行属性检定。
   ------------------------------------------------------------ */
const EVENTS = [
  {
    id: 'military', term: 0, icon: 'shield', title: '军训',
    tag: '九月 · 前湖校区田径场',
    text: '南昌的九月，太阳像一枚烧红的铆钉。田径场上站成方阵，教官的口令砸下来：「抬头，挺胸，收腹！」你的迷彩服已经湿透第三遍，塑胶跑道蒸出一股热烘烘的味道。',
    choices: [
      { label: '咬牙站到最后', check: { stat: '体质', dc: 11 },
        success: { text: '第二十天，你被选进护旗方阵。走过主席台那一刻，腿是酸的，腰是直的。', effects: { 体质: 2, 守正: 1 }, record: '军训入选护旗方阵', flag: 'military_ok' },
        fail: { text: '第十一天你中暑了，在医务室躺了一下午。回来之后，你学会了在太阳底下省着用力气。', effects: { 体质: 1 }, record: '军训中暑一次' } },
      { label: '找理由去医务室躲一躲', effects: { 求新: 1, 体质: -1 },
        result: '你在医务室遇到一位大四学长，聊了一下午。他说：「大学里最贵的不是时间，是注意力。」这句话你记了四年。' }
    ]
  },
  {
    id: 'elite', term: 0, icon: 'medal', title: '航空菁英特训班',
    tag: '十月 · 选拔通知',
    text: '辅导员在群里发了条通知：学校组建「航空菁英特训班」，从全校新生里挑 40 人，配导师、进实验室、有专项经费。报名表要填成绩排名和一段自述。',
    choices: [
      { label: '报名，赌一次', check: { stat: '笃学', dc: 12 },
        success: { text: '面试那天，你讲了十分钟自己对一架飞机为什么能飞的理解。三周后，名单公示，你的名字在第十七行。', effects: { 笃学: 2, 求新: 1 }, record: '入选航空菁英特训班', flag: 'elite' },
        fail: { text: '名单上没有你。你在公示栏前站了很久，然后把那张报名表复印了一份，贴在书桌上。', effects: { 笃学: 1 }, record: '特训班落选' } },
      { label: '不折腾，先把课上好', effects: { 笃学: 1, 体质: 1 },
        result: '你把省下来的时间用来跑图书馆和操场。一学期下来，绩点和体测成绩都很好看。' }
    ]
  },
  {
    id: 'clubs', term: 0, type: 'club', icon: 'star', title: '百团大战',
    tag: '十月 · 火箭广场',
    text: '火箭广场上摆满了帐篷，横幅从这头拉到那头。学长学姐举着喇叭喊：「航模队了解一下！」「数模协会，保研加分！」你手里被塞了七张报名表，最后只来得及认真看六家。'
  },
  {
    id: 'cet4', term: 1, icon: 'book', title: '第一次四级',
    tag: '六月 · 四级考场',
    text: '早上八点，逸夫楼门口排起长队。你摸了摸口袋里的准考证，耳机里还在放听力真题。',
    choices: [
      { label: '提前两个月就开始刷题', check: { stat: '笃学', dc: 11 },
        success: { text: '成绩出来那天，你在食堂门口刷到 528 分。你把截图发给了爸妈。', effects: { 笃学: 2 }, record: '四级 528 分通过', flag: 'cet4' },
        fail: { text: '差 12 分。你把错题本重新整理了一遍，决定下次一定。', effects: { 笃学: 1 }, record: '四级未过' } },
      { label: '裸考，凭感觉', check: { stat: '求新', dc: 15 },
        success: { text: '你靠着一部美剧和一点语感，居然考了 462 分。室友说你是运气好，你说是语感。', effects: { 求新: 2 }, record: '四级裸考飘过', flag: 'cet4' },
        fail: { text: '396 分。你盯着成绩单，第一次认真思考「语感」这个词。', effects: { 笃学: 1 }, record: '四级裸考失败' } }
    ]
  },
  {
    id: 'cet6', term: 2, icon: 'book', title: '六级与专业课',
    tag: '十二月 · 大二上学期',
    text: '大二的专业课一下子难了起来，六级也压在同一个学期。图书馆四楼靠窗的位置，从早到晚都是人。',
    choices: [
      { label: '先保专业课，六级缓一缓', check: { stat: '笃学', dc: 12 },
        success: { text: '期末成绩排在专业前 15%，六级虽然只考了 425，但压线过了。', effects: { 笃学: 2 }, record: '专业课前 15%，六级压线过', flag: 'cet6' },
        fail: { text: '两边都想抓，两边都没抓牢。专业课 78 分，六级没过。', effects: { 笃学: 1 }, record: '大二上两头都没抓好' } },
      { label: '两个都要，拼了', check: { stat: '体质', dc: 13 },
        success: { text: '你连续四十天六点起、十二点睡。期末专业课 91 分，六级 501 分。代价是瘦了六斤。', effects: { 笃学: 2, 体质: 1 }, record: '大二上双线作战全胜', flag: 'cet6' },
        fail: { text: '第十二天你就撑不住了，重感冒躺了一周。最后六级弃考，专业课勉强及格。', effects: { 笃学: 1, 体质: -1 }, record: '大二上透支身体' } }
    ]
  },
  {
    id: 'metalwork', term: 2, icon: 'tool', title: '金工实习',
    tag: '十一月 · 工程训练中心',
    text: '车、铣、刨、磨、焊、铸。每人一块 45 号钢，要做成一把小锤子。锉刀推出去的那一刻，师傅在旁边看着你的手。',
    choices: [
      { label: '一锉一锉地磨，追求公差', check: { stat: '力行', dc: 12 },
        success: { text: '锤头六个面，最平的误差 0.02 毫米。师傅拿游标卡尺量完，说了两个字：「不错。」', effects: { 力行: 2, 笃学: 1 }, record: '金工实习做出 0.02 毫米精度的锤子', flag: 'metalwork' },
        fail: { text: '你锉歪了一个面，最后靠打磨补救。锤子能用，但不好看。', effects: { 力行: 1 }, record: '金工实习勉强合格' } },
      { label: '偷懒用铣床一次成型', check: { stat: '求新', dc: 13 },
        success: { text: '你把工序重排了一遍，用铣床走刀代替手工锉削，省了三分之二的时间，精度还更好。', effects: { 求新: 2, 力行: 1 }, record: '金工实习用铣床走了捷径', flag: 'metalwork' },
        fail: { text: '铣床进给量给大了，工件表面拉出几道深痕。师傅让你重新领了一块料。', effects: { 力行: 1 } } }
    ]
  },
  {
    id: 'mcm', term: 3, icon: 'chart', title: '数学建模竞赛',
    tag: '五月 · 全国大学生数学建模竞赛校内选拔',
    text: '三天三夜，一篇论文。逸夫楼的空调嗡嗡响，桌上堆满了泡面盒。第二天凌晨，论文还差结果部分。',
    choices: [
      { label: '推翻重来，换一个模型', check: { stat: '求新', dc: 14 },
        success: { text: '新模型跑通了，结果干净得不像真的。交稿那一刻，三个人谁也没说话，只是笑了笑。', effects: { 求新: 2, 笃学: 1 }, record: '数模推翻重来并获奖', flag: 'mcm_award' },
        fail: { text: '时间不够，你们用了原来的模型草草收尾。省三，聊胜于无。', effects: { 笃学: 1 } } },
      { label: '守住现有结果，把论文写扎实', check: { stat: '笃学', dc: 12 },
        success: { text: '摘要改了七遍，图表重画了三遍。评委评语：「写作规范，逻辑清晰。」省一等奖。', effects: { 笃学: 2 }, record: '数模省一等奖', flag: 'mcm_award' },
        fail: { text: '最后一段结论和摘要对不上，交稿前十分钟才发现。', effects: { 笃学: 1 } } }
    ]
  },
  {
    id: 'direction', term: 3, icon: 'compass', title: '专业方向分流',
    tag: '四月 · 大二下学期',
    text: '学院开了分流宣讲会。同一个专业，不同的方向，通向完全不同的路。老师把表格发下来：「这个选择，会决定你未来十年做什么。」',
    choices: [
      { label: '选最难的那个方向', check: { stat: '笃学', dc: 13 },
        success: { text: '你选了全院公认最硬的方向。开学第一节课，老师说：「这个班，能坚持到毕业的不会超过七成。」', effects: { 笃学: 2, 求新: 1 }, record: '选择最硬的专业方向', flag: 'hard_track' },
        fail: { text: '你选了，但第一学期就跟得很吃力，期中之后不得不申请调整。', effects: { 笃学: 1 } } },
      { label: '选最贴近工程实践的方向', check: { stat: '力行', dc: 12 },
        success: { text: '你选了这个方向，第二个月就进了老师的横向项目组，开始接触真实的工程问题。', effects: { 力行: 2 }, record: '选择工程实践方向', flag: 'practice_track' },
        fail: { text: '方向选对了，但项目组面试没过，只能先在实验室打杂。', effects: { 力行: 1 } } }
    ]
  },
  {
    id: 'challenge', term: 4, icon: 'spark', title: '挑战杯',
    tag: '十月 · 大学生活动中心',
    text: '「挑战杯」省赛答辩在大学生活动中心。你的项目做了八个月，答辩 PPT 改到第 19 版。评委席上坐着三位教授和两位企业专家。',
    choices: [
      { label: '讲技术，把创新点说透', check: { stat: '求新', dc: 14 },
        success: { text: '你把核心算法讲了三分钟，一位评委追问了两个问题，你都答上了。省特等奖。', effects: { 求新: 2, 笃学: 1 }, record: '挑战杯省特等奖', flag: 'challenge_award' },
        fail: { text: '评委说：「创新点不够清晰。」省三等奖。', effects: { 求新: 1 } } },
      { label: '讲应用，讲它能解决什么问题', check: { stat: '守正', dc: 13 },
        success: { text: '你没有堆参数，而是讲了三个真实用户的故事。企业评委当场要了联系方式。', effects: { 守正: 2, 求新: 1 }, record: '挑战杯以应用价值打动评委', flag: 'challenge_award' },
        fail: { text: '故事讲得好，但技术细节被问住了。省二等奖。', effects: { 守正: 1 } } }
    ]
  },
  {
    id: 'core', term: 4, icon: 'book', title: '最难的一学期',
    tag: '十二月 · 大三上学期',
    text: '五门专业核心课，两门有期中考试，一门挂科率常年 30%。你已经连续三周没有在十二点前睡过觉。',
    choices: [
      { label: '死磕，一门都不放', check: { stat: '笃学', dc: 14 },
        success: { text: '五门课，四门 90 分以上。那个挂科率 30% 的课，你考了 88。', effects: { 笃学: 2, 守正: 1 }, record: '最难的学期全部 90+', flag: 'core_ok' },
        fail: { text: '你挂了一门。补考那天是寒假第一天，教室里坐了十几个人。', effects: { 笃学: 1 }, record: '大三上挂了一门' } },
      { label: '抓大放小，保住绩点就行', check: { stat: '求新', dc: 11 },
        success: { text: '你把精力集中在权重最高的三门课上，绩点稳住了，还用省下的时间做完了项目。', effects: { 笃学: 1, 求新: 1 }, record: '大三上战略性取舍' },
        fail: { text: '你低估了那门课的难度，最后还是没过。', effects: { 笃学: 1 } } }
    ]
  },
  {
    id: 'intern', term: 5, icon: 'tool', title: '生产实习',
    tag: '七月 · 航空工业某主机厂',
    text: '实习基地在厂区里。第一次走进总装车间，你看见一架还没装完的飞机停在工位上，蒙皮在灯下泛着光。带教师傅说：「从今天起，你看到的每一道工序，都有人在为它签字。」',
    choices: [
      { label: '跟着师傅，把每道工序都问一遍', check: { stat: '力行', dc: 12 },
        success: { text: '六周下来，你的笔记本记满了 87 页。师傅在实习鉴定上写：「肯问，肯钻。」', effects: { 力行: 2, 守正: 1 }, record: '生产实习获得优秀鉴定', flag: 'intern_ok' },
        fail: { text: '厂里规矩多，很多地方不让进。你只能在外围看，记了十几页。', effects: { 力行: 1 } } },
      { label: '抓住机会，多认识几个人', check: { stat: '守正', dc: 12 },
        success: { text: '你和三位工程师吃了六顿饭，其中一位后来成了你的入职推荐人。', effects: { 守正: 2 }, record: '实习期间结识三位工程师', flag: 'network' },
        fail: { text: '你加了微信，但没聊出什么。离开那天，只有师傅来送你。', effects: { 守正: 1 } } }
    ]
  },
  {
    id: 'future', term: 5, icon: 'compass', title: '保研、考研，还是工作',
    tag: '九月 · 大三下学期结束',
    text: '成绩排名出来了。你的名字在名单上，第 N 行。辅导员把你叫到办公室：「你自己怎么想？」',
    choices: [
      { label: '冲保研', check: { stat: '笃学', dc: 15 },
        success: { text: '夏令营拿了三个 offer，最后去了航空宇航方向最强的那个。', effects: { 笃学: 2, 求新: 1 }, record: '保研成功', flag: 'postgrad' },
        fail: { text: '差一名。你转头报了考研，把复习计划贴在了床头。', effects: { 笃学: 1 }, record: '保研差一名，转向考研' } },
      { label: '考研，考自己最想去的那个', check: { stat: '体质', dc: 13 },
        success: { text: '三百天，每天十二小时。考完那天你在考场外站了很久，然后给家里打了个电话。', effects: { 笃学: 1, 体质: 1 }, record: '坚持考完研', flag: 'postgrad_exam' },
        fail: { text: '十二月，你在考场上发烧到 38 度。写完最后一科，你趴在桌上睡了半小时。', effects: { 笃学: 1 }, record: '带病考完研' } },
      { label: '直接工作，早点上手', check: { stat: '力行', dc: 12 },
        success: { text: '你把简历改了十一版，投了四十家。第一个 offer 来自一家做航空零部件的企业。', effects: { 力行: 2, 守正: 1 }, record: '拿到第一份 offer', flag: 'job' },
        fail: { text: '秋招投了三十家，面试了六家，还没定下来。', effects: { 力行: 1 }, record: '秋招还在等消息' } },
      { label: '考公，回老家也挺好', check: { stat: '守正', dc: 12 },
        success: { text: '行测申论刷了两千题。出成绩那天，你进了面试，排名第三。', effects: { 守正: 2 }, record: '考公进入面试', flag: 'civil' },
        fail: { text: '差 3 分进面。你把书收进箱子，说明年再来。', effects: { 守正: 1 }, record: '考公差 3 分' } },
      { label: '跟朋友一起做点自己的东西', check: { stat: '求新', dc: 14 },
        success: { text: '你们三个人凑了两万块，在学校边上租了个工位。第一个客户是校门口的打印店老板。', effects: { 求新: 2, 守正: 1 }, record: '和朋友一起创业', flag: 'startup' },
        fail: { text: '做了三个月，产品没人用，钱也快花完了。散伙那天，你们在食堂吃了最后一顿。', effects: { 求新: 1 }, record: '第一次创业失败' } }
    ]
  },
  {
    id: 'thesis', term: 6, icon: 'draft', title: '毕业设计开题',
    tag: '十一月 · 大四上学期',
    text: '开题答辩。你的题目是导师给的，关于某个结构件的疲劳寿命预测。台下三位老师，第一位就问：「你这个方法的边界在哪？」',
    choices: [
      { label: '老实说，边界还没想清楚', check: { stat: '守正', dc: 12 },
        success: { text: '你没有硬撑。导师点了点头：「知道边界在哪，就是研究的开始。」开题通过。', effects: { 守正: 2, 笃学: 1 }, record: '开题答辩诚实过关', flag: 'thesis_ok' },
        fail: { text: '老师说：「回去再想想。」你重新开了两次题。', effects: { 守正: 1 } } },
      { label: '硬着头皮把边界讲圆', check: { stat: '求新', dc: 14 },
        success: { text: '你临场推了一个假设边界，逻辑居然自洽。老师互相看了一眼：「可以试试。」', effects: { 求新: 2 }, record: '开题答辩临场自洽', flag: 'thesis_ok' },
        fail: { text: '第二个问题你就答不上了。开题被要求重做。', effects: { 求新: 1 } } }
    ]
  },
  {
    id: 'autumn', term: 6, icon: 'ticket', title: '秋招',
    tag: '十月 · 大学生活动中心 · 双选会',
    text: '两百多家单位在大学生活动中心摆摊。你穿着借来的西装，手里攥着二十份简历。航空、航天、民航、电子、汽车——每一家都在招人，每一家都想要「有项目经验」的人。',
    choices: [
      { label: '只投航空国防单位', check: { stat: '守正', dc: 14 },
        success: { text: '第三轮面试结束，面试官说：「你的项目和我们的型号对得上。欢迎加入。」', effects: { 守正: 2, 力行: 1 }, record: '签约航空国防单位', flag: 'aviation_job' },
        fail: { text: '几家单位都止步二面。你把简历上的项目描述又改了一版。', effects: { 守正: 1 } } },
      { label: '广撒网，先拿到 offer 再说', check: { stat: '求新', dc: 11 },
        success: { text: '两周内你拿了四个 offer，最后挑了一个做无人机系统的。', effects: { 求新: 2 }, record: '手握四个 offer', flag: 'job' },
        fail: { text: '面试了十几家，offer 只有一个，还不是最想要的那个。', effects: { 求新: 1 } } }
    ]
  },
  {
    id: 'defense', term: 7, icon: 'medal', title: '毕业答辩',
    tag: '五月 · 大四下学期的最后一关',
    text: '答辩教室在三楼。你站在讲台上，投影仪打在你的论文首页。台下五位老师，其中一位是你的导师，他今天不说话。',
    choices: [
      { label: '把四年的东西讲清楚', check: { stat: '笃学', dc: 13 },
        success: { text: '二十分钟讲完，提问环节十五分钟。最后一位老师说：「做得不错。」导师在下面笑了一下。', effects: { 笃学: 2, 守正: 1 }, record: '毕业答辩优秀', flag: 'defense_ok' },
        fail: { text: '有一个数据被问住了。你如实回答「这个我没做」，老师让你补了一组实验。', effects: { 笃学: 1 }, record: '答辩后补了一组实验' } },
      { label: '讲这四年真正学到的东西', check: { stat: '守正', dc: 13 },
        success: { text: '你讲完论文，又用两分钟讲了自己为什么选这个题目。教室里安静了几秒，然后有人开始鼓掌。', effects: { 守正: 2, 求新: 1 }, record: '答辩讲出四年的意义', flag: 'defense_ok' },
        fail: { text: '你讲得有点跑题，老师提醒：「回到论文。」', effects: { 守正: 1 } } }
    ]
  }
];

/* ---------- 结局 ----------
   game.js 按优先级判定，命中第一个即为结局。
   ------------------------------------------------------------ */
const ENDINGS = [
  {
    id: 'luchao', title: '卢校长？', en: 'THE PRINCIPAL?',
    icon: 'medal', secret: true,
    text: '你走进办公室，桌上放着一份《南昌航空大学 2026 年本科招生专业目录》。窗外的火箭广场上，一群新生正围着帐篷喊「社团了解一下」。\n\n测控技术与仪器。无损检测。全国 80% 的无损检测技术骨干，都从这个专业走出去——而现在，这份名单上多了一个名字。\n\n「日新自强，知行合一。」你在文件上签下名字的时候，忽然想起这句话已经在这片土地上回响了七十四年。'
  },
  {
    id: 'aviation', title: '航空报国', en: 'FOR THE SKY',
    icon: 'plane',
    text: '入职通知书的落款，是一家你从小就在新闻里见过的单位。\n\n报到那天，你走进总装车间，看见一架还没装完的飞机停在工位上，蒙皮在灯下泛着光——和你大三实习那年看到的一模一样。\n\n带教师傅递给你一支笔：「从今天起，你签的每一个字，都有人要坐着它飞上天。」'
  },
  {
    id: 'postgrad', title: '凌云直上', en: 'HIGHER STILL',
    icon: 'wing',
    text: '研究生录取通知书到的那天，你回了一趟前湖校区。\n\n图书馆的灯还亮着，四楼靠窗那个位置坐着另一个正在刷题的人。你没有去打扰他，只是在门口站了一会儿，然后转身走了。\n\n风从赣江那边吹过来，带着水汽和一点点铁锈味。'
  },
  {
    id: 'industry', title: '脚踏实地', en: 'KEEP BUILDING',
    icon: 'tool',
    text: '你进了一家做航空零部件的企业，从工艺员做起。\n\n第一个月，你负责的是一条焊接产线的工艺文件。你想起大三那次金工实习，师傅说：「一道焊缝决定一架飞机的寿命。」\n\n现在这句话，你每天都要在工艺卡上写一遍。'
  },
  {
    id: 'wander', title: '另辟蹊径', en: 'ANOTHER ROAD',
    icon: 'compass',
    text: '你没有走航空这条路。\n\n有人说可惜，你笑了笑没解释。四年里你学到的，不只是怎么让一架飞机飞起来，还有怎么把一个问题拆开、怎么在一群人里把话说清楚、怎么在没人看着的时候把事做完。\n\n这些东西，在哪里都能用。'
  },
  {
    id: 'normal', title: '平凡四年', en: 'FOUR YEARS',
    icon: 'star',
    text: '没有什么惊天动地的故事。\n\n你上完了该上的课，通过了该通过的考试，认识了几个可以一辈子联系的朋友，在图书馆熬过几个通宵，在赣江边吹过几次风。\n\n毕业照拍完那天，你把学士帽抛上去，又接住。四年就这么过去了。'
  },
  {
    id: 'expelled', title: '劝退通知', en: 'ACADEMIC DISMISSAL',
    icon: 'lock', bad: true,
    text: '教务处的通知贴在学院公告栏上，你的名字在第十七行。\n\n「根据《南昌航空大学学生学籍管理规定》，该生累计不及格学分已达退学标准……」\n\n你站在公告栏前，看见有新生好奇地探头过来看。你想说点什么，最后什么都没说。\n\n离校那天，宿舍楼下的樟树正在落叶。你把行李箱拉出校门，回头看了一眼那栋住了两年的楼。'
  },
  {
    id: 'dropout', title: '另一种选择', en: 'THE OTHER ROAD',
    icon: 'compass',
    text: '你在退学申请书上签了字。\n\n辅导员劝了你三次，父母在电话里沉默了很久。你说：「我不是念不下去，我是想清楚了。」\n\n后来你去了一家做无人机的创业公司。老板比你大三岁，也是退学的。他看了看你的作品集，说：「明天来上班。」\n\n学历这条路你走了一半，但另一条路，你自己铺完了。'
  },
  {
    id: 'legend', title: '传奇', en: 'THE LEGEND',
    icon: 'flame',
    text: '毕业典礼上，校长念到你的名字时停顿了一下。\n\n四年里，你拿过能拿的所有奖，做过能做的所有项目，带过一届又一届学弟学妹。学院走廊的荣誉墙上，你的照片从大三那年就没摘下来过。\n\n散场的时候，一个陌生的新生跑过来问：「学长，他们说你是传奇，是真的吗？」\n\n你笑了笑：「我只是每天比别人多待两个小时。」'
  },
  {
    id: 'entrepreneur', title: '创业', en: 'STARTUP',
    icon: 'coin',
    text: '大四那年，你和两个队友在校外租了一间三十平米的办公室。\n\n第一年，你们做了三个产品，死了两个。第二年，第三个活了下来。\n\n签第一份正式合同那天，你在合同上写下公司名字，忽然想起大三那年挑战杯答辩，评委说：「你这个想法，商业上不太行。」\n\n你把合同折好，放进口袋。'
  },
  {
    id: 'love', title: '双向奔赴', en: 'TWO-WAY STREET',
    icon: 'spark',
    text: '毕业照那天，你们站在图书馆前的台阶上。\n\n四年里，你们一起占过座，一起熬过夜，一起在赣江边走过很多次。你去实习的那三个月，她每周给你寄一次食堂三楼的辣酱。\n\n拍完照，她忽然说：「我签的单位在南昌。」\n\n你愣了一下，然后笑了：「我知道。我也是。」'
  },
  {
    id: 'postgrad_exam', title: '上岸', en: 'MADE IT',
    icon: 'book',
    text: '出分那天，你刷新了十七次页面。\n\n三百天，每天十二个小时，图书馆四楼靠窗第三个位置，从春天坐到冬天。有段时间你觉得自己撑不下去了，就在走廊上站一会儿，再回去坐下。\n\n复试通过的消息是在食堂门口收到的。你端着餐盘站在那里，忽然不知道该往哪儿走。'
  },
  {
    id: 'research', title: '科研之路', en: 'INTO THE LAB',
    icon: 'flask',
    text: '你留在了实验室。\n\n导师说：「做科研是一件很寂寞的事，你要想清楚。」你想了三天，然后回去了。\n\n第一篇论文被拒了四次，第五次录用。审稿意见里有一句：「This work is solid.」你把这句话截图存了下来。\n\n深夜的实验室只有仪器的风扇在响，你忽然觉得，这就是你想要的生活。'
  },
  {
    id: 'civil_servant', title: '体制内', en: 'IN THE SYSTEM',
    icon: 'shield',
    text: '省考的录取名单出来那天，你在名单上找了三遍自己的名字。\n\n入职后被分到了一个和航空产业相关的处室。第一年，你写了两百多份材料，跑了三十多家企业。\n\n有一次去一家航空零部件厂调研，厂长听说你是昌航毕业的，握着你的手说：「我们厂一半的技术员都是你们学校的。」\n\n你忽然觉得，这条路也没走错。'
  },
  {
    id: 'abroad', title: '越洋', en: 'ACROSS THE OCEAN',
    icon: 'globe',
    text: 'offer 是在凌晨三点收到的。\n\n你盯着屏幕上那行「We are pleased to offer you admission」，看了很久，然后把室友摇醒了。\n\n机场送别那天，父母站在安检口外面。你回头挥了挥手，然后走进了那条长长的通道。\n\n飞机起飞的时候，你从舷窗往下看，赣江在阳光下是一条亮线。'
  }
];
