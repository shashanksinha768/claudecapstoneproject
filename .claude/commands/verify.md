You are executing **Step 7** of the StayFinder Agentic SDLC pipeline.

Run the `/verify` skill to perform runtime verification of the feature.

## What to verify

1. **Headless logic suite** — run `node verify.js`.
   All 55 tests must pass (T01–T13 unit cases, AC-1–AC-8, defensive defaults,
   edge cases, document quality checks).
   If any test fails: diagnose, fix, re-run. Do not report PASS until the
   suite is green.

2. **Browser UI suite** — run `node verify-browser.js`.
   All 38 Playwright tests must pass (live filter interactions, ARIA updates,
   no-results state, reset, mobile 375px viewport).
   Pre-requisite: `npm install playwright && npx playwright install chromium`.

3. **tests.html in-browser** — instruct the user to open `tests.html` in a
   browser and confirm the summary banner shows:
   `"13/13 tests passed — all green"` (green background).

## Acceptance gates

| Gate | Command | Expected |
|------|---------|----------|
| Logic suite | `node verify.js` | `55/55 passed, 0 failed` |
| Browser suite | `node verify-browser.js` | `38/38 passed, 0 failed` |
| In-browser runner | Open `tests.html` | Green banner, 13/13 |

## If a gate fails

- Read the failure message carefully.
- Check whether it is a test assertion error (wrong expected value in
  `verify.js` or `tests.html`) or a real app bug.
- Fix the underlying issue in `index.html` or `tests.html` as appropriate.
- Re-run all gates before reporting PASS.

## After all gates pass

- Commit: `test(verify): Step-7 verification all gates green`.
- Update `CLAUDE.md` pipeline status table: Step 7 → ✅ Done.
- Report the `/verify` skill verdict inline with the full test output.
