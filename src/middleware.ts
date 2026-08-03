import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/ops-console-(.+)$/);
  if (match) {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = `/ops-console/${match[1]}`;
    return NextResponse.rewrite(rewritten);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ops-console-:path*"]
};
