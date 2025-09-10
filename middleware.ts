import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith("/auth")) {
    const invite = url.searchParams.get("invite");
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (token) {
      if (token.invite !== invite) {
        return NextResponse.redirect(new URL("/invite-error", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*"], // only run on /auth/*
};
