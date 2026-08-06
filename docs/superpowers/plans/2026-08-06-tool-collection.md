# Tool Collection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, responsive React tool directory with local search, category filtering, and browser-persisted favorites.

**Architecture:** A small Vite + React + TypeScript single-page app. Static catalog data lives in `src/data/tools.ts`; pure filtering and persistence helpers live in `src/lib/toolkit.ts`; `src/App.tsx` owns page state and composes semantic UI; `src/styles.css` owns the visual system and responsive behavior.

**Tech Stack:** Vite, React, TypeScript, Vitest, CSS, localStorage.

## Global Constraints

- No backend, login, database, third-party UI library, or tool execution pages.
- Use the six categories: Text, Convert, Developer, Image & Color, Generators, Everyday.
- Search matches tool name, description, and tags case-insensitively.
- Search and category filtering must combine.
- Favorites persist under `toolkit:saved-tools`.
- Use semantic HTML and native buttons for interactive controls.
- Respect `prefers-reduced-motion: reduce`.
- Desktop uses three columns, narrow screens two, and phones one.

---

### Task 1: Scaffold the Vite app and pure catalog logic

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/data/tools.ts`
- Create: `src/lib/toolkit.ts`
- Create: `src/lib/toolkit.test.ts`
- Create: `.gitignore`

**Interfaces:**
- `ToolCategory` is a string union for the six catalog categories.
- `Tool` has `id`, `name`, `description`, `category`, `icon`, and `tags`.
- `filterTools(tools, query, category)` returns a filtered `Tool[]` without mutating input.
- `readSavedToolIds(storage)` returns `Set<string>` and tolerates missing or malformed storage values.
- `writeSavedToolIds(storage, ids)` serializes a sorted string array under `toolkit:saved-tools`.

- [ ] **Step 1: Add the package and Vite configuration**

```json
{
  "name": "toolkit-directory",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest",
    "vitest": "latest"
  },
  "devDependencies": {}
}
```

`vite.config.ts` should export `defineConfig({ plugins: [react()] })`. Configure `tsconfig.json` with strict TypeScript, `jsx: "react-jsx"`, `moduleResolution: "Bundler"`, and `noEmit: true`. Configure `tsconfig.node.json` to include `vite.config.ts`.

- [ ] **Step 2: Write failing tests for filtering and localStorage helpers**

```ts
import { describe, expect, it } from 'vitest';
import { filterTools, readSavedToolIds, writeSavedToolIds } from './toolkit';
import type { Tool } from '../data/tools';

const tools: Tool[] = [
  { id: 'json', name: 'JSON Formatter', description: 'Clean JSON', category: 'Developer', icon: '{}', tags: ['json', 'format'] },
  { id: 'words', name: 'Word Counter', description: 'Count words', category: 'Text', icon: 'Aa', tags: ['writing'] },
];

describe('filterTools', () => {
  it('matches name, description, and tags case-insensitively', () => {
    expect(filterTools(tools, 'JSON', 'All')).toHaveLength(1);
    expect(filterTools(tools, 'writing', 'All')[0].id).toBe('words');
  });

  it('combines query and category filters', () => {
    expect(filterTools(tools, '', 'Text').map((tool) => tool.id)).toEqual(['words']);
    expect(filterTools(tools, 'json', 'Text')).toEqual([]);
  });
});

