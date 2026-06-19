const zh = {
  // Pomodoro
  focus: '专注',
  break: '休息',
  start: '开始',
  pause: '暂停',
  resume: '继续',
  reset: '重置',
  skip: '跳过 ›',

  // Ambient
  whiteNoise: '白噪音',
  pinkNoise: '粉噪音',
  brownNoise: '棕噪音',
  rain: '雨声',
  campfire: '篝火',

  // View switcher
  tasks: '任务',
  notes: '便签',
  stats: '统计',

  // Todo input
  placeholder: '添加新任务…',

  // Search
  searchPlaceholder: '搜索…',

  // Category filter
  all: '全部',
  Work: '工作',
  Life: '生活',
  Study: '学习',
  Other: '其他',

  // Priority
  high: '高',
  medium: '中',
  low: '低',

  // Stats bar
  today: '今日',
  done: '已完成',
  created: '已创建',
  total: '总计',
  left: '剩余',
  clearDone: '清除已完成',
  dailyGoal: '每日目标',

  // Streak
  day_one: '天',
  day_other: '天',
  best: '最佳',
  todayDone: '今日已打卡',

  // Empty state
  emptyNone: '还没有任务 — 在上面添加一个 ☝',
  emptyNoMatch: '没有匹配项',
  emptyAllDone: '全部完成！🎉',

  // Sticky notes
  stickyEmpty: '还没有便签',
  stickyAdd: '+ 添加便签',
  stickyPlaceholder: '…',

  // Stats panel
  weekCreated: '已创建',
  weekDone: '已完成',
  weekSummary: '本周任务',

  // Footer
  export: '导出',
  import: '导入',
  exportTitle: '下载全部任务为 JSON',
  importTitle: '从 JSON 文件导入',

  // Todo item
  edit: '编辑',
  delete: '删除',

  // Hint
  hint: '按优先级排序 · 双击编辑 · 按日期分组',

  // Toast
  undo: '撤销',
  deleted: '已删除：',
  imported_singular: '已导入 1 个任务',
  imported_plural: '已导入 {n} 个任务',
  noValidTodos: '文件中没有有效任务',
  importFailed: '导入失败',
  focusDone: '专注完成！休息一下 ☕',
  breakDone: '休息结束！继续工作 🚀',

  // Date grouping
  dateToday: '今天',
  dateYesterday: '昨天',
  dateThisWeek: '本周',
  dateOlder: '更早',
}

const en = {
  // Pomodoro
  focus: 'Focus',
  break: 'Break',
  start: 'Start',
  pause: 'Pause',
  resume: 'Resume',
  reset: 'Reset',
  skip: 'Skip ›',

  // Ambient
  whiteNoise: 'White Noise',
  pinkNoise: 'Pink Noise',
  brownNoise: 'Brown Noise',
  rain: 'Rain',
  campfire: 'Campfire',

  // View switcher
  tasks: 'Tasks',
  notes: 'Notes',
  stats: 'Stats',

  // Todo input
  placeholder: 'Add a new task…',

  // Search
  searchPlaceholder: 'Search…',

  // Category filter
  all: 'All',
  Work: 'Work',
  Life: 'Life',
  Study: 'Study',
  Other: 'Other',

  // Priority
  high: 'High',
  medium: 'Medium',
  low: 'Low',

  // Stats bar
  today: 'Today',
  done: 'done',
  created: 'created',
  total: 'total',
  left: 'left',
  clearDone: 'Clear done',
  dailyGoal: 'Daily goal',

  // Streak
  day_one: 'day',
  day_other: 'days',
  best: 'best',
  todayDone: '✓ today',

  // Empty state
  emptyNone: 'Nothing yet — add one above ☝',
  emptyNoMatch: 'No match',
  emptyAllDone: 'All done! 🎉',

  // Sticky notes
  stickyEmpty: 'No sticky notes yet',
  stickyAdd: '+ Add note',
  stickyPlaceholder: '…',

  // Stats panel
  weekCreated: 'Created',
  weekDone: 'Done',
  weekSummary: 'tasks this week',

  // Footer
  export: 'Export',
  import: 'Import',
  exportTitle: 'Download all todos as JSON',
  importTitle: 'Import todos from JSON file',

  // Todo item
  edit: 'Edit',
  delete: 'Delete',

  // Hint
  hint: 'Sorted by priority · Double-click to edit · Tasks grouped by date',

  // Toast
  undo: 'Undo',
  deleted: 'Deleted: ',
  imported_singular: 'Imported 1 todo',
  imported_plural: 'Imported {n} todos',
  noValidTodos: 'No valid todos found in file',
  importFailed: 'Import failed',
  focusDone: 'Focus done! Take a break ☕',
  breakDone: 'Break over! Back to work 🚀',

  // Date grouping
  dateToday: 'Today',
  dateYesterday: 'Yesterday',
  dateThisWeek: 'This Week',
  dateOlder: 'Older',
}

export const LOCALES = { zh, en }
export const LANG_LABELS = { zh: '中文', en: 'English' }

export function t(locale, key, params) {
  let text = locale[key] ?? key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, v)
    }
  }
  return text
}
