"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  ClipboardCopy,
  Filter,
  Gauge,
  HeartPulse,
  LayoutDashboard,
  Layers3,
  LockKeyhole,
  Palette,
  ScanLine,
  Sparkles,
  Table2,
  UserRound,
} from "lucide-react"


import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/components/ui/utils"

const tokenColors = [
  {
    name: "Background",
    token: "--background",
    className: "bg-background",
    textClassName: "text-foreground",
    usage: "LP base surface",
  },
  {
    name: "Foreground",
    token: "--foreground",
    className: "bg-foreground",
    textClassName: "text-background",
    usage: "Primary copy",
  },
  {
    name: "Primary",
    token: "--primary",
    className: "bg-primary",
    textClassName: "text-primary-foreground",
    usage: "Hero CTA and conversion actions",
  },
  {
    name: "Secondary",
    token: "--secondary",
    className: "bg-secondary",
    textClassName: "text-secondary-foreground",
    usage: "Dark footer and secondary surfaces",
  },
  {
    name: "Muted",
    token: "--muted",
    className: "bg-muted",
    textClassName: "text-foreground",
    usage: "Section contrast and product cards",
  },
  {
    name: "Accent",
    token: "--accent",
    className: "bg-accent",
    textClassName: "text-accent-foreground",
    usage: "Badges and soft emphasis",
  },
]

const lpMapping = [
  {
    section: "Navbar",
    wireframeIntent: "Logo, anchor links, login link, primary app access CTA",
    localComponent: "components/layout/navbar.tsx",
    shadcnBase: "Button",
    status: "Ready",
  },
  {
    section: "Hero",
    wireframeIntent: "Social proof pill, H1, supporting copy, primary CTA",
    localComponent: "components/sections/hero.tsx",
    shadcnBase: "Button, Avatar",
    status: "Ready",
  },
  {
    section: "Testimonials",
    wireframeIntent: "Section label, headline, three proof cards",
    localComponent: "components/sections/testimonials.tsx",
    shadcnBase: "Card, Badge, Avatar",
    status: "Ready",
  },
  {
    section: "Features",
    wireframeIntent: "Product explanation with image-led content blocks",
    localComponent: "components/sections/features.tsx",
    shadcnBase: "Badge, Card pattern",
    status: "Needs final product imagery",
  },
  {
    section: "Founder",
    wireframeIntent: "Founder image, story, credibility copy, secondary CTA",
    localComponent: "components/sections/founder.tsx",
    shadcnBase: "Button, Badge, Card pattern",
    status: "Needs final portrait treatment",
  },
  {
    section: "FAQ",
    wireframeIntent: "Open first question, closed remaining questions",
    localComponent: "components/sections/faq.tsx",
    shadcnBase: "Accordion, Badge",
    status: "Ready",
  },
  {
    section: "Footer",
    wireframeIntent: "Brand summary, product links, company links, legal row",
    localComponent: "components/layout/footer.tsx",
    shadcnBase: "Layout composition",
    status: "Ready",
  },
]

const componentInventory = [
  {
    name: "Button",
    source: "@shadcn/button",
    usage: "Hero CTA, header action, founder CTA",
    variants: "default, secondary, outline, ghost, link",
  },
  {
    name: "Card",
    source: "@shadcn/card",
    usage: "Testimonials, feature blocks, founder block, catalog shells",
    variants: "Card, Header, Content, Description",
  },
  {
    name: "Badge",
    source: "@shadcn/badge",
    usage: "Section labels and proof labels",
    variants: "default, secondary, destructive, outline, accent",
  },
  {
    name: "Avatar",
    source: "@shadcn/avatar",
    usage: "Hero social proof and testimonial authors",
    variants: "image, fallback",
  },
  {
    name: "Accordion",
    source: "@shadcn/accordion",
    usage: "FAQ disclosure behavior",
    variants: "single, collapsible",
  },
]

const dashboardComponentInventory = [
  {
    name: "Logo",
    source: "public/images/logos",
    usage: "Login, sidebar brand mark, empty states",
    status: "Mapped",
  },
  {
    name: "Icon logo",
    source: "public/images/logos/iconBlack.svg + iconWhite.svg",
    usage: "Compact sidebar state and page shell",
    status: "Ready",
  },
  {
    name: "Input box",
    source: "@shadcn/input",
    usage: "Login credentials, conditional lead filters, health thresholds",
    status: "Imported",
  },
  {
    name: "Button",
    source: "@shadcn/button",
    usage: "Login submit, save changes, copy, table pagination actions",
    status: "Ready",
  },
  {
    name: "Side-bar",
    source: "Catalog composition",
    usage: "Shared dashboard shell for overview, leads, detail and health",
    status: "Cataloged",
  },
  {
    name: "Side-bar icons",
    source: "lucide-react",
    usage: "Overview, leads, health config, account and telemetry nav",
    status: "Cataloged",
  },
  {
    name: "Select box",
    source: "@shadcn/select",
    usage: "Funnel, country, market and niche filters",
    status: "Imported",
  },
  {
    name: "Progress bar",
    source: "@shadcn/progress",
    usage: "Funnel step passage and health target comparison",
    status: "Imported",
  },
  {
    name: "Badges",
    source: "@shadcn/badge",
    usage: "IC, Venda, live state, funnel health and lead status",
    status: "Ready",
  },
  {
    name: "Alert cards",
    source: "@shadcn/alert",
    usage: "Metric below target and system feedback messages",
    status: "Imported",
  },
  {
    name: "Check box",
    source: "@shadcn/checkbox",
    usage: "Optional filters and table selection",
    status: "Imported",
  },
  {
    name: "Check box com input",
    source: "@shadcn/checkbox + @shadcn/input",
    usage: "Conditional lead filters such as contato and lead_id",
    status: "Cataloged",
  },
  {
    name: "Select box com datas",
    source: "@shadcn/popover + @shadcn/calendar",
    usage: "Date range filter on Leads and Funnel Overview",
    status: "Imported",
  },
  {
    name: "Pagination",
    source: "@shadcn/pagination",
    usage: "Leads table navigation",
    status: "Imported",
  },
  {
    name: "Copy button",
    source: "@shadcn/button + lucide Copy",
    usage: "Copy lead ID, email, or copy health metrics from another niche",
    status: "Cataloged",
  },
]

