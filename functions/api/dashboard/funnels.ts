import { withApiHandler } from "../../../lib/dashboard-api/http"
import { requireDashboardUser, supabaseSelect } from "../../../lib/dashboard-api/supabase"
import type { DashboardFunctionContext } from "../../../lib/dashboard-api/types"

interface FilterOptionRow {
  funnel_id: string
  country: string
  market: string
}

export const onRequestGet = withApiHandler(
  async ({ request, env }: DashboardFunctionContext) => {
    await requireDashboardUser(request, env)

    const params = new URLSearchParams({
      select: "funnel_id,country,market",
      order: "funnel_id.asc,country.asc,market.asc",
      limit: "1000",
    })
    const { data } = await supabaseSelect<FilterOptionRow>(
      env,
      "vw_dashboard_filter_options",
      params
    )

    return Response.json(
      { data },
      { headers: { "Cache-Control": "private, max-age=60" } }
    )
  }
)
