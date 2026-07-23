# CLAUDE.md — StayFinder: Advanced Search Filters

This file gives Claude full context on this project so every interaction is informed
without needing re-explanation. Read this before taking any action in this repo.

---

## Project Summary

**What:** A client-side travel accommodation search app with advanced filters.
**Why:** Capstone project demonstrating an Agentic SDLC pipeline driven entirely
by Claude (Agents, Skills, Hooks, Prompts, Instructions).
**Stack:** Plain HTML5 + CSS3 + Vanilla JavaScript — single file, no build tools, no npm.
**Run:** Open `index.html` directly in any browser. No server needed.

---

## Agentic SDLC Pipeline Status

| Step | Deliverable | Status | Branch |
|------|-------------|--------|--------|
| 1 | `requirements.md` | ✅ Done | `master` |
| 2 | `architecture.md` | ✅ Done | `master` |
| 3 | `design-review.md` + `architecture.md` updates | ✅ Done | `feature/advanced-search-filters` |
| 4 | `impl-plan.md` | ✅ Done | `feature/advanced-search-filters` |
| 5 | `index.html` implementation + pending fixes | 🔄 In progress | `feature/advanced-search-filters` |
| 6 | Code review via `/code-review` skill | ⏳ Pending | `feature/advanced-search-filters` |
| 7 | Verification via `/verify` skill + `tests.html` | ⏳ Pending | `feature/advanced-search-filters` |
| 8 | PR via `gh` CLI | ⏳ Pending | `feature/advanced-search-filters` → `master` |

---

## Repository

- **Remote:** https://github.com/shashanksinha768/claudecapstoneproject
- **Main branch:** `master`
- **Feature branch:** `feature/advanced-search-filters`
- **Commit strategy:** Commit locally after each step; push all together at Step 8 (PR)
- **Identity:** `shashanksinha768` / `shashank.sinha768@gmail.com`

---

## File Structure

```
claudeCapstoneProject/
├── index.html          # Full app — HTML + CSS + JS in one file
├── tests.html          # In-browser unit test runner (no npm)
├── CLAUDE.md           # This file — project context for Claude
├── requirements.md     # Functional + non-functional requirements
├── architecture.md     # Component diagram, data flow, tech choices
├── design-review.md    # Review findings + agreed design decisions
├── impl-plan.md        # Dependency-ordered implementation task list
├── README.md           # One-paragraph description + how to run
└── .gitignore          # Excludes OS artefacts
```

---

## Architecture in Brief

**Pattern:** Single-page client-side app. No server. No API. Browser is the runtime.

**5 components (all inside `index.html`):**

| Component | What it does |
|-----------|-------------|
| Filter Panel (`<aside>`) | Checkboxes for amenities/type, range slider for score, reset button |
| Filter Engine (`applyFilters`) | OR within categories, AND across categories |
| Data Store (`properties[]`) | Read-only array of 10 hardcoded mock properties |
| Render Engine (`renderCards`) | Updates DOM cards, result count, no-results state |
| Utility Functions | `getActiveAmenities`, `getActiveTypes`, `getMinScore`, `resetFilters` |

**Filter logic:**
```
amenityMatch = (none selected) OR (property has any selected amenity)
typeMatch    = (none selected) OR (property type is in selected types)
scoreMatch   = property.score >= minScore
show         = amenityMatch AND typeMatch AND scoreMatch
```

---

## Key Design Decisions (from design-review.md)

| ID | Decision |
|----|----------|
| DD-01 | `innerHTML` only with hardcoded data — switch to `textContent` if source changes |
| DD-02 | Defensive defaults: missing `amenities→[]`, `score→0`, `type→""` |
| DD-03 | Initial load calls `applyFilters()` directly |
| DD-04 | `filterProperties(properties, state)` is a pure function for testability |
| DD-05 | Score slider uses `requestAnimationFrame` throttle to prevent flicker |
| DD-06 | Slider exposes `aria-valuenow/min/max/valuetext` for screen readers |
| DD-07 | Repo includes `.gitignore` and `tests.html` |
| DD-08 | `README.md` with run instructions |

---

## Pending Implementation Tasks (from impl-plan.md)

These are the outstanding items before Step 6:

| Task | What | Priority |
|------|------|----------|
| TASK-04 | Extract `filterProperties(properties, state)` as pure function + defensive defaults | P1 — unblocks tests |
| TASK-07 | Add ARIA attributes to score slider | P1 |
| TASK-08 | Add `requestAnimationFrame` throttle to slider `oninput` | P2 |
| TASK-10 | Write `tests.html` (blocked until TASK-04 done) | P2 |
| TASK-11 | Create `README.md` and `.gitignore` | P3 |

---

## Coding Conventions

- **No comments** unless the WHY is non-obvious.
- **No external CDN links** — zero network requests, works offline.
- **No `var`** — use `const` / `let` (ES6+).
- **Pure functions** for testable logic — filter logic must not read from DOM directly.
- **Semantic HTML** — use `<article>`, `<aside>`, `<main>`, `<header>`.
- **No inline event handlers on dynamically created elements** — attach via JS when needed.
- **CSS** — Flexbox for layout, CSS Grid for card columns, no external stylesheet.

---

## How Claude Should Behave in This Project

- **Always commit** after completing a step. Do not push until Step 8.
- **Use Skills for their intended steps:**
  - Step 6 → `/code-review` skill
  - Step 7 → `/verify` skill
  - Security check → `/security-review` skill
- **Reference `requirements.md`** when making any implementation decision.
- **Reference `design-review.md`** agreed decisions (DD-01 to DD-08) before writing code.
- **Do not introduce new dependencies** — plain HTML/JS only.
- **Do not refactor beyond** what `impl-plan.md` specifies.
- **Terse responses** — user prefers short updates over long explanations.

---

## Acceptance Criteria (quick reference from requirements.md)

| AC | Test |
|----|------|
| AC-1 | Wi-Fi filter shows only Wi-Fi properties (or both if Breakfast also selected) |
| AC-2 | Hotel + Villa selected shows either type |
| AC-3 | Min score 8 hides properties rated below 8 |
| AC-4 | Combined filters narrow results correctly |
| AC-5 | Reset restores all 10 properties |
| AC-6 | Result count updates immediately on every filter change |
| AC-7 | No-results message shown when filters match nothing |
| AC-8 | UI renders correctly at 375px mobile viewport |
