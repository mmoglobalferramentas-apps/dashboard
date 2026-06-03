# Dashboard Catalog Component Mapping

Date: 2026-06-02

## Scope

Expanded the existing `/catalog` design-system page for the APP dashboard phase without implementing dashboard pages.

## Inputs Reviewed

- `planejamento-dash.md`
- `styles/global.css` and `app/globals.css`
- Existing catalog page and local shadcn components
- Paper MCP wireframe on page `App Screens`

## Paper Wireframe Interpretation

Paper contains five desktop artboards:

- Page 01: Login
- Page 02: Funnel Overview
- Page 03: Leads Table
- Page 04: Lead Detail
- Page 05: Health Config

The wireframe was used only as a mock-up to infer hierarchy and component needs. No Paper elements were copied into code.

## Components Added Or Cataloged

- Imported shadcn primitives: input, label, select, checkbox, progress, alert, table, tooltip, popover
- Added local shadcn-style wrappers for pagination and calendar after the CLI stopped at an overwrite prompt for the existing button component
- Cataloged dashboard-specific compositions:
  - Sidebar shell and icon navigation
  - Conditional checkbox + input filter
  - Date selector pattern
  - Funnel progress rows
  - Alert card for health warnings
  - Leads table with badges and pagination
  - Lead detail identity/timeline pattern
  - Health config benchmark rows
  - Copy button pattern

## Assets Organized

Copied dashboard assets into `public/images/dashboard/`:

- `login-img.png`
- `mountains-funnel-flux.png`
- `lead-detail-img.png`
- `funnel-health-img.png`

Raw assets remain untouched in `assets-raw/`.

## Verification

- `npm run build` passed
- Rendered `/catalog` locally at `http://localhost:3000/catalog`
- Captured browser screenshots for the catalog and dashboard mapping anchor

## Notes

- The project folder does not appear to be inside a Git repository, so no commit could be created from this workspace.
- Existing LP catalog content was preserved and the APP dashboard catalog was appended as new sections.
