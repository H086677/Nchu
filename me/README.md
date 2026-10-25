# 黄锐锋 · 个人主页

一个纯静态的个人网站：头像、联系方式、音乐盒（周杰伦《彩虹》）以及「人生模拟器」入口。

## 在线地址

https://h086677.github.io/

人生模拟器（独立项目）：https://h086677.github.io/Nchu/

## 目录结构

```
.
├── index.html              页面结构
├── favicon.ico             站点图标
├── css/
│   └── style.css           全部样式
├── js/
│   └── main.js             播放器 / 歌词 / 交互逻辑
├── assets/
│   ├── audio/
│   │   └── rainbow.mp3     音乐盒音源（周杰伦《彩虹》）
│   └── img/
│       ├── avatar.jpg      QQ 头像
│       ├── favicon.png     Apple touch icon
│       ├── rainbow-cover.jpg  《彩虹》专辑封面
│       ├── nchu-emblem.png    南昌航空大学校徽
│       └── sim-preview.webp   模拟器预览图
├── .nojekyll               关闭 GitHub Pages 的 Jekyll 处理
└── README.md
```

## 特性

- **零依赖**：不引入任何框架或 CDN，全部手写 HTML / CSS / JS。
- **音乐盒**：原生 `<audio>` + 自绘播放器，支持播放/暂停、进度拖动、音量、静音、单曲循环、实时歌词滚动。
- **响应式**：桌面、平板、手机三档布局，支持 `prefers-reduced-motion`。
- **可访问性**：语义标签、`aria-*` 状态、键盘操作（空格播放、方向键快进/快退）。
- **联系方式**：点击卡片一键复制 QQ 号 / 电话号码。

## 本地预览

```bash
# 任意静态服务器均可，例如
python -m http.server 8000
# 然后打开 http://127.0.0.1:8000/
```

## 部署

站点托管在 GitHub Pages，仓库 `H086677/H086677.github.io`，`main` 分支根目录直接发布。

```bash
git add .
git commit -m "update"
git push
```

## 版权

页面代码可自由参考。音频《彩虹》版权归周杰伦及所属唱片公司所有，本站仅作个人学习与展示用途。