const dashboardScreens = [
  {
    page: "01 Login",
    paperIntent: "Split screen with dramatic product image, secure login form and restricted access copy.",
    catalogComponents: "Logo, icon logo, Input, Label, Button, image asset",
    approvalFocus: "Premium first impression and clear access form.",
  },
  {
    page: "02 Funnel Overview",
    paperIntent: "Sidebar shell, funnel/country filters, KPI rail, funnel passage bars and a health alert.",
    catalogComponents: "Sidebar, Select, Progress, Badge, Alert, image card",
    approvalFocus: "Fast diagnosis of conversion bottlenecks.",
  },
  {
    page: "03 Leads Table",
    paperIntent: "Dense table with date, funnel and country filters plus conditional checkbox inputs.",
    catalogComponents: "Table, Checkbox, Input, Select, Date selector, Badge, Pagination",
    approvalFocus: "Operational scanning without visual noise.",
  },
  {
    page: "04 Lead Detail",
    paperIntent: "Lead identity panel, copyable fields, status badges and event timeline.",
    catalogComponents: "Sidebar, Button icon, Badge, image asset, timeline pattern",
    approvalFocus: "Lead investigation with clear event chronology.",
  },
  {
    page: "05 Health Config",
    paperIntent: "Market/country selectors, copy-from-niche action and editable benchmark rows.",
    catalogComponents: "Select, Button, Input, Table rows, image asset",
    approvalFocus: "Benchmark editing feels controlled and audit-friendly.",
  },
]

const dashboardImages = [
  {
    name: "Login",
    path: "/images/dashboard/login-img.png",
    source: "assets-raw/login-img.png",
    usage: "Page 01 image-led authentication panel",
  },
  {
    name: "Funnel Overview",
    path: "/images/dashboard/mountains-funnel-flux.png",
    source: "assets-raw/mountains-funnel-flux.png",
    usage: "Page 02 visual grounding and funnel summary card",
  },
  {
    name: "Lead Detail",
    path: "/images/dashboard/lead-detail-img.png",
    source: "assets-raw/lead-detail-img.png",
    usage: "Page 04 lead profile card",
  },
  {
    name: "Health Config",
    path: "/images/dashboard/funnel-health-img.png",
    source: "assets-raw/funnel-health-img.png",
    usage: "Page 05 benchmark context card",
  },
]

const logoIconAssets = [
  {
    name: "Icon logo black",
    path: "/images/logos/iconBlack.svg",
    source: "public/images/logos/iconBlack.svg",
    usage: "Uso sobre superficies claras ou fundos de alto contraste.",
    previewClassName: "bg-white",
  },
  {
    name: "Icon logo white",
    path: "/images/logos/iconWhite.svg",
    source: "public/images/logos/iconWhite.svg",
    usage: "Uso sobre superficies escuras, sidebar e header dark.",
    previewClassName: "bg-secondary",
  },
]

const dashboardPrimitiveInventory = [
  "Input",
  "Label",
  "Select",
  "Checkbox",
  "Progress",
  "Alert",
  "Table",
  "Pagination",
  "Tooltip",
  "Popover",
  "Calendar",
]

const funnelSteps = [
  { label: "Pagina de Captura", count: "4.821", value: 100 },
  { label: "Quiz / Presell", count: "3.760", value: 78 },
  { label: "Pagina de Vendas", count: "1.579", value: 33 },
  { label: "Clique no IC", count: "312", value: 6.5, badge: "IC" },
  { label: "Venda confirmada", count: "87", value: 1.8, badge: "VENDA" },
]

const leadsRows = [
  {
    contact: "brunog@email.com",
    leadId: "ld_00291",
    country: "BR",
    funnel: "funnel_brasil_v2",
    date: "31/05/2026 14:22",
    events: ["IC", "VENDA"],
  },
  {
    contact: "ana.lima@outlook.com",
    leadId: "ld_00290",
    country: "BR",
    funnel: "funnel_brasil_v2",
    date: "31/05/2026 13:55",
    events: ["IC"],
  },
  {
    contact: "mariana.v@gmail.com",
    leadId: "ld_00284",
    country: "BR",
    funnel: "funnel_brasil_v2",
    date: "31/05/2026 09:44",
    events: ["IC"],
  },
]

