# 黄锐锋 · 个人主页

一个纯静态的个人网站：头像与联系方式、音乐盒（周杰伦《彩虹》、张惠妹《听海》）、
歌词节奏游戏、留言板，以及「人生模拟器」入口。深色模式、全局迷你播放器、音频可视化一应俱全。

## 在线地址

https://h086677.github.io/Nchu/me/

人生模拟器（独立项目）：https://h086677.github.io/Nchu/

## 设计

简洁、模块化，一套 CSS 变量同时驱动浅色与深色两套皮肤。

- 浅色：米白底（`--bg:#f4f4f2`）+ 白色卡片 + 细边框（`--line:#e6e6e2`），单一强调色（`--accent:#1f6feb`）。
- 深色：`--bg:#131316`、`--surface:#1a1a1e`、`--accent:#4d8df5`，由 `<html data-theme="dark">` 切换。

排版靠留白和 16px 圆角建立层次，不用阴影堆叠、不用渐变大标题。

## 目录结构

```
.
├── index.html                 页面结构
├── favicon.ico                站点图标
├── css/
│   └── style.css              全部样式（含深色模式变量与全部组件）
├── js/
│   ├── config.js              站点配置（留言板 / 游戏手感）
│   ├── main.js                曲库 / 播放器 / 歌词同步 / 主题 / 可视化 / 留言板
│   └── game.js                歌词节奏游戏（谱面生成、判定、存档）
├── assets/
│   ├── audio/
│   │   ├── rainbow.mp3        周杰伦《彩虹》（263s，128kbps）
│   │   └── tinghai.mp3        张惠妹《听海》（318s，128kbps）
│   └── img/
│       ├── avatar.jpg         QQ 头像
│       ├── favicon.png        Apple touch icon
│       ├── rainbow-cover.jpg  《彩虹》专辑封面
│       ├── tinghai-cover.jpg  《听海》专辑封面
│       ├── nchu-emblem.png    南昌航空大学校徽
│       ├── sim-preview.webp   模拟器预览图
│       ├── sim-preview-mobile.webp
│       └── sim-thumb-2.webp
├── .nojekyll                  关闭 GitHub Pages 的 Jekyll 处理
└── README.md
```

## 页面模块

| 模块 | 内容 |
| --- | --- |
| 关于 | 头像、姓名、一句话介绍、标签、两个主按钮（播放音乐 / 玩音游）、右侧信息卡（学校 / 身份 / 常听） |
| 音乐盒 | 三卡网格：播放列表、正在播放（封面 + 进度 + 控制 + 音量 + 音频可视化）、歌词（随进度滚动居中） |
| 音游 | 挑曲目、挑难度（简单 / 普通 / 困难）、四条轨道打歌词；实时 HUD（分数 / 连击 / 准确率）、结算评级与本地最高分 |
| 人生模拟器 | 预览图 + 介绍 + 「开始模拟」，整卡可点，外链到 `https://h086677.github.io/Nchu/` |
| 留言板 | 昵称 + 内容，本地保存；填了 giscus 配置后自动切换成公开评论区 |
| 联系 | QQ 3433046591、电话 193 1466 7277，点击整卡复制 |

## 特性

### 播放器

- **零依赖**：不引入任何框架或 CDN，全部手写 HTML / CSS / JS。
- **双曲目播放器**：原生 `<audio>` + 自绘 UI，点歌名切歌；播放/暂停、进度拖动、音量、静音、单曲循环、缓冲进度。
- **歌词同步**：时间轴内置在 `js/main.js` 的 `TRACKS[].lyrics`，按当前播放时间高亮并平滑居中。
- **音频可视化**：`AnalyserNode` 取频谱，canvas 画 40 根圆角柱，颜色跟随主题；暂停时回落成一条静息线。

### 全局

- **深色模式**：顶栏月亮/太阳按钮切换，存 `localStorage['hrf-theme']`；首次访问跟随系统 `prefers-color-scheme`；
  `<head>` 里有一段内联脚本在首屏前打上 `data-theme`，避免闪白。
