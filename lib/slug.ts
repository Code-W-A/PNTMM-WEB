/** Normalizare de slug cu suport pentru diacriticele românești. */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[țţ]/gi, "t")
    .replace(/[șş]/gi, "s")
    .replace(/ă|â/gi, "a")
    .replace(/î/gi, "i")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}
