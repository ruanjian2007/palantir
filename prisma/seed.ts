import { PrismaClient, ValuationModel } from "@prisma/client";

const prisma = new PrismaClient();

const companies = [
  {
    slug: "cxmt",
    name: "长鑫存储",
    englishName: "ChangXin Memory Technologies",
    ticker: null,
    market: "Private",
    companyType: "PRIMARY",
    region: "中国",
    sector: "存储",
    description: "中国 DRAM 核心样本，受工艺、产能、政策与周期共同驱动。",
    summary: "主研究对象，重点跟踪 DRAM 产能、良率、技术代际与国产替代。",
    investmentThesis: "如果产能爬坡、节点升级与客户认证同步推进，估值弹性主要来自收入质量改善。",
    moatSummary: "本土供应链协同、政策支持与关键客户导入速度构成主要护城河。"
  },
  {
    slug: "micron",
    name: "美光科技",
    englishName: "Micron Technology",
    ticker: "MU",
    market: "NASDAQ",
    companyType: "GLOBAL_PEER",
    region: "美国",
    sector: "存储",
    description: "全球上市 memory pure-play，适合做 DRAM/NAND/HBM 周期参照。",
    summary: "全球周期和毛利弹性的直接锚点。",
    investmentThesis: "HBM 与高附加值产品占比提升决定周期上行阶段的利润弹性。",
    moatSummary: "先进内存工艺、客户关系和产品组合是核心护城河。"
  },
  {
    slug: "sk-hynix",
    name: "SK 海力士",
    englishName: "SK hynix",
    ticker: "000660",
    market: "KRX",
    companyType: "GLOBAL_PEER",
    region: "韩国",
    sector: "存储",
    description: "DRAM 与 HBM 龙头，AI 服务器需求的关键受益者。",
    summary: "高端 DRAM 与 HBM 路线参照系。",
    investmentThesis: "HBM 供需错配与产品升级决定增长上限。",
    moatSummary: "HBM 技术、先进封装和头部客户关系是强护城河。"
  },
  {
    slug: "samsung-electronics",
    name: "三星电子",
    englishName: "Samsung Electronics",
    ticker: "005930",
    market: "KRX",
    companyType: "GLOBAL_PEER",
    region: "韩国",
    sector: "综合科技/存储",
    description: "全球存储供给和技术代际的重要参照，但需要拆半导体分部理解。",
    summary: "供给纪律、技术代际与价格策略参照。",
    investmentThesis: "半导体分部盈利变化对整体估值影响显著。",
    moatSummary: "规模优势、制造能力与生态整合构成护城河。"
  },
  {
    slug: "gigadevice",
    name: "兆易创新",
    englishName: "GigaDevice",
    ticker: "603986",
    market: "SSE",
    companyType: "DOMESTIC_PEER",
    region: "中国",
    sector: "存储/MCU",
    description: "国内上市存储生态样本，用于观察国产替代情绪与估值锚。",
    summary: "国内存储板块估值情绪观察窗口。",
    investmentThesis: "产品结构和国产替代节奏决定估值中枢。",
    moatSummary: "本土客户与产品矩阵是核心优势。"
  },
  {
    slug: "montage",
    name: "澜起科技",
    englishName: "Montage Technology",
    ticker: "688008",
    market: "STAR",
    companyType: "DOMESTIC_PEER",
    region: "中国",
    sector: "服务器内存接口",
    description: "服务器内存接口芯片龙头，是 DDR5 与 AI 服务器需求的重要映射。",
    summary: "服务器内存升级和产业链景气度观察点。",
    investmentThesis: "DDR5 渗透与服务器平台迭代决定成长空间。",
    moatSummary: "标准接口技术和头部客户渗透是核心护城河。"
  }
] as const;

