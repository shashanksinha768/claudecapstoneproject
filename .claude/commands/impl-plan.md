You are executing **Step 4** of the StayFinder Agentic SDLC pipeline.

Read `requirements.md`, `architecture.md`, and `design-review.md` in full
before writing anything.

Create `impl-plan.md` in the project root.

## Structure to produce

### Dependency Graph
ASCII diagram showing which tasks block which other tasks.
Tasks that have no dependencies can start immediately.
Tasks that are blocked must wait for their dependencies to complete.

### Task List (dependency order)

For each task write a section with:

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

## Mandatory tasks to include (adapt names to the feature)

- **P0** — Project scaffolding (git repo, branch, .gitignore, README)
- **P0** — HTML skeleton + CSS layout
- **P0** — Mock data store
- **P1** — Filter engine (pure function refactor + defensive defaults — DD-04, DD-02)
- **P1** — Render engine
- **P1** — Utility functions + reset
- **P1** — Accessibility: ARIA attributes on interactive controls (DD-06)
- **P2** — requestAnimationFrame throttle on range slider (DD-05)
- **P1** — Initial page-load wire-up (DD-03)
- **P2** — Tests (tests.html — blocked until pure function exists)
- **P3** — README + final verification

## Rules
- Tasks that depend on each other must be in the correct order.
- Every design decision (DD-01 to DD-n) must map to at least one task.
- Mark already-completed items as ✅ if any implementation exists.
- Save the file, then commit: `docs: add dependency-ordered implementation plan`.
