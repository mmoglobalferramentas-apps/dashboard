# Schema Migration Plan — Dashboard Backend/API

## Executive Summary

Objective: plan the backend/API and schema evolution required to connect the `dashboard/` frontend to the existing Supabase telemetry data from `tdi-latam`.

The current applied migration exposes real data in `public.funnel_events` and `public.funnel_leads`. The dashboard should read those tables through backend endpoints, not directly from the browser, and should add only the schema needed for dashboard authentication, health configuration, queryable dimensions, and aggregation views/RPCs.

Risk level: Medium.

Reasoning:

- The base telemetry migration is already applied and responding with data.
- The dashboard will read sensitive lead/event data, so authentication and server-side authorization are required before exposing metrics.
- `country` currently exists inside JSON metadata and may be null in some events, while the dashboard treats country as a primary filter.
- `market` is not yet a first-class field and is required for niche-based health metrics.

Impacted environments:

- Supabase `public` schema.
- Supabase Auth.
- Cloudflare Pages Functions for dashboard API endpoints.
- `dashboard/` frontend consuming those endpoints.
- Existing `tdi-latam` Worker only if event ingestion must start sending `market` as a first-class value.

Authentication plan:

- Use Supabase Auth for email/password.
- Do not create a custom password table.
- Admin-created or admin-invited users only for MVP.
- Store the Supabase service role key only in Cloudflare Pages Functions environment variables.
- Never expose the service role key to the browser.
- Frontend receives only user session/JWT data needed for logged-in UI state.
- All telemetry reads go through Pages Functions, which validate the authenticated user before querying Supabase with service role.

Expected migration window:

- 5-15 minutes for additive DDL, views/RPCs, and indexes.
- 15-30 minutes for smoke testing and dashboard API validation.

Rollback window:

- 15-30 minutes for removing newly created views, RPCs, dashboard profile/config tables, and indexes.
- Prefer forward-only rollback migrations in production.

Primary assumption:

- Access control is intentionally simple for MVP: any authenticated invited/admin-created dashboard user can access the dashboard data exposed by the API. Fine-grained per-funnel access is out of scope for now.

## Approved Preflight Decisions

- Development may proceed without an AIOS story for this backend phase by explicit project-owner approval.
- `dashboard/` is the source repository for the dashboard backend and owns its Supabase migrations.
- Dashboard API endpoints use Cloudflare Pages Functions.
- The Supabase backend credential remains `SUPABASE_SERVICE_ROLE_KEY` for this phase.
- `market` is added to both `public.funnel_events` and `public.funnel_leads`.
- New funnel telemetry will send `market` directly in a later ingestion update.
- Until then, the initial mapping is `tdi_latam_01` → `renda_extra`.
- All migration, smoke-test, and snapshot paths in this document are relative to `/dashboard`.

## Planning Clarifications

### Authentication Role

`role text not null default 'viewer'` means:

- `role`: profile permission column.
- `text`: stored as text.
- `not null`: every dashboard profile must have a role.
- `default 'viewer'`: if no role is specified, the user starts as a read-oriented dashboard user.

For the MVP:

- `viewer` is the default user role.
- `admin` is reserved for users that can invite/create users and, later, manage health metric configuration.
- Users are admin-created or admin-invited; there is no public signup flow planned for the MVP.

### `pgcrypto`

`pgcrypto` is a PostgreSQL extension. In this plan it is used mainly because `gen_random_uuid()` depends on it, and the dashboard tables use UUID primary keys.

### Indexes

An index is not a frontend filter.

Frontend filters are user-facing controls such as `funnel_id`, date, `country`, and `market`.

Database indexes are internal database structures that help PostgreSQL find matching rows faster when those filters reach the backend query.

MVP decision:

- Use existing telemetry indexes first.
- Do not add new indexes unless smoke tests or `EXPLAIN ANALYZE` show slow reads.

### Funnel Step Identity

Dashboard funnel steps are resolved from existing event telemetry.

Primary step identity:

- `step_key = step_id`

Supporting fields:

- `step_index`: order of the step in the funnel.
- `step_name`: human-readable label.
- `page_path`: fallback when `step_id` is missing.

The view should use:

```text
step_key = coalesce(step_id, page_path)
label = coalesce(step_name, page_path)
order = step_index
```

This avoids losing funnel passage data when some events have page data but no structured step id.

