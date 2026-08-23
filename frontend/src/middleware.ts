import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MURAI_PAGE_ROUTES: Record<string, string> = {
  "/": "/murai/index.html",
  "/shop": "/murai/shop.html",
  "/about": "/murai/about.html",
  "/contact": "/murai/contact.html",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const muraiPage = MURAI_PAGE_ROUTES[pathname];
  if (muraiPage) {
    return NextResponse.rewrite(new URL(muraiPage, request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|dashboard-assets|murai).*)"],
};
