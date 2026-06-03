"use client"
// Importa componentes do shadcn
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { FadeUp } from "@/components/ui/fade-up"

// Cria 
const faqItems = [
  {
    question: "Preciso de cartão de crédito para testar?",
    answer:
      "Não. O teste é totalmente gratuito e não exige cartão. Você conecta seu funil e começa a ver os dados imediatamente.",
  },
  {
    question: "Como o XBOARD coleta os eventos do meu funil?",
    answer:
      "O XBOARD usa um script leve que você instala nas suas páginas. Ele captura automaticamente os eventos principais — como pageview, clique em botão e conversão — e os envia em tempo real para o seu dashboard.",
  },
  {
    question: "Funciona com quizzes e presell pages?",
    answer:
      "Sim. O XBOARD foi desenvolvido especificamente para funis de direct response, incluindo quizzes, presells, VSLs e páginas de checkout.",
  },
  {
    question: "Quantos funis posso conectar no plano mensal?",
    answer:
      "No plano mensal você pode conectar até 5 funis. Se precisar de mais, temos planos escaláveis para operações maiores.",
  },
  {
    question: "Os dados aparecem realmente em tempo real?",
    answer:
      "Sim. O delay médio entre um evento acontecer e aparecer no dashboard é inferior a 3 segundos — ideal para monitorar campanhas ao vivo.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="w-full bg-background px-8 py-12 lg:px-16">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-14">
        {/* Section Header */}
        <FadeUp className="flex max-w-[720px] flex-col items-center gap-4 text-center">

          <h2 className="text-4xl font-bold tracking-tighter">
            Perguntas frequentes
          </h2>
        </FadeUp>

        {/* FAQ Accordion */}
        <FadeUp delay={0.08} className="w-full max-w-[840px]">
          <Accordion type="single" collapsible defaultValue="item-0">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-base font-medium hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeUp>
      </div>
    </section>
  )
}
