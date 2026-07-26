You are executing **Step 3** of the StayFinder Agentic SDLC pipeline.

Read `requirements.md` and `architecture.md` in full before writing anything.

Create `design-review.md` in the project root AND update `architecture.md`
with any decisions that require architectural changes.

## Your review must cover these 8 angles

1. **Security** — XSS vectors, injection risks, unsafe DOM APIs (`innerHTML`,
   `eval`, unescaped attribute values)
2. **Error handling / defensive defaults** — what happens when data fields
   are missing, null, or the wrong type
3. **Accessibility** — ARIA attributes, live regions, keyboard navigation,
   colour contrast (WCAG 2.1 AA)
4. **Testability** — can the business logic be tested without a DOM? Is the
   filter function a pure function or is it coupled to DOM reads?
5. **DOM coupling** — do business-logic functions read from the DOM directly?
   Can tests inject state without touching the DOM?
6. **Data flow clarity** — is the initial page-load render path explicit?
   Is there a gap between the architecture diagram and the real call sequence?
7. **Performance** — are there throttling/debouncing concerns on rapid-fire
   events (range slider `oninput`)
8. **Conventions compliance** — does the architecture violate any rules in
   `CLAUDE.md`?

## Structure to produce in design-review.md

### Findings table
| # | Area | Severity | Finding | Recommendation |

Severity: 🔴 High / 🟡 Medium / 🟢 Low

### Agreed Design Decisions (DD-01 to DD-n)
For each finding that requires a code decision, record the agreed resolution:
| DD-n | Decision text (what will be implemented) |

### Architecture updates required
List which sections of `architecture.md` must be updated and why.

## Rules
- Every finding must have a concrete recommendation, not just an observation.
- DD entries must be unambiguous enough that an engineer can implement them
  without asking a follow-up question.
- After writing design-review.md, apply all architecture updates to
  architecture.md.
- Commit both files: `docs: add design review findings and update architecture`.
