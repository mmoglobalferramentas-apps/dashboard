begin;

select pg_advisory_xact_lock(hashtext('dashboard_backend_schema_migration'));

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.dashboard_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dashboard_profiles_role_check check (role in ('admin', 'viewer'))
);

create table if not exists public.dashboard_health_metrics (
  id uuid primary key default gen_random_uuid(),
  market text not null,
  country text not null,
  metric_key text not null,
  metric_label text not null,
  target_value numeric not null,
  unit text not null,
  direction text not null default 'gte',
  recommendations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dashboard_health_metrics_unique_metric unique (market, country, metric_key),
  constraint dashboard_health_metrics_direction_check check (direction in ('gte', 'lte'))
);

alter table public.funnel_events
  add column if not exists market text;

alter table public.funnel_leads
  add column if not exists market text;

update public.funnel_events
set market = 'renda_extra'
where funnel_id = 'tdi_latam_01'
  and market is null;

update public.funnel_leads
set market = 'renda_extra'
where funnel_id = 'tdi_latam_01'
  and market is null;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_dashboard_profiles_updated_at'
      and tgrelid = 'public.dashboard_profiles'::regclass
  ) then
    create trigger set_dashboard_profiles_updated_at
      before update on public.dashboard_profiles
      for each row execute function public.set_updated_at();
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_dashboard_health_metrics_updated_at'
      and tgrelid = 'public.dashboard_health_metrics'::regclass
  ) then
    create trigger set_dashboard_health_metrics_updated_at
      before update on public.dashboard_health_metrics
      for each row execute function public.set_updated_at();
  end if;
end;
$$;

alter table public.dashboard_profiles enable row level security;
alter table public.dashboard_health_metrics enable row level security;
alter table public.funnel_events enable row level security;
alter table public.funnel_leads enable row level security;

create or replace function public.is_dashboard_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.dashboard_profiles
    where user_id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_dashboard_admin() from public;
grant execute on function public.is_dashboard_admin() to authenticated, service_role;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'dashboard_profiles'
      and policyname = 'dashboard_profiles_select_own'
  ) then
    create policy dashboard_profiles_select_own
      on public.dashboard_profiles
      for select
      to authenticated
      using (user_id = auth.uid());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'dashboard_health_metrics'
      and policyname = 'dashboard_health_metrics_select_authenticated'
  ) then
    create policy dashboard_health_metrics_select_authenticated
      on public.dashboard_health_metrics
      for select
      to authenticated
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'dashboard_health_metrics'
      and policyname = 'dashboard_health_metrics_insert_admin'
  ) then
    create policy dashboard_health_metrics_insert_admin
      on public.dashboard_health_metrics
      for insert
      to authenticated
      with check (public.is_dashboard_admin());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'dashboard_health_metrics'
      and policyname = 'dashboard_health_metrics_update_admin'
  ) then
    create policy dashboard_health_metrics_update_admin
      on public.dashboard_health_metrics
      for update
      to authenticated
      using (public.is_dashboard_admin())
      with check (public.is_dashboard_admin());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'dashboard_health_metrics'
      and policyname = 'dashboard_health_metrics_delete_admin'
  ) then
    create policy dashboard_health_metrics_delete_admin
      on public.dashboard_health_metrics
      for delete
      to authenticated
      using (public.is_dashboard_admin());
  end if;
end;
$$;

create or replace view public.vw_dashboard_filter_options
with (security_invoker = true)
as
select distinct
  source.funnel_id,
  source.country,
  source.market
from (
  select
    funnel_id,
    coalesce(nullif(metadata ->> 'country', ''), 'unknown') as country,
    coalesce(nullif(market, ''), 'unknown') as market
  from public.funnel_leads

  union

  select
    funnel_id,
    coalesce(nullif(metadata ->> 'country', ''), 'unknown') as country,
    coalesce(nullif(market, ''), 'unknown') as market
  from public.funnel_events
) as source;

create or replace view public.vw_dashboard_funnel_kpis
with (security_invoker = true)
as
with event_dimensions as (
  select
    funnel_id,
    event_timestamp::date as metric_date,
    coalesce(nullif(metadata ->> 'country', ''), 'unknown') as country,
    coalesce(nullif(market, ''), 'unknown') as market,
    lead_id,
    event_type,
    coalesce(nullif(transaction_id, ''), lead_id) as purchase_key
  from public.funnel_events
),
aggregated as (
  select
    funnel_id,
    metric_date,
    country,
    market,
    count(distinct lead_id) as total_leads,
    count(distinct lead_id) filter (where event_type = 'checkout_start') as total_ics,
    count(distinct purchase_key) filter (
      where event_type in ('purchase', 'payment_completed')
    ) as purchases
  from event_dimensions
  group by funnel_id, metric_date, country, market
)
select
  funnel_id,
  metric_date,
  country,
  market,
  total_leads,
  total_ics,
  purchases,
  case
    when total_ics = 0 then 0::numeric
    else round((purchases::numeric / total_ics::numeric) * 100, 2)
  end as checkout_conversion_rate,
  greatest(total_ics - purchases, 0::bigint) as non_converted_ics
