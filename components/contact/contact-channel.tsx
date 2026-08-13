import type { LucideIcon } from "lucide-react"
import {
  ArrowUpRight,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react"

import type { ContactChannelData } from "@/lib/contact-channels"
import { cn } from "@/lib/utils"

const icons: Record<ContactChannelData["type"], LucideIcon> = {
  email: Mail,
  phone: Phone,
  address: MapPin,
  hours: Clock,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
}

interface ContactChannelProps {
  channel: ContactChannelData
  className?: string
}

export function ContactChannel({ channel, className }: ContactChannelProps) {
  const Icon = icons[channel.type]
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/[0.07] text-primary ui-transition group-hover:bg-primary/10">
        <Icon aria-hidden="true" className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="meta block text-muted-foreground/75">
          {channel.label}
        </span>
        <span className="mt-0.5 block break-words text-sm font-semibold leading-snug text-foreground ui-transition group-hover:text-primary">
          {channel.value}
        </span>
      </span>
      {channel.href ? (
        <ArrowUpRight
          aria-hidden="true"
          className="mt-1 h-4 w-4 shrink-0 text-primary/40 ui-transition group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:text-primary"
        />
      ) : null}
    </>
  )

  const sharedClass = cn(
    "group flex items-start gap-3.5 py-3 outline-none ui-transition",
    channel.href &&
      "rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    className,
  )

  if (channel.href) {
    return (
      <a
        href={channel.href}
        className={sharedClass}
        {...(channel.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </a>
    )
  }

  return <div className={sharedClass}>{content}</div>
}
