import { NextResponse } from "next/server";
import { z } from "zod";

import { env } from "@/lib/env";
import { recomputeCompany } from "@/lib/agent/service";

const schema = z.object({
  companySlug: z.string()
});

function assertHeader(request: Request) {
  if (request.headers.get("x-ops-key") !== env.opsConsoleAccessKey) {
    throw new Error("Unauthorized");
  }
}

export async function POST(request: Request) {
  try {
    assertHeader(request);
    const payload = schema.parse(await request.json());
    const result = await recomputeCompany(payload.companySlug);
    return NextResponse.json({ ok: true, mode: "recompute-valuation", result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