const healthRows = [
  { metric: "CTR para Checkout (IC)", description: "Visitantes que clicam no botao de IC / checkout.", value: "8", unit: "%" },
  { metric: "Conversao do Checkout", description: "ICs que resultam em venda confirmada.", value: "25", unit: "%" },
  { metric: "Passagem Captura -> Quiz", description: "Leads que avancam da captura para o quiz/presell.", value: "70", unit: "%" },
]

const typographyScale = [
  { label: "Display", className: "font-display text-5xl font-bold", sample: "Funil com clareza total" },
  { label: "Section H2", className: "font-display text-4xl font-bold", sample: "Pontos de alavancagem" },
  { label: "Card H3", className: "font-display text-2xl font-semibold", sample: "Eventos do lead" },
  { label: "Body", className: "text-base text-muted-foreground", sample: "Dados ao vivo para decisões de otimização." },
  { label: "Caption", className: "text-sm text-muted-foreground", sample: "Teste gratuito, sem cartão de crédito." },
]

const testimonials = [
  {
    quote: "Não tenho mais dores de cabeça na hora de interpretar os dados.",
    name: "Carla Mendes",
    role: "Copywriter, Operação DR",
    avatar: "/images/testimonials/avatar-1.png",
    initials: "CM",
  },
  {
    quote: "Minha operação começou a faturar 2X mais com o aumento de clareza.",
    name: "André Lima",
    role: "CEO, Operação DR",
    avatar: "/images/testimonials/avatar-3.png",
    initials: "AL",
  },
]

function CatalogSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-6xl scroll-mt-24 flex-col gap-8 px-5 py-16 sm:px-8"
    >
      <FadeUp className="flex max-w-3xl flex-col gap-3">
        <Badge variant="accent" className="w-fit uppercase">
          {eyebrow}
        </Badge>
        <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </FadeUp>
      {children}
    </section>
  )
}

function Swatch({
  className,
  textClassName,
  name,
  token,
  usage,
}: (typeof tokenColors)[number]) {
  return (
    <Card className="overflow-hidden p-0">
      <div className={cn("flex h-32 items-end p-5", className, textClassName)}>
        <span className="text-sm font-semibold">{name}</span>
      </div>
      <CardContent className="flex flex-col gap-2 p-5">
        <code className="text-sm font-medium text-foreground">{token}</code>
        <p className="text-sm leading-6 text-muted-foreground">{usage}</p>
      </CardContent>
    </Card>
  )
}

