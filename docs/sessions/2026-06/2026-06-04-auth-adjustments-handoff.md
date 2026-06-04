# Auth & Redirect Adjustments (Handoff)

**Data:** 2026-06-04
**Escopo:** Integração de autenticação Supabase e roteamento de proteção.

## O que foi alterado
1. **Redirect Global no HTTP 401**: O client base da API (`lib/api-client.ts`) agora escuta por respostas `401 Unauthorized` e força um redirecionamento limpo (`window.location.href = '/login'`), garantindo que usuários deslogados jamais vejam a interface quebrada com alertas vermelhos na tela.
2. **Sessões Persistentes (30 Dias)**: Em vez de capturar o `access_token` no login e armazená-lo numa chave estática (`DASHBOARD_ACCESS_TOKEN`), todo o ciclo de vida do token foi transferido para as mãos do `supabase-js`. 
   - A página de login não manipula mais o `localStorage` manualmente.
   - O `layout.tsx` do dashboard invoca `supabaseClient.auth.getSession()` para verificar se o usuário pode acessar a rota.
   - O `api-client.ts` extrai o token atualizado sob demanda usando `getSession()`, usufruindo da lógica de *auto-refresh* do SDK.
   
## Implicações
- **Duração da Sessão**: A sessão durará indefinidamente desde que haja atividade. Para cravar um expurgo exato em 30 dias de inatividade ou uso, o tempo de vida do Refresh Token (e o Time-to-Live da sessão) **precisa ser configurado** no painel do Supabase (Auth > Sessions > Time-to-Live).
- A aplicação é agora muito mais robusta em cenários multi-abas, já que o SDK sincroniza a sessão via storage event nativo.

## Rollback
Se houver a necessidade de reverter para tokens manuais com expiração estrita de 1 hora, faça revert dos arquivos `app/login/page.tsx`, `app/dashboard/layout.tsx` e `lib/api-client.ts` para o último commit anterior.
