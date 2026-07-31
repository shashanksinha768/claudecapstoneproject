# Skill: impl-plan-skill

**Purpose:** Define the output structure and rules for producing `impl-plan.md`.
This skill defines HOW to write an implementation plan — the agent invoking it supplies the input files.

---

## Output structure to produce in `impl-plan.md`

### Dependency Graph
ASCII diagram showing which tasks block which other tasks.
Tasks with no dependencies can start immediately. Blocked tasks must wait.

### Task List (dependency order)

For each task:

```
### TASK-nn — <Title> <status emoji>
**Priority:** P0/P1/P2/P3 — one-line justification
**Depends on:** TASK-xx, TASK-yy (or: nothing)
**Blocks:** TASK-xx, TASK-yy (or: nothing)

| Item | Action |
|------|--------|
| <specific deliverable> | ✅ Done / ⏳ Pending / 🔒 Blocked |
```

### Status Key
| Symbol | Meaning |
| ✅ | Done |
| 🔄 | In progress |
| ⏳ | Pending — unblocked |
| 🔒 | Blocked |

### Summary Table
| Task | Description | Status | Depends On |

---

## Mandatory tasks to include

- **P0** — Project scaffolding (git repo, branch, .gitignore, README)
- **P0** — HTML skeleton + CSS layout
- **P0** — Mock data store
- **P1** — Filter engine (pure function refactor + defensive defaults)
- **P1** — Render engine
- **P1** — Utility functions + reset
- **P1** — Accessibility: ARIA attributes on interactive controls
- **P2** — requestAnimationFrame throttle on range slider
- **P1** — Initial page-load wire-up
- **P2** — Tests (tests.html — blocked until pure function exists)
- **P3** — README + final verification

---

## Rules
- Tasks that depend on each other must be in the correct order.
- Every design decision (DD-01 to DD-n) must map to at least one task.
- Mark already-completed items as ✅ if any implementation exists.
- Commit message: `docs: add dependency-ordered implementation plan`.
