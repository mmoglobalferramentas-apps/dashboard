"use client"

import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState, useMemo } from "react"
import {
  ArrowLeft,
  ClipboardCopy,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/components/ui/utils"
import { fetchDashboardApi } from "@/lib/api-client"

interface LeadDetailRow {
  lead_id: string
  funnel_id: string
  contact: string | null
  country: string | null
  market: string | null
  first_seen_at: string
  last_seen_at: string | null
  has_ic: boolean
  has_purchase: boolean
  attributes: Record<string, unknown> | null
}

interface LeadEventRow {
  event_id: string
  event_type: string
  event_timestamp: string
  step_name: string | null
  page_title: string | null
}
function getStatusVariant(status: string) {
  if (status === "Compra realizada") {
    return "secondary" as const
  }

  if (status === "IC realizado" || status === "Checkout") {
    return "accent" as const
  }

  return "outline" as const
}

function LeadDetailContent() {
  const searchParams = useSearchParams()
  const leadId = searchParams.get("id") as string
  
  const [data, setData] = useState<{ lead: LeadDetailRow, events: LeadEventRow[] } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!leadId) {
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    fetchDashboardApi<{ lead: LeadDetailRow, events: LeadEventRow[] }>(`/leads/${leadId}`)
      .then(res => setData(res))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [leadId])

  const lead = useMemo(() => {
    if (!data?.lead) return null;
    const { lead, events } = data;

    const statuses = ["Captura"]
    if (lead.has_ic) statuses.push("IC realizado")
    if (lead.has_purchase) statuses.push("Compra realizada")
    else if (lead.has_ic) statuses.push("Sem compra")

    return {
      contact: lead.contact || "Anônimo",
      initials: (lead.contact || "AN").substring(0, 2).toUpperCase(),
      funnel: lead.funnel_id,
      source: (lead.attributes?.utm_source as string) || "Orgânico",
      campaign: (lead.attributes?.utm_campaign as string) || "--",
      country: lead.country || "--",
      market: lead.market || "--",
      firstSeen: new Date(lead.first_seen_at).toLocaleString(),
      lastSeen: new Date(lead.last_seen_at || lead.first_seen_at).toLocaleString(),
      statuses,
      events: (events || []).map(e => ({
        label: e.step_name || e.page_title || e.event_type,
        type: e.event_type,
        time: new Date(e.event_timestamp).toLocaleTimeString()
      }))
    }
  }, [data])

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
        <p className="text-muted-foreground animate-pulse">Carregando detalhes do lead...</p>
      </main>
    )
  }

  if (!lead) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
        <FadeUp offset={-24} delay={0.04} className="w-full max-w-xl">
          <Card className="w-full">
            <CardHeader>
              <Badge variant="outline" className="mb-2 w-fit rounded-md">
                Lead Detail
              </Badge>
              <CardTitle className="text-3xl">Lead nao encontrado</CardTitle>
              <CardDescription>
                {error ? error : "O lead solicitado nao foi encontrado na base."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/dashboard/leads">
                  <ArrowLeft className="size-4" />
                  Voltar para Leads
                </Link>
              </Button>
            </CardContent>
          </Card>
        </FadeUp>
      </main>
    )
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background text-foreground [letter-spacing:0]">
        <section className="min-w-0">


            <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <FadeUp
                  offset={-24}
                  delay={0.04}
                  className="flex min-w-0 flex-col gap-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="accent" className="w-fit rounded-md uppercase">
                      Lead Detail
                    </Badge>
                    <Badge variant="outline" className="w-fit rounded-md">
                      Dados em tempo real
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                    Detalhes do lead
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                    Identidade, contexto de aquisicao e cronologia dos eventos
                    registrados no funil.
                  </p>
                </FadeUp>

                <FadeUp offset={-24} delay={0.12} className="w-fit">
                  <Button asChild variant="outline" className="w-fit">
                    <Link href="/dashboard/leads">
                      <ArrowLeft className="size-4" />
                      Voltar para Leads
                    </Link>
                  </Button>
                </FadeUp>
              </div>

              <FadeUp offset={-24} delay={0.2} amount={0.12}>
                <Card className="overflow-hidden p-0">
                  <div className="grid min-h-[620px] xl:grid-cols-[380px_minmax(0,1fr)]">
                    <div className="border-b border-border p-5 sm:p-6 xl:border-b-0 xl:border-r">
                      <div className="mb-6 flex min-w-0 items-center gap-3">
                        <Avatar className="size-14">
                          <AvatarFallback>{lead.initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold">{lead.contact}</p>
                          <code className="text-sm text-muted-foreground">{leadId}</code>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              aria-label={`Copiar ${leadId}`}
                              onClick={() => navigator.clipboard.writeText(leadId)}
                            >
                              <ClipboardCopy className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copiar lead ID</TooltipContent>
                        </Tooltip>
                      </div>

                      <div className="grid gap-4 text-sm">
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">Funil</p>
                          <p className="break-all font-semibold">{lead.funnel}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase text-muted-foreground">Origem</p>
                          <p className="font-semibold">
                            {lead.source} / {lead.campaign}
                          </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                          <div>
                            <p className="text-xs uppercase text-muted-foreground">Pais</p>
                            <p className="font-semibold">{lead.country}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase text-muted-foreground">
                              Mercado
                            </p>
                            <p className="font-semibold">{lead.market}</p>
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                          <div>
                            <p className="text-xs uppercase text-muted-foreground">
                              Primeiro evento
                            </p>
                            <p className="font-semibold">{lead.firstSeen}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase text-muted-foreground">
                              Ultimo evento
                            </p>
                            <p className="font-semibold">{lead.lastSeen}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {lead.statuses.map((status) => (
                            <Badge
                              key={status}
                              variant={getStatusVariant(status)}
                              className="rounded-md"
                            >
                              {status}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="relative mt-8 h-44 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src="/images/dashboard/lead-detail-img.png"
                          alt="Assinatura visual do perfil do lead"
                          fill
                          priority
                          className="pointer-events-none object-cover"
                          sizes="(min-width: 1280px) 380px, 100vw"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-secondary/45" />
                        <div className="absolute inset-x-4 bottom-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-white">
                            Perfil do lead
                          </p>
                          <p className="mt-1 text-sm text-white/75">
                            Jornada individual dentro do funil.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 lg:p-8">
                      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-bold">Timeline de eventos</h2>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Eventos exibidos em ordem cronologica para leitura da
                            jornada.
                          </p>
                        </div>
                        <Badge variant="outline" className="w-fit rounded-md">
                          {lead.events.length} eventos
                        </Badge>
                      </div>

                      <div className="flex flex-col">
                        {lead.events.map((event, index) => {
                          const isLatest = index === lead.events.length - 1

                          return (
                            <div
                              key={`${event.type}-${event.time}`}
                              className="grid grid-cols-[24px_minmax(0,1fr)] gap-3"
                            >
                              <div className="flex flex-col items-center">
                                <span
                                  className={cn(
                                    "mt-1 size-3 shrink-0 rounded-full bg-foreground",
                                    isLatest && "bg-primary ring-4 ring-primary/20"
                                  )}
                                />
                                {!isLatest ? (
                                  <span className="min-h-14 w-px flex-1 bg-border" />
                                ) : null}
                              </div>
                              <div className={cn("pb-7", isLatest && "pb-0")}>
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                  <p className="font-semibold">{event.label}</p>
                                  <span className="text-xs text-muted-foreground">
                                    {event.time}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {event.type}
                                </p>
                                {isLatest ? (
                                  <Badge variant="accent" className="mt-3 rounded-md">
                                    Evento mais recente
                                  </Badge>
                                ) : null}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              </FadeUp>
            </div>
        </section>
      </main>
    </TooltipProvider>
  )
}

export default function LeadDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Carregando...</div>}>
      <LeadDetailContent />
    </Suspense>
  )
}
