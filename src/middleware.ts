// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes (base paths)
const protectedRoutes = [
    '/quiz',
    '/result',
    '/generated',
    '/search',
]

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl
    const token = request.cookies.get('accessToken')?.value

    // 1. Skip Next.js internal RSC/data/prefetch requests
    if (
        searchParams.has('_rsc') ||                       // React Server Component requests
        request.headers.has('next-router-prefetch') ||    // Prefetch requests
        request.headers.has('rsc')                        // Some RSC streaming headers
    ) {
        return NextResponse.next()
    }

    // 2. Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    )

    // 3. Redirect to login if protected and no token
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next()
}

// Configure matcher
export const config = {
    matcher: [
        // Match everything except:
        // - _next/static (static files)
        // - _next/image (image optimization)
        // - favicon and public assets
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
