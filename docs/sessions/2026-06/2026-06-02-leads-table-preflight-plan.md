# Leads Table Preflight Plan

Date: 2026-06-02
Project: `dashboard`
Agent: Dex / dev
Command requested: `*develop-preflight`

## AIOS Preflight Result

- Loaded `../.agent/rules/aios.md`.
- Loaded `../.aios-core/development/agents/dev.md`.
- Loaded `../.aios-core/development/tasks/dev-develop-story.md` for preflight behavior.
- Attempted configured `devLoadAlwaysFiles`; `docs/framework/` files are missing in `dashboard/`.
- No `squads/` directory was found in `dashboard/` or the workspace search scope.
- No story files exist under `docs/stories/`; formal implementation is blocked by the AIOS Story-Driven Development gate until a valid non-draft story exists.
- `dashboard/` is not inside a Git repository, so a local commit cannot be created from this workspace.

## Scope

Build Page 03, `Leads Table`, using the Paper wireframe only as hierarchy reference.

Do not copy or reuse any Paper element.
Do not create new reusable components.
Do not add new shadcn primitives.
Reuse only the design-system/theme and cataloged components already present in the project.

## Existing Sources Of Truth

- Theme and tokens: `app/globals.css`
- App fonts/layout: `app/layout.tsx`
- Catalog page: `app/catalog/page.tsx`
- Catalog handoff: `docs/sessions/2026-06/2026-06-02-dashboard-catalog-components.md`
- Dashboard planning: `planejamento-dash.md`
- Backend data plan: `migration-plan.md`

## Catalog Components To Reuse

- Sidebar composition from the cataloged dashboard shell pattern
- `Button`
- `Select`
- `Popover`
- `Calendar`
- `Checkbox`
- `Input`
- `Label`
- `Badge`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
- `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`
- `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent`
- Existing lucide icons: `Table2`, `LayoutDashboard`, `HeartPulse`, `UserRound`, `LockKeyhole`, `Gauge`, `CalendarDays`, `Filter`, `ClipboardCopy`

## Data Contract

Use real dashboard data only.

Primary read source should be the planned `public.vw_dashboard_leads`, exposed through a backend endpoint rather than queried directly by the browser.

Fields planned in `migration-plan.md`:

- lead contact fields from `attributes`
- `lead_id`
- `funnel_id`
- country resolved from `metadata`
- market
- first/last seen timestamps
- status badges derived from `lead_status`, `lead_stage`, and relevant event existence

If the endpoint/view is not implemented when development starts, the page implementation should halt or implement only a clearly marked wiring shell behind the story's explicit approval. Do not seed fake rows when real telemetry tables exist.

## Proposed Route

Use `app/dashboard/leads/page.tsx`.

Reason: `/` is the landing page, `/login` already exists, and Page 03 is a dashboard subpage. Sidebar should mark `Leads` as active.

## Page Structure

1. Dashboard shell
   - Full-height workspace using the existing `.dark` dashboard token set.
   - Left sidebar follows the cataloged sidebar composition.
   - Main content uses constrained, operational spacing with no nested page-level cards.

2. Header
   - Title: `Leads`.
   - Status badge: `Live lead data` or equivalent.
   - Secondary line: compact result summary from the backend, for example total leads in current filter.

3. Required filters
   - Date selector: `Popover + Calendar`.
   - Funnel selector: `Select`, populated from available funnel options.
   - Country selector: `Select`, populated from available country options.
   - These are always visible because planning defines them as base filters.

4. Conditional filters
   - Use the cataloged checkbox + input pattern.
   - Optional filters:
     - `Lead ID` checkbox reveals `Input`.
     - `Contato` checkbox reveals `Input`.
     - `IC realizado` checkbox applies a boolean event/status filter.
     - `Compra realizada` checkbox applies a boolean event/status filter.
   - Keep filter chips stable in height so toggling inputs does not shift the whole page awkwardly.

5. Leads table
   - Columns:
     - `Contato`
     - `Lead ID`
     - `Pais`
     - `Mercado`
     - `Funil`
     - `Ultimo evento`
     - `Status`
   - Event/status badges use existing `Badge` variants:
     - `accent` for `IC`
     - `secondary` for `VENDA`
     - `outline` for neutral/incomplete states
   - Row click should navigate to the existing planned lead detail route only if that route is in the same story; otherwise keep row action out of scope.

6. Pagination
   - Reuse cataloged `Pagination`.
   - Summary text should come from backend pagination metadata.
   - Do not implement infinite scroll for this version.

7. Empty/loading/error states
   - Use the existing table shell and cataloged primitives.
   - Empty state can use logo/icon assets only if already present in `public/images/logos`.
   - Error state should be plain and actionable; no new alert component is needed unless the existing `Alert` is reused.

## Implementation Rules

- Implement inside the route file first.
- Do not create files under `components/`.
- Do not extract `DashboardLayout`, `LeadsTable`, `FilterBar`, or similar components yet.
- Do not duplicate the catalog page preview as a new component; translate the approved pattern into the route using existing primitives.
- Do not change working pages: `/`, `/login`, `/catalog`.
- Do not alter database schema for this page plan.
- Use current theme classes only: `bg-background`, `bg-card`, `bg-sidebar`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-secondary`, `bg-accent`.

## Validation Plan

1. Confirm the implementation story exists and is not draft.
2. Confirm the real data endpoint for `vw_dashboard_leads` exists or is included in the story.
3. Run `npm run build`.
4. Start `npm run dev`.
5. Check `/dashboard/leads` on desktop and mobile.
6. Verify filter toggles do not cause text overlap or unstable table layout.
7. Verify `/`, `/login`, and `/catalog` still render.
8. Commit changes if the project is placed inside a Git repository.

## Open Questions Before Implementation

1. Which non-draft story ID owns Page 03, `Leads Table`?
2. Is the real endpoint for `vw_dashboard_leads` already available, or should the same story include it?
3. Should clicking a lead row navigate to Page 04 in this story, or should navigation wait for the Lead Detail story?

## Recommended Next Step

Create or identify the non-draft story for Page 03, then implement `app/dashboard/leads/page.tsx` with real data from the dashboard leads endpoint and only the cataloged primitives listed above.
