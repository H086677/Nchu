/* ==========================================================
   赣江之畔启航指南 · 剧情层
   在 data.js 之后加载，把主线事件、社团、随机事件追加进全局池。

   结构约定（与 data.js 一致）：
     EVENTS   —— 主线事件，按 term(0-7) 分布，buildTermQueue 全量取用
     CLUBS    —— 社团，events[0..2] 分别在第 1/3/5 学期触发
     RANDOM_EVENTS —— 随机事件池，每学期按概率抽 0-1 个插入队列

   危险度 risk：
     负面选项会累加 risk（0-100）。
     每学期结束时：risk >= 60 触发「学业预警」（flag: probation，risk 回退 25）；
     risk >= 100 直接触发「劝退」结局。
   ========================================================== */
'use strict';

/* ---------- 主线事件 · 扩充 ---------- */
EVENTS.push(

  /* ========== 大一上（term 0） ========== */
  {
    id: 'roommate', term: 0, icon: 'globe', title: '四个人的宿舍',
    tag: '九月 · 6 栋 407',
    text: '四个人，四张床，一台只能制冷的空调。江西本地的室友带了一箱南丰蜜桔，东北的室友带了半只熏鸡，还有一个从新疆来的，行李箱里塞满了馕。第一晚聊到两点半，谁也不知道以后会不会成为朋友。',
    choices: [
      { label: '主动张罗一次宿舍聚餐', check: { stat: '品行', dc: 10 },
        success: { text: '你带他们去了后街那家炒粉店。四个人吃到打嗝，回来路上把彼此的高中吹了一遍。这顿饭后，407 成了一家人。', effects: { 品行: 1, 体能: 1 }, record: '宿舍第一次聚餐成功', flag: 'roommate_ok' },
        fail: { text: '有人嫌贵，有人不想去。最后只有三个人去了，剩下一份炒粉打包回了宿舍。', effects: { 品行: 1 } } },
      { label: '各过各的，互不打扰', effects: { 学习: 1, 品行: -1 },
        result: '一学期下来，你和室友说过的话加起来不超过一百句。安静，但有点冷。' }
    ]
  },
  {
    id: 'dorm_lie', term: 0, icon: 'moon', title: '宿舍躺平',
    tag: '十一月 · 早八的闹钟响了第四遍',
    text: '闹钟从六点五十响到七点二十。窗帘拉着，室友的被子还鼓着。手机里是昨晚没刷完的短视频，桌上摊着上周的作业。窗外天已经亮了，但你忽然觉得，起不起来好像也没什么区别。',
    choices: [
      { label: '再睡一会儿，反正这节课不点名', effects: { 体能: 1, 学习: -2 }, risk: 18,
        result: '你睡到了十一点半。醒来的时候宿舍空了，桌上留着一张字条：「老师点名了，替你说肚子疼。」',
        record: '第一次翘课睡到中午' },
      { label: '爬起来，洗把脸去教室', check: { stat: '体能', dc: 10 },
        success: { text: '你冲了个冷水脸，跑到教室时还有三分钟上课。老师抬头看了你一眼，点了下头。', effects: { 体能: 1, 学习: 1 }, record: '战胜了被窝', risk: -6 },
        fail: { text: '你爬起来了，但磨蹭到教室时已经八点半。前门锁了，你从后门溜进去，坐在最后一排。', effects: { 学习: 1 }, risk: 5 } },
      { label: '干脆办个假条，休息一天', effects: { 体能: 2, 学习: -1 }, risk: 10,
        result: '你在医务室开了一张「上呼吸道感染」。这一天你睡了三觉，晚上精神特别好，把攒了两周的剧看完了。' }
    ]
  },

  /* ========== 大一下（term 1） ========== */
  {
    id: 'skip_class', term: 1, icon: 'clock', title: '翘课的代价',
    tag: '四月 · 学期第十周',
    text: '这门课的考勤占 30%。你已经缺了四次，任课老师在群里发了一条消息：「本周五交课程设计初稿，未交者按零分计。」你打开课表，发现这门课的设计题你连题目都没看过。',
    choices: [
      { label: '找同学借资料，三天通宵补完', check: { stat: '学习', dc: 13 },
        success: { text: '三天，你睡了不到十个小时。交稿那天，老师翻了两页，说：「看得出来是自己做的。」', effects: { 学习: 2, 体能: -1 }, record: '三天补完课程设计', risk: -12 },
        fail: { text: '你拼凑了一份，被老师一眼看穿。初稿打回，要求重做。', effects: { 学习: 1, 体能: -1 }, risk: 12 } },
      { label: '硬着头皮交个半成品', effects: { 学习: 1 }, risk: 20,
        result: '你交了一份连自己都不想看的稿子。老师没说什么，只是把你的名字记在了名单上。' },
      { label: '去找老师坦白', check: { stat: '品行', dc: 12 },
        success: { text: '你去了办公室，把事情原原本本说了一遍。老师沉默了一会儿：「给你一周，重做。」', effects: { 品行: 2, 学习: 1 }, record: '向老师坦白并争取到机会', risk: -18 },
        fail: { text: '老师听完，只说了两个字：「早干什么去了？」你的名字还是留在了名单上。', effects: { 品行: 1 }, risk: 15 } }
    ]
  },
  {
    id: 'cet4_retry', term: 1, icon: 'book', title: '六级报名',
    tag: '三月 · 教务系统开放报名',
    text: '四级成绩出来了。班群里一半人在庆祝，一半人在查下一次报名时间。你看着自己的分数，想了想接下来这一学期还要做什么。',
    choices: [
      { label: '直接报六级，往前赶', check: { stat: '学习', dc: 12 },
        success: { text: '你从三月背单词背到六月。六级考了 486，虽然不高，但省下了一整个大三。', effects: { 学习: 2 }, record: '六级一次通过', flag: 'cet6' },
        fail: { text: '六级 392。你安慰自己：反正还有机会，大二再战。', effects: { 学习: 1 }, record: '六级首次未过' } },
      { label: '先把四级刷个高分', check: { stat: '创意', dc: 11 },
        success: { text: '你把真题刷了三遍，四级刷到了 573。辅导员在年级群里点名表扬了你。', effects: { 学习: 1, 创意: 1 }, record: '四级刷到 573 分', flag: 'cet4_high' },
        fail: { text: '分数几乎没变。你意识到自己可能只是不想面对六级。', effects: { 学习: 1 } } }
    ]
  },
  {
    id: 'summer_first', term: 1, icon: 'sun', title: '第一个暑假',
    tag: '七月 · 学期结束',
    text: '大一结束。同学群里有人晒出实习 offer，有人报了考研班，有人回家躺了两个月。你的暑假还没安排。',
    choices: [
      { label: '留在学校，进老师的实验室打杂', check: { stat: '动手', dc: 11 },
        success: { text: '你在实验室洗了三个星期的烧杯，然后被允许碰设备。老师后来说：「这批学生里，就你手最稳。」', effects: { 动手: 2, 学习: 1 }, record: '大一暑假进实验室', flag: 'lab_early' },
        fail: { text: '实验室没位置，你被安排去整理资料。一个月下来，你摸清了整个学院的课题方向。', effects: { 学习: 1 } } },
      { label: '回家，好好休息', effects: { 体能: 2 },
        result: '你在家睡了一个月，看了三十部剧，胖了八斤。开学回来，室友说你气色好了很多。' },
      { label: '去打工，挣点生活费', check: { stat: '体能', dc: 11 },
        success: { text: '你在一家快递分拣中心干了四十天。开学时你晒黑了，但钱包里有了第一笔自己挣的钱。', effects: { 体能: 2, 品行: 1 }, record: '暑假打工挣到第一笔钱', flag: 'worked' },
        fail: { text: '干了十二天你就撑不住了，结了工资回家。但你知道了一件事：钱不好挣。', effects: { 体能: 1, 品行: 1 } } }
    ]
  },

  /* ========== 大二上（term 2） ========== */
  {
    id: 'game_addict', term: 2, icon: 'monitor', title: '通宵的排位',
    tag: '十一月 · 凌晨三点',
    text: '宿舍熄灯了，四个人的屏幕还亮着。这已经是连续第五个通宵。明天有一门期中考试，你连课本都没打开过。耳机里队友在喊「再来一局」，你手指悬在键盘上。',
    choices: [
      { label: '关掉电脑，去楼道背两小时', check: { stat: '体能', dc: 12 },
        success: { text: '你在楼道里蹲了两小时，冻得手都僵了，但那门课考了 82。室友第二天挂科了。', effects: { 学习: 2, 体能: 1 }, record: '通宵后戒断，期中 82 分', risk: -15 },
        fail: { text: '你关了电脑，但翻了两页就趴在桌上睡着了。期中 61，勉强及格。', effects: { 学习: 1 }, risk: 6 } },
      { label: '再打一局，就一局', effects: { 创意: 1, 学习: -2 }, risk: 22,
        result: '那一局打到了早上六点。期中考试你交了白卷，老师在卷子上画了个圈。',
        record: '通宵打游戏错过期中' },
      { label: '拉着室友一起戒断', check: { stat: '品行', dc: 13 },
        success: { text: '你把路由器拔了，说：「这个月谁再通宵，请全宿舍吃一顿。」三个人骂了你一晚上，但一个月后，他们的绩点都涨了。', effects: { 品行: 2, 学习: 1 }, record: '带头戒断通宵', flag: 'room_leader', risk: -20 },
        fail: { text: '你把路由器拔了，室友半夜又插了回去，还顺手改了密码。', effects: { 品行: 1 }, risk: 8 } }
    ]
  },
  {
    id: 'parttime', term: 2, icon: 'coin', title: '兼职的机会',
    tag: '十月 · 校园招聘墙',
    text: '宿舍楼下贴了一张招聘启事：某培训机构招周末助教，一天 200。你算了算，一个月能挣 1600，够两个月生活费。但周末本来是要去实验室的。',
    choices: [
      { label: '去，钱要紧', check: { stat: '体能', dc: 11 },
        success: { text: '你教了三个月初三数学。钱挣到了，还练出了一手在三十个人面前讲两小时不卡壳的本事。', effects: { 品行: 1, 体能: 1 }, record: '兼职助教三个月', flag: 'parttime' },
        fail: { text: '干了三周，你发现自己讲不明白二次函数，被家长投诉了一次。结算工资那天你有点想哭。', effects: { 体能: 1 }, risk: 8 } },
      { label: '不去，把时间留给实验室', check: { stat: '动手', dc: 12 },
        success: { text: '那个学期你在实验室待了四百个小时。老师把一个横向项目的子课题交给了你。', effects: { 动手: 2, 创意: 1 }, record: '放弃兼职，专注实验室', flag: 'lab_focus' },
        fail: { text: '你留在了实验室，但大部分时间都在等设备。一个学期下来，你只是学会了怎么用咖啡机。', effects: { 动手: 1 } } }
    ]
  },

  /* ========== 大二下（term 3） ========== */
  {
    id: 'love_start', term: 3, icon: 'spark', title: '图书馆四楼',
    tag: '五月 · 图书馆四楼靠窗',
    text: '那个人连续三周坐在你斜对面。你们之间隔着一张桌子和两本《高等数学》。今天她/他起身去接水，把一本书落在了桌上，书页里夹着一张写了字的便签。',
    choices: [
      { label: '把书还回去，顺便聊两句', check: { stat: '品行', dc: 12 },
        success: { text: '你把书递过去，说：「你的书。」她/他愣了一下，然后笑了。两周后，你们一起去了赣江边看日落。', effects: { 品行: 1, 体能: 1 }, record: '在图书馆遇见了那个人', flag: 'love' },
        fail: { text: '你把书还了回去，说了句「你的书」就走了。第二天那个位置空了。', effects: { 品行: 1 } } },
      { label: '假装没看见，继续做题', effects: { 学习: 2 },
        result: '你那天做完了三套真题。书后来被管理员收走了。你偶尔还会想，那张便签上写的是什么。' }
    ]
  },
  {
    id: 'lab_join', term: 3, icon: 'flask', title: '进实验室',
    tag: '四月 · 导师办公室',
    text: '专业课老师问你：「有没有兴趣进实验室？我们组在做某型号的结构疲劳分析，缺人手。」你知道这意味着什么：没有周末，没有寒暑假，但会有真项目。',
    choices: [
      { label: '进，我要做真东西', check: { stat: '动手', dc: 13 },
        success: { text: '你从拧螺丝开始，半年后独立负责了一个试验件。老师说你「有工程直觉」。', effects: { 动手: 2, 创意: 1 }, record: '进入课题组独立负责试验件', flag: 'lab_member' },
        fail: { text: '你进了组，但前三个月都在整理数据。你开始怀疑自己是不是不适合做研究。', effects: { 动手: 1 } } },
      { label: '先观望，把绩点稳住', check: { stat: '学习', dc: 12 },
        success: { text: '你把绩点刷到了专业前 10%。第二年，你靠这个成绩拿到了更好的机会。', effects: { 学习: 2 }, record: '绩点进入专业前 10%', flag: 'gpa_top' },
        fail: { text: '绩点没刷上去，实验室的位置也没了。你两头空了一个学期。', effects: { 学习: 1 }, risk: 8 } }
    ]
  },

  /* ========== 大三上（term 4） ========== */
  {
    id: 'probation', term: 4, icon: 'clock', title: '学业预警通知',
    tag: '十一月 · 学院办公室',
    text: '辅导员把你叫到办公室，桌上摊着一张表：「本学期你已经有五门课不及格，累计学分不够。学院要给你发学业预警，家长那边需要签字。」窗外有人在打球，声音很远。',
    choices: [
      { label: '认下来，重新排一遍时间', check: { stat: '品行', dc: 12 },
        success: { text: '你把课表重新排了一遍，退掉了两个社团，每天六点半起。期末四门补考全过。', effects: { 品行: 2, 学习: 2 }, record: '学业预警后翻盘', flag: 'survived_probation', risk: -40 },
        fail: { text: '你答应了，但坚持了两周就回到了原来的节奏。预警通知单寄回了家。', effects: { 学习: 1 }, risk: 20 } },
      { label: '找老师求情，能不能宽限', check: { stat: '创意', dc: 15 },
        success: { text: '你说服了两位任课老师给你补交作业的机会，勉强把学分补了回来。', effects: { 创意: 2 }, record: '求情争取到补交机会', risk: -20 },
        fail: { text: '老师说：「规定就是规定。」你从办公室出来，在楼梯口坐了很久。', effects: { 品行: 1 }, risk: 25 } },
      { label: '无所谓了，反正也追不上', effects: { 创意: -1 }, risk: 45,
        result: '你把预警通知单塞进抽屉，回去继续打游戏。抽屉里还有上学期的那张。' }
    ]
  },
  {
    id: 'electronic', term: 4, icon: 'chip', title: '电子设计竞赛',
    tag: '八月 · 工程训练中心 · 四天三夜',
    text: '全国大学生电子设计竞赛，四天三夜，封闭式。题目发下来那一刻，整个赛场只剩下键盘声和电烙铁的味道。你们组选了控制类题目。',
    choices: [
      { label: '按部就班，先跑通基本功能', check: { stat: '动手', dc: 13 },
        success: { text: '第四天凌晨，系统第一次完整跑通。你们把电路板擦了又擦，交上去的时候手是抖的。省一等奖。', effects: { 动手: 2, 学习: 1 }, record: '电子设计竞赛省一等奖', flag: 'electronic_award' },
        fail: { text: '最后一小时还在调参数，封装时把电源接反了。测试直接烧了一块板子。', effects: { 动手: 1 }, risk: 5 } },
      { label: '冒险上一个更聪明的方案', check: { stat: '创意', dc: 15 },
        success: { text: '你用了一个别人没敢用的算法，测试时指标远超预期。评委在现场多看了你们五分钟。国家二等奖。', effects: { 创意: 2, 动手: 1 }, record: '电子设计竞赛国家二等奖', flag: 'electronic_award' },
        fail: { text: '新方案在第三天崩了，来不及退回原方案。你们交了半成品。', effects: { 创意: 1 } } }
    ]
  },

  /* ========== 大三下（term 5） ========== */
  {
    id: 'breakup', term: 5, icon: 'leaf', title: '六月的雨',
    tag: '六月 · 前湖校区北门',
    text: '你们在奶茶店门口站了很久。她说：「我签了深圳的单位，你还要读三年。」雨下起来了，屋檐下的人都在等。你知道这不是谁对谁错的问题。',
    choices: [
      { label: '试着异地，先不分开', check: { stat: '品行', dc: 14 },
        success: { text: '你们约定每周视频三次。一年后，你们还在一起，虽然吵架的次数变多了。', effects: { 品行: 2 }, record: '决定异地恋', flag: 'long_distance' },
        fail: { text: '第三个月，消息的回复越来越慢。最后一条是「我们都需要往前走了」。', effects: { 品行: 1 }, record: '异地恋失败', flag: 'heartbreak' } },
      { label: '好好告别', check: { stat: '创意', dc: 11 },
        success: { text: '你们把四年一起去过的地方又走了一遍。分开的时候谁都没哭，只是抱了一下。', effects: { 品行: 1, 创意: 1 }, record: '和平分手', flag: 'heartbreak' },
        fail: { text: '你想好好告别，但说出口的话全变成了指责。雨停的时候，人已经走了。', effects: { 创意: 1 }, record: '分手不太体面', flag: 'heartbreak' } },
      { label: '一直没敢开口', effects: { 学习: 1 },
        result: '你们谁都没有提。她走的那天，你去了火车站，站在很远的地方看着。' }
    ]
  },
  {
    id: 'paper', term: 5, icon: 'draft', title: '第一篇论文',
    tag: '五月 · 实验室 · 凌晨两点',
    text: '导师把你叫过去：「这组数据很有意思，可以写一篇。」你从来没写过论文。参考文献有四十多篇，其中三十篇是英文的。',
    choices: [
      { label: '一篇一篇啃，自己写', check: { stat: '学习', dc: 14 },
        success: { text: '你花了两个月，改了十一稿。投稿三个月后收到录用通知，是 EI 期刊。你把邮件截图发给了爸妈。', effects: { 学习: 2, 创意: 1 }, record: '发表第一篇 EI 论文', flag: 'paper' },
        fail: { text: '写了四个月，被拒了两次。导师说：「没关系，再改改，投下一家。」', effects: { 学习: 1 } } },
      { label: '让师兄带一带', check: { stat: '品行', dc: 11 },
        success: { text: '师兄帮你梳理了框架，你负责数据和分析。最后你是第二作者，但学到了整套方法。', effects: { 学习: 1, 品行: 1 }, record: '与师兄合作发表论文', flag: 'paper' },
        fail: { text: '师兄自己也很忙，最后只是挂了个名。论文的活儿还是你自己干完的。', effects: { 学习: 1 } } }
    ]
  },

  /* ========== 大四上（term 6） ========== */
  {
    id: 'exam_sprint', term: 6, icon: 'book', title: '考研冲刺',
    tag: '十二月 · 图书馆四楼',
    text: '距离考试还有二十天。图书馆四楼的位置从早上六点就满了，走廊里全是背政治的人。你的专业课还有两章没看完，数学真题只做了十年。',
    choices: [
      { label: '每天十四小时，硬顶', check: { stat: '体能', dc: 14 },
        success: { text: '二十天后你走进考场，手是稳的。出分那天，你比目标院校高了 27 分。', effects: { 学习: 2, 体能: 1 }, record: '考研高分上岸', flag: 'postgrad_exam', risk: -10 },
        fail: { text: '考前一周你发烧了，在床上躺了三天。进考场时还在咳嗽。', effects: { 学习: 1, 体能: -1 }, record: '带病考研' } },
      { label: '保节奏，稳住状态', check: { stat: '学习', dc: 12 },
        success: { text: '你没有熬夜，每天十小时，睡够七个小时。考场上你比谁都清醒。', effects: { 学习: 2, 体能: 1 }, record: '稳节奏考研上岸', flag: 'postgrad_exam' },
        fail: { text: '节奏是稳的，但进度落后太多。最后两门考得很勉强。', effects: { 学习: 1 } } }
    ]
  },
  {
    id: 'abroad_apply', term: 6, icon: 'globe', title: '要不要出国',
    tag: '十月 · 国际交流处',
    text: '学校有个交换项目，也有留学中介在校园里发传单。你的成绩够得着，但学费是一笔不小的数字。家里在电话里说：「你自己决定，我们支持你。」',
    choices: [
      { label: '申请，赌一个更大的世界', check: { stat: '学习', dc: 14 },
        success: { text: '你考了雅思 7.0，拿到了三所学校的 offer。最后选了一所有航空背景的。', effects: { 学习: 2, 创意: 1 }, record: '拿到海外 offer', flag: 'abroad' },
        fail: { text: '语言成绩差了一点，申请季过去了。你把资料收进抽屉，决定先工作两年再说。', effects: { 学习: 1 } } },
      { label: '不出国，把国内的路走扎实', check: { stat: '动手', dc: 12 },
        success: { text: '你把精力全投在秋招和项目上。十二月，你签了一家做航空电子的单位。', effects: { 动手: 2 }, record: '专注国内就业并签约', flag: 'job' },
        fail: { text: '两边都没抓住。offer 还没定，出国的窗口也关了。', effects: { 动手: 1 }, risk: 10 } }
    ]
  },

  /* ========== 大四下（term 7） ========== */
  {
    id: 'farewell', term: 7, icon: 'clock', title: '最后一次班会',
    tag: '六月 · 教学楼 302',
    text: '辅导员开了最后一次班会，讲的是离校手续。讲完她站在讲台上，忽然说：「我知道你们很多人这四年都在骂学校。但以后有人问起，希望你们能说一句好话。」教室里安静了几秒，然后有人笑了。',
    choices: [
      { label: '站起来说两句', check: { stat: '品行', dc: 11 },
        success: { text: '你说：「这四年我过得挺好，谢谢老师。」然后你听见有人开始鼓掌，掌声持续了很久。', effects: { 品行: 2, 创意: 1 }, record: '在最后一次班会上发言' },
        fail: { text: '你站起来，张了张嘴，最后只说了句「谢谢大家」，坐下了。但你还是说了。', effects: { 品行: 1 } } },
      { label: '安静地坐着，把这一刻记住', effects: { 学习: 1, 体能: 1 },
        result: '你把教室里每个人的脸都看了一遍。有些人，这辈子可能不会再见了。' }
    ]
  },
  {
    id: 'graduation_trip', term: 7, icon: 'plane', title: '毕业旅行',
    tag: '六月 · 出发前一周',
    text: '宿舍四个人商量毕业旅行。有人想去海边，有人想去爬山，预算从八百到三千不等。这是你们最后一次一起出门。',
    choices: [
      { label: '去，钱不够就打工凑', check: { stat: '体能', dc: 11 },
        success: { text: '你们坐了一夜的硬座去了厦门。在海边，四个人脱了鞋站在水里，谁都没说话。照片里每个人都在笑。', effects: { 体能: 2, 品行: 1 }, record: '和室友完成了毕业旅行', flag: 'grad_trip' },
        fail: { text: '行程安排得太满，第三天就有人在酒店躺了一天。但回来之后，你们还是觉得值。', effects: { 体能: 1 } } },
      { label: '不去了，省点钱', effects: { 品行: 1 },
        result: '你在宿舍收拾东西，室友出发那天你送到校门口。他们回来给你带了一块石头。' }
    ]
  },
  {
    id: 'dropout_choice', term: 7, icon: 'compass', title: '一个念头',
    tag: '四月 · 深夜的宿舍',
    text: '论文写不下去，工作也还没定。你刷到一个视频：有人大四退学去做自己的事，现在做得很好。你忽然想，如果现在不读了，会怎么样。',
    choices: [
      { label: '只是想想，明天继续写论文', check: { stat: '品行', dc: 11 },
        success: { text: '第二天你六点起来，把论文的最后两章写完了。那个念头像一阵风，过去了。', effects: { 品行: 2, 学习: 1 }, record: '熬过了毕业前的动摇' },
        fail: { text: '你连着三天没打开文档。第四天，导师打电话来问进度。', effects: { 学习: 1 }, risk: 10 } },
      { label: '认真考虑，去做自己的事', check: { stat: '创意', dc: 16 },
        success: { text: '你办了退学手续，去了一个师兄的创业团队。走的那天，导师送你到楼下，说：「路是自己选的，别后悔。」', effects: { 创意: 2 }, record: '退学创业', flag: 'dropout', ending: 'dropout' },
        fail: { text: '你查了流程，问了三个朋友，最后在表格上填了一半又删了。第二天你还是去写了论文。', effects: { 创意: 1 } } }
    ]
  }
);

