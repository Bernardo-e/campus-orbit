import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value;

  // Protect all dashboard and profile routes
  if (
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/profile")) &&
    !userId
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile"],
};
