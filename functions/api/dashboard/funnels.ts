import { withApiHandler } from "../../../lib/dashboard-api/http"
import { requireDashboardUser, supabaseSelect } from "../../../lib/dashboard-api/supabase"
import type { DashboardFunctionContext } from "../../../lib/dashboard-api/types"

interface FilterOptionRow {
  funnel_id: string
  country: string
  market: string
}

// É a função que retorna os tipos de filtros disponíveis dentro do nosso database.
// Primeiro, ele cria a tipagem de filtros acima.
// Então, ele seleciona do supabase, todos os funnel_id, country e market
// Por fim, ele retorna esse valor para data. O supabaseSelec<FiletOptionRow> é a função
// supabaseSelect, porém dizendo que irá retornar o valor tipado como
// FilterOptionRow
// no fim, a função retorna o filtro.
// Por fim, ela captura o filtro do viewer do dashboard.
// 
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
