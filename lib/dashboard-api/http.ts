// Código responsável por inúmeras funções importadas fora dele.
// Importa o tipo dashboard funcion context. Um tipo responsável por alimentar 
// funções de dashboard.

import type { DashboardFunctionContext } from "./types"

// cria a classe API erro, que captura valores do ERRO. 
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

// cria a função de resposta com JSON tratado.
export function jsonResponse(data: unknown, status = 200, headers?: HeadersInit) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  })
}

// export function withApihandler, que é responsável por: 
export function withApiHandler(

  // Em um contexto de desenvolvimento com APIS, um handler é responsável por
  // receber requisições --> procesá-las --> respondê-las.
  // no caso abaixo, o handler é responsável por: recebre os dados de contexto
  // de uma requisição e então, promete retornar uma resposta.
  // no caso, a resposta é a que vem do serivdor final.
  handler: (context: DashboardFunctionContext) => Promise<Response>
) {
  return async (context: DashboardFunctionContext) => {
    try {
      // espera obtero o resultado da resposta do handler. SE 
      // houver algum erro, cai no catch, para retornar o erro.
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

// função que trata Bearer token, se a configuração estivar errada ( sem Bearer ou sem Token)
// Retorna erro, se não, retorna o token.
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

// Captura o json do request, SE não conseguir capturar retorna mensagem de erro.
export async function readJsonBody(request: Request) {
  try {
    return await request.json()
  } catch {
    throw new ApiError(400, "Invalid JSON body.", "invalid_body")
  }
}
