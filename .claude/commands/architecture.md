You are executing **Step 2** of the StayFinder Agentic SDLC pipeline.

Read `requirements.md` in full before writing anything.

Create `architecture.md` in the project root.

## Structure to produce

### 1. Architecture Style
State the pattern (e.g. single-page client-side SPA-lite) and justify why
it satisfies the NFRs.

### 2. High-Level Component Diagram
ASCII block diagram showing all major components and their relationships.
For a filter feature the minimum components are:
- Filter Panel (UI layer)
- Filter Engine (business logic)
- Data Store (in-memory or API)
- Render Engine (DOM layer)
- Utility Functions

### 3. Technology Choices
Table: Concern | Choice | Reason. Cover markup, styling, logic, data,
fonts/icons, build.

### 4. Component Breakdown & Responsibilities
One sub-section per component. Each must state:
- File location
- Responsibilities (bullet list)
- Any accessibility requirements (ARIA attributes, live regions)
- Any security constraints (innerHTML vs textContent)

### 5. Data Flow Diagram
ASCII flow showing: page load path AND user-interaction path, from
user gesture → filter state → filtered data → DOM update.

### 6. File Structure
Tree showing every file that will exist in the repo after implementation.

### 7. Key Design Decisions
Table: Decision | Rationale. Include at minimum:
- Single file vs multi-file
- Framework vs vanilla JS
- Filter combination logic (OR-within / AND-across)
- Data mutability (read-only array)

### 8. Constraints & Limitations
What the architecture cannot do and why.

### 9. Testing Approach
How the app will be tested without npm (in-browser runner, pure functions,
state injection pattern).

## Rules
- Every section from the design-review.md agreed decisions (DD-01 to DD-08)
  must be traceable to a section in this document.
- Save the file, then commit: `docs: add architecture for <feature name>`.
