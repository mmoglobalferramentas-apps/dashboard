import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Entrar — XBOARD",
  description: "Acesse o dashboard XBOARD com email e senha.",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
