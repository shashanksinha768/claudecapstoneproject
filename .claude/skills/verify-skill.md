# Skill: verify-skill

**Purpose:** Define the acceptance gates and pass/fail rules for Step 7 verification.
This skill defines HOW to verify — the agent invoking it runs the actual commands.

---

## Acceptance gates (all 3 must pass)

| Gate | Command | Expected |
|------|---------|----------|
| Logic suite | `node verify.js` | `55/55 passed, 0 failed` |
| Browser suite | `node verify-browser.js` | `38/38 passed, 0 failed` |
| In-browser runner | Open `tests.html` in browser | Green banner: `13/13 tests passed — all green` |

---

## Pass protocol

1. Run `node verify.js`. Report full output. If any test fails, diagnose and fix before continuing.
2. Run `node verify-browser.js`. Pre-requisite: `npm install && npx playwright install chromium`.
3. Instruct the user to open `tests.html` in a browser and confirm the green banner.
4. Only mark Step 7 done when ALL 3 gates pass.

---

## Failure protocol

- Read the failure message carefully.
- Determine whether it is a test assertion error (wrong expected value) or a real app bug.
- Fix the underlying issue in `index.html` or `tests.html` as appropriate.
- Re-run all gates — do NOT mark done until all pass.
- Do NOT silence or skip a failing test.

---

## After all gates pass

- Commit: `test(verify): Step-7 verification all gates green`.
- Update `CLAUDE.md` pipeline status table: Step 7 → ✅ Done.
- Report full test output inline.
