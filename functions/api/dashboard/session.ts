import { withApiHandler } from "../../../lib/dashboard-api/http"
import { requireDashboardUser } from "../../../lib/dashboard-api/supabase"
import type { DashboardFunctionContext } from "../../../lib/dashboard-api/types"

export const onRequestGet = withApiHandler(
  async ({ request, env }: DashboardFunctionContext) => {
    const user = await requireDashboardUser(request, env)

    return Response.json({
      data: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    })
  }
)
