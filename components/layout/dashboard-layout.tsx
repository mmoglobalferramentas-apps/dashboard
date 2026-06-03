/**
 * DashboardLayout — Shared shell for all /dashboard/* routes.
 *
 * Renders the desktop sidebar, mobile Sheet header, and wraps page content.
 * Active nav state is derived automatically from `usePathname()` so pages
 * never need to pass an `active` prop or duplicate the navItems array.
 */
"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HeartPulse,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Table2,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/components/ui/utils"

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Leads", icon: Table2, href: "/dashboard/leads" },
  { label: "Health", icon: HeartPulse, href: "/dashboard/health" },
  { label: "Account", icon: UserRound, href: "#" },
]

function isNavActive(pathname: string, href: string) {
  if (href === "#") return false
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(href + "/")
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background text-foreground [letter-spacing:0]">
        <div className="grid min-h-screen lg:grid-cols-[88px_1fr]">
          {/* ── Desktop sidebar ── */}
          <aside className="sticky top-0 hidden h-screen flex-col items-center justify-between border-r border-sidebar-border bg-sidebar px-3 py-5 text-sidebar-foreground lg:flex">
            <div className="flex flex-col items-center gap-8">
              <Link
                href="/dashboard"
                className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground"
                aria-label="XBOARD dashboard"
              >
                <Image
                  src="/images/logos/iconWhite.svg"
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 object-contain"
                />
              </Link>

              <nav className="flex flex-col gap-3" aria-label="Dashboard navigation">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isNavActive(pathname, item.href)

                  return (
                    <Tooltip key={item.label}>
                      <TooltipTrigger asChild>
                        <Button
                          asChild
                          size="icon"
                          variant={active ? "default" : "ghost"}
                          aria-label={item.label}
                          className={cn(
                            "size-11",
                            !active &&
                              "text-sidebar-foreground/65 hover:text-sidebar-foreground"
                          )}
                        >
                          <Link href={item.href}>
                            <Icon className="size-5" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  )
                })}
              </nav>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Acesso seguro"
                  className="text-sidebar-foreground/65"
                >
                  <LockKeyhole className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Acesso seguro</TooltipContent>
            </Tooltip>
          </aside>

          {/* ── Content area ── */}
          <section className="min-w-0">
            {/* Mobile header */}
            <header className="border-b border-border bg-card/70 px-5 py-4 backdrop-blur sm:px-8 lg:hidden">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/dashboard"
                  className="relative block h-9 w-36 overflow-hidden"
                  aria-label="SGV XBOARD dashboard"
                >
                  <Image
                    src="/images/logos/logoWhite.svg"
                    alt="SGV XBOARD"
                    fill
                    priority
                    className="scale-[3.55] object-contain"
                    sizes="144px"
                  />
                </Link>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="icon" variant="outline" aria-label="Abrir menu">
                      <Menu className="size-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[300px] border-sidebar-border bg-sidebar text-sidebar-foreground"
                  >
                    <SheetHeader className="pr-8 text-left">
                      <SheetTitle className="text-sidebar-foreground">
                        XBOARD
                      </SheetTitle>
                      <SheetDescription>
                        Navegacao principal do dashboard.
                      </SheetDescription>
                    </SheetHeader>
                    <nav
                      className="mt-8 flex flex-col gap-2"
                      aria-label="Mobile dashboard navigation"
                    >
                      {navItems.map((item) => {
                        const Icon = item.icon
                        const active = isNavActive(pathname, item.href)

                        return (
                          <SheetClose key={item.label} asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex h-12 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                                active
                                  ? "bg-primary text-primary-foreground"
                                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                              )}
                            >
                              <Icon className="size-5" />
                              {item.label}
                            </Link>
                          </SheetClose>
                        )
                      })}
                    </nav>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-accent px-3 py-3 text-sm text-sidebar-accent-foreground">
                        <LockKeyhole className="size-4" />
                        Acesso seguro
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </header>

            {children}
          </section>
        </div>
      </main>
    </TooltipProvider>
  )
}
