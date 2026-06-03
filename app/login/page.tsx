import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FadeUp } from "@/components/ui/fade-up"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata = {
  title: "Entrar — XBOARD",
  description: "Acesse o dashboard XBOARD com email e senha.",
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground [letter-spacing:0]">
      <Image
        src="/images/dashboard/login-img.png"
        alt=""
        fill
        priority
        className="object-cover lg:hidden"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-secondary/72 lg:hidden" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,oklch(0.2210_0.0394_258.2754),transparent)] lg:hidden" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.14fr_minmax(420px,0.86fr)]">
        <section className="flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:order-2 lg:px-12">
          <FadeUp>
          <header className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center" aria-label="SGV XBOARD">
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
            </Link>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/" aria-label="Voltar para a pagina inicial">
                <ArrowLeft className="size-4" />
                Voltar
              </Link>
            </Button>
          </header>
          </FadeUp>

          <div className="flex flex-1 items-center justify-center py-10 lg:py-12">
            <div className="w-full max-w-[420px]">
              <div className="mb-8 flex flex-col gap-4">
                <FadeUp
                  delay={0.08}
                  className="flex size-12 items-center justify-center rounded-md bg-primary text-primary-foreground"
                >
                  <LockKeyhole className="size-5" />
                </FadeUp>
                <div className="flex flex-col gap-3">
                  <FadeUp delay={0.16}>
                    <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                      Acesse seu dashboard
                    </h1>
                  </FadeUp>
                  <FadeUp delay={0.24}>
                    <p className="max-w-sm text-base leading-7 text-muted-foreground">
                      Entre para acompanhar seus funis, leads e sinais de saude da
                      operacao em um unico lugar.
                    </p>
                  </FadeUp>
                </div>
              </div>

              <form className="flex flex-col gap-5" aria-label="Formulario de login">
                <FadeUp delay={0.32} className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@empresa.com"
                    required
                    className="h-12 bg-card"
                  />
                </FadeUp>

                <FadeUp delay={0.4} className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="password">Senha</Label>
                    <span className="text-sm text-muted-foreground">
                      Acesso restrito
                    </span>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    required
                    className="h-12 bg-card"
                  />
                </FadeUp>

                <FadeUp delay={0.48}>
                  <Button type="submit" size="xl" className="mt-2 w-full">
                    Entrar no XBOARD
                    <ArrowRight className="size-4" />
                  </Button>
                </FadeUp>
              </form>

              <FadeUp delay={0.56}>
                <p className="mt-8 text-sm leading-6 text-muted-foreground">
                  Credenciais sao criadas pelo administrador da operacao.
                </p>
              </FadeUp>
            </div>
          </div>
        </section>

        <section className="relative hidden min-h-screen overflow-hidden border-r border-border bg-secondary lg:order-1 lg:block">
          <Image
            src="/images/dashboard/login-img.png"
            alt="Floresta noturna iluminada, assinatura visual da entrada do XBOARD"
            fill
            priority
            className="object-cover"
            sizes="58vw"
          />
          <div className="absolute inset-0 bg-secondary/15" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(to_top,oklch(0.2210_0.0394_258.2754/0.95),transparent)]" />
          <FadeUp
            delay={0.16}
            className="absolute bottom-10 left-10 right-10 flex max-w-xl flex-col gap-4"
          >
            <p className="text-sm font-semibold text-primary">Dashboard privado</p>
            <h2 className="text-4xl font-bold leading-tight text-white">
              Clareza total antes de qualquer decisao de otimizacao.
            </h2>
            <p className="text-base leading-7 text-white/72">
              Um ponto de entrada seguro para revisar eventos, funis e saude da
              operacao sem ruido visual.
            </p>
          </FadeUp>
        </section>
      </div>
    </main>
  )
}
