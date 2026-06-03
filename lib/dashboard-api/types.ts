export interface DashboardEnv {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

export interface DashboardFunctionContext {
  request: Request
  env: DashboardEnv
  params: Record<string, string | string[]>
}

export interface DashboardProfile {
  user_id: string
  email: string
  name: string | null
  role: "admin" | "viewer"
}

export interface DashboardUser {
  id: string
  email: string | null
  profile: DashboardProfile
}

export interface SupabaseListResult<T> {
  data: T[]
  count: number | null
}
