import Image from "next/image"
import {
  CalendarDays,
  ChevronRight,
  Gauge,
} from "lucide-react"

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

export const metadata = {
  title: "Funnel Overview — XBOARD",
  description: "Visao inicial do funil no dashboard XBOARD.",
}

const kpis = [
  { label: "Visitantes", hint: "Entrada total" },
  { label: "ICs", hint: "Cliques no checkout" },
  { label: "Vendas", hint: "Compras confirmadas" },
  { label: "Conv. checkout", hint: "ICs convertidos" },
]

const funnelSteps = [
  { label: "Pagina de Captura", badge: null },
  { label: "Quiz / Presell", badge: null },
  { label: "Pagina de Vendas", badge: null },
  { label: "Clique no IC", badge: "IC" },
  { label: "Venda confirmada", badge: "VENDA" },
]

export default function DashboardPage() {
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
        </FadeUp>

        <FadeUp offset={-24} delay={0.12}>
          <Card className="py-4">
            <CardContent className="grid gap-3 px-4 sm:grid-cols-[minmax(0,1fr)_150px_190px]">
              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground">
                  Funil
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar funil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empty">
                      Nenhum funil disponivel
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs uppercase text-muted-foreground">
                  Pais
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pais" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empty">Sem pais</SelectItem>
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
                  <CardTitle className="text-4xl font-bold leading-none">
                    --
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
                  <CardTitle className="text-2xl">
                    Fluxo do funil
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
              {funnelSteps.map((step, index) => (
                <div key={step.label} className="grid gap-2">
                  <div className="grid grid-cols-[32px_minmax(0,1fr)_auto_auto] items-center gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 truncate font-semibold">
                      {step.label}
                    </span>
                    {step.badge ? (
                      <Badge
                        variant={
                          step.badge === "VENDA" ? "secondary" : "accent"
                        }
                        className="rounded-md"
                      >
                        {step.badge}
                      </Badge>
                    ) : (
                      <span />
                    )}
                    <span className="font-semibold text-muted-foreground">
                      --
                    </span>
                  </div>
                  <Progress value={0} className="h-2 bg-muted" />
                  <p className="pl-11 text-xs text-muted-foreground">
                    Sem registros no periodo selecionado.
                  </p>
                </div>
              ))}

              <Alert className="mt-auto border-primary/50 bg-accent text-accent-foreground">
                <Gauge className="size-4" />
                <AlertTitle>Saude do funil</AlertTitle>
                <AlertDescription>
                  Selecione um funil para revisar gargalos e pontos de
                  atencao.
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
                <span className="font-semibold">--</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <span className="text-muted-foreground">Pais</span>
                <span className="font-semibold">--</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <span className="text-muted-foreground">Periodo</span>
                <span className="font-semibold">--</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="outline" className="rounded-md">
                  Captura
                </Badge>
                <Badge variant="outline" className="rounded-md">
                  Presell
                </Badge>
                <Badge variant="outline" className="rounded-md">
                  Checkout
                </Badge>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </section>
    </div>
  )
}
