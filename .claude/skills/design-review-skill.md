# Skill: design-review-skill

**Purpose:** Define the review angles and output structure for producing `design-review.md`.
This skill defines HOW to conduct a design review — the agent invoking it supplies the input files.

---

## Review angles (cover all 8)

1. **Security** — XSS vectors, injection risks, unsafe DOM APIs (`innerHTML`, `eval`, unescaped attribute values)
2. **Error handling / defensive defaults** — what happens when data fields are missing, null, or the wrong type
3. **Accessibility** — ARIA attributes, live regions, keyboard navigation, colour contrast (WCAG 2.1 AA)
4. **Testability** — can the business logic be tested without a DOM? Is the filter function a pure function?
5. **DOM coupling** — do business-logic functions read from the DOM directly? Can tests inject state without touching the DOM?
6. **Data flow clarity** — is the initial page-load render path explicit? Is there a gap between architecture diagram and real call sequence?
7. **Performance** — throttling/debouncing concerns on rapid-fire events (range slider `oninput`)
8. **Conventions compliance** — does the architecture violate any rules in `CLAUDE.md`?

---

## Output structure to produce in `design-review.md`

### Findings table
| # | Area | Severity | Finding | Recommendation |

Severity: 🔴 High / 🟡 Medium / 🟢 Low

### Agreed Design Decisions (DD-01 to DD-n)
For each finding that requires a code decision, record the agreed resolution:
| DD-n | Decision text (what will be implemented) |

### Architecture updates required
List which sections of `architecture.md` must be updated and why.

---

## Rules
- Every finding must have a concrete recommendation, not just an observation.
- DD entries must be unambiguous enough that an engineer can implement them without a follow-up question.
- After writing `design-review.md`, apply all architecture updates to `architecture.md`.
- Commit both files: `docs: add design review findings and update architecture`.