- **迷你播放器**：滚出音乐盒范围后，底部浮出迷你条（封面 / 标题 / 进度 / 播放键），点「↑」跳回音乐盒。
- **响应式**：1440 / 960 / 760 / 400 四档断点，手机端音乐盒改为「正在播放 → 播放列表 → 歌词」单列。
- **可访问性**：语义标签、`aria-*` 状态、键盘操作（空格播放/暂停、进度条上方向键 ±5s）、`prefers-reduced-motion`。

### 歌词节奏游戏

- **谱面由歌词自动生成**，不用另做 beatmap：每行歌词的起始时间就是音符落点，
  难度只改变每行的音符密度（简单 1–2 个、普通 2–3 个、困难 3–5 个），随机种子固定，同一首歌同一难度谱面恒定。
- **四轨操作**：键盘 `D` `F` `J` `K`，手机直接点轨道。判定窗口 Perfect ±75ms、Good ±165ms。
- **计分**：Perfect `300 + min(连击,60)×2`，Good `100 + min(连击,60)`，Miss 断连。
  准确率 `(Perfect + Good×0.6) / 总数`，评级 S ≥95%、A ≥88%、B ≥78%、C ≥65%。
- **存档**：最高分按「曲目 : 难度」存在 `localStorage['hrf-rhythm:0:1']`，只在破纪录时覆盖。
- **暂停**：`Esc` 暂停、暂停时空格继续，切到别的标签页会自动暂停。

### 留言板

默认**本地模式**：留言存 `localStorage['hrf-guestbook']`，只有自己看得见，适合纯静态站先跑起来。
想变成所有人可见的公开留言板，用 [giscus](https://giscus.app/zh-CN)（基于 GitHub Discussions，免费、无后端）：

1. 仓库 `H086677/Nchu` → **Settings** → **General** → 勾选 **Discussions**；
2. 在该仓库 **Discussions** 里新建一个分类（推荐 Announcements 类型），记下分类名；
3. 打开 <https://giscus.app/zh-CN>，填入仓库 `H086677/Nchu`，选好 Discussion 分类和映射方式；
4. 把页面生成的 4 个值填进 `js/config.js`：

```js
window.HRF_CONFIG = {
  giscus: {
    repo: 'H086677/Nchu',
    repoId: 'R_kgDOxxxxxxx',
    category: 'Announcements',
    categoryId: 'DIC_kwDOxxxxxxxx'
  },
  guestbookKey: 'hrf-guestbook',
  rhythmSpeed: 1
};
```

四项填齐后页面会自动挂载 giscus 评论区并隐藏本地留言框；留空则一直走本地模式。
`rhythmSpeed` 是音游手感系数（越大音符下落越快），默认 `1`。

## 本地预览

```bash
python -m http.server 8000
# 打开 http://127.0.0.1:8000/
```

⚠️ **不要用 `file://` 直接双击打开**：

- `python -m http.server` 不支持 Range 请求，音频能播但进度条拖不动；需要拖动时用 `.dsh-pilot/serve.js`
  （`node .dsh-pilot/serve.js`，带 `Accept-Ranges`，该目录仅本地使用、不随站点部署）；
- 更关键的是 `file://` 下 Web Audio 的 `createMediaElementSource` 拿不到音频数据，**音频可视化会一直是一条静息线**，
  看起来像坏了，其实只是协议限制。用任意 HTTP 服务打开就正常。

## 部署

站点托管在 GitHub Pages，复用已有仓库 `H086677/Nchu` 的 Pages，本站源码位于该仓库的 `me/` 子目录，
因此线上地址为 https://h086677.github.io/Nchu/me/ 。

更新方式（无 git 环境时用 GitHub REST API）：

1. `GET /repos/H086677/Nchu/git/ref/heads/main` 拿到 base sha；
2. 对每个文件 `POST /repos/H086677/Nchu/git/blobs`（base64 内容）；
3. `POST /repos/H086677/Nchu/git/trees`（`base_tree` = base sha，路径统一加 `me/` 前缀）；
4. `POST /repos/H086677/Nchu/git/commits`，再 `PATCH /repos/H086677/Nchu/git/refs/heads/main`。

`me/` 是子目录，页面内所有资源路径都必须是相对路径（当前实现已是相对路径）。

## 版权

页面代码可自由参考。音频《彩虹》《听海》版权归周杰伦、张惠妹及各自唱片公司所有，本站仅作个人学习与展示用途。
