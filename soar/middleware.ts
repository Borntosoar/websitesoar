import { NextRequest, NextResponse } from "next/server";

const SKIP = ["/access", "/api/access", "/_next", "/favicon"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) return NextResponse.next();
  if (SKIP.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const cookie = req.cookies.get("soar_access");
  if (cookie?.value === sitePassword) return NextResponse.next();

  return NextResponse.redirect(new URL("/access", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|\\.svg$|\\.png$|\\.jpg$|\\.mp4$).*)"],
};
