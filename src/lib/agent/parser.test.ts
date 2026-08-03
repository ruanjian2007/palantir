import { describe, expect, it } from "vitest";

import { parseStructuredAgentEvent } from "@/lib/agent/parser";

describe("parseStructuredAgentEvent", () => {
  it("maps positive DDR5 text into a technology/customer style event", async () => {
    const parsed = await parseStructuredAgentEvent("长鑫存储 DDR5 导入加快，预计高附加值产品占比提升。");

    expect(parsed.impactDirection).toBe("POSITIVE");
    expect(parsed.metricChanges[0]?.metricKey).toBe("product_mix");
    expect(parsed.targetLabels.length).toBeGreaterThan(0);
  });

  it("maps restriction text into a negative policy event", async () => {
    const parsed = await parseStructuredAgentEvent("出口限制升级，先进设备到位延迟，可能影响产能爬坡。");

    expect(parsed.eventType).toBe("POLICY");
    expect(parsed.impactDirection).toBe("NEGATIVE");
  });
});
