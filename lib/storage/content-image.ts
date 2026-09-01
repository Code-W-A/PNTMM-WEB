import "server-only"

import { randomUUID } from "node:crypto"

import sharp from "sharp"

import { ApiError } from "@/lib/api/http"
import { getAdminBucket } from "@/lib/firebase/admin"
import { detectImageType } from "@/lib/media/image-type"
import { MAX_IMAGE_SIZE_BYTES } from "@/lib/validation/forms"

export const CONTENT_IMAGE_MAX_EDGE = 1280
export const CONTENT_IMAGE_WEBP_QUALITY = 72

export type ContentImageKind = "news" | "events"

export interface UploadedContentImage {
  path: string
  url: string
}

/**
 * O singură imagine de copertă, comprimată pe server. Originalul nu se
 * păstrează: WebP la 1280px reduce storage-ul și egress-ul Firebase.
 */
export async function compressContentImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize(CONTENT_IMAGE_MAX_EDGE, CONTENT_IMAGE_MAX_EDGE, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: CONTENT_IMAGE_WEBP_QUALITY, effort: 4 })
    .toBuffer()
}

export async function prepareContentImage(file: File): Promise<Buffer> {
  if (file.size === 0) {
    throw new ApiError(400, "invalid_file", "Fișierul selectat este gol.")
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new ApiError(400, "file_too_large", "Imaginea poate avea maximum 5 MB.")
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  if (!detectImageType(buffer)) {
    throw new ApiError(
      400,
      "invalid_file_type",
      "Folosiți o imagine JPG, PNG sau WebP.",
    )
  }

  try {
    return await compressContentImage(buffer)
  } catch {
    throw new ApiError(400, "invalid_file", "Imaginea nu a putut fi procesată.")
  }
}

function publicObjectUrl(bucketName: string, path: string, token: string) {
  const encodedPath = encodeURIComponent(path)
  const emulatorHost = process.env.FIREBASE_STORAGE_EMULATOR_HOST

  if (emulatorHost) {
    return `http://${emulatorHost}/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${token}`
  }

  return `https://storage.googleapis.com/${bucketName}/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`
}

/**
 * Încarcă coperta prin Admin SDK. Numele fișierului include un UUID ca URL-ul
 * să se schimbe la fiecare înlocuire — altfel Cache-Control immutable ar
 * arăta imaginea veche.
 */
export async function uploadContentImage(
  kind: ContentImageKind,
  entityId: string,
  file: File,
): Promise<UploadedContentImage> {
  const webp = await prepareContentImage(file)
  const path = `content/${kind}/${entityId}/${randomUUID()}.webp`
  const token = randomUUID()
  const bucket = getAdminBucket()
  const object = bucket.file(path)

  await object.save(webp, {
    contentType: "image/webp",
    resumable: false,
    metadata: {
      cacheControl: "public, max-age=31536000, immutable",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  })

  try {
    await object.makePublic()
  } catch {
    // Emulatorul Storage nu aplică ACL public; URL-ul cu token rămâne valid.
  }

  return {
    path,
    url: publicObjectUrl(bucket.name, path, token),
  }
}

export async function deleteContentImage(path: string): Promise<void> {
  if (!path.startsWith("content/")) return

  await getAdminBucket().file(path).delete({ ignoreNotFound: true })
}
