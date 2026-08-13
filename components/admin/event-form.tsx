"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import {
  AdminFormFeedback,
  AdminSubmitButton,
  SaveStateIndicator,
  useAdminAction,
} from "@/components/admin/admin-form-state"
import { DeleteEntityButton } from "@/components/admin/delete-entity-button"
import {
  AdminField,
  FormLayout,
  selectTriggerClassName,
} from "@/components/admin/ui/form-layout"
import { SectionCard } from "@/components/admin/ui/section-card"
import { FormField } from "@/components/forms/form-elements"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { fromDateTimeLocal, toDateTimeLocal } from "@/lib/datetime"
import { slugify } from "@/lib/slug"
import { eventInputSchema, type EventInput } from "@/lib/validation/admin"
import type { EventDoc } from "@/types"

export function EventForm({ item }: { item?: EventDoc }) {
  const router = useRouter()
  const { state, run } = useAdminAction()
  const [slugTouched, setSlugTouched] = useState(Boolean(item))

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<EventInput>({
    resolver: zodResolver(eventInputSchema),
    defaultValues: {
      slug: item?.slug ?? "",
      title: item?.title ?? "",
      description: item?.description ?? "",
      imageUrl: item?.imageUrl ?? "",
      startDate: item?.startDate ?? new Date().toISOString(),
      endDate: item?.endDate ?? "",
      location: item?.location ?? "",
      address: item?.address ?? "",
      registrationEnabled: item?.registrationEnabled ?? false,
      status: item?.status ?? "draft",
    },
    shouldFocusError: true,
  })

  async function onSubmit(values: EventInput) {
    const succeeded = await run(
      () =>
        fetch(item ? `/api/admin/events/${item.id}` : "/api/admin/events", {
          method: item ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }),
      item ? "Evenimentul a fost actualizat." : "Evenimentul a fost creat.",
    )

    if (succeeded) {
      reset(values, { keepValues: true })
      router.refresh()
      if (!item) router.push("/admin/evenimente")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormLayout
        main={
          <>
            <SectionCard title="Detalii">
              <div className="space-y-6">
                <FormField name="title" label="Titlu" error={errors.title}>
                  <Input
                    {...register("title", {
                      onChange: (event) => {
                        if (!slugTouched) {
                          setValue("slug", slugify(event.target.value))
                        }
                      },
                    })}
                  />
                </FormField>

                <FormField
                  name="slug"
                  label="Slug"
                  hint="Adresa publică: /evenimente/slug. Trebuie să fie unic."
                  error={errors.slug}
                >
                  <Input
                    {...register("slug", {
                      onChange: () => setSlugTouched(true),
                    })}
                  />
                </FormField>

                <FormField
                  name="description"
                  label="Descriere"
                  error={errors.description}
                >
                  <Textarea rows={10} {...register("description")} />
                </FormField>
              </div>
            </SectionCard>

            <SectionCard title="Loc și program">
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    name="startDate"
                    label="Început"
                    error={errors.startDate}
                  >
                    <Input
                      type="datetime-local"
                      defaultValue={toDateTimeLocal(
                        item?.startDate ?? new Date().toISOString(),
                      )}
                      onChange={(event) =>
                        setValue(
                          "startDate",
                          fromDateTimeLocal(event.target.value),
                          { shouldValidate: true, shouldDirty: true },
                        )
                      }
                    />
                  </FormField>

                  <FormField
                    name="endDate"
                    label="Final"
                    optional
                    error={errors.endDate}
                  >
                    <Input
                      type="datetime-local"
                      defaultValue={toDateTimeLocal(item?.endDate)}
                      onChange={(event) =>
                        setValue(
                          "endDate",
                          fromDateTimeLocal(event.target.value),
                          { shouldValidate: true, shouldDirty: true },
                        )
                      }
                    />
                  </FormField>
                </div>

                <FormField
                  name="location"
                  label="Locație"
                  error={errors.location}
                >
                  <Input {...register("location")} />
                </FormField>

                <FormField
                  name="address"
                  label="Adresă"
                  optional
                  error={errors.address}
                >
                  <Input {...register("address")} />
                </FormField>
              </div>
            </SectionCard>

            <SectionCard title="Imagine">
              <FormField
                name="imageUrl"
                label="Adresa imaginii"
                optional
                hint="Adresă completă către imaginea evenimentului."
                error={errors.imageUrl}
              >
                <Input type="url" {...register("imageUrl")} />
              </FormField>
            </SectionCard>
          </>
        }
        aside={
          <>
            <SectionCard title="Publicare">
              <div className="space-y-5">
                <AdminField
                  label="Stare"
                  error={errors.status}
                  htmlFor="event-status"
                >
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="event-status"
                          className={selectTriggerClassName}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Ciornă</SelectItem>
                          <SelectItem value="published">Publicat</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </AdminField>

                <Controller
                  control={control}
                  name="registrationEnabled"
                  render={({ field }) => (
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="registrationEnabled"
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        className="mt-0.5"
                      />
                      <label
                        htmlFor="registrationEnabled"
                        className="text-sm leading-5"
                      >
                        <span className="font-semibold text-foreground">
                          Înscriere activă
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                          Afișează formularul de înscriere pe pagina publică.
                        </span>
                      </label>
                    </div>
                  )}
                />
              </div>
            </SectionCard>

            <div className="space-y-4 rounded-xl border bg-background p-5">
              <AdminFormFeedback state={state} />

              <div className="flex flex-col gap-3">
                <AdminSubmitButton
                  state={state}
                  label={item ? "Salvează modificările" : "Creează evenimentul"}
                  className="w-full"
                />
                <SaveStateIndicator isDirty={isDirty} state={state} />
              </div>

              {item ? (
                <div className="border-t pt-3">
                  <DeleteEntityButton
                    endpoint={`/api/admin/events/${item.id}`}
                    redirectTo="/admin/evenimente"
                    title="Ștergi acest eveniment?"
                    successMessage="Evenimentul a fost șters."
                  />
                </div>
              ) : null}
            </div>
          </>
        }
      />
    </form>
  )
}
