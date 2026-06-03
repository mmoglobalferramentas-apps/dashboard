import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const valkoCapela = localFont({
  src: "../assets-raw/VALKOCAPELARegular.ttf",
  variable: "--font-display",
  display: "swap",
})

const spaceGrotesk = localFont({
  src: "../assets-raw/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "XBOARD — Clareza total dos seus funis de Direct Response",
  description:
    "Dados ao vivo, clareza total da movimentação do seu lead e otimizações em tempo recorde. Utilizado por 300+ players do mercado.",
  keywords: ["dashboard", "funil", "direct response", "métricas", "marketing"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${valkoCapela.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
