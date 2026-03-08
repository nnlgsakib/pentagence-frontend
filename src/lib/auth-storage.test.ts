import { describe, expect, it } from "vitest";
import {
  clearStoredUser,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  setStoredUser,
  setTokens,
} from "@/lib/auth-storage";

describe("auth-storage", () => {
  it("stores auth values in session storage and can clear them", () => {
    clearTokens();
    clearStoredUser();

    setTokens("access", "refresh");
    setStoredUser({ id: "u-1", email: "user@example.com", role: "user" });

    expect(getAccessToken()).toBe("access");
    expect(getRefreshToken()).toBe("refresh");
    expect(getStoredUser()).toEqual({ id: "u-1", email: "user@example.com", role: "user" });

    clearTokens();
    clearStoredUser();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });
});
