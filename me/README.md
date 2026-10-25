# 黄锐锋 · 个人主页

一个纯静态的个人网站：头像、联系方式、音乐盒（周杰伦《彩虹》、张惠妹《听海》）以及「人生模拟器」入口。

## 在线地址

https://h086677.github.io/Nchu/me/

人生模拟器（独立项目）：https://h086677.github.io/Nchu/

## 设计

浅色、简洁、模块化：米白底（`#f4f4f2`）+ 白色卡片 + 细边框（`#e6e6e2`），单一强调色（`#1f6feb`），
排版靠留白和 16px 圆角建立层次，不用阴影堆叠、不用渐变大标题。

## 目录结构

```
.
├── index.html                 页面结构
├── favicon.ico                站点图标
├── css/
│   └── style.css              全部样式
├── js/
│   └── main.js                曲库 / 播放器 / 歌词同步 / 交互
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
│       └── sim-preview.webp   模拟器预览图
├── .nojekyll                  关闭 GitHub Pages 的 Jekyll 处理
└── README.md
```

## 页面模块

| 模块 | 内容 |
| --- | --- |
| 关于 | 头像、姓名、一句话介绍、标签、两个主按钮（播放音乐 / 看看模拟器）、右侧信息卡（学校 / 身份 / 常听） |
| 音乐盒 | 三卡网格：播放列表、正在播放（封面 + 进度 + 控制 + 音量）、歌词（随进度滚动居中） |
| 人生模拟器 | 预览图 + 介绍 + 「开始模拟」，整卡可点，外链到 `https://h086677.github.io/Nchu/` |
| 联系 | QQ 3433046591、电话 193 1466 7277，点击整卡复制 |

## 特性

- **零依赖**：不引入任何框架或 CDN，全部手写 HTML / CSS / JS。
- **双曲目播放器**：原生 `<audio>` + 自绘 UI，点歌名切歌；播放/暂停、进度拖动、音量、静音、单曲循环、缓冲进度。
- **歌词同步**：时间轴内置在 `js/main.js` 的 `TRACKS[].lyrics`，按当前播放时间高亮并平滑居中。
- **响应式**：1440 / 960 / 760 / 400 四档断点，手机端音乐盒改为「正在播放 → 播放列表 → 歌词」单列。
- **可访问性**：语义标签、`aria-*` 状态、键盘操作（空格播放/暂停、进度条上方向键 ±5s）、`prefers-reduced-motion`。

## 本地预览

```bash
python -m http.server 8000
# 打开 http://127.0.0.1:8000/
```

注意：`python -m http.server` **不支持 Range 请求**，音频可以播放但进度条无法拖动跳转。
需要拖动跳转时用支持 Range 的服务器（例如 `npx serve`，或本地脚本 `.dsh-pilot/range-server.js`，该脚本仅本地使用、不随站点部署）：

```bash
node .dsh-pilot/range-server.js . 8793
```

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
