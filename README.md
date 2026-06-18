# ❄️ Frost

> A cozy, minimal focus companion — no account required, just open and flow.

Frost 是一个轻量级个人任务管理工具，以毛玻璃美学设计为特色。打开即用，离线可用。

---

## ✨ Features

- **📝 Full CRUD** — 添加、删除（可撤销）、编辑、搜索、完成标记
- **🎯 Priority & Category** — 高/中/低优先级自动排序，Work/Life/Study/Other 分类筛选
- **🌓 Dark/Light Theme** — 紫粉浅色 / 深蓝暗色，一键切换，零闪烁
- **📅 Date Grouping** — 自动按 Today / Yesterday / This Week / Older 分组
- **📦 Import/Export** — JSON 格式一键备份与恢复
- **✨ Animations** — 滑入、滑出、FLIP 位移动画，操作有反馈
- **🔌 Zero Dependencies** — 零第三方运行时依赖（React + Tailwind CSS 除外）

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

打开 http://localhost:5173 即可使用。

---

## 🏗️ Tech Stack

| 层 | 技术 |
|----|------|
| 框架 | React 19 + Vite 8 |
| 样式 | Tailwind CSS v4 |
| 存储 | localStorage（版本化迁移） |
| 动画 | CSS @keyframes + FLIP |
| 音频 | Web Audio API（计划中） |

---

## 📁 Project Structure

```
src/
  hooks/          — useTodos, useToast, useTheme
  components/     — TodoItem, TodoList, PrioritySelector, ...
  utils/          — storage, defaults, dateGrouping, exportImport
```

---

## 📋 Roadmap

- [x] CRUD + 搜索 + 持久化
- [x] 优先级 + 分类 + 日期分组
- [x] 深色/浅色主题 + 动画系统
- [ ] 环形进度仪表盘 + 每日目标设定
- [ ] 番茄钟专注计时器
- [ ] 白噪音环境音生成器
- [ ] 格言语录 + 连续打卡
- [ ] 便签板 + 数据统计面板
- [ ] PWA 离线支持
- [ ] i18n 国际化

---

## 📄 License

MIT