## Change Set

### Tables Created

#### `public.dashboard_profiles`

Stores dashboard-facing profile and role metadata for users that exist in Supabase Auth.

Columns:

- `user_id uuid primary key references auth.users(id) on delete cascade`
- `email text not null`
- `name text`
- `role text not null default 'viewer'`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:

- `role in ('admin', 'viewer')`

Notes:

- Passwords remain managed by Supabase Auth, not by this table.
- MVP access is closed: admins create or invite users.
- No `dashboard_funnel_access` table in this phase.

#### `public.dashboard_health_metrics`

Stores configurable benchmark metrics by niche.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `market text not null`
- `country text not null`
- `metric_key text not null`
- `metric_label text not null`
- `target_value numeric not null`
- `unit text not null`
- `direction text not null default 'gte'`
- `recommendations jsonb not null default '[]'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:

- `unique (market, country, metric_key)`
- `direction in ('gte', 'lte')`

### Tables Altered

#### `public.funnel_events`

Add:

- `market text`

Do not add a physical `country` column for MVP. Country remains in `metadata->>'country'` and is resolved as a projected column in dashboard views.

#### `public.funnel_leads`

Add:

- `market text`

Do not add a physical `country` column for MVP. Country remains in `metadata->>'country'` and is resolved as a projected column in dashboard views.

### Views / RPCs Created

#### `public.vw_dashboard_filter_options`

Exposes distinct filter options for frontend selects:

- `funnel_id`
- `country`, resolved from lead/event metadata
- `market`

#### `public.vw_dashboard_funnel_kpis`

Aggregates main KPI cards by funnel/date/country/market:

- total leads
- total ICs / checkout starts
- purchases
- checkout conversion rate
- non-converted ICs

#### `public.vw_dashboard_funnel_steps`

Aggregates funnel passage by event steps:

- page/step label
- event count
- relative passage percentage
- country resolved from metadata
- market

#### `public.vw_dashboard_leads`

Compact table for the leads page:

- lead contact fields from `attributes`
- `lead_id`
- `funnel_id`
- country resolved from `metadata`
- market
- first/last seen timestamps
- status badges derived from `lead_status`, `lead_stage`, and relevant event existence

#### `public.vw_dashboard_lead_events`

Timeline rows for lead detail:

- lead/event identity
- event type
- event timestamp
- step/page fields
- attributes/purchase snippets needed by the UI

Parameterized RPCs created for period-wide overview aggregation:

- `public.dashboard_funnel_kpis(...)`
- `public.dashboard_funnel_steps(...)`

### Indexes

Use existing indexes first:

- `idx_funnel_events_funnel_time`
- `idx_funnel_events_lead_time`
- `idx_funnel_events_type`
- `idx_funnel_leads_funnel_status`

New indexes are not mandatory for MVP unless smoke tests show slow dashboard reads.

Possible later indexes:

- `funnel_events (funnel_id, market, event_timestamp desc)`
- `funnel_leads (funnel_id, market, last_event_at desc)`
- JSON expression index for country only if filtering by `metadata->>'country'` becomes slow.

### RLS Policies

Enable RLS on dashboard-owned tables:

- `dashboard_profiles`
- `dashboard_health_metrics`

Also enable RLS and revoke browser-role access on telemetry tables:

- `funnel_events`
- `funnel_leads`

Telemetry tables are read by Cloudflare Pages Functions with service role. The browser must not query `funnel_events` or `funnel_leads` directly.

### Functions / Triggers

Create or reuse:

- `public.set_updated_at()`
- `public.is_dashboard_admin()`
- `public.dashboard_funnel_kpis(...)`
- `public.dashboard_funnel_steps(...)`

Attach `updated_at` triggers to:

- `dashboard_profiles`
- `dashboard_health_metrics`

Optional:

- A profile bootstrap trigger on `auth.users` can create `dashboard_profiles` rows automatically, but for MVP admin-created users can also be inserted explicitly during invite/setup.

## Dependencies & Ordering

### Execution Order

1. Extensions
   - Confirm `pgcrypto` exists.
   - Include `create extension if not exists "pgcrypto";` for idempotency.

2. Utility functions
   - Create or replace `public.set_updated_at()`.

3. New dashboard tables
   - Create `public.dashboard_profiles`.
   - Create `public.dashboard_health_metrics`.

4. Telemetry table changes
   - Add `market text` to `public.funnel_events`.
   - Add `market text` to `public.funnel_leads`.
   - Keep `country` in `metadata`; dashboard views project it as a resolved column.

5. Triggers
   - Attach `updated_at` trigger to `dashboard_profiles`.
   - Attach `updated_at` trigger to `dashboard_health_metrics`.

6. RLS
   - Enable RLS on dashboard-owned tables.
   - Enable RLS and revoke browser-role access on raw telemetry tables.
   - Add policies for authenticated users/admins.
   - Keep raw telemetry reads server-side through Cloudflare Pages Functions.

7. Views
   - Create dashboard views only after all source columns/tables exist.
   - Views should resolve `country` from `metadata->>'country'`.
   - Funnel step views should identify steps with:
     - `step_key = step_id`
     - fallback: `page_path`
     - label: `step_name`
     - ordering: `step_index`

8. Optional indexes
   - Do not add new indexes unless smoke tests or EXPLAIN show slow reads.
   - Existing telemetry indexes are the first performance baseline.

9. Cloudflare Pages Functions
   - Configure `SUPABASE_URL`.
   - Configure `SUPABASE_SERVICE_ROLE_KEY`.
   - Validate the authenticated dashboard user before querying Supabase with service role.

### Dashboard API Contract

Implemented Pages Functions:

- `GET /api/dashboard/session`
  - Validates the Supabase Auth bearer token.
  - Requires a matching `dashboard_profiles` row.
  - Returns the authenticated user and dashboard role.
- `GET /api/dashboard/funnels`
  - Returns real funnel, country, and market filter options.
- `GET /api/dashboard/overview`
  - Requires `funnel_id`.
  - Accepts optional `country`, `market`, `from`, and `to`.
  - Returns unique-lead KPIs, funnel steps, and matching health metrics.
- `GET /api/dashboard/leads`
  - Returns paginated lead rows.
  - Supports funnel, country, market, lead ID, contact, IC, purchase, and date filters.
- `GET /api/dashboard/leads/:leadId`
  - Returns one lead and its event timeline.
  - Accepts `funnel_id` when the same lead ID exists in more than one funnel.
- `GET /api/dashboard/health-metrics`
  - Returns health metrics, optionally filtered by market and country.
- `PUT /api/dashboard/health-metrics`
  - Upserts health metrics.
  - Requires a `dashboard_profiles.role = 'admin'` user.

Date filters use UTC and a semi-open interval:

```text
from <= event_timestamp < to
```

The `to` date is exclusive so adjacent date ranges do not overlap.

Overview reads use parameterized RPCs instead of summing daily view rows:

- `public.dashboard_funnel_kpis(...)`
- `public.dashboard_funnel_steps(...)`

This keeps lead counts unique across the entire selected period and deduplicates purchases by `transaction_id` when both `payment_completed` and `purchase` exist.

Lead contact resolution:

```text
contact = attributes.email → attributes.phone → lead_id
```

Until telemetry sends email or phone, the API intentionally displays `lead_id` rather than mock contact data.

### Cross-Object Dependencies

- `dashboard_profiles.user_id` depends on `auth.users(id)`.
- `dashboard_health_metrics` is independent from telemetry tables, but its `market + country` pairs should match values projected by dashboard views.
- Dashboard views depend on `funnel_events`, `funnel_leads`, and any new `market` columns.
- Pages Functions depend on all views/RPCs being available before the frontend consumes live data.

### Two-Phase Rollout

Phase 1:

- Apply additive schema changes.
- Create views.
- Implement Pages Functions reads.
- Use `coalesce(market, 'unknown')` or a funnel mapping if events do not send market yet.

Phase 2:

- Update `tdi-latam` ingestion to send `market`.
- Backfill `market` from known funnel mapping.
- Revisit indexes after real dashboard usage.

## Data Migration & Backfill

### Backfill Scope

The MVP should keep data migration light and additive.

Backfill required:

- `market` on `public.funnel_events`
- `market` on `public.funnel_leads`
- initial rows for `public.dashboard_health_metrics`
- optional profile rows for invited/admin-created users

Backfill not required:

- `country`, because it remains in `metadata` and is projected by dashboard views.
- funnel steps, because they already come from `step_id`, `step_index`, `step_name`, with `page_path` as fallback.

### Market Strategy

Initial migration:

- Add `market text` to telemetry tables.
- Backfill existing rows from known `funnel_id` mapping.
- Use `coalesce(market, 'unknown')` in views until all events reliably include market.

Example mapping:

```sql
update public.funnel_events
set market = case
  when funnel_id = 'tdi_latam_01' then 'renda_extra'
  else coalesce(market, 'unknown')
