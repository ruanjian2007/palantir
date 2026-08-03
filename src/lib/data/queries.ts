import { prisma } from "@/lib/prisma";

export async function getHomePageData() {
  const [companies, recentEvents, recentRuns] = await Promise.all([
    prisma.company.findMany({
      include: {
        valuationRuns: {
          orderBy: { generatedAt: "desc" },
          take: 2
        },
        metricSnapshots: {
          orderBy: { asOfDate: "desc" },
          take: 4
        }
      },
      orderBy: [{ companyType: "asc" }, { name: "asc" }]
    }),
    prisma.event.findMany({
      include: {
        company: true
      },
      orderBy: { occurredAt: "desc" },
      take: 8
    }),
    prisma.agentRun.findMany({
      include: {
        company: true
      },
      orderBy: { createdAt: "desc" },
      take: 6
    })
  ]);

  return { companies, recentEvents, recentRuns };
}

export async function getCompanyPageData(slug: string) {
  return prisma.company.findUnique({
    where: { slug },
    include: {
      businessLines: true,
      products: true,
      technologyNodes: true,
      capacities: true,
      fabs: true,
      customerSegments: true,
      suppliers: true,
      capexPrograms: true,
      policyConstraints: true,
      metricSnapshots: {
        orderBy: [{ asOfDate: "desc" }, { createdAt: "desc" }]
      },
      events: {
        include: {
          targets: true
        },
        orderBy: { occurredAt: "desc" }
      },
      relationships: {
        orderBy: { strength: "desc" }
      },
      valuationRuns: {
        orderBy: { generatedAt: "desc" }
      },
      agentRuns: {
        include: {
          changes: true
        },
        orderBy: { createdAt: "desc" },
        take: 6
      },
      dataSources: true
    }
  });
}

export async function getComparePageData() {
  return prisma.company.findMany({
    include: {
      metricSnapshots: {
        orderBy: { asOfDate: "desc" },
        take: 6
      },
      valuationRuns: {
        orderBy: { generatedAt: "desc" },
        take: 2
      }
    },
    orderBy: [{ companyType: "asc" }, { name: "asc" }]
  });
}

export async function getAgentRunsPageData() {
  return prisma.agentRun.findMany({
    include: {
      company: true,
      changes: true
    },
    orderBy: { createdAt: "desc" }
  });
}
