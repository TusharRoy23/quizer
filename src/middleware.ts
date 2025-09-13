// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
    '/quiz',
    '/result',
    '/generated',
    '/search',
]

// List of paths that should never be protected
const publicPaths = [
    '/',
    // '/login',
    // '/register',
    // '/api/auth',
    // '/api/public',
]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('accessToken')?.value

    // Skip all internal Next.js requests and static files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/_vercel') ||
        pathname.startsWith('/api/_next') ||
        pathname.match(/\.(ico|svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2)$/) ||
        request.headers.get('x-middleware-preflight') ||
        request.headers.get('x-nextjs-data')
    ) {
        return NextResponse.next()
    }

    // Skip public paths
    const isPublicPath = publicPaths.some(path =>
        pathname === path || pathname.startsWith(`${path}/`)
    )

    if (isPublicPath) {
        return NextResponse.next()
    }

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    )

    // Redirect to login if protected and no token
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

// Only run middleware on protected routes
export const config = {
    matcher: [
        '/quiz/:path*',
        '/result/:path*',
        '/generated/:path*',
        '/search/:path*',
    ],
}