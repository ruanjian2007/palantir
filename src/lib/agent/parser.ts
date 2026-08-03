import { ConfidenceLevel, EventType, ImpactDirection } from "@prisma/client";
import { z } from "zod";

import { env } from "@/lib/env";

const structuredEventSchema = z.object({
  title: z.string(),
  extractedSummary: z.string(),
  eventType: z.nativeEnum(EventType),
  impactDirection: z.nativeEnum(ImpactDirection),
  impactStrength: z.number().int().min(1).max(10),
  confidenceLevel: z.nativeEnum(ConfidenceLevel),
  metricChanges: z.array(
    z.object({
      metricKey: z.string(),
      metricLabel: z.string(),
      afterValue: z.string(),
      valueNumber: z.number().optional(),
      note: z.string()
    })
  ),
  targetLabels: z.array(
    z.object({
      entityType: z.string(),
      label: z.string(),
      changeNote: z.string()
    })
  )
});

export type StructuredAgentEvent = z.infer<typeof structuredEventSchema>;

function inferHeuristic(rawText: string): StructuredAgentEvent {
  const text = rawText.toLowerCase();
  const positive = /(accelerat|improv|expand|获批|通过|放量|增长|涨价|导入|升级|improve|strong)/i.test(rawText);
  const negative = /(delay|restriction|ban|decline|drop|下滑|延迟|限制|制裁|库存高|回落|风险|受阻|受限)/i.test(rawText);
  const hardNegative = /(延迟|限制|制裁|回落|下滑|风险|受阻|受限|restriction|delay|decline|drop)/i.test(rawText);
  const impactDirection =
    hardNegative ? "NEGATIVE" :
    positive && !negative ? "POSITIVE" :
    negative && !positive ? "NEGATIVE" :
    positive && negative ? "MIXED" :
    "NEUTRAL";
  const eventType =
    /policy|restriction|制裁|限制|补贴/.test(text) ? "POLICY" :
    /price|asp|涨价|降价|库存/.test(text) ? "INDUSTRY_PRICING" :
    /capex|扩产|产能|fab|设备/.test(text) ? "CAPEX" :
    /node|ddr5|lpddr|hbm|technology|工艺|节点/.test(text) ? "TECHNOLOGY" :
    /customer|认证|订单|导入/.test(text) ? "CUSTOMER" :
    "COMPANY_UPDATE";
  const metricKey = /ddr5|lpddr|hbm|product/.test(text) ? "product_mix" : /yield|utilization|产能/.test(text) ? "capacity_utilization" : "growth_revenue";
  const metricLabel =
    metricKey === "product_mix" ? "主力产品结构" :
    metricKey === "capacity_utilization" ? "月产能与稼动率" :
    "收入增速假设";

  return {
    title: rawText.slice(0, 60),
    extractedSummary: rawText,
    eventType,
    impactDirection,
    impactStrength: /major|significant|显著|大幅/.test(text) ? 8 : 6,
    confidenceLevel: /official|公告|业绩|财报/.test(text) ? "HIGH" : "MEDIUM",
    metricChanges: [
      {
        metricKey,
        metricLabel,
        afterValue:
          metricKey === "product_mix"
            ? "高附加值产品占比提升"
            : metricKey === "capacity_utilization"
              ? "产能与稼动率改善"
              : "收入弹性改善",
        valueNumber: metricKey === "growth_revenue" ? 18 : undefined,
        note: "由 Agent 根据原始文本自动抽取"
      }
    ],
    targetLabels: [
      {
        entityType: metricKey === "product_mix" ? "PRODUCT" : "CAPACITY",
        label: metricKey === "product_mix" ? "产品结构" : "产能兑现",
        changeNote: "该事件会直接影响估值关键状态变量"
      }
    ]
  };
}

async function inferWithLlm(rawText: string): Promise<StructuredAgentEvent | null> {
  if (!env.agentLlmBaseUrl || !env.agentLlmApiKey) {
    return null;
  }

  const response = await fetch(`${env.agentLlmBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.agentLlmApiKey}`
    },
    body: JSON.stringify({
      model: env.agentLlmModel,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a company valuation ontology parser. Return JSON with title, extractedSummary, eventType, impactDirection, impactStrength, confidenceLevel, metricChanges[], targetLabels[]."
        },
        {
          role: "user",
          content: rawText
        }
      ]
    })
  });

  if (!response.ok) {
    return null;
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    return null;
  }

  try {
    return structuredEventSchema.parse(JSON.parse(content));
  } catch {
    return null;
  }
}

export async function parseStructuredAgentEvent(rawText: string) {
  const llmResult = await inferWithLlm(rawText);
  return llmResult ?? inferHeuristic(rawText);
}
