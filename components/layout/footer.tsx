// Footer — site footer with background image, gradient fade, and navigation links
import Link from "next/link"
import Image from "next/image"
import { FadeUp } from "@/components/ui/fade-up"

const footerLinks = {
  produto: [
    { label: "Recursos", href: "#recursos" },
    { label: "Preços", href: "#precos" },
    { label: "Entrar", href: "/login" },
  ],
  empresa: [
    { label: "Quem faz", href: "#quem-faz" },
    { label: "Contato", href: "mailto:contato@xboard.com.br" },
    { label: "FAQ", href: "#faq" },
  ],
}

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[oklch(0.2210_0.0394_258.2754)] text-secondary-foreground">
      <Image
        src="/images/backgrounds/footer-bg.png"
        alt=""
        fill
        className="object-cover object-bottom"
        quality={100}
      />

      <div className="absolute inset-0 bg-[oklch(0.2210_0.0394_258.2754/0.25)]" />

      <div className="absolute inset-x-0 top-0 h-[420px] pointer-events-none bg-[linear-gradient(to_bottom,oklch(0.2210_0.0394_258.2754)_0%,oklch(0.2210_0.0394_258.2754/0.9)_18%,oklch(0.2210_0.0394_258.2754/0.45)_55%,transparent_100%)]" />

      {/* Content */}
      <div className="relative z-10">
        {/* Footer Top */}
        <FadeUp className="mx-auto flex max-w-[1200px] flex-col gap-12 px-8 pt-16 pb-8 lg:flex-row lg:justify-between lg:px-16">
          {/* Brand */}
          <div className="flex max-w-[320px] flex-col gap-4">
            <Link href="/" className="flex items-center" aria-label="SGV XBOARD">
              <span className="relative block h-10 w-40 overflow-hidden">
                <Image
                  src="/images/logos/logoWhite.svg"
                  alt="SGV XBOARD"
                  fill
                  className="scale-[3.6] object-contain"
                  sizes="160px"
                />
              </span>
            </Link>
            <p className="text-sm text-secondary-foreground/70 leading-relaxed">
              Clareza total dos pontos de alavancagem do seu funil.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/50">
                Produto
              </span>
              <ul className="flex flex-col gap-3">
                {footerLinks.produto.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary-foreground/70 transition-colors hover:text-secondary-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-secondary-foreground/50">
                Empresa
              </span>
              <ul className="flex flex-col gap-3">
                {footerLinks.empresa.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary-foreground/70 transition-colors hover:text-secondary-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeUp>

        {/* Footer Legal */}
        <FadeUp
          delay={0.08}
          className="mx-auto flex max-w-[1200px] items-center justify-between border-t border-secondary-foreground/10 px-8 py-6 lg:px-16"
        >
          <p className="text-xs text-secondary-foreground/50">
            © 2026 XBOARD. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link
              href="/termos"
              className="text-xs text-secondary-foreground/50 transition-colors hover:text-secondary-foreground"
            >
              Termos
            </Link>
            <Link
              href="/privacidade"
              className="text-xs text-secondary-foreground/50 transition-colors hover:text-secondary-foreground"
            >
              Privacidade
            </Link>
          </div>
        </FadeUp>
      </div>
    </footer>
  )
}
