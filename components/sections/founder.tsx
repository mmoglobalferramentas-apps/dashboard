// Founder section — displays founder bio card with real photo
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeUp } from "@/components/ui/fade-up"

export function FounderSection() {
  return (
    <section
      id="quem-faz"
      className="w-full bg-background px-8 py-12 lg:px-16"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-14">
        {/* Section Header */}
        <FadeUp className="flex max-w-[760px] flex-col gap-4">
          <h2 className="text-4xl font-bold tracking-tighter">
            Tire suas dúvidas com quem é responsável pelo sistema.
          </h2>
        </FadeUp>

        {/* Founder Card */}
        <FadeUp
          delay={0.08}
          className="flex flex-col gap-8 rounded-2xl border border-border bg-card p-8 lg:flex-row lg:items-start lg:gap-16"
        >
          {/* Photo */}
          <div className="relative flex min-h-[360px] w-full shrink-0 flex-col overflow-hidden rounded-xl border border-border lg:w-[340px]">
            <Image
              src="/images/founder/bruno.jpeg"
              alt="Bruno Castelani"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 340px"
            />
            {/* Dark gradient overlay at the bottom for the text */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 text-white">
              <p className="font-semibold text-white">Bruno Castelani</p>
              <p className="text-sm text-white/70">Fundador, XBOARD</p>
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 text-base text-muted-foreground leading-relaxed">
              <p>
                Eu sou Bruno Castelani. Minha jornada com tecnologia começou na
                infância: aos 10, já havia começado a ter experiências com
                desenvolvimento — construindo jogos, páginas e sistemas para
                grandes instituições, como a UNIVAP e Super-Geeks.
              </p>
              <p>
                Em 2024 entrei no Direct Response como copywriter e coletei
                múltiplos 7 dígitos de faturamento em menos de 1 ano.
                Trabalhei com players como Davi Meurer, Covolam, Antony
                Carreiro e Nathanael Goat.
              </p>
              <p>
                Foi isso que me levou a construir o XBOARD: dados completos e
                simplificados em tempo real do que está acontecendo com os seus
                funis, gerando clareza para todo o time e acelerando processos
                de otimização.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-2">
              <Button size="lg" asChild className="w-fit">
                <Link href="/signup">Acessar XBOARD</Link>
              </Button>
              <span className="text-sm text-muted-foreground">
                Teste gratuitamente, sem cartão de crédito.
              </span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
