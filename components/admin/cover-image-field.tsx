"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

const ACCEPT = "image/jpeg,image/png,image/webp"

interface CoverImageFieldProps {
  existingUrl?: string
  file: File | null
  removed: boolean
  onFileChange: (file: File | null) => void
  onRemove: () => void
}

export function CoverImageField({
  existingUrl,
  file,
  removed,
  onFileChange,
  onRemove,
}: CoverImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setObjectUrl(null)
      return
    }

    const url = URL.createObjectURL(file)
    setObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const previewUrl = objectUrl ?? (removed ? null : existingUrl)
  const hasImage = Boolean(previewUrl)

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="coverImage"
          className="text-sm font-semibold text-foreground"
        >
          Imagine de copertă
          <span className="ml-1 font-medium text-muted-foreground">
            (opțional)
          </span>
        </label>
        <p
          id="coverImage-hint"
          className="mt-1 text-xs leading-5 text-muted-foreground"
        >
          O singură imagine JPG, PNG sau WebP, maximum 5 MB. Este comprimată
          automat pe server și afișată decupată în format 3:2 pe site și în
          aplicație.
        </p>
      </div>

      {previewUrl ? (
        <div className="overflow-hidden rounded-lg border bg-muted aspect-[3/2]">
          {/* Previzualizare admin: URL local (blob) sau Storage, nu trece prin next/image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Previzualizare copertă"
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <input
        ref={inputRef}
        id="coverImage"
        name="coverImage"
        type="file"
        accept={ACCEPT}
        aria-describedby="coverImage-hint"
        className="flex w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary-foreground"
        onChange={(event) => {
          const next = event.target.files?.[0] ?? null
          onFileChange(next)
        }}
      />

      {hasImage ? (
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => {
            if (inputRef.current) inputRef.current.value = ""
            onRemove()
          }}
        >
          Elimină imaginea
        </Button>
      ) : null}
    </div>
  )
}

export function contentFormData(
  values: Record<string, unknown>,
  file: File | null,
  removeImage: boolean,
): FormData {
  const form = new FormData()

  for (const [key, value] of Object.entries(values)) {
    if (key === "imageUrl" || value === undefined || value === null) continue
    if (typeof value === "boolean") {
      form.append(key, value ? "true" : "false")
    } else {
      form.append(key, String(value))
    }
  }

  if (file) form.append("image", file)
  if (removeImage) form.append("removeImage", "true")

  return form
}
