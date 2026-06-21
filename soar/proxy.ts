import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, accessToken } from "@/lib/access";

// Pre-launch gate (Next 16 "proxy" convention, formerly middleware). When
// SOAR_ACCESS_PASSWORD is unset the gate is OPEN — the same graceful-fallback
// philosophy as the Shopify config: never brick the site by omission. The
// operator opts in to the gate by setting the env var.
export async function proxy(req: NextRequest) {
  const password = process.env.SOAR_ACCESS_PASSWORD;
  if (!password) return NextResponse.next();

  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  if (token && token === (await accessToken(password))) return NextResponse.next();

  const url = req.nextUrl.clone();
  const from = req.nextUrl.pathname + req.nextUrl.search;
  url.pathname = "/access";
  url.search = "";
  if (from && from !== "/") url.searchParams.set("from", from);
  return NextResponse.redirect(url);
}

export const config = {
  // Gate everything except the access page itself, Next internals, and assets.
  matcher: [
    "/((?!access|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
