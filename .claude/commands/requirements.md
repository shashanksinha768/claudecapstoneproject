You are executing **Step 1** of the StayFinder Agentic SDLC pipeline.

Create `requirements.md` in the project root. The document must cover the
feature described in the initial user story (check any existing context files
or ask the user if none exist).

## Structure to produce

### 1. Functional Requirements (FR-1 to FR-n)
For each requirement write:
- **FR-n — Title**: one-sentence description of what the user can do.

Minimum set for a filter feature:
- Amenity filter (multi-select, OR logic)
- Property type filter (multi-select, OR logic)
- Score/rating range filter
- Combined filter logic (AND across categories)
- Reset all filters
- Result count display
- No-results state

### 2. Non-Functional Requirements (NFR-1 to NFR-n)
Cover at minimum:
- Performance (response time target)
- Responsive layout (minimum viewport width)
- Accessibility (WCAG 2.1 AA)
- Technology constraints (no npm / plain HTML+JS if applicable)
- Data source (mock / live API)

### 3. Acceptance Criteria (AC-1 to AC-n)
Each AC must be independently testable. Format:
- **AC-n**: Given [state], when [action], then [observable result].

Acceptance criteria must cover every FR plus edge cases:
OR logic, combined filters, reset, count update, no-results message,
mobile layout.

## Rules
- Use markdown tables for FR and NFR sections.
- ACs must be written so a QA engineer can test them without reading the code.
- Do not include implementation details (no function names, no HTML IDs).
- Save the file, then commit: `docs: add requirements for <feature name>`.
