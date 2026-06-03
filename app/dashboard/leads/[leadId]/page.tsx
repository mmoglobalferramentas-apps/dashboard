"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
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

const mockLeadDetails = {
  ld_00291: {
    contact: "brunog@email.com",
    initials: "BG",
    funnel: "funnel_brasil_v2",
    source: "facebook",
    campaign: "camp_maio_retarg",
    country: "BR",
    market: "Direct Response",
    firstSeen: "31/05/2026 13:48",
    lastSeen: "31/05/2026 14:22",
    statuses: ["IC realizado", "Compra realizada"],
    events: [
      { label: "Pagina de Captura", type: "page_view", time: "13:48:02" },
      { label: "Formulario enviado", type: "lead_capture", time: "13:49:16" },
      { label: "Quiz / Presell", type: "page_view", time: "13:52:44" },
      { label: "Pagina de Vendas", type: "page_view", time: "14:04:10" },
      { label: "Clique no IC", type: "checkout_click", time: "14:18:37" },
      { label: "Venda confirmada", type: "purchase", time: "14:22:08" },
    ],
  },
  ld_00290: {
    contact: "ana.lima@outlook.com",
    initials: "AL",
    funnel: "funnel_brasil_v2",
    source: "instagram",
    campaign: "camp_maio_prospeccao",
    country: "BR",
    market: "Direct Response",
    firstSeen: "31/05/2026 13:21",
    lastSeen: "31/05/2026 13:55",
    statuses: ["IC realizado", "Sem compra"],
    events: [
      { label: "Pagina de Captura", type: "page_view", time: "13:21:04" },
      { label: "Formulario enviado", type: "lead_capture", time: "13:22:31" },
      { label: "Quiz / Presell", type: "page_view", time: "13:27:18" },
      { label: "Pagina de Vendas", type: "page_view", time: "13:42:55" },
      { label: "Clique no IC", type: "checkout_click", time: "13:55:12" },
    ],
  },
  ld_00284: {
    contact: "mariana.v@gmail.com",
    initials: "MV",
    funnel: "funnel_brasil_v2",
    source: "facebook",
    campaign: "camp_maio_retarg",
    country: "BR",
    market: "Direct Response",
    firstSeen: "31/05/2026 09:31",
    lastSeen: "31/05/2026 09:44",
    statuses: ["IC realizado", "Sem compra"],
    events: [
      { label: "Pagina de Captura", type: "page_view", time: "09:31:12" },
      { label: "Formulario enviado", type: "lead_capture", time: "09:32:40" },
      { label: "Quiz / Presell", type: "page_view", time: "09:36:09" },
      { label: "Pagina de Vendas", type: "page_view", time: "09:41:28" },
      { label: "Clique no IC", type: "checkout_click", time: "09:44:12" },
    ],
  },
  ld_00277: {
    contact: "rafael.costa@gmail.com",
    initials: "RC",
    funnel: "funnel_mexico_v1",
    source: "google",
    campaign: "camp_mx_search",
    country: "MX",
    market: "Direct Response",
    firstSeen: "30/05/2026 18:12",
    lastSeen: "30/05/2026 18:12",
    statuses: ["Captura", "Sem IC"],
    events: [
      { label: "Pagina de Captura", type: "page_view", time: "18:12:03" },
      { label: "Formulario enviado", type: "lead_capture", time: "18:12:49" },
    ],
  },
  ld_00263: {
    contact: "lucas.moreira@proton.me",
    initials: "LM",
    funnel: "funnel_health_br_v1",
    source: "facebook",
    campaign: "camp_health_maio",
    country: "BR",
    market: "Health",
    firstSeen: "30/05/2026 09:42",
    lastSeen: "30/05/2026 10:08",
    statuses: ["Checkout", "Sem compra"],
    events: [
      { label: "Pagina de Captura", type: "page_view", time: "09:42:15" },
      { label: "Formulario enviado", type: "lead_capture", time: "09:43:08" },
      { label: "Quiz / Presell", type: "page_view", time: "09:51:22" },
      { label: "Pagina de Vendas", type: "page_view", time: "10:02:47" },
      { label: "Checkout iniciado", type: "checkout_start", time: "10:08:33" },
    ],
  },
} as const

function getStatusVariant(status: string) {
  if (status === "Compra realizada") {
    return "secondary" as const
  }

  if (status === "IC realizado" || status === "Checkout") {
    return "accent" as const
  }

  return "outline" as const
}

export default function LeadDetailPage() {
  const params = useParams<{ leadId: string }>()
  const leadId = params.leadId
  const lead = mockLeadDetails[leadId as keyof typeof mockLeadDetails]

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
                Nao existe um mock de detalhe para o identificador solicitado.
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
            <header className="border-b border-border bg-card/70 px-5 py-4 backdrop-blur sm:px-8 lg:hidden">
              <div className="flex items-center justify-between gap-4">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-md bg-primary">
                    <Image
                      src="/images/logos/iconBlack.svg"
                      alt=""
                      width={24}
                      height={24}
                      className="size-6 object-contain"
                    />
                  </span>
                  <span className="font-semibold">XBOARD</span>
                </Link>
                <Badge variant="outline" className="rounded-md">
                  Lead Detail
                </Badge>
              </div>
            </header>

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
                      Mock visual temporario
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
