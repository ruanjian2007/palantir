"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { assertOpsSecret, assertOpsSession } from "@/lib/ops";
import { ingestAgentEvent, recomputeCompany } from "@/lib/agent/service";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function ingestAction(formData: FormData) {
  const secret = getString(formData, "secret");
  assertOpsSecret(secret);
  await assertOpsSession();
  await ingestAgentEvent({
    companySlug: getString(formData, "companySlug"),
    sourceName: getString(formData, "sourceName"),
    sourceUrl: getString(formData, "sourceUrl"),
    rawText: getString(formData, "rawText"),
    occurredAt: getString(formData, "occurredAt") || undefined
  });
  revalidatePath("/");
  revalidatePath(`/companies/${getString(formData, "companySlug")}`);
  revalidatePath("/agent-runs");
  revalidatePath(`/valuations/${getString(formData, "companySlug")}`);
}

export async function recomputeAction(formData: FormData) {
  const secret = getString(formData, "secret");
  assertOpsSecret(secret);
  await assertOpsSession();
  const slug = getString(formData, "companySlug");
  await recomputeCompany(slug);
  revalidatePath("/");
  revalidatePath(`/companies/${slug}`);
  revalidatePath(`/valuations/${slug}`);
}

export async function addDataSourceAction(formData: FormData) {
  const secret = getString(formData, "secret");
  assertOpsSecret(secret);
  await assertOpsSession();
  const slug = getString(formData, "companySlug");
  const company = await prisma.company.findUniqueOrThrow({ where: { slug } });
  await prisma.dataSource.create({
    data: {
      companyId: company.id,
      name: getString(formData, "name"),
      sourceType: getString(formData, "sourceType"),
      url: getString(formData, "url"),
      cadence: getString(formData, "cadence"),
      notes: getString(formData, "notes")
    }
  });
  revalidatePath(`/companies/${slug}`);
}

export async function addMetricSnapshotAction(formData: FormData) {
  const secret = getString(formData, "secret");
  assertOpsSecret(secret);
  await assertOpsSession();
  const slug = getString(formData, "companySlug");
  const company = await prisma.company.findUniqueOrThrow({ where: { slug } });
  await prisma.metricSnapshot.create({
    data: {
      companyId: company.id,
      metricGroup: getString(formData, "metricGroup"),
      metricKey: getString(formData, "metricKey"),
      metricLabel: getString(formData, "metricLabel"),
      metricValue: getString(formData, "metricValue"),
      valueNumber: (() => {
        const raw = getString(formData, "valueNumber");
        return raw ? Number(raw) : null;
      })(),
      unit: getString(formData, "unit") || null,
      note: getString(formData, "note") || null,
      asOfDate: new Date(getString(formData, "asOfDate") || new Date().toISOString())
    }
  });
  revalidatePath(`/companies/${slug}`);
}
