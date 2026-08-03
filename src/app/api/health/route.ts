import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "onto.romaapi.com",
    now: new Date().toISOString()
  });
}
