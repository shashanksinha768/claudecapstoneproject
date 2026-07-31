# Design Review: Advanced Search Filters — StayFinder

> Reviewer: Claude (acting as senior reviewer)
> Input: `architecture.md` v1 + `requirements.md`
> Branch: `feature/advanced-search-filters`

---

## Review Summary

| Area | Status | Finding Count |
|------|--------|---------------|
| Security | ⚠️ Risk | 1 |
| Error Handling | ⚠️ Gap | 2 |
| Accessibility | ⚠️ Gap | 1 |
| Testability | ⚠️ Gap | 2 |
| Component Coupling | ⚠️ Risk | 1 |
| Data Flow Completeness | ⚠️ Gap | 1 |
| File Structure | ⚠️ Gap | 1 |
| Slider UX | ⚠️ Risk | 1 |

**Total findings: 10 | Blockers: 0 | Agreed fixes: 8**

---

## Findings & Agreed Decisions

---

### RISK-01 — XSS via innerHTML in Render Engine
**Severity:** Medium
**Location:** Section 4.4 — Render Engine (`renderCards()`)

**Risk:** The architecture uses `innerHTML` to inject property data into the DOM. Even though data is hardcoded today, this pattern is unsafe if the data source ever changes to user-supplied or API-driven content. The architecture does not mention this risk or a mitigation.

**Decision:** Add an explicit note in the architecture that `innerHTML` is acceptable **only** because data is a hardcoded constant. If the data source changes, template literals must be replaced with `textContent` or DOM API calls. Document this in Constraints.

**Action:** Update `architecture.md` Section 8 (Constraints & Limitations). ✅

---

### GAP-01 — No Error Handling Strategy Documented
**Severity:** Medium
**Location:** Section 4.2 — Filter Engine

**Gap:** If a property record is missing the `amenities` field (e.g., `undefined` instead of `[]`), calling `.includes()` on it throws a `TypeError`. The architecture defines the schema but does not document a defensive strategy.

**Decision:** Filter Engine must treat missing/undefined fields as empty defaults:
- `p.amenities` → default to `[]` if falsy
- `p.score` → default to `0` if falsy
- `p.type` → default to `""` if falsy

Document a "defensive defaults" rule in the Filter Engine section.

**Action:** Update `architecture.md` Section 4.2. ✅

---

### GAP-02 — No Initial Page Load Flow in Data Flow Diagram
**Severity:** Low
**Location:** Section 5 — Data Flow Diagram

**Gap:** The data flow diagram starts with "User Interaction" but doesn't show the initial render on page load. A reader cannot tell how the page populates on first load.

**Decision:** Add an "Initial Load" path to the data flow diagram:
```
Page Load → applyFilters() called directly → renderCards(all properties)
```

**Action:** Update `architecture.md` Section 5. ✅

---

### GAP-03 — No Test Strategy Mentioned
**Severity:** Medium
**Location:** Architecture overall — no testing section exists

**Gap:** The architecture has no mention of how components are tested (Step 7 of the SDLC requires a verification suite). There is no test file in the file structure.

**Decision:** Add a Testing Approach section documenting:
- Unit tests for Filter Engine logic (`applyFilters()`) using a plain JS test runner
- A `tests.html` file that runs assertions in the browser (no npm needed, consistent with NFR-4)
- Test coverage targets: happy path + edge cases (no filters, all filters, no results)

**Action:** Update `architecture.md` Section 6 (File Structure) and add Section 9 (Testing Approach). ✅

---

### GAP-04 — Filter Engine is Tightly Coupled to the DOM
**Severity:** Low
**Location:** Section 4.2 — Filter Engine, Section 4.5 — Utility Functions

**Gap:** `getActiveAmenities()`, `getActiveTypes()`, and `getMinScore()` read directly from DOM elements by ID. This couples the business logic to the HTML structure, making it harder to unit test the filter logic in isolation.

**Decision:** Acknowledge this as a known trade-off for a single-file vanilla JS app. Document that for testability, the `applyFilters()` function accepts an optional state parameter in tests (bypassing DOM reads). This approach avoids refactoring the app structure while still enabling unit testing.

