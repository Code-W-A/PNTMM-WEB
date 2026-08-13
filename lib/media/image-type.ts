/**
 * Detectarea tipului de imagine din conținut, nu din antetul trimis de client.
 * Un `Content-Type` poate fi falsificat; semnătura binară nu.
 */
const SIGNATURES = [
  { mime: "image/jpeg", extension: "jpg", bytes: [0xff, 0xd8, 0xff] },
  {
    mime: "image/png",
    extension: "png",
    bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  },
] as const

export interface DetectedImage {
  mime: string
  extension: string
}

function matches(buffer: Uint8Array, bytes: readonly number[]): boolean {
  return bytes.every((byte, index) => buffer[index] === byte)
}

function isWebp(buffer: Uint8Array): boolean {
  if (buffer.length < 12) return false

  const riff = [0x52, 0x49, 0x46, 0x46]
  const webp = [0x57, 0x45, 0x42, 0x50]

  return (
    matches(buffer, riff) &&
    webp.every((byte, index) => buffer[8 + index] === byte)
  )
}

export function detectImageType(buffer: Uint8Array): DetectedImage | null {
  for (const signature of SIGNATURES) {
    if (matches(buffer, signature.bytes)) {
      return { mime: signature.mime, extension: signature.extension }
    }
  }

  if (isWebp(buffer)) return { mime: "image/webp", extension: "webp" }

  return null
}
