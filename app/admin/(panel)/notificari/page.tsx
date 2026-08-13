import { Bell } from "lucide-react"

import { NotificationForm } from "@/components/admin/notification-form"
import {
  AdminTableShell,
  CellMuted,
} from "@/components/admin/ui/data-table"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { SectionCard } from "@/components/admin/ui/section-card"
import { NotificationBadge } from "@/components/admin/ui/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateTime } from "@/lib/datetime"
import { listNotifications } from "@/services/admin/notifications-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Notificări" }

export default async function AdminNotificationsPage() {
  const notifications = await listNotifications()

  return (
    <>
      <AdminPageHeader
        title="Notificări"
        description="Notificări generale către utilizatorii care au permis primirea lor."
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SectionCard title="Notificare nouă" className="min-w-0">
          <NotificationForm />
        </SectionCard>
      </div>

      <SectionCard
        title="Notificări trimise"
        className="mt-6"
        bodyClassName="p-0"
      >
        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="Nicio notificare trimisă"
            description="Istoricul trimiterilor apare aici."
          />
        ) : (
          <AdminTableShell className="rounded-none border-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titlu</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Destinatari</TableHead>
                  <TableHead>Trimisă la</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="max-w-[24rem]">
                      <span className="block truncate font-medium text-foreground">
                        {notification.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {notification.body}
                      </span>
                    </TableCell>
                    <TableCell>
                      <NotificationBadge status={notification.status} />
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {notification.recipientCount ?? 0}
                    </TableCell>
                    <TableCell>
                      <CellMuted>
                        {formatDateTime(notification.sentAt)}
                      </CellMuted>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AdminTableShell>
        )}
      </SectionCard>
    </>
  )
}
