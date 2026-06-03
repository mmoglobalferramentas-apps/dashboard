// Importa funções principais de erro, leitura de SJON e API handler.
// Api error é a tipagem de erro de API.
// ReadJson Body é responsável por catpturar o body-json.
// With API handler é responsável por gerar a resposta do handler e garantir
// resposta em caso de erro.
import {
  ApiError,
  readJsonBody,
  withApiHandler,
} from "../../../lib/dashboard-api/http"

// importa função de adição de filtro '=' e opções de query. 
import {
  addEqFilter,
  optionalDimension,
} from "../../../lib/dashboard-api/query"

// Importa função de seleção, escrita e verificação de usuário para escrever no banco.
import {
  requireDashboardUser,
  supabaseSelect,
  supabaseWrite,
} from "../../../lib/dashboard-api/supabase"

// importa o tipo //dashboard funciont.
import type { DashboardFunctionContext } from "../../../lib/dashboard-api/types"

//define a interface da linha que será lida / enviada em health metrics
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
  created_at: string
  updated_at: string
}

//define a interface da linha que será enviada em health metrics
interface HealthMetricInput {
  metric_key: string
  metric_label: string
  target_value: number
  unit: string
  direction?: "gte" | "lte"
  recommendations?: unknown[]
}

//define o output final do health metric tipado com mercado e país
interface HealthMetricBody {
  market: string
  country: string
  metrics: HealthMetricInput[]
}

// faz verificação da string, para que seja válida.
function requireString(value: unknown, name: string, maxLength = 200) {
  if (
    typeof value !== "string" ||
    value.trim().length === 0 ||
    value.trim().length > maxLength
  ) {
    throw new ApiError(400, `Invalid ${name}.`, "invalid_body")
  }

  return value.trim()
}

// 
function parseHealthMetricBody(value: unknown): HealthMetricBody {
  if (!value || typeof value !== "object") {
    throw new ApiError(400, "Invalid request body.", "invalid_body")
  }

  const body = value as Partial<HealthMetricBody>
  const market = requireString(body.market, "market", 128)
  const country = requireString(body.country, "country", 8)

  // se não existir métricas, retorna erro.
  if (!Array.isArray(body.metrics) || body.metrics.length === 0 || body.metrics.length > 100) {
    throw new ApiError(400, "Invalid metrics.", "invalid_body")
  }

  // se a métrica específica não existtir, ou se ela não estiver tipada
  // corretamente, retorna erro.
  const metrics = body.metrics.map((metric) => {
    if (!metric || typeof metric !== "object") {
      throw new ApiError(400, "Invalid metric.", "invalid_body")
    }

    // retorna erro se o valor de alvo da saúde de métrica for inválido.
    const targetValue = Number(metric.target_value)
    if (!Number.isFinite(targetValue)) {
      throw new ApiError(400, "Invalid target_value.", "invalid_body")
    }

    // retorna erro se a direção da requisção for errada.
    const direction = metric.direction ?? "gte"
    if (direction !== "gte" && direction !== "lte") {
      throw new ApiError(400, "Invalid direction.", "invalid_body")
    }

    // Se a recomendação não estiver no tipo certo ( zerada, ou como objeto ), retorna erro.
    if (metric.recommendations !== undefined && !Array.isArray(metric.recommendations)) {
      throw new ApiError(400, "Invalid recommendations.", "invalid_body")
    }

    // Retorna métrica chave, o nome dela, o valor alvo dela a valor de unidade dela
    // a direção e a recomendação - caso a métrica não esteja OK.
    return {
      metric_key: requireString(metric.metric_key, "metric_key", 128),
      metric_label: requireString(metric.metric_label, "metric_label"),
      target_value: targetValue,
      unit: requireString(metric.unit, "unit", 32),
      direction,
      recommendations: metric.recommendations ?? [],
    }
  })

  return { market, country, metrics }
}

// Retorna o valor do supabase, ou retorna o erro. 
// Chama função de handler api, definida em /https
// 
export const onRequestGet = withApiHandler(
  async ({ request, env }: DashboardFunctionContext) => {
    await requireDashboardUser(request, env)

    const url = new URL(request.url)
    const params = new URLSearchParams({
      select: "*",
      order: "market.asc,country.asc,metric_key.asc",
      limit: "1000",
    })
    addEqFilter(params, "market", optionalDimension(url, "market"))
    addEqFilter(params, "country", optionalDimension(url, "country", 8))

    const { data } = await supabaseSelect<HealthMetricRow>(
      env,
      "dashboard_health_metrics",
      params
    )

    return Response.json({ data })
  }
)

// Retorna resposta do supabase ao atualizar a tabela final. 

// 
export const onRequestPut = withApiHandler(
  // cria uma função de handler anônima ( sem nome ). 
  async ({ request, env }: DashboardFunctionContext) => {

    // Retorna resposta do usuário
    const user = await requireDashboardUser(request, env)

    // Se não for adm não permite continuar, ou seja, apenas ADMs podem atualizar o software.
    if (user.profile.role !== "admin") {
      throw new ApiError(403, "Admin access required.", "forbidden")
    }

    // Retorna o body do health filtrado.
    const body = parseHealthMetricBody(await readJsonBody(request))

    // popula cada linha de health-metric disponível, com base em mercado + país
    const rows = body.metrics.map((metric) => ({
      market: body.market,
      country: body.country,
      ...metric,
    }))
    const params = new URLSearchParams({
      on_conflict: "market,country,metric_key",
    })
    // escreve no supabase, e retorna o valor escrito com tipagem HealthMetricRow
    const data = await supabaseWrite<HealthMetricRow>(
      env,
      "dashboard_health_metrics",
      params,
      { method: "POST", body: rows }
    )

    return Response.json({ data })
  }
)
