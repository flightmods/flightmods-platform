import { NextRequest, NextResponse } from "next/server";

console.log("PROXY AKTIV:", process.env.MAINTENANCE_MODE);

export function proxy(req: NextRequest) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const bypassToken = process.env.MAINTENANCE_BYPASS_TOKEN;

  const url = req.nextUrl;
  const pathname = url.pathname;

  const allowedPaths = ["/coming-soon", "/favicon.ico", "/robots.txt"];

  const isInternalPath =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");

  // Wenn Maintenance aus ODER erlaubter Pfad → normal weiter
  if (!maintenanceMode || allowedPaths.includes(pathname) || isInternalPath) {
    return NextResponse.next();
  }

  // Preview Token über URL (?preview=xyz)
  const previewToken = url.searchParams.get("preview");

  if (bypassToken && previewToken === bypassToken) {
    const response = NextResponse.next();
    response.cookies.set("preview_bypass", bypassToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    return response;
  }

  // Cookie prüfen (wenn schon freigeschaltet)
  const cookie = req.cookies.get("preview_bypass")?.value;
  if (bypassToken && cookie === bypassToken) {
    return NextResponse.next();
  }

  // Alles andere → Coming Soon
  return NextResponse.redirect(new URL("/coming-soon", req.url));
}

export const config = {
  matcher: ["/:path*"],
};