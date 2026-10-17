import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const requiredKeys = ["DATABASE_URL", "OPS_CONSOLE_SECRET", "OPS_CONSOLE_ACCESS_KEY"] as const;

describe("required deployment credentials", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("DATABASE_URL", "postgresql://test:test@localhost/test");
    vi.stubEnv("OPS_CONSOLE_SECRET", "test-path-secret");
    vi.stubEnv("OPS_CONSOLE_ACCESS_KEY", "test-access-secret");
  });
  afterEach(() => vi.unstubAllEnvs());

  for (const key of requiredKeys) {
    it(`fails closed when ${key} is missing`, async () => {
      delete process.env[key];
      await expect(import("./env")).rejects.toThrow(`Missing required env: ${key}`);
    });
  }

  it("uses explicitly configured credentials", async () => {
    const { env } = await import("./env");
    expect(env.opsConsoleSecret).toBe("test-path-secret");
    expect(env.opsConsoleAccessKey).toBe("test-access-secret");
  });
});
