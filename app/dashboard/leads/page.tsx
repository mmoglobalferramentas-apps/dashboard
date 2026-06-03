"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ClipboardCopy,
  Search,
} from "lucide-react"

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

const mockLeads = [
  {
    contact: "brunog@email.com",
    leadId: "ld_00291",
    country: "BR",
    market: "Direct Response",
    funnel: "funnel_brasil_v2",
    lastEvent: "31/05/2026 14:22",
    statuses: ["IC", "VENDA"],
  },
  {
    contact: "ana.lima@outlook.com",
    leadId: "ld_00290",
    country: "BR",
    market: "Direct Response",
    funnel: "funnel_brasil_v2",
    lastEvent: "31/05/2026 13:55",
    statuses: ["IC"],
  },
  {
    contact: "mariana.v@gmail.com",
    leadId: "ld_00284",
    country: "BR",
    market: "Direct Response",
    funnel: "funnel_brasil_v2",
    lastEvent: "31/05/2026 09:44",
    statuses: ["IC"],
  },
  {
    contact: "rafael.costa@gmail.com",
    leadId: "ld_00277",
    country: "MX",
    market: "Direct Response",
    funnel: "funnel_mexico_v1",
    lastEvent: "30/05/2026 18:12",
    statuses: ["Captura"],
  },
  {
    contact: "lucas.moreira@proton.me",
    leadId: "ld_00263",
    country: "BR",
    market: "Health",
    funnel: "funnel_health_br_v1",
    lastEvent: "30/05/2026 10:08",
    statuses: ["Checkout"],
  },
]

type ConditionalFilter = "leadId" | "contact" | "ic" | "purchase"

const conditionalFilters: Array<{
  id: ConditionalFilter
  label: string
  inputLabel?: string
  inputValue?: string
}> = [
  { id: "leadId", label: "Lead ID", inputLabel: "Filtro por lead ID", inputValue: "ld_002" },
  { id: "contact", label: "Contato", inputLabel: "Filtro por contato", inputValue: "gmail" },
  { id: "ic", label: "IC realizado" },
  { id: "purchase", label: "Compra realizada" },
]

function getStatusVariant(status: string) {
  if (status === "VENDA") {
    return "secondary" as const
  }

  if (status === "IC") {
    return "accent" as const
  }

  return "outline" as const
}

export default function LeadsPage() {
  const [activeFilters, setActiveFilters] = useState<Record<ConditionalFilter, boolean>>({
    leadId: false,
    contact: true,
    ic: true,
    purchase: false,
  })

  function toggleFilter(filter: ConditionalFilter, checked: boolean | "indeterminate") {
    setActiveFilters((current) => ({
      ...current,
      [filter]: checked === true,
    }))
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
              Mock visual temporario
            </Badge>
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Leads
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Lista operacional de leads, eventos-chave e filtros para
            investigacao rapida do funil.
          </p>
        </FadeUp>

        <FadeUp offset={-24} delay={0.12}>
          <Card className="py-4">
            <CardContent className="grid gap-3 px-4 sm:grid-cols-[minmax(0,1fr)_150px_190px]">
              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground">
                  Funil
                </Label>
                <Select defaultValue="funnel_brasil_v2">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar funil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funnel_brasil_v2">
                      funnel_brasil_v2
                    </SelectItem>
                    <SelectItem value="funnel_mexico_v1">
                      funnel_mexico_v1
                    </SelectItem>
                    <SelectItem value="funnel_health_br_v1">
                      funnel_health_br_v1
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground">
                  Pais
                </Label>
                <Select defaultValue="br">
                  <SelectTrigger>
                    <SelectValue placeholder="Pais" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="br">Brasil</SelectItem>
                    <SelectItem value="mx">Mexico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground">
                  Periodo
                </Label>
                <DateSelector className="w-full" />
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Leads filtrados", value: "4.821", hint: "Periodo atual" },
          { label: "IC realizado", value: "312", hint: "6,5% dos leads" },
          { label: "Compra realizada", value: "87", hint: "27,8% dos ICs" },
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
                <Button variant="outline" className="w-fit justify-start">
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
                          defaultValue={filter.inputValue}
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
                    Dados mockados por enquanto; a integracao final deve
                    ler `vw_dashboard_leads`.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="w-fit rounded-md">
                  Exibindo 1-5 de 4.821
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
                  {mockLeads.map((lead) => (
                    <TableRow key={lead.leadId}>
                      <TableCell className="font-medium">
                        <div className="flex min-w-0 flex-col">
                          <Link
                            href={`/dashboard/leads/${lead.leadId}`}
                            className="truncate transition-colors hover:text-primary"
                          >
                            {lead.contact}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            primeiro contato no periodo
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/leads/${lead.leadId}`}>
                            <code className="text-xs text-muted-foreground transition-colors hover:text-primary">
                              {lead.leadId}
                            </code>
                          </Link>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Copiar ${lead.leadId}`}
                            className="size-8"
                          >
                            <ClipboardCopy className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{lead.country}</TableCell>
                      <TableCell>{lead.market}</TableCell>
                      <TableCell>
                        <code className="text-xs text-muted-foreground">
                          {lead.funnel}
                        </code>
                      </TableCell>
                      <TableCell>{lead.lastEvent}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {lead.statuses.map((status) => (
                            <Badge
                              key={`${lead.leadId}-${status}`}
                              variant={getStatusVariant(status)}
                              className="rounded-md"
                            >
                              {status}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Pagina 1 com dados temporarios para validacao visual.
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
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
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
