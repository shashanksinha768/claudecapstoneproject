# Skill: frontend-filter-testing

**Purpose:** Retroactively doc-check the StayFinder `index.html` implementation
against `requirements.md` and the agreed design decisions in `design-review.md`.
Use this skill any time `index.html` or `tests.html` is changed to confirm
nothing regressed.

---

## What you do when this skill is invoked

Read the four reference documents before touching any code:
1. `requirements.md` — the 7 FRs, 5 NFRs, and 8 ACs that the implementation must satisfy.
2. `design-review.md` — the 8 agreed design decisions DD-01 through DD-08.
3. `index.html` — the live implementation.
4. `tests.html` — the in-browser unit test runner.

Then work through each checklist section below and report findings.

---

## Checklist A — Functional Requirements (requirements.md FR-1 to FR-7)

For each FR, locate the relevant code in `index.html` and confirm it exists and is correct:

| FR | What to verify in `index.html` |
|----|-------------------------------|
| FR-1 | Amenity checkboxes (`#wifi`, `#breakfast`) trigger `applyFilters()`; `filterProperties` uses OR logic within amenities |
| FR-2 | Type checkboxes (`#hotel`, `#villa`) trigger `applyFilters()`; `filterProperties` uses OR logic within types |
| FR-3 | `#score-range` slider present, min=1, max=10; `getMinScore()` reads it; `filterProperties` applies `>=` comparison |
| FR-4 | `filterProperties` combines amenityMatch AND typeMatch AND scoreMatch |
| FR-5 | `resetFilters()` clears all controls and calls `applyFilters()` |
| FR-6 | `#result-count` updated in `renderCards()` with `Showing X of Y properties` |
| FR-7 | `#no-results` element toggled in `renderCards()` when `list.length === 0` |

Report: ✅ present and correct | ⚠️ present but wrong | ❌ missing.

---

## Checklist B — Design Decisions (design-review.md DD-01 to DD-08)

| DD | What to verify |
|----|---------------|
| DD-01 | `innerHTML` only used with hardcoded `properties[]` array — no user input injected |
| DD-02 | `filterProperties` uses `p.amenities \|\| []`, `p.score \|\| 0`, `p.type \|\| ""` defensive defaults |
| DD-03 | `applyFilters()` called directly at script end (no `DOMContentLoaded` wrapper) |
| DD-04 | `filterProperties(props, state)` is a standalone pure function; tests.html calls it without touching the DOM |
| DD-05 | Slider `oninput` calls `scheduleFilter()` which uses `requestAnimationFrame` throttle |
| DD-06 | Score slider has `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`; `updateScoreLabel()` updates all four dynamically |
| DD-07 | `tests.html` exists at repo root; `.gitignore` exists |
| DD-08 | `README.md` exists with run instructions |

---

## Checklist C — Acceptance Criteria (requirements.md AC-1 to AC-8)

Trace through `filterProperties` logic with these exact inputs and confirm the expected output:

| AC | Input state | Expected output |
|----|-------------|----------------|
| AC-1 | `amenities:["wifi"]` | Only ids with wifi in their `amenities[]` |
| AC-2 | `types:["hotel","villa"]` | All 10 properties (OR, so all pass) |
| AC-3 | `minScore: 8` | Only properties with score ≥ 8 |
| AC-4 | `amenities:["wifi"], types:["hotel"], minScore:8.5` | Only ids 1 and 5 |
| AC-5 | `amenities:[], types:[], minScore:1` | All 10 properties |
| AC-6 | After any filter change | `renderCards` always calls `countLabel.textContent` update |
| AC-7 | `amenities:["breakfast"], types:["villa"], minScore:9.6` | Empty array → no-results shown |
| AC-8 | (structural) | `@media (max-width: 700px)` exists; `.layout` goes `flex-direction: column` |

---

## Checklist D — Render Engine guards (from Step 6 code review)

These were added in commit `74f07cb` — verify they are present:

- `escapeAttr(s)` function exists and is called for `aria-label="${escapeAttr(p.name)}"`
- `renderCards` uses local `safeType = p.type || ""` (not `p.type.charAt(0)` directly)
- `renderCards` uses local `safeAmenities = p.amenities || []` (not `p.amenities.length` directly)

---

## Output format

After each checklist, summarise as:

```
Checklist A: X/7 pass  (list any ⚠️/❌)
Checklist B: X/8 pass  (list any ⚠️/❌)
Checklist C: X/8 pass  (list any ⚠️/❌)
Checklist D: X/3 pass  (list any ⚠️/❌)
Overall: PASS | FAIL | PARTIAL
```

If anything is ❌ or ⚠️, state the file path, line number, and the specific rule it violates.
Do not make any code changes — this skill is read-only. File bugs in the chat only.
