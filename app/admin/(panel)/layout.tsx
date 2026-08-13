import { redirect } from "next/navigation"

import { AdminMobileHeader } from "@/components/admin/admin-mobile-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getAdminContext } from "@/lib/auth/require-admin"

/** Zona admin nu se prerandează niciodată: fiecare cerere verifică sesiunea. */
export const dynamic = "force-dynamic"

/**
 * Verificarea sesiunii se face aici, la fiecare randare. Middleware-ul doar
 * redirectează vizitatorii fără cookie; validarea tokenului cu Admin SDK nu
 * poate rula pe Edge, așa că autorizarea reală trăiește în acest layout și în
 * fiecare endpoint.
 */
export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const admin = await getAdminContext()

  if (!admin) {
    redirect("/admin/login")
  }

  return (
    <SidebarProvider>
      <AdminSidebar email={admin.email} name={admin.name} />

      <SidebarInset className="min-w-0 bg-muted/30">
        <AdminMobileHeader />
        <div className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
