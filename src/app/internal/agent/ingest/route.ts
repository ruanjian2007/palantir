import { NextResponse } from "next/server";
import { z } from "zod";

import { ingestAgentEvent } from "@/lib/agent/service";
import { env } from "@/lib/env";

const schema = z.object({
  companySlug: z.string(),
  sourceName: z.string(),
  sourceUrl: z.string().url(),
  rawText: z.string().min(10),
  occurredAt: z.string().optional()
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
    const result = await ingestAgentEvent(payload);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 400 });
  }
}
