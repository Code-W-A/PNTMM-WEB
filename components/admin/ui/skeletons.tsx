import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeletoanele reproduc structura paginii, nu doar un spinner: înălțimea și
 * numărul de coloane corespund conținutului real, ca layout-ul să nu sară.
 */
function HeaderSkeleton() {
  return (
    <div className="mb-6 border-b pb-5">
      <Skeleton className="h-7 w-56" />
      <Skeleton className="mt-3 h-4 w-80" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Se încarcă panoul">
      <HeaderSkeleton />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border bg-background p-5">
            <div className="flex items-start justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="mt-3 h-8 w-14" />
            <Skeleton className="mt-4 h-4 w-24" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-xl border bg-background xl:col-span-2">
          <div className="border-b px-5 py-4">
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="px-5 py-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-2 h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-background">
          <div className="border-b px-5 py-4">
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-2 p-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-11 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ListSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div aria-busy="true" aria-label="Se încarcă lista">
      <HeaderSkeleton />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-full sm:w-72" />
          <Skeleton className="hidden h-9 w-44 sm:block" />
        </div>
        <Skeleton className="h-11 w-36" />
      </div>

      <div className="overflow-hidden rounded-xl border bg-background">
        <div className="h-10 border-b bg-muted/40" />
        {Array.from({ length: 6 }).map((_, row) => (
          <div
            key={row}
            className="flex items-center gap-4 border-b px-4 py-4 last:border-0"
          >
            {Array.from({ length: columns }).map((_, column) => (
              <Skeleton
                key={column}
                className={column === 0 ? "h-4 flex-[2]" : "h-4 flex-1"}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Se încarcă detaliile">
      <HeaderSkeleton />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="rounded-xl border bg-background">
          <div className="border-b px-5 py-4">
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full last:w-2/3" />
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-background">
          <div className="border-b px-5 py-4">
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="space-y-4 p-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-3 w-20" />
                <Skeleton className="mt-2 h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div aria-busy="true" aria-label="Se încarcă formularul">
      <HeaderSkeleton />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-xl border bg-background">
          <div className="border-b px-5 py-4">
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="space-y-6 p-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 h-11 w-full rounded-lg" />
              </div>
            ))}
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-background">
            <div className="border-b px-5 py-4">
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="space-y-5 p-5">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="mt-2 h-11 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-background p-5">
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
