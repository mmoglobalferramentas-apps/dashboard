import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeUp } from "@/components/ui/fade-up"

const avatars = [
  { src: "/images/testimonials/avatar-1.png", alt: "Player 1" },
  { src: "/images/testimonials/avatar-2.png", alt: "Player 2" },
  { src: "/images/testimonials/avatar-3.png", alt: "Player 3" },
  { src: "/images/testimonials/avatar-4.png", alt: "Player 4" },
]

export function HeroSection() {
  return (
    <section className="relative flex min-h-[742px] w-full flex-col items-center overflow-hidden bg-background px-8 pt-24 pb-20 text-center lg:px-16">
      {/* Ambient gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 35%, oklch(0.8871 0.2122 128.5041 / 0.25), transparent)",
        }}
      />

      <div className="relative z-10 flex max-w-[760px] flex-col items-center gap-8">
        <FadeUp className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
          <div className="flex -space-x-2">
            {avatars.map((avatar) => (
              <div
                key={avatar.alt}
                className="size-5 overflow-hidden rounded-full border-2 border-card"
              >
                <Image
                  src={avatar.src}
                  alt={avatar.alt}
                  width={20}
                  height={20}
                  className="size-full object-cover"
                />
              </div>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            Utilizado por <strong className="text-foreground">300+</strong>{" "}
            players do mercado
          </span>
        </FadeUp>

        <FadeUp delay={0.08}>
          <h1 className="text-5xl leading-tight font-bold tracking-tighter text-foreground lg:text-6xl">
            Tenha em mãos os{" "}
            <span className="text-primary">pontos de alavancagem</span> do seu
            funil.
          </h1>
        </FadeUp>

        <FadeUp delay={0.16}>
          <p className="max-w-[680px] text-lg text-muted-foreground">
            Dados ao vivo, clareza total da movimentação do seu lead e
            otimizações em tempo recorde — sem planilhas confusas.
          </p>
        </FadeUp>

        <FadeUp delay={0.24} className="flex flex-col items-center gap-3">
          <Button size="xl" asChild>
            <Link href="/signup">Acelerar minhas otimizações</Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            Teste gratuito, sem cartão de crédito.
          </span>
        </FadeUp>
      </div>
    </section>
  )
}
