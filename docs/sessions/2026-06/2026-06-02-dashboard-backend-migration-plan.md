# Handoff — Dashboard Backend Migration Plan

Date: 2026-06-02
Project: `dashboard/`
Agent: `data-engineer`
Workflow: `*create-migration-plan`

## Completed

- Created `migration-plan.md` for the dashboard backend/API and schema plan.
- Confirmed the target Supabase telemetry migration is already applied by querying:
  - `public.funnel_events`
  - `public.funnel_leads`
- Planned dashboard authentication with Supabase Auth:
  - admin-created/admin-invited users for MVP
  - no custom password storage
  - service role key only in Cloudflare Pages Functions
- Removed `dashboard_funnel_access` from MVP scope.
- Kept `country` inside telemetry `metadata`; dashboard views project it as a resolved column.
- Planned `market` as the only new physical telemetry dimension.
- Added note that after initial dashboard backend development, `tdi-latam` telemetry capture should send `market` directly.
- Defined funnel step resolution:
  - `step_key = step_id`
  - fallback: `page_path`
  - label: `step_name`
  - order: `step_index`
- Added planning clarifications for:
  - default `viewer` role
  - `pgcrypto`
  - database indexes vs frontend filters
  - funnel step identity and fallback behavior

## Files Changed

- `migration-plan.md`
- `docs/sessions/2026-06/2026-06-02-dashboard-backend-migration-plan.md`

## Decisions

- Use Supabase Auth for login.
- Use Cloudflare Pages Functions as the API/security boundary.
- Keep service role off the browser entirely.
- Use existing telemetry tables as real source of dashboard data.
- Avoid new indexes until smoke tests/EXPLAIN show they are necessary.
- Do not add physical `country` columns for MVP.
- Keep documentation self-contained for the Q&A decisions made during planning.

## Not Done

- No SQL migration file was created yet.
- No Pages Functions endpoints were implemented yet.
- No frontend API wiring was implemented yet.
- No Git commit was created because `dashboard/` is not a Git repository.
- Accidental duplicate files were created at the workspace root and were not removed because workspace rules require explicit approval before deleting recent files.

## Recommended Next Steps

1. Create the SQL migration from `migration-plan.md`.
2. Create smoke SQL tests for dashboard views.
3. Implement Cloudflare Pages Functions endpoints.
4. Wire dashboard frontend pages to real API responses.
5. After the initial backend works, update `tdi-latam` telemetry capture to send `market`.