end
where market is null;

update public.funnel_leads
set market = case
  when funnel_id = 'tdi_latam_01' then 'renda_extra'
  else coalesce(market, 'unknown')
end
where market is null;
```

Post-initial-development note:

- After the initial dashboard backend is working, update the funnel telemetry capture in `tdi-latam` so every new event sends `market` directly.
- The Worker should persist `market` into both `funnel_events.market` and `funnel_leads.market`.
- This avoids depending on permanent `funnel_id` mapping logic inside dashboard views.

### Verification Queries

```sql
select funnel_id, market, count(*)
from public.funnel_events
group by funnel_id, market
order by count(*) desc;

select funnel_id, market, count(*)
from public.funnel_leads
group by funnel_id, market
order by count(*) desc;
```

### Health Metric Seeds

Initial health metric rows should cover:

- `checkout_ctr`
- `checkout_conversion_rate`
- `capture_to_quiz_rate`
- `purchase_rate`
- `ic_non_conversion_count`

Rationale:

- Existing telemetry stays intact.
- `country` remains source-of-truth in JSON metadata for now.
- `market` becomes the only new physical dimension required for niche-based health metrics.
- The ingestion update is intentionally placed after the initial dashboard backend so the MVP can validate reads before changing telemetry capture.

## Safety & Rollback

### Safety Plan

- Take a schema snapshot before applying the dashboard migration.
- Apply only additive changes first:
  - new dashboard tables
  - new `market` columns
  - dashboard views
  - RLS on dashboard-owned tables
  - utility trigger/function
- Apply the intentional access-control change that enables RLS and revokes `anon`/`authenticated` reads on raw telemetry tables.
- Do not remove or rename existing telemetry columns.
- Do not change existing event ingestion behavior during the first schema rollout.
- Keep `country` untouched in `metadata`.
- Keep the Supabase service role key only in Cloudflare Pages Functions environment variables.

### Rollback Outline

```sql
begin;

