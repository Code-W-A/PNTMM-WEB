import { afterEach, describe, expect, it, vi } from "vitest"
import sharp from "sharp"

import { ApiError } from "@/lib/api/http"
import {
  CONTENT_IMAGE_MAX_EDGE,
  compressContentImage,
  deleteContentImage,
  prepareContentImage,
  uploadContentImage,
} from "@/lib/storage/content-image"

const { save, makePublic, removeObject } = vi.hoisted(() => ({
  save: vi.fn(),
  makePublic: vi.fn(),
  removeObject: vi.fn(),
}))

vi.mock("@/lib/firebase/admin", () => ({
  getAdminBucket: () => ({
    name: "demo.appspot.com",
    file: () => ({
      save: (...args: unknown[]) => save(...args),
      makePublic: () => makePublic(),
      delete: (options: unknown) => removeObject(options),
    }),
  }),
}))

async function jpegBuffer(width = 2000, height = 1200) {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 24, g: 48, b: 96 },
    },
  })
    .jpeg({ quality: 90 })
    .toBuffer()
}

async function expectApiCode(run: () => Promise<unknown>, code: string) {
  try {
    await run()
    throw new Error("trebuia să eșueze")
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).code).toBe(code)
  }
}

describe("comprimarea imaginilor de copertă", () => {
  it("transformă un JPEG mare într-un WebP mai mic, în limita de 1280px", async () => {
    const source = await jpegBuffer()
    const compressed = await compressContentImage(source)
    const metadata = await sharp(compressed).metadata()

    expect(compressed.length).toBeLessThan(source.length)
    expect(compressed.subarray(0, 4).toString("ascii")).toBe("RIFF")
    expect(compressed.subarray(8, 12).toString("ascii")).toBe("WEBP")
    expect(metadata.format).toBe("webp")
    expect(
      Math.max(metadata.width ?? 0, metadata.height ?? 0),
    ).toBeLessThanOrEqual(CONTENT_IMAGE_MAX_EDGE)
  })

  it("respinge un fișier care nu este imagine", async () => {
    const file = new File([Buffer.from("nu-este-o-imagine")], "note.txt", {
      type: "text/plain",
    })

    await expectApiCode(() => prepareContentImage(file), "invalid_file_type")
  })

  it("respinge un fișier gol", async () => {
    const file = new File([], "gol.jpg", { type: "image/jpeg" })

    await expectApiCode(() => prepareContentImage(file), "invalid_file")
  })
})

describe("încărcarea și ștergerea în Storage", () => {
  afterEach(() => {
    save.mockReset()
    makePublic.mockReset()
    removeObject.mockReset()
  })

  it("salvează un WebP public sub content/{kind}/{id}/", async () => {
    save.mockResolvedValue(undefined)
    makePublic.mockResolvedValue(undefined)

    const file = new File([await jpegBuffer(800, 600)], "coperta.jpg", {
      type: "image/jpeg",
    })
    const uploaded = await uploadContentImage("news", "articol-1", file)

    expect(uploaded.path).toMatch(/^content\/news\/articol-1\/.+\.webp$/)
    expect(uploaded.url).toContain("storage.googleapis.com/demo.appspot.com/")
    expect(save).toHaveBeenCalledOnce()
    expect(makePublic).toHaveBeenCalledOnce()

    const [body, options] = save.mock.calls[0] as [
      Buffer,
      { contentType: string; metadata: { cacheControl: string } },
    ]
    expect(options.contentType).toBe("image/webp")
    expect(options.metadata.cacheControl).toContain("immutable")
    expect(await sharp(body).metadata()).toMatchObject({ format: "webp" })
  })

  it("șterge doar obiectele din content/", async () => {
    removeObject.mockResolvedValue(undefined)

    await deleteContentImage("content/events/evt-1/cover.webp")
    expect(removeObject).toHaveBeenCalledWith({ ignoreNotFound: true })

    removeObject.mockClear()
    await deleteContentImage("reports/evt-1/photo.jpg")
    expect(removeObject).not.toHaveBeenCalled()
  })
})