function buildValuation(companySlug: string, model: ValuationModel) {
  if (model === ValuationModel.BUFFETT_QUALITY_DCF) {
    return {
      headline: companySlug === "cxmt" ? "质量 DCF 显示长鑫仍处于能力兑现阶段" : "质量 DCF 显示公司价值取决于盈利质量与现金流确定性",
      currentView: companySlug === "cxmt" ? "中性偏多" : "中性",
      baseValue: companySlug === "cxmt" ? 88 : 74,
      bearValue: companySlug === "cxmt" ? 61 : 56,
      bullValue: companySlug === "cxmt" ? 112 : 91,
      disagreement: "巴菲特模型更看重盈利质量与资本回报，对高景气但现金流弱的阶段更保守。",
      topRisk: companySlug === "cxmt" ? "节点升级和良率兑现慢于预期" : "周期回落导致自由现金流质量弱化",
      assumptionsJson: {
        moatScore: companySlug === "cxmt" ? 7.2 : 7.8,
        capitalReturnScore: companySlug === "cxmt" ? 5.9 : 7.4,
        normalizedEarningsScore: companySlug === "cxmt" ? 6.2 : 7.0,
        freeCashFlowScore: companySlug === "cxmt" ? 5.1 : 7.1,
        capitalAllocationScore: companySlug === "cxmt" ? 6.0 : 7.0,
        conservativeGrowth: companySlug === "cxmt" ? 0.12 : 0.08,
        marginOfSafety: 0.25
      },
      driverSummary: "盈利质量、自由现金流和资本配置是决定区间的核心变量。"
    };
  }

  return {
    headline: companySlug === "cxmt" ? "成长模型显示长鑫的估值弹性主要来自产能与产品升级" : "成长模型重点观察收入增速、毛利率与渗透率",
    currentView: companySlug === "cxmt" ? "进攻型中性" : "中性偏多",
    baseValue: companySlug === "cxmt" ? 96 : 83,
    bearValue: companySlug === "cxmt" ? 68 : 59,
    bullValue: companySlug === "cxmt" ? 134 : 108,
    disagreement: "成长模型对收入增速与产品升级更敏感，因此会高于质量 DCF。",
    topRisk: companySlug === "cxmt" ? "ASP 周期回落与扩产不同步" : "成长兑现速度不及预期",
    assumptionsJson: {
      revenueGrowth: companySlug === "cxmt" ? 0.22 : 0.15,
      grossMargin: companySlug === "cxmt" ? 0.34 : 0.41,
      operatingLeverage: companySlug === "cxmt" ? 0.18 : 0.22,
      tam: companySlug === "cxmt" ? "China DRAM upgrade" : "Global memory and platform expansion",
      penetration: companySlug === "cxmt" ? 0.09 : 0.18,
      productUpgrade: companySlug === "cxmt" ? "DDR5 / LPDDR5" : "HBM / server mix",
      marketShare: companySlug === "cxmt" ? "gaining" : "stable"
    },
    driverSummary: "收入增速、产品升级和市场份额变化共同决定成长估值区间。"
  };
}