describe('favorite persistence', () => {
  it('round-trips a set and ignores malformed data', () => {
    const storage = new Map<string, string>();
    const adapter = { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) };
    writeSavedToolIds(adapter, new Set(['words', 'json']));
    expect(readSavedToolIds(adapter)).toEqual(new Set(['json', 'words']));
    storage.set('toolkit:saved-tools', '{bad');
    expect(readSavedToolIds(adapter)).toEqual(new Set());
  });
});
```

- [ ] **Step 3: Run the focused test and confirm it fails**

Run: `npm install && npm test -- src/lib/toolkit.test.ts`

Expected: FAIL because `src/lib/toolkit.ts` does not exist yet.

- [ ] **Step 4: Implement the data model and helpers**

Create `src/data/tools.ts` with the six-category union and at least 18 useful local entries, including JSON Formatter, Word Counter, Case Converter, Markdown Previewer, Base64 Encoder, URL Encoder, Timestamp Converter, UUID Generator, Color Converter, Contrast Checker, Gradient Generator, Image Resizer, QR Code Maker, Percentage Calculator, Tip Calculator, Unit Converter, Password Generator, and Lorem Ipsum.

Implement `filterTools` by normalizing the query and joining lowercased searchable fields. The category test should accept `All` or exact category equality. Implement persistence with the constant key `toolkit:saved-tools`, catch storage and JSON errors, accept only arrays of strings, and return new sets.

- [ ] **Step 5: Run the focused test and confirm it passes**

Run: `npm test -- src/lib/toolkit.test.ts`

Expected: PASS with all filtering and persistence assertions passing.

- [ ] **Step 6: Add the app entrypoint and ignore generated files**

`src/main.tsx` should import React, `createRoot`, `App`, and `./styles.css`, then render `<App />` into `#root`. Add `.gitignore` entries for `node_modules`, `dist`, `.DS_Store`, and `.superpowers`.

### Task 2: Implement the catalog page and interactions

**Files:**
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Modify: `index.html`

**Interfaces:**
- `App` owns `query`, `activeCategory`, and `savedIds` state.
- `visibleTools` is derived during render with `filterTools(tools, query, activeCategory)`.
- Favorite updates use a functional `setSavedIds` updater and immediately call `writeSavedToolIds(window.localStorage, next)`.

- [ ] **Step 1: Build the semantic page shell**

Create a `header` with the TOOLKIT brand and nav labels, a `main` with a hero section, a labeled search input, a category `nav`, and a results `section`. Use `h1` once and sequential `h2` headings. Add `aria-live="polite"` to the results summary.

- [ ] **Step 2: Add catalog and favorite rendering**

Render category buttons with `type="button"`, `aria-pressed`, and stable category labels. Render each tool as an article with icon, name, description, category, tags, and a native favorite button. The favorite button must stop its own event only if a card-level handler is later added; the initial card itself must not be clickable.

- [ ] **Step 3: Add empty state and saved persistence**

Initialize saved IDs from `readSavedToolIds(window.localStorage)` inside the initial state function. When no tools are visible, render the message `No tools match that search.` and a button to clear the query and reset category. The clear button must use a native button and return focus naturally.

- [ ] **Step 4: Add the responsive visual system**

Use CSS variables for the pale blue canvas, navy ink, muted blue, lime accent, borders, and shadow. Add a three-column grid at desktop, two columns below 980px, and one column below 640px. Make category navigation horizontally scrollable on small widths and hide secondary nav labels below 640px. Include visible `:focus-visible` styles and reduced-motion overrides.

- [ ] **Step 5: Update document metadata**

Set the document title to `Toolkit. Small tools, big momentum.` and add a short description meta tag. Keep the root document ASCII-only except for user-facing copy where needed.

### Task 3: Verify the production experience

**Files:**
- Modify: `src/App.tsx` or `src/styles.css` only if verification finds a defect.

- [ ] **Step 1: Run tests and production build**

Run: `npm test`

Expected: all tests PASS.

Run: `npm run build`

Expected: TypeScript compilation and Vite production build PASS, producing `dist/`.

- [ ] **Step 2: Run the dev server and exercise the core paths**

Run: `npm run dev -- --host 127.0.0.1`

Verify manually: initial catalog, text search, category filtering, combined search + category, no-results state, favorite toggle, reload persistence, and keyboard-only Tab/Enter/Space operation.

- [ ] **Step 3: Check responsive and motion constraints**

Inspect widths around 1440px, 980px, 640px, and 390px. Confirm no horizontal overflow, readable card wrapping, scrollable category row, and no clipped controls. Enable reduced motion in browser settings and confirm transitions are disabled.

- [ ] **Step 4: Review the final diff**

Run: `git status --short` and `git diff --stat`.

Expected: only the intended app, test, config, plan, and design files are present; no generated dependencies or secrets are staged.
