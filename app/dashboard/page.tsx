"use client"

import Image from "next/image"
import { useEffect, useState, useMemo } from "react"
import {
  CalendarDays,
  ChevronRight,
  Gauge,
  Loader2,
} from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { DateSelector } from "@/components/ui/date-selector"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FadeUp } from "@/components/ui/fade-up"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchDashboardApi } from "@/lib/api-client"

interface FunnelOption {
  funnel_id: string
  country: string
  market: string
}

interface OverviewData {
  filters: Record<string, string | null>
  kpis: {
    total_leads: number
    total_ics: number
    purchases: number
    checkout_conversion_rate: number
    non_converted_ics: number
  }
  steps: Array<{
    step_key: string
    step_label: string
    step_index: number | null
    event_count: number
    lead_count: number
    passage_percentage: number
  }>
  health_metrics: Record<string, unknown>[]
}

export default function DashboardPage() {
  const [funnels, setFunnels] = useState<FunnelOption[]>([])
  const [selectedFunnel, setSelectedFunnel] = useState<string>("")
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>()
  
  const [data, setData] = useState<OverviewData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch Funnels options
  useEffect(() => {
    fetchDashboardApi<FunnelOption[]>("/funnels")
      .then((res) => {
        setFunnels(res)
        if (res.length > 0) {
          setSelectedFunnel(res[0].funnel_id)
        }
      })
      .catch((err) => {
        console.error("Failed to load funnels", err)
        setError(err.message)
      })
  }, [])

  // Derived options based on selected funnel
  const currentFunnelObj = funnels.find(f => f.funnel_id === selectedFunnel)
  const availableCountries = useMemo(() => {
    if (!selectedFunnel) return []
    // Group by country for the selected funnel or just show the country of the selected funnel
    return Array.from(new Set(funnels.filter(f => f.funnel_id === selectedFunnel).map(f => f.country)))
  }, [funnels, selectedFunnel])

  useEffect(() => {
    if (availableCountries.length > 0 && !availableCountries.includes(selectedCountry)) {
      setSelectedCountry(availableCountries[0])
    }
  }, [availableCountries, selectedCountry])

  const uniqueFunnelIds = useMemo(() => {
    return Array.from(new Set(funnels.map(f => f.funnel_id)))
  }, [funnels])

  // Fetch Overview Data
  useEffect(() => {
    if (!selectedFunnel) return

    setIsLoading(true)
    setError("")
    
    const params = new URLSearchParams()
    params.set("funnel_id", selectedFunnel)
    if (selectedCountry) params.set("country", selectedCountry)
    if (currentFunnelObj?.market) params.set("market", currentFunnelObj.market)
    if (selectedDateRange?.from) params.set("from", selectedDateRange.from.toISOString().split("T")[0])
    if (selectedDateRange?.to) params.set("to", selectedDateRange.to.toISOString().split("T")[0])

    fetchDashboardApi<OverviewData>(`/overview?${params.toString()}`)
      .then((res) => setData(res))
      .catch((err) => {
        console.error("Overview error", err)
        setError(err.message)
      })
      .finally(() => setIsLoading(false))
  }, [selectedFunnel, selectedCountry, currentFunnelObj, selectedDateRange])

  const kpis = data ? [
    { label: "Visitantes", value: data.kpis.total_leads, hint: "Entrada total" },
    { label: "ICs", value: data.kpis.total_ics, hint: "Cliques no checkout" },
    { label: "Vendas", value: data.kpis.purchases, hint: "Compras confirmadas" },
    { label: "Conv. checkout", value: `${data.kpis.checkout_conversion_rate}%`, hint: "ICs convertidos" },
  ] : [
    { label: "Visitantes", value: "--", hint: "Entrada total" },
    { label: "ICs", value: "--", hint: "Cliques no checkout" },
    { label: "Vendas", value: "--", hint: "Compras confirmadas" },
    { label: "Conv. checkout", value: "--", hint: "ICs convertidos" },
  ]

  const maxEventCount = data?.steps ? Math.max(...data.steps.map(s => s.event_count), 1) : 1

  return (
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_640px] xl:items-end">
        <FadeUp
          offset={-24}
          delay={0.04}
          className="flex min-w-0 flex-col gap-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent" className="w-fit rounded-md uppercase">
              Funnel Overview
            </Badge>
            <Badge variant="outline" className="w-fit rounded-md">
              Operacao
            </Badge>
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Funnel Overview
          </h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </FadeUp>

        <FadeUp offset={-24} delay={0.12}>
          <Card className="py-4">
            <CardContent className="grid gap-3 px-4 sm:grid-cols-[minmax(0,1fr)_150px_190px]">
              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground">
                  Funil
                </Label>
                <Select value={selectedFunnel} onValueChange={setSelectedFunnel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar funil" />
                  </SelectTrigger>
                  <SelectContent>
                    {funnels.length === 0 ? (
                      <SelectItem value="empty" disabled>Nenhum funil disponivel</SelectItem>
                    ) : (
                      uniqueFunnelIds.map(id => (
                        <SelectItem key={id} value={id}>
                          {id}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground">
                  Pais
                </Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pais" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCountries.length === 0 ? (
                      <SelectItem value="empty" disabled>Sem pais</SelectItem>
                    ) : (
                      availableCountries.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground">
                  Periodo
                </Label>
                <DateSelector 
                  className="w-full" 
                  date={selectedDateRange}
                  onDateChange={setSelectedDateRange} 
                />
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </div>

      <section className="grid gap-6 xl:grid-cols-2 xl:[grid-template-areas:'metrics_progress'_'flux_summary']">
        <section className="grid gap-6 md:grid-cols-2 md:auto-rows-fr xl:[grid-area:metrics]">
          {kpis.map((kpi, index) => (
            <FadeUp
              key={kpi.label}
              offset={-24}
              delay={0.2 + index * 0.08}
              className="h-full"
            >
              <Card className="h-full">
                <CardHeader className="gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <CardDescription>{kpi.label}</CardDescription>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-4xl font-bold leading-none flex items-center gap-2">
                    {kpi.value}
                    {isLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {kpi.hint}
                  </p>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </section>

        <FadeUp
          offset={-24}
          delay={0.52}
          amount={0.12}
          className="h-full xl:[grid-area:progress]"
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    Fluxo do funil
                    {isLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription>
                    Passagem entre paginas, ICs e vendas.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="w-fit rounded-md">
                  Periodo atual
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex h-full flex-col gap-5">
              {!data?.steps || data.steps.length === 0 ? (
                <div className="text-sm text-muted-foreground py-4">Sem registros no periodo selecionado.</div>
              ) : (
                data.steps.map((step, index) => {
                  const pct = Math.round((step.event_count / maxEventCount) * 100)
                  return (
                    <div key={step.step_key} className="grid gap-2">
                      <div className="grid grid-cols-[32px_minmax(0,1fr)_auto_auto] items-center gap-3 text-sm">
                        <span className="text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 truncate font-semibold">
                          {step.step_label}
                        </span>
                        {step.step_key === "checkout" ? (
                          <Badge variant="accent" className="rounded-md">IC</Badge>
                        ) : step.step_key === "venda" ? (
                          <Badge variant="secondary" className="rounded-md">VENDA</Badge>
                        ) : (
                          <span />
                        )}
                        <span className="font-semibold text-muted-foreground">
                          {step.event_count}
                        </span>
                      </div>
                      <Progress value={pct} className="h-2 bg-muted" />
                      <p className="pl-11 text-xs text-muted-foreground">
                        {step.passage_percentage}% de passagem
                      </p>
                    </div>
                  )
                })
              )}

              <Alert className="mt-auto border-primary/50 bg-accent text-accent-foreground">
                <Gauge className="size-4" />
                <AlertTitle>Saude do funil</AlertTitle>
                <AlertDescription>
                  {data?.health_metrics?.length ? (
                    `${data.health_metrics.length} metricas configuradas.`
                  ) : (
                    "Selecione um funil para revisar gargalos e pontos de atencao."
                  )}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp
          offset={-24}
          delay={0.08}
          amount={0.12}
          className="h-full xl:[grid-area:flux]"
        >
          <Card className="h-full overflow-hidden p-0">
            <div className="relative min-h-[320px] h-full bg-muted">
              <Image
                src="/images/dashboard/mountains-funnel-flux.png"
                alt="Montanhas noturnas, assinatura visual do Funnel Overview"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1280px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-secondary/35" />
              <div className="absolute inset-x-5 bottom-5 rounded-lg bg-card/90 p-4 shadow-sm backdrop-blur">
                <p className="font-semibold">Funnel Flux</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Leitura visual do caminho percorrido pelo lead.
                </p>
              </div>
            </div>
          </Card>
        </FadeUp>

        <FadeUp
          offset={-24}
          delay={0.16}
          amount={0.12}
          className="h-full xl:[grid-area:summary]"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl">Resumo do funil</CardTitle>
              <CardDescription>
                Filtros ativos e ultimo sinal da operacao.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <span className="text-muted-foreground">Funil</span>
                <span className="font-semibold">{selectedFunnel || "--"}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <span className="text-muted-foreground">Pais</span>
                <span className="font-semibold">{selectedCountry || "--"}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <span className="text-muted-foreground">Periodo</span>
                <span className="font-semibold">
                  {selectedDateRange?.from ? selectedDateRange.from.toLocaleDateString() : "--"} 
                  {selectedDateRange?.to ? ` a ${selectedDateRange.to.toLocaleDateString()}` : ""}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {data?.steps?.slice(0, 3).map(s => (
                  <Badge key={s.step_key} variant="outline" className="rounded-md">
                    {s.step_label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </section>
    </div>
  )
}