async function main() {
  await prisma.agentChange.deleteMany();
  await prisma.agentRun.deleteMany();
  await prisma.valuationRun.deleteMany();
  await prisma.eventTarget.deleteMany();
  await prisma.event.deleteMany();
  await prisma.relationship.deleteMany();
  await prisma.metricSnapshot.deleteMany();
  await prisma.dataSource.deleteMany();
  await prisma.policyConstraint.deleteMany();
  await prisma.capexProgram.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.customerSegment.deleteMany();
  await prisma.fabOrProductionLine.deleteMany();
  await prisma.capacity.deleteMany();
  await prisma.technologyNode.deleteMany();
  await prisma.product.deleteMany();
  await prisma.businessLine.deleteMany();
  await prisma.marketCycle.deleteMany();
  await prisma.company.deleteMany();

  const now = new Date("2026-08-03T09:30:00.000Z");

  for (const item of companies) {
    const company = await prisma.company.create({
      data: {
        slug: item.slug,
        name: item.name,
        englishName: item.englishName,
        ticker: item.ticker,
        market: item.market,
        description: item.description,
        companyType: item.companyType as any,
        region: item.region,
        sector: item.sector,
        summary: item.summary,
        investmentThesis: item.investmentThesis,
        moatSummary: item.moatSummary
      }
    });

    await prisma.businessLine.createMany({
      data: [
        {
          companyId: company.id,
          name: "核心内存业务",
          summary: item.slug === "montage" ? "服务器内存接口相关产品" : "围绕内存代际升级的核心业务",
          revenueWeight: 0.7,
          marginProfile: "中高",
          growthProfile: "受产品升级与行业周期影响"
        },
        {
          companyId: company.id,
          name: "延伸业务",
          summary: "用于承接新产品、平台协同或国产替代机会",
          revenueWeight: 0.3,
          marginProfile: "中等",
          growthProfile: "视新产品渗透率而定"
        }
      ]
    });

    await prisma.product.createMany({
      data: [
        {
          companyId: company.id,
          businessLine: "核心内存业务",
          name: item.slug === "montage" ? "DDR5 内存接口" : "DDR5",
          summary: "用于观察高附加值产品结构变化",
          nodeLabel: item.slug === "cxmt" ? "成熟量产节点向先进节点过渡" : "先进量产",
          lifecycleStage: "放量期",
          aspBand: "中高",
          marginSensitivity: "高",
          customerCoverage: "头部平台客户"
        },
        {
          companyId: company.id,
          businessLine: "核心内存业务",
          name: item.slug === "sk-hynix" ? "HBM" : item.slug === "montage" ? "服务器互连配套" : "LPDDR5",
          summary: "用于观察高景气与技术代际带来的估值弹性",
          nodeLabel: "升级中",
          lifecycleStage: "成长阶段",
          aspBand: "高",
          marginSensitivity: "中高",
          customerCoverage: "高性能或移动端客户"
        }
      ]
    });

    await prisma.technologyNode.create({
      data: {
        companyId: company.id,
        name: item.slug === "cxmt" ? "DRAM 主力节点" : "先进内存节点",
        summary: "观察公司与全球领先玩家的技术代际差距及对良率和成本的影响。",
        maturity: item.slug === "cxmt" ? "爬坡中" : "成熟/升级中",
        industryGap: item.slug === "cxmt" ? "仍有差距，但在追赶" : "处于全球领先梯队或接近领先",
        costEffect: "直接影响单位成本和毛利率中枢",
        yieldEffect: "决定量产兑现速度与周期放大效应"
      }
    });

    await prisma.capacity.create({
      data: {
        companyId: company.id,
        label: item.slug === "cxmt" ? "主力量产产能" : "核心产线产能",
        monthlyWaferK: item.slug === "cxmt" ? 180 : 220,
        utilizationRate: item.slug === "cxmt" ? 0.82 : 0.88,
        yieldRate: item.slug === "cxmt" ? 0.74 : 0.86,
        rampStage: item.slug === "cxmt" ? "扩产+爬坡" : "高利用率运营",
        summary: "跟踪扩产节奏、稼动率和良率能否同步改善。"
      }
    });

    await prisma.fabOrProductionLine.create({
      data: {
        companyId: company.id,
        name: item.slug === "cxmt" ? "长鑫主生产基地" : `${item.name} 关键产线`,
        location: item.region,
        processCapability: "先进内存/平台相关能力",
        equipmentSummary: "关键设备约束与升级节奏直接影响产能兑现",
        launchStage: "运营中",
        summary: "在本体图中承接设备、节点和产能之间的关系。"
      }
    });

    await prisma.customerSegment.createMany({
      data: [
        {
          companyId: company.id,
          name: "服务器 / 云客户",
          demandOutlook: "受 AI 与平台升级驱动，中长期偏强",
          priceSensitivity: "中",
          certificationCycle: "长",
          switchingCost: "高",
          summary: "决定高附加值产品的兑现速度。"
        },
        {
          companyId: company.id,
          name: "消费 / 手机客户",
          demandOutlook: "受消费周期影响较大",
          priceSensitivity: "高",
          certificationCycle: "中",
          switchingCost: "中",
          summary: "更容易放大 ASP 周期与库存变化。"
        }
      ]
    });

    await prisma.supplier.create({
      data: {
        companyId: company.id,
        name: "关键设备与材料供应链",
        category: "设备/材料",
        replaceability: item.slug === "cxmt" ? "有限" : "中等",
        deliveryCycle: "中长",
        geoRisk: item.slug === "cxmt" ? "高" : "中",
        technicalConstraint: "先进设备和材料可得性会限制技术代际升级",
        summary: "供应链约束直接映射到 capex 和技术节点。"
      }
    });

    await prisma.capexProgram.create({
      data: {
        companyId: company.id,
        name: "未来 12-24 个月资本开支计划",
        totalBudgetUsdB: item.slug === "cxmt" ? 9.5 : 12.0,
        timeline: "2026-2027",
        focusArea: "扩产、设备更新、产品升级",
        capacityImpact: "决定未来 2 年收入和折旧曲线",
        summary: "资本开支力度是估值中枢的前置变量。"
      }
    });

    await prisma.policyConstraint.create({
      data: {
        companyId: company.id,
        name: "先进设备与地缘政策约束",
        impactDirection: item.slug === "cxmt" ? "NEGATIVE" : "MIXED",
        severity: item.slug === "cxmt" ? "高" : "中",
        effectiveDate: now,
        durationLabel: "持续观察",
        summary: item.slug === "cxmt" ? "先进设备可得性限制仍是关键外部约束。" : "政策约束更多体现在全球供给与资本开支节奏。"
      }
    });

    await prisma.dataSource.createMany({
      data: [
        {
          companyId: company.id,
          name: `${item.name} 公告/官方资料`,
          sourceType: "official",
          url: `https://example.com/${item.slug}/official`,
          cadence: "weekly"
        },
        {
          companyId: company.id,
          name: `${item.name} 行业新闻追踪`,
          sourceType: "news",
          url: `https://example.com/${item.slug}/news`,
          cadence: "daily"
        }
      ]
    });

    await prisma.metricSnapshot.createMany({
      data: [
        {
          companyId: company.id,
          metricGroup: "states",
          metricKey: "product_mix",
          metricLabel: "主力产品结构",
          metricValue: item.slug === "cxmt" ? "DDR4 -> DDR5 / LPDDR5 升级中" : "高附加值产品占比提升中",
          asOfDate: now,
          note: "用于前台关键状态变量卡片"
        },
        {
          companyId: company.id,
          metricGroup: "states",
          metricKey: "node_gap",
          metricLabel: "主力节点与行业差距",
          metricValue: item.slug === "cxmt" ? "仍有差距，但缩小中" : "处于行业前列",
          asOfDate: now
        },
        {
          companyId: company.id,
          metricGroup: "states",
          metricKey: "capacity_utilization",
          metricLabel: "月产能与稼动率",
          metricValue: item.slug === "cxmt" ? "180K / 82%" : "220K / 88%",
          valueNumber: item.slug === "cxmt" ? 82 : 88,
          unit: "%",
          asOfDate: now
        },
        {
          companyId: company.id,
          metricGroup: "valuation",
          metricKey: "growth_revenue",
          metricLabel: "收入增速假设",
          metricValue: item.slug === "cxmt" ? "22%" : "15%",
          valueNumber: item.slug === "cxmt" ? 22 : 15,
          unit: "%",
          asOfDate: now
        },
        {
          companyId: company.id,
          metricGroup: "valuation",
          metricKey: "quality_fcf",
          metricLabel: "自由现金流质量",
          metricValue: item.slug === "cxmt" ? "中" : "中高",
          asOfDate: now
        }
      ]
    });

    const marketCycle = await prisma.marketCycle.create({
      data: {
        companyId: company.id,
        name: "2026 存储周期观察",
        pricePosition: "复苏中",
        inventoryState: "逐步修复",
        supplyDemandGap: "高附加值领域偏紧",
        competitorPace: "扩产谨慎但仍在推进",
        summary: "价格、库存与扩产节奏共同决定存储估值弹性。"
      }
    });

    const capexEvent = await prisma.event.create({
      data: {
        companyId: company.id,
        title: `${item.name} 资本开支与产能更新`,
        sourceName: "系统种子数据",
        sourceUrl: `https://example.com/${item.slug}/capex`,
        rawText: `${item.name} 的资本开支和产能爬坡将持续影响未来 12-24 个月的估值中枢。`,
        extractedSummary: "扩产节奏、节点升级和良率兑现是当前最重要的状态变化。",
        eventType: "CAPEX",
        impactDirection: item.slug === "cxmt" ? "POSITIVE" : "MIXED",
        impactStrength: 7,
        confidenceLevel: "HIGH",
        occurredAt: now
      }
    });

    await prisma.eventTarget.createMany({
      data: [
        {
          eventId: capexEvent.id,
          companyId: company.id,
          entityType: "CAPACITY",
          label: "核心产能",
          changeNote: "产能与稼动率改善决定收入兑现速度"
        },
        {
          eventId: capexEvent.id,
          companyId: company.id,
          entityType: "CAPEX_PROGRAM",
          label: "资本开支计划",
          changeNote: "资本开支强度决定未来折旧与产能曲线"
        },
        {
          eventId: capexEvent.id,
          companyId: company.id,
          entityType: "MARKET_CYCLE",
          entityId: marketCycle.id,
          label: "行业周期",
          changeNote: "扩产节奏与周期共振会放大盈利弹性"
        }
      ]
    });

    await prisma.relationship.createMany({
      data: [
        {
          companyId: company.id,
          fromEntityType: "TECHNOLOGY_NODE",
          fromLabel: "技术节点",
          toEntityType: "CAPACITY",
          toLabel: "产能兑现",
          strength: 9,
          summary: "技术节点的成熟度直接影响良率和产能释放速度。"
        },
        {
          companyId: company.id,
          fromEntityType: "CAPEX_PROGRAM",
          fromLabel: "资本开支",
          toEntityType: "PRODUCT",
          toLabel: "产品升级",
          strength: 8,
          summary: "资本开支决定高附加值产品的量产能力。"
        },
        {
          companyId: company.id,
          fromEntityType: "MARKET_CYCLE",
          fromLabel: "行业周期",
          toEntityType: "COMPANY",
          toLabel: item.name,
          strength: 8,
          summary: "价格周期和库存变化会同步影响收入与估值。"
        }
      ]
    });

    for (const model of [ValuationModel.BUFFETT_QUALITY_DCF, ValuationModel.GROWTH_PS_PEG]) {
      const valuation = buildValuation(item.slug, model);

      await prisma.valuationRun.create({
        data: {
          companyId: company.id,
          model,
          headline: valuation.headline,
          currentView: valuation.currentView,
          baseValue: valuation.baseValue,
          bearValue: valuation.bearValue,
          bullValue: valuation.bullValue,
          disagreement: valuation.disagreement,
          topRisk: valuation.topRisk,
          assumptionsJson: valuation.assumptionsJson,
          driverSummary: valuation.driverSummary,
          latestEventIds: [capexEvent.id],
          generatedAt: now
        }
      });
    }
  }

  await prisma.agentRun.create({
    data: {
      companyId: (await prisma.company.findUniqueOrThrow({ where: { slug: "cxmt" } })).id,
      status: "SUCCESS",
      sourceName: "系统演示",
      sourceUrl: "https://example.com/cxmt/demo",
      rawInput: "长鑫存储 DDR5 导入进度加快，预计提升高附加值产品占比。",
      parsedPayload: {
        impacts: [
          {
            metricKey: "product_mix",
            afterValue: "DDR5 / LPDDR5 升级加快"
          }
        ]
      },
      summary: "演示 Agent 已自动识别产品结构改善并触发估值重算。"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
