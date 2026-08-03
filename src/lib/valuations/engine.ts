import { ImpactDirection, Prisma, ValuationModel } from "@prisma/client";

import { bounded } from "@/lib/utils";

type CompanyPayload = Prisma.CompanyGetPayload<{
  include: {
    metricSnapshots: true;
    events: {
      orderBy: {
        occurredAt: "desc";
      };
      take: 5;
    };
  };
}>;

export type ComputedValuation = {
  model: ValuationModel;
  headline: string;
  currentView: string;
  baseValue: number;
  bearValue: number;
  bullValue: number;
  disagreement: string;
  topRisk: string;
  assumptionsJson: Record<string, string | number>;
  driverSummary: string;
  latestEventIds: string[];
};

function impactScore(direction: ImpactDirection, strength: number) {
  if (direction === "POSITIVE") return strength;
  if (direction === "NEGATIVE") return -strength;
  if (direction === "MIXED") return strength * 0.2;
  return 0;
}

function latestMetricNumber(company: CompanyPayload, key: string, fallback: number) {
  const match = company.metricSnapshots.find((item) => item.metricKey === key);
  return match?.valueNumber ?? fallback;
}

function qualityDcf(company: CompanyPayload): ComputedValuation {
  const growthScore = latestMetricNumber(company, "growth_revenue", 15) / 3;
  const utilizationScore = latestMetricNumber(company, "capacity_utilization", 80) / 12;
  const eventDelta = company.events.reduce((sum, event) => sum + impactScore(event.impactDirection, event.impactStrength), 0);
  const moatScore = company.slug === "cxmt" ? 7.1 : 7.9;
  const capitalReturnScore = bounded(6 + utilizationScore / 2 + eventDelta * 0.03, 4.5, 9.2);
  const freeCashFlowScore = bounded(5.8 + eventDelta * 0.04, 4.2, 8.8);
  const normalizedEarningsScore = bounded(6.1 + growthScore * 0.08 + eventDelta * 0.03, 4.6, 8.8);
  const totalScore = moatScore + capitalReturnScore + freeCashFlowScore + normalizedEarningsScore;
  const baseValue = bounded(totalScore * 3.4, 48, 138);
  const bearValue = bounded(baseValue * 0.74, 35, 108);
  const bullValue = bounded(baseValue * 1.24, 58, 168);

  return {
    model: ValuationModel.BUFFETT_QUALITY_DCF,
    headline: `${company.name} 的质量 DCF 更关注盈利质量、现金流和资本回报`,
    currentView: eventDelta >= 6 ? "中性偏多" : eventDelta <= -6 ? "中性偏空" : "中性",
    baseValue,
    bearValue,
    bullValue,
    disagreement: "巴菲特模型通常比成长模型更保守，因为它优先看自由现金流和回报质量。",
    topRisk: company.events.find((item) => item.impactDirection === "NEGATIVE")?.title ?? "周期下行会先压缩现金流质量。",
    assumptionsJson: {
      moatScore,
      capitalReturnScore,
      normalizedEarningsScore,
      freeCashFlowScore,
      conservativeGrowth: Number((growthScore / 100).toFixed(2)),
      marginOfSafety: 0.25
    },
    driverSummary: "护城河质量、自由现金流、资本回报和最近事件的方向共同驱动内在价值区间。",
    latestEventIds: company.events.map((item) => item.id)
  };
}

function growthPsPeg(company: CompanyPayload): ComputedValuation {
  const revenueGrowth = latestMetricNumber(company, "growth_revenue", 14);
  const utilization = latestMetricNumber(company, "capacity_utilization", 82);
  const eventDelta = company.events.reduce((sum, event) => sum + impactScore(event.impactDirection, event.impactStrength), 0);
  const grossMargin = company.slug === "cxmt" ? 34 : 41;
  const operatingLeverage = bounded(14 + eventDelta * 0.6, 8, 28);
  const penetration = company.slug === "cxmt" ? 11 : 18;
  const psAnchor = bounded(revenueGrowth * 0.22 + grossMargin * 0.6 + eventDelta * 0.8, 36, 148);
  const baseValue = Number(psAnchor.toFixed(1));
  const bearValue = Number((psAnchor * 0.72).toFixed(1));
  const bullValue = Number((psAnchor * 1.28).toFixed(1));

  return {
    model: ValuationModel.GROWTH_PS_PEG,
    headline: `${company.name} 的成长模型更重视收入增速、渗透率和产品升级`,
    currentView: eventDelta >= 6 ? "进攻型中性" : eventDelta <= -6 ? "审慎" : "中性偏多",
    baseValue,
    bearValue,
    bullValue,
    disagreement: "成长模型会高估高景气阶段的弹性，因此常常高于质量 DCF。",
    topRisk: company.events.find((item) => item.eventType === "INDUSTRY_PRICING" && item.impactDirection === "NEGATIVE")?.title ?? "ASP 与扩产节奏错位会直接压缩成长估值。",
    assumptionsJson: {
      revenueGrowth,
      grossMargin,
      operatingLeverage,
      tam: company.slug === "cxmt" ? "China DRAM upgrade" : "Memory platform expansion",
      penetration,
      productUpgrade: company.slug === "cxmt" ? "DDR5 / LPDDR5" : "HBM / server mix",
      marketShareTrend: eventDelta >= 0 ? "improving" : "under pressure"
    },
    driverSummary: "收入增速、毛利率、渗透率和产品升级速度决定成长估值上限。",
    latestEventIds: company.events.map((item) => item.id)
  };
}

export function computeValuations(company: CompanyPayload) {
  return [qualityDcf(company), growthPsPeg(company)];
}
