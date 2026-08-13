import { describe, expect, it } from "vitest"

import { toCsv, type CsvColumn } from "@/lib/csv"
import { detectImageType } from "@/lib/media/image-type"
import { slugify } from "@/lib/slug"

interface Row {
  name: string
  note: string | null
}

const columns: CsvColumn<Row>[] = [
  { header: "Nume", value: (row) => row.name },
  { header: "Observații", value: (row) => row.note },
]

describe("generarea CSV", () => {
  it("include BOM pentru afișarea corectă a diacriticelor", () => {
    expect(toCsv([], columns).startsWith("\uFEFF")).toBe(true)
  })

  it("escapează ghilimelele și separatorii din valori", () => {
    const csv = toCsv([{ name: 'Ion "Popescu"', note: "a, b" }], columns)
    expect(csv).toContain('"Ion ""Popescu"""')
    expect(csv).toContain('"a, b"')
  })

  it("neutralizează valorile interpretabile ca formulă", () => {
    const csv = toCsv([{ name: "=SUM(A1:A2)", note: null }], columns)
    expect(csv).toContain(`"'=SUM(A1:A2)"`)
  })

  it("transformă valorile lipsă în celule goale", () => {
    const csv = toCsv([{ name: "Ana", note: null }], columns)
    expect(csv.split("\r\n")[1]).toBe('"Ana",')
  })
})

describe("detectarea tipului de imagine", () => {
  it("recunoaște JPEG, PNG și WebP după semnătura binară", () => {
    expect(detectImageType(new Uint8Array([0xff, 0xd8, 0xff, 0x00]))?.mime).toBe(
      "image/jpeg",
    )

    expect(
      detectImageType(
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      )?.extension,
    ).toBe("png")

    const webp = new Uint8Array(12)
    webp.set([0x52, 0x49, 0x46, 0x46], 0)
    webp.set([0x57, 0x45, 0x42, 0x50], 8)
    expect(detectImageType(webp)?.mime).toBe("image/webp")
  })

  it("respinge un fișier care nu este imagine, indiferent de extensie", () => {
    const script = new TextEncoder().encode("<?php echo 1; ?>")
    expect(detectImageType(script)).toBeNull()
  })
})

describe("normalizarea slug-urilor", () => {
  it("elimină diacriticele românești", () => {
    expect(slugify("Întâlnire în Cluj despre sănătate")).toBe(
      "intalnire-in-cluj-despre-sanatate",
    )
    expect(slugify("Ședință și propuneri")).toBe("sedinta-si-propuneri")
  })

  it("nu lasă cratime la margini", () => {
    expect(slugify("  --- Comunicat ---  ")).toBe("comunicat")
  })
})
