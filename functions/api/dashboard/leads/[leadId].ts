import { ApiError, withApiHandler } from "../../../../lib/dashboard-api/http"
import { optionalDimension } from "../../../../lib/dashboard-api/query"
import {
  requireDashboardUser,
  supabaseSelect,
} from "../../../../lib/dashboard-api/supabase"
import type { DashboardFunctionContext } from "../../../../lib/dashboard-api/types"

interface DashboardLeadDetailRow {
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
  attributes: Record<string, unknown>
  metadata: Record<string, unknown>
}

interface DashboardLeadEventRow {
  event_id: string
  funnel_id: string
  lead_id: string
  event_type: string
  event_source: string
  event_timestamp: string
  session_id: string | null
  step_id: string | null
  step_index: number | null
  step_name: string | null
  page_path: string | null
  page_title: string | null
  attributes: Record<string, unknown> | null
  purchase: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  transaction_id: string | null
}

function leadIdFromParams(params: DashboardFunctionContext["params"]) {
  const value = params.leadId
  const leadId = Array.isArray(value) ? value[0] : value

  if (!leadId || leadId.length > 128 || !/^[A-Za-z0-9_-]+$/.test(leadId)) {
    throw new ApiError(400, "Invalid leadId.", "invalid_query")
  }

  return leadId
}

export const onRequestGet = withApiHandler(
  async ({ request, env, params }: DashboardFunctionContext) => {
    await requireDashboardUser(request, env)

    const leadId = leadIdFromParams(params)
    const url = new URL(request.url)
    const funnelId = optionalDimension(url, "funnel_id")
    const leadParams = new URLSearchParams({
      select: "*",
      lead_id: `eq.${leadId}`,
      limit: "2",
    })

    if (funnelId) {
      leadParams.set("funnel_id", `eq.${funnelId}`)
    }

    const { data: leads } = await supabaseSelect<DashboardLeadDetailRow>(
      env,
      "vw_dashboard_leads",
      leadParams
    )

    if (leads.length === 0) {
      throw new ApiError(404, "Lead not found.", "not_found")
    }

    if (leads.length > 1) {
      throw new ApiError(
        409,
        "leadId exists in more than one funnel; provide funnel_id.",
        "ambiguous_lead"
      )
    }

    const lead = leads[0]
    const eventParams = new URLSearchParams({
      select: "*",
      funnel_id: `eq.${lead.funnel_id}`,
      lead_id: `eq.${lead.lead_id}`,
      order: "event_timestamp.asc",
      limit: "1000",
    })
    const { data: events } = await supabaseSelect<DashboardLeadEventRow>(
      env,
      "vw_dashboard_lead_events",
      eventParams
    )

    return Response.json({ data: { lead, events } })
  }
)
