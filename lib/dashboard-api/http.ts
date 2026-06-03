import type { DashboardFunctionContext } from "./types"

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string = "request_failed"
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function jsonResponse(data: unknown, status = 200, headers?: HeadersInit) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  })
}

export function withApiHandler(
  handler: (context: DashboardFunctionContext) => Promise<Response>
) {
  return async (context: DashboardFunctionContext) => {
    try {
      return await handler(context)
    } catch (error) {
      if (error instanceof ApiError) {
        return jsonResponse(
          { error: error.code, message: error.message },
          error.status
        )
      }

      console.error("dashboard_api_error", {
        message: error instanceof Error ? error.message : "Unknown error",
      })

      return jsonResponse(
        { error: "internal_error", message: "Unable to complete request." },
        500
      )
    }
  }
}

export function requireBearerToken(request: Request) {
  const authorization = request.headers.get("authorization")

  if (!authorization?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required.", "unauthorized")
  }

  const token = authorization.slice("Bearer ".length).trim()

  if (!token) {
    throw new ApiError(401, "Authentication required.", "unauthorized")
  }

  return token
}

export async function readJsonBody(request: Request) {
  try {
    return await request.json()
  } catch {
    throw new ApiError(400, "Invalid JSON body.", "invalid_body")
  }
}
