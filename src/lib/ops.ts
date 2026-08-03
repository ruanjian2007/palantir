import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { env } from "@/lib/env";

export function assertOpsSecret(secret: string) {
  if (secret !== env.opsConsoleSecret) {
    notFound();
  }
}

export function assertOpsHeader() {
  const headerValue = headers().get("x-ops-key");
  if (headerValue !== env.opsConsoleAccessKey) {
    throw new Error("Unauthorized ops request");
  }
}
