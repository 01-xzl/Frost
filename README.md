# ❄️ Frost

> A cozy, minimal focus companion — no account required, just open and flow.

Frost 是一个轻量级个人任务管理工具，以毛玻璃美学设计为特色。打开即用，离线可用。

---

## ✨ Features

### Task Management
- **📝 Full CRUD** — 添加、删除（可撤销）、编辑、搜索、完成标记
- **🎯 Priority & Category** — 高/中/低优先级自动排序，Work/Life/Study/Other 分类筛选
- **📅 Date Grouping** — 自动按 Today / Yesterday / This Week / Older 分组
- **📦 Import/Export** — JSON 格式一键备份与恢复
- **🌀 Batch Clear** — 一键清除已完成任务，带退出动画

### Focus Tools
- **🍅 Pomodoro Timer** — 25/5 分钟周期，Web Worker 后台计时，浏览器通知
- **🔊 Ambient Sounds** — 白噪/粉噪/棕噪/雨声/篝火，Web Audio API 零外部资源
- **💍 Progress Ring** — SVG 环形进度，每日目标完成率可视化
- **🔥 Streak Counter** — 连续打卡天数追踪

### Personalization
- **🌓 Dark/Light Theme** — 紫粉浅色 / 深蓝暗色，一键切换，零闪烁
- **📜 Daily Quote** — 40+ 中英格言，每日随机展示
- **📌 Sticky Notes** — 可拖拽便签板
- **📊 Weekly Stats** — 近 7 天完成趋势柱状图

### Technical
- **🔌 Zero Dependencies** — 零第三方运行时依赖（React + Tailwind CSS 除外）
- **✨ Animations** — 滑入、滑出、FLIP 位移动画，操作有反馈
- **📱 PWA** — 离线可用，可添加到桌面
- **🌐 GitHub Pages** — 自动部署，打开即用

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

打开 http://localhost:5173 即可使用。

在线体验：**[user.github.io/frost](https://01-xzl.github.io/Frost)** （部署后生效）

---

## 🏗️ Tech Stack

| 层 | 技术 |
|----|------|
| 框架 | React 19 + Vite 8 |
| 样式 | Tailwind CSS v4（零配置主题变量） |
| 存储 | localStorage（版本化迁移，v3） |
| 动画 | CSS @keyframes + FLIP layout animation |
| 音频 | Web Audio API（实时噪声生成 + 滤波） |
| 计时 | Web Worker（后台精确计时） |
| 部署 | GitHub Pages + GitHub Actions |

---

## 📁 Project Structure

```
src/
  hooks/          — useTodos, useTimer, useAudio, useDailyGoal, useQuotes, useStreak, useStickies, useTheme, useToast, useKeyboard
  components/     — TodoItem, TodoList, PomodoroTimer, AmbientPlayer, ProgressRing, StickyBoard, StatsPanel, ViewSwitcher, ...
  utils/          — storage (versioned migration), defaults, dateGrouping, exportImport
```

---

## 📋 Roadmap

- [x] CRUD + 搜索 + 持久化
- [x] 优先级 + 分类 + 日期分组
- [x] 深色/浅色主题 + 动画系统
- [x] 环形进度仪表盘 + 每日目标设定 (Phase A)
- [x] 番茄钟专注计时器 + 白噪音 (Phase B)
- [x] 格言语录 + 连续打卡 (Phase C)
- [x] 便签板 + 数据统计面板 (Phase D)
- [x] PWA 离线支持 + GitHub Pages 部署
- [ ] i18n 国际化（中/英）
- [ ] 多套预制主题（紫粉 / 蓝白 / 暖金 / 灰度）

---

## 👥 Contributors

- **Guhong_X** — Project creator & developer
- **DeepSeek** — AI assistant (architecture design, code generation, review)

---

## 📄 License

MIT
