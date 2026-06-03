\set ON_ERROR_STOP on

begin;

do $$
declare
  missing_objects text[];
begin
  select array_agg(object_name order by object_name)
  into missing_objects
  from (
    values
      ('public.dashboard_profiles', to_regclass('public.dashboard_profiles')),
      ('public.dashboard_health_metrics', to_regclass('public.dashboard_health_metrics')),
      ('public.vw_dashboard_filter_options', to_regclass('public.vw_dashboard_filter_options')),
      ('public.vw_dashboard_funnel_kpis', to_regclass('public.vw_dashboard_funnel_kpis')),
      ('public.vw_dashboard_funnel_steps', to_regclass('public.vw_dashboard_funnel_steps')),
      ('public.vw_dashboard_leads', to_regclass('public.vw_dashboard_leads')),
      ('public.vw_dashboard_lead_events', to_regclass('public.vw_dashboard_lead_events'))
  ) as expected(object_name, object_regclass)
  where object_regclass is null;

  if missing_objects is not null then
    raise exception 'Missing dashboard objects: %', array_to_string(missing_objects, ', ');
  end if;
end;
$$;

do $$
declare
  missing_columns text[];
begin
  select array_agg(expected.table_name || '.' || expected.column_name order by expected.table_name)
  into missing_columns
  from (
    values
      ('funnel_events', 'market'),
      ('funnel_leads', 'market')
  ) as expected(table_name, column_name)
  where not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = expected.table_name
      and column_name = expected.column_name
  );

  if missing_columns is not null then
    raise exception 'Missing dashboard columns: %', array_to_string(missing_columns, ', ');
  end if;
end;
$$;

do $$
declare
  tables_without_rls text[];
begin
  select array_agg(c.relname order by c.relname)
  into tables_without_rls
  from pg_class as c
  join pg_namespace as n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname in (
      'dashboard_profiles',
      'dashboard_health_metrics',
      'funnel_events',
      'funnel_leads'
    )
    and not c.relrowsecurity;

  if tables_without_rls is not null then
    raise exception 'RLS is disabled on: %', array_to_string(tables_without_rls, ', ');
  end if;
end;
$$;

do $$
declare
  missing_policies text[];
begin
  select array_agg(expected.policy_name order by expected.policy_name)
  into missing_policies
  from (
    values
      ('dashboard_profiles_select_own'),
      ('dashboard_health_metrics_select_authenticated'),
      ('dashboard_health_metrics_insert_admin'),
      ('dashboard_health_metrics_update_admin'),
      ('dashboard_health_metrics_delete_admin')
  ) as expected(policy_name)
  where not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and policyname = expected.policy_name
  );

  if missing_policies is not null then
    raise exception 'Missing dashboard policies: %', array_to_string(missing_policies, ', ');
  end if;
end;
$$;

do $$
declare
  missing_service_role_grants text[];
begin
  select array_agg(expected.object_name order by expected.object_name)
  into missing_service_role_grants
  from (
    values
      ('dashboard_profiles'),
      ('dashboard_health_metrics'),
      ('funnel_events'),
      ('funnel_leads'),
      ('vw_dashboard_filter_options'),
      ('vw_dashboard_funnel_kpis'),
      ('vw_dashboard_funnel_steps'),
      ('vw_dashboard_leads'),
      ('vw_dashboard_lead_events')
  ) as expected(object_name)
  where not has_table_privilege(
    'service_role',
    format('public.%I', expected.object_name),
    'SELECT'
  );

  if missing_service_role_grants is not null then
    raise exception 'service_role cannot select: %', array_to_string(missing_service_role_grants, ', ');
  end if;
end;
$$;

do $$
declare
  remaining_unmapped bigint;
begin
  select
    (select count(*) from public.funnel_events where funnel_id = 'tdi_latam_01' and market is distinct from 'renda_extra')
    +
    (select count(*) from public.funnel_leads where funnel_id = 'tdi_latam_01' and market is distinct from 'renda_extra')
  into remaining_unmapped;

  if remaining_unmapped > 0 then
    raise exception 'tdi_latam_01 market backfill is incomplete: % rows', remaining_unmapped;
  end if;
end;
$$;

select * from public.vw_dashboard_filter_options limit 20;
select * from public.vw_dashboard_funnel_kpis limit 20;
select * from public.vw_dashboard_funnel_steps limit 20;
select * from public.vw_dashboard_leads limit 20;
select * from public.vw_dashboard_lead_events limit 20;

rollback;
