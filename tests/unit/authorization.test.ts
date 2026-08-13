import type { DecodedIdToken } from "firebase-admin/auth"
import { describe, expect, it } from "vitest"

import { hasAdminClaim } from "@/lib/auth/require-admin"

function token(claims: Record<string, unknown>): DecodedIdToken {
  return { uid: "uid-1", ...claims } as unknown as DecodedIdToken
}

describe("verificarea drepturilor de administrare", () => {
  it("acceptă claim-ul role admin", () => {
    expect(hasAdminClaim(token({ role: "admin" }))).toBe(true)
  })

  it("acceptă claim-ul boolean admin", () => {
    expect(hasAdminClaim(token({ admin: true }))).toBe(true)
  })

  it("respinge un cont autentificat fără drepturi", () => {
    expect(hasAdminClaim(token({}))).toBe(false)
    expect(hasAdminClaim(token({ role: "user" }))).toBe(false)
  })

  it("respinge valorile care doar seamănă cu un claim valid", () => {
    expect(hasAdminClaim(token({ admin: "true" }))).toBe(false)
    expect(hasAdminClaim(token({ role: "Admin" }))).toBe(false)
  })
})
