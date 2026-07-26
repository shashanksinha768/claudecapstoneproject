You are executing **Step 6** of the StayFinder Agentic SDLC pipeline.

Read `CLAUDE.md`, `requirements.md`, `design-review.md`, `index.html`, and
`tests.html` before starting the review.

Run the `/code-review` skill at `--effort high` to perform the full
multi-angle review of the feature branch diff.

## What to review

Scope: everything on `feature/advanced-search-filters` that is not yet on
`master` — run `git diff master..HEAD` to get the diff.

## Review angles (passed to the /code-review skill)

The skill will run 8 finder angles automatically. Make sure the following
project-specific concerns are surfaced:

1. **renderCards safety** — does `renderCards` apply its own defensive
   defaults (`safeType`, `safeAmenities`, `escapeAttr`) independently of
   `filterProperties`? A malformed record with `type=undefined` or
   `amenities=undefined` can pass through `filterProperties` when no filter
   is active — `renderCards` must not crash on it.

2. **Test correctness** — are all expected values in `tests.html` assertions
   actually correct? Trace each one through the data (e.g. a minScore boundary
   test using `>=` when `==` is intended).

3. **filterProperties duplication** — `tests.html` copies `filterProperties`
   verbatim from `index.html`. Any logic drift means tests pass against stale
   code. Check whether the two copies are in sync.

4. **ARIA completeness** — the score slider must have all four attributes
   (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`) AND
   `updateScoreLabel()` must update `aria-valuenow` and `aria-valuetext`
   dynamically on every `oninput`.

5. **CLAUDE.md conventions** — no `var`, no external CDN, no inline handlers
   on dynamically created elements, pure function for filter logic.

## After the review

- Report findings with `ReportFindings` tool (most-severe first).
- Apply all CONFIRMED and PLAUSIBLE fixes to `index.html` and `tests.html`.
- Commit: `fix(review): apply Step-6 code-review findings`.
