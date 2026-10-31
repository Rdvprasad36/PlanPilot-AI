# Accessibility Guide (WCAG 2.2 AA)

## Standards Compliance
- Semantic landmarks (`header`, `main`, `nav`, `footer`).
- Focus rings (min 2px solid #5B3FD9 with 3:1 contrast).
- All form fields have visible labels and aria descriptions.
- Live regions (`aria-live="polite"`) for dynamic announcements.
- Jest-axe unit tests and Playwright axe E2E checks in CI.
