# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project: Frost

A cozy, minimal task manager with glassmorphism UI. Zero runtime dependencies beyond React 19 + Tailwind CSS v4. Built on Vite 8.

## Commands

```bash
npm run dev       # Dev server at localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # ESLint
```

## Architecture

**Data flow**: All state originates from `src/hooks/useTodos.js`. This hook owns the `todos` array, all CRUD operations, search/filter state, and localStorage persistence. Other hooks (`useDailyGoal`, `useTheme`) consume `todos` as input or manage independent state (theme, toast queue).

**localStorage schema**: `{ version: 3, todos: [...] }` under key `glass-todos`. Migration logic in `src/utils/storage.js` auto-upgrades older schemas on load. Never store data as a plain array — always wrap in the versioned object.

**Theme system**: CSS custom properties on `:root` (light) and `.dark` (dark). `useTheme` toggles `document.documentElement.classList`. The `.glass` class and Tailwind utilities reference these properties. No `dark:` Tailwind variants needed — the custom properties handle the swap.

**Animation system**: CSS `@keyframes` registered in `@theme` block (`src/index.css`). Four animations: `slide-down` (enter), `slide-up` (exit), `slide-up-toast` (toast enter), `scale-check` (checkbox bounce). FLIP position animation for priority reorder is inline in `TodoList.jsx` via `useLayoutEffect`.

**Priority sorting**: Items sort high → medium → low, then by `id` descending (newest first). Sort happens in `filtered` memo inside `useTodos`, not in the raw `todos` array. Date grouping (`groupByDate`) applies within each group.

**Component tree**:
```
App
 ├─ Toast (fixed bottom-center)
 ├─ ThemeToggle (top-right of card)
 ├─ ProgressRing + h1 (header row)
 ├─ TodoInput (add form with priority/category)
 ├─ SearchBar (forwardRef for potential keyboard shortcuts)
 ├─ CategoryFilter (chip row, null = "All")
 ├─ StatsBar (daily goal row + total counts + clear done)
 ├─ TodoList (flat or grouped; FLIP animation)
 │   ├─ DateGroupHeader (sticky, only in grouped mode)
 │   └─ TodoItem (per-task; priority dot + category tag + checkbox + actions)
 └─ FooterMenu (export/import)
```

## Key patterns

- **Ref for latest state**: Hooks that need callbacks to always see the latest state (e.g., toast undo) use a `todosRef` pattern — `const ref = useRef(x); ref.current = x;` — and read `ref.current` inside callbacks.
- **`sync()` wrapper**: `useTodos` wraps `setTodos` + `saveTodos` in a single `sync()` call. Every mutation goes through `sync()`.
- **forwardRef**: `TodoInput` and `SearchBar` use `forwardRef` so App can hold refs for future keyboard shortcut focus.
- **`onMouseDown preventDefault`**: PrioritySelector buttons call `e.preventDefault()` on mousedown to prevent the edit input from blurring when changing priority during edit mode.

## Module boundaries

| Module | Responsibility |
|--------|---------------|
| `useTodos` | Single source of truth for todos array, all mutations, search/category filter, export/import |
| `useDailyGoal` | Reads `todos` prop, computes today's stats, manages goal number in separate localStorage key |
| `useToast` | Toast queue with auto-dismiss timers; action callbacks stored in refs |
| `useTheme` | Theme toggle, persists to `glass-theme` key, applies `.dark` class synchronously before first render |
| `useKeyboard` | Global keydown listener with shortcut string parsing (currently disabled — browser conflicts) |
| `storage.js` | Versioned load/save/migrate; `CURRENT_VERSION = 3` |
| `defaults.js` | `PRIORITIES`, `CATEGORIES` constants; `createTodo()` factory |
| `dateGrouping.js` | Pure function: `groupByDate(todos)` → `[{ label, todos }]` |
| `exportImport.js` | `downloadJSON()` (creates Blob → `<a>` click), `parseImportedFile()` (FileReader promise) |

## Data model (current version 3)

```js
{
  id: number,          // Date.now()
  text: string,
  done: boolean,
  priority: 'high' | 'medium' | 'low',
  category: 'Work' | 'Life' | 'Study' | 'Other',
  order: number,       // legacy, kept for compatibility
  createdAt: string,   // ISO 8601
  dueDate: string | null,
}
```
