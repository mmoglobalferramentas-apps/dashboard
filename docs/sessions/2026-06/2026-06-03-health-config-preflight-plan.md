# Health Config Preflight Plan

Date: 2026-06-03
Project: `dashboard`
Agent: Dex / dev
Command requested: `*develop-preflight`

## AIOS Preflight Result

- Loaded `../.agent/rules/aios.md`.
- Loaded `../.aios-core/development/agents/dev.md`.
- Loaded `../.aios-core/development/tasks/dev-develop-story.md` for preflight behavior.
- Attempted the configured `devLoadAlwaysFiles`; the files under `docs/framework/` and their configured fallbacks are missing in `dashboard/`.
- No `squads/` directory was found in `dashboard/` or the workspace search scope.
- `docs/stories/` exists but contains no story files.
- Formal implementation is blocked by the AIOS Story-Driven Development gate until a valid non-draft story exists.
- `dashboard/` is not inside a Git repository, so no local commit can be created from this workspace.

## Scope

Build Page 05, `Health Config`, using the Paper wireframe only as hierarchy reference.

Do not copy or reuse any Paper element.
Do not create any new component beyond the required Next route page.
Do not add new shadcn primitives.
Reuse only the design-system theme, cataloged components, and existing assets already present in the project.
Do not display mock health benchmarks when real configuration data is available.

## Existing Sources Of Truth

- Theme and tokens: `app/globals.css`
- App fonts and root dark theme: `app/layout.tsx`
- Catalog page: `app/catalog/page.tsx`
- Catalog handoff: `docs/sessions/2026-06/2026-06-02-dashboard-catalog-components.md`
- Dashboard planning: `planejamento-dash.md`
- Backend and schema plan: `migration-plan.md`
- Backend handoff: `docs/sessions/2026-06/2026-06-02-dashboard-backend-migration-plan.md`
- Existing dashboard route patterns: `app/dashboard/page.tsx` and `app/dashboard/leads/page.tsx`

## Wireframe Interpretation

The Paper artboard `5 - Health Config` is a desktop hierarchy reference only. It communicates:

- Compact dashboard sidebar with Health active.
- Header with page context and a save action.
- Niche selection based on `market + country`.
- A copy-from-another-niche action.
- A list of existing niches.
- Editable benchmark rows with metric, target value, and unit.
- A restrained visual context card using the Health Config image asset.

The definitive visual implementation must come from the project catalog and theme, not from Paper styles or elements.

## Catalog Components To Reuse

- Sidebar composition from the cataloged dashboard shell pattern
- `Button`
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- `Input`
- `Label`
- `Badge`
- `Alert`, `AlertTitle`, `AlertDescription`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
- `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent`
- Existing lucide icons: `HeartPulse`, `LayoutDashboard`, `Table2`, `UserRound`, `LockKeyhole`, `ClipboardCopy`
- `Image` from Next

## Existing Asset

- `/images/dashboard/funnel-health-img.png`

Use it as a compact benchmark context card. It should support the page identity without competing with the editable configuration.

## Data Contract

Use real health configuration data only.

Primary source:

- `public.dashboard_health_metrics`

Required fields already planned in `migration-plan.md`:

- `id`
- `market`
- `country`
- `metric_key`
- `metric_label`
- `target_value`
- `unit`
- `direction`
- `recommendations`
- `updated_at`

The page must treat `market + country` as the niche identity and render metric rows from the API response rather than hardcoding the three catalog preview rows.

The browser must not query Supabase directly. Reads and writes must go through authenticated Cloudflare Pages Functions, with authorization enforced server-side:

- Authenticated users may read health metric configuration.
- Only `admin` users may save or copy health metric configuration.
- Viewer users should receive a read-only UI state if they can access the page.

Current blocker:

- The SQL migration and Pages Functions endpoints are not implemented yet, according to the backend handoff.
- The implementation story must include or depend on those backend contracts before the page can show editable real data.

## Proposed Route

Use `app/dashboard/health/page.tsx`.

Reason: Health Config is a dashboard subpage and the existing dashboard navigation already includes a Health destination placeholder.

The future implementation may update existing Health navigation destinations to `/dashboard/health`, but it should not refactor the shared dashboard shell or unrelated navigation behavior.

## Page Structure