from aggregated;

create or replace view public.vw_dashboard_funnel_steps
with (security_invoker = true)
as
with step_events as (
  select
    funnel_id,
    event_timestamp::date as metric_date,
    coalesce(nullif(metadata ->> 'country', ''), 'unknown') as country,
    coalesce(nullif(market, ''), 'unknown') as market,
    coalesce(nullif(step_id, ''), nullif(page_path, '')) as step_key,
    coalesce(nullif(step_name, ''), nullif(page_path, '')) as step_label,
    step_index,
    lead_id
  from public.funnel_events
  where coalesce(nullif(step_id, ''), nullif(page_path, '')) is not null
),
grouped as (
  select
    funnel_id,
    metric_date,
    country,
    market,
    step_key,
    step_label,
    step_index,
    count(*) as event_count,
    count(distinct lead_id) as lead_count
  from step_events
  group by funnel_id, metric_date, country, market, step_key, step_label, step_index
),
with_previous as (
  select
    grouped.*,
    lag(lead_count) over (
      partition by funnel_id, metric_date, country, market
      order by step_index nulls last, step_key
    ) as previous_lead_count
  from grouped
)
select
  funnel_id,
  metric_date,
  country,
  market,
  step_key,
  step_label,
  step_index,
  event_count,
  lead_count,
  case
    when previous_lead_count is null then 100::numeric
    when previous_lead_count = 0 then 0::numeric
    else round((lead_count::numeric / previous_lead_count::numeric) * 100, 2)
  end as passage_percentage
from with_previous;

create or replace view public.vw_dashboard_leads
with (security_invoker = true)
as
select
  leads.lead_id,
  leads.funnel_id,
  coalesce(
    nullif(leads.attributes ->> 'email', ''),
    nullif(leads.attributes ->> 'phone', ''),
    leads.lead_id
  ) as contact,
  coalesce(nullif(leads.metadata ->> 'country', ''), 'unknown') as country,
  coalesce(nullif(leads.market, ''), 'unknown') as market,
  leads.first_seen_at,
  leads.last_seen_at,
  leads.last_event_at,
  leads.lead_stage,
  leads.lead_status,
  leads.lead_score,
  exists (
    select 1
    from public.funnel_events as events
    where events.funnel_id = leads.funnel_id
      and events.lead_id = leads.lead_id
      and events.event_type = 'checkout_start'
  ) as has_ic,
  exists (
    select 1
    from public.funnel_events as events
    where events.funnel_id = leads.funnel_id
      and events.lead_id = leads.lead_id
      and events.event_type in ('purchase', 'payment_completed')
  ) as has_purchase,
  leads.attributes,
  leads.metadata
from public.funnel_leads as leads;

create or replace view public.vw_dashboard_lead_events
with (security_invoker = true)
as
select
  event_id,
  funnel_id,
  lead_id,
  event_type,
  event_source,
  event_timestamp,
  session_id,
  step_id,
  step_index,
  step_name,
  page_path,
  page_title,
  attributes,
  purchase,
  metadata,
  transaction_id
from public.funnel_events;

revoke all on public.funnel_events from anon, authenticated;
revoke all on public.funnel_leads from anon, authenticated;
revoke all on public.dashboard_profiles from anon;
revoke all on public.dashboard_health_metrics from anon;
revoke all on public.vw_dashboard_filter_options from anon, authenticated;
revoke all on public.vw_dashboard_funnel_kpis from anon, authenticated;
revoke all on public.vw_dashboard_funnel_steps from anon, authenticated;
revoke all on public.vw_dashboard_leads from anon, authenticated;
revoke all on public.vw_dashboard_lead_events from anon, authenticated;

grant select on public.dashboard_profiles to authenticated;
grant select, insert, update, delete on public.dashboard_health_metrics to authenticated;
grant all on public.dashboard_profiles to service_role;
grant all on public.dashboard_health_metrics to service_role;
grant all on public.funnel_events to service_role;
grant all on public.funnel_leads to service_role;
grant select on public.vw_dashboard_filter_options to service_role;
grant select on public.vw_dashboard_funnel_kpis to service_role;
grant select on public.vw_dashboard_funnel_steps to service_role;
grant select on public.vw_dashboard_leads to service_role;
grant select on public.vw_dashboard_lead_events to service_role;

commit;
