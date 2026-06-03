# Handoff: Punctual Dev Adjustment - Funnel Selector
**Date:** 2026-06-03
**Agent:** @dev

## Resumo das Tarefas
- **Ajuste:** Botão de seleção de funil (`/dashboard/app/dashboard/page.tsx`).
- **Problema:** O seletor de funis do Dashboard repetia os IDs quando o endpoint `/funnels` retornava múltiplas combinações do mesmo funil em países diferentes. Isso fazia com que o componente concatenasse todo o texto causando overflow e não-responsividade.
- **Solução:** Aplicada a extração de `funnel_id` únicos via `useMemo` com `Set`. O componente Radix `<Select>` agora itera apenas sobre `uniqueFunnelIds`, garantindo renderização de apenas uma opção por funil e preservando toda a lógica paralela de seleção de país (que continua sendo feita a partir do array completo `funnels`).
- **Risco:** 🟢 LOW
- **Gates Passados:** Revisão de lógica de estados; Manutenção de retrocompatibilidade com hooks de país (`availableCountries`).

## Arquivos Modificados
- `dashboard/app/dashboard/page.tsx`

## Status
- **Finalizado:** Sim
- **Rollback Existente:** Sim (descrito no Planning Output)

# Handoff: Lead Detail API Integration
**Agent:** @dev

## Resumo das Tarefas
- **Ajuste:** Integração da página de detalhes do Lead (`/dashboard/app/dashboard/leads/detail/page.tsx`).
- **Problema:** A página de detalhes não estava encontrando leads ao clicar na tabela principal pois a URL usa um `lead_id` real (UUID) puxado da base de dados, mas o componente detalhe tentava extrair de um dicionário local `mockLeadDetails` com dados hardcoded.
- **Solução:** O mock foi integralmente removido. No lugar, foram adicionados os hooks de estado (`useState`, `useEffect`) para bater no endpoint `/api/dashboard/leads/[leadId]` através da função client-side `fetchDashboardApi`. O payload retornado com `lead` e sua respectiva timeline de `events` foi mapeado para a UI, adaptando todos os campos dinamicamente e resolvendo o erro de compatibilidade de ID.
- **Risco:** 🟡 MEDIUM
- **Gates Passados:** Remoção completa de mocks. Garantia de fallback com erro caso o UUID seja inválido ou 404 (Not Found).

## Arquivos Modificados
- `dashboard/app/dashboard/leads/detail/page.tsx`

## Status
- **Finalizado:** Sim
