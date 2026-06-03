/**
 * Dashboard route layout — wraps all /dashboard/* pages with the shared
 * DashboardLayout (sidebar + mobile header).
 */
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
