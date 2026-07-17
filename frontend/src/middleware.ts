import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
    HOME_ROUTE,
    LOGIN_ROUTE,
    REGISTRATION_ROUTE,
    TOKEN_COOKIE_KEY,
    UNAUTHORIZED_ROUTE,
} from "@/lib/utils/consts";

const PUBLIC_ROUTES = new Set([
    HOME_ROUTE,
    LOGIN_ROUTE,
    REGISTRATION_ROUTE,
    UNAUTHORIZED_ROUTE,
]);

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isPublic = PUBLIC_ROUTES.has(pathname);
    const token = request.cookies.get(TOKEN_COOKIE_KEY)?.value;

    if (!isPublic && !token) {
        const url = request.nextUrl.clone();
        url.pathname = UNAUTHORIZED_ROUTE;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
