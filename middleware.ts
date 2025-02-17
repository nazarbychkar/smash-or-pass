import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = ["/profile"];
const publicRoutes = ["/register"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookieSession = (await cookies()).get("session")?.value;
    const session = await decrypt(cookieSession);

    if (isProtectedRoute && !session?.usedId) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL("/profile", req.url));
    }

    return NextResponse.next();
}
