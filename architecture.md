# Architecture: Advanced Search Filters — StayFinder

> Based on `requirements.md` | Tech stack: Plain HTML + CSS + Vanilla JavaScript (no build tools)

---

## 1. Architecture Style

**Single-Page Client-Side Application (SPA-lite)**

All logic — data, filtering, and rendering — lives in a single HTML file delivered statically. There is no server, no API, and no build pipeline. The browser is the entire runtime.

This choice satisfies:
- NFR-4: No npm / build tools
- NFR-1: Sub-300ms filtering (in-memory, no network)
- NFR-5: Hardcoded mock data

---

## 2. High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Runtime)                     │
│                                                             │
│  ┌──────────────┐        ┌──────────────────────────────┐  │
│  │  Filter Panel │──────▶│       Filter Engine           │  │
│  │  (UI Layer)   │       │  (Business Logic Layer)       │  │
│  │               │       │                              │  │
│  │ • Amenity     │       │  applyFilters()              │  │
│  │   Checkboxes  │       │  - amenityMatch (OR)         │  │
│  │ • Type        │       │  - typeMatch    (OR)         │  │
│  │   Checkboxes  │       │  - scoreMatch   (>=)         │  │
│  │ • Score Slider│       │  - combined     (AND)        │  │
│  │ • Reset Btn   │       │                              │  │
│  └──────────────┘       └──────────┬───────────────────┘  │
│                                     │                        │
│                          ┌──────────▼───────────────────┐  │
│                          │       Data Store              │  │
│                          │  (In-Memory JS Array)         │  │
│                          │                              │  │
│                          │  properties[]                │  │
│                          │  { id, name, type,           │  │
│                          │    amenities[], score,       │  │
│                          │    price, emoji }            │  │
│                          └──────────┬───────────────────┘  │
│                                     │                        │
│                          ┌──────────▼───────────────────┐  │
│                          │      Render Engine            │  │
│                          │  (DOM Manipulation Layer)     │  │
│                          │                              │  │
│                          │  renderCards(filteredList)   │  │
│                          │  - Property Cards            │  │
│                          │  - Result Count Label        │  │
│                          │  - No Results Message        │  │
│                          └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Choices

| Concern | Choice | Reason |
|---------|--------|--------|
| Markup | HTML5 | Semantic elements (`<article>`, `<aside>`, `<main>`) for accessibility |
| Styling | CSS3 (inline `<style>`) | No external stylesheet dependency; CSS Grid + Flexbox for responsive layout |
| Logic | Vanilla JavaScript (ES6+) | No framework overhead; `Array.filter()` is sufficient for in-memory filtering |
| Data | JS `const` array (hardcoded) | Satisfies NFR-5; no fetch/XHR needed |
| Fonts/Icons | System fonts + Unicode emoji | Zero external requests; works offline |
| Build | None | Single `.html` file, open directly in browser |

---

## 4. Component Breakdown & Responsibilities

### 4.1 Filter Panel (UI Layer)
**File location:** `<aside>` block in `index.html`
**Responsibilities:**
- Render amenity checkboxes (Free Wi-Fi, Breakfast Included)
- Render property type checkboxes (Hotel, Villa)
- Render review score range slider (min 1, max 10)
- Render Reset Filters button
- Fire `applyFilters()` on every user interaction (`onchange`, `oninput`)

### 4.2 Filter Engine (Business Logic Layer)
**File location:** `<script>` block — `applyFilters()` function
**Responsibilities:**
- Read current state of all filter controls
- Apply OR logic within each filter category (amenities, types)
- Apply AND logic across filter categories
- Pass filtered result array to the Render Engine
- Handle the "no filter selected = show all" case per category

**Filter Logic Pseudocode:**
```
for each property p:
  amenityMatch = (no amenities selected) OR (p.amenities ∩ selectedAmenities ≠ ∅)
  typeMatch    = (no types selected)     OR (p.type ∈ selectedTypes)
  scoreMatch   = p.score >= minScore
  include p    = amenityMatch AND typeMatch AND scoreMatch
```

### 4.3 Data Store (In-Memory)
**File location:** `<script>` block — `properties[]` constant
**Responsibilities:**
- Hold all 10 mock accommodation records
- Each record schema: `{ id, name, type, amenities[], score, price, emoji }`
- Source of truth for all render and filter operations
- Read-only at runtime (filters never mutate the array)

### 4.4 Render Engine (DOM Layer)
**File location:** `<script>` block — `renderCards()` function
**Responsibilities:**
- Accept filtered property array and update the DOM
- Generate HTML for each property card (name, type badge, amenity tags, score, price)
- Update result count label (`Showing X of Y properties`)
- Toggle "No results found" message when filtered list is empty

### 4.5 Utility Functions
**File location:** `<script>` block
**Responsibilities:**
- `getActiveAmenities()` — reads checked amenity checkboxes
- `getActiveTypes()` — reads checked type checkboxes
- `getMinScore()` — reads slider value
- `updateScoreLabel()` — updates the score display badge
- `resetFilters()` — clears all controls and re-renders

---

## 5. Data Flow Diagram

```
User Interaction
      │
      ▼
Filter Panel (onChange / onInput)
      │
      ▼
applyFilters()
      │
      ├── getActiveAmenities()  ──▶ reads DOM checkboxes
      ├── getActiveTypes()      ──▶ reads DOM checkboxes
      └── getMinScore()         ──▶ reads DOM range input
      │
      ▼
properties[].filter(p => amenityMatch AND typeMatch AND scoreMatch)
      │
      ▼
renderCards(filteredList)
      │
      ├── Update #cards-container innerHTML
      ├── Update #result-count text
      └── Toggle #no-results visibility
      │
      ▼
User sees updated results (target: < 300ms)
```

---

## 6. File Structure

```
claudeCapstoneProject/
├── index.html          # Entire application (HTML + CSS + JS in one file)
├── requirements.md     # Functional & non-functional requirements
└── architecture.md     # This document
```

---

## 7. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Single HTML file | Zero setup; satisfies NFR-4; easy to share and open |
| No DOM framework (React/Vue) | Overkill for 10 records; avoids CDN dependency |
| In-memory filtering (no debounce) | Dataset is small (10 items); 300ms NFR easily met without debounce |
| OR within / AND across categories | Matches FR-4; most intuitive UX for multi-select filters |
| Read-only data array | Prevents accidental mutation bugs; filter state lives only in the DOM controls |
| CSS Grid for cards | Auto-fills columns responsively without media query breakpoints on the card grid |

---

## 8. Constraints & Limitations

- **No persistence** — filter state resets on page reload (no localStorage used).
- **No sorting** — out of scope per requirements.
- **Mock data only** — swapping in a real API would require architectural changes (async fetch, loading state).
- **Single file** — as the app grows, splitting into separate CSS/JS files would improve maintainability.
