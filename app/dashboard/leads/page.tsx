"use client"

import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import {
  ClipboardCopy,
  Search,
  Loader2,
} from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DateSelector } from "@/components/ui/date-selector"
import { FadeUp } from "@/components/ui/fade-up"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
import { cn } from "@/components/ui/utils"
import { fetchDashboardApi } from "@/lib/api-client"

interface FunnelOption {
  funnel_id: string
  country: string
  market: string
}

interface LeadRow {
  lead_id: string
  contact: string | null
  funnel_id: string
  country: string | null
  market: string | null
  first_event_at: string
  last_event_at: string
  has_checkout: boolean
  has_purchase: boolean
}

type ConditionalFilter = "leadId" | "contact" | "ic" | "purchase"

const conditionalFilters: Array<{
  id: ConditionalFilter
  label: string
  inputLabel?: string
  defaultInputValue?: string
}> = [
  { id: "leadId", label: "Lead ID", inputLabel: "Filtro por lead ID", defaultInputValue: "ld_002" },
  { id: "contact", label: "Contato", inputLabel: "Filtro por contato", defaultInputValue: "gmail" },
  { id: "ic", label: "IC realizado" },
  { id: "purchase", label: "Compra realizada" },
]

export default function LeadsPage() {
  const [funnels, setFunnels] = useState<FunnelOption[]>([])
  const [selectedFunnel, setSelectedFunnel] = useState<string>("")
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>()
  
  const [activeFilters, setActiveFilters] = useState<Record<ConditionalFilter, boolean>>({
    leadId: false,
    contact: false,
    ic: false,
    purchase: false,
  })
  
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    leadId: "",
    contact: ""
  })

  const [leads, setLeads] = useState<LeadRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDashboardApi<FunnelOption[]>("/funnels")
      .then((res) => {
        setFunnels(res)
        if (res.length > 0) {
          setSelectedFunnel(res[0].funnel_id)
        }
      })
      .catch((err) => console.error("Failed to load funnels", err))
  }, [])

  const currentFunnelObj = funnels.find(f => f.funnel_id === selectedFunnel)
  const availableCountries = useMemo(() => {
    if (!selectedFunnel) return []
    return Array.from(new Set(funnels.filter(f => f.funnel_id === selectedFunnel).map(f => f.country)))
  }, [funnels, selectedFunnel])

  useEffect(() => {
    if (availableCountries.length > 0 && !availableCountries.includes(selectedCountry)) {
      setSelectedCountry(availableCountries[0])
    }
  }, [availableCountries, selectedCountry])

  const loadLeads = () => {
    if (!selectedFunnel) return

    setIsLoading(true)
    setError("")
    
    const params = new URLSearchParams()
    params.set("funnel_id", selectedFunnel)
    if (selectedCountry) params.set("country", selectedCountry)
    if (currentFunnelObj?.market) params.set("market", currentFunnelObj.market)
    if (selectedDateRange?.from) params.set("from", selectedDateRange.from.toISOString().split("T")[0])
    if (selectedDateRange?.to) params.set("to", selectedDateRange.to.toISOString().split("T")[0])
    
    if (activeFilters.ic) params.set("has_checkout", "true")
    if (activeFilters.purchase) params.set("has_purchase", "true")
    if (activeFilters.leadId && filterValues.leadId) params.set("lead_id", filterValues.leadId)
    if (activeFilters.contact && filterValues.contact) params.set("contact", filterValues.contact)

    fetchDashboardApi<LeadRow[]>(`/leads?${params.toString()}`)
      .then((res) => setLeads(res))
      .catch((err) => {
        console.error("Leads error", err)
        setError(err.message)
      })
      .finally(() => setIsLoading(false))
  }

  // Load leads when core filters change (debounced manually via Apply button for conditionals)
  useEffect(() => {
    loadLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFunnel, selectedCountry, currentFunnelObj, selectedDateRange])

  function toggleFilter(filter: ConditionalFilter, checked: boolean | "indeterminate") {
    setActiveFilters((current) => ({
      ...current,
      [filter]: checked === true,
    }))
  }
  
  function updateFilterValue(filter: string, val: string) {
    setFilterValues(cur => ({ ...cur, [filter]: val }))
  }

  return (
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_640px] xl:items-end">
        <FadeUp
          offset={-24}
          delay={0.04}
          className="flex min-w-0 flex-col gap-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent" className="w-fit rounded-md uppercase">
              Leads Table
            </Badge>
            <Badge variant="outline" className="w-fit rounded-md">
              Operacao
            </Badge>
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl flex items-center gap-4">
            Leads
            {isLoading && <Loader2 className="size-8 animate-spin text-muted-foreground" />}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Lista operacional de leads, eventos-chave e filtros para
            investigacao rapida do funil.
          </p>
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
                      funnels.map(f => (
                        <SelectItem key={f.funnel_id} value={f.funnel_id}>
                          {f.funnel_id}
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

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Leads carregados", value: leads.length.toString(), hint: "Visíveis na página atual" },
          { label: "IC realizado", value: leads.filter(l => l.has_checkout).length.toString(), hint: "Dos visíveis" },
          { label: "Compra realizada", value: leads.filter(l => l.has_purchase).length.toString(), hint: "Dos visíveis" },
        ].map((metric, index) => (
          <FadeUp
            key={metric.label}
            offset={-24}
            delay={0.2 + index * 0.08}
            className="h-full"
          >
            <Card className="h-full">
              <CardHeader className="gap-3">
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="text-4xl font-bold leading-none">
                  {metric.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {metric.hint}
                </p>
              </CardContent>
            </Card>
          </FadeUp>
        ))}
      </section>

      <section className="flex flex-col gap-5">
        <FadeUp offset={-24} delay={0.44} amount={0.12}>
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <CardTitle className="text-2xl">Filtros condicionais</CardTitle>
                  <CardDescription>
                    Ative filtros especificos para refinar a lista sem
                    poluir a tela principal.
                  </CardDescription>
                </div>
                <Button variant="outline" className="w-fit justify-start" onClick={loadLeads}>
                  <Search className="size-4" />
                  Aplicar filtros
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {conditionalFilters.map((filter) => {
                  const isActive = activeFilters[filter.id]

                  return (
                    <Label
                      key={filter.id}
                      className="flex h-10 items-center gap-2 rounded-md border border-input bg-card px-3 text-sm cursor-pointer"
                    >
                      <Checkbox
                        checked={isActive}
                        onCheckedChange={(checked) =>
                          toggleFilter(filter.id, checked)
                        }
                      />
                      {filter.label}
                      {filter.inputLabel && isActive ? (
                        <Input
                          placeholder={filter.defaultInputValue}
                          value={filterValues[filter.id] || ""}
                          onChange={(e) => updateFilterValue(filter.id, e.target.value)}
                          aria-label={filter.inputLabel}
                          className="h-7 w-28 border-0 bg-muted px-2"
                        />
                      ) : null}
                    </Label>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp offset={-24} delay={0.52} amount={0.12}>
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <CardTitle className="text-2xl">Tabela de leads</CardTitle>
                  <CardDescription>
                    Visualizando amostra dos dados na `vw_dashboard_leads`.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="w-fit rounded-md">
                  Exibindo {leads.length} registros
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Contato</TableHead>
                    <TableHead className="min-w-[120px]">Lead ID</TableHead>
                    <TableHead>Pais</TableHead>
                    <TableHead className="min-w-[150px]">Mercado</TableHead>
                    <TableHead className="min-w-[180px]">Funil</TableHead>
                    <TableHead className="min-w-[160px]">Ultimo evento</TableHead>
                    <TableHead className="min-w-[160px] text-right">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => {
                    const statuses = ["Captura"]
                    if (lead.has_checkout) statuses.push("IC")
                    if (lead.has_purchase) statuses.push("VENDA")

                    return (
                      <TableRow key={lead.lead_id}>
                        <TableCell className="font-medium">
                          <div className="flex min-w-0 flex-col">
                            <Link
                              href={`/dashboard/leads/${lead.lead_id}`}
                              className="truncate transition-colors hover:text-primary"
                            >
                              {lead.contact || "Anônimo"}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                              {new Date(lead.first_event_at).toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/leads/${lead.lead_id}`}>
                              <code className="text-xs text-muted-foreground transition-colors hover:text-primary" title={lead.lead_id}>
                                {lead.lead_id.substring(0, 10)}...
                              </code>
                            </Link>
                            <Button
                              size="icon"
                              variant="ghost"
                              aria-label={`Copiar ${lead.lead_id}`}
                              className="size-8"
                              onClick={() => navigator.clipboard.writeText(lead.lead_id)}
                            >
                              <ClipboardCopy className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{lead.country || "--"}</TableCell>
                        <TableCell>{lead.market || "--"}</TableCell>
                        <TableCell>
                          <code className="text-xs text-muted-foreground">
                            {lead.funnel_id}
                          </code>
                        </TableCell>
                        <TableCell>{new Date(lead.last_event_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2 flex-wrap">
                            {statuses.map((status) => (
                              <Badge
                                key={`${lead.lead_id}-${status}`}
                                variant={status === "VENDA" ? "secondary" : status === "IC" ? "accent" : "outline"}
                                className="rounded-md"
                              >
                                {status}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {leads.length === 0 && !isLoading && (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  Nenhum lead encontrado para os filtros ativos.
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Exibindo até 100 resultados recentes.
                </p>
                <Pagination className="mx-0 w-fit justify-start">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </section>
    </div>
  )
}
