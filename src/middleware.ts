import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const OPS_ACCESS_COOKIE = "__onto_ops_access";

export function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/ops-console-(.+)$/);
  if (match) {
    const accessKey = process.env.OPS_CONSOLE_ACCESS_KEY ?? "";
    const queryKey = request.nextUrl.searchParams.get("key");
    const cookieKey = request.cookies.get(OPS_ACCESS_COOKIE)?.value;

    if (queryKey && queryKey === accessKey) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.searchParams.delete("key");
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set(OPS_ACCESS_COOKIE, accessKey, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 12
      });
      return response;
    }

    if (!cookieKey || cookieKey !== accessKey) {
      return NextResponse.rewrite(new URL("/404", request.url));
    }

    const rewritten = request.nextUrl.clone();
    rewritten.pathname = `/ops-console/${match[1]}`;
    return NextResponse.rewrite(rewritten);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ops-console-:path*"]
};
