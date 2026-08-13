import { expect, type Locator, type Page } from "@playwright/test"

import { AUTH_HOST, E2E_API_KEY, E2E_PROJECT_ID } from "./e2e-config"

/**
 * Sufix irepetabil pentru sluguri, subiecte și titluri. Testele rulează peste
 * aceeași bază de date, deci fiecare trebuie să își recunoască propriile date.
 */
export function unique(prefix: string): string {
  const stamp = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
  return `${prefix}-${stamp}`
}

/** Valoare pentru `input[type=datetime-local]`, în ora locală. */
export function dateTimeLocal(daysFromNow: number, hour = 10): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  date.setHours(hour, 0, 0, 0)

  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

/**
 * PNG valid de 1x1, construit în memorie. Serverul verifică semnătura binară a
 * fișierului, deci un buffer inventat ar fi respins.
 */
export function onePixelPng(): Buffer {
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  )
}

/** ID token direct de la emulatorul Auth, fără a trece prin browser. */
export async function idTokenFor(
  email: string,
  password: string,
): Promise<string> {
  const response = await fetch(
    `http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${E2E_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  )

  if (!response.ok) {
    throw new Error(`Autentificarea pe emulator a eșuat: ${response.status}`)
  }

  return (await response.json()).idToken as string
}

/** Starea unui cont citită direct din emulator, independent de UI. */
export async function authUserByEmail(email: string): Promise<{
  localId: string
  disabled?: boolean
} | null> {
  const response = await fetch(
    `http://${AUTH_HOST}/identitytoolkit.googleapis.com/v1/projects/${E2E_PROJECT_ID}/accounts:query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer owner",
      },
      body: JSON.stringify({}),
    },
  )

  const body = await response.json()
  const users: Array<{ email: string; localId: string; disabled?: boolean }> =
    body.userInfo ?? []

  return users.find((user) => user.email === email) ?? null
}

export interface ApiResult {
  status: number
  contentType: string
  body: string
}

/**
 * Apel API din interiorul paginii. Cookie-ul de sesiune este marcat `Secure`,
 * iar contextul de cereri al Playwright nu îl trimite peste HTTP; `fetch` din
 * browser îl trimite, exact ca interfața de administrare.
 */
export async function apiFetch(
  page: Page,
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<ApiResult> {
  return page.evaluate(
    async ({ path, init }) => {
      const response = await fetch(path, {
        method: init.method ?? "GET",
        ...(init.body === undefined
          ? {}
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(init.body),
            }),
      })

      return {
        status: response.status,
        contentType: response.headers.get("content-type") ?? "",
        body: await response.text(),
      }
    },
    { path, init },
  )
}

/** Rândul de tabel care conține un text dat. */
export function rowWith(page: Page, text: string): Locator {
  return page.locator("tbody tr").filter({ hasText: text })
}

/** Alege o opțiune dintr-un Select shadcn, care nu este un `<select>` nativ. */
export async function chooseOption(trigger: Locator, option: string) {
  await trigger.click()
  await trigger
    .page()
    .getByRole("option", { name: option, exact: true })
    .click()
}

/** Confirmă un AlertDialog apăsând butonul cerut. */
export async function confirmDialog(page: Page, button: string) {
  const dialog = page.getByRole("alertdialog")
  await expect(dialog).toBeVisible()
  await dialog.getByRole("button", { name: button, exact: true }).click()
  await expect(dialog).toBeHidden()
}

/** Așteaptă un toast cu textul dat. */
export async function expectToast(page: Page, text: string | RegExp) {
  await expect(page.getByText(text).first()).toBeVisible()
}
