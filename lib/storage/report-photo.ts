import "server-only"

import { randomUUID } from "node:crypto"

import { ApiError } from "@/lib/api/http"
import { getAdminBucket } from "@/lib/firebase/admin"
import { detectImageType } from "@/lib/media/image-type"
import { MAX_IMAGE_SIZE_BYTES } from "@/lib/validation/forms"

/**
 * Încarcă fotografia unei sesizări prin Admin SDK. Nu există upload direct din
 * client: bucket-ul refuză integral accesul clientului, iar numele fișierului
 * este generat server-side, niciodată preluat de la utilizator.
 */
export async function uploadReportPhoto(
  reportId: string,
  file: File,
): Promise<string> {
  if (file.size === 0) {
    throw new ApiError(400, "invalid_file", "Fișierul selectat este gol.")
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new ApiError(400, "file_too_large", "Imaginea poate avea maximum 5 MB.")
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const detected = detectImageType(buffer)

  if (!detected) {
    throw new ApiError(
      400,
      "invalid_file_type",
      "Folosiți o imagine JPG, PNG sau WebP.",
    )
  }

  const path = `reports/${reportId}/${randomUUID()}.${detected.extension}`

  await getAdminBucket().file(path).save(buffer, {
    contentType: detected.mime,
    resumable: false,
    metadata: { cacheControl: "private, max-age=0, no-store" },
  })

  return path
}

/**
 * URL temporar pentru vizualizarea fotografiei în panoul de administrare.
 * Fișierul rămâne privat; linkul expiră după intervalul specificat.
 */
export async function createReportPhotoUrl(
  path: string,
  expiresInMinutes = 15,
): Promise<string> {
  const [url] = await getAdminBucket()
    .file(path)
    .getSignedUrl({
      action: "read",
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    })

  return url
}

export async function deleteReportPhoto(path: string): Promise<void> {
  await getAdminBucket().file(path).delete({ ignoreNotFound: true })
}
