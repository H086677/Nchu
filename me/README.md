# 黄锐锋 · 个人主页

一个纯静态的个人网站：头像与联系方式、音乐盒（33 首，周杰伦与方大同）、
「我喜欢的游戏」栏目与详情页、留言板，以及「人生模拟器」入口。
深色模式、全局迷你播放器、音频可视化一应俱全。

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
├── index.html                 首页
├── game.html                  游戏详情页（?id=xxx 决定显示哪一款）
├── favicon.ico                站点图标
├── css/
│   └── style.css              全部样式（含深色模式变量与全部组件）
├── js/
│   ├── config.js              站点配置（留言板 giscus）
│   ├── tracks.js              歌单数据（33 首，含每首的歌词时间轴）
│   ├── games.js               游戏数据 + 首页卡片与详情页渲染
│   ├── theme.js               详情页专用：主题 / 年份 / 顶栏 / 入场动画
│   └── main.js                播放器 / 歌词同步 / 主题 / 可视化 / 迷你条 / 留言板
├── assets/
│   ├── audio/                 33 首 mp3（rainbow、daoxiang、nanyin…）
│   └── img/                   头像、校徽、模拟器预览图、每首歌的专辑封面
├── .nojekyll                  关闭 GitHub Pages 的 Jekyll 处理
└── README.md
```

## 页面模块

| 模块 | 内容 |
| --- | --- |
| 关于 | 头像、姓名、一句话介绍、标签、两个主按钮（播放音乐 / 看看游戏）、右侧信息卡（学校 / 身份 / 常听） |
| 音乐盒 | 三卡网格：播放列表（带搜索框）、正在播放（封面 + 进度 + 控制 + 音量 + 音频可视化）、歌词（随进度滚动居中） |
| 我喜欢的游戏 | 首页 8 张卡片（封面渐变 + 评分 + 一句话），点进去是 `game.html?id=xxx` 的详情页 |
| 人生模拟器 | 预览图 + 介绍 + 「开始模拟」，整卡可点，外链到 `https://h086677.github.io/Nchu/` |
| 留言板 | 昵称 + 内容，本地保存；填了 giscus 配置后自动切换成公开评论区 |
| 联系 | QQ 3433046591、电话 193 1466 7277，点击整卡复制 |

## 特性

### 播放器

- **零依赖**：不引入任何框架或 CDN，全部手写 HTML / CSS / JS。
- **33 首曲库**：周杰伦 21 首、方大同 11 首、张惠妹 1 首。原生 `<audio>` + 自绘 UI，点歌名切歌；
  播放/暂停、进度拖动、音量、静音、单曲循环、缓冲进度。
- **列表搜索**：播放列表顶部有搜索框，按歌名 / 歌手 / 专辑实时过滤，计数显示「N / 33 首」。
- **歌词同步**：时间轴在 `js/tracks.js` 的 `lyrics` 字段，按当前播放时间高亮并平滑居中。
- **音频可视化**：`AnalyserNode` 取频谱，canvas 画 40 根圆角柱，颜色跟随主题；暂停时回落成一条静息线。

### 全局

- **深色模式**：顶栏月亮/太阳按钮切换，存 `localStorage['hrf-theme']`；首次访问跟随系统 `prefers-color-scheme`；
  `<head>` 里有一段内联脚本在首屏前打上 `data-theme`，避免闪白。
- **迷你播放器**：滚出音乐盒范围后，底部浮出迷你条（封面 / 标题 / 进度 / 播放键），点「↑」跳回音乐盒。
- **响应式**：1440 / 960 / 760 / 400 四档断点，手机端音乐盒改为「正在播放 → 播放列表 → 歌词」单列。
- **可访问性**：语义标签、`aria-*` 状态、键盘操作（空格播放/暂停、进度条上方向键 ±5s）、`prefers-reduced-motion`。

### 我喜欢的游戏

- 首页卡片与详情页共用 `js/games.js` 里的一份数据，加游戏只需往下 COPY 一段。
- 每款游戏有：中英文名、年份、平台、类型、游玩时长、我的评分、一句话、三节正文（我为什么喜欢 / 印象最深的时刻 / 想说的话）。
- 详情页底部有「上一款 / 全部游戏 / 下一款」导航，可以一路翻下去。
- **正文目前是占位文案**，写在 `js/games.js` 各游戏的 `sections` 里，随时替换。

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
  guestbookKey: 'hrf-guestbook'
};
```

四项填齐后页面会自动挂载 giscus 评论区并隐藏本地留言框；留空则一直走本地模式。

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

更新方式（无 git 环境时用 GitHub REST API，`.dsh-pilot/deploy.js` 已封装）：

1. `GET /repos/H086677/Nchu/git/ref/heads/main` 拿到 base sha；
2. 对每个文件 `POST /repos/H086677/Nchu/git/blobs`（base64 内容）；
3. `POST /repos/H086677/Nchu/git/trees`（`base_tree` = base sha，路径统一加 `me/` 前缀）；
4. `POST /repos/H086677/Nchu/git/commits`，再 `PATCH /repos/H086677/Nchu/git/refs/heads/main`。

`me/` 是子目录，页面内所有资源路径都必须是相对路径（当前实现已是相对路径）。

## 版权

页面代码可自由参考。音频版权归周杰伦、方大同、张惠妹及各自唱片公司所有，本站仅作个人学习与展示用途。
