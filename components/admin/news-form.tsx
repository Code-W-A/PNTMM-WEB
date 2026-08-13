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
import { newsInputSchema, type NewsInput } from "@/lib/validation/admin"
import type { NewsDoc } from "@/types"

export function NewsForm({ item }: { item?: NewsDoc }) {
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
  } = useForm<NewsInput>({
    resolver: zodResolver(newsInputSchema),
    defaultValues: {
      slug: item?.slug ?? "",
      title: item?.title ?? "",
      excerpt: item?.excerpt ?? "",
      content: item?.content ?? "",
      category: item?.category ?? "",
      imageUrl: item?.imageUrl ?? "",
      publishedAt: item?.publishedAt ?? new Date().toISOString(),
      status: item?.status ?? "draft",
    },
    shouldFocusError: true,
  })

  async function onSubmit(values: NewsInput) {
    const succeeded = await run(
      () =>
        fetch(item ? `/api/admin/news/${item.id}` : "/api/admin/news", {
          method: item ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }),
      item ? "Știrea a fost actualizată." : "Știrea a fost creată.",
    )

    if (succeeded) {
      // Resetarea aduce formularul la starea „fără modificări nesalvate”.
      reset(values, { keepValues: true })
      router.refresh()
      if (!item) router.push("/admin/stiri")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormLayout
        main={
          <>
            <SectionCard title="Conținut">
              <div className="space-y-6">
                <FormField name="title" label="Titlu" error={errors.title}>
                  <Input
                    {...register("title", {
                      onChange: (event) => {
                        // Slug-ul urmează titlul până când este editat manual.
                        if (!slugTouched) {
                          setValue("slug", slugify(event.target.value), {
                            shouldValidate: false,
                          })
                        }
                      },
                    })}
                  />
                </FormField>

                <FormField
                  name="slug"
                  label="Slug"
                  hint="Adresa publică: /stiri/slug. Trebuie să fie unic."
                  error={errors.slug}
                >
                  <Input
                    {...register("slug", {
                      onChange: () => setSlugTouched(true),
                    })}
                  />
                </FormField>

                <FormField
                  name="excerpt"
                  label="Rezumat"
                  hint="Apare în listă și în rezultatele căutărilor."
                  error={errors.excerpt}
                >
                  <Textarea rows={3} {...register("excerpt")} />
                </FormField>

                <FormField
                  name="content"
                  label="Conținut"
                  error={errors.content}
                >
                  <Textarea rows={16} {...register("content")} />
                </FormField>
              </div>
            </SectionCard>

            <SectionCard title="Imagine">
              <FormField
                name="imageUrl"
                label="Adresa imaginii"
                optional
                hint="Adresă completă către imaginea articolului."
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
                  htmlFor="news-status"
                >
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="news-status"
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

                <FormField
                  name="publishedAt"
                  label="Data publicării"
                  error={errors.publishedAt}
                >
                  <Input
                    type="datetime-local"
                    defaultValue={toDateTimeLocal(
                      item?.publishedAt ?? new Date().toISOString(),
                    )}
                    onChange={(event) =>
                      setValue(
                        "publishedAt",
                        fromDateTimeLocal(event.target.value),
                        { shouldValidate: true, shouldDirty: true },
                      )
                    }
                  />
                </FormField>

                <FormField
                  name="category"
                  label="Categorie"
                  error={errors.category}
                >
                  <Input {...register("category")} />
                </FormField>
              </div>
            </SectionCard>

            <div className="space-y-4 rounded-xl border bg-background p-5">
              <AdminFormFeedback state={state} />

              <div className="flex flex-col gap-3">
                <AdminSubmitButton
                  state={state}
                  label={item ? "Salvează modificările" : "Creează știrea"}
                  className="w-full"
                />
                <SaveStateIndicator isDirty={isDirty} state={state} />
              </div>

              {item ? (
                <div className="border-t pt-3">
                  <DeleteEntityButton
                    endpoint={`/api/admin/news/${item.id}`}
                    redirectTo="/admin/stiri"
                    title="Ștergi această știre?"
                    successMessage="Știrea a fost ștearsă."
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
