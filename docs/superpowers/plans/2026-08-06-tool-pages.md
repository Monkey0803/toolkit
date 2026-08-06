# Tool Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn JSON Formatter, Base64 Encoder, and Color Converter catalog entries into usable Hash-routed tool pages.

**Architecture:** Keep one React entry and route with `window.location.hash`, so direct `file://` opening and static hosting continue to work. Put deterministic conversions in `src/lib/toolkit-tools.ts`; keep shared page chrome in `ToolPageShell`; each tool owns its input/output state and delegates conversions to pure helpers.

**Tech Stack:** React, TypeScript, Vitest, Vite, browser Clipboard API, Hash routing, CSS.

## Global Constraints

- Keep the app dependency-free beyond the existing Vite, React, TypeScript, and Vitest stack.
- Preserve direct opening of `dist/index.html` through the inline build pipeline.
- Use Hash routes: `#/`, `#/tools/json-formatter`, `#/tools/base64-encoder`, and `#/tools/color-converter`.
- Preserve the existing directory, search, category filtering, and localStorage favorites behavior.
- Use semantic controls, visible focus states, live status messages, and responsive single-column tool layouts on phones.

---

### Task 1: Add tool routes and pure conversion helpers

**Files:**
- Create: `src/lib/toolkit-tools.ts`
- Create: `src/lib/toolkit-tools.test.ts`
- Modify: `src/data/tools.ts`
- Modify: `src/lib/toolkit.ts`

**Interfaces:**
- `formatJson(input: string, minify?: boolean): string` throws on invalid JSON.
- `encodeBase64(input: string): string` and `decodeBase64(input: string): string` support UTF-8 text.
- `parseHexColor(input: string): { hex: string; rgb: string; hsl: string }` throws on invalid input.
- `Tool` adds optional `route?: string` for the three available tools.
- `getRouteFromHash(hash: string): string` returns the normalized route without a leading `#/`.

- [ ] **Step 1: Write failing conversion tests**

Test pretty/minified JSON, Chinese Base64 round-trip, invalid Base64, 3/6 digit HEX conversion, and invalid HEX.

- [ ] **Step 2: Run focused tests and confirm failure**

Run: `npm test -- src/lib/toolkit-tools.test.ts`

Expected: FAIL because the helper module does not exist.

- [ ] **Step 3: Implement helpers and routes**

Use `JSON.parse`/`JSON.stringify`, `TextEncoder`/`TextDecoder` around `btoa`/`atob`, and a deterministic RGB-to-HSL conversion. Add routes to the three matching catalog records and normalize hash values for the app router.

- [ ] **Step 4: Run focused tests and confirm pass**

Run: `npm test -- src/lib/toolkit-tools.test.ts`

Expected: all conversion tests PASS.

### Task 2: Build shared tool shell and Hash router

**Files:**
- Create: `src/components/ToolPageShell.tsx`
- Modify: `src/App.tsx`
- Modify: `src/data/tools.ts`

**Interfaces:**
- `ToolPageShell` accepts `title`, `description`, `category`, `children`, and `onBack`.
- `App` listens to `hashchange`, renders directory for `#/`, and maps the three tool routes to their page components.

- [ ] **Step 1: Add router state and route-aware directory links**

Initialize from `window.location.hash`, subscribe/unsubscribe to `hashchange`, and render available tool cards as anchors with `href="#/tools/<route>"`. Keep non-available cards as articles.

- [ ] **Step 2: Implement `ToolPageShell`**

Render a back link to `#/`, category eyebrow, title, description, a workspace region, and a live status region. Keep the page shell semantic and keyboard reachable.

- [ ] **Step 3: Add tool-page CSS hooks**

Add shared classes for page header, workbench, panels, textarea, toolbar, status, result rows, and copy buttons without changing the existing directory visual language.

### Task 3: Implement the three interactive tools

**Files:**
- Create: `src/components/tools/JsonFormatter.tsx`
- Create: `src/components/tools/Base64Encoder.tsx`
- Create: `src/components/tools/ColorConverter.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Implement JSON Formatter**

Use controlled input state, `Format`, `Minify`, `Copy result`, and `Clear` buttons. Catch parse errors into visible `role="alert"` content and keep the original input intact.

- [ ] **Step 2: Implement Base64 Encoder**

Use an Encode/Decode native button group, controlled textarea, `Convert`, `Copy result`, and `Clear`. Catch malformed Base64 and show a visible error without throwing during render.

- [ ] **Step 3: Implement Color Converter**

Use controlled HEX input, parse on change, show a preview swatch and RGB/HSL output rows, and provide copy buttons for each output. Show invalid input feedback while preserving the typed value.

- [ ] **Step 4: Add clipboard fallback status**

Use `navigator.clipboard.writeText` when available, catch failures, and announce copied or unavailable status through the shell live region.

### Task 4: Verify routes, direct build, and responsive behavior

**Files:**
- Modify: `scripts/verify-dist.mjs` if build assertions need route coverage.

- [ ] **Step 1: Run all tests and production build**

Run: `npm test && npm run test:dist`

Expected: conversion tests and existing tests pass; the inline dist verifier passes.

- [ ] **Step 2: Verify direct Chrome flow**

Open `dist/index.html` in Chrome, confirm directory renders, open each available card, use the tool action, return with the back link, and confirm favorites remain.

- [ ] **Step 3: Verify responsive and keyboard behavior**

Check desktop and phone widths, tab through tool controls, use Enter/Space on buttons, confirm error messages are announced and no horizontal overflow appears.

- [ ] **Step 4: Review the final worktree**

Run: `git diff --check && git status --short`.

Expected: only intentional source, test, plan, and build-script changes remain.
