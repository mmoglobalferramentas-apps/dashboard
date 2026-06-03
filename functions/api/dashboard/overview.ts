import { withApiHandler } from "../../../lib/dashboard-api/http"
import {
  optionalDate,
  optionalDimension,
  requiredDimension,
} from "../../../lib/dashboard-api/query"
import {
  requireDashboardUser,
  supabaseRpc,
  supabaseSelect,
} from "../../../lib/dashboard-api/supabase"
import type { DashboardFunctionContext } from "../../../lib/dashboard-api/types"

interface FunnelKpisRow {
  total_leads: number
  total_ics: number
  purchases: number
  checkout_conversion_rate: number
  non_converted_ics: number
}

interface FunnelStepRow {
  step_key: string
  step_label: string
  step_index: number | null
  event_count: number
  lead_count: number
  passage_percentage: number
}

interface HealthMetricRow {
  id: string
  market: string
  country: string
  metric_key: string
  metric_label: string
  target_value: number
  unit: string
  direction: "gte" | "lte"
  recommendations: unknown[]
}

function startOfUtcDay(value: string | null) {
  return value ? `${value}T00:00:00.000Z` : null
}

export const onRequestGet = withApiHandler(
  async ({ request, env }: DashboardFunctionContext) => {
    await requireDashboardUser(request, env)

    const url = new URL(request.url)
    const funnelId = requiredDimension(url, "funnel_id")
    const country = optionalDimension(url, "country", 8)
    const market = optionalDimension(url, "market")
    const from = startOfUtcDay(optionalDate(url, "from"))
    const to = startOfUtcDay(optionalDate(url, "to"))
    const rpcParams = {
      p_funnel_id: funnelId,
      p_country: country,
      p_market: market,
      p_from: from,
      p_to: to,
    }

    const healthParams = new URLSearchParams({
      select:
        "id,market,country,metric_key,metric_label,target_value,unit,direction,recommendations",
      order: "metric_key.asc",
      limit: "100",
    })
    if (market) {
      healthParams.set("market", `eq.${market}`)
    }
    if (country) {
      healthParams.set("country", `eq.${country}`)
    }

    const [kpis, steps, healthMetrics] = await Promise.all([
      supabaseRpc<FunnelKpisRow>(env, "dashboard_funnel_kpis", rpcParams),
      supabaseRpc<FunnelStepRow>(env, "dashboard_funnel_steps", rpcParams),
      market && country
        ? supabaseSelect<HealthMetricRow>(
            env,
            "dashboard_health_metrics",
            healthParams
          ).then((result) => result.data)
        : Promise.resolve([]),
    ])

    return Response.json({
      data: {
        filters: {
          funnel_id: funnelId,
          country,
          market,
          from,
          to,
        },
        kpis: kpis[0] ?? {
          total_leads: 0,
          total_ics: 0,
          purchases: 0,
          checkout_conversion_rate: 0,
          non_converted_ics: 0,
        },
        steps,
        health_metrics: healthMetrics,
      },
    })
  }
)
