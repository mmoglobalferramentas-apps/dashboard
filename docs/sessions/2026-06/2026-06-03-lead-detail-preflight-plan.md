# Lead Detail Preflight Plan

Date: 2026-06-03
Project: `dashboard`
Agent: Dex / dev
Command requested: `*develop-preflight`

## AIOS Preflight Result

- Loaded `../.agent/rules/aios.md`.
- Loaded `../.aios-core/development/agents/dev.md`.
- Loaded `../.aios-core/development/tasks/dev-develop-story.md` for preflight behavior.
- Attempted the configured `devLoadAlwaysFiles`; the files under `docs/framework/` and their configured architecture fallbacks are missing in the project/workspace.
- No `squads/` directory was found in `dashboard/` or the workspace search scope.
- No story files exist under `docs/stories/`; formal implementation is blocked by the AIOS Story-Driven Development gate until a valid non-draft story exists.
- `dashboard/` and its parent workspace are not inside a Git repository, so a local commit cannot be created from this workspace.

## Scope

Build Page 04, `Lead Detail`, using the Paper wireframe only as hierarchy reference.

Do not copy or reuse any Paper element.
Do not create new reusable components.
Do not add new shadcn primitives.
Reuse only the design-system theme, cataloged compositions, existing UI primitives, lucide icons, and organized assets already present in the project.
Do not use the mock rows currently present in `app/dashboard/leads/page.tsx` as the source for this page.

## Existing Sources Of Truth

- Theme and tokens: `app/globals.css`
- App fonts/layout: `app/layout.tsx`
- Catalog page: `app/catalog/page.tsx`
- Cataloged composition: `LeadDetailPreview` in `app/catalog/page.tsx`
- Catalog handoff: `docs/sessions/2026-06/2026-06-02-dashboard-catalog-components.md`
- Existing dashboard shell patterns: `app/dashboard/page.tsx` and `app/dashboard/leads/page.tsx`
- Dashboard planning: `planejamento-dash.md`
- Backend/API plan: `migration-plan.md`

## Catalog Components To Reuse

