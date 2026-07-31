# Skill: pr-skill

**Purpose:** Define the PR body structure and commit rules for Step 8.
This skill defines HOW to create the PR — the agent invoking it runs the git/gh commands.

---

## PR body sections (all required)

### ## Summary
2–3 sentences: what was built, why, and what technology was used.

### ## Changes Made
Two tables:
- New files: filename | what it does
- Modified files: filename | what changed
- Call out any files NOT committed (e.g. `.git/hooks/`) and why.

### ## Test Evidence
Paste the exact output of:
- `node verify.js` (last 10 lines including the RESULT line)
- `node verify-browser.js` (last 5 lines including BROWSER RESULT)
- Pre-commit hook output from the most recent commit

### ## Known Limitations
Table: Item | Detail.
Include: anything out of scope per requirements, portability issues, architectural constraints (DD-01).

### ## Agentic SDLC Pipeline — Completion Status
Table showing all 8 steps and their ✅ Done status.

### ## Reviewer Checklist
Tick-list grouped into: Functional | Accessibility | Mobile | Tests | Code quality.
Every AC from `requirements.md` must appear as a checkbox.
Reviewer must be able to verify each item by opening `index.html` — no code reading required.

Footer line:
`🤖 Generated with [Claude Code](https://claude.ai/claude-code) — Agentic SDLC Pipeline (Steps 1–8)`

---

## Commands to run

```bash
git push -u origin feature/advanced-search-filters
gh pr create --title "feat: <feature name>" --base master --head feature/advanced-search-filters --body "..."
```

---

## After PR is created

- Update `CLAUDE.md` pipeline status table: Step 8 → ✅ Done.
- Commit: `chore: mark Step 8 complete in pipeline status`.
- Report the PR URL.

---

## Rules
- If PR already exists: report "PR already open at [url] — skipping create." and mark Step 8 done.
- Do NOT force-push if `git push` fails — report the error and ask for instructions.
