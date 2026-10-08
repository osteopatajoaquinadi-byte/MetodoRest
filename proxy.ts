import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PRO_COOKIE, verifyProToken } from "./app/lib/profesional-session";

// Protege el acceso profesional: todo /profesional excepto la página de acceso.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/profesional/acceso") return NextResponse.next();

  const session = verifyProToken(request.cookies.get(PRO_COOKIE)?.value);
  if (!session) {
    const url = new URL("/profesional/acceso", request.url);
    if (pathname !== "/profesional") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profesional", "/profesional/:path*"],
};
