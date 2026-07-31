Verify that the current `index.html` implementation satisfies every requirement
in `requirements.md` and every acceptance criterion (AC-1 to AC-8).

## Steps

1. Read `requirements.md` in full. Extract the 7 functional requirements
   (FR-1 to FR-7), 5 non-functional requirements (NFR-1 to NFR-5), and
   8 acceptance criteria (AC-1 to AC-8).

2. Read `index.html` in full. For each requirement and AC, trace the code
   path that satisfies it and confirm:
   - The relevant HTML element or JS function exists
   - The logic is correct (OR-within / AND-across for filters)
   - Edge cases are handled (no filter selected = show all; empty results)

3. Run `node verify.js` to execute the automated headless suite (55 tests
   covering all 13 unit cases + all 8 ACs + edge cases + document quality).
   Report the result inline.

4. Check the 5 non-functional requirements:
   - NFR-1 (300ms): confirm `requestAnimationFrame` throttle is on the slider
   - NFR-2 (375px mobile): confirm `@media (max-width: 700px)` rule exists with
     `flex-direction: column` on `.layout`
   - NFR-3 (WCAG 2.1 AA): confirm 4 ARIA attributes on slider, `aria-live`
     on `<main>`, all checkboxes have associated `<label>` elements
   - NFR-4 (plain HTML/JS): confirm no `<script src="...">` tags pointing to
     external CDNs
   - NFR-5 (10 mock properties): confirm `properties[]` array has exactly 10
     records

5. Produce a verdict table:

   | ID | Requirement | Status | Evidence |
   |----|-------------|--------|---------|
   | FR-1 | Amenity filter | ✅/❌ | function name / line |
   | ... | ... | ... | ... |
   | AC-1 | Wi-Fi → only Wi-Fi properties | ✅/❌ | test result |
   | ... | ... | ... | ... |

   End with: **Overall: PASS** (all green) or **Overall: FAIL** (list failures).

## Scope

Read-only — do not modify any files. If you find a failing requirement,
report it as a finding and suggest the fix, but do not apply it.
