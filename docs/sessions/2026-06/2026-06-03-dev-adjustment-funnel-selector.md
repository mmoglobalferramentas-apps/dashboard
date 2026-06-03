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
