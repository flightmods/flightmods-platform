console.log("PROXY AKTIV");
import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const bypassToken = process.env.MAINTENANCE_BYPASS_TOKEN;

  const url = req.nextUrl;
  const pathname = url.pathname;

  const allowedPaths = ["/coming-soon", "/favicon.ico"];

  const isInternalPath =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");

  if (!maintenanceMode || allowedPaths.includes(pathname) || isInternalPath) {
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};