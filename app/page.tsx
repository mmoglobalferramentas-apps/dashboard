import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero"
import { TestimonialsSection } from "@/components/sections/testimonials"
import { FeaturesSection } from "@/components/sections/features"
import { FounderSection } from "@/components/sections/founder"
import { FaqSection } from "@/components/sections/faq"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TestimonialsSection />
        <FeaturesSection />
        <FounderSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
}