drop view if exists public.vw_dashboard_lead_events;
drop view if exists public.vw_dashboard_leads;
drop view if exists public.vw_dashboard_funnel_steps;
drop view if exists public.vw_dashboard_funnel_kpis;
drop view if exists public.vw_dashboard_filter_options;

drop table if exists public.dashboard_health_metrics;
drop table if exists public.dashboard_profiles;

alter table public.funnel_events drop column if exists market;
alter table public.funnel_leads drop column if exists market;

commit;
```

### Rollback Caution

- Dropping `market` removes backfilled market values.
- If the dashboard has already launched, prefer roll-forward:
  - keep columns
  - fix views/API
  - disable broken endpoint temporarily

### Advisory Lock

Use a migration lock so two operators do not apply the same migration simultaneously.

```sql
select pg_advisory_lock(hashtext('dashboard_backend_schema_migration'));
-- migration here
select pg_advisory_unlock(hashtext('dashboard_backend_schema_migration'));
```

### Success Criteria

- Existing `funnel_events` inserts continue working.
- Existing `funnel_leads` upserts continue working.
- Dashboard views return rows.
- Pages Functions never expose service role to the browser.
- Invited/admin-created users can authenticate.

Rationale:

- Rollback stays simple because the migration is additive.
- The only destructive rollback step is dropping `market`.
- In production, prefer keeping additive columns and repairing forward unless the migration immediately blocks ingestion.

## Testing Strategy

### Pre-Migration Tests

Confirm base telemetry tables exist and are readable.

```sql
select count(*) from public.funnel_events;
select count(*) from public.funnel_leads;
```

Confirm latest event ingestion still has real data.

```sql
select event_id, funnel_id, lead_id, event_type, event_timestamp
from public.funnel_events
order by received_at desc
limit 5;
```

### Dry Run

```sql
begin;
-- run dashboard migration
rollback;
```

### Post-Migration Smoke Tests

```sql
select *
from public.vw_dashboard_filter_options
limit 20;

select *
from public.vw_dashboard_funnel_kpis
limit 20;

