import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth/server";

const publicRoutes = ["/sign-in", "/sign-up"];

export default async function  middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let public routes pass through
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Get session safely (IMPORTANT: header-based)
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};