import { describe, expect, it } from "vitest"

import { mobileRegistrationId } from "@/services/mobile/event-registrations"

describe("înscrierea mobilă idempotentă", () => {
  it("produce același document pentru același cont și eveniment", () => {
    expect(mobileRegistrationId("event-1", "user-1")).toBe(
      mobileRegistrationId("event-1", "user-1"),
    )
  })

  it("separă evenimentele și conturile diferite", () => {
    expect(mobileRegistrationId("event-1", "user-1")).not.toBe(
      mobileRegistrationId("event-2", "user-1"),
    )
    expect(mobileRegistrationId("event-1", "user-1")).not.toBe(
      mobileRegistrationId("event-1", "user-2"),
    )
  })
})
