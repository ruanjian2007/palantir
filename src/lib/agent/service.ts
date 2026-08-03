import { EntityType, Prisma } from "@prisma/client";

import { parseStructuredAgentEvent } from "@/lib/agent/parser";
import { prisma } from "@/lib/prisma";
import { computeValuations } from "@/lib/valuations/engine";

type IngestInput = {
  companySlug: string;
  sourceName: string;
  sourceUrl: string;
  rawText: string;
  occurredAt?: string;
};

async function loadCompanyBundle(companySlug: string) {
  const company = await prisma.company.findUnique({
    where: { slug: companySlug },
    include: {
      metricSnapshots: {
        orderBy: { asOfDate: "desc" }
      },
      events: {
        orderBy: { occurredAt: "desc" },
        take: 5
      }
    }
  });

  if (!company) {
    throw new Error(`Company not found: ${companySlug}`);
  }

  return company;
}

async function persistValuations(companyId: string, latestEventIds: string[]) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      metricSnapshots: {
        orderBy: { asOfDate: "desc" }
      },
      events: {
        orderBy: { occurredAt: "desc" },
        take: 5
      }
    }
  });

  if (!company) {
    throw new Error("Company disappeared during valuation recompute");
  }

  const computed = computeValuations(company);

  await prisma.valuationRun.createMany({
    data: computed.map((item) => ({
      companyId,
      model: item.model,
      headline: item.headline,
      currentView: item.currentView,
      baseValue: item.baseValue,
      bearValue: item.bearValue,
      bullValue: item.bullValue,
      disagreement: item.disagreement,
      topRisk: item.topRisk,
      assumptionsJson: item.assumptionsJson as Prisma.InputJsonValue,
      driverSummary: item.driverSummary,
      latestEventIds: latestEventIds.length ? latestEventIds : item.latestEventIds,
      generatedAt: new Date()
    }))
  });

  return computed;
}

export async function recomputeCompany(companySlug: string) {
  const company = await loadCompanyBundle(companySlug);
  const computed = await persistValuations(company.id, company.events.map((item) => item.id));
  return { company, computed };
}

export async function ingestAgentEvent(input: IngestInput) {
  const company = await loadCompanyBundle(input.companySlug);
  const parsed = await parseStructuredAgentEvent(input.rawText);

  const run = await prisma.agentRun.create({
    data: {
      companyId: company.id,
      status: "PENDING",
      sourceName: input.sourceName,
      sourceUrl: input.sourceUrl,
      rawInput: input.rawText,
      parsedPayload: parsed as Prisma.InputJsonValue,
      summary: "Agent 正在将事件映射为本体对象变化。"
    }
  });

  try {
    const occurredAt = input.occurredAt ? new Date(input.occurredAt) : new Date();
    const event = await prisma.event.create({
      data: {
        companyId: company.id,
        title: parsed.title,
        sourceName: input.sourceName,
        sourceUrl: input.sourceUrl,
        rawText: input.rawText,
        extractedSummary: parsed.extractedSummary,
        eventType: parsed.eventType,
        impactDirection: parsed.impactDirection,
        impactStrength: parsed.impactStrength,
        confidenceLevel: parsed.confidenceLevel,
        occurredAt
      }
    });

    for (const target of parsed.targetLabels) {
      await prisma.eventTarget.create({
        data: {
          eventId: event.id,
          companyId: company.id,
          entityType: (target.entityType as EntityType) ?? EntityType.COMPANY,
          label: target.label,
          changeNote: target.changeNote
        }
      });
    }

    for (const change of parsed.metricChanges) {
      const before = company.metricSnapshots.find((item) => item.metricKey === change.metricKey);
      const snapshot = await prisma.metricSnapshot.create({
        data: {
          companyId: company.id,
          metricGroup: "agent",
          metricKey: change.metricKey,
          metricLabel: change.metricLabel,
          metricValue: change.afterValue,
          valueNumber: change.valueNumber,
          note: change.note,
          asOfDate: occurredAt
        }
      });

      await prisma.agentChange.create({
        data: {
          agentRunId: run.id,
          companyId: company.id,
          entityType:
            change.metricKey === "product_mix"
              ? EntityType.PRODUCT
              : change.metricKey === "capacity_utilization"
                ? EntityType.CAPACITY
                : EntityType.COMPANY,
          entityId: snapshot.id,
          fieldName: change.metricKey,
          beforeValue: before?.metricValue ?? null,
          afterValue: change.afterValue,
          sourceUrl: input.sourceUrl,
          note: change.note
        }
      });
    }

    const valuations = await persistValuations(company.id, [event.id]);

    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "SUCCESS",
        summary: "Agent 已自动入库、生成审计记录，并触发两套估值重算。"
      }
    });

    return {
      runId: run.id,
      eventId: event.id,
      valuations
    };
  } catch (error) {
    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown ingest error",
        summary: "Agent 入库失败。"
      }
    });
    throw error;
  }
}
