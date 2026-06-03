import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FadeUp } from "@/components/ui/fade-up"

const testimonials = [
  {
    quote:
      "Não tenho mais dores de cabeça na hora de interpretar os dados.",
    name: "Carla Mendes",
    role: "Copywriter, Operação DR",
    avatar: "/images/testimonials/avatar-1.png",
    initials: "CM",
  },
  {
    quote:
      "Muito melhor do que as planilhas de excel do meu gestor.",
    name: "Rafael Torres",
    role: "Gestor de Tráfego",
    avatar: "/images/testimonials/avatar-2.png",
    initials: "RT",
  },
  {
    quote:
      "Minha operação começou a faturar 2X mais com o aumento de clareza e eficiência que tivemos.",
    name: "André Lima",
    role: "CEO, Operação DR",
    avatar: "/images/testimonials/avatar-3.png",
    initials: "AL",
  },
]

export function TestimonialsSection() {
  return (
    <section
      id="depoimentos"
      className="w-full bg-background px-8 py-12 lg:px-16"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-14">
        {/* Section Header */}
        <FadeUp className="flex max-w-[760px] flex-col items-center gap-4 text-center">

          <h2 className="text-4xl font-bold tracking-tighter">
            Desenvolvido por quem vive o Direct-Response, usado por quem domina
            ele.
          </h2>
        </FadeUp>

        {/* Testimonial Cards */}
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <FadeUp key={t.name} delay={0.08 * index} className="h-full">
              <Card className="h-full gap-4 px-0">
                <CardContent className="flex h-full flex-col justify-between gap-6">
                  <p className="text-base text-foreground/80 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11">
                      <AvatarImage src={t.avatar} alt={t.name} />
                      <AvatarFallback>{t.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{t.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {t.role}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
