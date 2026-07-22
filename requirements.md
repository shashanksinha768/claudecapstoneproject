# Requirements: Advanced Search Filters for Accommodation Search

## User Story

> As a traveler, I want to filter accommodation search results by amenities, property type, and customer review score, so that I can quickly find properties that match my specific preferences without being overwhelmed by irrelevant options.

---

## Background

The current search feature allows filtering only by destination, travel dates, and number of passengers. Users struggle to narrow down results further, leading to frustration and poor experience. This feature adds advanced filters to address that gap.

---

## Functional Requirements

### FR-1: Amenity Filters
- The user can filter results by one or more amenities.
- Supported amenities: **Free Wi-Fi**, **Breakfast Included**.
- Filter logic: **OR** — a property is shown if it matches *any* selected amenity.

### FR-2: Property Type Filter
- The user can filter results by property type.
- Supported types: **Hotel**, **Villa**.
- Filter logic: **OR** — a property is shown if it matches *any* selected type.

### FR-3: Customer Review Score Filter
- The user can filter results by a minimum customer review score.
- Score range: 1–10 (numeric).
- A property is shown if its review score is **greater than or equal to** the selected minimum.

### FR-4: Combined Filters
- All active filters are applied together using **AND** logic across filter categories.
  - Example: Amenity = Wi-Fi OR Breakfast **AND** Type = Hotel OR Villa **AND** Score >= 8.
- Selecting no options within a filter category means that category is not applied (show all).

### FR-5: Filter Reset
- The user can reset all filters to their default (unselected) state with a single action.
- Resetting restores the full unfiltered result list.

### FR-6: Result Display
- Each accommodation card must display: name, property type, amenities, review score, and price per night.
- The result count (e.g., "Showing 4 of 10 properties") must update dynamically as filters change.

### FR-7: No Results State
- If no properties match the active filters, display a clear "No results found" message.

---

## Non-Functional Requirements

### NFR-1: Performance
- Filter results must update within **300ms** of a user interaction (checkbox toggle, slider change).
- All filtering is performed client-side with no network requests.

### NFR-2: Responsiveness
- The UI must be usable on screen widths from **375px** (mobile) to **1440px** (desktop).
- Filter panel must stack vertically on small screens.

### NFR-3: Accessibility
- All interactive controls (checkboxes, range input, buttons) must have visible labels.
- Colour contrast must meet WCAG 2.1 AA minimum (4.5:1 for normal text).

### NFR-4: Browser Compatibility
- Must work in the latest versions of Chrome, Firefox, and Edge.
- No build tools or npm packages — plain HTML, CSS, and vanilla JavaScript only.

### NFR-5: Data
- Accommodation data is hardcoded mock data (minimum 10 sample properties).
- No external API calls or database connections.

---

## Out of Scope

- User authentication or login.
- Booking or payment flows.
- Real-time availability data.
- Sorting (by price, rating, etc.) — future enhancement.
- Map view.

---

## Acceptance Criteria

| ID | Criteria |
|----|----------|
| AC-1 | Selecting "Free Wi-Fi" shows only properties that have Wi-Fi (or both amenities if Breakfast is also selected). |
| AC-2 | Selecting "Hotel" and "Villa" shows properties of either type. |
| AC-3 | Setting minimum review score to 8 hides all properties rated below 8. |
| AC-4 | Combining amenity + type + score filters narrows results correctly. |
| AC-5 | Clicking "Reset Filters" restores all 10 mock properties. |
| AC-6 | Result count label updates immediately on every filter change. |
| AC-7 | When no properties match, the "No results found" message is displayed. |
| AC-8 | UI renders correctly on a 375px-wide mobile viewport. |
