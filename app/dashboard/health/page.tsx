"use client"

import Image from "next/image"
import { useMemo, useState, useEffect } from "react"
import {
  ClipboardCopy,
  HeartPulse,
  Save,
  Loader2,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FadeUp } from "@/components/ui/fade-up"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchDashboardApi } from "@/lib/api-client"

interface HealthMetricInput {
  metric_key: string
  metric_label: string
  target_value: number
  unit: string
  direction?: "gte" | "lte"
  description?: string
  recommendations?: unknown[]
}

interface NicheOption {
  id: string
  market: string
  country: string
  countryLabel: string
}

const defaultNicheOptions: NicheOption[] = [
  { id: "direct-response-br", market: "Direct Response", country: "BR", countryLabel: "Brasil" },
  { id: "health-br", market: "Saude", country: "BR", countryLabel: "Brasil" },
  { id: "weight-loss-mx", market: "Emagrecimento", country: "MX", countryLabel: "Mexico" },
]

export default function HealthConfigPage() {
  const [selectedNicheId, setSelectedNicheId] = useState<string>("direct-response-br")
  const [copySourceId, setCopySourceId] = useState<string>("health-br")
  const [metricsByNiche, setMetricsByNiche] = useState<Record<string, HealthMetricInput[]>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastAction, setLastAction] = useState("Carregando metas do banco...")
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const selectedNiche = useMemo(
    () => defaultNicheOptions.find((niche) => niche.id === selectedNicheId) ?? defaultNicheOptions[0],
    [selectedNicheId]
  )

  const marketOptions = Array.from(new Set(defaultNicheOptions.map((niche) => niche.market)))
  const countryOptions = defaultNicheOptions.filter((niche) => niche.market === selectedNiche.market)
  const metrics = metricsByNiche[selectedNicheId] || []

  // Load Initial Metrics
  useEffect(() => {
    setIsLoading(true)
    fetchDashboardApi<(HealthMetricInput & { market: string; country: string })[]>("/health-metrics")
      .then((res) => {
        // Group by niche id (market-country)
        const grouped: Record<string, HealthMetricInput[]> = {}
        // Initialize default niches with empty arrays
        defaultNicheOptions.forEach(n => {
          grouped[n.id] = []
        })

        res.forEach(metric => {
          // find matching niche id
          const matchingNiche = defaultNicheOptions.find(n => n.market === metric.market && n.country === metric.country)
          const nicheId = matchingNiche ? matchingNiche.id : `${metric.market}-${metric.country}`
          
          if (!grouped[nicheId]) grouped[nicheId] = []
          
          grouped[nicheId].push({
            metric_key: metric.metric_key,
            metric_label: metric.metric_label,
            target_value: metric.target_value,
            unit: metric.unit,
            direction: metric.direction,
            recommendations: metric.recommendations
          })
        })

        setMetricsByNiche(grouped)
        setLastAction("Dados carregados com sucesso da API.")
      })
      .catch((err) => {
        console.error("Health metrics fetch error", err)
        setLastAction(`Erro ao carregar dados: ${err.message}`)
      })
      .finally(() => setIsLoading(false))
  }, [])

  function selectNiche(nicheId: string) {
    setSelectedNicheId(nicheId)
    setCopySourceId(
      (defaultNicheOptions.find((niche) => niche.id !== nicheId)?.id ?? nicheId)
    )
    setHasUnsavedChanges(false)
    setLastAction("Nicho alterado. Valores atualizados.")
  }

  function selectMarket(market: string) {
    const nextNiche = defaultNicheOptions.find((niche) => niche.market === market)
    if (nextNiche) selectNiche(nextNiche.id)
  }

  function selectCountry(country: string) {
    const nextNiche = defaultNicheOptions.find(
      (niche) => niche.market === selectedNiche.market && niche.country === country
    )
    if (nextNiche) selectNiche(nextNiche.id)
  }

  function updateMetric(metricKey: string, value: string) {
    setMetricsByNiche((current) => ({
      ...current,
      [selectedNicheId]: (current[selectedNicheId] || []).map((metric) =>
        metric.metric_key === metricKey ? { ...metric, target_value: Number(value) } : metric
      ),
    }))
    setHasUnsavedChanges(true)
    setLastAction("Existem alteracoes locais ainda nao salvas.")
  }

  function copyMetrics() {
    if (!metricsByNiche[copySourceId]) return
    setMetricsByNiche((current) => ({
      ...current,
      [selectedNicheId]: current[copySourceId].map((metric) => ({ ...metric })),
    }))
    setHasUnsavedChanges(true)
    setLastAction("Metas copiadas para o formulario. Salve para confirmar a alteracao.")
  }

  function saveChanges() {
    setIsSaving(true)
    setLastAction("Salvando...")
    
    fetchDashboardApi("/health-metrics", {
      method: "PUT",
      body: JSON.stringify({
        market: selectedNiche.market,
        country: selectedNiche.country,
        metrics: metricsByNiche[selectedNicheId]
      })
    })
      .then(() => {
        setHasUnsavedChanges(false)
        setLastAction("Alteracoes salvas com sucesso no Supabase.")
      })
      .catch((err) => {
        setLastAction(`Falha ao salvar: ${err.message}`)
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <FadeUp
          offset={-24}
          delay={0.04}
          className="flex min-w-0 flex-col gap-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent" className="w-fit rounded-md uppercase">
              Health Config
            </Badge>
            <Badge variant="outline" className="w-fit rounded-md">
              Operacao
            </Badge>
            {hasUnsavedChanges ? (
              <Badge variant="secondary" className="w-fit rounded-md">
                Alteracoes nao salvas
              </Badge>
            ) : null}
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl flex items-center gap-4">
            Metricas de Saude
            {isLoading && <Loader2 className="size-8 animate-spin text-muted-foreground" />}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Configure os benchmarks que orientam os alertas de saude do
            funil para cada combinacao de mercado e pais.
          </p>
        </FadeUp>

        <FadeUp offset={-24} delay={0.12} className="w-fit">
          <Button
            className="w-fit"
            onClick={saveChanges}
            disabled={!hasUnsavedChanges || isSaving}
          >
            {isSaving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
            Salvar alteracoes
          </Button>
        </FadeUp>
      </div>

      <section className="grid items-start gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="grid gap-6">
          <FadeUp offset={-24} delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Nicho selecionado</CardTitle>
                <CardDescription>
                  Mercado e pais definem o conjunto de benchmarks.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="grid gap-2">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Mercado
                  </Label>
                  <Select value={selectedNiche.market} onValueChange={selectMarket}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar mercado" />
                    </SelectTrigger>
                    <SelectContent>
                      {marketOptions.map((market) => (
                        <SelectItem key={market} value={market}>
                          {market}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs uppercase text-muted-foreground">
                    Pais
                  </Label>
                  <Select value={selectedNiche.country} onValueChange={selectCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar pais" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryOptions.map((niche) => (
                        <SelectItem key={niche.id} value={niche.country}>
                          {niche.countryLabel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <p className="text-xs uppercase text-muted-foreground">
                    Configurando agora
                  </p>
                  <p className="mt-2 font-semibold">
                    {selectedNiche.market} · {selectedNiche.country}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Valores abaixo das metas configuradas devem disparar
                    alertas no dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </FadeUp>

          <FadeUp offset={-24} delay={0.36}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Copiar benchmarks</CardTitle>
                <CardDescription>
                  Preencha o formulario com metas de outro nicho.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Select
                  value={copySourceId}
                  onValueChange={(value) => setCopySourceId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar nicho de origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultNicheOptions
                      .filter((niche) => niche.id !== selectedNicheId)
                      .map((niche) => (
                        <SelectItem key={niche.id} value={niche.id}>
                          {niche.market} · {niche.country}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="justify-start" onClick={copyMetrics}>
                  <ClipboardCopy className="size-4 mr-2" />
                  Copiar para este nicho
                </Button>
              </CardContent>
            </Card>
          </FadeUp>

          <FadeUp offset={-24} delay={0.44}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Outros nichos</CardTitle>
                <CardDescription>
                  Acesse rapidamente configuracoes existentes.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {defaultNicheOptions.map((niche) => (
                  <Button
                    key={niche.id}
                    variant={niche.id === selectedNicheId ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => selectNiche(niche.id)}
                  >
                    {niche.market} · {niche.country}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </FadeUp>

          <FadeUp offset={-24} delay={0.52}>
            <Card className="overflow-hidden p-0">
              <div className="relative min-h-[220px] bg-muted">
                <Image
                  src="/images/dashboard/funnel-health-img.png"
                  alt="Flores em uma paisagem noturna, assinatura visual da configuracao de saude"
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1280px) 340px, 100vw"
                />
                <div className="absolute inset-0 bg-secondary/35" />
                <div className="absolute inset-x-5 bottom-5 rounded-lg bg-card/90 p-4 shadow-sm backdrop-blur">
                  <p className="font-semibold">Benchmarks validados</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Metas de referencia organizadas por nicho.
                  </p>
                </div>
              </div>
            </Card>
          </FadeUp>
        </div>

        <FadeUp offset={-24} delay={0.28} amount={0.12}>
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-2xl">Metas minimas saudaveis</CardTitle>
                  <CardDescription>
                    Ajuste os valores usados para identificar pontos de atencao.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="w-fit rounded-md">
                  {metrics.length} metricas
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <Alert className="border-primary/50 bg-accent text-accent-foreground">
                <HeartPulse className="size-4" />
                <AlertTitle>Configuracao por nicho</AlertTitle>
                <AlertDescription>{lastAction}</AlertDescription>
              </Alert>

              <Table>
                <TableHeader className="hidden md:table-header-group">
                  <TableRow>
                    <TableHead className="min-w-[340px]">Metrica</TableHead>
                    <TableHead className="w-[150px]">Meta minima</TableHead>
                    <TableHead className="w-[120px]">Unidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((metric) => (
                    <TableRow
                      key={metric.metric_key}
                      className="block py-4 hover:bg-transparent md:table-row md:py-0 md:hover:bg-muted/50"
                    >
                      <TableCell className="block px-0 py-0 md:table-cell md:p-4">
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="font-semibold">{metric.metric_label}</span>
                          <span className="text-sm leading-6 text-muted-foreground">
                            {metric.description || metric.metric_key}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="mt-4 block px-0 py-0 md:table-cell md:p-4">
                        <Label className="mb-2 block text-xs uppercase text-muted-foreground md:hidden">
                          Meta minima
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          value={metric.target_value}
                          onChange={(event) =>
                            updateMetric(metric.metric_key, event.target.value)
                          }
                          aria-label={`Meta minima para ${metric.metric_label}`}
                        />
                      </TableCell>
                      <TableCell className="mt-3 block px-0 py-0 md:table-cell md:p-4">
                        <Label className="mb-2 block text-xs uppercase text-muted-foreground md:hidden">
                          Unidade
                        </Label>
                        <Input
                          value={metric.unit}
                          readOnly
                          aria-label={`Unidade para ${metric.metric_label}`}
                          className="text-muted-foreground"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {metrics.length === 0 && !isLoading && (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  Nenhuma métrica configurada ou encontrada.
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-muted-foreground">
                  A integracao real com `dashboard_health_metrics` esta ativa.
                </p>
                <Button onClick={saveChanges} disabled={!hasUnsavedChanges || isSaving}>
                  {isSaving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                  Salvar alteracoes
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </section>
    </div>
  )
}
