You are executing **Step 8** of the StayFinder Agentic SDLC pipeline.

Before creating the PR, confirm all earlier steps are complete:
- `node verify.js` → 55/55 passed
- `node verify-browser.js` → 38/38 passed
- CLAUDE.md pipeline table shows Steps 1–7 as ✅ Done

## What to produce

### 1. Push the feature branch
```bash
git push -u origin feature/advanced-search-filters
```

### 2. Create the PR via gh CLI
```bash
gh pr create --title "feat: <feature name>" --base master --head feature/advanced-search-filters --body "..."
```

### 3. PR body must contain all of these sections

**## Summary**
2–3 sentences: what was built, why, and what technology was used.

**## Changes Made**
Two tables:
- New files: filename | what it does
- Modified files: filename | what changed
- Call out any files that were NOT committed (e.g. `.git/hooks/`) and why.

**## Test Evidence**
Paste the exact output of:
- `node verify.js` (last 10 lines including the RESULT line)
- `node verify-browser.js` (last 5 lines including BROWSER RESULT)
- Pre-commit hook output from the most recent commit

**## Known Limitations**
Table: Item | Detail
Include anything that is out of scope per requirements, any portability
issues with scripts, any architectural constraints documented in DD-01.

**## Agentic SDLC Pipeline — Completion Status**
Table showing all 8 steps and their ✅ Done status.

**## Reviewer Checklist**
Tick-list grouped into: Functional | Accessibility | Mobile | Tests | Code quality.
Every AC from `requirements.md` must appear as a checkbox.
The reviewer must be able to verify each item by opening `index.html` in a
browser — no code reading required.

Footer line:
`🤖 Generated with [Claude Code](https://claude.ai/claude-code) — Agentic SDLC Pipeline (Steps 1–8)`

## After PR is created

- Update `CLAUDE.md` pipeline status table: Step 8 → ✅ Done.
- Commit the CLAUDE.md update: `chore: mark Step 8 complete in pipeline status`.
- Report the PR URL.
