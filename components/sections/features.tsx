// Features section — displays product feature cards with background images
import Image from "next/image"
import { FadeUp } from "@/components/ui/fade-up"

const features = [
  {
    label: "Página de dados do Lead",
    title: "Descubra o caminho percorrido pelos seus leads.",
    description:
      "Visualize cada etapa do funil que seus leads percorreram. Identifique onde há queda, onde estão os leads mais qualificados e o que os move para a compra.",
    image: "/images/backgrounds/forest-laptop.png",
    imageAlt: "Dashboard de dados do lead",
  },
  {
    label: "Dashboard principal (eventos do funil)",
    title: "Tenha em mãos todos os principais dados dos seus funis.",
    description:
      "Acompanhe em tempo real as métricas mais importantes: cliques, visualizações, conversões e eventos customizados — tudo em uma única tela.",
    image: "/images/backgrounds/forest-aerial.png",
    imageAlt: "Dashboard principal com eventos do funil",
    reverse: true,
  },
]

export function FeaturesSection() {
  return (
    <section
      id="recursos"
      className="w-full bg-background px-8 py-12 lg:px-16"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-14">
        {/* Section Header */}
        <FadeUp className="flex max-w-[780px] flex-col gap-4">
          <h2 className="text-4xl font-bold tracking-tighter leading-tight">
            Saiba exatamente quais são os comportamentos dos seus leads
            compradores.
          </h2>
        </FadeUp>

        {/* Feature Cards */}
        <div className="flex flex-col gap-6">
          {features.map((feature, index) => (
            <FadeUp
              key={feature.label}
              delay={0.08 * index}
              className="flex flex-col gap-8 rounded-2xl border border-border bg-card p-8 lg:flex-row lg:items-center lg:gap-16"
            >
              {/* Feature Image */}
              <div
                className={`relative min-h-[300px] w-full shrink-0 overflow-hidden rounded-xl lg:w-[480px] ${
                  feature.reverse ? "lg:order-last" : ""
                }`}
              >
                <Image
                  src={feature.image}
                  alt={feature.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
