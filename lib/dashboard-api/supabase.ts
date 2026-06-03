import { ApiError, requireBearerToken } from "./http"
import type {
  DashboardEnv,
  DashboardProfile,
  DashboardUser,
  SupabaseListResult,
} from "./types"

interface SupabaseAuthUser {
  id: string
  email?: string | null
}

interface SupabaseRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  count?: "exact"
  headers?: HeadersInit
}

function requireEnv(env: DashboardEnv) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new ApiError(500, "Dashboard backend is not configured.", "missing_config")
  }
}

function supabaseUrl(env: DashboardEnv, path: string) {
  return `${env.SUPABASE_URL.replace(/\/+$/, "")}${path}`
}

function serviceRoleHeaders(env: DashboardEnv, headers?: HeadersInit) {
  const result = new Headers(headers)
  result.set("apikey", env.SUPABASE_SERVICE_ROLE_KEY)
  result.set("Authorization", `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`)
  result.set("Accept", "application/json")
  return result
}

async function parseSupabaseError(response: Response) {
  const fallback = `Supabase request failed with status ${response.status}.`

  try {
    const payload = (await response.json()) as { message?: string }
    return payload.message || fallback
  } catch {
    return fallback
  }
}

export async function requireDashboardUser(request: Request, env: DashboardEnv) {
  requireEnv(env)
  const token = requireBearerToken(request)

  const authResponse = await fetch(supabaseUrl(env, "/auth/v1/user"), {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })

  if (!authResponse.ok) {
    throw new ApiError(401, "Invalid or expired session.", "unauthorized")
  }

  const authUser = (await authResponse.json()) as SupabaseAuthUser
  const params = new URLSearchParams({
    select: "user_id,email,name,role",
    user_id: `eq.${authUser.id}`,
    limit: "1",
  })
  const profiles = await supabaseSelect<DashboardProfile>(
    env,
    "dashboard_profiles",
    params
  )
  const profile = profiles.data[0]

  if (!profile) {
    throw new ApiError(403, "Dashboard access has not been granted.", "forbidden")
  }

  return {
    id: authUser.id,
    email: authUser.email ?? null,
    profile,
  } satisfies DashboardUser
}

export async function supabaseSelect<T>(
  env: DashboardEnv,
  resource: string,
  params: URLSearchParams,
  options: SupabaseRequestOptions = {}
): Promise<SupabaseListResult<T>> {
  requireEnv(env)

  const headers = serviceRoleHeaders(env, options.headers)
  if (options.count) {
    headers.set("Prefer", `count=${options.count}`)
  }

  const response = await fetch(
    supabaseUrl(env, `/rest/v1/${resource}?${params.toString()}`),
    { method: options.method ?? "GET", headers }
  )

  if (!response.ok) {
    const message = await parseSupabaseError(response)
    console.error("supabase_select_failed", { resource, status: response.status })
    throw new ApiError(502, message, "upstream_error")
  }

  const contentRange = response.headers.get("content-range")
  const countText = contentRange?.split("/")[1]
  const count = countText && countText !== "*" ? Number(countText) : null

  return {
    data: (await response.json()) as T[],
    count: Number.isFinite(count) ? count : null,
  }
}

export async function supabaseWrite<T>(
  env: DashboardEnv,
  resource: string,
  params: URLSearchParams,
  options: SupabaseRequestOptions
): Promise<T[]> {
  requireEnv(env)

  const headers = serviceRoleHeaders(env, options.headers)
  headers.set("Content-Type", "application/json")
  headers.set("Prefer", "return=representation,resolution=merge-duplicates")

  const response = await fetch(
    supabaseUrl(env, `/rest/v1/${resource}?${params.toString()}`),
    {
      method: options.method ?? "POST",
      headers,
      body: JSON.stringify(options.body),
    }
  )

  if (!response.ok) {
    const message = await parseSupabaseError(response)
    console.error("supabase_write_failed", { resource, status: response.status })
    throw new ApiError(502, message, "upstream_error")
  }

  return (await response.json()) as T[]
}

export async function supabaseRpc<T>(
  env: DashboardEnv,
  functionName: string,
  body: Record<string, unknown>
): Promise<T[]> {
  requireEnv(env)

  const headers = serviceRoleHeaders(env)
  headers.set("Content-Type", "application/json")

  const response = await fetch(
    supabaseUrl(env, `/rest/v1/rpc/${functionName}`),
    {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }
  )

  if (!response.ok) {
    const message = await parseSupabaseError(response)
    console.error("supabase_rpc_failed", {
      functionName,
      status: response.status,
    })
    throw new ApiError(502, message, "upstream_error")
  }

  return (await response.json()) as T[]
}
