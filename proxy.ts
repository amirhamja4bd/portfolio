import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const res = NextResponse.next();
  try {
    const cookie = request.cookies.get("visitor-id");
    if (!cookie) {
      // Use Web Crypto's randomUUID when available (Edge runtime), otherwise fall
      // back to Node's crypto.randomUUID via a polyfill. We avoid importing the
      // Node 'crypto' module in this file because Next edge runtime doesn't
      // support it.
      const uuid = (globalThis as any).crypto?.randomUUID?.() ?? undefined;
      res.cookies.set(
        "visitor-id",
        uuid || String(Date.now()) + Math.random(),
        {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 365, // 1 year
        }
      );
    }
  } catch (e) {
    // If cookies are not available or error occurs, do not block the request
    // middleware should be fast and non-blocking.
    console.warn("middleware: failed to ensure visitor-id cookie", e);
  }
  return res;
}

export const config = {
  matcher: ["/", "/blogs/:path*", "/api/:path*"],
};