/* ---------- 社团 · 扩充 ---------- */
CLUBS.push(
  {
    id: 'qianhang', name: '青年马克思主义者学习研究会', en: 'YOUTH MARXISM STUDY', icon: 'shield',
    tag: '大学生活动中心 · 每月一次读书会',
    desc: '读原著、看时政、下基层。这里的讨论经常从一本书吵到半夜。',
    effects: { 品行: 1, 学习: 1 },
    events: [
      {
        icon: 'shield', title: '第一次读书会', tag: '青马研究会 · 大学生活动中心',
        text: '这次读的是一本关于航空工业发展史的书。轮到发言时，所有人都在等你开口。',
        choices: [
          { label: '讲自己的理解，不怕说错', check: { stat: '品行', dc: 11 },
            success: { text: '你从 1952 年的汉口讲到 2024 年的博士点，讲完有人说：「你查得比我们深。」', effects: { 品行: 2 }, record: '读书会发言得到认可' },
            fail: { text: '你讲了两句就卡住了，好在会长接过话头，把气氛救了回来。', effects: { 品行: 1 } } },
          { label: '先听别人怎么说', effects: { 学习: 1 },
            result: '你记了满满三页笔记。有些观点你不认同，但你第一次认真想过为什么。' }
        ]
      },
      {
        icon: 'globe', title: '暑期三下乡', tag: '青马研究会 · 赣南乡村',
        text: '队伍要去赣南的一个村子做调研，住一周，睡教室，自己做饭。天气三十五度，没有空调。',
        choices: [
          { label: '去，把调研做扎实', check: { stat: '体能', dc: 12 },
            success: { text: '你们走访了 62 户人家，写出一份 40 页的调研报告。后来被评了省级优秀团队。', effects: { 体能: 1, 品行: 1, 学习: 1 }, record: '三下乡调研报告获省级优秀', flag: 'rural_practice' },
            fail: { text: '你中暑了一次，在村卫生室躺了半天。报告最后是队友补完的。', effects: { 品行: 1 } } },
          { label: '负责后勤，做饭', check: { stat: '动手', dc: 10 },
            success: { text: '你一个人管着十七个人的三餐，七天没重样。回来以后，全队都叫你「大厨」。', effects: { 动手: 1, 品行: 1 }, record: '三下乡负责全队伙食' },
            fail: { text: '第二天你把饭煮糊了，全队吃了泡面。但你学会了控制火候。', effects: { 动手: 1 } } }
        ]
      },
      {
        icon: 'scale', title: '理论宣讲比赛', tag: '青马研究会 · 校赛',
        text: '学校组织理论宣讲比赛，每人八分钟。你被协会推了上去。',
        choices: [
          { label: '讲真话，讲自己的故事', check: { stat: '品行', dc: 13 },
            success: { text: '你没有背稿，讲了自己家乡一个航空工厂的变化。台下有人在擦眼睛。一等奖。', effects: { 品行: 2, 创意: 1 }, record: '理论宣讲比赛一等奖', flag: 'club_leader' },
            fail: { text: '你讲得太散，评委点评「缺少主线」。三等奖。', effects: { 品行: 1 } } },
          { label: '按标准稿子讲，稳妥', effects: { 品行: 1 },
            result: '你一字不差地讲完了标准稿，拿了二等奖。没有人记住你讲了什么。' }
        ]
      }
    ]
  },
  {
    id: 'marathon', name: '跑步协会', en: 'RUNNING CLUB', icon: 'pulse',
    tag: '图书馆正广场 · 每周三、六',
    desc: '从三公里到半马，这里的人相信：能跑完的路，就没有走不完的坎。',
    effects: { 体能: 2 },
    events: [
      {
        icon: 'pulse', title: '第一次五公里', tag: '跑步协会 · 赣江边',
        text: '第一次跟着队伍跑五公里。跑到两公里的时候，你的肺像被人攥住了。前面还有三个人，后面已经没人了。',
        choices: [
          { label: '咬牙跟住前面的人', check: { stat: '体能', dc: 12 },
            success: { text: '你跑完了，最后两百米还冲刺了一段。终点有人递给你一瓶水，说：「不错啊。」', effects: { 体能: 2 }, record: '完成第一次五公里' },
            fail: { text: '三公里半的时候你停了下来，走了回去。但第二天你又来了。', effects: { 体能: 1 } } },
          { label: '走完剩下的路', effects: { 体能: 1, 学习: 1 },
            result: '你走了四十分钟才回到起点。会长说：「能走完也算。」' }
        ]
      },
      {
        icon: 'medal', title: '校园迷你马拉松', tag: '跑步协会 · 图书馆正广场',
        text: '「奋斗者 正青春」校园迷你马拉松，起点在图书馆正广场。校长来鸣发令枪，全校两千多人参加。',
        choices: [
          { label: '冲一个好成绩', check: { stat: '体能', dc: 14 },
            success: { text: '你跑进了前一百名，拿到一块奖牌和一件纪念 T 恤。奖牌你挂在了床头。', effects: { 体能: 2, 品行: 1 }, record: '迷你马拉松跑进前一百', flag: 'marathon' },
            fail: { text: '后半程抽筋了，你在路边拉伸了十分钟才走完。奖牌照样有，只是慢了。', effects: { 体能: 1 } } },
          { label: '陪跑，带学弟学妹完赛', check: { stat: '品行', dc: 11 },
            success: { text: '你放慢速度，陪三个跑不动的学弟走完了最后一公里。他们后来都留在了协会。', effects: { 品行: 2 }, record: '马拉松陪跑带新人完赛' },
            fail: { text: '你自己也快撑不住了，最后两个人是一起挪过终点的。', effects: { 体能: 1 } } }
        ]
      },
      {
        icon: 'route', title: '半马挑战', tag: '跑步协会 · 南昌马拉松',
        text: '南昌马拉松半程，二十一点零九七五公里。报名费一百二，训练周期三个月。',
        choices: [
          { label: '练，认真准备三个月', check: { stat: '体能', dc: 14 },
            success: { text: '枪响到冲线，一小时五十二分。你在终点蹲下来，眼泪和汗混在一起。', effects: { 体能: 2, 品行: 1 }, record: '完成半程马拉松', flag: 'half_marathon' },
            fail: { text: '十七公里处你上了收容车。车上还有六个人，大家互相笑了笑。', effects: { 体能: 1 } } },
          { label: '不折腾，跑个健康跑就好', effects: { 体能: 1 },
            result: '你报了五公里健康跑，跑完还领了一堆补给品。挺好。' }
        ]
      }
    ]
  }
);

