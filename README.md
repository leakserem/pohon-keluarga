# Family Tree v2.8 patch

Replace these files in the existing project:
- assets/js/app.js
- assets/js/components/searchBox.js

The app.js also injects the required dialog/layout/search/status CSS at runtime, so no HTML change is required.

Fixes:
1. Search now uses the actual IDs from index.html (#searchInput and #memberList).
2. Search filters family data and Enter selects the first match.
3. All main headings are centered.
4. "Aplikasi siap" is moved from the bottom toast into the toolbar menu as a status item.
5. Add/Edit member dialog body becomes scrollable and the footer remains visible, preventing the bottom of the form/table from being cut off.