select *
from public.vw_dashboard_funnel_steps
limit 20;

select *
from public.vw_dashboard_leads
limit 20;

select *
from public.vw_dashboard_lead_events
limit 20;
```

### Country Projection Test

```sql
select lead_id, metadata->>'country' as country
from public.funnel_leads
where metadata ? 'country'
limit 20;
```

### Market Backfill Test

```sql
select funnel_id, market, count(*)
from public.funnel_events
group by funnel_id, market;

select funnel_id, market, count(*)
from public.funnel_leads
group by funnel_id, market;
```

### Auth/API Tests

- Unauthenticated request to Pages Function returns `401`.
- Authenticated invited/admin-created user gets dashboard data.
- Browser never receives service role key.
- Pages Function logs request errors without exposing secrets.

### RLS Tests

- `dashboard_profiles` and `dashboard_health_metrics` cannot be read anonymously.
- Authenticated users can read required dashboard config.
- Only admin can modify health metric config, if admin write behavior is implemented in MVP.

### Performance Baseline

```sql
explain analyze
select *
from public.vw_dashboard_leads
where funnel_id = 'tdi_latam_01'
limit 50;
```

Rationale:

- Test real dashboard read paths first.
- Add indexes only if `EXPLAIN` output and endpoint timings show a problem.

## Operational Runbook

### Environment Setup

```bash
export SUPABASE_URL="https://ziknlotnwkdniwkvrulj.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
export DATABASE_URL="<postgres-pooler-or-direct-url-with-ssl>"
```

### Check Tools

```bash
psql --version
supabase --version
```

Expected:

- `psql` available.
- Supabase CLI available if using `supabase db push`.

### Pre-Snapshot

```bash
pg_dump "$DATABASE_URL" \
  --schema public \
  --schema-only \
  --file "snapshots/dashboard-pre-migration-$(date +%Y%m%d%H%M%S).sql"
```

Expected:

- Snapshot file created.
- No secrets written into snapshot.

### Apply Migration

```bash
psql "$DATABASE_URL" \
  --set ON_ERROR_STOP=on \
  --file supabase/migrations/<timestamp>_dashboard_backend.sql
```

Expected:

- Command exits with status `0`.
- No failed transaction.
- Views and tables exist.

### Post-Snapshot

```bash
pg_dump "$DATABASE_URL" \
  --schema public \
  --schema-only \
  --file "snapshots/dashboard-post-migration-$(date +%Y%m%d%H%M%S).sql"