/* ---------- 随机事件池 ----------
   每学期开始时按 55% 概率抽 1 个，随机插入队列中间。
   type 只用于分类统计，渲染逻辑与普通事件一致。
   ------------------------------------------------------------ */
const RANDOM_EVENTS = [
  /* —— 恋爱 —— */
  {
    id: 'r_confession', icon: 'spark', title: '一封没署名的信', tag: '随机事件 · 课桌里',
    text: '你在课桌抽屉里发现一张折了三折的纸。上面写着：「如果你也注意到我，周三下午三点，图书馆门口。」没有署名。',
    choices: [
      { label: '去', check: { stat: '品行', dc: 11 },
        success: { text: '你去了。站在那里的是那个总在最后一排的女生。你们聊了两个小时，天黑了才想起来要回去。', effects: { 品行: 1, 体能: 1 }, record: '赴了一场没署名的约', flag: 'love' },
        fail: { text: '你去了，站了四十分钟，没有人来。回去的路上你想，也许是恶作剧。', effects: { 创意: 1 } } },
      { label: '不去，怕尴尬', effects: { 学习: 1 },
        result: '那张纸你留了四年，夹在一本再没打开过的课本里。' }
    ]
  },
  {
    id: 'r_breakup_small', icon: 'leaf', title: '冷战第三天', tag: '随机事件 · 手机屏幕',
    text: '你们已经三天没说话了。聊天记录停在三天前那句「随便你」。',
    choices: [
      { label: '先低头，把话说开', check: { stat: '品行', dc: 10 },
        success: { text: '你发了条消息：「对不起，我那天说话太冲了。」对方秒回：「我也有错。」', effects: { 品行: 2 }, record: '主动化解了一场冷战' },
        fail: { text: '你发了消息，对方回了个「嗯」。冷战又持续了一周。', effects: { 品行: 1 } } },
      { label: '等对方先开口', effects: { 创意: 1, 品行: -1 },
        result: '第七天，对方先发了消息。但你心里知道，有些东西已经不一样了。' }
    ]
  },

  /* —— 挫折 —— */
  {
    id: 'r_sick', icon: 'pulse', title: '急性肠胃炎', tag: '随机事件 · 凌晨四点',
    text: '凌晨四点，你被一阵剧痛疼醒。宿舍楼下的路灯还亮着，你扶着墙走到校医院，值班医生看了一眼就说：「吃坏东西了，挂水。」',
    choices: [
      { label: '挂完水回去上课', check: { stat: '体能', dc: 13 },
        success: { text: '你挂到早上七点，拔了针直接去了教室。老师说：「你这脸色不太好啊。」但你还是听完了。', effects: { 学习: 1, 体能: 1 }, record: '生病仍坚持上课' },
        fail: { text: '挂完水你实在撑不住，回宿舍睡了一整天。错过了那门课的随堂测验。', effects: { 体能: 1 }, risk: 8 } },
      { label: '请假，好好休息两天', effects: { 体能: 2, 学习: -1 },
        result: '你请了两天假，睡了个够。回来之后，你开始认真吃饭，不再拿泡面当正餐。' }
    ]
  },
  {
    id: 'r_fail', icon: 'shield', title: '成绩单上的红字', tag: '随机事件 · 教务系统',
    text: '期末成绩出来了。你往下滑，看见一门课后面写着一个红色的数字：52。',
    choices: [
      { label: '立刻找老师问清楚', check: { stat: '品行', dc: 11 },
        success: { text: '老师核对了卷子，发现有一道大题漏登了分。改过来是 68。', effects: { 品行: 2 }, record: '查分挽回一门课', risk: -10 },
        fail: { text: '老师核了一遍，分数没错。你只能等补考。', effects: { 品行: 1 }, risk: 12, flag: 'fail_exam' } },
      { label: '准备补考', check: { stat: '学习', dc: 12 },
        success: { text: '寒假你把整本书重学了一遍。补考 87 分，老师都有点意外。', effects: { 学习: 2 }, record: '补考 87 分通过', risk: -12 },
        fail: { text: '补考 58 分，差两分。只能重修。', effects: { 学习: 1 }, risk: 20, flag: 'fail_exam' } }
    ]
  },
  {
    id: 'r_lost', icon: 'lock', title: '丢了钱包', tag: '随机事件 · 食堂三楼',
    text: '吃完饭起身，你摸了摸口袋——钱包不见了。里面有校园卡、身份证和这个月剩下的生活费。',
    choices: [
      { label: '回去一层一层找', check: { stat: '体能', dc: 11 },
        success: { text: '你在三楼的失物招领处找到了。捡到的人一分钱没动，还留了张字条：「下次注意。」', effects: { 品行: 2 }, record: '钱包失而复得' },
        fail: { text: '找了两个小时，什么都没找到。补办身份证花了二十天。', effects: { 品行: 1, 体能: -1 } } },
      { label: '先挂失，认栽', effects: { 品行: 1 },
        result: '你挂失了校园卡，补办了身份证。这个月剩下的日子，你靠室友接济过活。' }
    ]
  },
  {
    id: 'r_roommate_conflict', icon: 'bolt', title: '宿舍矛盾', tag: '随机事件 · 6 栋 407',
    text: '室友半夜两点还在打游戏，声音外放。你已经连续一周没睡好，明天还有一门重要的专业课。',
    choices: [
      { label: '当面说清楚', check: { stat: '品行', dc: 12 },
        success: { text: '你把话摊开说了。室友愣了一下，说：「我真没意识到。」当晚他就买了耳机。', effects: { 品行: 2 }, record: '化解宿舍矛盾' },
        fail: { text: '说着说着就吵起来了。之后一个月，你们谁都不理谁。', effects: { 品行: 1, 体能: -1 } } },
      { label: '忍着，戴上耳塞', effects: { 体能: -1, 学习: 1 },
        result: '你买了一副降噪耳塞。噪音是小了，但心里那口气一直没顺。' }
    ]
  },
  {
    id: 'r_phone_broken', icon: 'monitor', title: '手机摔了', tag: '随机事件 · 教学楼楼梯',
    text: '下楼的时候手机从手里滑出去，屏幕碎成了蛛网。换屏要八百。',
    choices: [
      { label: '自己上网买屏换', check: { stat: '动手', dc: 12 },
        success: { text: '你花了三个小时，用吹风机和一张塑料片把屏幕换了。省了六百块，还多了一门手艺。', effects: { 动手: 2 }, record: '自己换好了手机屏幕' },
        fail: { text: '你把排线扯断了。最后花了一千二换整机。', effects: { 动手: 1 } } },
      { label: '去维修店', effects: { 品行: 1 },
        result: '你花了八百块，半小时换好。老板说：「下次摔了再来。」' }
    ]
  },

  /* —— 意外之喜 —— */
  {
    id: 'r_scholarship', icon: 'medal', title: '奖学金公示', tag: '随机事件 · 学院公告栏',
    text: '国家励志奖学金公示名单贴出来了。你在名单上看到了自己的名字，金额五千。',
    choices: [
      { label: '请室友吃一顿', check: { stat: '品行', dc: 10 },
        success: { text: '你带全宿舍去了后街最好的那家店，花了三百。他们说你「仗义」。', effects: { 品行: 2 }, record: '用奖学金请全宿舍吃饭', flag: 'generous' },
        fail: { text: '菜点多了，最后超支。但大家都很开心。', effects: { 品行: 1 } } },
      { label: '存起来，当生活费', effects: { 学习: 1 },
        result: '你把钱存进了卡里，一分没花。那学期你没有再向家里要过生活费。' }
    ]
  },
  {
    id: 'r_lucky_find', icon: 'ticket', title: '捡到一台相机', tag: '随机事件 · 火箭广场',
    text: '火箭广场的长椅上放着一台相机，镜头盖没盖，看样子很贵。周围没有人。',
    choices: [
      { label: '交给保卫处', check: { stat: '品行', dc: 9 },
        success: { text: '三天后失主找到了，是摄影协会的学长。他硬塞给你两百块，你没要。后来他免费帮你拍了一组毕业照。', effects: { 品行: 2, 创意: 1 }, record: '归还相机结识摄影协会学长' },
        fail: { text: '你交给了保卫处。半个月后，相机被人领走了，你没再听说后续。', effects: { 品行: 1 } } },
      { label: '原地等半小时', check: { stat: '体能', dc: 10 },
        success: { text: '二十分钟后，一个满头大汗的女生跑过来。她请你喝了一杯奶茶，你们成了朋友。', effects: { 品行: 1, 体能: 1 }, record: '原地等待失主' },
        fail: { text: '等了四十分钟没人来，你交给了保卫处。', effects: { 品行: 1 } } }
    ]
  },
  {
    id: 'r_contest_invite', icon: 'spark', title: '临时组队', tag: '随机事件 · 微信消息',
    text: '一个不太熟的同学突然发消息：「我这边缺一个人，明天截止报名，你能来吗？」项目是智能车竞赛。',
    choices: [
      { label: '去，反正闲着', check: { stat: '创意', dc: 12 },
        success: { text: '你们熬了两个月，拿了省二。那个同学后来成了你最好的朋友之一。', effects: { 创意: 1, 品行: 1 }, record: '临时组队拿到省二', flag: 'contest_team' },
        fail: { text: '比赛前一天车跑偏了，最后没进决赛。但你们成了朋友。', effects: { 创意: 1 } } },
      { label: '拒绝，专心自己的事', effects: { 学习: 1 },
        result: '你婉拒了。后来听说他们拿了奖，你有点后悔，但也知道自己当时真的没空。' }
    ]
  },
  {
    id: 'r_teacher_fav', icon: 'book', title: '老师点名', tag: '随机事件 · 课后',
    text: '下课后，任课老师叫住你：「你上次那个作业做得不错，有没有兴趣跟我做个项目？」',
    choices: [
      { label: '答应，抓住机会', check: { stat: '学习', dc: 12 },
        success: { text: '你跟着老师做了半年，最后在一篇论文上挂了名。', effects: { 学习: 2, 创意: 1 }, record: '被老师看中进入项目组', flag: 'lab_member' },
        fail: { text: '项目做了一半，老师调去了别的学院。事情就这么断了。', effects: { 学习: 1 } } },
      { label: '先了解一下再说', check: { stat: '品行', dc: 10 },
        success: { text: '你问了项目的内容、周期和要求，老师很欣赏你的谨慎。最后你还是加入了。', effects: { 品行: 1, 学习: 1 }, record: '谨慎了解后加入项目组' },
        fail: { text: '你犹豫了三天，老师找了别人。', effects: { 学习: 1 } } }
    ]
  },
  {
    id: 'r_lottery', icon: 'coin', title: '食堂开业抽奖', tag: '随机事件 · 食堂二楼',
    text: '新开的三楼窗口搞活动，转发朋友圈可以抽奖。一等奖是一年的免费午餐。',
    choices: [
      { label: '转发，抽一次', check: { stat: '创意', dc: 13 },
        success: { text: '你抽中了一等奖。接下来一整个学期，你每天中午都在三楼吃免费餐，还带着室友一起。', effects: { 体能: 1, 品行: 1 }, record: '抽中一年免费午餐', flag: 'canteen_friend' },
        fail: { text: '你抽到了一张五元代金券。老板说：「下次再来。」', effects: { 体能: 1 } } },
      { label: '不抽，太麻烦', effects: { 学习: 1 },
        result: '你安静地吃了一顿饭。隔壁桌的女生抽中了一等奖，尖叫声传遍了整个食堂。' }
    ]
  },

  /* —— 生活 —— */
  {
    id: 'r_library_close', icon: 'book', title: '闭馆音乐', tag: '随机事件 · 图书馆四楼',
    text: '十点整，图书馆的闭馆音乐响起来。你面前的书还剩三十页，走廊里开始有人收拾东西。',
    choices: [
      { label: '去二十四小时自习室继续', check: { stat: '体能', dc: 12 },
        success: { text: '你在自习室待到凌晨一点半，把那三十页啃完了。回宿舍的路上，校园安静得像另一个地方。', effects: { 学习: 2, 体能: -1 }, record: '图书馆闭馆后转战自习室' },
        fail: { text: '你在自习室睡着了，醒来时已经三点。趴着睡落枕，脖子疼了三天。', effects: { 学习: 1, 体能: -1 } } },
      { label: '收东西回去睡觉', effects: { 体能: 2 },
        result: '你回去洗了个热水澡，睡了八个小时。第二天早上，那三十页你用一个小时就看完了。' }
    ]
  },
  {
    id: 'r_allnighter', icon: 'moon', title: '通宵赶图', tag: '随机事件 · 制图教室',
    text: '制图作业明天要交，你的 A1 图纸还差一半。制图教室可以通宵，但只有你一个人。',
    choices: [
      { label: '通宵画完', check: { stat: '动手', dc: 12 },
        success: { text: '早上六点，你把图纸卷好。老师在课上展开看了一遍，说：「这张可以挂到走廊去。」', effects: { 动手: 1, 学习: 1 }, record: '通宵画出被展示的图纸' },
        fail: { text: '画到凌晨四点，手一抖，墨线洇了一大块。你只能重画那一块。', effects: { 动手: 1, 体能: -1 } } },
      { label: '画到十二点就回去，明天早起来补', check: { stat: '学习', dc: 11 },
        success: { text: '你五点半起来，在宿舍楼下的自习室补完了。交上去的时候刚好赶上。', effects: { 学习: 1 }, record: '早起补完制图作业' },
        fail: { text: '闹钟没响。你迟到了半小时，图纸没画完。', effects: { 学习: 1 }, risk: 8 } }
    ]
  },
  {
    id: 'r_volunteer', icon: 'leaf', title: '无偿献血', tag: '随机事件 · 大学生活动中心',
    text: '献血车停在了大学生活动中心门口。志愿者举着牌子：「O 型血紧缺。」你是 O 型。',
    choices: [
      { label: '去献', check: { stat: '体能', dc: 11 },
        success: { text: '你献了 400 毫升，拿到一张献血证和一份小礼品。回去的路上有点晕，但心里挺踏实。', effects: { 品行: 2, 体能: -1 }, record: '第一次无偿献血' },
        fail: { text: '体检时血压偏低，医生说下次再来。你有点失落。', effects: { 品行: 1 } } },
      { label: '不献，怕疼', effects: { 体能: 1 },
        result: '你绕开了献血车。第二天看到推文说这次采集量超了目标，你松了口气。' }
    ]
  },
  {
    id: 'r_rain', icon: 'leaf', title: '南昌的雨', tag: '随机事件 · 教学楼门口',
    text: '下课的时候下起了暴雨，你没带伞。教学楼门口挤了三十多个人，都在等雨停。',
    choices: [
      { label: '冲进雨里跑回宿舍', check: { stat: '体能', dc: 11 },
        success: { text: '你一口气跑回宿舍，全身湿透但没感冒。室友说你是「狠人」。', effects: { 体能: 2 }, record: '暴雨中跑回宿舍' },
        fail: { text: '你跑到一半就后悔了。第二天发烧 38 度，躺了两天。', effects: { 体能: -1 }, risk: 6 } },
      { label: '等雨停', check: { stat: '学习', dc: 10 },
        success: { text: '你在教学楼门口站着，和一个不认识的学长聊了一小时。他给你讲了考研的经验。', effects: { 学习: 1, 品行: 1 }, record: '等雨时结识学长' },
        fail: { text: '雨下到八点才停。你回去的时候食堂已经关门了。', effects: { 体能: 1 } } }
    ]
  },
  {
    id: 'r_room_clean', icon: 'tool', title: '宿舍大扫除', tag: '随机事件 · 6 栋 407',
    text: '检查卫生的通知贴在门上。你们的宿舍已经三个月没认真打扫过，床底下据说有一双大一时的袜子。',
    choices: [
      { label: '带头干，把所有人叫起来', check: { stat: '动手', dc: 11 },
        success: { text: '四个人干了一下午，扔出去六大袋垃圾。检查结果：优秀。那学期你们宿舍再也没乱过。', effects: { 动手: 1, 品行: 1 }, record: '带头大扫除评优' },
        fail: { text: '只来了两个人。你和另一个室友干到晚上十点，检查结果合格。', effects: { 动手: 1 } } },
      { label: '应付一下，把东西塞进柜子', effects: { 创意: 1 },
        result: '你们把杂物全塞进了柜子，检查得了合格。柜门到现在还关不上。' }
    ]
  },
  {
    id: 'r_internet', icon: 'signal', title: '断网了', tag: '随机事件 · 深夜',
    text: '凌晨一点，宿舍断网了。整个楼栋传来此起彼伏的哀嚎，然后是一片安静。',
    choices: [
      { label: '拿本书出来看', check: { stat: '学习', dc: 10 },
        success: { text: '你把明天要考的那章看完了，还做了笔记。第二天考试，那道大题你刚好复习到。', effects: { 学习: 2 }, record: '断网夜读考到原题' },
        fail: { text: '你翻了两页就困了，睡得比平时还早。第二天精神很好。', effects: { 体能: 1 } } },
      { label: '和室友聊天', check: { stat: '品行', dc: 9 },
        success: { text: '四个人躺在床上聊到三点，从高中聊到未来。这些话，白天是说不出口的。', effects: { 品行: 2 }, record: '断网夜和室友聊到天亮' },
        fail: { text: '聊了十分钟就没人接话了，各自睡去。', effects: { 体能: 1 } } }
    ]
  },
  {
    id: 'r_scholarship_lost', icon: 'clock', title: '差一名', tag: '随机事件 · 学院公示',
    text: '奖学金名单公示了。你排在候补第一位，前面那个人比你高 0.02 的绩点。',
    choices: [
      { label: '接受，下学期再来', check: { stat: '学习', dc: 12 },
        success: { text: '下学期你把绩点刷高了 0.3，直接拿到了一等奖。', effects: { 学习: 2 }, record: '下学期逆袭拿一等奖' },
        fail: { text: '下学期还是差一点。你开始怀疑是不是自己方法不对。', effects: { 学习: 1 } } },
      { label: '去问清楚评分细则', check: { stat: '品行', dc: 12 },
        success: { text: '你发现有一项加分漏算了，补上之后你排到了第三。', effects: { 品行: 2 }, record: '查细则补回加分' },
        fail: { text: '细则没问题。老师说：「你差的是论文加分，去发一篇吧。」', effects: { 品行: 1, 学习: 1 } } }
    ]
  },
  {
    id: 'r_senior_help', icon: 'globe', title: '学长要毕业了', tag: '随机事件 · 6 栋楼下',
    text: '大四的学长把一箱书搬到楼下卖。他看见你，说：「这些送你吧，反正也卖不了几个钱。」',
    choices: [
      { label: '收下，请他吃顿饭', check: { stat: '品行', dc: 10 },
        success: { text: '书里有他四年的笔记，还有一本写满批注的《飞行器结构设计》。他临走前给你留了个联系方式：「有事找我。」', effects: { 学习: 2, 品行: 1 }, record: '收到学长的全部笔记', flag: 'senior_books' },
        fail: { text: '你收下了书，但没来得及请他吃饭。他毕业就走了。', effects: { 学习: 1 } } },
      { label: '挑两本有用的就行', effects: { 学习: 1 },
        result: '你挑了两本专业课教材。剩下的被收废品的拉走了。' }
    ]
  },
  {
    id: 'r_wrong_room', icon: 'compass', title: '走错教室', tag: '随机事件 · 教学楼',
    text: '你推门进去，发现黑板上写的东西完全看不懂。坐了三分钟才意识到，这是研究生的课。',
    choices: [
      { label: '坐着听完这一节', check: { stat: '学习', dc: 12 },
        success: { text: '你听了一节关于复合材料损伤力学的课。虽然大半没听懂，但你知道了自己以后要学什么。', effects: { 学习: 1, 创意: 1 }, record: '误入研究生课并听完' },
        fail: { text: '你听了十分钟就溜了，出门时还撞到了讲课的老师。', effects: { 创意: 1 } } },
      { label: '赶紧溜', effects: { 体能: 1 },
        result: '你悄悄退了出去。走廊上阳光很好，你忽然觉得这栋楼比想象中大。' }
    ]
  },
  {
    id: 'r_rain_walk', icon: 'route', title: '赣江边的傍晚', tag: '随机事件 · 赣江',
    text: '考完试的那个傍晚，你一个人走到赣江边。对岸的灯一盏一盏亮起来，风里有水腥味。',
    choices: [
      { label: '坐一会儿，什么都不想', effects: { 体能: 2, 学习: 1 },
        result: '你坐了四十分钟。回去的路上你想，这样的傍晚，四年里也没几次。' },
      { label: '给家里打个电话', check: { stat: '品行', dc: 9 },
        success: { text: '你妈接的电话。她问的第一句是「吃饭了没有」。你说了半小时，挂了之后眼睛有点热。', effects: { 品行: 2 }, record: '在赣江边给家里打电话' },
        fail: { text: '电话没人接。你发了条消息：「妈，我挺好的。」', effects: { 品行: 1 } } }
    ]
  },
  {
    id: 'r_festival', icon: 'star', title: '社团文化艺术节', tag: '随机事件 · 火箭广场',
    text: '第十八届社团文化艺术节在火箭广场开幕。三十多个展位，横幅从这头拉到那头。',
    choices: [
      { label: '挨个逛一遍', check: { stat: '体能', dc: 11 },
        success: { text: '你逛了三个小时，拿了七个小礼品，还在一张报名表上留了名字。', effects: { 体能: 1, 创意: 1 }, record: '逛遍社团文化艺术节' },
        fail: { text: '人太多了，你逛了半小时就被人流挤了出来。', effects: { 创意: 1 } } },
      { label: '去自己社团的展位帮忙', check: { stat: '品行', dc: 11 },
        success: { text: '你在展位站了一下午，嗓子都喊哑了。晚上收摊时，会长说：「今天招了四十个人。」', effects: { 品行: 2 }, record: '艺术节在展位帮忙招新' },
        fail: { text: '展位没什么人来，你站了两小时，最后提前撤了。', effects: { 品行: 1 } } }
    ]
  },
  {
    id: 'r_exam_leak', icon: 'lock', title: '一份"重点"', tag: '随机事件 · 班群',
    text: '有人在班群里发了一份「内部重点」，说是从老师那里拿到的。有人已经在背了。',
    choices: [
      { label: '不背，自己复习', check: { stat: '品行', dc: 12 },
        success: { text: '你按自己的节奏复习完了整本书。考试那天发现，那份「重点」有一半是假的。', effects: { 品行: 2, 学习: 1 }, record: '拒绝作弊重点，踏实复习' },
        fail: { text: '你复习得很吃力，最后考了 71。但你心里踏实。', effects: { 品行: 1 } } },
      { label: '背，反正大家都在背', check: { stat: '创意', dc: 13 },
        success: { text: '你背了两天，考了 88。但你心里一直有个疙瘩。', effects: { 创意: 2, 品行: -1 }, record: '背了来路不明的重点' },
        fail: { text: '重点全是错的，你考了 54。', effects: { 学习: 1 }, risk: 15, flag: 'fail_exam' } }
    ]
  },
  {
    id: 'r_rain_cancel', icon: 'leaf', title: '取消的实习', tag: '随机事件 · 暑假前',
    text: '已经联系好的实习单位临时通知：项目调整，名额取消。距离暑假还有十天。',
    choices: [
      { label: '重新找，一个一个投', check: { stat: '动手', dc: 12 },
        success: { text: '你在八天里投了二十六家，最后一家小企业要了你。那个暑假你学到了比大厂更多的东西。', effects: { 动手: 2 }, record: '临时找到替代实习', flag: 'intern_ok' },
        fail: { text: '暑假过了一半还没找到。你最后留在学校，跟着老师做项目。', effects: { 动手: 1 } } },
      { label: '算了，留校做项目', check: { stat: '学习', dc: 11 },
        success: { text: '你在实验室待了两个月，把一个大作业做成了能演示的系统。', effects: { 学习: 1, 创意: 1 }, record: '暑假留校完成系统' },
        fail: { text: '项目进展不顺，两个月只搭了个框架。', effects: { 学习: 1 } } }
    ]
  }
];
