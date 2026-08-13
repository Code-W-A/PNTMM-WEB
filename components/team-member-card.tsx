import Image from "next/image"
import Link from "next/link"

import { MediaPlaceholder } from "@/components/shared/editorial-media"
import type { TeamMember } from "@/types"

interface TeamMemberCardProps {
  member: TeamMember
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <article className="group overflow-hidden rounded-[var(--radius-card)] border bg-card shadow-[0_18px_55px_-38px_rgba(24,37,99,0.55)] transition duration-500 motion-reduce:transition-none hover:-translate-y-1 hover:border-primary/30 motion-reduce:hover:translate-y-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-primary-dark">
        {member.image ? (
          <Image
            src={member.image.src}
            alt={member.image.alt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none"
          />
        ) : (
          <MediaPlaceholder
            alt={`Spațiu rezervat fotografiei pentru ${member.name}`}
            label="Portret în pregătire"
            aspect="portrait"
            className="h-full !aspect-auto rounded-none shadow-none"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-balance font-heading text-xl font-bold">{member.name}</h3>
        <p className="meta mt-2 text-primary">{member.role}</p>
        {member.biography ? (
          <p className="mt-4 line-clamp-3 leading-7 text-muted-foreground">
            {member.biography}
          </p>
        ) : null}
        {member.publicLink || member.social ? (
          <div className="mt-5 flex flex-wrap gap-4 border-t pt-4 text-sm font-semibold">
            {member.publicLink ? (
              <Link
                className="outline-none ui-transition hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                href={member.publicLink}
              >
                Vezi profilul
              </Link>
            ) : null}
            {member.social?.facebook ? (
              <Link
                className="outline-none ui-transition hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                href={member.social.facebook}
              >
                Facebook
              </Link>
            ) : null}
            {member.social?.linkedin ? (
              <Link
                className="outline-none ui-transition hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                href={member.social.linkedin}
              >
                LinkedIn
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