```

### Smoke Tests

```bash
psql "$DATABASE_URL" --set ON_ERROR_STOP=on --file supabase/tests/dashboard_smoke.sql
```

Expected:

- All view queries return successfully.
- `market` backfill has no unexpected nulls except accepted unknowns.
- Country projection works from metadata.

### Cloudflare Pages Functions Setup

- Add `SUPABASE_URL`.
- Add `SUPABASE_SERVICE_ROLE_KEY`.
- Do not prefix the service key with public/client env names.
- Do not expose it to frontend bundles.

### API Smoke Tests

```bash
curl -i https://<dashboard-domain>/api/dashboard/funnels
```

Expected unauthenticated:

- `401 Unauthorized`

Expected authenticated:

- `200 OK`
- JSON body contains funnel options or metrics.
- Response does not include service key, raw secrets, or stack traces.

### Success Criteria

- Existing telemetry Worker still inserts events.
- Dashboard API returns data for invited/authenticated user.
- Frontend can populate funnel/country/market filters.
- Funnel step metrics use `step_id`, fallback `page_path`.

Rationale:

- Database rollout and API rollout are separated.
- Service role deployment stays inside Cloudflare Pages Functions, which is the security boundary for the MVP.

## Communication & Approval

### Stakeholders

- Bruno / project owner
- Dashboard frontend implementer
- Backend/API implementer
- Supabase/database operator

### Approvers

- Bruno approves MVP schema and access model.
- Database operator approves migration execution.
- Backend implementer approves Pages Functions secret handling.

### Change Window Notice

- Apply during low traffic if possible.
- Expected DB migration time: 5-15 minutes.
- Expected smoke validation: 15-30 minutes.
- Existing telemetry capture should not be interrupted.

### Pre-Approval Checklist

- Migration is additive.
- No raw telemetry table deletion.
- No `country` schema change.
- No `dashboard_funnel_access`.
- Service role only in Pages Functions.
- Auth model is admin-created/admin-invited users.

### Post-Deploy Validation Owners

- Database: validates tables/views/backfill.
- Backend: validates `401` unauthenticated and `200` authenticated API behavior.
- Frontend: validates filters and dashboard pages consuming real API.

### Incident Path

- If DB migration fails: stop, rollback transaction if still open.
- If views fail but ingestion works: keep schema, fix views forward.
- If Pages Functions leak or expose sensitive data: disable affected API route immediately.
- If telemetry ingestion breaks: rollback only the telemetry-impacting part, prioritize restoring `/api/events`.

Rationale:

- The key approval is not only that the schema looks right.
- The key approval is that the service role key will never touch the browser.

## Schema Version Tracking

Use Supabase migrations as the primary migration history and optionally add an internal `schema_migrations` table for richer production audit metadata.

For the MVP, Supabase migration files are enough if each migration is:

- Timestamped.
- Committed with the project.
- Tested with smoke SQL.
- Applied once through a controlled runbook.

Optional enhanced tracking table:

```sql
create table if not exists public.schema_migrations (
  version text primary key,
  name text not null,
  applied_at timestamptz default now(),
  applied_by text not null,
  execution_time_ms integer,
  success boolean not null default false,
  checksum text not null,
  rollback_script text,
  notes text,
  constraint valid_checksum check (length(checksum) = 64),
  constraint valid_version check (version ~ '^\d{14}$')
);
```

Recommended migration naming:

```text
supabase/migrations/<timestamp>_dashboard_backend.sql
```

Recommended tracking metadata:

- `dashboard_backend`
- `add_dashboard_profiles`
- `add_dashboard_health_metrics`
- `add_market_to_telemetry`
- `create_dashboard_views`

Rationale:

- Supabase CLI handles normal migration order.
- A custom table is useful later if production audit/rollback metadata becomes important.
- Do not block MVP on custom migration tracking unless the deployment process requires it.

## Zero-Downtime Migrations

Use an expand-first approach.

Safe MVP changes:

- Create new tables.
- Add nullable `market` columns.
- Create views.
- Create utility functions/triggers.
- Enable RLS on new dashboard-owned tables.
- Enable RLS on telemetry tables while preserving service-role ingestion and backend reads.

Avoid in the first rollout:

- Renaming telemetry columns.
- Dropping telemetry columns.
- Adding non-null constraints to existing telemetry tables.
- Rewriting `country` from JSON into physical columns.
- Changing existing `/api/events` ingestion behavior before validating dashboard reads.

Rollout phases:

1. Expand schema.
2. Backfill `market` from known `funnel_id`.
3. Create dashboard views.
4. Deploy Pages Functions.
5. Connect frontend to Pages Functions.
6. After initial dashboard backend works, update telemetry capture to send `market`.

Rollback posture:

- Prefer roll-forward for additive schema.
- Disable broken API endpoints before touching telemetry ingestion.
- Keep event ingestion as the protected production path.

Rationale:

- The current telemetry pipeline is already producing useful real data.
- The dashboard should be layered on top of it first, then ingestion can be improved.

## Supabase CLI Integration

Recommended structure:

```text
/dashboard/
  supabase/
    migrations/
      <timestamp>_dashboard_backend.sql
    tests/
      dashboard_smoke.sql
    snapshots/
```

Local/dev workflow:

```bash
supabase migration new dashboard_backend
supabase db reset
supabase db lint
```

Production/staging workflow:

```bash
supabase migration list
supabase db push
```

If applying manually through `psql`:

```bash
psql "$DATABASE_URL" --set ON_ERROR_STOP=on --file supabase/migrations/<timestamp>_dashboard_backend.sql
```

Recommended CI checks:

- SQL lint if Supabase CLI is available.
- Smoke SQL against staging.
- API unauthenticated/authenticated checks after Pages Functions deploy.

Credential rules:

- Store Supabase service role only in Cloudflare Pages Functions secrets.
- Use non-public env names for service role.
- Never put service role in `NEXT_PUBLIC_*`, `VITE_*`, checked-in `.env`, or client bundle.

Rationale:

- Supabase CLI is useful for repeatable deployment.
- Manual `psql` remains acceptable for MVP if snapshots and smoke tests are followed.
- The security boundary is Cloudflare Pages Functions, not the frontend.