function MappingRow({
  section,
  wireframeIntent,
  localComponent,
  shadcnBase,
  status,
  isLast = false,
}: (typeof lpMapping)[number] & { isLast?: boolean }) {
  return (
    <div
      className={cn(
        "grid min-w-0 gap-4 px-8 py-5 md:grid-cols-[minmax(140px,0.8fr)_minmax(0,1.25fr)_minmax(0,1.15fr)_auto] md:items-center",
        !isLast && "border-b border-border"
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Layers3 className="size-4" />
        </span>
        <span className="min-w-0 break-words font-semibold text-foreground">
          {section}
        </span>
      </div>
      <p className="min-w-0 text-sm leading-6 text-muted-foreground">
        {wireframeIntent}
      </p>
      <div className="flex min-w-0 flex-col gap-1 text-sm">
        <code className="min-w-0 break-all text-foreground">
          {localComponent}
        </code>
        <span className="break-words text-muted-foreground">
          shadcn: {shadcnBase}
        </span>
      </div>
      <Badge
        variant={status === "Ready" ? "default" : "outline"}
        className="w-fit max-w-full whitespace-normal text-left leading-5 md:justify-self-end"
      >
        {status}
      </Badge>
    </div>
  )
}

function TestimonialPreview({
  quote,
  name,
  role,
  avatar,
  initials,
}: (typeof testimonials)[number]) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col justify-between gap-8">
        <p className="text-base leading-7 text-foreground/80">&ldquo;{quote}&rdquo;</p>
        <div className="flex items-center gap-3">
          <Avatar className="size-11">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AssetPreviewCard({
  name,
  path,
  source,
  usage,
}: (typeof dashboardImages)[number]) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative h-52 bg-muted">
        <Image
          src={path}
          alt={`${name} dashboard asset`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 280px, 100vw"
        />
      </div>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{source}</p>
          </div>
          <Badge variant="accent">Public</Badge>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{usage}</p>
        <code className="break-all rounded-md bg-muted px-3 py-2 text-xs text-foreground">
          {path}
        </code>
      </CardContent>
    </Card>
  )
}

function LogoIconPreviewCard({
  name,
  path,
  source,
  usage,
  previewClassName,
}: (typeof logoIconAssets)[number]) {
  return (
    <Card className="overflow-hidden p-0">
      <div className={cn("flex h-64 items-center justify-center", previewClassName)}>
        <div className="relative size-32">
          <Image
            src={path}
            alt={name}
            fill
            className="object-contain"
            sizes="128px"
          />
        </div>
      </div>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{source}</p>
          </div>
          <Badge variant="accent">SVG</Badge>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{usage}</p>
        <code className="break-all rounded-md bg-muted px-3 py-2 text-xs text-foreground">
          {path}
        </code>
      </CardContent>
    </Card>
  )
}

function DashboardSidebarPreview() {
  const items = [
    { label: "Overview", icon: LayoutDashboard, active: true },
    { label: "Leads", icon: Table2 },
    { label: "Health", icon: HeartPulse },
    { label: "Account", icon: UserRound },
  ]

  return (
    <aside className="flex h-full min-h-[520px] w-20 shrink-0 flex-col items-center justify-between bg-sidebar px-3 py-4 text-sidebar-foreground">
      <div className="flex flex-col items-center gap-8">
        <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Gauge className="size-5" />
        </span>
        <nav className="flex flex-col gap-3" aria-label="Preview navigation">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant={item.active ? "default" : "ghost"}
                    aria-label={item.label}
                    className={cn(
                      "size-11",
                      !item.active && "text-sidebar-foreground/65 hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </div>
      <Button
        size="icon"
        variant="ghost"
        aria-label="Secure workspace"
        className="text-sidebar-foreground/65"
      >
        <LockKeyhole className="size-5" />
      </Button>
    </aside>
  )
}

function ConditionalFilterPreview() {
  return (
    <div className="flex flex-wrap gap-3">
      <Label className="flex h-10 items-center gap-2 rounded-md border border-input bg-card px-3 text-sm">
        <Checkbox />
        Lead ID
      </Label>
      <Label className="flex h-10 items-center gap-2 rounded-md border border-input bg-card px-3 text-sm">
        <Checkbox defaultChecked />
        Contato
        <Input
          value="brunog"
          readOnly
          aria-label="Filtro por contato"
          className="h-7 w-28 border-0 bg-muted px-2"
        />
      </Label>
      <Label className="flex h-10 items-center gap-2 rounded-md border border-input bg-card px-3 text-sm">
        <Checkbox />
        IC realizado
      </Label>
      <Label className="flex h-10 items-center gap-2 rounded-md border border-input bg-card px-3 text-sm">
        <Checkbox />
        Compra realizada
      </Label>
    </div>
  )
}



function FunnelPreview() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Fluxo do funil</CardTitle>
        <CardDescription>Padrao visual para Page 02, sem implementar a tela.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {funnelSteps.map((step, index) => (
          <div key={step.label} className="grid gap-2">
            <div className="grid grid-cols-[32px_1fr_auto_auto] items-center gap-3 text-sm">
              <span className="text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-semibold">{step.label}</span>
              {step.badge ? (
                <Badge
                  variant={step.badge === "VENDA" ? "secondary" : "accent"}
                  className="rounded-md"
                >
                  {step.badge}
                </Badge>
              ) : (
                <span />
              )}
              <span className="font-semibold">{step.count}</span>
            </div>
            <Progress value={Math.max(step.value, 4)} className="h-2 bg-muted" />
            <p className="pl-11 text-xs text-muted-foreground">
              {step.value}% de passagem registrada
            </p>
          </div>
        ))}
        <Alert className="border-primary/60 bg-accent">
          <Gauge className="size-4" />
          <AlertTitle>CTR para Checkout abaixo da meta</AlertTitle>
          <AlertDescription>
            6,5% atual vs. 8% esperado. Sugerir revisao do bloco de oferta.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

function LeadsTablePreview() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Leads Table</CardTitle>
        <CardDescription>Filtros condicionais, badges de evento e paginacao.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <DateSelector />
          <Select defaultValue="funnel_brasil_v2">
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Funil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="funnel_brasil_v2">funnel_brasil_v2</SelectItem>
              <SelectItem value="funnel_mexico_v1">funnel_mexico_v1</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="br">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Pais" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="br">Brasil</SelectItem>
              <SelectItem value="mx">Mexico</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ConditionalFilterPreview />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contato</TableHead>
              <TableHead>Lead ID</TableHead>
              <TableHead>Pais</TableHead>
              <TableHead>Funil</TableHead>
              <TableHead>Data entrada</TableHead>
              <TableHead className="text-right">Eventos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leadsRows.map((lead) => (
              <TableRow key={lead.leadId}>
                <TableCell className="font-medium">{lead.contact}</TableCell>
                <TableCell>{lead.leadId}</TableCell>
                <TableCell>{lead.country}</TableCell>
                <TableCell>{lead.funnel}</TableCell>
                <TableCell>{lead.date}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {lead.events.map((event) => (
                      <Badge
                        key={event}
                        variant={event === "VENDA" ? "secondary" : "accent"}
                        className="rounded-md"
                      >
                        {event}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">Exibindo 1-3 de 4.821</p>
          <Pagination className="mx-0 w-fit">
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
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}

function LeadDetailPreview() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="grid min-h-[520px] lg:grid-cols-[320px_1fr]">
        <div className="border-b border-border p-6 lg:border-b-0 lg:border-r">
          <div className="mb-6 flex items-center gap-3">
            <Avatar className="size-14">
              <AvatarFallback>MV</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold">mariana.v@gmail.com</p>
              <p className="text-sm text-muted-foreground">ld_00284</p>
            </div>
            <Button size="icon" variant="outline" aria-label="Copiar lead ID">
              <ClipboardCopy className="size-4" />
            </Button>
          </div>
          <div className="grid gap-4 text-sm">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Funil</p>
              <p className="font-semibold">funnel_brasil_v2</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Origem</p>
              <p className="font-semibold">facebook / camp_maio_retarg</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="accent">IC realizado</Badge>
              <Badge variant="outline">Sem compra</Badge>
            </div>
          </div>
          <div className="relative mt-8 h-32 overflow-hidden rounded-lg bg-muted">
            <Image
              src="/images/dashboard/lead-detail-img.png"
              alt="Lead detail visual"
              fill
              className="object-cover"
              sizes="320px"
            />
            <div className="absolute inset-0 bg-secondary/45" />
            <p className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white">
              Perfil do lead
            </p>
          </div>
        </div>
        <div className="p-6">
          <h3 className="mb-6 text-2xl font-bold">Timeline de eventos</h3>
          <div className="flex flex-col gap-6">
            {[
              "Pagina de Captura",
              "Formulario enviado",
              "Quiz / Presell",
              "Pagina de Vendas",
              "Clique no IC",
            ].map((event, index) => (
              <div key={event} className="grid grid-cols-[24px_1fr] gap-3">
                <span
                  className={cn(
                    "mt-1 size-3 rounded-full bg-foreground",
                    index === 4 && "bg-primary ring-4 ring-primary/20"
                  )}
                />
                <div>
                  <p className="font-semibold">{event}</p>
                  <p className="text-sm text-muted-foreground">
                    page_view · 09:{44 + index}:12
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

function HealthConfigPreview() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Health Config</CardTitle>
        <CardDescription>Configuracao por nicho com metas editaveis.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="flex flex-col gap-4">
          <Select defaultValue="dr">
            <SelectTrigger>
              <SelectValue placeholder="Mercado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dr">Direct Response</SelectItem>
              <SelectItem value="health">Saude</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="br">
            <SelectTrigger>
              <SelectValue placeholder="Pais" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="br">Brasil</SelectItem>
              <SelectItem value="mx">Mexico</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="justify-start">
            <ClipboardCopy className="size-4" />
            Copiar de outro nicho
          </Button>
          <div className="relative mt-auto h-32 overflow-hidden rounded-lg bg-muted">
            <Image
              src="/images/dashboard/funnel-health-img.png"
              alt="Health config visual"
              fill
              className="object-cover"
              sizes="260px"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {healthRows.map((row) => (
            <div
              key={row.metric}
              className="grid gap-3 border-b border-border pb-4 md:grid-cols-[1fr_120px_96px] md:items-center"
            >
              <div>
                <p className="font-semibold">{row.metric}</p>
                <p className="text-sm text-muted-foreground">{row.description}</p>
              </div>
              <Input value={row.value} readOnly aria-label={`Meta ${row.metric}`} />
              <Input value={row.unit} readOnly aria-label={`Unidade ${row.metric}`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function CatalogPage() {
  return (
    <TooltipProvider>
    <main className="min-h-screen bg-background text-foreground" style={{ letterSpacing: 0 }}>
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex min-h-20 w-full max-w-6xl flex-col justify-between gap-4 px-5 py-5 sm:px-8 md:flex-row md:items-center">
          <Link href="/" className="flex items-center gap-4" aria-label="SGV XBOARD Design System">
            <span className="relative block h-10 w-40 overflow-hidden">
              <Image
                src="/images/logos/logoWhite.svg"
                alt="SGV XBOARD"
                fill
                priority
                className="scale-[3.6] object-contain"
                sizes="160px"
              />
            </span>
            <span className="text-sm font-semibold text-muted-foreground sm:text-base">
              Design System
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">Stakeholder approval</Badge>
            <Button asChild>
              <Link href="/">
                Ver landing page
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_380px] lg:items-center">
        <div className="flex flex-col gap-6">
          <FadeUp>
            <Badge variant="accent" className="w-fit uppercase">
              Catalogo oficial
            </Badge>
          </FadeUp>
          <div className="flex flex-col gap-4">
            <FadeUp delay={0.08}>
            <h1 className="max-w-4xl text-5xl font-bold leading-tight text-foreground sm:text-6xl">
              Componentes da LP mapeados para aprovacao visual.
            </h1>
            </FadeUp>
            <FadeUp delay={0.16}>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Este catalogo consolida os tokens de `app/globals.css`, os
              componentes shadcn importados e a leitura do wireframe Paper como
              mock-up de hierarquia, sem copiar seus elementos.
            </p>
            </FadeUp>
          </div>
          <FadeUp delay={0.24} className="flex flex-wrap gap-3">
            <Button size="lg">
              Aprovar direcao visual
              <CheckCircle2 className="size-4" />
            </Button>
            <Button size="lg" variant="outline">
              Solicitar ajuste
            </Button>
          </FadeUp>
        </div>

        <FadeUp delay={0.32}>
          <Card className="overflow-hidden p-0">
            <div className="relative h-72 bg-muted">
              <Image
                src="/images/backgrounds/forest-laptop.png"
                alt="Preview visual do produto XBOARD"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 380px, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-secondary/35" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-lg bg-card/90 p-4 shadow-sm backdrop-blur">
                <div>
                  <p className="text-sm font-semibold">LP source of truth</p>
                  <p className="text-xs text-muted-foreground">
                    Tokens, atoms, molecules, sections
                  </p>
                </div>
                <Sparkles className="size-5 text-primary" />
              </div>
            </div>
          </Card>
        </FadeUp>
      </section>

      <CatalogSection
        eyebrow="Tokens"
        title="Base visual documentada"
        description="A paleta, os raios, sombras e tipografia seguem os tokens CSS do projeto. A pagina apenas expõe esses valores em contexto para aprovacao."
      >
        <div id="catalog-palette" className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-foreground">Paleta</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Tokens de cor aplicados nos contextos principais da LP.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tokenColors.map((color, index) => (
              <FadeUp key={color.token} delay={index * 0.06}>
                <Swatch {...color} />
              </FadeUp>
            ))}
          </div>
        </div>

        <div
          id="catalog-typography"
          className="grid gap-5 border-t border-border/80 pt-8 lg:grid-cols-[1fr_360px]"
        >
          <FadeUp delay={0.36}>
          <Card>
            <CardHeader>
              <CardTitle>Escala tipografica</CardTitle>
              <CardDescription>
                VALKO CAPELA para headlines; Cayano para todo o restante.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {typographyScale.map((item, index) => (
                <FadeUp
                  key={item.label}
                  delay={index * 0.06}
                  className="grid gap-3 md:grid-cols-[140px_1fr] md:items-baseline"
                >
                  <Badge variant="outline" className="w-fit">
                    {item.label}
                  </Badge>
                  <p className={cn(item.className, "leading-tight")}>{item.sample}</p>
                </FadeUp>
              ))}
            </CardContent>
          </Card>
          </FadeUp>

          <FadeUp delay={0.42}>
          <Card>
            <CardHeader>
              <CardTitle>Shape e profundidade</CardTitle>
              <CardDescription>
                Os cards usam `--radius` e a familia de sombras do tema.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-sm border bg-card p-5 shadow-xs">radius-sm + shadow-xs</div>
              <div className="rounded-md border bg-card p-5 shadow-sm">radius-md + shadow-sm</div>
              <div className="rounded-lg border bg-card p-5 shadow-md">radius-lg + shadow-md</div>
            </CardContent>
          </Card>
          </FadeUp>
        </div>
      </CatalogSection>

      <CatalogSection
        id="catalog-mapping"
        eyebrow="Mapeamento"
        title="Wireframe Paper interpretado como mock-up"
        description="A estrutura aprovada para a LP foi traduzida em secoes reais do codigo. A fonte visual definitiva passa a ser este catalogo, nao os elementos do wireframe."
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {lpMapping.map((item, index) => (
              <FadeUp key={item.section} delay={index * 0.05}>
                <MappingRow {...item} isLast={index === lpMapping.length - 1} />
              </FadeUp>
            ))}
          </CardContent>
        </Card>
      </CatalogSection>

      <CatalogSection
        eyebrow="shadcn"
        title="Primitivos importados e em uso"
        description="Estes sao os blocos atomicos que sustentam os componentes da LP. O MCP shadcn confirmou as entradas de registry usadas neste catalogo."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {componentInventory.map((item, index) => (
            <FadeUp key={item.name} delay={index * 0.05}>
            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <CircleDot className="size-5" />
                </div>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.source}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p>{item.usage}</p>
                <code className="rounded-md bg-muted px-3 py-2 text-foreground">
                  {item.variants}
                </code>
              </CardContent>
            </Card>
            </FadeUp>
          ))}
        </div>
      </CatalogSection>

      <CatalogSection
        eyebrow="Atoms"
        title="Botoes, badges e avatares"
        description="Estados essenciais para conversao, navegacao e prova social."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <FadeUp>
          <Card>
            <CardHeader>
              <CardTitle>Button</CardTitle>
              <CardDescription>CTAs e acoes secundarias.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button>Acessar XBOARD</Button>
              <Button variant="secondary">Entrar</Button>
              <Button variant="outline">Ver recursos</Button>
              <Button variant="ghost">Quem faz</Button>
            </CardContent>
          </Card>
          </FadeUp>

          <FadeUp delay={0.06}>
          <Card>
            <CardHeader>
              <CardTitle>Badge</CardTitle>
              <CardDescription>Labels de secao e status.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Badge>Ready</Badge>
              <Badge variant="accent">Prova Social</Badge>
              <Badge variant="secondary">Produto</Badge>
              <Badge variant="outline">FAQ</Badge>
            </CardContent>
          </Card>
          </FadeUp>

          <FadeUp delay={0.12}>
          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
              <CardDescription>Prova social com imagem real.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {testimonials.map((item) => (
                  <Avatar key={item.name} className="size-12 border-2 border-card">
                    <AvatarImage src={item.avatar} alt={item.name} />
                    <AvatarFallback>{item.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Utilizado por <strong className="text-foreground">300+</strong>{" "}
                players do mercado
              </p>
            </CardContent>
          </Card>
          </FadeUp>
        </div>
      </CatalogSection>

      <CatalogSection
        eyebrow="Molecules"
        title="Cards, prova social e FAQ"
        description="Combinacoes aprovaveis para as secoes de depoimentos, produto e duvidas frequentes."
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
          <div className="grid gap-5 md:grid-cols-2">
            {testimonials.map((item, index) => (
              <FadeUp key={item.name} delay={index * 0.06}>
                <TestimonialPreview {...item} />
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.12}>
          <Card>
            <CardHeader>
              <CardTitle>FAQ Accordion</CardTitle>
              <CardDescription>
                Primeiro item aberto para reduzir friccao na decisao.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Preciso de cartao de credito para testar?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Nao. O teste e gratuito e nao exige cartao. O usuario conecta
                    o funil e comeca a visualizar dados imediatamente.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Funciona com quizzes e presell pages?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sim. A LP comunica suporte para funis de direct response,
                    quizzes, presells, VSLs e checkout.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          </FadeUp>
        </div>
      </CatalogSection>

      <CatalogSection
        eyebrow="Sections"
        title="Modelos de secao para a LP"
        description="Previews de alto nivel para validar hierarquia, ritmo visual e dependencia de assets antes da montagem final."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <FadeUp>
          <Card className="overflow-hidden p-0">
            <div className="relative flex min-h-80 flex-col items-center justify-center gap-6 overflow-hidden bg-background p-8 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.primary/20),transparent_55%)]" />
              <Badge variant="outline" className="relative bg-card">
                <BadgeCheck className="size-3.5" />
                Utilizado por 300+ players do mercado
              </Badge>
              <div className="relative flex max-w-xl flex-col gap-4">
                <h3 className="text-4xl font-bold leading-tight">
                  Tenha em maos os pontos de alavancagem do seu funil.
                </h3>
                <p className="text-muted-foreground">
                  Dados ao vivo, clareza total da movimentacao do lead e
                  otimizacoes em tempo recorde.
                </p>
              </div>
              <Button className="relative" size="lg">
                Acelerar minhas otimizacoes
              </Button>
            </div>
          </Card>
          </FadeUp>

          <FadeUp delay={0.06}>
          <Card className="overflow-hidden p-0">
            <div className="grid min-h-80 gap-6 bg-muted p-6 md:grid-cols-[220px_1fr] md:items-center">
              <div className="relative h-64 overflow-hidden rounded-lg bg-card">
                <Image
                  src="/images/founder/bruno.jpeg"
                  alt="Retrato do fundador"
                  fill
                  className="object-cover"
                  loading="eager"
                  sizes="220px"
                />
              </div>
              <div className="flex flex-col gap-4">
                <Badge variant="accent" className="w-fit">
                  Quem faz
                </Badge>
                <h3 className="text-3xl font-bold leading-tight">
                  Autoridade humana antes do produto.
                </h3>
                <p className="text-muted-foreground">
                  O bloco de fundador deve validar experiencia real em direct
                  response e tecnologia antes da segunda chamada para conversao.
                </p>
                <Button className="w-fit" variant="secondary">
                  Acessar XBOARD
                </Button>
              </div>
            </div>
          </Card>
          </FadeUp>

          <FadeUp delay={0.12} className="lg:col-span-2">
          <Card className="overflow-hidden p-0">
            <div className="grid gap-8 p-6 lg:grid-cols-[1fr_380px] lg:items-center">
              <div className="relative min-h-72 overflow-hidden rounded-lg bg-muted">
                <Image
                  src="/images/backgrounds/forest-aerial.png"
                  alt="Imagem base para secao de produto"
                  fill
                  className="object-cover"
                  loading="eager"
                  sizes="(min-width: 1024px) 700px, 100vw"
                />
                <div className="absolute inset-0 bg-card/55" />
                <div className="absolute left-6 top-6 flex items-center gap-2 rounded-md bg-card px-3 py-2 text-sm font-medium shadow-sm">
                  <ScanLine className="size-4 text-primary" />
                  Eventos do funil
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Badge variant="accent" className="w-fit">
                  O Produto
                </Badge>
                <h3 className="text-3xl font-bold leading-tight">
                  Imagem primeiro, explicacao depois.
                </h3>
                <p className="text-muted-foreground">
                  Os cards de produto devem usar assets reais ou finais assim que
                  aprovados. Ate la, este catalogo registra a intencao de uso.
                </p>
              </div>
            </div>
          </Card>
          </FadeUp>
        </div>
      </CatalogSection>

      <CatalogSection
        id="dashboard-system"
        eyebrow="Dashboard"
        title="Catalogo dos componentes do APP"
        description="A leitura do Paper foi usada como mock-up para mapear necessidades do dashboard. Esta secao registra os componentes aprovaveis antes de implementar as paginas reais."
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <FadeUp>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Mapeamento das cinco paginas</CardTitle>
                <CardDescription>
                  Cada linha traduz a intencao do wireframe em componentes do catalogo.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {dashboardScreens.map((screen, index) => (
                  <div
                    key={screen.page}
                    className={cn(
                      "grid gap-4 px-6 py-5 md:grid-cols-[150px_1fr_1fr]",
                      index !== dashboardScreens.length - 1 && "border-b border-border"
                    )}
                  >
                    <div>
                      <Badge variant="accent" className="mb-2 w-fit rounded-md">
                        {screen.page}
                      </Badge>
                      <p className="text-sm font-semibold">{screen.approvalFocus}</p>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {screen.paperIntent}
                    </p>
                    <code className="rounded-md bg-muted px-3 py-2 text-sm leading-6 text-foreground">
                      {screen.catalogComponents}
                    </code>
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeUp>

          <FadeUp delay={0.08}>
            <Card>
              <CardHeader>
                <CardTitle>Wireframe review</CardTitle>
                <CardDescription>
                  Paper contem 5 artboards desktop 1440x900: Login, Funnel Overview, Leads Table, Lead Detail e Health Config.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
                <p>
                  Padroes extraidos: navegação lateral fixa, filtros no topo,
                  tabelas densas, progresso por etapa, alertas de saude e imagens
                  pontuais para assinatura visual.
                </p>
                <Alert>
                  <Filter className="size-4" />
                  <AlertTitle>Regra aplicada</AlertTitle>
                  <AlertDescription>
                    O Paper orienta hierarquia e comportamento. Os elementos nao
                    foram copiados para o codigo.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </FadeUp>
        </div>
      </CatalogSection>

      <CatalogSection
        eyebrow="Inventory"
        title="Componentes mapeados para aprovacao"
        description="Lista consolidada do que o dashboard precisa, sem duplicar componentes ja existentes no catalogo."
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            {dashboardComponentInventory.map((item, index) => (
              <div
                key={item.name}
                className={cn(
                  "grid gap-4 px-6 py-5 md:grid-cols-[220px_1fr_1fr_auto] md:items-center",
                  index !== dashboardComponentInventory.length - 1 && "border-b border-border"
                )}
              >
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.usage}</p>
                <code className="break-all rounded-md bg-muted px-3 py-2 text-sm">
                  {item.source}
                </code>
                <Badge
                  variant={item.status === "Imported" || item.status === "Ready" ? "default" : "outline"}
                  className="w-fit"
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </CatalogSection>

      <CatalogSection
        eyebrow="shadcn app"
        title="Primitivos importados para o dashboard"
        description="Estes componentes foram adicionados via shadcn MCP/CLI e aparecem aqui com estados representativos do APP."
      >
        <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
          <FadeUp>
            <Card>
              <CardHeader>
                <CardTitle>Registry importado</CardTitle>
                <CardDescription>
                  Novos blocos locais em `components/ui`.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {dashboardPrimitiveInventory.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </FadeUp>

          <FadeUp delay={0.08}>
            <Card>
              <CardHeader>
                <CardTitle>Controles de filtro</CardTitle>
                <CardDescription>
                  Combinacao base para Funnel Overview e Leads Table.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="grid gap-2">
                    <Label>Funil</Label>
                    <Select defaultValue="funnel_brasil_v2">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar funil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="funnel_brasil_v2">funnel_brasil_v2</SelectItem>
                        <SelectItem value="funnel_mexico_v1">funnel_mexico_v1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Pais</Label>
                    <Select defaultValue="br">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar pais" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="br">Brasil</SelectItem>
                        <SelectItem value="mx">Mexico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Periodo</Label>
                    <DateSelector />
                  </div>
                </div>
                <ConditionalFilterPreview />
              </CardContent>
            </Card>
          </FadeUp>
        </div>
      </CatalogSection>

      <CatalogSection
        eyebrow="Logo icons"
        title="Icones SVG oficiais do APP"
        description="Versoes preto e branco extraidas do simbolo original, sem wordmark, prontas para sidebar, header compacto, favicon interno e estados de navegacao."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {logoIconAssets.map((asset, index) => (
            <FadeUp key={asset.path} delay={index * 0.05}>
              <LogoIconPreviewCard {...asset} />
            </FadeUp>
          ))}
        </div>
      </CatalogSection>

      <CatalogSection
        eyebrow="Assets"
        title="Imagens organizadas para as paginas do APP"
        description="Os arquivos mapeados em assets-raw foram copiados para public/images/dashboard para uso estável por Next Image."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dashboardImages.map((asset, index) => (
            <FadeUp key={asset.path} delay={index * 0.05}>
              <AssetPreviewCard {...asset} />
            </FadeUp>
          ))}
        </div>
      </CatalogSection>

      <CatalogSection
        eyebrow="Compositions"
        title="Padroes compostos do dashboard"
        description="Previews de componentes de tela para aprovacao visual. Eles sao catalogo, nao paginas funcionais do dashboard."
      >
        <div className="grid gap-5 xl:grid-cols-[auto_1fr]">
          <FadeUp>
            <Card className="overflow-hidden p-0">
              <DashboardSidebarPreview />
            </Card>
          </FadeUp>
          <FadeUp delay={0.06}>
            <FunnelPreview />
          </FadeUp>
          <FadeUp delay={0.12} className="xl:col-span-2">
            <LeadsTablePreview />
          </FadeUp>
          <FadeUp delay={0.18} className="xl:col-span-2">
            <LeadDetailPreview />
          </FadeUp>
          <FadeUp delay={0.24} className="xl:col-span-2">
            <HealthConfigPreview />
          </FadeUp>
        </div>
      </CatalogSection>

      <footer className="border-t border-border bg-secondary text-secondary-foreground">
        <FadeUp className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">XBOARD Design System Catalog</p>
            <p className="text-sm text-secondary-foreground/70">
              Fonte de verdade inicial para aprovacao da LP.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-foreground/70">
            <Palette className="size-4" />
            Tokens em `app/globals.css`
          </div>
        </FadeUp>
      </footer>
    </main>
    </TooltipProvider>
  )
}
