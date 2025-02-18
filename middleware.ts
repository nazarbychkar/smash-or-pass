import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = ["/profile"];
const publicRoutes = ["/register", "/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookieSession = (await cookies()).get("session")?.value;
  const session = await decrypt(cookieSession);

  // TODO: i don't understand. when you have session and it is if !session it redirects to /, but it must be staying. ugh my head is messy.
  if (isProtectedRoute && session?.usedId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next()
}