- Sidebar composition from the cataloged dashboard shell pattern
- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`
- `Avatar`, `AvatarFallback`
- `Button`
- `Badge`
- `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent`
- `Image` from Next
- `Link` from Next
- Existing lucide icons:
  - `LayoutDashboard`
  - `Table2`
  - `HeartPulse`
  - `UserRound`
  - `LockKeyhole`
  - `ClipboardCopy`
- Existing `cn` utility for conditional theme classes

## Asset To Reuse

- `/images/dashboard/lead-detail-img.png`

The asset is already organized under `public/images/dashboard/`, is cataloged for Page 04, and should be used as a supporting visual inside the lead identity panel. It must not replace operational lead data.

## Proposed Route

Use `app/dashboard/leads/[leadId]/page.tsx`, rendered at `/dashboard/leads/{leadId}`.

Reason:

- Lead Detail is a child investigation view of the existing `/dashboard/leads` page.
- The lead identity is already represented by `lead_id` in the planned dashboard data contract.
- A dynamic route allows the Leads Table to link to real lead records without duplicating a page per lead.
- The route file should contain the page composition directly; no files should be added under `components/`.

## Real Data Contract

The browser must not query Supabase telemetry tables directly and must not receive the service role key.

The frontend should consume one authenticated Pages Functions endpoint, proposed as:

```text
GET /api/dashboard/leads/:leadId
```

The endpoint should return:

```ts
type LeadDetailResponse = {
  lead: {
    leadId: string
    contact: string | null
    funnelId: string
    country: string | null
    market: string | null
    source: string | null
    campaign: string | null
    firstSeenAt: string | null
    lastSeenAt: string | null
    statuses: string[]
  }
  events: Array<{
    eventId: string
    eventType: string
    eventTimestamp: string
    stepId: string | null
    stepName: string | null
    pagePath: string | null
    attributes: Record<string, unknown> | null
    purchase: Record<string, unknown> | null
  }>
}
```

Planned server-side sources:

- Lead summary: `public.vw_dashboard_leads`
- Timeline rows: `public.vw_dashboard_lead_events`

The endpoint and views are not implemented yet according to the backend handoff. Page implementation must halt until they exist or are explicitly included in the same approved story. No mock lead or mock timeline data should be introduced.

## Page Structure

1. Dashboard shell
   - Reuse the established full-height dashboard shell and sidebar treatment.
   - Mark `Leads` as the active sidebar item because Lead Detail belongs to the leads workflow.
   - Use the current `.dark` theme and existing token classes only.

2. Page header
   - Title: `Lead Detail`.
   - Compact context badge such as the real lead status or funnel name.
   - Keep the header operational and smaller than landing-page typography.

3. Lead identity panel
   - Main `Card` follows the cataloged `LeadDetailPreview` composition.
   - Use `AvatarFallback` generated from the real contact value or lead ID.
   - Display contact and `lead_id` prominently.
   - Reuse the cataloged icon `Button` with `ClipboardCopy` for copyable lead identity fields.
   - Display real funnel, source/campaign, country, market, first seen, and last seen values when available.
   - Use existing `Badge` variants for real statuses:
     - `accent` for IC/checkout intent
     - `secondary` for purchase
     - `outline` for neutral or incomplete states
   - Use `/images/dashboard/lead-detail-img.png` as the existing profile visual.

4. Event timeline
   - Render events from `vw_dashboard_lead_events` in chronological order.
   - Each timeline row uses plain layout elements, theme classes, and the cataloged dot/ring pattern.
   - Prefer `stepName`, then `pagePath`, then `eventType` as the visible event label.
   - Show event type and formatted timestamp as secondary text.
   - Highlight the latest event with the existing `bg-primary` plus `ring-primary/20` treatment.
   - Do not create a Timeline component.

5. Loading, empty, not-found, and error states
   - Loading state stays inside the existing card shell and uses text placeholders or simple muted blocks.
   - Not found state explains that no lead exists for the requested `leadId` and links back to `/dashboard/leads`.
   - Empty timeline state keeps the identity panel visible and states that no events were found.
   - Error state is plain and actionable using existing `Card`, `Button`, and theme tokens; do not add a new alert component or error component.

6. Leads Table connection
   - After the detail route is working with real data, update each real Leads Table row to navigate to `/dashboard/leads/{leadId}`.
   - Do not connect the current mock rows to the detail page.
   - Keep this change in the same story only if the Leads Table has already been migrated to real data.

## Implementation Rules

- Implement the page directly in `app/dashboard/leads/[leadId]/page.tsx`.
- Do not create files under `components/`.
- Do not extract `DashboardLayout`, `LeadIdentityCard`, `LeadTimeline`, `TimelineItem`, `CopyButton`, or similar components.
- Do not duplicate the catalog preview as a reusable component; translate its approved composition into the route file using existing primitives.
- Do not add new dependencies or shadcn components.
- Do not alter the design-system tokens or theme.
- Do not change working pages `/`, `/login`, `/catalog`, `/dashboard`, or `/dashboard/leads` except for a real-data row link explicitly owned by the implementation story.
- Do not query `funnel_events`, `funnel_leads`, or Supabase directly from the browser.
- Do not propose or apply database schema changes as part of this frontend page.
- Use current theme classes only, including `bg-background`, `bg-card`, `bg-sidebar`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `bg-secondary`, and `bg-accent`.

## Execution Plan

1. Create or identify a non-draft story for Page 04 with acceptance criteria for real lead summary, timeline, responsive behavior, and error states.
2. Confirm `vw_dashboard_leads`, `vw_dashboard_lead_events`, and the authenticated lead detail endpoint exist and return real data.
3. Add the dynamic route file and compose the page directly from existing cataloged primitives.
4. Wire the route to the authenticated endpoint and handle loading, success, empty timeline, not-found, and error states.
5. Validate the copy action using the existing icon button without introducing a new reusable component.
6. Connect real Leads Table rows to the dynamic route only when the table itself is backed by real data and the story includes that change.
7. Run visual and build validation before marking the story complete.

## Validation Plan

1. Confirm the implementation story exists and is not draft.
2. Confirm the real data views and authenticated endpoint exist.
3. Run `npm run build`.
4. Start `npm run dev`.
5. Check a real `/dashboard/leads/{leadId}` route on desktop and mobile.
6. Verify long contact values, lead IDs, funnel IDs, source/campaign values, and event labels do not overlap.
7. Verify the copy action works for a real lead identity value.
8. Verify timeline ordering and latest-event highlight against the API response.
9. Verify loading, empty timeline, not-found, and endpoint error states.
10. Confirm `/`, `/login`, `/catalog`, `/dashboard`, and `/dashboard/leads` still render.
11. Commit changes before moving to another task if the project is placed inside a Git repository.

## Open Questions Before Implementation

1. Which non-draft story ID owns Page 04, `Lead Detail`?
2. Should the authenticated detail endpoint be created in the same story, or will backend work deliver it first?
3. Which real field should be the primary contact label when email, phone, and other contact attributes are all available?
4. Should timeline order be oldest-to-newest for journey reading or newest-to-oldest for operational investigation?

## Recommended Next Step

Create or identify the non-draft Lead Detail story, then implement the authenticated real-data endpoint and `app/dashboard/leads/[leadId]/page.tsx` using only the cataloged primitives and asset listed above.
