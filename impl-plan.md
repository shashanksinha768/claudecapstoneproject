# Implementation Plan: Advanced Search Filters — StayFinder

> Source: `architecture.md` (post design-review) + `design-review.md`
> Branch: `feature/advanced-search-filters`

---

## Status Key

| Symbol | Meaning |
|--------|---------|
| ✅ | Done |
| 🔄 | In progress |
| ⏳ | Pending — unblocked |
| 🔒 | Blocked — cannot start until dependency completes |

---

## Dependency Graph

```
TASK-01 (Project Scaffolding)
    │
    ├──▶ TASK-02 (HTML Structure + CSS Layout)
    │         │
    │         ├──▶ TASK-03 (Mock Data Store)
    │         │         │
    │         │         └──▶ TASK-04 (Filter Engine — pure function)
    │         │                   │
    │         │         ┌─────────┤
    │         │         │         │
    │         │         ▼         ▼
    │         │    TASK-05     TASK-06
    │         │  (Render       (Utility
    │         │   Engine)      Functions
    │         │      │         + Reset)
    │         │      └────┬────┘
    │         │           │
    │         └──▶ TASK-07 (Accessibility — ARIA)
    │                     │
    │                     ▼
    │              TASK-08 (rAF Throttle on Slider)
    │                     │
    │                     ▼
    │              TASK-09 (Initial Page Load Wire-up)
    │                     │
    │                     ▼
    │              TASK-10 (Tests — tests.html)
    │                     │
    │                     ▼
    │              TASK-11 (README + Final Verification)
```

---

## Task List (Dependency Order)

---

### TASK-01 — Project Scaffolding ✅
**Priority:** P0 — must complete first
**Depends on:** nothing
**Blocks:** TASK-02

| Item | Action |
|------|--------|
| Git repo initialised | ✅ Done |
| Feature branch created | ✅ Done (`feature/advanced-search-filters`) |
| `.gitignore` | ⏳ Create — exclude `Thumbs.db`, `.DS_Store`, `*.log` |
| `README.md` | ⏳ Create — one-paragraph description + "open index.html in browser" |

---

### TASK-02 — HTML Skeleton + CSS Layout ✅
**Priority:** P0 — foundation for all UI tasks
**Depends on:** TASK-01
**Blocks:** TASK-05, TASK-06, TASK-07

| Item | Action |
|------|--------|
| Semantic HTML (`<header>`, `<aside>`, `<main>`, `<article>`) | ✅ Done |
| CSS responsive layout (Flexbox row → column at 700px) | ✅ Done |
| CSS card grid (CSS Grid, auto-fill, minmax 280px) | ✅ Done |
| Filter panel sticky positioning | ✅ Done |
| Colour contrast ≥ 4.5:1 (WCAG AA) | ✅ Done |

---

### TASK-03 — Mock Data Store ✅
**Priority:** P0 — required by Filter Engine and Render Engine
**Depends on:** TASK-01
**Blocks:** TASK-04

| Item | Action |
|------|--------|
| `properties[]` constant with 10 records | ✅ Done |
| Schema: `{ id, name, type, amenities[], score, price, emoji }` | ✅ Done |
| Minimum 2 hotels + 2 villas with varied amenity/score combinations | ✅ Done |
| Records cover all filter edge cases (no amenities, max score, min score) | ✅ Done |

---

### TASK-04 — Filter Engine (Pure Function Refactor) ⏳
**Priority:** P1 — core business logic; must be testable in isolation
**Depends on:** TASK-03
**Blocks:** TASK-05, TASK-06, TASK-09, TASK-10

| Item | Action |
|------|--------|
| Extract `filterProperties(properties, state)` as a pure function | ⏳ Refactor from existing `applyFilters()` |
| `state` shape: `{ amenities: [], types: [], minScore: 1 }` | ⏳ Define |
| OR logic within amenities category | ✅ Done (in existing `applyFilters`) |
| OR logic within types category | ✅ Done |
| AND logic across all categories | ✅ Done |
| "No category selected = show all" default per category | ✅ Done |
| Defensive defaults: missing `amenities` → `[]`, `score` → `0`, `type` → `""` (DD-02) | ⏳ Add |

> **Note:** This is the most critical refactor. `filterProperties()` must be a pure function so `tests.html` can call it without a DOM.

---

### TASK-05 — Render Engine ✅
**Priority:** P1 — outputs visible results to user
**Depends on:** TASK-02, TASK-04
**Blocks:** TASK-09

| Item | Action |
|------|--------|
| `renderCards(filteredList)` function | ✅ Done |
| Property card template (name, type badge, amenity tags, score, price) | ✅ Done |
| Result count label: `Showing X of Y properties` | ✅ Done |
| "No results found" message toggle | ✅ Done |
| `innerHTML` used only with hardcoded data (DD-01 constraint acknowledged) | ✅ Done |

---

### TASK-06 — Utility Functions + Reset ✅
**Priority:** P1 — connects Filter Panel to Filter Engine
**Depends on:** TASK-02, TASK-04
**Blocks:** TASK-09

