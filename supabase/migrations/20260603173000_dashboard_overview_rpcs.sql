begin;

select pg_advisory_xact_lock(hashtext('dashboard_backend_schema_migration'));

create or replace function public.dashboard_funnel_kpis(
  p_funnel_id text,
  p_country text default null,
  p_market text default null,
  p_from timestamptz default null,
  p_to timestamptz default null
)
returns table (
  total_leads bigint,
  total_ics bigint,
  purchases bigint,
  checkout_conversion_rate numeric,
  non_converted_ics bigint
)
language sql
stable
set search_path = ''
as $$
  with filtered_events as (
    select
      lead_id,
      event_type,
      coalesce(nullif(transaction_id, ''), lead_id) as purchase_key
    from public.funnel_events
    where funnel_id = p_funnel_id
      and (
        p_country is null
        or coalesce(nullif(metadata ->> 'country', ''), 'unknown') = p_country
      )
      and (
        p_market is null
        or coalesce(nullif(market, ''), 'unknown') = p_market
      )
      and (p_from is null or event_timestamp >= p_from)
      and (p_to is null or event_timestamp < p_to)
  ),
  aggregated as (
    select
      count(distinct lead_id) as total_leads,
      count(distinct lead_id) filter (where event_type = 'checkout_start') as total_ics,
      count(distinct purchase_key) filter (
        where event_type in ('purchase', 'payment_completed')
      ) as purchases
    from filtered_events
  )
  select
    total_leads,
    total_ics,
    purchases,
    case
      when total_ics = 0 then 0::numeric
      else round((purchases::numeric / total_ics::numeric) * 100, 2)
    end as checkout_conversion_rate,
    greatest(total_ics - purchases, 0::bigint) as non_converted_ics
  from aggregated;
$$;

create or replace function public.dashboard_funnel_steps(
  p_funnel_id text,
  p_country text default null,
  p_market text default null,
  p_from timestamptz default null,
  p_to timestamptz default null
)
returns table (
  step_key text,
  step_label text,
  step_index integer,
  event_count bigint,
  lead_count bigint,
  passage_percentage numeric
)
language sql
stable
set search_path = ''
as $$
  with filtered_events as (
    select
      coalesce(nullif(step_id, ''), nullif(page_path, '')) as resolved_step_key,
      coalesce(nullif(step_name, ''), nullif(page_path, '')) as resolved_step_label,
      step_index as resolved_step_index,
      lead_id
    from public.funnel_events
    where funnel_id = p_funnel_id
      and coalesce(nullif(step_id, ''), nullif(page_path, '')) is not null
      and (
        p_country is null
        or coalesce(nullif(metadata ->> 'country', ''), 'unknown') = p_country
      )
      and (
        p_market is null
        or coalesce(nullif(market, ''), 'unknown') = p_market
      )
      and (p_from is null or event_timestamp >= p_from)
      and (p_to is null or event_timestamp < p_to)
  ),
  grouped as (
    select
      resolved_step_key,
      resolved_step_label,
      resolved_step_index,
      count(*) as event_count,
      count(distinct lead_id) as lead_count
    from filtered_events
    group by resolved_step_key, resolved_step_label, resolved_step_index
  ),
  with_previous as (
    select
      grouped.*,
      lag(lead_count) over (
        order by resolved_step_index nulls last, resolved_step_key
      ) as previous_lead_count
    from grouped
  )
  select
    resolved_step_key as step_key,
    resolved_step_label as step_label,
    resolved_step_index as step_index,
    event_count,
    lead_count,
    case
      when previous_lead_count is null then 100::numeric
      when previous_lead_count = 0 then 0::numeric
      else round((lead_count::numeric / previous_lead_count::numeric) * 100, 2)
    end as passage_percentage
  from with_previous
  order by resolved_step_index nulls last, resolved_step_key;
$$;

revoke all on function public.dashboard_funnel_kpis(text, text, text, timestamptz, timestamptz) from public;
revoke all on function public.dashboard_funnel_steps(text, text, text, timestamptz, timestamptz) from public;

grant execute on function public.dashboard_funnel_kpis(text, text, text, timestamptz, timestamptz) to service_role;
grant execute on function public.dashboard_funnel_steps(text, text, text, timestamptz, timestamptz) to service_role;

commit;