**Action:** Update `architecture.md` Section 4.2 and Section 9 (Testing Approach). ✅

---

### RISK-02 — Score Slider Fires Rapidly on Drag (Visual Flicker)
**Severity:** Low
**Location:** Section 7 — Key Design Decisions ("no debounce needed")

**Risk:** The architecture states no debounce is needed because the dataset is small. However, `oninput` fires on every pixel of slider movement, causing `innerHTML` of the cards container to be replaced many times per second during drag. This causes visual flicker.

**Decision:** Add a `requestAnimationFrame` throttle to the slider `oninput` handler to batch rapid updates to one render per animation frame (~16ms). This is lighter than a debounce and eliminates flicker without perceptible delay.

**Action:** Update `architecture.md` Section 7 (Key Design Decisions) and update `index.html`. ✅

---

### GAP-05 — Accessibility Strategy Incomplete
**Severity:** Medium
**Location:** Section 4.1 — Filter Panel, NFR-3

**Gap:** NFR-3 requires WCAG 2.1 AA compliance. The architecture mentions `aria-label` on the `<aside>` and `aria-live="polite"` on results, but does not document:
- How the score slider communicates its current value to screen readers (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`)
- Whether the result count update is announced to screen readers

**Decision:** Document required ARIA attributes for the score slider and confirm `aria-live="polite"` on the results `<main>` region covers the result count announcement.

**Action:** Update `architecture.md` Section 4.1 and update `index.html`. ✅

---

### GAP-06 — File Structure Missing .gitignore and Test File
**Severity:** Low
**Location:** Section 6 — File Structure

**Gap:** The file structure lists only 3 files. It is missing:
- `.gitignore` — OS files (`.DS_Store`, `Thumbs.db`) should be excluded
- `tests.html` — test runner file (agreed in GAP-03)

**Decision:** Add both files to the file structure diagram.

**Action:** Update `architecture.md` Section 6. ✅

---

### RISK-03 — No README for Project Onboarding
**Severity:** Low
**Location:** Section 6 — File Structure

**Risk:** A new contributor opening the repo has no instructions on how to run the app or what it does.

**Decision:** Add `README.md` to the file structure with instructions: "open `index.html` in a browser." Keep it minimal.

**Action:** Update `architecture.md` Section 6. Note: README to be created during implementation. ✅

---

## Agreed Design Decisions (Summary)

| ID | Decision |
|----|----------|
| DD-01 | `innerHTML` is permitted only for hardcoded data; must switch to `textContent` if data source changes |
| DD-02 | Filter Engine applies defensive defaults for missing fields (`amenities: []`, `score: 0`, `type: ""`) |
| DD-03 | Initial page load calls `applyFilters()` directly (already implemented; document it) |
| DD-04 | Tests use optional state injection to bypass DOM coupling in unit tests |
| DD-05 | Score slider uses `requestAnimationFrame` throttle to prevent visual flicker |
| DD-06 | ARIA attributes on slider: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext` |
| DD-07 | Add `.gitignore` and `tests.html` to file structure |
| DD-08 | Add `README.md` with run instructions |

---

## Architecture Changes Required

The following sections of `architecture.md` will be updated as a result of this review:

- **Section 4.1** — Add ARIA slider attributes
- **Section 4.2** — Add defensive defaults rule; add DOM-coupling trade-off note
- **Section 5** — Add initial page load path to data flow diagram
- **Section 6** — Add `.gitignore`, `tests.html`, `README.md` to file structure
- **Section 7** — Update debounce decision to `requestAnimationFrame` throttle
- **Section 8** — Add XSS/innerHTML constraint
- **Section 9 (new)** — Testing Approach

---

## No Changes Required

- Architecture style (single HTML file) — appropriate for scope
- Technology choices — all valid and justified
- OR-within / AND-across filter logic — correctly specified
- Read-only data array — sound design
- CSS Grid for responsive layout — correct approach
