# Funnel Overview Preflight Plan

Date: 2026-06-02
Project: `dashboard`
Agent: Dex / dev
Command requested: `*develop-preflight`

## AIOS Preflight Result

- Loaded `.agent/rules/aios.md`.
- Loaded `.aios-core/development/agents/dev.md`.
- Loaded `dev-develop-story.md` for preflight behavior.
- Attempted `devLoadAlwaysFiles`; configured files under `docs/framework/` are missing in the workspace.
- No `squads/` directory exists in `dashboard/` or workspace root.
- Formal implementation is blocked by AIOS Story-Driven Development gate until a valid non-draft story exists.
- The `dashboard` folder is not inside a Git repository, so no commit can be created from this workspace.

## Scope

Build the Funnel Overview home page of the app using only planned/cataloged components and existing assets.

Do not create new reusable components.
Do not reuse Paper/wireframe components.
Use the wireframe only as hierarchy reference.

## Existing Sources Of Truth

- Theme: `app/globals.css`
- App layout and fonts: `app/layout.tsx`
- Catalog page: `app/catalog/page.tsx`
- Catalog handoff: `docs/sessions/2026-06/2026-06-02-dashboard-catalog-components.md`
- Dashboard planning: `planejamento-dash.md`
- Frontend briefing: `briefing-frontend.md`
- Existing login implementation: `app/login/page.tsx`

## Components Allowed From Catalog

- Sidebar composition from `DashboardSidebarPreview`
- `Button`
- `Select`
- `Popover`
- `Calendar`
- `Progress`
- `Badge`
- `Alert`
- `Card`
- `Tooltip`
- `Label`
- Existing lucide icons
- `Image` from Next

## Assets Allowed

- `/images/logos/iconWhite.svg`
- `/images/logos/logoWhite.svg`
- `/images/dashboard/mountains-funnel-flux.png`

## Proposed Route

Use `app/dashboard/page.tsx` for the first authenticated dashboard screen.

Reason: `/login` already exists, `/` is the landing page, and Funnel Overview is the app home after login.

## Page Structure

1. Dashboard shell
   - Full-height dark workspace using current `dark` theme.
   - Left fixed sidebar using the cataloged sidebar composition.
   - Main content area with responsive padding and no nested card shell.

2. Header and filters
   - Page title: `Funnel Overview`.
   - Small status badge such as `Live funnel data`.
   - Filters row:
     - Funnel `Select`
     - Country `Select`
     - Date `Popover + Calendar`
   - Values can be static placeholders only for visual shell unless real data integration is included in the story.

3. KPI rail
   - Four compact `Card` blocks:
     - Total visitors
     - ICs
     - Purchases
     - Checkout conversion
   - Use `Badge` for trend/status labels.
   - Keep typography dense and operational, not landing-page scale.

4. Funnel passage panel
   - Main `Card` using the cataloged `FunnelPreview` pattern.
   - Rows:
     - Pagina de Captura
     - Quiz / Presell
     - Pagina de Vendas
     - Clique no IC
     - Venda confirmada
   - Each row uses `Progress`, count, percent, and optional `Badge`.

5. Health alert
   - `Alert` below or beside the funnel flow.
   - Warn when a metric is below configured benchmark.
   - Keep recommendation text concise and non-automated unless backend health rules are in scope.

6. Visual context card
   - Use `/images/dashboard/mountains-funnel-flux.png`.
   - Image should support the page identity, not replace operational data.

## Implementation Rules

- Implement page directly in the route file first.
- Do not add files under `components/`.
- Do not extract a dashboard layout component yet.
- Do not add new shadcn primitives.
- Do not introduce mock data if real data integration is part of the active story.
- If implementation story does not include backend integration, use explicit UI placeholder constants and label them as temporary static visual shell in the story notes.
- Preserve existing working pages: `/`, `/catalog`, `/login`.
- Use current theme tokens only: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-secondary`, `bg-accent`.

## Validation Plan

1. Run `npm run build`.
2. Start `npm run dev`.
3. Check `/dashboard` desktop and mobile.
4. Verify no text overlap, especially sidebar, filters, KPI cards, and funnel rows.
5. Confirm `/`, `/login`, and `/catalog` still render.
6. If git becomes available, commit before moving to another task.

## Open Questions Before Implementation

1. Which story ID should own the Funnel Overview implementation?
2. Should the first implementation be a static visual shell or must it connect to real Supabase viewer data immediately?
3. What exact route should the app use after login: `/dashboard`, `/overview`, or another path?

## Recommended Next Step

Create or identify the non-draft story for Page 02 Funnel Overview, then implement `app/dashboard/page.tsx` using only the cataloged components listed above.
