// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = [
    '/quiz',
    '/result',
    '/generated',
    '/search'
]

// Define public routes that don't require authentication
// const publicRoutes = [
//   '/'
// ]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('accessToken')?.value

    // Check if the current route is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    // Check if the current route is public
    //   const isPublicRoute = publicRoutes.some(route => 
    //     pathname.startsWith(route)
    //   )

    // Redirect to login if trying to access protected route without auth
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/', request.url)
        // loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    //   // Redirect to dashboard if trying to access public route while authenticated
    //   if (isPublicRoute && token && !pathname.startsWith('/')) {
    //     return NextResponse.redirect(new URL('/dashboard', request.url))
    //   }

    return NextResponse.next()
}

// Configure which routes the middleware will run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}