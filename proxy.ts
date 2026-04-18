import { NextRequest, NextResponse } from "next/server";

console.log("PROXY AKTIV:", process.env.MAINTENANCE_MODE, "NODE_ENV:", process.env.NODE_ENV);

export function proxy(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const bypassToken = process.env.MAINTENANCE_BYPASS_TOKEN;

  const url = req.nextUrl;
  const pathname = url.pathname;

  const allowedPaths = ["/coming-soon", "/favicon.ico", "/robots.txt"];

  const isInternalPath =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");

  if (
    isDev ||
    !maintenanceMode ||
    allowedPaths.includes(pathname) ||
    isInternalPath
  ) {
    return NextResponse.next();
  }

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

  const cookie = req.cookies.get("preview_bypass")?.value;
  if (bypassToken && cookie === bypassToken) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/coming-soon", req.url));
}

export const config = {
  matcher: ["/:path*"],
};