# More Tool Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 15 zero-dependency, Hash-routed tool pages so every catalog entry except QR Code Maker and Image Resizer becomes usable.

**Architecture:** Extend the existing pure-helper layer in `src/lib/toolkit-tools.ts` and add one focused page component per tool under `src/components/tools/`. All pages reuse `ToolPageShell` and existing `tool-panel` styling; only small shared CSS additions are expected. Directory cards with a `route` render as links; QR Code Maker and Image Resizer keep their `article` placeholder.

**Tech Stack:** React, TypeScript, Vitest, Vite, Hash routing, CSS.

## Global Constraints

- Keep zero runtime dependencies beyond the existing Vite, React, TypeScript, and Vitest stack.
- Use Hash routes under `#/tools/<route>` for every new page.
- Pure helpers live in `src/lib/toolkit-tools.ts`; page components stay thin and own only input state and copy status.
- Preserve direct opening of `dist/index.html` and the inline build pipeline.
- Use semantic controls, visible focus states, `role="alert"` errors, `aria-live` statuses, and responsive single-column layouts on phones.

---

### Task 1: Extend pure helpers with tests

**Files:**
- Modify: `src/lib/toolkit-tools.ts`
- Modify: `src/lib/toolkit-tools.test.ts`
- Modify: `src/data/tools.ts`

**Interfaces:**
- Text: `countWords(text)` returns `{ words, characters, charactersNoSpaces, sentences, readingMinutes }`; `convertCase(text, style)` supports `title | sentence | lower | upper | camel | pascal | snake | kebab`; `renderMarkdown(source)` returns sanitized-safe HTML string for a small Markdown subset.
- Convert: `encodeUrlComponent(value)`, `decodeUrlComponent(value)`; `unixToDate(value, unit)` and `dateToUnix(year, month, day, hour, minute)`; `convertUnit(value, from, to, kind)` where kind is `length | weight | temperature`.
- Developer: `generateUuidV4()` and `generateUuids(count)`; `regexMatches(pattern, source)` returns match texts (non-throwing).
- Color: `contrastRatio(a, b)` and `wcagLevel(ratio)`; `buildGradient(from, to, angle)`.
- Everyday: `calculatePercentage(type, a, b)`, `splitTip(bill, percent, people)`, `daysBetween(a, b)`, `generatePassword(length, options)`, `generateLorem(paragraphs)`.

- [ ] **Step 1: Add tests for every helper in `toolkit-tools.test.ts`.**
- [ ] **Step 2: Run `npm test -- src/lib/toolkit-tools.test.ts` and confirm the new cases fail on missing exports.**
- [ ] **Step 3: Implement all helpers with deterministic, dependency-free logic (UTF-8 safe, non-throwing where UI expects a result).**
- [ ] **Step 4: Add `route` to the 15 matching catalog records and run the focused suite to green.**

### Task 2: Text tools

**Files:**
- Create: `src/components/tools/WordCounter.tsx`
- Create: `src/components/tools/CaseConverter.tsx`
- Create: `src/components/tools/MarkdownPreviewer.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Implement Word Counter as a live, read-only stats panel.**
- [ ] **Step 2: Implement Case Converter with a style button group and live output.**
- [ ] **Step 3: Implement Markdown Previewer with a two-panel split and live preview.**
- [ ] **Step 4: Wire the three routes into `App`, add any shared CSS, and verify each renders.**

### Task 3: Convert tools

**Files:**
- Create: `src/components/tools/UrlEncoder.tsx`
- Create: `src/components/tools/TimestampConverter.tsx`
- Create: `src/components/tools/UnitConverter.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Implement URL Encoder with Encode/Decode mode.**
- [ ] **Step 2: Implement Timestamp Converter for seconds/milliseconds and reverse direction.**
- [ ] **Step 3: Implement Unit Converter with length/weight/temperature preset pairs.**
- [ ] **Step 4: Wire routes and verify conversion and error states.**

### Task 4: Developer and color tools

**Files:**
- Create: `src/components/tools/UuidGenerator.tsx`
- Create: `src/components/tools/RegexTester.tsx`
- Create: `src/components/tools/ContrastChecker.tsx`
- Create: `src/components/tools/GradientGenerator.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Implement UUID Generator with count control, regenerate, and copy-all.**
- [ ] **Step 2: Implement Regex Tester with live match highlighting via `<mark>`.**
- [ ] **Step 3: Implement Contrast Checker with WCAG AA/AAA badges.**
- [ ] **Step 4: Implement Gradient Generator with a copyable CSS string and preview.**
- [ ] **Step 5: Wire routes and verify each interaction.**

### Task 5: Everyday and generator tools

**Files:**
- Create: `src/components/tools/PercentageCalculator.tsx`
- Create: `src/components/tools/TipCalculator.tsx`
- Create: `src/components/tools/DateDifference.tsx`
- Create: `src/components/tools/PasswordGenerator.tsx`
- Create: `src/components/tools/LoremIpsum.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Implement Percentage Calculator with three calculation types.**
- [ ] **Step 2: Implement Tip Calculator with bill, percent, and people inputs.**
- [ ] **Step 3: Implement Date Difference with two date inputs.**
- [ ] **Step 4: Implement Password Generator with length and character-set options.**
- [ ] **Step 5: Implement Lorem Ipsum with paragraph count and word choice.**
- [ ] **Step 6: Wire routes and verify each tool.**

### Task 6: Verify the full catalog and direct build

**Files:**
- Modify: `scripts/verify-dist.mjs` only if assertions need route coverage.

- [ ] **Step 1: Run `npm test && npm run test:dist` and confirm all suites pass.**
- [ ] **Step 2: Use a clean headless Chrome profile against `dist/index.html` and confirm the directory and a sample of tool routes render.**
- [ ] **Step 3: Confirm every catalog card except QR Code Maker and Image Resizer is a link, and those two remain articles.**
- [ ] **Step 4: Run `git diff --check && git status --short` and confirm only intended files changed.**
