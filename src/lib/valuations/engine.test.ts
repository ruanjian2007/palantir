import { describe, expect, it } from "vitest";

import { computeValuations } from "@/lib/valuations/engine";

const company = {
  slug: "cxmt",
  name: "长鑫存储",
  metricSnapshots: [
    {
      metricKey: "growth_revenue",
      metricLabel: "收入增速假设",
      metricValue: "22%",
      valueNumber: 22
    },
    {
      metricKey: "capacity_utilization",
      metricLabel: "月产能与稼动率",
      metricValue: "180K / 82%",
      valueNumber: 82
    }
  ],
  events: [
    {
      id: "evt_1",
      title: "DDR5 导入推进",
      eventType: "TECHNOLOGY",
      impactDirection: "POSITIVE",
      impactStrength: 8
    },
    {
      id: "evt_2",
      title: "设备约束仍在",
      eventType: "POLICY",
      impactDirection: "NEGATIVE",
      impactStrength: 4
    }
  ]
} as any;

describe("computeValuations", () => {
  it("returns both valuation models", () => {
    const valuations = computeValuations(company);

    expect(valuations).toHaveLength(2);
    expect(valuations[0].baseValue).toBeGreaterThan(0);
    expect(valuations[1].bullValue).toBeGreaterThan(valuations[1].baseValue);
  });
});