| Item | Action |
|------|--------|
| `getActiveAmenities()` — reads checked amenity checkboxes | ✅ Done |
| `getActiveTypes()` — reads checked type checkboxes | ✅ Done |
| `getMinScore()` — reads range slider value | ✅ Done |
| `updateScoreLabel(val)` — updates score badge text | ✅ Done |
| `resetFilters()` — clears all controls, calls `applyFilters()` | ✅ Done |

---

### TASK-07 — Accessibility (ARIA) ⏳
**Priority:** P1 — required by NFR-3 (WCAG 2.1 AA)
**Depends on:** TASK-02
**Blocks:** TASK-08

| Item | Action |
|------|--------|
| `<aside aria-label="Search filters">` | ✅ Done |
| `<main aria-live="polite">` on results region | ✅ Done |
| Score slider: add `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext` (DD-06) | ⏳ Add to `index.html` |
| Update `aria-valuenow` and `aria-valuetext` dynamically in `updateScoreLabel()` | ⏳ Add to JS |
| All checkboxes have associated `<label>` elements | ✅ Done |

---

### TASK-08 — requestAnimationFrame Throttle on Slider ⏳
**Priority:** P2 — prevents visual flicker on drag (DD-05)
**Depends on:** TASK-07
**Blocks:** TASK-09

| Item | Action |
|------|--------|
| Wrap slider `oninput` handler in `requestAnimationFrame` | ⏳ Add to `index.html` |
| Ensure `updateScoreLabel()` still fires synchronously (before rAF) for instant label update | ⏳ Verify |
| Confirm filter results update within 300ms on drag (NFR-1) | ⏳ Manual test |

---

### TASK-09 — Initial Page Load Wire-up ✅
**Priority:** P1 — users must see results on first open
**Depends on:** TASK-05, TASK-06, TASK-08
**Blocks:** TASK-10

| Item | Action |
|------|--------|
| `applyFilters()` called on script load (not waiting for user interaction) | ✅ Done |
| All 10 properties visible with no filters active | ✅ Done |
| Result count shows `Showing 10 of 10 properties` on load | ✅ Done |

---

### TASK-10 — Tests (tests.html) ⏳
**Priority:** P2 — required by Step 7 (Verify) and GAP-03
**Depends on:** TASK-04 (pure `filterProperties()` function)
**Blocks:** TASK-11

| Test Case | Coverage |
|-----------|----------|
| No filters → all 10 properties returned | Happy path |
| Amenity = `wifi` only → correct subset | FR-1 |
| Amenity = `breakfast` only → correct subset | FR-1 |
| Amenity = `wifi` + `breakfast` → union of both | FR-1 OR logic |
| Type = `hotel` only → correct subset | FR-2 |
| Type = `villa` only → correct subset | FR-2 |
| Type = `hotel` + `villa` → all 10 | FR-2 OR logic |
| Min score = `9` → only high-rated | FR-3 |
| Amenity + Type + Score combined → intersection | FR-4 |
| Reset → all 10 restored | FR-5 |
| Impossible filter combo → 0 results | FR-7 edge case |
| Property missing `amenities` field → no crash | DD-02 defensive defaults |

---

### TASK-11 — README + Final Verification ⏳
**Priority:** P3 — project completeness
**Depends on:** TASK-10
**Blocks:** nothing (final task)

| Item | Action |
|------|--------|
| `README.md` with project description and "open index.html in browser" instructions | ⏳ Create |
| `.gitignore` with OS artefact exclusions | ⏳ Create |
| Manual smoke test against all 8 acceptance criteria from `requirements.md` | ⏳ Run |
| Verify mobile layout at 375px viewport width (NFR-2, AC-8) | ⏳ Check in browser DevTools |

---

## Summary Table

| Task | Description | Status | Depends On |
|------|-------------|--------|------------|
| TASK-01 | Project scaffolding | ⏳ Partial | — |
| TASK-02 | HTML skeleton + CSS layout | ✅ Done | TASK-01 |
| TASK-03 | Mock data store | ✅ Done | TASK-01 |
| TASK-04 | Filter Engine — pure function refactor + defensive defaults | ⏳ Pending | TASK-03 |
| TASK-05 | Render Engine | ✅ Done | TASK-02, TASK-04 |
| TASK-06 | Utility functions + reset | ✅ Done | TASK-02, TASK-04 |
| TASK-07 | Accessibility — ARIA on slider | ⏳ Pending | TASK-02 |
| TASK-08 | rAF throttle on slider | ⏳ Pending | TASK-07 |
| TASK-09 | Initial page load wire-up | ✅ Done | TASK-05, TASK-06, TASK-08 |
| TASK-10 | Tests — tests.html | 🔒 Blocked by TASK-04 | TASK-04 |
| TASK-11 | README + final verification | 🔒 Blocked by TASK-10 | TASK-10 |

---

## Blocked Tasks

| Task | Blocked By | Reason |
|------|-----------|--------|
| TASK-10 (tests.html) | TASK-04 | Tests call `filterProperties()` directly — the pure function must exist first |
| TASK-11 (README + verify) | TASK-10 | Final verification should run after tests pass |
