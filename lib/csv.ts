export interface CsvColumn<T> {
  header: string
  value: (row: T) => string | number | null | undefined
}

function escapeCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ""

  const text = String(value)

  // Prefixul apostrof neutralizează interpretarea ca formulă în Excel.
  const guarded = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text

  return `"${guarded.replace(/"/g, '""')}"`
}

/**
 * Generare CSV cu BOM UTF-8, ca diacriticele să fie afișate corect în Excel.
 */
export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((column) => escapeCell(column.header)).join(",")
  const body = rows.map((row) =>
    columns.map((column) => escapeCell(column.value(row))).join(","),
  )

  return `\uFEFF${[header, ...body].join("\r\n")}`
}

export function csvResponse(content: string, filename: string): Response {
  return new Response(content, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  })
}
