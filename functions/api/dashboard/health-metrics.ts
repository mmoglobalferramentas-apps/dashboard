import { ApiError, withApiHandler } from "../../../lib/dashboard-api/http"
import {
  addEqFilter,
  optionalDimension,
} from "../../../lib/dashboard-api/query"
import {
  requireDashboardUser,
  supabaseSelect,
  supabaseWrite,
} from "../../../lib/dashboard-api/supabase"
import type { DashboardFunctionContext } from "../../../lib/dashboard-api/types"

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

interface HealthMetricInput {
  metric_key: string
  metric_label: string
  target_value: number
  unit: string
  direction?: "gte" | "lte"
  recommendations?: unknown[]
}

interface HealthMetricBody {
  market: string
  country: string
  metrics: HealthMetricInput[]
}

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

function parseHealthMetricBody(value: unknown): HealthMetricBody {
  if (!value || typeof value !== "object") {
    throw new ApiError(400, "Invalid request body.", "invalid_body")
  }

  const body = value as Partial<HealthMetricBody>
  const market = requireString(body.market, "market", 128)
  const country = requireString(body.country, "country", 8)

  if (!Array.isArray(body.metrics) || body.metrics.length === 0 || body.metrics.length > 100) {
    throw new ApiError(400, "Invalid metrics.", "invalid_body")
  }

  const metrics = body.metrics.map((metric) => {
    if (!metric || typeof metric !== "object") {
      throw new ApiError(400, "Invalid metric.", "invalid_body")
    }

    const targetValue = Number(metric.target_value)
    if (!Number.isFinite(targetValue)) {
      throw new ApiError(400, "Invalid target_value.", "invalid_body")
    }

    const direction = metric.direction ?? "gte"
    if (direction !== "gte" && direction !== "lte") {
      throw new ApiError(400, "Invalid direction.", "invalid_body")
    }

    if (metric.recommendations !== undefined && !Array.isArray(metric.recommendations)) {
      throw new ApiError(400, "Invalid recommendations.", "invalid_body")
    }

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

export const onRequestPut = withApiHandler(
  async ({ request, env }: DashboardFunctionContext) => {
    const user = await requireDashboardUser(request, env)

    if (user.profile.role !== "admin") {
      throw new ApiError(403, "Admin access required.", "forbidden")
    }

    const body = parseHealthMetricBody(await request.json())
    const rows = body.metrics.map((metric) => ({
      market: body.market,
      country: body.country,
      ...metric,
    }))
    const params = new URLSearchParams({
      on_conflict: "market,country,metric_key",
    })
    const data = await supabaseWrite<HealthMetricRow>(
      env,
      "dashboard_health_metrics",
      params,
      { method: "POST", body: rows }
    )

    return Response.json({ data })
  }
)
