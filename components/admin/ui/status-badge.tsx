import type { ContentStatus, UserStatus, WorkflowStatus } from "@/types"
import { cn } from "@/lib/utils"

/**
 * Statusul este transmis prin culoare ȘI text, niciodată doar prin culoare.
 */
type Tone = "neutral" | "info" | "progress" | "success" | "danger"

const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  info: "border-primary/25 bg-primary/10 text-primary",
  progress: "border-amber-500/35 bg-amber-50 text-amber-800",
  success: "border-emerald-600/25 bg-emerald-50 text-emerald-800",
  danger: "border-destructive/25 bg-destructive/10 text-destructive",
}

const WORKFLOW: Record<WorkflowStatus, { label: string; tone: Tone }> = {
  new: { label: "Nou", tone: "info" },
  in_progress: { label: "În lucru", tone: "progress" },
  closed: { label: "Închis", tone: "neutral" },
}

const CONTENT: Record<ContentStatus, { label: string; tone: Tone }> = {
  draft: { label: "Ciornă", tone: "neutral" },
  published: { label: "Publicat", tone: "success" },
}

const USER: Record<UserStatus, { label: string; tone: Tone }> = {
  active: { label: "Activ", tone: "success" },
  disabled: { label: "Dezactivat", tone: "danger" },
}

const NOTIFICATION: Record<string, { label: string; tone: Tone }> = {
  draft: { label: "În pregătire", tone: "neutral" },
  sent: { label: "Trimisă", tone: "success" },
  failed: { label: "Eșuată", tone: "danger" },
}

function Pill({
  label,
  tone,
  className,
}: {
  label: string
  tone: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        TONE_CLASS[tone],
        className,
      )}
    >
      {label}
    </span>
  )
}

export function WorkflowBadge({
  status,
  className,
}: {
  status: WorkflowStatus
  className?: string
}) {
  const { label, tone } = WORKFLOW[status] ?? WORKFLOW.new
  return <Pill label={label} tone={tone} className={className} />
}

export function ContentBadge({
  status,
  className,
}: {
  status: ContentStatus
  className?: string
}) {
  const { label, tone } = CONTENT[status] ?? CONTENT.draft
  return <Pill label={label} tone={tone} className={className} />
}

export function EventTimingBadge({
  upcoming,
  className,
}: {
  upcoming: boolean
  className?: string
}) {
  return (
    <Pill
      label={upcoming ? "Viitor" : "Încheiat"}
      tone={upcoming ? "info" : "neutral"}
      className={className}
    />
  )
}

export function UserBadge({
  status,
  className,
}: {
  status: UserStatus
  className?: string
}) {
  const { label, tone } = USER[status] ?? USER.active
  return <Pill label={label} tone={tone} className={className} />
}

export function NotificationBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const { label, tone } = NOTIFICATION[status] ?? NOTIFICATION.draft
  return <Pill label={label} tone={tone} className={className} />
}
