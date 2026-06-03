import { withApiHandler } from "../../../../lib/dashboard-api/http"
import {
  addDateRangeFilters,
  addEqFilter,
  addIlikeFilter,
  optionalBoolean,
  optionalDate,
  optionalDimension,
  optionalSearch,
  positiveInteger,
} from "../../../../lib/dashboard-api/query"
import {
  requireDashboardUser,
  supabaseSelect,
} from "../../../../lib/dashboard-api/supabase"
import type { DashboardFunctionContext } from "../../../../lib/dashboard-api/types"

interface DashboardLeadRow {
  lead_id: string
  funnel_id: string
  contact: string
  country: string
  market: string
  first_seen_at: string
  last_seen_at: string
  last_event_at: string | null
  lead_stage: string
  lead_status: string
  lead_score: number
  has_ic: boolean
  has_purchase: boolean
}

export const onRequestGet = withApiHandler(
  async ({ request, env }: DashboardFunctionContext) => {
    await requireDashboardUser(request, env)

    const url = new URL(request.url)
    const page = positiveInteger(url, "page", 1, 100000)
    const pageSize = positiveInteger(url, "page_size", 50, 100)
    const params = new URLSearchParams({
      select:
        "lead_id,funnel_id,contact,country,market,first_seen_at,last_seen_at,last_event_at,lead_stage,lead_status,lead_score,has_ic,has_purchase",
      order: "last_event_at.desc.nullslast,last_seen_at.desc",
      limit: String(pageSize),
      offset: String((page - 1) * pageSize),
    })

    addEqFilter(params, "funnel_id", optionalDimension(url, "funnel_id"))
    addEqFilter(params, "country", optionalDimension(url, "country", 8))
    addEqFilter(params, "market", optionalDimension(url, "market"))
    addEqFilter(params, "has_ic", optionalBoolean(url, "has_ic"))
    addEqFilter(params, "has_purchase", optionalBoolean(url, "has_purchase"))
    addIlikeFilter(params, "lead_id", optionalSearch(url, "lead_id"))
    addIlikeFilter(params, "contact", optionalSearch(url, "contact"))
    addDateRangeFilters(
      params,
      "last_event_at",
      optionalDate(url, "from"),
      optionalDate(url, "to")
    )

    const { data, count } = await supabaseSelect<DashboardLeadRow>(
      env,
      "vw_dashboard_leads",
      params,
      { count: "exact" }
    )

    return Response.json({
      data,
      pagination: {
        page,
        page_size: pageSize,
        total: count,
        total_pages: count === null ? null : Math.ceil(count / pageSize),
      },
    })
  }
)
