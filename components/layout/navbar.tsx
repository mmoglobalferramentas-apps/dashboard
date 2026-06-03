import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Recursos", href: "#recursos" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Quem faz", href: "#quem-faz" },
  { label: "FAQ", href: "#faq" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-lg">
      <div className="mx-auto flex h-[87px] max-w-[1440px] items-center justify-between px-8 lg:px-16">
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

        {/* Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Nav Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Entrar
          </Link>
          <Button size="default" asChild>
            <Link href="/signup">Acessar XBOARD</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