1. Dashboard shell
   - Use the existing dark dashboard workspace and sidebar composition.
   - Mark Health as the active navigation item.
   - Keep the route implementation self-contained; do not extract a new layout component.

2. Header
   - Page label: `Health Config`.
   - Page title: `Metricas de Saude`.
   - Small status badge for the selected niche or access mode.
   - Reuse `Button` for `Salvar alteracoes`.
   - Disable or omit the save action for viewer users.

3. Niche selection panel
   - Reuse `Label + Select` for Market.
   - Reuse `Label + Select` for Country.
   - Populate both selectors from real available niche values.
   - Show the selected `market + country` context using existing text and `Badge` patterns.
   - Do not create a custom niche selector component.

4. Copy-from-niche action
   - Reuse the cataloged `Button + ClipboardCopy` pattern.
   - Reuse an existing `Select` for choosing the source niche when the action is activated.
   - Copy values only after explicit user confirmation within the existing controls.
   - Persist the copied values through the authenticated admin API; do not copy only in the browser and pretend it is saved.

5. Existing niches list
   - Render available niches from real API data.
   - Reuse `Button` or `Badge` states for selection.
   - Do not add a new list or navigation component.

6. Benchmark editor
   - Reuse the cataloged Health Config benchmark row composition.
   - Use existing `Table` primitives for stable metric, target, and unit columns.
   - Render `metric_label`, `target_value`, and `unit` from the API.
   - Use `Input` for editable target values.
   - Keep unit read-only unless the backend story explicitly permits unit editing.
   - Respect `direction` in supporting copy or labels when needed; do not invent additional controls.

7. Visual context card
   - Reuse `Card` and `/images/dashboard/funnel-health-img.png`.
   - Keep the image secondary to the form and hide or reposition it on narrow screens if needed.

8. States
   - Loading: use the existing card and table surfaces without a new skeleton component.
   - Empty: explain that no benchmarks exist for the selected niche and avoid fabricated values.
   - Error: use existing text, `Card`, or `Alert` only if the already imported primitive is needed.
   - Unsaved changes: use existing `Badge` or button state; do not add a new notification system.

## Implementation Rules

- Create only the required route file under `app/dashboard/health/`.
- Do not create or modify files under `components/`.
- Do not extract `DashboardLayout`, `HealthConfigForm`, `NicheSelector`, `BenchmarkRow`, or similar components.
- Do not add new shadcn primitives or dependencies.
- Do not copy the catalog preview into a new reusable component; translate its approved composition directly into the route.
- Do not hardcode benchmark rows, markets, countries, or niche lists when real API data exists.
- Do not change the database schema as part of the frontend page implementation.
- Preserve existing working pages: `/`, `/login`, `/catalog`, `/dashboard`, and `/dashboard/leads`.
- Use current theme tokens only: `bg-background`, `bg-card`, `bg-sidebar`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-secondary`, and `bg-accent`.

## Validation Plan

1. Confirm a valid non-draft implementation story exists.
2. Confirm the `dashboard_health_metrics` migration and authenticated Pages Functions read/write endpoints exist.
3. Confirm admin and viewer authorization behavior at the API boundary.
4. Run `npm run build`.
5. Start `npm run dev`.
6. Check `/dashboard/health` on desktop and mobile.
7. Verify metric rows align, target inputs remain usable, and no content overlaps.
8. Verify changing niche reloads real benchmark values.
9. Verify copying a niche requires explicit action and persists through the API.
10. Verify viewer users cannot save changes.
11. Verify empty and error states do not show mock benchmarks.
12. Verify `/`, `/login`, `/catalog`, `/dashboard`, and `/dashboard/leads` still render.
13. Commit changes if the project is placed inside a Git repository.

## Open Questions Before Implementation

1. Which non-draft story ID owns Page 05, `Health Config`?
2. Will the same story implement the `dashboard_health_metrics` migration and Pages Functions endpoints, or will those be delivered first?
3. Should viewer users see Health Config in read-only mode, or should the route be admin-only?
4. Should copying from another niche overwrite every metric immediately after confirmation, or only fill the form until `Salvar alteracoes` is pressed?

## Recommended Next Step

Create or identify the non-draft story for Page 05 and ensure the real health metric API contract is available. Then implement `app/dashboard/health/page.tsx` using only the cataloged primitives and existing asset listed above.
