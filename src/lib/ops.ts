import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";

import { env } from "@/lib/env";

export const OPS_ACCESS_COOKIE = "__onto_ops_access";

export function assertOpsSecret(secret: string) {
  if (secret !== env.opsConsoleSecret) {
    notFound();
  }
}

export async function assertOpsSession() {
  const cookieValue = (await cookies()).get(OPS_ACCESS_COOKIE)?.value;
  if (cookieValue !== env.opsConsoleAccessKey) {
    notFound();
  }
}

export async function assertOpsHeader() {
  const headerValue = (await headers()).get("x-ops-key");
  if (headerValue !== env.opsConsoleAccessKey) {
    throw new Error("Unauthorized ops request");
  }
}
